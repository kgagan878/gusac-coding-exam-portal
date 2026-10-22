import React from 'react';
import { AlertTriangle, CheckCircle, Bookmark, HelpCircle, Loader2 } from 'lucide-react';
import { useExam } from '../context/ExamContext';

const SubmitModal = ({ isOpen, onClose }) => {
  const {
    questions,
    selectedAnswers,
    submittedAnswers,
    codes,
    reviewStatus,
    finalizeExam,
    isFinalSubmitting,
  } = useExam();

  if (!isOpen) return null;

  const totalQuestions = questions.length || 22;

  // Count answered across both Section A (MCQs) and Section B (Coding)
  const answeredCount = questions.reduce((count, q) => {
    if (q.section === 'A' || q.type === 'mcq') {
      return (selectedAnswers[q._id] !== undefined && selectedAnswers[q._id] !== null) ? count + 1 : count;
    } else {
      const hasSubmitted = !!submittedAnswers[q._id];
      const hasCode = !!(codes[q._id] && codes[q._id].trim().length > 30);
      return (hasSubmitted || hasCode) ? count + 1 : count;
    }
  }, 0);

  const reviewCount = Object.keys(reviewStatus).filter((k) => reviewStatus[k]).length;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  const handleConfirm = async () => {
    try {
      await finalizeExam();
      onClose();
    } catch (error) {
      console.error('Final submit failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-slate-200 bg-slate-50">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Final Event Submission</h3>
            <p className="text-xs text-slate-500">Review your attempt summary before final submission</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to finalize your event submission? Once submitted, your MCQ answers and Java code solutions will be locked, your score will be calculated out of <strong>150 points</strong> (Section A: 100 pts, Section B: 50 pts), and your completion time will be officially recorded on the leaderboard.
          </p>

          {/* Answered / Review / Unanswered Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] text-slate-500 font-medium block">Answered</span>
              <span className="text-base font-extrabold text-emerald-700">
                {answeredCount} / {totalQuestions}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
              <Bookmark className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <span className="text-[10px] text-slate-500 font-medium block">In Review</span>
              <span className="text-base font-extrabold text-amber-700">
                {reviewCount}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
              <HelpCircle className="w-4 h-4 text-slate-500 mx-auto mb-1" />
              <span className="text-[10px] text-slate-500 font-medium block">Unanswered</span>
              <span className="text-base font-extrabold text-slate-700">
                {unansweredCount}
              </span>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              ⚠️ You have <strong>{unansweredCount} unattempted question(s)</strong>. Questions left unanswered will receive 0 marks.
            </div>
          )}

          {reviewCount > 0 && (
            <div className="text-[11px] text-purple-800 bg-purple-50 p-2.5 rounded-lg border border-purple-200">
              ℹ️ You have <strong>{reviewCount} question(s) marked for review</strong>.
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isFinalSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel & Return to Event
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isFinalSubmitting}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isFinalSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <span>Confirm & Submit (150 Pts)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
