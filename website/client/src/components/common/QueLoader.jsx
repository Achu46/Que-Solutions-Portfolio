import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function QueLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    // Lock body scroll while loader is visible
    document.body.style.overflow = 'hidden';

    const duration = 1100; // ~1.1s smooth load sequence
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = '';
        }, 150);
      }
    }, 20);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="que-loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{
            backgroundColor: isDark ? '#060A04' : '#F6F9F2',
          }}
          aria-label="QUE Loading"
          role="status"
        >
          {/* Ambient Brand Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background: isDark
                ? 'radial-gradient(circle at 50% 48%, rgba(84, 112, 63, 0.28) 0%, rgba(31, 138, 58, 0.12) 35%, rgba(6, 10, 4, 0.95) 75%)'
                : 'radial-gradient(circle at 50% 48%, rgba(148, 179, 128, 0.35) 0%, rgba(84, 112, 63, 0.12) 40%, rgba(246, 249, 242, 0.95) 75%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-sm text-center">
            
            {/* 1. Official Emblem with Orbiting Glow */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-6">
              
              {/* Outer Rotating Energy Ring */}
              <svg 
                className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite]"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke={isDark ? '#B8E08A' : '#54703F'}
                  strokeWidth="2"
                  strokeDasharray="25 75"
                  strokeLinecap="round"
                  className="opacity-70"
                />
              </svg>

              {/* Counter-rotating subtle track */}
              <svg 
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-[spin_7s_linear_infinite_reverse]"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={isDark ? '#5FBF4A' : '#94B380'}
                  strokeWidth="1.5"
                  strokeDasharray="40 90"
                  strokeLinecap="round"
                  className="opacity-50"
                />
              </svg>

              {/* Pulsing Backlight */}
              <div 
                className="absolute inset-3 rounded-full animate-pulse pointer-events-none"
                style={{
                  background: isDark
                    ? 'radial-gradient(circle, rgba(184, 224, 138, 0.35) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(84, 112, 63, 0.25) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />

              {/* Official Que Solutions Circular Logo Emblem */}
              <motion.img
                src={isDark ? '/logo-circle-dark.png' : '/logo-circle-light.png'}
                alt="QUE SOLUTIONS"
                className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: [0.94, 1.02, 0.94], opacity: 1 }}
                transition={{
                  scale: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
                  opacity: { duration: 0.4 },
                }}
              />
            </div>

            {/* 2. Brand Name */}
            <h2 className="text-sm sm:text-base font-bold tracking-[0.25em] text-text uppercase leading-tight mb-2">
              QUE SOLUTIONS
            </h2>

            {/* 3. 'QUE Loading' Animation with Bouncing Dots */}
            <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold tracking-wider text-brand font-mono mb-6">
              <span>QUE Loading</span>
              <span className="flex items-center gap-1 ml-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>

            {/* 4. Smooth Neon Progress Bar */}
            <div className="w-48 sm:w-56 h-1.5 rounded-full bg-surface border border-border/70 p-0.5 overflow-hidden shadow-inner mb-3">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand via-[#5FBF4A] to-[#B8E08A]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* 5. Percentage & Subtitle */}
            <div className="flex items-center justify-between w-48 sm:w-56 text-[10px] font-mono text-text/60">
              <span className="uppercase tracking-widest text-brand font-bold">Initialising</span>
              <span className="font-semibold text-text">{progress}%</span>
            </div>

            {/* Subtle Brand Tagline */}
            <p className="text-[10px] sm:text-[11px] tracking-widest uppercase text-text/50 font-medium mt-6">
              People Today. A Brighter Tomorrow.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
