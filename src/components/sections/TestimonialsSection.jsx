import React from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function TestimonialsSection() {
  const { testimonials, siteSettings } = useData();

  // Strict rule: NEVER fabricate testimonials.
  // Hidden automatically until real data exists and is enabled in site settings.
  const isEnabled = Boolean(siteSettings?.sectionVisibility?.testimonials);
  const hasRealData = Boolean(testimonials && testimonials.length > 0);

  if (!isEnabled || !hasRealData) {
    return null;
  }

  return (
    <section 
      id="testimonials" 
      aria-label="Client Testimonials"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-brand tracking-wider uppercase">
            <span>Client Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            Verified Partner Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div 
              key={item.id}
              className="p-8 rounded-card border border-border bg-surface flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-text/90 italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text">{item.name}</h4>
                  <p className="text-xs text-text/60">{item.company}</p>
                </div>
                <MessageSquareQuote className="w-6 h-6 text-brand/40" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
