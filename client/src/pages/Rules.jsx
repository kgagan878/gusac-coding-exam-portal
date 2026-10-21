import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Clock, Award, BookOpen, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Code2 } from 'lucide-react';
import Navbar from '../components/Navbar';

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

const Rules = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
          {/* Header Banner */}
          <div className="border-b border-slate-800 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-slate-700 flex items-center justify-center shrink-0 shadow-lg">
                <img src="/gusac-logo.jpg" alt="GUSAC Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>CODE VERSE WITH JAVA</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Event Rules and Guidelines
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Official Code of Conduct & Examination Rules &bull; GITAM University Science & Activity Club
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center">
              <Link
                to="/exam"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0c121e] border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 flex items-center justify-center shrink-0 border border-indigo-800/40">
                <Clock className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Duration</span>
                <span className="text-lg font-black text-white">40 Minutes</span>
              </div>
            </div>

            <div className="bg-[#0c121e] border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center shrink-0 border border-emerald-800/40">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Score</span>
                <span className="text-lg font-black text-emerald-400">150 Points</span>
              </div>
            </div>

            <div className="bg-[#0c121e] border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 flex items-center justify-center shrink-0 border border-purple-800/40">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Questions</span>
                <span className="text-lg font-black text-purple-300">10 MCQs + 2 Coding</span>
              </div>
            </div>
          </div>

          {/* Section Breakdown Card */}
          <div className="mb-8 p-5 bg-[#0e1626] border border-indigo-900/50 rounded-xl shadow-inner">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Event Structure & Scoring Breakdown</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-sm">Section A: Java MCQs</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold border border-indigo-800/50">
                    50 Points
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  10 output prediction and conceptual multiple-choice questions (5 points each). Tests variable promotion, String pool, OOP inheritance, method overloading, static blocks, and collections.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-sm">Section B: Java Coding</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/50">
                    100 Points
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  2 hands-on Java coding problems (50 points each). Evaluated via sandboxed execution against public and hidden test cases, with partial marks awarded proportionally.
                </p>
              </div>
            </div>
          </div>

          {/* 16 Official Rules List */}
          <div className="space-y-4 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Official Event Regulations (16 Rules)
            </h2>

            <ol className="space-y-3">
              {EVENT_RULES.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-[#0c121e] border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-indigo-950 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs border border-indigo-800/60 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
                    {rule}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Bottom Call to Action */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/exam"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal Home</span>
            </Link>

            <Link
              to="/exam"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <span>Login & Take Event</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rules;
