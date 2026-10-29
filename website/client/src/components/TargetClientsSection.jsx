import React from 'react';
import { ShoppingBag, Camera, Globe, Store, Building2, CheckCircle2 } from 'lucide-react';
import Reveal from './common/Reveal';

const iconMap = {
  ShoppingBag,
  Camera,
  Globe,
  Store,
  Building2,
};

export default function TargetClientsSection({ targetClients }) {
  return (
    <section className="py-20 sm:py-24 bg-bg border-t border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-brand text-xs font-bold uppercase tracking-wider">
            Tailored Industry Fit
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight">
            Who We <span className="gradient-text">Proudly Serve</span>
          </h2>
          <p className="text-base text-text opacity-80 leading-relaxed">
            Our specialized workflows are purpose-built for growing product sellers and ecommerce operators across emerging digital channels.
          </p>
        </div>

        {/* 5 Target Client Segments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {(targetClients || []).map((client, idx) => {
            const Icon = iconMap[client.icon] || CheckCircle2;
            return (
              <Reveal key={client.id || idx} delay={idx * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between space-y-3 shadow-soft hover:shadow-soft-lg transition-all duration-300 group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand transition-transform group-hover:scale-110">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-text">
                      {client.title}
                    </h3>
                    <p className="text-xs text-text opacity-80 leading-relaxed">
                      {client.description}
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
