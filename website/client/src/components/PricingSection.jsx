import React from 'react';
import { Check, Star, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

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
    <section id="pricing" className="py-24 sm:py-28 bg-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-brand text-xs font-bold uppercase tracking-wider">
            Predictable & Transparent Retainers
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight">
            Clear, Straightforward <span className="gradient-text">Monthly Pricing</span>
          </h2>
          <p className="text-base text-text opacity-80 leading-relaxed">
            All plans operate on a structured 4 hrs/day model, Monday through Saturday (~104 productive hours per month). Zero hidden setup fees.
          </p>
        </div>

        {/* 3 Pricing Cards with 3D Hover Lift */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {(pricing || []).map((plan) => {
            const isRec = plan.is_recommended || plan.recommended;
            const priceDisplay = formatINR(plan.numeric_price || (plan.name === 'Starter' ? 11999 : plan.name === 'Growth' ? 15999 : 21999));

            return (
              <div
                key={plan.id || plan.name}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 transform hover:-translate-y-2 ${
                  isRec
                    ? 'border-2 border-brand bg-surface shadow-soft-lg lg:-translate-y-2'
                    : 'border border-border bg-surface shadow-soft hover:shadow-soft-lg'
                }`}
              >
                {/* Recommended Badge */}
                {isRec && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full brand-inverse text-[11px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  <div className="space-y-2 mb-6">
                    <h3 className="text-2xl font-bold text-text">{plan.name}</h3>
                    <p className="text-xs font-medium text-brand">{plan.includes_summary || plan.hours_desc}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 pb-6 border-b border-border">
                    <span className="text-4xl sm:text-5xl font-extrabold text-text tracking-tight">
                      {priceDisplay}
                    </span>
                    <span className="text-xs font-medium text-text opacity-70">
                      {plan.billing_period || '/month'}
                    </span>
                  </div>

                  {/* Dedicated Working Schedule Pill */}
                  <div className="py-4 text-xs text-text opacity-80 font-medium">
                    Schedule: <strong className="text-text">{plan.hours_desc || '4 hrs/day, Mon–Sat (~104 hrs/mo)'}</strong>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 pt-2 pb-8">
                    {(plan.features || []).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-text">
                        <span className="w-4 h-4 rounded-full bg-elevated border border-border flex items-center justify-center text-brand shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span className="opacity-90">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Selection CTA */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.name)}
                    className={`w-full py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isRec
                        ? 'brand-inverse shadow-soft hover:opacity-95'
                        : 'border border-border bg-elevated hover:bg-hover text-text'
                    }`}
                  >
                    <span>Choose {plan.name} Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operating Conditions & Scope Box */}
        <div className="mt-14 p-6 sm:p-7 rounded-2xl border border-border bg-surface text-xs text-text space-y-2">
          <div className="flex items-center gap-2 font-bold text-brand">
            <ShieldAlert className="w-4 h-4" />
            <span>Important Service Terms & Volume Agreement</span>
          </div>
          <p className="opacity-80 leading-relaxed">
            All subscriptions cover dedicated support for <strong>4 hours per day, Monday through Saturday (~104 hours/month)</strong>. Our services do not operate on a 24/7 basis. Query volume ceilings and response time SLAs are formally agreed upon during initial onboarding. Additional coverage hours or custom shift requirements are available upon inquiry.
          </p>
        </div>
      </div>
    </section>
  );
}
