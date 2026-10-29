import React from 'react';
import { Target, Lightbulb, Compass, Award, Shield, Cpu } from 'lucide-react';
import Reveal from './common/Reveal';

export default function AboutSection({ about }) {
  const pillars = [
    { name: 'SUPPORT', desc: 'Courteous, responsive human care', icon: Shield },
    { name: 'TECHNOLOGY', desc: 'Modern CRMs & automated ticketing', icon: Cpu },
    { name: 'GROWTH', desc: 'Scalable bandwidth for growing brands', icon: Award },
  ];

  return (
    <section id="about" className="py-24 sm:py-28 bg-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Story & Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-brand text-xs font-bold uppercase tracking-wider">
              About QUE SOLUTIONS
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight leading-tight">
              {about?.headline || 'People Today. A Brighter Tomorrow.'}
            </h2>

            <p className="text-base sm:text-lg text-text opacity-90 leading-relaxed font-normal">
              {about?.description ||
                'Que Solutions is a customer care and call centre service provider focused on delivering professional, responsive and reliable customer support solutions for businesses.'}
            </p>

            {/* Strategic Vision Card */}
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3 shadow-soft">
              <div className="flex items-center gap-2.5 font-bold text-text text-sm sm:text-base">
                <Target className="w-5 h-5 text-brand" />
                <span>Our Strategic Vision</span>
              </div>
              <p className="text-xs sm:text-sm text-text opacity-80 leading-relaxed">
                {about?.vision ||
                  'To become an affordable customer support partner for small product-based businesses, helping them provide professional customer experiences without the cost of building a large in-house support team.'}
              </p>
            </div>

            {/* Future Scope: Technology & IT-enabled Solutions */}
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3 shadow-soft">
              <div className="flex items-center gap-2.5 font-bold text-text text-sm sm:text-base">
                <Compass className="w-5 h-5 text-brand" />
                <span>Future Scope & Technology Expansion</span>
              </div>
              <p className="text-xs sm:text-sm text-text opacity-80 leading-relaxed">
                {about?.future_scope ||
                  'Que Solutions plans to expand its service capabilities over time, including technology and IT-enabled business solutions, while continuing to build strong customer support capabilities.'}
              </p>
            </div>
          </div>

          {/* Right Column: 3 Core Pillars Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl border border-border bg-surface space-y-6 shadow-soft">
              <div className="space-y-2 border-b border-border pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-brand">Core Foundation</span>
                <h3 className="text-2xl font-extrabold text-text">The Three Pillars</h3>
              </div>

              <div className="space-y-4">
                {pillars.map((pil, idx) => {
                  const Icon = pil.icon;
                  return (
                    <Reveal key={pil.name} delay={idx * 0.1}>
                      <div className="p-5 rounded-2xl border border-border bg-elevated flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-brand shrink-0 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold tracking-wider text-text">
                            {pil.name}
                          </div>
                          <div className="text-xs text-text opacity-75 mt-0.5">
                            {pil.desc}
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              {/* Operating Location Footnote */}
              <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs text-text opacity-75">
                <span>Headquartered in</span>
                <strong className="text-text">Erode, Tamil Nadu</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
