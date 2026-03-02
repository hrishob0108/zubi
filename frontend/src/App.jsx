/**
 * Main App Component
 * Orchestrates the entire child interaction experience
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { ImageDisplay } from './components/ImageDisplay';
import { MicButton } from './components/MicButton';
import { Timer } from './components/Timer';
import { TranscriptArea } from './components/TranscriptArea';
import { Confetti } from './components/Confetti';
import {
  startListening,
  stopListening,
  abortListening,
} from './utils/speechRecognition';
import { speak, stopSpeaking, isSpeaking } from './utils/textToSpeech';
import { initializeSession, sendMessage, healthCheck } from './utils/apiClient';

const TOTAL_TIME = 60; // 60 seconds conversation
const TIMER_INTERVAL = 1000; // 1 second

export default function App() {

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isListening, setIsListening] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [highlightedObject, setHighlightedObject] = useState(null);
  const [celebrateTriggered, setCelebrateTriggered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);


  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const autoListenTimeoutRef = useRef(null);

  /**
   * Initialize app on component mount
   */
  useEffect(() => {
    const initializeApp = async () => {

      const isHealthy = await healthCheck();
      setApiAvailable(isHealthy);

      if (!isHealthy) {
        console.warn('⚠️ Backend API not available, using mock responses');
      }


      try {
        const sessionData = await initializeSession();
        setSessionId(sessionData.sessionId);


        setMessages([
          {
            type: 'ai',
            text: sessionData.initialMessage,
          },
        ]);


        setIsConversationActive(true);


        speak(sessionData.initialMessage, () => {
          autoActivateMic();
        });
      } catch (error) {
        setMessages([
          {
            type: 'ai',
            text: 'Hi! Welcome to our conversation! Click the microphone to start speaking.',
          },
        ]);
        setIsConversationActive(true);
      }
    };

    initializeApp();

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (autoListenTimeoutRef.current) clearTimeout(autoListenTimeoutRef.current);
      stopSpeaking();
      abortListening(recognitionRef.current);
    };
  }, []);

  /**
   * Timer effect
   */
  useEffect(() => {
    if (!isConversationActive || timeLeft === 0) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleConversationEnd();
          return 0;
        }
        return prev - 1;
      });
    }, TIMER_INTERVAL);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isConversationActive, timeLeft]);

  /**
   * Auto activate mic
   */
  const autoActivateMic = () => {
    if (autoListenTimeoutRef.current) clearTimeout(autoListenTimeoutRef.current);

    autoListenTimeoutRef.current = setTimeout(() => {
      if (isConversationActive && !isSpeaking() && !isListening) {
        handleStartListening();
      }
    }, 500);
  };

  /**
   * Handle mic button
   */
  const handleMicButton = () => {
    if (!isConversationActive) return;

    if (isListening) {
      stopListening(recognitionRef.current);
      setIsListening(false);
    } else {
      handleStartListening();
    }
  };

  /**
   * Start listening
   */
  const handleStartListening = () => {
    setIsListening(true);
    setInterimTranscript('');
    recognitionRef.current = startListening(
      handleTranscriptResult,
      handleRecognitionError,
      handleRecognitionEnd
    );
  };

  const handleTranscriptResult = async (transcript) => {
    if (!transcript.trim()) return;

    setIsListening(false);
    setInterimTranscript('');

    setMessages((prev) => [
      ...prev,
      { type: 'user', text: transcript },
    ]);

    await sendToAI(transcript);
  };

  const handleRecognitionError = (error) => {
    setIsListening(false);
    if (error !== 'aborted') {

    }
  };

  const handleRecognitionEnd = () => {
    setIsListening(false);
  };

  const sendToAI = async (userMessage) => {
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage, sessionId);
      const messageText = response.message || 'I see!';
      const tool = response.tool;

      setMessages((prev) => [
        ...prev,
        { type: 'ai', text: messageText },
      ]);

      if (tool) handleToolCall(tool);

      speak(messageText, () => {
        autoActivateMic();
      });
    } catch (error) {
      const fallbackMessage = 'That is so cool! Tell me more!';
      setMessages((prev) => [
        ...prev,
        { type: 'ai', text: fallbackMessage },
      ]);
      speak(fallbackMessage, () => autoActivateMic());
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolCall = (tool) => {
    if (!tool || !tool.name) return;

    if (tool.name === 'highlight_object') {
      setHighlightedObject(tool.object);
      setTimeout(() => setHighlightedObject(null), 3000);
    } else if (tool.name === 'celebrate') {
      setCelebrateTriggered(true);
      setTimeout(() => setCelebrateTriggered(false), 3500);
    }
  };

  const handleConversationEnd = () => {
    setIsConversationActive(false);
    stopListening(recognitionRef.current);
    setIsListening(false);

    const goodbyeMessage = 'Great job! You were amazing! Goodbye!';
    setMessages((prev) => [
      ...prev,
      { type: 'ai', text: goodbyeMessage },
    ]);
    speak(goodbyeMessage);
  };

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center pb-24 safe-p-b cursor-default relative overflow-hidden">

      {/* Decorative background blobs */}
      <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      <main className="max-w-5xl w-full mx-auto relative z-10 flex flex-col gap-8">

        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 drop-shadow-sm flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-pink-500" />
            AI Buddy
            <Sparkles className="w-10 h-10 text-indigo-500" />
          </h1>

          <div className="flex justify-center items-center gap-2 text-indigo-900/70 font-medium">
            {!apiAvailable ? (
              <span className="flex items-center gap-2 bg-amber-100/80 px-4 py-1.5 rounded-full border border-amber-200 backdrop-blur-md">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Offline Demo Mode
              </span>
            ) : isConversationActive ? (
              <span className="flex items-center gap-2 bg-emerald-100/80 px-4 py-1.5 rounded-full border border-emerald-200 backdrop-blur-md text-emerald-700">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                Live Session
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-slate-200/80 px-4 py-1.5 rounded-full border border-slate-300 backdrop-blur-md">
                Session Ended
              </span>
            )}
          </div>
        </motion.header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left side mapping: Image and Timer */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ImageDisplay highlightedObject={highlightedObject} />
            <Timer timeLeft={timeLeft} isActive={isConversationActive} className="w-full max-w-sm mx-auto" />
          </div>

          {/* Right side: Chat interface */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <TranscriptArea messages={messages} interimTranscript={interimTranscript} />

            <div className="flex flex-col items-center gap-4 mt-2">
              <MicButton
                isListening={isListening}
                isDisabled={!isConversationActive}
                isLoading={isLoading}
                onClick={handleMicButton}
                className="w-full max-w-xs"
              />
            </div>
          </div>

        </div>

        {/* Session End Modal */}
        <AnimatePresence>
          {!isConversationActive && timeLeft === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center gap-6 border border-white"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-200">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold text-slate-800 font-outfit">
                    Great Job! 🎉
                  </h2>
                  <p className="text-slate-600 text-lg">
                    You're an amazing conversationalist! Thanks for chatting.
                  </p>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95"
                >
                  <RefreshCw className="w-5 h-5" />
                  Start New Session
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Confetti trigger={celebrateTriggered} />
    </div>
  );
}
