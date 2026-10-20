import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  FolderCode,
  Award,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  LogOut,
  X,
  Code2,
  RefreshCw,
  Download,
  Settings,
  Sliders,
  Check,
  AlertTriangle,
  Loader2,
  Tag,
  BookOpen,
} from 'lucide-react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { adminUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'participants' | 'questions' | 'settings'

  // Dashboard Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Participants
  const [participants, setParticipants] = useState([]);
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantStatus, setParticipantStatus] = useState('all');
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  // Questions
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Settings
  const [examSettings, setExamSettings] = useState({ durationMinutes: 40, showExplanations: true });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // Export CSV State
  const [exportingCSV, setExportingCSV] = useState(false);

  // Question Form State
  const initialQuestionForm = {
    title: '',
    topic: 'Java Output Prediction',
    difficulty: 'Medium',
    marks: 1,
    order: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {\n    public static void main(String[] args) {\n        // Your Java code\n    }\n}`,
    options: [
      { key: 'A', text: '' },
      { key: 'B', text: '' },
      { key: 'C', text: '' },
      { key: 'D', text: '' },
    ],
    correctOption: 'A',
    explanation: '',
  };
  const [questionFormData, setQuestionFormData] = useState(initialQuestionForm);
  const [savingQuestion, setSavingQuestion] = useState(false);

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin/login');
      return;
    }
    loadDashboard();
    loadSettings();
  }, [adminUser]);

  const loadDashboard = async () => {
    try {
      setLoadingStats(true);
      const res = await adminAPI.getDashboard();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadParticipants = async () => {
    try {
      setLoadingParticipants(true);
      const res = await adminAPI.getParticipants({
        search: participantSearch,
        status: participantStatus,
      });
      setParticipants(res.data.participants || []);
    } catch (err) {
      console.error('Failed to load participants:', err);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const res = await adminAPI.getQuestions();
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await adminAPI.getSettings();
      if (res.data.settings) {
        setExamSettings(res.data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'participants') loadParticipants();
    if (activeTab === 'questions') loadQuestions();
    if (activeTab === 'settings') loadSettings();
    if (activeTab === 'dashboard') loadDashboard();
  }, [activeTab]);

  // Handle Export CSV
  const handleExportCSV = async () => {
    try {
      setExportingCSV(true);
      const res = await adminAPI.exportCSV();
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `gusac_java_exam_results_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert('Failed to export CSV. Please check server logs.');
    } finally {
      setExportingCSV(false);
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      setSettingsSavedMsg('');
      const res = await adminAPI.updateSettings(examSettings);
      setExamSettings(res.data.settings);
      setSettingsSavedMsg('Exam settings updated successfully!');
      setTimeout(() => setSettingsSavedMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update settings:', err);
      alert('Failed to update settings: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingSettings(false);
    }
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionFormData({
      ...initialQuestionForm,
      order: questions.length + 1,
    });
    setQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q) => {
    setEditingQuestion(q);
    setQuestionFormData({
      title: q.title || '',
      topic: q.topic || 'Java Output Prediction',
      difficulty: q.difficulty || 'Medium',
      marks: q.marks !== undefined ? q.marks : 1,
      order: q.order || 1,
      description: q.description || '',
      codeSnippet: q.codeSnippet || '',
      options: q.options?.length === 4 ? q.options : initialQuestionForm.options,
      correctOption: q.correctOption || 'A',
      explanation: q.explanation || '',
    });
    setQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await adminAPI.deleteQuestion(id);
      loadQuestions();
    } catch (err) {
      console.error('Delete question error:', err);
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      setSavingQuestion(true);
      if (editingQuestion) {
        await adminAPI.updateQuestion(editingQuestion._id, questionFormData);
      } else {
        await adminAPI.createQuestion(questionFormData);
      }
      setQuestionModalOpen(false);
      loadQuestions();
    } catch (err) {
      console.error('Save question error:', err);
      alert('Failed to save question: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col text-slate-200">
      {/* Admin Top Header */}
      <header className="bg-[#0f172a] border-b border-slate-800 px-6 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
              <span>GUSAC ADMIN PORTAL</span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-700/50">
                JAVA 20-Q EXAM
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleExportCSV}
            disabled={exportingCSV}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white shadow transition-all cursor-pointer disabled:opacity-50"
            title="Download participant results as CSV"
          >
            {exportingCSV ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <Link
            to="/exam"
            target="_blank"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors hidden sm:inline"
          >
            Student Exam ↗
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-900/50 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="bg-[#111827] border-b border-slate-800 px-6 py-2 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('participants')}
          className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'participants'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Participants</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FolderCode className="w-4 h-4" />
          <span>Java Question Bank</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Exam Settings</span>
        </button>

        <Link
          to="/leaderboard"
          target="_blank"
          className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors ml-auto"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Public Standings ↗</span>
        </Link>
      </nav>

      {/* Main Tab Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Overview & Performance</h2>
                <p className="text-xs text-slate-400">Live statistics across all registered candidate attempts.</p>
              </div>

              <button
                onClick={handleExportCSV}
                disabled={exportingCSV}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export Results to CSV</span>
              </button>
            </div>

            {loadingStats ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 bg-[#111827] rounded-xl animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Participants */}
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Total Candidates
                    </span>
                    <span className="text-3xl font-black text-white">{stats?.totalParticipants || 0}</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                {/* Completed */}
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Completed Exams
                    </span>
                    <span className="text-3xl font-black text-emerald-400">{stats?.completed || 0}</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>

                {/* In Progress */}
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      In Progress
                    </span>
                    <span className="text-3xl font-black text-amber-400">{stats?.inProgress || 0}</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                {/* Average Score */}
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Average Score
                    </span>
                    <span className="text-3xl font-black text-indigo-300">
                      {stats?.averageScore !== undefined ? `${stats.averageScore} / ${stats.maxScore || 20}` : '0 / 20'}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-[#111827] border border-slate-800 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Exam Specifications
                </h3>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subject:</span>
                    <strong className="text-indigo-400">Java Only (SE 17+)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Questions:</span>
                    <strong>{stats?.totalQuestions || 20} Snippet Questions</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <strong>{examSettings.durationMinutes} Minutes (40:00)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Score:</span>
                    <strong className="text-emerald-400">20 Marks (+1 per correct)</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[#111827] border border-slate-800 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Explanations Policy
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Candidate review explanations are currently{' '}
                  <strong className={examSettings.showExplanations ? 'text-emerald-400' : 'text-amber-400'}>
                    {examSettings.showExplanations ? 'ENABLED' : 'DISABLED'}
                  </strong>.
                </p>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-block cursor-pointer"
                >
                  Configure in Settings →
                </button>
              </div>

              <div className="p-5 bg-[#111827] border border-slate-800 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Data Exports
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Download full candidate rankings, accuracy counts, and time records in CSV format.
                </p>
                <button
                  onClick={handleExportCSV}
                  disabled={exportingCSV}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PARTICIPANTS ================= */}
        {activeTab === 'participants' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Candidate Results & Attempts</h2>
                <p className="text-xs text-slate-400">Search and monitor candidate performance out of 20 marks.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, roll no, email..."
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadParticipants()}
                    className="bg-[#111827] text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={participantStatus}
                  onChange={(e) => {
                    setParticipantStatus(e.target.value);
                    setTimeout(loadParticipants, 0);
                  }}
                  className="bg-[#111827] text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="not-started">Not Started</option>
                </select>

                <button
                  onClick={loadParticipants}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingParticipants ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleExportCSV}
                  disabled={exportingCSV}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Participants Table */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0c121e] text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Candidate</th>
                      <th className="px-4 py-3">Student ID</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Score (/20)</th>
                      <th className="px-4 py-3 text-center">Correct / Wrong</th>
                      <th className="px-4 py-3 text-right">Time Taken</th>
                      <th className="px-4 py-3 text-right">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {loadingParticipants ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-slate-500">
                          Loading candidates...
                        </td>
                      </tr>
                    ) : participants.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-slate-500">
                          No candidates found.
                        </td>
                      </tr>
                    ) : (
                      participants.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-white">{p.name}</div>
                            <div className="text-[10px] text-slate-500">{p.email}</div>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-indigo-300">{p.studentId}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                p.status === 'completed'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                                  : p.status === 'in-progress'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-extrabold text-sm text-indigo-300">
                            {p.score} <span className="text-xs text-slate-500 font-normal">/ 20</span>
                          </td>
                          <td className="px-4 py-3 text-center text-[11px]">
                            <span className="text-emerald-400 font-bold">{p.correctCount}</span>
                            <span className="text-slate-600 mx-1">/</span>
                            <span className="text-rose-400">{p.incorrectCount}</span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-emerald-400">{p.timeTaken}</td>
                          <td className="px-4 py-3 text-right text-slate-400 text-[11px]">
                            {p.submittedAt ? new Date(p.submittedAt).toLocaleTimeString() : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: QUESTIONS MANAGEMENT ================= */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Java Question Bank (20 Questions)</h2>
                <p className="text-xs text-slate-400">
                  Manage multiple-choice snippet questions, options A–D, correct answer keys, and explanations.
                </p>
              </div>

              <button
                onClick={handleOpenAddQuestion}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loadingQuestions ? (
                <div className="p-8 text-center text-slate-500">Loading questions...</div>
              ) : questions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No questions found.</div>
              ) : (
                questions.map((q, idx) => (
                  <div
                    key={q._id}
                    className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-indigo-950 text-indigo-400 font-bold text-xs flex items-center justify-center">
                          Q{idx + 1}
                        </span>
                        <h3 className="font-extrabold text-white text-base">{q.title}</h3>
                        <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700/40">
                          {q.topic}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {q.difficulty}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          1 Mark
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditQuestion(q)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold border border-rose-900/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Snippet Preview */}
                    {q.codeSnippet && (
                      <pre className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-indigo-200 overflow-x-auto border border-slate-800 max-h-36">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    )}

                    {/* Options Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {q.options?.map((opt) => (
                        <div
                          key={opt.key}
                          className={`p-2 rounded-lg border flex items-center gap-2 font-mono text-[11px] ${
                            q.correctOption === opt.key
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="w-5 font-bold">{opt.key}.</span>
                          <span className="truncate">{opt.text}</span>
                          {q.correctOption === opt.key && (
                            <span className="ml-auto text-[9px] px-1 py-0.2 rounded bg-emerald-900 text-emerald-200">
                              CORRECT
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                        <strong className="text-slate-300">Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: EXAM SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <span>Exam Configuration</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure exam duration and candidate result review permissions.
              </p>
            </div>

            {settingsSavedMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{settingsSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Exam Duration (in Minutes)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="5"
                    max="180"
                    required
                    value={examSettings.durationMinutes}
                    onChange={(e) =>
                      setExamSettings({ ...examSettings, durationMinutes: parseInt(e.target.value, 10) })
                    }
                    className="w-32 bg-[#0a0f18] text-white text-sm p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                  <span className="text-slate-400">Default: 40 minutes (2400 seconds)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={examSettings.showExplanations}
                    onChange={(e) =>
                      setExamSettings({ ...examSettings, showExplanations: e.target.checked })
                    }
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white text-sm block">
                      Show Explanations to Candidates After Exam
                    </span>
                    <span className="text-slate-400 text-xs leading-relaxed mt-0.5 block">
                      When enabled, candidates can view verified correct answers (A–D) and detailed step-by-step explanations on their result screen after submission. If disabled, answers remain hidden.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-950/40 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ================= MODAL: ADD / EDIT JAVA QUESTION ================= */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-[#0d131f] border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                {editingQuestion ? 'Edit Java Snippet Question' : 'Add New Java Snippet Question'}
              </h3>
              <button
                onClick={() => setQuestionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Title & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Question Title
                  </label>
                  <input
                    type="text"
                    required
                    value={questionFormData.title}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, title: e.target.value })}
                    className="w-full bg-[#0a0f18] text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Topic / Category
                  </label>
                  <input
                    type="text"
                    required
                    value={questionFormData.topic}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, topic: e.target.value })}
                    className="w-full bg-[#0a0f18] text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Description Prompt */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Prompt / Description
                </label>
                <input
                  type="text"
                  required
                  value={questionFormData.description}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, description: e.target.value })}
                  className="w-full bg-[#0a0f18] text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Code Snippet */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Java Code Snippet
                </label>
                <textarea
                  rows={6}
                  required
                  value={questionFormData.codeSnippet}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, codeSnippet: e.target.value })}
                  className="w-full bg-[#080d15] text-indigo-200 font-mono text-xs p-3 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Four MCQ Options */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                  Options (A, B, C, D)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {questionFormData.options.map((opt, oIdx) => (
                    <div key={opt.key} className="flex items-center gap-2 bg-[#0c121e] p-2 rounded-lg border border-slate-800">
                      <span className="font-mono font-bold text-indigo-400 w-5 text-center">{opt.key}.</span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${opt.key} text`}
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...questionFormData.options];
                          updated[oIdx].text = e.target.value;
                          setQuestionFormData({ ...questionFormData, options: updated });
                        }}
                        className="flex-1 bg-[#0a0f18] text-white text-xs p-2 rounded border border-slate-700 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Option & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Verified Correct Option
                  </label>
                  <select
                    value={questionFormData.correctOption}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, correctOption: e.target.value })}
                    className="w-full bg-[#0a0f18] text-white p-2.5 rounded-lg border border-emerald-600 focus:outline-none font-bold"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Difficulty
                  </label>
                  <select
                    value={questionFormData.difficulty}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, difficulty: e.target.value })}
                    className="w-full bg-[#0a0f18] text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Step-by-Step Explanation */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Detailed Explanation (Revealed to Students After Exam)
                </label>
                <textarea
                  rows={3}
                  required
                  value={questionFormData.explanation}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, explanation: e.target.value })}
                  placeholder="Explain why this output occurs..."
                  className="w-full bg-[#0a0f18] text-white text-xs p-2.5 rounded-lg border border-slate-700 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-[#0d131f] -mx-6 -mb-6 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingQuestion}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all disabled:opacity-50 cursor-pointer"
                >
                  {savingQuestion ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
