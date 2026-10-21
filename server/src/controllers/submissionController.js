const Question = require('../models/Question');
const Submission = require('../models/Submission');
const ExamAttempt = require('../models/ExamAttempt');
const { runTestCases, executeCode, normalizeOutput } = require('../services/judge0Service');

// POST /api/submissions/run (Runs code against sample/public test cases)
const runCode = async (req, res) => {
  try {
    const { questionId, code, language, customInput } = req.body;

    if (!questionId || !code || !language) {
      return res.status(400).json({ message: 'questionId, code, and language are required.' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // If student provided custom input to test
    if (customInput !== undefined && customInput !== null && customInput !== '') {
      const execResult = await executeCode(code, language, customInput);
      return res.status(200).json({
        isCustom: true,
        result: execResult,
      });
    }

    // Run against public sample test cases
    const testCases = question.sampleTestCases || [];
    if (testCases.length === 0) {
      return res.status(400).json({ message: 'No public test cases configured for this question.' });
    }

    const results = await runTestCases(code, language, testCases);
    const passedCount = results.filter((r) => r.passed).length;

    return res.status(200).json({
      success: true,
      totalTests: testCases.length,
      passedTests: passedCount,
      allPassed: passedCount === testCases.length,
      results,
    });
  } catch (error) {
    console.error('Run code error:', error);
    return res.status(500).json({ message: 'Code execution failed', error: error.message });
  }
};

// POST /api/submissions/submit (Evaluates code against hidden test cases & updates question score)
const submitAnswer = async (req, res) => {
  try {
    const { questionId, code, language } = req.body;
    const userId = req.user._id;

    if (!questionId || !code || !language) {
      return res.status(400).json({ message: 'questionId, code, and language are required.' });
    }

    // Find active exam attempt
    const attempt = await ExamAttempt.findOne({
      userId,
      status: 'in-progress',
    });

    if (!attempt) {
      return res.status(400).json({
        message: 'No active exam attempt found. The exam may have ended or not been started.',
      });
    }

    // Check timer expiry
    const now = new Date();
    const expiryTime = new Date(attempt.startTime.getTime() + attempt.duration * 60 * 1000);
    if (now > expiryTime) {
      return res.status(403).json({
        message: 'Exam time has expired. Submissions are no longer accepted.',
      });
    }

    // Fetch question including hidden test cases
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Evaluation includes sample + hidden test cases
    const allEvaluationCases = [
      ...(question.sampleTestCases || []),
      ...(question.hiddenTestCases || []),
    ];

    if (allEvaluationCases.length === 0) {
      return res.status(400).json({ message: 'No evaluation test cases configured for this question.' });
    }

    const testResults = await runTestCases(code, language, allEvaluationCases);
    const passedCount = testResults.filter((r) => r.passed).length;
    const totalCount = allEvaluationCases.length;

    // Backend calculated score (proportional to passed tests, max 50 points per coding question)
    const questionMaxMarks = question.marks || 50;
    const calculatedScore = Math.round((passedCount / totalCount) * questionMaxMarks);

    // Calculate total execution time across test cases
    const totalExecTime = testResults.reduce((acc, curr) => acc + (curr.executionTime || 0), 0);
    const avgExecTime = totalCount > 0 ? parseFloat((totalExecTime / totalCount).toFixed(3)) : 0;

    let overallStatus = 'Wrong Answer';
    if (passedCount === totalCount) {
      overallStatus = 'Accepted';
    } else if (passedCount > 0) {
      overallStatus = 'Partial';
    } else {
      const hasCompileError = testResults.some((r) => r.compileOutput && r.compileOutput.trim() !== '');
      if (hasCompileError) overallStatus = 'Compilation Error';
    }

    // Create Submission record
    const submission = await Submission.create({
      userId,
      questionId,
      attemptId: attempt._id,
      code,
      language,
      passedTests: passedCount,
      totalTests: totalCount,
      score: calculatedScore,
      executionTime: avgExecTime,
      status: overallStatus,
      submittedAt: new Date(),
    });

    // Update ExamAttempt answers array
    const existingAnswerIdx = attempt.answers.findIndex(
      (a) => a.questionId.toString() === questionId.toString()
    );

    const answerData = {
      questionId,
      code,
      language,
      score: calculatedScore,
      passedTests: passedCount,
      totalTests: totalCount,
      submittedAt: new Date(),
    };

    if (existingAnswerIdx > -1) {
      attempt.answers[existingAnswerIdx] = {
        ...attempt.answers[existingAnswerIdx].toObject(),
        ...answerData,
      };
    } else {
      attempt.answers.push(answerData);
    }

    // Recalculate codingScore and totalScore so far
    let totalCoding = 0;
    let totalMcq = 0;
    attempt.answers.forEach((ans) => {
      if (ans.selectedOption !== undefined && ans.selectedOption !== null) {
        totalMcq += (ans.score || 0);
      } else {
        totalCoding += (ans.score || 0);
      }
    });

    attempt.mcqScore = Math.min(50, totalMcq);
    attempt.codingScore = Math.min(100, totalCoding);
    attempt.totalScore = attempt.mcqScore + attempt.codingScore;
    attempt.maxScore = 150;
    await attempt.save();

    // Respond WITHOUT exposing hidden test inputs or expected outputs!
    return res.status(200).json({
      success: true,
      message: 'Answer submitted and evaluated successfully',
      submissionId: submission._id,
      passedTests: passedCount,
      totalTests: totalCount,
      score: calculatedScore,
      maxMarks: questionMaxMarks,
      status: overallStatus,
      executionTime: avgExecTime,
      submittedAt: submission.submittedAt,
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    return res.status(500).json({ message: 'Submission evaluation failed', error: error.message });
  }
};

module.exports = {
  runCode,
  submitAnswer,
};
