/**
 * Timer Component
 * Displays remaining time with animated progress
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export const Timer = ({ timeLeft, isActive, className = '' }) => {
  const TOTAL_TIME = 60;
  const percentage = (timeLeft / TOTAL_TIME) * 100;


  let colorClass = 'text-emerald-500';
  let bgClass = 'bg-emerald-500';
  if (timeLeft <= 10) {
    colorClass = 'text-red-500';
    bgClass = 'bg-red-500';
  } else if (timeLeft <= 30) {
    colorClass = 'text-amber-500';
    bgClass = 'bg-amber-500';
  }


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`glass-panel rounded-2xl p-4 flex flex-col items-center gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <Clock className={`w-7 h-7 ${isActive ? 'animate-pulse' : ''} ${colorClass}`} />
        <span className={`text-4xl font-extrabold tracking-tight font-outfit ${colorClass}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200/50 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={`h-full rounded-full ${bgClass}`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>

      {!isActive && timeLeft === 0 && (
        <p className="text-red-500 font-bold text-sm uppercase tracking-wider mt-1">Time's Up!</p>
      )}
    </div>
  );
};
