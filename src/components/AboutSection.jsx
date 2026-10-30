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
    <section id="about" className="py-24 sm:py-32 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Story & Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <Reveal variant="slide-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-xs font-mono font-semibold text-text uppercase tracking-widest">
                [ ABOUT | PEOPLE TODAY. A BRIGHTER TOMORROW. ]
              </div>
            </Reveal>

            <Reveal variant="slide-left" delay={0.08}>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] text-text leading-tight">
                Empowering Brands with <br />
                <span className="font-semibold text-brand">Dedicated Human Care.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-sm sm:text-base text-text opacity-85 leading-relaxed font-normal">
                {about?.description ||
                  'Que Solutions is a customer care and call centre service provider focused on delivering professional, responsive and reliable customer support solutions for businesses.'}
              </p>
            </Reveal>

            {/* Strategic Vision Glass Card */}
            <Reveal delay={0.24}>
              <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-surface space-y-3 shadow-md">
                <div className="flex items-center gap-2.5 font-light text-text text-base sm:text-lg tracking-tight">
                  <Target className="w-5 h-5 text-brand" />
                  <span>Our Strategic Vision</span>
                </div>
                <p className="text-xs sm:text-sm text-text opacity-85 leading-relaxed font-normal">
                  {about?.vision ||
                    'To become an affordable customer support partner for small product-based businesses, helping them provide professional customer experiences without the cost of building a large in-house support team.'}
                </p>
              </div>
            </Reveal>

            {/* Future Scope Glass Card */}
            <Reveal delay={0.32}>
              <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-surface space-y-3 shadow-md">
                <div className="flex items-center gap-2.5 font-light text-text text-base sm:text-lg tracking-tight">
                  <Compass className="w-5 h-5 text-brand" />
                  <span>Future Scope & Technology Expansion</span>
                </div>
                <p className="text-xs sm:text-sm text-text opacity-85 leading-relaxed font-normal">
                  {about?.future_scope ||
                    'Que Solutions plans to expand its service capabilities over time, including technology and IT-enabled business solutions, while continuing to build strong customer support capabilities.'}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right Column: 3 Core Pillars Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal variant="slide-right" delay={0.2}>
              <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-surface space-y-6 shadow-md">
                <div className="space-y-2 border-b border-border/70 pb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand">[ FOUNDATION ]</span>
                  <h3 className="text-2xl sm:text-3xl font-light text-text tracking-tight">The Three Pillars</h3>
                </div>

                <div className="space-y-4">
                  {pillars.map((pil, idx) => {
                    const Icon = pil.icon;
                    return (
                      <Reveal key={pil.name} delay={idx * 0.08}>
                        <div className="p-5 rounded-2xl border border-border/70 bg-elevated/70 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-brand shrink-0 mt-0.5">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold tracking-wider text-text">
                              {pil.name}
                            </div>
                            <div className="text-xs text-text opacity-80 mt-0.5 font-normal">
                              {pil.desc}
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>

                {/* Operating Location Footnote */}
                <div className="pt-4 border-t border-border/70 flex items-center justify-between text-xs text-text opacity-75">
                  <span>Headquartered in</span>
                  <strong className="text-text font-semibold">Erode, Tamil Nadu</strong>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
