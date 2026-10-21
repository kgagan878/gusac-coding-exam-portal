import React from 'react';
import { X, Shield, BookOpen, Clock, Award, CheckCircle2, AlertTriangle } from 'lucide-react';

const EVENT_RULES = [
  'The event consists of 10 Java MCQs and 2 Java coding questions.',
  'The maximum score is 150 points.',
  'The event duration is 40 minutes, with a visible countdown timer.',
  'Participants must enter their correct name, email address, and student ID.',
  'Each participant is allowed only one official attempt.',
  'MCQ answers must be selected before submission.',
  'Coding answers must be typed in the provided Java editor and submitted.',
  'Participants should test their code before final submission.',
  'Only submitted answers that are successfully recorded by the server will be evaluated.',
  'When the timer expires, the system should automatically submit the saved answers.',
  'Participants must not refresh, close, or navigate away from the exam during an attempt unless the application explicitly supports recovery.',
  "Copying another participant's code, sharing answers, or attempting to manipulate scores is prohibited.",
  'Hacking, bypassing restrictions, exploiting APIs, or interfering with the portal is prohibited.',
  "The organizers' decisions regarding event administration and verified technical issues are final.",
  'Participants should contact the organizers if they experience a technical issue.',
  'Results and leaderboard positions are based on validated scores recorded by the backend.',
];

const EventRulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#111827] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0d131f] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-slate-700 flex items-center justify-center shrink-0">
              <img src="/gusac-logo.jpg" alt="GUSAC Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">CODE VERSE with Java</span>
                <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-700/50">
                  150 Points Total
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Event Rules and Guidelines
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Guidelines"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Points Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-6 py-3 bg-slate-900/50 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span><strong>Duration:</strong> 40 Minutes</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Total Points:</strong> 150 Points</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Structure:</strong> 10 MCQs + 2 Coding</span>
          </div>
        </div>

        {/* Scoring Scheme Card */}
        <div className="px-6 py-3 bg-indigo-950/20 border-b border-indigo-900/40 text-xs text-indigo-200 flex flex-wrap items-center justify-between gap-2">
          <span><strong>Section A:</strong> 10 Java MCQs &times; 5 pts = <strong>50 pts</strong></span>
          <span><strong>Section B:</strong> 2 Java Coding &times; 50 pts = <strong>100 pts</strong> (Partial marking via test cases)</span>
          <span><strong>Grand Total:</strong> <strong>150 pts</strong></span>
        </div>

        {/* Rules Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3.5 text-xs sm:text-sm text-slate-300">
          <p className="text-xs text-slate-400 font-medium">
            Please read the following 16 official event regulations carefully. All participants must adhere to these rules throughout the event:
          </p>

          <ol className="space-y-3">
            {EVENT_RULES.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-[#0c121e] border border-slate-800/80 rounded-xl p-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-xs border border-indigo-800/50">
                  {idx + 1}
                </span>
                <span className="leading-relaxed text-slate-200">
                  {rule}
                </span>
              </li>
            ))}
          </ol>

          <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl text-xs text-amber-300 flex items-start gap-2.5 mt-4">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Note during the event:</strong> Viewing these guidelines from within the exam portal will NOT pause, reset, or disrupt your 40:00 countdown timer.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-[#0d131f] border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRulesModal;
