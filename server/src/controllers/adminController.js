const User = require('../models/User');
const ExamAttempt = require('../models/ExamAttempt');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
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

// GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const completedAttempts = await ExamAttempt.countDocuments({ status: 'completed' });
    const inProgressAttempts = await ExamAttempt.countDocuments({ status: 'in-progress' });
    const totalQuestions = await Question.countDocuments({});

    // Calculate average score for completed attempts
    const scoreAgg = await ExamAttempt.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$totalScore' } } },
    ]);

    const averageScore = scoreAgg.length > 0 ? parseFloat(scoreAgg[0].avgScore.toFixed(1)) : 0;
    const config = await Setting.getConfig();

    return res.status(200).json({
      totalParticipants: totalStudents,
      completed: completedAttempts,
      inProgress: inProgressAttempts,
      notStarted: Math.max(0, totalStudents - (completedAttempts + inProgressAttempts)),
      averageScore,
      maxScore: 150,
      totalQuestions,
      settings: {
        durationMinutes: config.durationMinutes,
        showExplanations: config.showExplanations,
      },
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

// GET /api/admin/participants
const getParticipants = async (req, res) => {
  try {
    const { search = '', status = 'all' } = req.query;

    const userQuery = { role: 'student' };
    if (search.trim() !== '') {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(userQuery).sort({ createdAt: -1 }).lean();
    const attempts = await ExamAttempt.find({}).lean();

    const attemptMap = new Map();
    attempts.forEach((att) => {
      attemptMap.set(att.userId.toString(), att);
    });

    let results = students.map((st) => {
      const att = attemptMap.get(st._id.toString());
      return {
        id: st._id,
        name: st.name,
        email: st.email,
        studentId: st.studentId,
        status: att ? att.status : 'not-started',
        score: att ? (att.totalScore || 0) : 0,
        mcqScore: att ? (att.mcqScore || 0) : 0,
        codingScore: att ? (att.codingScore || 0) : 0,
        maxScore: 150,
        correctCount: att ? att.correctCount : 0,
        incorrectCount: att ? att.incorrectCount : 0,
        unansweredCount: att ? att.unansweredCount : 0,
        timeTaken: att ? att.timeTaken : '-',
        startedAt: att ? att.startTime : null,
        submittedAt: att ? att.endTime : null,
      };
    });

    if (status !== 'all') {
      results = results.filter((p) => p.status === status);
    }

    return res.status(200).json({ participants: results });
  } catch (error) {
    console.error('Admin get participants error:', error);
    return res.status(500).json({ message: 'Failed to fetch participants', error: error.message });
  }
};

// GET /api/admin/questions (Includes correctOption and explanation)
const getAdminQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({ questions });
  } catch (error) {
    console.error('Admin get questions error:', error);
    return res.status(500).json({ message: 'Failed to fetch admin questions', error: error.message });
  }
};

// POST /api/admin/questions
const createQuestion = async (req, res) => {
  try {
    const {
      title,
      topic,
      description,
      codeSnippet,
      options,
      correctOption,
      explanation,
      difficulty,
      marks,
      order,
    } = req.body;

    if (!title || !options || options.length < 2 || !correctOption) {
      return res.status(400).json({ message: 'Title, options, and correctOption are required.' });
    }

    const question = await Question.create({
      title,
      topic: topic || 'Java Output Prediction',
      description: description || 'What will be the output of the following Java program?',
      codeSnippet: codeSnippet || '',
      options,
      correctOption: correctOption.toUpperCase().trim(),
      explanation: explanation || '',
      difficulty: difficulty || 'Medium',
      marks: marks !== undefined ? marks : 1,
      order: order !== undefined ? order : 1,
      supportedLanguages: ['java'],
    });

    return res.status(201).json({ message: 'Question created successfully', question });
  } catch (error) {
    console.error('Admin create question error:', error);
    return res.status(500).json({ message: 'Failed to create question', error: error.message });
  }
};

// PUT /api/admin/questions/:id
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.correctOption) {
      req.body.correctOption = req.body.correctOption.toUpperCase().trim();
    }

    const question = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    return res.status(200).json({ message: 'Question updated successfully', question });
  } catch (error) {
    console.error('Admin update question error:', error);
    return res.status(500).json({ message: 'Failed to update question', error: error.message });
  }
};

