/**
 * ImageDisplay Component
 * Shows the park image with interactive highlight zones
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

export const ImageDisplay = ({ highlightedObject, className = '' }) => {


  const objects = {
    dog: { top: '75%', left: '42%', width: '12%', height: '15%' },
    tree: { top: '10%', left: '70%', width: '25%', height: '45%' },
    swing: { top: '35%', left: '20%', width: '15%', height: '30%' },
    flower: { top: '80%', left: '80%', width: '8%', height: '10%' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative w-full aspect-video rounded-3xl overflow-hidden glass-panel border-4 border-white shadow-2xl ${className}`}
    >
      {/* Background Image Loading Placeholder */}
      <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
        <ImageIcon className="w-16 h-16 text-slate-400 opacity-50" />
      </div>

      {/* Main Image */}
      {/* We use a placeholder image for now, but in a real app this would be a high-res asset */}
      <img
        src="https://images.unsplash.com/photo-1544473244-f6895e69ce8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        alt="A beautiful park with a dog, trees, and swings"
        className="w-full h-full object-cover relative z-10 transition-transform duration-1000 hover:scale-105"
        crossOrigin="anonymous"
      />

      {/* Interactive Highlights Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence>
          {highlightedObject && objects[highlightedObject] && (
            <motion.div
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', damping: 15 }}
              className="glow-highlight"
              style={{
                top: objects[highlightedObject].top,
                left: objects[highlightedObject].left,
                width: objects[highlightedObject].width,
                height: objects[highlightedObject].height,
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Optional Gradient Overlay for text readability if text is overlaid */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
    </motion.div>
  );
};
