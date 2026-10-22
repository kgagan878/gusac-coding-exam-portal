import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Award, BookOpen, AlertCircle, Play, Shield, ArrowRight, Loader2, Code2, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';

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

const Instructions = () => {
  const { studentUser } = useAuth();
  const { startExam } = useExam();
  const navigate = useNavigate();

  const [acknowledged, setAcknowledged] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  if (!studentUser) {
    navigate('/exam');
    return null;
  }

  const handleStartExam = async () => {
    if (!acknowledged) {
      setError('Please check the acknowledgment box before starting the event.');
      return;
    }

    try {
      setStarting(true);
      setError('');
      await startExam();
    } catch (err) {
      console.error('Start event failed:', err);
      setError(err.response?.data?.message || 'Failed to initialize event session. Please try again.');
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
          {/* Header Banner */}
          <div className="border-b border-slate-800 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-lg">
                <img src="/gusac-logo.jpg" alt="GUSAC Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>OFFICIAL EVENT INSTRUCTIONS</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  CODE VERSE with Java
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Participant: <strong className="text-slate-200">{studentUser.name}</strong> ({studentUser.studentId})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Duration</span>
                <span className="text-lg font-black text-indigo-400">40 Mins</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Total Points</span>
                <span className="text-lg font-black text-emerald-400">150 Pts</span>
              </div>
            </div>
          </div>

          {/* Section Distribution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#0c121e] border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 font-bold text-xs border border-indigo-800/40">
                    A
                  </div>
                  <h3 className="text-sm font-bold text-white">Section A &mdash; Java MCQs</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 font-extrabold text-xs rounded border border-indigo-800/50">
                  100 Points
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>20 Questions &times; 5 Points = 100 Points.</strong> Output prediction snippet questions covering types, operators, OOP, strings, collections, and exceptions.
              </p>
            </div>

            <div className="bg-[#0c121e] border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 font-bold text-xs border border-emerald-800/40">
                    B
                  </div>
                  <h3 className="text-sm font-bold text-white">Section B &mdash; Java Coding</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 font-extrabold text-xs rounded border border-emerald-800/50">
                  50 Points
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>2 Questions &times; 25 Points = 50 Points.</strong> Write and submit code in Monaco Java Editor. Evaluated on public & hidden test cases with partial marking.
              </p>
            </div>
          </div>

          {/* Full 16 Event Rules and Guidelines */}
          <div className="space-y-4 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between">
              <span>Event Rules and Guidelines</span>
              <span className="text-xs text-indigo-400 font-mono">16 Rules</span>
            </h2>

            <ol className="space-y-2.5">
              {EVENT_RULES.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-[#0c121e] border border-slate-800/80 rounded-xl p-3 hover:border-slate-700 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs border border-indigo-800/60 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {rule}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mandatory Acknowledgment Checkbox with EXACT text */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-indigo-900/50 mb-6 shadow-inner">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                I have read and agree to the Event Rules and Guidelines.
              </span>
            </label>
          </div>

          {/* Start Event Action */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleStartExam}
              disabled={starting || !acknowledged}
              className={`flex items-center gap-2 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-lg transition-all cursor-pointer ${
                acknowledged && !starting
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-950/50'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {starting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Starting 40:00 Timer...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Event Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Instructions;
