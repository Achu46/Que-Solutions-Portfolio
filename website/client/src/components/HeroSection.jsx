import React, { Suspense } from 'react';
import { ArrowDown, ArrowUpRight, Headphones, MessageSquare, PhoneOutgoing } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import HeroPosterFallback from './3d/HeroPosterFallback';

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

        {/* ---------------- TOP BAR (Contact Us only, no empty gap) ---------------- */}
        <div className="relative z-20 flex items-center justify-end w-full">
          <a
            href="#contact"
            className="inverse inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all"
          >
            <span className="w-2 h-2 rounded-full accent-dot animate-pulse" />
            <span>Contact us</span>
          </a>
        </div>

        {/* ---------------- 2-COLUMN HERO BODY (Text Left, 3D Stage Right) ---------------- */}
        <div className="relative z-20 my-auto py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center max-w-7xl mx-auto w-full">
          
          {/* LEFT COLUMN: Text, Badge, Headline, Paragraph, CTAs (Order 1 on mobile) */}
          <div className="lg:col-span-7 order-1 flex flex-col justify-center space-y-5 sm:space-y-6">
            
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

            {/* Action Buttons Row: Get a Quote + View Our Work */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <a
                href="#contact"
                className="brand-inverse inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all"
              >
                <span className="w-2.5 h-2.5 rounded-full accent-dot" />
                <span>Get a Quote</span>
                <ArrowUpRight className="w-4 h-4 ml-0.5 opacity-80" />
              </a>

              <a
                href="#services"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-semibold border border-border/70 bg-surface/70 hover:bg-hover text-text transition-all active:scale-95 shadow-sm"
              >
                <span>View Our Work</span>
              </a>
            </div>

            {/* Operating Hours / Trust Cue */}
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-text/70">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              <span>Mon–Sat • 4 hrs/day (~104 hrs/mo)</span>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Stage with GPU Particle Headset & 3 Floating Chips (Order 2 on mobile) */}
          <div className="lg:col-span-5 order-2 relative flex items-center justify-center w-full">
            <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] flex items-center justify-center">
              
              {/* Lazy-Loaded GPU Particle Headset Stage */}
              <Suspense fallback={<HeroPosterFallback isDark={isDark} />}>
                <Hero3DCanvas isDark={isDark} />
              </Suspense>

              {/* Chip 1: Inbound Support (Top Left - No white border or box-shadow ring) */}
              <div 
                className="absolute top-4 left-2 sm:top-6 sm:left-4 z-10 flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-surface/90 backdrop-blur-md text-text text-xs sm:text-sm font-semibold select-none pointer-events-none transition-transform"
                style={{ animation: 'float 5.2s ease-in-out infinite' }}
              >
                <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand flex-shrink-0" />
                <span>Inbound Support</span>
              </div>

              {/* Chip 2: Chat Support (Right Center - No white border or box-shadow ring) */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-10 flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-surface/90 backdrop-blur-md text-text text-xs sm:text-sm font-semibold select-none pointer-events-none transition-transform"
                style={{ animation: 'float 6.4s ease-in-out 1.2s infinite' }}
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand flex-shrink-0" />
                <span>Chat Support</span>
              </div>

              {/* Chip 3: Outbound Support (Bottom Left - No white border or box-shadow ring) */}
              <div 
                className="absolute bottom-4 left-6 sm:bottom-6 sm:left-8 z-10 flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-surface/90 backdrop-blur-md text-text text-xs sm:text-sm font-semibold select-none pointer-events-none transition-transform"
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
