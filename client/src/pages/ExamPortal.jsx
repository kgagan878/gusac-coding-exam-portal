import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Send,
  HelpCircle,
  Copy,
  Check,
  Tag,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import SubmitModal from '../components/SubmitModal';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';

const DIFFICULTY_COLORS = {
  Easy: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
  Medium: 'bg-amber-950/80 text-amber-300 border-amber-700/50',
  Hard: 'bg-rose-950/80 text-rose-300 border-rose-700/50',
};

const ExamPortal = () => {
  const { studentUser } = useAuth();
  const {
    questions,
    currentIdx,
    setCurrentIdx,
    currentQuestion,
    loadingQuestions,
    selectedAnswers,
    reviewStatus,
    selectOption,
    toggleReview,
    clearResponse,
    isExamLocked,
    syncExamSession,
  } = useExam();

  const navigate = useNavigate();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!studentUser) {
      navigate('/exam');
      return;
    }
    syncExamSession();
  }, [studentUser]);

  if (!studentUser) return null;

  const totalQuestions = questions.length || 20;
  const answeredCount = Object.keys(selectedAnswers).filter((k) => selectedAnswers[k] !== null).length;
  const reviewCount = Object.keys(reviewStatus).filter((k) => reviewStatus[k]).length;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentAnswer = currentQuestion ? selectedAnswers[currentQuestion._id] : null;
  const isCurrentReviewed = currentQuestion ? !!reviewStatus[currentQuestion._id] : false;

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col h-screen overflow-hidden">
      {/* Top Navbar with live 40:00 timer and submit button */}
      <Navbar onOpenSubmitModal={() => setIsSubmitModalOpen(true)} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-3 sm:p-4 gap-3 sm:gap-4 max-w-7xl mx-auto w-full">
        {/* Left Sidebar: 20-Question Grid Navigator */}
        <aside className="w-full md:w-80 bg-[#111827] border border-slate-800 rounded-2xl p-4 flex flex-col shrink-0 overflow-y-auto shadow-xl">
          <div className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Question Navigator
              </span>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {answeredCount} / {totalQuestions} Answered
              </span>
            </div>

            {/* Quick Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Grid (1 to 20) */}
          <div className="my-4 flex-1">
            {loadingQuestions ? (
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-800/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isSelected = currentIdx === idx;
                  const isAnswered = selectedAnswers[q._id] !== undefined && selectedAnswers[q._id] !== null;
                  const isMarked = !!reviewStatus[q._id];

                  let btnStyle = 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-500';
                  if (isAnswered && isMarked) {
                    btnStyle = 'bg-emerald-700 text-amber-300 border-amber-400 shadow-sm';
                  } else if (isAnswered) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-500 shadow-sm';
                  } else if (isMarked) {
                    btnStyle = 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-bold';
                  }

                  if (isSelected) {
                    btnStyle += ' ring-2 ring-indigo-400 scale-[1.03]';
                  }

                  return (
                    <button
                      key={q._id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center relative cursor-pointer ${btnStyle}`}
                      title={`Q${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}${isMarked ? ' (Marked for Review)' : ''}`}
                    >
                      <span>{idx + 1}</span>
                      {isMarked && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 absolute top-1.5 right-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Legend */}
          <div className="space-y-1.5 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                <span>Answered</span>
              </span>
              <span className="font-bold text-emerald-400">{answeredCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                <span>Marked for Review</span>
              </span>
              <span className="font-bold text-amber-400">{reviewCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block" />
                <span>Unanswered</span>
              </span>
              <span className="font-bold text-slate-400">{unansweredCount}</span>
            </div>
          </div>

          {/* Quick Submit CTA */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Entire Exam</span>
            </button>
          </div>
        </aside>

        {/* Center / Right: Question Statement & MCQ Option Cards */}
        <main className="flex-1 bg-[#111827] border border-slate-800 rounded-2xl flex flex-col min-w-0 overflow-hidden shadow-2xl">
          {currentQuestion ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Question Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0d131f] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-extrabold text-xs">
                    Question {currentIdx + 1} of {totalQuestions}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-md border border-indigo-700/40">
                    <Tag className="w-3 h-3" />
                    <span>{currentQuestion.topic || 'Java SE'}</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      DIFFICULTY_COLORS[currentQuestion.difficulty] || ''
                    }`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/50">
                    +1 Mark
                  </span>
                </div>
              </div>

              {/* Scrollable Question Content & Snippet */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Prompt */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                    {currentQuestion.description || 'What will be the output of the following Java program?'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {currentQuestion.title}
                  </p>
                </div>

                {/* Java Code Snippet Container */}
                {currentQuestion.codeSnippet && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#080d15] shadow-inner group">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#0c121e] border-b border-slate-800/80 text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                        <span className="ml-2 text-slate-300 font-semibold">Main.java</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(currentQuestion.codeSnippet)}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                        title="Copy code snippet"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 text-xs sm:text-sm font-mono text-indigo-200 leading-relaxed overflow-x-auto selection:bg-indigo-700 selection:text-white">
                      <code>{currentQuestion.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Four Multiple-Choice Options */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Select Your Answer:
                  </span>

                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQuestion.options?.map((opt) => {
                      const isSelected = currentAnswer === opt.key;

                      return (
                        <div
                          key={opt.key}
                          onClick={() => selectOption(currentQuestion._id, opt.key)}
                          className={`p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-3.5 cursor-pointer select-none ${
                            isSelected
                              ? 'bg-indigo-950/70 border-indigo-500 text-white ring-1 ring-indigo-500/50 shadow-md shadow-indigo-950/30'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 text-xs transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-inner'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {opt.key}
                          </div>
                          <span className="font-mono flex-1 leading-relaxed">{opt.text}</span>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Action Controls */}
              <div className="p-4 bg-[#0d131f] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Mark for Review Button */}
                  <button
                    onClick={() => toggleReview(currentQuestion._id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isCurrentReviewed
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isCurrentReviewed ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{isCurrentReviewed ? 'Marked for Review' : 'Mark for Review'}</span>
                  </button>

                  {/* Clear Response Button */}
                  {currentAnswer && (
                    <button
                      onClick={() => clearResponse(currentQuestion._id)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 px-3 py-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear Response</span>
                    </button>
                  )}
                </div>

                {/* Previous & Next Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                    disabled={currentIdx === 0}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentIdx < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      className="flex items-center gap-1 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
                    >
                      <span>Review & Submit</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Loading questions...
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};

export default ExamPortal;
