const express = require('express');
const router = express.Router();

const { authenticate, requireAdmin, codeExecutionLimiter } = require('../middleware/auth');

const { loginStudent, loginAdmin, getMe } = require('../controllers/authController');
const { startExam, getExamStatus, saveAnswer, submitExam } = require('../controllers/examController');
const { getQuestions, getQuestionById } = require('../controllers/questionController');
const { runCode, submitAnswer } = require('../controllers/submissionController');
const { getResultByUserId, getLeaderboard } = require('../controllers/resultController');
const {
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
} = require('../controllers/adminController');

// --- Auth Routes ---
router.post('/auth/login', loginStudent);
router.get('/auth/me', authenticate, getMe);

// --- Admin Auth ---
router.post('/admin/login', loginAdmin);

// --- Question Routes (Public / Student - correct answers & explanations stripped) ---
router.get('/questions', authenticate, getQuestions);
router.get('/questions/:id', authenticate, getQuestionById);

// --- Exam Lifecycle Routes ---
router.post('/exams/start', authenticate, startExam);
router.get('/exams/status', authenticate, getExamStatus);
router.post('/exams/save-answer', authenticate, saveAnswer);
router.post('/exams/submit', authenticate, submitExam);

// --- Code Execution & Submission Routes (for legacy / sandbox tasks) ---
router.post('/submissions/run', authenticate, codeExecutionLimiter, runCode);
router.post('/submissions/submit', authenticate, codeExecutionLimiter, submitAnswer);

// --- Result & Leaderboard Routes ---
router.get('/results/:userId', authenticate, getResultByUserId);
router.get('/leaderboard', getLeaderboard);

// --- Admin Protected Routes ---
router.get('/admin/dashboard', authenticate, requireAdmin, getDashboardStats);
router.get('/admin/participants', authenticate, requireAdmin, getParticipants);
router.get('/admin/submissions', authenticate, requireAdmin, getSubmissions);
router.get('/admin/submissions/:id', authenticate, requireAdmin, getSubmissionById);

// Admin Question Bank Management
router.get('/admin/questions', authenticate, requireAdmin, getAdminQuestions);
router.post('/admin/questions', authenticate, requireAdmin, createQuestion);
router.put('/admin/questions/:id', authenticate, requireAdmin, updateQuestion);
router.delete('/admin/questions/:id', authenticate, requireAdmin, deleteQuestion);

// Admin Settings & CSV Export
router.get('/admin/settings', authenticate, requireAdmin, getSettings);
router.put('/admin/settings', authenticate, requireAdmin, updateSettings);
router.get('/admin/export-csv', authenticate, requireAdmin, exportResultsCSV);

module.exports = router;
