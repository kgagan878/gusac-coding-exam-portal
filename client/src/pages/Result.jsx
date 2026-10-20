import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Award,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Tag,
  Info,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { resultAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Result = () => {
  const { studentUser } = useAuth();
  const navigate = useNavigate();

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    if (!studentUser) {
      navigate('/exam');
      return;
    }

    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await resultAPI.getResult(studentUser.id);
        setResultData(res.data);

        // Confetti celebration if score >= 12 / 20 (60%)
        if (res.data.totalScore >= 12) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error('Fetch result error:', err);
        setError(err.response?.data?.message || 'Failed to fetch exam result.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [studentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Calculating your final Java exam evaluation and score...
        </div>
      </div>
    );
  }

  const maxScore = resultData?.maxTotalScore || 20;
  const score = resultData?.totalScore || 0;
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
          {/* Header Banner */}
          <div className="text-center pb-6 border-b border-slate-800">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>GUSAC JAVA CODING EXAM</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              EXAM COMPLETED
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Candidate: <strong className="text-slate-200">{resultData?.user?.name}</strong> ({resultData?.user?.studentId})
            </p>
          </div>

          {error ? (
            <div className="p-4 my-6 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-xs text-center">
              {error}
            </div>
          ) : (
            <>
              {/* Score & Time Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                {/* Score Card */}
                <div className="bg-gradient-to-br from-[#0c121e] to-[#131b2e] border border-indigo-900/40 rounded-2xl p-6 text-center relative overflow-hidden shadow-lg">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Final Score
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                    <span className="text-indigo-400">{score}</span>
                    <span className="text-slate-500 text-2xl font-semibold">/ {maxScore}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 font-medium">
                    {percentage}% Accuracy Rating
                  </div>
                </div>

                {/* Time Taken Card */}
                <div className="bg-gradient-to-br from-[#0c121e] to-[#131b2e] border border-indigo-900/40 rounded-2xl p-6 text-center relative overflow-hidden shadow-lg">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Time Taken
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight font-mono">
                    {resultData?.timeTaken || '00:00'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Out of 40:00 limit</span>
                  </div>
                </div>
              </div>

              {/* Accuracy Metrics Row */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-[#0c121e] border border-slate-800 rounded-xl p-3.5 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-400 block font-medium">Correct</span>
                  <span className="text-lg font-extrabold text-emerald-400">
                    {resultData?.correctCount || 0}
                  </span>
                </div>

                <div className="bg-[#0c121e] border border-slate-800 rounded-xl p-3.5 text-center">
                  <XCircle className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-400 block font-medium">Incorrect</span>
                  <span className="text-lg font-extrabold text-rose-400">
                    {resultData?.incorrectCount || 0}
                  </span>
                </div>

                <div className="bg-[#0c121e] border border-slate-800 rounded-xl p-3.5 text-center">
                  <HelpCircle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-400 block font-medium">Unanswered</span>
                  <span className="text-lg font-extrabold text-slate-300">
                    {resultData?.unansweredCount || 0}
                  </span>
                </div>
              </div>

              {/* Notice regarding explanation visibility */}
              {!resultData?.showExplanations && (
                <div className="p-3 mb-6 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    Detailed answer explanations are currently locked by the administrator and will be released after all students conclude the exam.
                  </span>
                </div>
              )}

              {/* Question Breakdown Accordion */}
              <div className="space-y-3 mb-8">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Questions Review ({resultData?.breakdown?.length || 20} Questions)
                </h2>

                <div className="space-y-2.5">
                  {resultData?.breakdown?.map((q) => {
                    const isExpanded = expandedQuestion === q.questionNumber;
                    const isCorrect = q.isCorrect;
                    const isAnswered = q.isAnswered;

                    return (
                      <div
                        key={q.questionNumber}
                        className={`border rounded-xl transition-all overflow-hidden ${
                          isCorrect
                            ? 'bg-[#0c121e] border-emerald-900/40'
                            : isAnswered
                            ? 'bg-[#0c121e] border-rose-900/40'
                            : 'bg-[#0c121e] border-slate-800'
                        }`}
                      >
                        {/* Summary Bar */}
                        <div
                          onClick={() => setExpandedQuestion(isExpanded ? null : q.questionNumber)}
                          className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs cursor-pointer select-none hover:bg-slate-800/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center shrink-0 text-xs ${
                                isCorrect
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                                  : isAnswered
                                  ? 'bg-rose-950 text-rose-400 border border-rose-700/50'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              Q{q.questionNumber}
                            </span>
                            <div className="truncate">
                              <div className="font-bold text-slate-200 truncate">{q.title}</div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span className="text-indigo-400">{q.topic}</span>
                                <span>•</span>
                                <span>Your Answer: <strong>{q.selectedOption || 'None'}</strong></span>
                                {resultData?.showExplanations && q.correctOption && (
                                  <>
                                    <span>•</span>
                                    <span>Correct: <strong className="text-emerald-400">{q.correctOption}</strong></span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span
                                className={`font-extrabold text-sm ${
                                  isCorrect ? 'text-emerald-400' : 'text-slate-500'
                                }`}
                              >
                                {q.score}
                              </span>
                              <span className="text-[11px] text-slate-500"> / {q.marks}</span>
                            </div>

                            <div className="w-6 flex justify-center">
                              {isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : isAnswered ? (
                                <XCircle className="w-5 h-5 text-rose-400" />
                              ) : (
                                <HelpCircle className="w-5 h-5 text-slate-500" />
                              )}
                            </div>

                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Detail Panel */}
                        {isExpanded && (
                          <div className="p-4 pt-1 border-t border-slate-800/80 bg-[#080d15] space-y-3 text-xs">
                            {q.codeSnippet && (
                              <pre className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-indigo-200 overflow-x-auto border border-slate-800">
                                <code>{q.codeSnippet}</code>
                              </pre>
                            )}

                            {/* Options List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options?.map((opt) => {
                                const isUserChoice = q.selectedOption === opt.key;
                                const isCorrectChoice = resultData?.showExplanations && q.correctOption === opt.key;

                                let borderStyle = 'border-slate-800 bg-slate-900/60 text-slate-300';
                                if (isCorrectChoice) {
                                  borderStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold';
                                } else if (isUserChoice && !isCorrect) {
                                  borderStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                                }

                                return (
                                  <div
                                    key={opt.key}
                                    className={`p-2.5 rounded-lg border text-[11px] flex items-center gap-2 ${borderStyle}`}
                                  >
                                    <span className="font-mono font-bold w-5">{opt.key}.</span>
                                    <span className="font-mono flex-1">{opt.text}</span>
                                    {isUserChoice && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                        Your Choice
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Step-by-Step Explanation */}
                            {resultData?.showExplanations && q.explanation && (
                              <div className="p-3 bg-indigo-950/30 border border-indigo-800/50 rounded-lg text-indigo-200 leading-relaxed text-[11px]">
                                <strong className="text-indigo-400 block mb-1">Explanation:</strong>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <Link
                  to="/leaderboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>View Official Leaderboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/"
                  className="w-full sm:w-auto text-center text-xs text-slate-400 hover:text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  Back to Portal Home
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Result;
