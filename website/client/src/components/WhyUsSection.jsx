import React from 'react';
import { 
  BadgePercent, 
  Clock, 
  Award, 
  TrendingUp, 
  HeartHandshake, 
  MessageCircle, 
  CheckCircle2 
} from 'lucide-react';
import Reveal from './common/Reveal';

const iconMap = {
  BadgePercent,
  Clock,
  Award,
  TrendingUp,
  HeartHandshake,
  MessageCircle,
};

export default function WhyUsSection({ whyUs }) {
  return (
    <section id="why-us" className="py-24 sm:py-32 bg-transparent relative z-10 content-visibility-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-xs font-mono font-semibold text-text uppercase tracking-widest">
              [ ADVANTAGES | OPERATIONAL EXCELLENCE ]
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] text-text leading-tight">
              Operational Edge for <br />
              <span className="font-semibold text-brand">Modern Businesses.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-sm sm:text-base text-text opacity-85 leading-relaxed max-w-2xl mx-auto">
              We provide structured, cost-effective customer care designed to help founders maintain professional buyer interactions while scaling operations.
            </p>
          </Reveal>
        </div>

        {/* 6 Glass Cards with 80ms Staggered Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(whyUs || []).map((item, idx) => {
            const Icon = iconMap[item.icon] || CheckCircle2;
            return (
              <Reveal key={item.id || idx} delay={idx * 0.08} className="h-full">
                <div className="h-full rounded-2xl sm:rounded-3xl border border-border/80 bg-surface p-7 sm:p-8 flex flex-col justify-between space-y-4 shadow-md hover:border-brand/50 hover:bg-surface/95 transition-all duration-300 group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-elevated border border-border flex items-center justify-center text-brand transition-transform group-hover:scale-110 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-light text-text tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text opacity-85 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
