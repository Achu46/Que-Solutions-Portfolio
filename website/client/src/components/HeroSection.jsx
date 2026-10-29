import React, { Suspense, lazy } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import HeroPosterFallback from './3d/HeroPosterFallback';

// Lazy load the full Phase 2 3D Particle Canvas
const Hero3DCanvas = lazy(() => import('./3d/Hero3DCanvas'));

export default function HeroSection({ hero, settings }) {
  const { isDark } = useTheme();

  return (
    <section 
      id="home" 
      aria-label="Hero Section"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between p-3 sm:p-4 md:p-6 bg-bg overflow-hidden"
    >
      {/* =========================================================================
          THE INSET HERO CARD (Radius ~24-28px on pure black/white canvas)
          ========================================================================= */}
      <div 
        className="relative flex-1 w-full rounded-[26px] sm:rounded-[32px] border border-border/60 overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14 transition-colors duration-300 shadow-2xl"
        style={{
          background: 'var(--hero-gradient)',
        }}
      >
        {/* Soft volumetric light cone from top centre */}
        <div className="absolute inset-0 volumetric-cone z-0 pointer-events-none" />

        {/* Phase 2 3D WebGL / GLSL Glowing Dots Particle System with Full Postprocessing */}
        <Suspense fallback={<HeroPosterFallback isDark={isDark} />}>
          <Hero3DCanvas />
        </Suspense>

        {/* ---------------- TOP BAR INSIDE HERO CARD ---------------- */}
        <div className="relative z-20 flex items-center justify-between w-full">
          {/* Top-Left: Small Brand Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="QUE SOLUTIONS"
              className="h-9 sm:h-11 w-auto object-contain rounded-full border border-border/60 transition-transform group-hover:scale-105"
            />
            <span className="hidden sm:inline-block text-xs font-bold tracking-wider text-text">
              QUE SOLUTIONS
            </span>
          </a>

          {/* Top-Right: "Contact us" Pill with Accent Dot */}
          <a
            href="#contact"
            className="inverse inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-95 transition-all"
          >
            <span className="w-2 h-2 rounded-full accent-dot animate-pulse" />
            <span>Contact us</span>
          </a>
        </div>

        {/* ---------------- MAIN CONTENT: SPLIT HEADLINE & CONTENT ---------------- */}
        <div className="relative z-10 my-auto py-8 lg:py-12 flex flex-col justify-center max-w-7xl mx-auto w-full">
          
          {/* Bracketed Eyebrow */}
          <div className="mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm font-mono tracking-widest text-text font-semibold uppercase px-3 py-1 rounded-full border border-border/60 bg-surface/50 backdrop-blur-sm">
              [ SUPPORT | TECHNOLOGY | GROWTH ]
            </span>
          </div>

          {/* Two-Part Split Headline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            
            {/* Part 1: Left Lines (Very Large Lightweight Sans) */}
            <div className="lg:col-span-7 space-y-1">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.035em] text-text leading-[1.05]">
                Reliable Customer <br />
                <span className="font-normal">Support for</span>
              </h1>
            </div>

            {/* Part 2: Right (Lower) Lines with Paragraph Beside/Below */}
            <div className="lg:col-span-5 space-y-5 lg:pl-4">
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.035em] text-text leading-[1.05]">
                Growing <br />
                <span className="font-normal">Businesses.</span>
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-text opacity-85 leading-relaxed font-normal max-w-md">
                {hero?.subheadline ||
                  'Affordable outsourced customer care, call centre and chat support for small and growing product-based businesses.'}
              </p>

              {/* Pill CTA with Round Accent Dot */}
              <div className="pt-2">
                <a
                  href="#contact"
                  className="inverse inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xl hover:opacity-95 active:scale-95 transition-all"
                >
                  <span className="w-2.5 h-2.5 rounded-full accent-dot" />
                  <span>Get a Quote</span>
                  <ArrowUpRight className="w-4 h-4 ml-1 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- BOTTOM INDICATORS INSIDE HERO CARD ---------------- */}
        <div className="relative z-20 flex items-center justify-between w-full pt-4">
          {/* Bottom-Left: "Scroll to explore" */}
          <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-medium uppercase tracking-widest text-text opacity-70">
            <span className="w-4 h-4 rounded-full border border-border flex items-center justify-center">
              <ArrowDown className="w-2.5 h-2.5 animate-bounce" />
            </span>
            <span>Scroll to explore</span>
          </div>

          {/* Operating hours hint */}
          <div className="hidden sm:block text-[11px] font-mono text-text opacity-60">
            Mon–Sat • 4 hrs/day (~104 hrs/mo)
          </div>
        </div>
      </div>

      {/* Faint blurred reflection under the inset card */}
      <div 
        aria-hidden="true" 
        className="w-[90%] mx-auto h-8 hero-reflection-blur rounded-b-[40px] pointer-events-none -mt-4 z-0"
        style={{
          background: 'var(--hero-gradient)',
        }}
      />
    </section>
  );
}
