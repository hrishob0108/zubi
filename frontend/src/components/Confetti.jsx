/**
 * Confetti Component
 * High performance, CSS-based confetti effect
 */
import React, { useEffect, useState } from 'react';

export const Confetti = ({ trigger }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {

      const newParticles = Array.from({ length: 100 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100, // percentage string
        color: ['#ffc82c', '#f15a24', '#29abe2', '#8cc63f', '#ea1c2c', '#d24a9e'][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 12,
      }));

      setParticles(newParticles);


      const cleanup = setTimeout(() => {
        setParticles([]);
      }, 5000);

      return () => clearTimeout(cleanup);
    }
  }, [trigger]);

  if (!trigger && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti absolute drop-shadow-sm"
          style={{
            left: `${p.x}vw`,
            top: '-5vh',
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' // Rectangle shape
          }}
        />
      ))}
    </div>
  );
};
