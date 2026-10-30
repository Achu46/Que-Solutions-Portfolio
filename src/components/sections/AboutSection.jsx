import React from 'react';
import { Target, Lightbulb, Shield, Check, Clock, Radio, Users } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { TAGLINE, PILLARS } from '../../config/constants';

export default function AboutSection() {
  const { about } = useData();

  return (
    <section 
      id="about" 
      aria-label="About QUE SOLUTIONS"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-brand tracking-wider uppercase">
            <span>About Us</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            {TAGLINE}
          </h2>
          <p className="text-base sm:text-lg text-text/80 leading-relaxed">
            {about?.description}
          </p>
        </div>

        {/* Real Numbers Counter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-8 rounded-card border border-border bg-surface text-center space-y-2 hover:border-brand/50 transition-colors">
            <div className="flex items-center justify-center gap-2 text-brand">
              <Clock className="w-5 h-5" />
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">4 hrs/day</span>
            </div>
            <p className="text-sm font-semibold text-text">Structured Daily Coverage</p>
            <p className="text-xs text-text/70">Mon to Sat focused shifts</p>
          </div>

          <div className="p-8 rounded-card border border-border bg-surface text-center space-y-2 hover:border-brand/50 transition-colors">
            <div className="flex items-center justify-center gap-2 text-brand">
              <Radio className="w-5 h-5" />
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">~104 hrs</span>
            </div>
            <p className="text-sm font-semibold text-text">Monthly Support Hours</p>
            <p className="text-xs text-text/70">Dedicated agent bandwidth</p>
          </div>

          <div className="p-8 rounded-card border border-border bg-surface text-center space-y-2 hover:border-brand/50 transition-colors">
            <div className="flex items-center justify-center gap-2 text-brand">
              <Users className="w-5 h-5" />
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">3 Channels</span>
            </div>
            <p className="text-sm font-semibold text-text">Unified Touchpoints</p>
            <p className="text-xs text-text/70">Inbound, Outbound & Chat</p>
          </div>
        </div>

        {/* Strategic Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {about?.pillars?.map((pillar, idx) => (
            <div 
              key={pillar.title} 
              className="p-8 rounded-card border border-border bg-surface flex flex-col justify-between space-y-4 hover:border-brand/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-brand-darker border border-brand/30 flex items-center justify-center text-brand-sage font-bold text-lg">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold text-text tracking-wide">
                  {pillar.title}
                </h3>
                <p className="text-sm text-text/80 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <div className="pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-semibold text-brand">
                <Check className="w-4 h-4" />
                <span>Integrated Operating Pillar</span>
              </div>
            </div>
          ))}
        </div>

        {/* Company Vision Banner */}
        <div className="p-8 sm:p-10 rounded-card border border-border bg-surface/70 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">
              Our Vision
            </div>
            <p className="text-lg sm:text-xl font-medium text-text max-w-2xl leading-relaxed">
              "{about?.vision}"
            </p>
          </div>
          <div className="shrink-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elevated border border-border text-xs font-semibold text-text">
              <Lightbulb className="w-4 h-4 text-brand" />
              <span>Future IT & SaaS Expansion</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
