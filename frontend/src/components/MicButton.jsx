/**
 * MicButton Component
 * Microphone input button with visual feedback and Framer Motion
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader2 } from 'lucide-react';

export const MicButton = ({ isListening, isDisabled, isLoading, onClick, className = '' }) => {
  return (
    <div className="relative flex justify-center items-center">
      {/* Ripple Rings when listening */}
      <AnimatePresence>
        {isListening && !isDisabled && !isLoading && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
              className="absolute rounded-full border-2 border-red-500 w-24 h-24 pointer-events-none"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
              className="absolute rounded-full border-2 border-red-400 w-24 h-24 pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={!isDisabled && !isLoading ? { scale: 1.05 } : {}}
        whileTap={!isDisabled && !isLoading ? { scale: 0.95 } : {}}
        onClick={onClick}
        disabled={isDisabled || isLoading}
        className={`
          flex items-center justify-center gap-3 px-8 py-5 rounded-full font-bold text-lg
          transition-colors duration-300 shadow-2xl relative z-10 overflow-hidden
          ${isListening && !isDisabled && !isLoading
            ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
          }
          ${(isDisabled || isLoading) ? 'opacity-60 cursor-not-allowed grayscale-[0.3]' : 'cursor-pointer hover:shadow-indigo-500/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]'}
          ${className}
        `}
        title={isLoading ? 'AI is thinking...' : isDisabled ? 'Conversation ended' : isListening ? 'Listening... Click to stop' : 'Click to speak'}
      >
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isListening ? (
            <Square className="w-6 h-6 fill-current" />
          ) : (
            <Mic className="w-6 h-6" />
          )}

          <span className="tracking-wide">
            {isLoading
              ? 'Thinking...'
              : isListening
                ? 'Stop Listening'
                : 'Tap to Speak'}
          </span>
        </div>

        {/* Shimmer effect inside button */}
        {!isDisabled && !isLoading && !isListening && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }} />
        )}
      </motion.button>
    </div>
  );
};
