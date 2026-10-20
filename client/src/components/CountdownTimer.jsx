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
          ? 'bg-rose-950/70 border-rose-500 text-rose-300 animate-pulse'
          : isUrgent
          ? 'bg-amber-950/60 border-amber-500/70 text-amber-300'
          : 'bg-slate-900 border-slate-700 text-indigo-300 shadow-inner'
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
      ) : (
        <Clock className={`w-4 h-4 ${isUrgent ? 'text-amber-400' : 'text-indigo-400'}`} />
      )}
      <span className="text-xs uppercase tracking-wider text-slate-400 font-sans font-semibold">
        TIME LEFT:
      </span>
      <span className="text-base font-bold">{isExamLocked ? '00:00' : formattedTime}</span>
    </div>
  );
};

export default CountdownTimer;
