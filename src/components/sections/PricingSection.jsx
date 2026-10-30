import React from 'react';
import { Check, Sparkles, ArrowRight, Clock, Star } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatINR } from '../../config/constants';
import { trackEvent } from '../../services/firebase/analyticsService';

export default function PricingSection() {
  const { plans, selectPlanForQuote } = useData();

  const handleSelectPlan = (plan) => {
    trackEvent('plan_selected', { plan: plan.name, price: plan.price });
    selectPlanForQuote(plan.name);
  };

  return (
    <section 
      id="pricing" 
      aria-label="Service Plans and Pricing"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-brand tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Investment</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            Predictable Support Plans for Every Stage
          </h2>
          <p className="text-base sm:text-lg text-text/80 leading-relaxed">
            All plans include our structured 4 hours/day (Mon–Sat, ~104 hrs/mo) dedicated shift model with zero hidden setup charges.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isGrowth = Boolean(plan.isRecommended);

            return (
              <div 
                key={plan.id}
                className={`relative rounded-card p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                  isGrowth 
                    ? 'border-2 border-brand bg-surface shadow-2xl lg:-translate-y-2' 
                    : 'border border-border bg-surface hover:border-brand/40 shadow-md'
                }`}
              >
                {/* Recommended Badge on Growth plan */}
                {isGrowth && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 brand-inverse px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Most Popular & Recommended</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Scope */}
                  <div>
                    <h3 className="text-2xl font-bold text-text">
                      {plan.name}
                    </h3>
                    <p className="text-xs font-semibold text-brand mt-1">
                      {plan.includesSummary}
                    </p>
                  </div>

                  {/* Price Row with Central Indian Formatter */}
                  <div className="border-b border-border pb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-text tracking-tight">
                        {formatINR(plan.price)}
                      </span>
                      <span className="text-sm font-medium text-text/70">
                        {plan.billingPeriod || '/ month'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-text/80 font-medium">
                      <Clock className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                      <span>{plan.hoursDesc || '4 hrs/day, Mon to Sat (~104 hrs/mo)'}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-text/60">
                      Features & Coverage:
                    </div>
                    <ul className="space-y-3">
                      {plan.features?.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-text/90">
                          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isGrowth ? 'text-brand' : 'text-text/70'}`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Plan Action CTA Button (Prefills Contact Form) */}
                <div className="pt-8 mt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 focus-visible:ring-2 focus-visible:ring-brand ${
                      isGrowth 
                        ? 'brand-inverse shadow-lg hover:bg-brand-deep' 
                        : 'border border-border bg-elevated hover:bg-hover text-text'
                    }`}
                  >
                    <span>Get a Quote for {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="mt-2.5 text-center text-[11px] text-text/60">
                    Includes dedicated setup & custom CRM onboarding
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
