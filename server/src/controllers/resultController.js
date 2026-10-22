const ExamAttempt = require('../models/ExamAttempt');
const Question = require('../models/Question');
const User = require('../models/User');
const Setting = require('../models/Setting');

// Helper to convert MM:SS to seconds for reliable sorting
const parseTimeToSeconds = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 999999;
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 999999;
};

// GET /api/results/:userId
const getResultByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Student can only view their own results, unless admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. You can only view your own result.' });
    }

    const user = await User.findById(userId).select('name studentId email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const attempt = await ExamAttempt.findOne({ userId, status: 'completed' }).sort({ updatedAt: -1 });

    if (!attempt) {
      // Check if attempt is in-progress
      const activeAttempt = await ExamAttempt.findOne({ userId, status: 'in-progress' });
      if (activeAttempt) {
        return res.status(400).json({ message: 'Exam is currently in progress. Submit exam to view results.' });
      }
      return res.status(404).json({ message: 'No completed exam attempt found for this user.' });
    }

    const config = await Setting.getConfig();
    const showExplanations = !!config.showExplanations;

    const questions = await Question.find({}).sort({ order: 1, createdAt: 1 });
    const maxTotalScore = 150;

    const breakdown = questions.map((q, idx) => {
      const answer = attempt.answers.find(
        (a) => a.questionId.toString() === q._id.toString()
      );

      const isMcq = q.section === 'A';
      const selectedOption = answer ? answer.selectedOption : null;
      const isCorrect = answer ? !!answer.isCorrect : false;
      const isAnswered = isMcq
        ? (selectedOption !== null && selectedOption !== undefined)
        : (!!answer && (!!answer.code || (answer.passedTests !== undefined && answer.passedTests > 0)));

      return {
        questionNumber: idx + 1,
        questionId: q._id,
        section: q.section || (idx < 20 ? 'A' : 'B'),
        type: q.type || (idx < 20 ? 'mcq' : 'coding'),
        title: q.title,
        topic: q.topic || (idx < 20 ? 'Java Output Prediction' : 'Java Coding Problem'),
        description: q.description,
        codeSnippet: q.codeSnippet,
        options: q.options,
        selectedOption,
        isAnswered,
        isCorrect,
        score: answer ? (answer.score || 0) : 0,
        marks: q.marks || (idx < 20 ? 5 : 25),
        passedTests: answer ? (answer.passedTests || 0) : 0,
        totalTests: answer ? (answer.totalTests || 0) : (q.section === 'B' ? 5 : 0),
        code: answer ? (answer.code || '') : '',
        language: answer ? (answer.language || 'java') : 'java',
        // Only disclose correctOption and explanation if admin enabled showExplanations
        correctOption: showExplanations ? q.correctOption : null,
        explanation: showExplanations ? q.explanation : null,
      };
    });

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
      },
      attemptId: attempt._id,
      totalScore: attempt.totalScore || 0,
      mcqScore: attempt.mcqScore || 0,
      codingScore: attempt.codingScore || 0,
      maxTotalScore,
      correctCount: attempt.correctCount !== undefined ? attempt.correctCount : 0,
      incorrectCount: attempt.incorrectCount !== undefined ? attempt.incorrectCount : 0,
      unansweredCount: attempt.unansweredCount || 0,
      timeTaken: attempt.timeTaken,
      startTime: attempt.startTime,
      endTime: attempt.endTime,
      showExplanations,
      breakdown,
    });
  } catch (error) {
    console.error('Get results error:', error);
    return res.status(500).json({ message: 'Failed to retrieve exam results', error: error.message });
  }
};

// GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const attempts = await ExamAttempt.find({ status: 'completed' })
      .populate('userId', 'name studentId')
      .lean();

    const formatted = attempts
      .filter((att) => att.userId)
      .map((att) => {
        const seconds = parseTimeToSeconds(att.timeTaken);
        return {
          attemptId: att._id,
          userId: att.userId._id,
          name: att.userId.name,
          studentId: att.userId.studentId,
          score: att.totalScore || 0,
          mcqScore: att.mcqScore || 0,
          codingScore: att.codingScore || 0,
          maxScore: 150,
          timeTaken: att.timeTaken || '00:00',
          timeInSeconds: seconds,
          submittedAt: att.endTime || att.updatedAt,
        };
      });

    // 1. Highest score first
    // 2. Lowest time first
    // 3. Earlier submission first
    formatted.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (a.timeInSeconds !== b.timeInSeconds) {
        return a.timeInSeconds - b.timeInSeconds;
      }
      return new Date(a.submittedAt) - new Date(b.submittedAt);
    });

    // Assign ranks
    const leaderboard = formatted.map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      studentId: entry.studentId ? entry.studentId.slice(0, 3) + '***' : '***',
      score: entry.score,
      mcqScore: entry.mcqScore,
      codingScore: entry.codingScore,
      maxScore: 150,
      time: entry.timeTaken,
      submittedAt: entry.submittedAt,
    }));

    return res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return res.status(500).json({ message: 'Failed to retrieve leaderboard', error: error.message });
  }
};

module.exports = {
  getResultByUserId,
  getLeaderboard,
};
