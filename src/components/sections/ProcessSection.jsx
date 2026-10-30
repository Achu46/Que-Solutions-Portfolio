import React from 'react';
import { Compass, UserCheck, Play, BarChart3, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

const stepIcons = [Compass, UserCheck, Play, BarChart3];

export default function ProcessSection() {
  const { process } = useData();

  return (
    <section 
      id="process" 
      aria-label="How We Work"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-brand tracking-wider uppercase">
            <span>Our Operating Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            How We Partner With Your Brand
          </h2>
          <p className="text-base sm:text-lg text-text/80 leading-relaxed">
            From initial workflow discovery to structured daily execution, our 4-step onboarding model ensures zero disruption to your daily business.
          </p>
        </div>

        {/* 4 Process Steps Connected */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {process.map((stepItem, idx) => {
            const IconComponent = stepIcons[idx] || Compass;

            return (
              <div 
                key={stepItem.step}
                className="relative p-8 rounded-card border border-border bg-surface flex flex-col justify-between space-y-6 hover:border-brand transition-all hover:shadow-lg group"
              >
                {/* Connecting Line Indicator */}
                {idx < process.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-border group-hover:text-brand transition-colors">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}

                <div className="space-y-4">
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-brand tracking-tighter">
                      {stepItem.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center text-text group-hover:text-brand transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-text group-hover:text-brand transition-colors">
                      {stepItem.title}
                    </h3>
                    <p className="text-xs font-semibold text-brand mt-1">
                      {stepItem.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-text/80 leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 text-[11px] font-semibold text-text/60 uppercase tracking-wider">
                  Phase {stepItem.step}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
