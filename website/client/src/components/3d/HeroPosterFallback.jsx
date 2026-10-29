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

          {/* Organic Core Cluster of Glowing Dots */}
          <g filter="url(#softGlow)" fill={isDark ? 'url(#fallbackDotDark)' : 'url(#fallbackDotLight)'}>
            {/* Clustered Toroid / Organic Ring Dots */}
            {Array.from({ length: 96 }).map((_, i) => {
              const u = (i / 96) * Math.PI * 2;
              const rMajor = 52 + Math.sin(u * 3) * 6;
              const rMinor = 18 + Math.cos(u * 4) * 4;
              const cx = rMajor * Math.cos(u);
              const cy = (rMajor * Math.sin(u) * 0.65) + Math.sin(u * 2) * 8;
              const radius = 2.4 + (i % 5) * 0.6;
              return (
                <circle
                  key={`core-${i}`}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  opacity={0.65 + (i % 4) * 0.08}
                />
              );
            })}

            {/* Inner Dense Mass */}
            {Array.from({ length: 64 }).map((_, i) => {
              const u = (i / 64) * Math.PI * 2;
              const r = 32 + (i % 7) * 3;
              const cx = r * Math.cos(u);
              const cy = r * Math.sin(u) * 0.75;
              return (
                <circle
                  key={`inner-${i}`}
                  cx={cx}
                  cy={cy}
                  r={2.2 + (i % 3) * 0.5}
                  opacity={0.75}
                />
              );
            })}

            {/* Trailing Dispersal Particles Shedding to +X Right Side */}
            {Array.from({ length: 42 }).map((_, i) => {
              const progress = (i / 42);
              const driftX = 35 + progress * 55 + (i % 5) * 4;
              const driftY = -15 + progress * 32 + Math.sin(progress * 6) * 12;
              const radius = 3.2 * (1.0 - progress * 0.5);
              return (
                <circle
                  key={`dispersal-${i}`}
                  cx={driftX}
                  cy={driftY}
                  r={Math.max(radius, 1.2)}
                  opacity={Math.max(0.2, (1.0 - progress * 0.7))}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
