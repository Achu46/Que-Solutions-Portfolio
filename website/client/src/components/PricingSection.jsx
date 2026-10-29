import React from 'react';
import { Check, Star, ArrowRight, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import Reveal from './common/Reveal';

const formatINR = (amount) => {
  if (typeof amount === 'number') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return amount || '₹11,999';
};

export default function PricingSection({ pricing }) {
  const handleSelectPlan = (planName) => {
    window.dispatchEvent(new CustomEvent('que_select_plan', { detail: { plan: planName } }));
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-xs font-mono font-semibold text-text uppercase tracking-widest">
              [ PRICING | PREDICTABLE MONTHLY RETAINERS ]
            </div>
          </Reveal>
          
          <Reveal delay={0.08}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] text-text leading-tight">
              Transparent Retainers for <br />
              <span className="font-semibold text-brand">Growing Operations.</span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.16}>
            <p className="text-sm sm:text-base text-text opacity-85 leading-relaxed max-w-2xl mx-auto">
              All plans operate on a dedicated 4 hrs/day schedule, Monday through Saturday (~104 productive hours per month). Zero hidden setup fees.
            </p>
          </Reveal>
        </div>

        {/* 3 Pricing Glass Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {(pricing || []).map((plan, idx) => {
            const isRec = plan.is_recommended || plan.recommended || plan.name === 'Growth';
            const priceVal = plan.numeric_price || (plan.name === 'Starter' ? 11999 : plan.name === 'Growth' ? 15999 : 21999);
            const priceDisplay = formatINR(priceVal);

            return (
              <Reveal key={plan.id || plan.name || idx} delay={idx * 0.08} className="h-full">
                <div
                  className={`relative h-full flex flex-col justify-between rounded-3xl p-8 sm:p-9 transition-all duration-300 backdrop-blur-xl shadow-2xl ${
                    isRec
                      ? 'border-2 border-brand/80 bg-surface/90 shadow-brand/10 lg:-translate-y-3'
                      : 'border border-border/80 bg-surface/80 hover:border-brand/40'
                  }`}
                >
                  {/* Recommended Badge */}
                  {isRec && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full inverse text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full accent-dot" />
                      <span>Recommended Choice</span>
                    </div>
                  )}

                  <div>
                    <div className="space-y-2 mb-6">
                      <h3 className="text-2xl sm:text-3xl font-light text-text tracking-tight">
                        {plan.name}
                      </h3>
                      <p className="text-xs font-semibold text-brand tracking-wide">
                        {plan.includes_summary || plan.hours_desc || 'Dedicated Support Retention'}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 pb-6 border-b border-border/70">
                      <span className="text-4xl sm:text-5xl font-light text-text tracking-tight">
                        {priceDisplay}
                      </span>
                      <span className="text-xs font-medium text-text opacity-70">
                        {plan.billing_period || '/month'}
                      </span>
                    </div>

                    {/* Dedicated Working Schedule Pill */}
                    <div className="py-4 text-xs text-text opacity-85 font-mono flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-brand shrink-0" />
                      <span>4 hrs/day, Mon–Sat (~104 hrs/mo)</span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 pt-2 pb-8">
                      {(plan.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-text">
                          <span className="w-4 h-4 rounded-full bg-elevated border border-border flex items-center justify-center text-brand shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span className="opacity-90">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Plan Selection CTA */}
                  <div className="pt-4 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.name)}
                      className={`w-full py-4 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        isRec
                          ? 'inverse shadow-lg hover:opacity-95 active:scale-95'
                          : 'border border-border bg-elevated hover:bg-hover text-text hover:border-brand/50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full accent-dot" />
                      <span>Choose {plan.name} Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Operating Conditions Box */}
        <Reveal delay={0.28} className="mt-14">
          <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-xl text-xs text-text space-y-2 shadow-lg">
            <div className="flex items-center gap-2 font-bold text-text">
              <ShieldAlert className="w-4 h-4 text-brand" />
              <span>Standard Operational Terms & Capacity Agreement</span>
            </div>
            <p className="opacity-80 leading-relaxed">
              All retainers cover dedicated customer care for <strong>4 hours per day, Monday through Saturday (~104 hours/month)</strong>. Our services do not operate on a 24/7 basis. Query volume ceilings and response time SLAs are formally documented upon contract signing. Additional coverage hours or custom shift requirements are available on inquiry.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
