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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                <img src="/gusac-logo.jpg" alt="GUSAC Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>OFFICIAL EVENT INSTRUCTIONS</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  CODE VERSE with Java
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Participant: <strong className="text-slate-800">{studentUser.name}</strong> ({studentUser.studentId})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Duration</span>
                <span className="text-lg font-black text-indigo-600">40 Mins</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total Points</span>
                <span className="text-lg font-black text-emerald-600">150 Pts</span>
              </div>
            </div>
          </div>

          {/* Section Distribution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                    A
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Section A &mdash; Java MCQs</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded border border-indigo-200">
                  100 Points
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>20 Questions &times; 5 Points = 100 Points.</strong> Output prediction snippet questions covering types, operators, OOP, strings, collections, and exceptions.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs border border-emerald-200">
                    B
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Section B &mdash; Java Coding</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded border border-emerald-200">
                  50 Points
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>2 Questions &times; 25 Points = 50 Points.</strong> Write and submit code in Monaco Java Editor. Evaluated on public & hidden test cases with partial marking.
              </p>
            </div>
          </div>

          {/* Full 16 Event Rules and Guidelines */}
          <div className="space-y-4 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Event Rules and Guidelines</span>
              <span className="text-xs text-indigo-600 font-mono font-bold">16 Rules</span>
            </h2>

            <ol className="space-y-2.5">
              {EVENT_RULES.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3 hover:border-slate-300 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs border border-indigo-200 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {rule}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mandatory Acknowledgment Checkbox with EXACT text */}
          <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 mb-6">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                I have read and agree to the Event Rules and Guidelines.
              </span>
            </label>
          </div>

          {/* Start Event Action */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleStartExam}
              disabled={starting || !acknowledged}
              className={`flex items-center gap-2 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-md transition-all cursor-pointer ${
                acknowledged && !starting
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
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
