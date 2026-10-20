import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Clock, CheckSquare, AlertCircle, Play, Shield, Terminal, ArrowRight, Loader2, Bookmark, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';

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
      setError('Please check the acknowledgment box before starting.');
      return;
    }

    try {
      setStarting(true);
      setError('');
      await startExam();
    } catch (err) {
      console.error('Start exam failed:', err);
      setError(err.response?.data?.message || 'Failed to initialize exam session. Please try again.');
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
          {/* Header Banner */}
          <div className="border-b border-slate-800 pb-6 mb-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-2">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>OFFICIAL EXAMINATION</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                GUSAC JAVA CODING EXAM
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Candidate: <strong className="text-slate-200">{studentUser.name}</strong> ({studentUser.studentId})
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center justify-center sm:justify-end gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Duration</span>
                <span className="text-lg font-extrabold text-indigo-400">40 Mins</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Total Marks</span>
                <span className="text-lg font-extrabold text-emerald-400">20 Pts</span>
              </div>
            </div>
          </div>

          {/* Key Exam Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0c121e] border border-slate-800/90 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center mb-3">
                <Code2 className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">20 Java Snippet Questions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Output-prediction multiple choice questions covering Java fundamentals, OOP, collections, and logic.
              </p>
            </div>

            <div className="bg-[#0c121e] border border-slate-800/90 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center mb-3">
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">40-Minute Server Timer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Countdown is strictly tracked on the server. When the timer hits 00:00, all answers are automatically submitted.
              </p>
            </div>

            <div className="bg-[#0c121e] border border-slate-800/90 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center mb-3">
                <Terminal className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">Marking & Evaluation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                +1 mark for each correct answer. 0 marks for incorrect or unattempted answers. Maximum score is 20.
              </p>
            </div>
          </div>

          {/* Question Status Legend Preview */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Question Navigator Legend
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <span className="text-slate-300"><strong>Answered:</strong> Option chosen</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  ★
                </span>
                <span className="text-slate-300"><strong>Marked for Review:</strong> Revisit later</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs border border-slate-700">
                  3
                </span>
                <span className="text-slate-300"><strong>Unanswered:</strong> Not attempted yet</span>
              </div>
            </div>
          </div>

          {/* Exam Rules & Instructions List */}
          <div className="space-y-4 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Exam Rules & Evaluation Guidelines
            </h2>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  1
                </span>
                <span>
                  <strong>Programming Language:</strong> The exam is exclusively focused on <strong>Java SE</strong> output prediction, object references, polymorphism, operators, strings, arrays, and exception handling.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  2
                </span>
                <span>
                  <strong>Free Navigation & Auto-Save:</strong> You can navigate freely between all 20 questions at any time. Selecting an option or marking a question for review saves your response automatically to the server.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  3
                </span>
                <span>
                  <strong>Change or Clear Responses:</strong> You can modify your answer option or click "Clear Response" to unselect at any point before submitting.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  4
                </span>
                <span>
                  <strong>Final Submission:</strong> Once you confirm submission or when the 40:00 timer expires, the exam is permanently locked. Your score will be calculated and recorded immediately.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  5
                </span>
                <span>
                  <strong>Leaderboard Ranking:</strong> Top performers are ranked by <strong>Highest Score first</strong>, followed by <strong>Lowest Completion Time</strong> for tied scores.
                </span>
              </li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Acknowledgment Checkbox */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 mb-6">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-slate-300">
                I have read and understood all instructions. I confirm that I will solve the 20 Java snippet questions independently without using unauthorized external resources.
              </span>
            </label>
          </div>

          {/* Start Exam Action */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleStartExam}
              disabled={starting}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:from-emerald-700 active:to-emerald-600 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer disabled:opacity-60"
            >
              {starting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Starting 40:00 Timer...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Java Exam Now</span>
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
