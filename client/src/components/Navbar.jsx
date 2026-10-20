import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, ShieldAlert, Award, User, LogOut } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';

const Navbar = ({ onOpenSubmitModal }) => {
  const location = useLocation();
  const { studentUser, adminUser, logoutStudent } = useAuth();
  const { isTimerActive, isExamLocked } = useExam();

  const isExamPortal = location.pathname === '/portal';

  return (
    <header className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">GUSAC</span>
                <span className="bg-indigo-950 text-indigo-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-700/50 uppercase tracking-wide">
                  CODING EXAM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 font-medium">GITAM University Science & Activity Club</p>
            </div>
          </Link>
        </div>

        {/* Center: Live Timer if in exam */}
        {isExamPortal && isTimerActive && !isExamLocked && (
          <div className="hidden sm:flex items-center">
            <CountdownTimer />
          </div>
        )}

        {/* Right: Actions & User info */}
        <div className="flex items-center gap-3">
          {/* Mobile timer */}
          {isExamPortal && isTimerActive && !isExamLocked && (
            <div className="sm:hidden">
              <CountdownTimer />
            </div>
          )}

          {/* Final submit button when inside portal */}
          {isExamPortal && !isExamLocked && (
            <button
              onClick={onOpenSubmitModal}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-1.5 rounded-lg shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5"
            >
              <span>Submit Exam</span>
            </button>
          )}

          {/* Navigation Links */}
          <Link
            to="/leaderboard"
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-indigo-400 px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Leaderboard</span>
          </Link>

          {/* Student badge */}
          {studentUser && !isExamPortal && (
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/70 rounded-lg px-3 py-1 text-xs">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <div className="leading-tight">
                <p className="font-semibold text-slate-200">{studentUser.name}</p>
                <p className="text-[10px] text-slate-400">{studentUser.studentId}</p>
              </div>
              <button
                onClick={logoutStudent}
                title="Logout"
                className="ml-1 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Admin link */}
          <Link
            to="/admin"
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 px-2 py-1.5 rounded hover:bg-slate-800 transition-colors"
            title="Admin Portal"
          >
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            <span className="hidden lg:inline">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
