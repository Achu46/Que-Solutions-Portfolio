import React from 'react';
import { Star, Quote } from 'lucide-react';
import Reveal from './common/Reveal';

export default function TestimonialsSection({ testimonials }) {
  // CRITICAL REQUIREMENT: Render ONLY if approved testimonials exist in database.
  // Otherwise, hide section completely with zero placeholders or fake reviews.
  const approvedList = (testimonials || []).filter(t => t.approved);

  if (approvedList.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-xs font-mono font-semibold text-text uppercase tracking-widest">
              [ FEEDBACK | VERIFIED EXPERIENCES ]
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] text-text leading-tight">
              Client <span className="font-semibold text-brand">Feedback.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedList.map((item, idx) => (
            <Reveal key={item.id || idx} delay={idx * 0.08}>
              <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-surface/80 backdrop-blur-xl p-7 sm:p-8 flex flex-col justify-between space-y-4 shadow-2xl">
                <div className="space-y-3">
                  <Quote className="w-8 h-8 text-brand opacity-60" />
                  <p className="text-sm text-text opacity-90 leading-relaxed italic font-normal">
                    "{item.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-text">{item.name}</h4>
                    <p className="text-xs text-text opacity-70">{item.role || item.company}</p>
                  </div>
                  {item.rating && (
                    <div className="flex items-center gap-0.5 text-brand">
                      {Array.from({ length: item.rating }).map((_, rIdx) => (
                        <Star key={rIdx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
