/**
 * TranscriptArea Component
 * Displays the conversation history like a modern chat app
 */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot } from 'lucide-react';

export const TranscriptArea = ({ messages, interimTranscript, className = '' }) => {
  const scrollRef = useRef(null);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, interimTranscript]);

  return (
    <div className={`glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[400px] ${className}`}>
      {/* Header */}
      <div className="bg-white/40 border-b border-white/50 p-4 shrink-0">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-outfit">
          <Bot className="w-6 h-6 text-indigo-600" />
          Live Chat
        </h3>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 transcript-scroll scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && !interimTranscript && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60"
            >
              <Bot className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-center text-lg font-medium">Say hello to start chatting!</p>
            </motion.div>
          )}

          {messages.map((msg, idx) => {
            const isUser = msg.type === 'user';

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] gap-3 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isUser ? 'bg-gradient-to-tr from-blue-500 to-indigo-500' : 'bg-gradient-to-tr from-emerald-400 to-teal-500'}`}>
                    {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-6 h-6 text-white" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`
                    p-4 rounded-3xl shadow-sm text-[1.05rem] leading-relaxed
                    ${isUser
                      ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
                    }
                  `}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Interim Transcript (What user is currently saying) */}
          {interimTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full justify-end"
            >
              <div className="flex max-w-[85%] gap-3 items-end flex-row-reverse">
                <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-md opacity-70">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="p-4 rounded-3xl rounded-br-none bg-indigo-100 text-indigo-900 shadow-sm text-[1.05rem] italic opacity-80 animate-pulse">
                  {interimTranscript} ...
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
