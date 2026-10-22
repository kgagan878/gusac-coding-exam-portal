const ExamAttempt = require('../models/ExamAttempt');
const Question = require('../models/Question');
const Setting = require('../models/Setting');

const formatTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// POST /api/exams/start
const startExam = async (req, res) => {
  try {
    const userId = req.user._id;
    const config = await Setting.getConfig();
    const durationMinutes = config.durationMinutes || 40;

    // Check if already completed
    const completedAttempt = await ExamAttempt.findOne({ userId, status: 'completed' });
    if (completedAttempt) {
      return res.status(200).json({
        alreadyCompleted: true,
        attemptId: completedAttempt._id,
        totalScore: completedAttempt.totalScore,
        correctCount: completedAttempt.correctCount,
        incorrectCount: completedAttempt.incorrectCount,
        unansweredCount: completedAttempt.unansweredCount,
        timeTaken: completedAttempt.timeTaken,
        message: 'Exam has already been submitted and completed.',
      });
    }

    // Check if there is an in-progress attempt
    let attempt = await ExamAttempt.findOne({ userId, status: 'in-progress' });
    const serverNow = new Date();

    if (attempt) {
      // Check if time expired
      const expiryTime = new Date(attempt.startTime.getTime() + attempt.duration * 60 * 1000);
      if (serverNow > expiryTime) {
        // Auto-finalize
        return await finalizeAttempt(attempt, expiryTime, res);
      }

      // Resume in-progress attempt
      const remainingSeconds = Math.max(0, Math.floor((expiryTime.getTime() - serverNow.getTime()) / 1000));
      return res.status(200).json({
        attemptId: attempt._id,
        startTime: attempt.startTime,
        duration: attempt.duration,
        serverNow,
        remainingSeconds,
        answers: attempt.answers,
        message: 'Resuming active exam attempt.',
      });
    }

    // Create new attempt
    attempt = await ExamAttempt.create({
      userId,
      startTime: serverNow,
      duration: durationMinutes,
      status: 'in-progress',
      answers: [],
      totalScore: 0,
    });

    const remainingSeconds = durationMinutes * 60;

    return res.status(201).json({
      attemptId: attempt._id,
      startTime: attempt.startTime,
      duration: attempt.duration,
      serverNow,
      remainingSeconds,
      answers: [],
      message: 'Exam started successfully.',
    });
  } catch (error) {
    console.error('Start exam error:', error);
    return res.status(500).json({ message: 'Failed to start exam', error: error.message });
  }
};

// GET /api/exams/status
const getExamStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const serverNow = new Date();

    const attempt = await ExamAttempt.findOne({ userId }).sort({ createdAt: -1 });
    if (!attempt) {
      return res.status(404).json({ message: 'No exam attempt found.' });
    }

    const expiryTime = new Date(attempt.startTime.getTime() + attempt.duration * 60 * 1000);
    const remainingSeconds = Math.max(0, Math.floor((expiryTime.getTime() - serverNow.getTime()) / 1000));

    // If active but time has reached 0, auto-submit
    if (attempt.status === 'in-progress' && remainingSeconds <= 0) {
      return await finalizeAttempt(attempt, expiryTime, res);
    }

    return res.status(200).json({
      attemptId: attempt._id,
      status: attempt.status,
      startTime: attempt.startTime,
      duration: attempt.duration,
      serverNow,
      remainingSeconds: attempt.status === 'completed' ? 0 : remainingSeconds,
      answers: attempt.answers,
      totalScore: attempt.totalScore,
      correctCount: attempt.correctCount,
      incorrectCount: attempt.incorrectCount,
      unansweredCount: attempt.unansweredCount,
      timeTaken: attempt.timeTaken,
    });
  } catch (error) {
    console.error('Get exam status error:', error);
    return res.status(500).json({ message: 'Failed to fetch exam status', error: error.message });
  }
};

// POST /api/exams/save-answer (Auto-save student's response or review mark)
const saveAnswer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId, selectedOption, isMarkedForReview, code, language } = req.body;

    if (!questionId) {
      return res.status(400).json({ message: 'questionId is required.' });
    }

    const attempt = await ExamAttempt.findOne({ userId, status: 'in-progress' });
    if (!attempt) {
      return res.status(403).json({ message: 'No active exam attempt found or exam already completed.' });
    }

    // Check timer expiry
    const serverNow = new Date();
    const expiryTime = new Date(attempt.startTime.getTime() + attempt.duration * 60 * 1000);
    if (serverNow > expiryTime) {
      await finalizeAttempt(attempt, expiryTime);
      return res.status(403).json({ message: 'Exam deadline has passed. Answers can no longer be saved.' });
    }

    // Find existing answer
    const existingIdx = attempt.answers.findIndex(
      (a) => a.questionId.toString() === questionId.toString()
    );

    if (existingIdx > -1) {
      if (selectedOption !== undefined) {
        attempt.answers[existingIdx].selectedOption = selectedOption;
      }
      if (isMarkedForReview !== undefined) {
        attempt.answers[existingIdx].isMarkedForReview = isMarkedForReview;
      }
      if (code !== undefined) {
        attempt.answers[existingIdx].code = code;
      }
      if (language !== undefined) {
        attempt.answers[existingIdx].language = language;
      }
      attempt.answers[existingIdx].answeredAt = serverNow;
    } else {
      attempt.answers.push({
        questionId,
        selectedOption: selectedOption || null,
        code: code || '',
        language: language || 'java',
        isMarkedForReview: !!isMarkedForReview,
        answeredAt: serverNow,
      });
    }

    await attempt.save();

    return res.status(200).json({
      success: true,
      message: 'Answer saved',
      answers: attempt.answers,
    });
  } catch (error) {
    console.error('Save answer error:', error);
    return res.status(500).json({ message: 'Failed to save answer', error: error.message });
  }
};

