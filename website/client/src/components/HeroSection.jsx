import React, { Suspense } from 'react';
import { ArrowDown, ArrowUpRight, Headphones, MessageSquare, PhoneOutgoing } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import HeroPosterFallback from './3d/HeroPosterFallback';
import Logo3D from './common/Logo3D';

const Hero3DCanvas = React.lazy(() => import('./3d/Hero3DCanvas'));

export default function HeroSection({ hero, settings }) {
  const { isDark } = useTheme();

  return (
    <section 
      id="home" 
      aria-label="Hero Section"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between p-0 bg-bg overflow-hidden"
    >
      {/* =========================================================================
          FULL-BLEED HERO (Edge to edge, 2-column layout: text left, 3D stage right)
          ========================================================================= */}
      <div 
        id="hero-card"
        className="relative flex-1 w-full overflow-hidden flex flex-col justify-between px-5 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 transition-colors duration-300"
        style={{
          background: 'var(--hero-gradient)',
        }}
      >
        {/* Soft volumetric light cone from top centre */}
        <div className="absolute inset-0 volumetric-cone z-0 pointer-events-none" />

        {/* ---------------- TOP BAR (3D Brand Logo Left, Contact Us Right) ---------------- */}
        <div className="relative z-20 flex items-center justify-between w-full">
          <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group select-none">
            <Logo3D size="sm" variant="circle" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold tracking-wider text-text leading-tight group-hover:text-brand transition-colors">
                QUE SOLUTIONS
              </span>
              <span className="hidden sm:inline-block text-[9px] tracking-widest text-brand font-bold uppercase">
                People Today. A Brighter Tomorrow.
              </span>
            </div>
          </a>

          <a
            href="#contact"
            className="inverse inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 min-h-[44px] rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-sm"
            style={{
              color: 'var(--inverse-text)',
              backgroundColor: 'var(--inverse-bg)',
            }}
          >
            <span className="w-2 h-2 rounded-full accent-dot animate-pulse flex-shrink-0" />
            <span className="relative z-10 font-bold tracking-wide" style={{ color: 'var(--inverse-text)' }}>
              Contact us
            </span>
          </a>
        </div>

        {/* ---------------- 2-COLUMN HERO BODY (Text Left, 3D Stage Right) ---------------- */}
        <div className="relative z-20 my-auto py-4 sm:py-6 lg:py-8 grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 lg:gap-10 items-center max-w-[1320px] mx-auto w-full">
          
          {/* LEFT COLUMN: Text, Badge, Headline, Paragraph, CTAs (Order 1 on mobile) */}
          <div className="min-[900px]:col-span-7 order-1 flex flex-col justify-center text-left min-[641px]:max-[899px]:text-center min-[641px]:max-[899px]:items-center space-y-4 sm:space-y-6">
            
            {/* Bracketed Eyebrow Badge (No white border) */}
            <div className="inline-flex items-center">
              <span className="text-xs sm:text-sm font-mono tracking-widest text-text font-semibold uppercase px-3.5 py-1.5 rounded-full bg-surface/70">
                [ OUTSOURCED CUSTOMER CARE & CALL CENTRE ]
              </span>
            </div>

            {/* Headline with Poppins 600 weight, clamp, and high-contrast text */}
            <h1 className="hero-headline text-text">
              Customer Care That <br />
              <span className="text-brand">Feels Personal.</span>
            </h1>

            {/* Subheadline Paragraph */}
            <p className="text-sm sm:text-base lg:text-lg text-text/80 max-w-xl leading-relaxed font-normal">
              {hero?.subheadline ||
                'Dedicated outsourced customer care and call centre services built specifically for small & growing product-based businesses.'}
            </p>

            {/* Action Buttons Row: Get a Quote + View Our Work (Full width on mobile, 44px min touch target) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center min-[641px]:max-[899px]:justify-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
              <a
                href="#contact"
                className="brand-inverse inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[44px] w-full sm:w-auto rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all"
              >
                <span className="w-2.5 h-2.5 rounded-full accent-dot" />
                <span>Get a Quote</span>
                <ArrowUpRight className="w-4 h-4 ml-0.5 opacity-80" />
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 min-h-[44px] w-full sm:w-auto rounded-full text-xs sm:text-sm font-semibold border border-border/70 bg-surface/70 hover:bg-hover text-text transition-all active:scale-95 shadow-sm"
              >
                <span>View Our Work</span>
              </a>
            </div>

            {/* Operating Hours / Trust Cue */}
            <div className="pt-2 flex items-center min-[641px]:max-[899px]:justify-center gap-2 text-xs font-mono text-text/70">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              <span>Mon–Sat • 4 hrs/day (~104 hrs/mo)</span>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Stage with GPU Particle Headset & 3 Floating Chips (Order 2 on mobile) */}
          <div className="min-[900px]:col-span-5 order-2 relative flex items-center justify-center w-full">
            <div className="headset-stage relative w-full h-[320px] max-h-[40svh] min-[641px]:h-[420px] min-[641px]:max-h-none min-[900px]:h-[480px] 2xl:h-[540px] flex items-center justify-center">
              
              {/* Lazy-Loaded GPU Particle Headset Stage */}
              <Suspense fallback={<HeroPosterFallback isDark={isDark} />}>
                <Hero3DCanvas isDark={isDark} />
              </Suspense>

              {/* Chip 1: Inbound Support (Top Left - No white border or box-shadow ring) */}
              <div 
                className="absolute top-2 left-1 sm:top-6 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full bg-surface/90 backdrop-blur-md text-text text-[11px] sm:text-xs md:text-sm font-semibold select-none pointer-events-none transition-transform"
                style={{ animation: 'float 5.2s ease-in-out infinite' }}
              >
                <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand flex-shrink-0" />
                <span>Inbound Support</span>
              </div>

              {/* Chip 2: Chat Support (Right Center - No white border or box-shadow ring) */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 right-1 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full bg-surface/90 backdrop-blur-md text-text text-[11px] sm:text-xs md:text-sm font-semibold select-none pointer-events-none transition-transform"
                style={{ animation: 'float 6.4s ease-in-out 1.2s infinite' }}
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand flex-shrink-0" />
                <span>Chat Support</span>
              </div>

              {/* Chip 3: Outbound Support (Bottom Left - No white border or box-shadow ring) */}
              <div 
                className="absolute bottom-2 left-4 sm:bottom-6 sm:left-8 z-10 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full bg-surface/90 backdrop-blur-md text-text text-[11px] sm:text-xs md:text-sm font-semibold select-none pointer-events-none transition-transform"
                style={{ animation: 'float 5.8s ease-in-out 2.5s infinite' }}
              >
                <PhoneOutgoing className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand flex-shrink-0" />
                <span>Outbound Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- BOTTOM INDICATORS INSIDE HERO ---------------- */}
        <div className="relative z-20 flex items-center justify-between w-full pt-4">
          <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-medium uppercase tracking-widest text-text/70">
            <span className="w-4 h-4 rounded-full border border-border/60 flex items-center justify-center">
              <ArrowDown className="w-2.5 h-2.5 animate-bounce" />
            </span>
            <span>Scroll to explore</span>
          </div>

          <div className="hidden sm:block text-[11px] font-mono text-text/60">
            Erode, Tamil Nadu • People Today. A Brighter Tomorrow.
          </div>
        </div>
      </div>
    </section>
  );
}
