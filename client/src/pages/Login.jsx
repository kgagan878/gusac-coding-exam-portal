import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Code2, ArrowRight, User, Mail, Hash, ShieldAlert, Award, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { loginStudent } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.studentId.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      await loginStudent(formData.name, formData.email, formData.studentId);
      navigate('/instructions');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full"></div>
        <div className="absolute -bottom-40 right-10 w-[450px] h-[350px] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Top bar header */}
      <div className="relative max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>GUSAC</span>
              <span className="text-xs bg-indigo-950 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-700/40 uppercase">
                Online Exam Portal
              </span>
            </h1>
            <p className="text-xs text-slate-400">GITAM University Science & Activity Club</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/leaderboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-indigo-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-700/50 transition-all"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </Link>
          <Link
            to="/admin/login"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="relative max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-[#111827] border border-slate-800/90 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/40 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Session 2026</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Student Login</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your student details to proceed to the coding exam
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#0a0f18] text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. rahul@gitam.in"
                  className="w-full bg-[#0a0f18] text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Student ID / Roll No
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="e.g. GITAM202401"
                  className="w-full bg-[#0a0f18] text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Start Exam</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Guidelines footer note */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              By proceeding, you agree to abide by the GUSAC academic integrity and fair code evaluation guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative max-w-5xl mx-auto w-full text-center text-xs text-slate-500 pt-4 border-t border-slate-800/80">
        <p>© 2026 GUSAC — GITAM University Science & Activity Club. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