// Helper to grade and finalize an attempt (150 Points Total)
const finalizeAttempt = async (attempt, endTime, res = null) => {
  const diffSeconds = Math.max(1, Math.floor((endTime.getTime() - attempt.startTime.getTime()) / 1000));
  attempt.endTime = endTime;
  attempt.timeTaken = formatTime(diffSeconds);
  attempt.status = 'completed';

  // Fetch all questions
  const questions = await Question.find({});
  const qMap = new Map();
  questions.forEach((q) => qMap.set(q._id.toString(), q));

  let correct = 0;
  let incorrect = 0;
  let mcqScore = 0;
  let codingScore = 0;

  // Grade each question answer
  attempt.answers.forEach((ans) => {
    const q = qMap.get(ans.questionId.toString());
    if (q) {
      if (q.section === 'A') {
        // Section A: MCQs (5 points each, 20 questions = max 100)
        if (ans.selectedOption && ans.selectedOption.trim() === q.correctOption.trim()) {
          ans.isCorrect = true;
          ans.score = 5;
          mcqScore += 5;
          correct++;
        } else if (ans.selectedOption) {
          ans.isCorrect = false;
          ans.score = 0;
          incorrect++;
        } else {
          ans.isCorrect = false;
          ans.score = 0;
        }
      } else {
        // Section B: Coding questions (max 25 points each, 2 questions = max 50)
        const qScore = typeof ans.score === 'number' ? Math.min(25, Math.max(0, ans.score)) : 0;
        ans.score = qScore;
        codingScore += qScore;
        if (ans.passedTests > 0 && ans.passedTests === ans.totalTests) {
          correct++;
        } else if (ans.passedTests > 0) {
          correct += 0.5; // partial credit representation
        }
      }
    }
  });

  const totalQuestions = questions.length || 22;
  const mcqQuestionsCount = questions.filter((q) => q.section === 'A').length || 20;
  const unanswered = Math.max(0, mcqQuestionsCount - (Math.floor(correct) + incorrect));

  attempt.mcqScore = Math.min(100, mcqScore);
  attempt.codingScore = Math.min(50, codingScore);
  attempt.totalScore = attempt.mcqScore + attempt.codingScore;
  attempt.maxScore = 150;
  attempt.correctCount = Math.floor(correct);
  attempt.incorrectCount = incorrect;
  attempt.unansweredCount = unanswered;

  await attempt.save();

  const responsePayload = {
    message: 'Event submission evaluated successfully.',
    attemptId: attempt._id,
    totalScore: attempt.totalScore,
    mcqScore: attempt.mcqScore,
    codingScore: attempt.codingScore,
    maxScore: 150,
    correctCount: attempt.correctCount,
    incorrectCount: attempt.incorrectCount,
    unansweredCount: attempt.unansweredCount,
    timeTaken: attempt.timeTaken,
    endTime: attempt.endTime,
  };

  if (res) {
    return res.status(200).json(responsePayload);
  }
  return responsePayload;
};

// POST /api/exams/submit (Final exam submission)
const submitExam = async (req, res) => {
  try {
    const userId = req.user._id;
    const serverNow = new Date();

    const attempt = await ExamAttempt.findOne({ userId, status: 'in-progress' });
    if (!attempt) {
      const completedAttempt = await ExamAttempt.findOne({ userId, status: 'completed' });
      if (completedAttempt) {
        return res.status(200).json({
          message: 'Exam already submitted.',
          attemptId: completedAttempt._id,
          totalScore: completedAttempt.totalScore,
          timeTaken: completedAttempt.timeTaken,
        });
      }
      return res.status(404).json({ message: 'No active exam attempt found.' });
    }

    const expiryTime = new Date(attempt.startTime.getTime() + attempt.duration * 60 * 1000);
    const endTime = serverNow > expiryTime ? expiryTime : serverNow;

    return await finalizeAttempt(attempt, endTime, res);
  } catch (error) {
    console.error('Final submit exam error:', error);
    return res.status(500).json({ message: 'Failed to submit exam', error: error.message });
  }
};

module.exports = {
  startExam,
  getExamStatus,
  saveAnswer,
  submitExam,
};
