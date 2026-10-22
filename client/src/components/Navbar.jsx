import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Award, User, LogOut, BookOpen, Send } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import EventRulesModal from './EventRulesModal';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';

const Navbar = ({ onOpenSubmitModal }) => {
  const location = useLocation();
  const { studentUser, logoutStudent } = useAuth();
  const { isTimerActive, isExamLocked } = useExam();
  const [showRulesModal, setShowRulesModal] = useState(false);

  const isExamPortal = location.pathname === '/portal';

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 lg:px-6 py-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Brand with official GUSAC logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <img src="/gusac-logo.jpg" alt="GUSAC Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-base tracking-tight">GUSAC</span>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wider">
                    CODE VERSE with Java
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 -mt-0.5 font-medium">
                  GITAM University Science & Activity Club &bull; 150 Points
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Live Timer if in exam */}
          {isExamPortal && isTimerActive && !isExamLocked && (
            <div className="hidden sm:flex items-center">
              <CountdownTimer />
            </div>
          )}

          {/* Right: Actions, Guidelines, & User info */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile timer */}
            {isExamPortal && isTimerActive && !isExamLocked && (
              <div className="sm:hidden">
                <CountdownTimer />
              </div>
            )}

            {/* Event Rules and Guidelines Button (Non-disruptive modal during exam) */}
            <button
              onClick={() => setShowRulesModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
              title="View Event Rules and Guidelines"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Event Rules & Guidelines</span>
              <span className="sm:hidden">Rules</span>
            </button>

            {/* Final submit button when inside portal */}
            {isExamPortal && !isExamLocked && (
              <button
                onClick={onOpenSubmitModal}
                className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 rounded-lg shadow-sm shadow-emerald-700/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Event</span>
              </button>
            )}

            {/* Navigation Links */}
            <Link
              to="/leaderboard"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Leaderboard</span>
            </Link>

            {/* Student badge */}
            {studentUser && !isExamPortal && (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <div className="leading-tight">
                  <p className="font-semibold text-slate-800">{studentUser.name}</p>
                  <p className="text-[10px] text-slate-500">{studentUser.studentId}</p>
                </div>
                <button
                  onClick={logoutStudent}
                  title="Logout"
                  className="ml-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Admin link */}
            <Link
              to="/admin"
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded hover:bg-slate-100 transition-colors"
              title="Admin Portal"
            >
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Non-disruptive Event Rules Modal */}
      <EventRulesModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
    </>
  );
};

export default Navbar;
