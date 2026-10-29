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
    <section id="why-us" className="py-24 sm:py-28 bg-surface/50 border-t border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-brand text-xs font-bold uppercase tracking-wider">
            Operational Advantages
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight">
            Why Partner with <span className="gradient-text">Que Solutions</span>
          </h2>
          <p className="text-base text-text opacity-80 leading-relaxed">
            We provide structured, cost-effective customer care designed to help founders maintain professional buyer interactions while scaling operations.
          </p>
        </div>

        {/* 6 Cards with Staggered Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(whyUs || []).map((item, idx) => {
            const Icon = iconMap[item.icon] || CheckCircle2;
            return (
              <Reveal key={item.id || idx} delay={idx * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-7 sm:p-8 flex flex-col justify-between space-y-4 shadow-soft hover:shadow-soft-lg transition-all duration-300 group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand transition-transform group-hover:scale-110">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-text">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text opacity-80 leading-relaxed">
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