// DELETE /api/admin/questions/:id
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    return res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Admin delete question error:', error);
    return res.status(500).json({ message: 'Failed to delete question', error: error.message });
  }
};

// GET /api/admin/settings
const getSettings = async (req, res) => {
  try {
    const config = await Setting.getConfig();
    return res.status(200).json({ settings: config });
  } catch (error) {
    console.error('Admin get settings error:', error);
    return res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
};

// PUT /api/admin/settings
const updateSettings = async (req, res) => {
  try {
    const { durationMinutes, showExplanations } = req.body;
    const config = await Setting.getConfig();

    if (durationMinutes !== undefined) {
      config.durationMinutes = Math.max(1, parseInt(durationMinutes, 10));
    }
    if (showExplanations !== undefined) {
      config.showExplanations = !!showExplanations;
    }

    await config.save();
    return res.status(200).json({ message: 'Exam settings updated successfully', settings: config });
  } catch (error) {
    console.error('Admin update settings error:', error);
    return res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

// GET /api/admin/export-csv
const exportResultsCSV = async (req, res) => {
  try {
    const attempts = await ExamAttempt.find({ status: 'completed' })
      .populate('userId', 'name email studentId')
      .lean();

    const formatted = attempts
      .filter((att) => att.userId)
      .map((att) => {
        const seconds = parseTimeToSeconds(att.timeTaken);
        return {
          name: att.userId.name,
          email: att.userId.email,
          studentId: att.userId.studentId,
          score: att.totalScore || 0,
          mcqScore: att.mcqScore || 0,
          codingScore: att.codingScore || 0,
          maxScore: 150,
          correct: att.correctCount !== undefined ? att.correctCount : 0,
          incorrect: att.incorrectCount !== undefined ? att.incorrectCount : 0,
          unanswered: att.unansweredCount || 0,
          timeTaken: att.timeTaken || '00:00',
          timeInSeconds: seconds,
          startedAt: att.startTime ? new Date(att.startTime).toISOString() : '',
          submittedAt: att.endTime ? new Date(att.endTime).toISOString() : '',
          status: att.status,
        };
      });

    // Sort by rank: higher score, lower time
    formatted.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.timeInSeconds !== b.timeInSeconds) return a.timeInSeconds - b.timeInSeconds;
      return new Date(a.submittedAt) - new Date(b.submittedAt);
    });

    // Build CSV
    const headers = [
      'Rank',
      'Name',
      'Email',
      'StudentID',
      'Status',
      'TotalScore',
      'MaxScore',
      'SectionA_MCQScore',
      'SectionB_CodingScore',
      'CorrectAnswers',
      'IncorrectAnswers',
      'Unanswered',
      'TimeTaken',
      'StartedAt',
      'SubmittedAt',
    ];

    const escapeCsv = (val) => {
      const str = val === null || val === undefined ? '' : String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = formatted.map((entry, index) => [
      index + 1,
      escapeCsv(entry.name),
      escapeCsv(entry.email),
      escapeCsv(entry.studentId),
      escapeCsv(entry.status),
      entry.score,
      entry.maxScore,
      entry.mcqScore,
      entry.codingScore,
      entry.correct,
      entry.incorrect,
      entry.unanswered,
      escapeCsv(entry.timeTaken),
      escapeCsv(entry.startedAt),
      escapeCsv(entry.submittedAt),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="codeverse_java_results.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export CSV error:', error);
    return res.status(500).json({ message: 'Failed to export CSV', error: error.message });
  }
};

// Legacy submissions routes
const getSubmissions = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const submissions = await Submission.find({})
      .populate('userId', 'name email studentId')
      .populate('questionId', 'title marks difficulty')
      .sort({ submittedAt: -1 })
      .lean();

    return res.status(200).json({ submissions });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id)
      .populate('userId', 'name email studentId')
      .populate('questionId', 'title description marks difficulty');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    return res.status(200).json({ submission });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch submission', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getParticipants,
  getSubmissions,
  getSubmissionById,
  getAdminQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getSettings,
  updateSettings,
  exportResultsCSV,
};
