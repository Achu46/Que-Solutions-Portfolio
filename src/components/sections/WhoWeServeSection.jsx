import React from 'react';
import { ShoppingBag, Instagram, Globe, Package, Store, Users } from 'lucide-react';
import { useData } from '../../context/DataContext';

const iconMap = {
  ShoppingBag: ShoppingBag,
  Instagram: Instagram,
  Globe: Globe,
  Package: Package,
  Store: Store,
};

export default function WhoWeServeSection() {
  const { whoWeServe } = useData();

  return (
    <section 
      id="who-we-serve" 
      aria-label="Who We Serve"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-brand tracking-wider uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>Target Clients</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            Tailored For Modern Product Businesses
          </h2>
          <p className="text-base sm:text-lg text-text/80 leading-relaxed">
            Whether you sell on Shopify, Instagram, Amazon, or are migrating a traditional retail store to digital channels, our agents integrate directly into your workflow.
          </p>
        </div>

        {/* 5 Target Client Segments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whoWeServe.map((client, idx) => {
            const IconComponent = iconMap[client.icon] || ShoppingBag;

            return (
              <div 
                key={client.title}
                className={`p-8 rounded-card border border-border bg-surface flex flex-col justify-between space-y-4 hover:border-brand/40 transition-all hover:shadow-md ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-text">
                    {client.title}
                  </h3>

                  <p className="text-sm text-text/80 leading-relaxed">
                    {client.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50 text-[11px] font-semibold text-brand-sage uppercase tracking-wider">
                  Target Segment
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
