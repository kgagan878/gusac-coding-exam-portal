import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, User, Mail, Hash, ShieldAlert, Award, Loader2, Sparkles, BookOpen, Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Background soft glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/5 blur-[130px] rounded-full"></div>
        <div className="absolute -bottom-40 right-10 w-[450px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Top bar header */}
      <div className="relative max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <img src="/gusac-logo.jpg" alt="GUSAC Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>GUSAC</span>
              <span className="text-[11px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded border border-indigo-200 uppercase tracking-wider">
                CODE VERSE with Java
              </span>
            </h1>
            <p className="text-xs text-slate-500">GITAM University Science & Activity Club &bull; 150 Points Total</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Prominent Rules & Guidelines Link */}
          <Link
            to="/rules"
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Event Rules & Guidelines</span>
            <span className="sm:hidden">Rules</span>
          </Link>

          <Link
            to="/leaderboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 transition-all shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Leaderboard</span>
          </Link>

          <Link
            to="/admin/login"
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="relative max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Session 2026 &bull; Grand Total: 150 Points</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Participant Login</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your student details to proceed to the CODE VERSE event
            </p>
          </div>

          {/* Prominent Guidelines Callout Banner */}
          <div className="mb-6 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Review rules before logging in</span>
            </div>
            <Link
              to="/rules"
              className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 shrink-0"
            >
              Event Rules & Guidelines &rarr;
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@gitam.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Student ID / Roll Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. GITAM202401"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Event Guidelines</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="relative max-w-5xl mx-auto w-full text-center pt-6 border-t border-slate-200 text-xs text-slate-500">
        <p>&copy; 2026 GITAM University Science & Activity Club (GUSAC). All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
