import React from 'react';

/**
 * Fallback static pre-rendered poster of the particle form
 * for no WebGL, prefers-reduced-motion, low-end devices, or ErrorBoundary fallbacks.
 * Displays light and dark variants with only a subtle CSS float.
 */
export default function HeroPosterFallback({ isDark }) {
  const primaryGlow = isDark ? '#1F8A3A' : '#54703F';
  const highlightGlow = isDark ? '#B8E08A' : '#94B380';
  const coreColor = isDark ? '#5FBF4A' : '#425832';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Background Volumetric Glow Halo */}
      <div
        className="w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] rounded-full blur-3xl opacity-35 transition-opacity duration-500"
        style={{
          background: isDark
            ? `radial-gradient(circle, ${highlightGlow} 0%, ${primaryGlow} 45%, transparent 75%)`
            : `radial-gradient(circle, ${highlightGlow} 0%, ${primaryGlow} 50%, transparent 75%)`,
        }}
      />

      {/* Static Particle Form Poster with Subtle CSS Float */}
      <div className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] flex items-center justify-center animate-float">
        <svg
          viewBox="-100 -100 200 200"
          className="w-full h-full drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="fallbackDotDark" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="35%" stopColor={highlightGlow} stopOpacity="0.85" />
              <stop offset="70%" stopColor={coreColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={primaryGlow} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="fallbackDotLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#425832" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#54703F" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#94B380" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#94B380" stopOpacity="0" />
            </radialGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Customer Care Headset Form of Glowing Dots */}
          <g filter="url(#softGlow)" fill={isDark ? 'url(#fallbackDotDark)' : 'url(#fallbackDotLight)'}>
            {/* 1. Headband Arc (~200 degrees) */}
            {Array.from({ length: 70 }).map((_, i) => {
              const theta = (-10 + (i / 70) * 200) * (Math.PI / 180);
              const R = 58;
              const jitter = ((i % 3) - 1) * 1.5;
              const cx = (R + jitter) * Math.cos(theta);
              const cy = -(R + jitter) * Math.sin(theta) + 12;
              return (
                <circle
                  key={`arc-${i}`}
                  cx={cx}
                  cy={cy}
                  r={2.6 + (i % 3) * 0.4}
                  opacity={0.85}
                />
              );
            })}

            {/* 2. Left Ear Cup & Cushion */}
            {Array.from({ length: 45 }).map((_, i) => {
              const angle = (i / 45) * Math.PI * 2;
              const r = 18 * Math.sqrt((i % 15) / 15 + 0.1);
              const cx = -56 + (i % 3 - 1) * 3;
              const cy = 20 + r * Math.sin(angle);
              return (
                <circle
                  key={`left-cup-${i}`}
                  cx={cx}
                  cy={cy}
                  r={2.2 + (i % 4) * 0.4}
                  opacity={0.88}
                />
              );
            })}

            {/* 3. Right Ear Cup & Cushion */}
            {Array.from({ length: 45 }).map((_, i) => {
              const angle = (i / 45) * Math.PI * 2;
              const r = 18 * Math.sqrt((i % 15) / 15 + 0.1);
              const cx = 56 + (i % 3 - 1) * 3;
              const cy = 20 + r * Math.sin(angle);
              return (
                <circle
                  key={`right-cup-${i}`}
                  cx={cx}
                  cy={cy}
                  r={2.2 + (i % 4) * 0.4}
                  opacity={0.88}
                />
              );
            })}

            {/* 4. Microphone Boom (Curving from lower left cup forward) */}
            {Array.from({ length: 30 }).map((_, i) => {
              const u = i / 30;
              const invU = 1.0 - u;
              // Bezier from (-56, 26) through (-36, 48) to (-12, 38)
              const bx = invU * invU * -56 + 2 * invU * u * -36 + u * u * -12;
              const by = invU * invU * 26 + 2 * invU * u * 48 + u * u * 38;
              return (
                <circle
                  key={`boom-${i}`}
                  cx={bx}
                  cy={by}
                  r={2.0 + (i % 2) * 0.3}
                  opacity={0.82}
                />
              );
            })}

            {/* 5. Microphone Tip Capsule */}
            {Array.from({ length: 14 }).map((_, i) => {
              const tipX = -12 + (i % 5 - 2) * 2;
              const tipY = 38 + (i % 3 - 1) * 2.5;
              return (
                <circle
                  key={`tip-${i}`}
                  cx={tipX}
                  cy={tipY}
                  r={2.8}
                  opacity={0.95}
                />
              );
            })}

            {/* 6. Shed particles drifting off microphone side */}
            {Array.from({ length: 20 }).map((_, i) => {
              const progress = i / 20;
              const driftX = -12 - progress * 40 + (i % 4) * 3;
              const driftY = 38 + progress * 24 + Math.sin(progress * 5) * 6;
              return (
                <circle
                  key={`shed-${i}`}
                  cx={driftX}
                  cy={driftY}
                  r={Math.max(1.2, 2.5 * (1.0 - progress * 0.6))}
                  opacity={Math.max(0.2, 0.8 - progress * 0.6)}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
