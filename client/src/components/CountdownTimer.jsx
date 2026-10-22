import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useExam } from '../context/ExamContext';

const CountdownTimer = () => {
  const { remainingSeconds, isExamLocked } = useExam();

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = remainingSeconds <= 300 && remainingSeconds > 0; // Under 5 minutes
  const isCritical = remainingSeconds <= 60 && remainingSeconds > 0; // Under 1 minute

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono font-bold text-sm tracking-wider border transition-all ${
        isCritical
          ? 'bg-rose-50 border-rose-400 text-rose-700 animate-pulse'
          : isUrgent
          ? 'bg-amber-50 border-amber-300 text-amber-800'
          : 'bg-slate-100 border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
      ) : (
        <Clock className={`w-4 h-4 ${isUrgent ? 'text-amber-600' : 'text-indigo-600'}`} />
      )}
      <span className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold">
        TIME LEFT:
      </span>
      <span className="text-base font-bold text-indigo-700">{isExamLocked ? '00:00' : formattedTime}</span>
    </div>
  );
};

export default CountdownTimer;
