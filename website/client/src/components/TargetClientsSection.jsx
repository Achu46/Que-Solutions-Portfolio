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
    <section id="who-we-serve" className="py-24 sm:py-32 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-xs font-mono font-semibold text-text uppercase tracking-widest">
              [ CAPABILITIES | WHO WE SERVE ]
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] text-text leading-tight">
              Tailored Solutions for <br />
              <span className="font-semibold text-brand">Emerging Brands.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-sm sm:text-base text-text opacity-85 leading-relaxed max-w-2xl mx-auto">
              Our specialized workflows are purpose-built for growing product sellers and ecommerce operators across emerging digital channels.
            </p>
          </Reveal>
        </div>

        {/* 5 Target Client Segments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {(targetClients || []).map((client, idx) => {
            const Icon = iconMap[client.icon] || CheckCircle2;
            return (
              <Reveal key={client.id || idx} delay={idx * 0.08} className="h-full">
                <div className="h-full rounded-2xl sm:rounded-3xl border border-border/80 bg-surface/80 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between space-y-3 shadow-2xl hover:border-brand/50 hover:bg-surface/90 transition-all duration-300 group">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-elevated border border-border flex items-center justify-center text-brand transition-transform group-hover:scale-110 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-light text-text tracking-tight">
                      {client.title}
                    </h3>
                    <p className="text-xs text-text opacity-85 leading-relaxed font-normal">
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
