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
  Code2,
  FileCode2,
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

        // Confetti celebration if score >= 90 / 150 (60%)
        if (res.data.totalScore >= 90) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error('Fetch result error:', err);
        setError(err.response?.data?.message || 'Failed to fetch event result.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [studentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
          Calculating your final evaluation and score out of 150 points...
        </div>
      </div>
    );
  }

  const maxScore = resultData?.maxTotalScore || 150;
  const score = resultData?.totalScore || 0;
  const mcqScore = resultData?.mcqScore || 0;
  const codingScore = resultData?.codingScore || 0;
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-sm">
          {/* Header Banner */}
          <div className="text-center pb-6 border-b border-slate-200">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>CODE VERSE WITH JAVA</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              EVENT COMPLETED
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Candidate: <strong className="text-slate-900">{resultData?.user?.name}</strong> ({resultData?.user?.studentId})
            </p>
          </div>

          {error ? (
            <div className="p-4 my-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center">
              {error}
            </div>
          ) : (
            <>
              {/* Grand Total Score & Time Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                {/* Grand Total Score Card */}
                <div className="bg-gradient-to-br from-indigo-50/80 to-white border border-indigo-100 rounded-2xl p-6 text-center relative overflow-hidden shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Grand Total Score
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
                    <span className="text-indigo-600">{score}</span>
                    <span className="text-slate-400 text-2xl font-semibold">/ {maxScore}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 font-medium">
                    {percentage}% Overall Achievement Rating
                  </div>
                </div>

                {/* Time Taken Card */}
                <div className="bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-100 rounded-2xl p-6 text-center relative overflow-hidden shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Completion Time
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight font-mono">
                    {resultData?.timeTaken || '00:00'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Out of 40:00 limit</span>
                  </div>
                </div>
              </div>

              {/* Section-Wise Score Breakdown (Section A: /100, Section B: /50) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Section A Card */}
                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">
                      Section A: Java MCQs
                    </span>
                    <span className="text-xs text-slate-500">20 Questions (5 pts each)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-600">{mcqScore}</span>
                    <span className="text-xs text-slate-400 font-semibold"> / 100 Pts</span>
                  </div>
                </div>

                {/* Section B Card */}
                <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
                      Section B: Java Coding
                    </span>
                    <span className="text-xs text-slate-500">2 Problems (25 pts each)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-purple-600">{codingScore}</span>
                    <span className="text-xs text-slate-400 font-semibold"> / 50 Pts</span>
                  </div>
                </div>
              </div>

              {/* Accuracy Metrics Row */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-500 block font-medium">MCQs Correct</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    {resultData?.correctCount || 0}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                  <XCircle className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-500 block font-medium">MCQs Incorrect</span>
                  <span className="text-lg font-extrabold text-rose-600">
                    {resultData?.incorrectCount || 0}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                  <HelpCircle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-500 block font-medium">Unanswered</span>
                  <span className="text-lg font-extrabold text-slate-700">
                    {resultData?.unansweredCount || 0}
                  </span>
                </div>
              </div>

              {/* Notice regarding explanation visibility */}
              {!resultData?.showExplanations && (
                <div className="p-3 mb-6 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>
                    Detailed answer explanations are currently locked by the administrator and will be released after the event concludes.
                  </span>
                </div>
              )}

              {/* Question Breakdown Accordion */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Evaluation Breakdown ({resultData?.breakdown?.length || 22} Questions)
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">Grand Total: 150 Points</span>
                </div>

                <div className="space-y-2.5">
                  {resultData?.breakdown?.map((q) => {
                    const isExpanded = expandedQuestion === q.questionNumber;
                    const isCoding = q.section === 'B' || q.type === 'coding';
                    const isCorrect = q.isCorrect;
                    const isAnswered = q.isAnswered;

                    return (
                      <div
                        key={q.questionNumber}
                        className={`border rounded-xl transition-all overflow-hidden ${
                          isCorrect || (isCoding && q.score > 0)
                            ? 'bg-emerald-50/20 border-emerald-200'
                            : isAnswered
                            ? 'bg-rose-50/20 border-rose-200'
                            : 'bg-white border-slate-200 shadow-sm'
                        }`}
                      >
                        {/* Summary Bar */}
                        <div
                          onClick={() => setExpandedQuestion(isExpanded ? null : q.questionNumber)}
                          className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs cursor-pointer select-none hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center shrink-0 text-xs ${
                                isCoding
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                  : isCorrect
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : isAnswered
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              Q{q.questionNumber}
                            </span>
                            <div className="truncate">
                              <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                <span>{q.title}</span>
                                <span
                                  className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                                    isCoding ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                                  }`}
                                >
                                  {isCoding ? 'Section B' : 'Section A'}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                                <span className="text-indigo-600 font-medium">{q.topic}</span>
                                <span>•</span>
                                {isCoding ? (
                                  <span>
                                    Tests Passed: <strong>{q.passedTests} / {q.totalTests}</strong>
                                  </span>
                                ) : (
                                  <span>
                                    Your Answer: <strong>{q.selectedOption || 'None'}</strong>
                                  </span>
                                )}
                                {resultData?.showExplanations && q.correctOption && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      Correct: <strong className="text-emerald-600">{q.correctOption}</strong>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span
                                className={`font-extrabold text-sm ${
                                  q.score > 0 ? 'text-emerald-600' : 'text-slate-400'
                                }`}
                              >
                                {q.score}
                              </span>
                              <span className="text-[11px] text-slate-400"> / {q.marks} Pts</span>
                            </div>

                            <div className="w-6 flex justify-center">
                              {isCorrect || (isCoding && q.score === q.marks) ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : isAnswered ? (
                                <XCircle className="w-5 h-5 text-rose-500" />
                              ) : (
                                <HelpCircle className="w-5 h-5 text-slate-400" />
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
                          <div className="p-4 pt-2 border-t border-slate-200 bg-slate-50/80 space-y-3 text-xs">
                            {/* Problem prompt / description */}
                            {q.description && (
                              <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                                {q.description}
                              </div>
                            )}

                            {/* Code snippet for MCQ */}
                            {!isCoding && q.codeSnippet && (
                              <pre className="p-3 bg-[#0d131f] rounded-lg font-mono text-[11px] text-indigo-200 overflow-x-auto border border-slate-800">
                                <code>{q.codeSnippet}</code>
                              </pre>
                            )}

                            {/* Submitted solution for Coding */}
                            {isCoding && q.code && (
                              <div>
                                <span className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Your Submitted Solution (Java):
                                </span>
                                <pre className="p-3 bg-[#0d131f] rounded-lg font-mono text-[11px] text-purple-200 overflow-x-auto border border-slate-800">
                                <code>{q.code}</code>
                              </pre>
                            </div>
                            )}

                            {/* Options List for MCQ */}
                            {!isCoding && q.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options.map((opt) => {
                                  const isUserChoice = q.selectedOption === opt.key;
                                  const isCorrectChoice = resultData?.showExplanations && q.correctOption === opt.key;

                                  let borderStyle = 'border-slate-200 bg-white text-slate-700';
                                  if (isCorrectChoice) {
                                    borderStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                                  } else if (isUserChoice && !isCorrect) {
                                    borderStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-medium';
                                  }

                                  return (
                                    <div
                                      key={opt.key}
                                      className={`p-2.5 rounded-lg border text-[11px] flex items-center gap-2 ${borderStyle}`}
                                    >
                                      <span className="font-mono font-bold w-5">{opt.key}.</span>
                                      <span className="font-mono flex-1">{opt.text}</span>
                                      {isUserChoice && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                                          Your Choice
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Step-by-Step Explanation */}
                            {resultData?.showExplanations && q.explanation && (
                              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 leading-relaxed text-[11px]">
                                <strong className="text-indigo-700 block mb-1">Explanation:</strong>
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

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
                <Link
                  to="/leaderboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>View Live Leaderboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/rules"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <span>Event Rules and Guidelines</span>
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
