import React from 'react';

// Fallback Poster Component for no-WebGL, reduced-motion, low-end devices & errors
export default function HeroPosterFallback({ isDark }) {
  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] flex items-center justify-center select-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/10 via-transparent to-brand-400/10 rounded-3xl blur-2xl pointer-events-none" />
      
      {/* Decorative CSS Float Animated Infinity Silhouette */}
      <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center animate-float">
        <svg viewBox="0 0 200 120" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#94B380' : '#54703F'} />
              <stop offset="50%" stopColor={isDark ? '#B8CEA8' : '#6C8C54'} />
              <stop offset="100%" stopColor={isDark ? '#94B380' : '#425832'} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M 50 60 C 20 20, 0 60, 50 100 C 100 140, 100 -20, 150 20 C 200 60, 180 100, 150 60 C 100 20, 100 100, 50 60 Z"
            fill="none"
            stroke="url(#infinityGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        </svg>

        {/* Orbiting Badges */}
        <div className="absolute -top-2 left-6 p-2 rounded-xl border border-border bg-elevated shadow-lg text-xs font-semibold text-text">
          🎧 Live Voice
        </div>
        <div className="absolute top-1/2 -right-4 p-2 rounded-xl border border-border bg-elevated shadow-lg text-xs font-semibold text-text">
          💬 Instant Chat
        </div>
        <div className="absolute -bottom-2 left-12 p-2 rounded-xl border border-border bg-elevated shadow-lg text-xs font-semibold text-text">
          ✓ Verified SLA
        </div>
      </div>
    </div>
  );
}
