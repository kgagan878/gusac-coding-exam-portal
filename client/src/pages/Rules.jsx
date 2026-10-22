import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Clock, Award, BookOpen, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Code2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const EVENT_RULES = [
  'The event consists of 20 Java MCQs and 2 Java coding questions.',
  'The maximum score is 150 points (Section A: 100 points, Section B: 50 points).',
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                <img src="/gusac-logo.jpg" alt="GUSAC Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>CODE VERSE WITH JAVA</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Event Rules and Guidelines
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Official Code of Conduct & Examination Rules &bull; GITAM University Science & Activity Club
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center">
              <Link
                to="/exam"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Duration</span>
                <span className="text-lg font-black text-slate-900">40 Minutes</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Total Score</span>
                <span className="text-lg font-black text-emerald-600">150 Points</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Questions</span>
                <span className="text-lg font-black text-purple-700">20 MCQs + 2 Coding</span>
              </div>
            </div>
          </div>

          {/* Section Breakdown Card */}
          <div className="mb-8 p-5 bg-indigo-50/60 border border-indigo-100 rounded-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>Event Structure & Scoring Breakdown</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">Section A: Java MCQs</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                    100 Points
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  20 output prediction and conceptual multiple-choice questions (5 points each). Tests variable promotion, String pool, OOP inheritance, method overloading, static blocks, and collections.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">Section B: Java Coding</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    50 Points
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  2 hands-on Java coding problems (25 points each). Evaluated via sandboxed execution against public and hidden test cases, with partial marks awarded proportionally.
                </p>
              </div>
            </div>
          </div>

          {/* 16 Official Rules List */}
          <div className="space-y-4 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Official Event Regulations (16 Rules)
            </h2>

            <ol className="space-y-3">
              {EVENT_RULES.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 hover:border-slate-300 transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs border border-indigo-200 shadow-xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-0.5">
                    {rule}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Bottom Call to Action */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/exam"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal Home</span>
            </Link>

            <Link
              to="/exam"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
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
