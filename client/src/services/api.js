import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('gusac_admin_token');
  const studentToken = localStorage.getItem('gusac_student_token');

  const token = (config.url?.startsWith('/admin') && adminToken) ? adminToken : (studentToken || adminToken);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('API 401 unauthorized error:', error.response.data?.message);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  loginStudent: (data) => api.post('/auth/login', data),
  loginAdmin: (data) => api.post('/admin/login', data),
  getMe: () => api.get('/auth/me'),
};

export const examAPI = {
  startExam: () => api.post('/exams/start'),
  getExamStatus: () => api.get('/exams/status'),
  saveAnswer: (data) => api.post('/exams/save-answer', data),
  submitExam: () => api.post('/exams/submit'),
};

export const questionAPI = {
  getQuestions: () => api.get('/questions'),
  getQuestionById: (id) => api.get(`/questions/${id}`),
};

export const submissionAPI = {
  runCode: (data) => api.post('/submissions/run', data),
  submitAnswer: (data) => api.post('/submissions/submit', data),
};

export const resultAPI = {
  getResult: (userId) => api.get(`/results/${userId}`),
  getLeaderboard: () => api.get('/leaderboard'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getParticipants: (params) => api.get('/admin/participants', { params }),
  getSubmissions: (params) => api.get('/admin/submissions', { params }),
  getSubmissionById: (id) => api.get(`/admin/submissions/${id}`),
  getQuestions: () => api.get('/admin/questions'),
  createQuestion: (data) => api.post('/admin/questions', data),
  updateQuestion: (id, data) => api.put(`/admin/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  exportCSV: () => api.get('/admin/export-csv', { responseType: 'blob' }),
};

export default api;
