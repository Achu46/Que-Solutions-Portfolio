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

          <div className="relative z-10 flex flex-col items-center justify-center p-4">
            {/* Official Que Solutions 3D Emblem with Orbiting Glow — Pure Logo Only */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
              
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
                  className="opacity-75"
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
                  className="opacity-55"
                />
              </svg>

              {/* Pulsing Backlight */}
              <div 
                className="absolute inset-3 rounded-full animate-pulse pointer-events-none"
                style={{
                  background: isDark
                    ? 'radial-gradient(circle, rgba(184, 224, 138, 0.4) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(84, 112, 63, 0.3) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                }}
              />

              {/* Official Que Solutions Circular Logo Emblem */}
              <motion.img
                src={isDark ? '/logo-circle-dark.png' : '/logo-circle-light.png'}
                alt="QUE SOLUTIONS"
                className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: [0.94, 1.03, 0.94], opacity: 1 }}
                transition={{
                  scale: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
                  opacity: { duration: 0.35 },
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
