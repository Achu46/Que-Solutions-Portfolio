import React from 'react';
import { 
  BadgePercent, 
  Clock, 
  Award, 
  TrendingUp, 
  HeartHandshake, 
  PhoneCall, 
  Sparkles 
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const iconMap = {
  BadgePercent: BadgePercent,
  Clock: Clock,
  Award: Award,
  TrendingUp: TrendingUp,
  HeartHandshake: HeartHandshake,
  PhoneCall: PhoneCall,
};

export default function WhyUsSection() {
  const { whyUs } = useData();

  return (
    <section 
      id="why-us" 
      aria-label="Why Choose QUE SOLUTIONS"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-brand tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The QUE Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            Why Partner With QUE SOLUTIONS?
          </h2>
          <p className="text-base sm:text-lg text-text/80 leading-relaxed">
            Built specifically for independent product creators, D2C innovators, and marketplace sellers who need dedicated customer care without the overhead of an internal call centre.
          </p>
        </div>

        {/* 6 Advantage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyUs.map((item) => {
            const IconComponent = iconMap[item.icon] || Award;

            return (
              <div 
                key={item.title}
                className="p-8 rounded-card border border-border bg-surface flex flex-col justify-between space-y-4 hover:border-brand/50 transition-all hover:shadow-lg group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand group-hover:scale-105 transition-transform">
                    <IconComponent className="w-6 h-6 text-brand" />
                  </div>

                  <h3 className="text-xl font-bold text-text group-hover:text-brand transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-text/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50 text-[11px] font-semibold text-brand tracking-wider uppercase">
                  Verified Standard
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
