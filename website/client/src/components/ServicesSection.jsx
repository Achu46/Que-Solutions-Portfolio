import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { PhoneIncoming, PhoneOutgoing, MessageSquareText, Check, ArrowRight, ShieldCheck } from 'lucide-react';

const iconMap = {
  PhoneIncoming,
  PhoneOutgoing,
  MessageSquareText,
};

// Interactive 3D-Tilt Card with pointer glare highlight
function ServiceTiltCard({ service, onSelectService }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth physics-based 3D tilt (max 8 degrees)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 260, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 260, damping: 25 });
  const glareOpacity = useSpring(useTransform(x, [-0.5, 0, 0.5], [0.15, 0, 0.15]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const IconComponent = iconMap[service.icon] || MessageSquareText;

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full flex flex-col justify-between rounded-2xl border border-border bg-surface p-7 sm:p-8 transition-colors duration-200 overflow-hidden shadow-soft hover:shadow-soft-lg group"
      >
        {/* Dynamic Pointer Glare Overlay */}
        <motion.div
          style={{
            opacity: glareOpacity,
          }}
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-brand/20 pointer-events-none rounded-2xl"
        />

        {/* Top Header */}
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-elevated border border-border flex items-center justify-center text-brand shadow-sm transition-transform duration-300 group-hover:scale-110">
            <IconComponent className="w-7 h-7" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
            {service.title}
          </h3>

          <p className="text-sm text-text opacity-80 leading-relaxed font-normal">
            {service.description}
          </p>

          {/* Outbound call ethical notice */}
          {service.title.includes('Outbound') && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevated border border-border text-[11px] font-medium text-brand">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Existing leads & confirmations only. No cold calling.</span>
            </div>
          )}

          {/* Feature List */}
          <ul className="space-y-2.5 pt-4 border-t border-border/70">
            {(service.features || []).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-text">
                <span className="w-4 h-4 rounded-full bg-elevated border border-border flex items-center justify-center text-brand shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </span>
                <span className="opacity-90">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom CTA to preselect service */}
        <div className="pt-6 mt-6 border-t border-border">
          <button
            type="button"
            onClick={() => onSelectService(service.title)}
            className="w-full inline-flex items-center justify-between px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-border bg-elevated hover:bg-hover text-text transition-all group-hover:border-brand"
          >
            <span>Get a quote for this service</span>
            <ArrowRight className="w-4 h-4 text-brand transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ServicesSection({ services }) {
  const handleSelectService = (serviceTitle) => {
    window.dispatchEvent(new CustomEvent('que_select_service', { detail: { service: serviceTitle } }));
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 sm:py-28 bg-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-brand text-xs font-bold uppercase tracking-wider">
            Tailored Outsourced Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight">
            Our Core <span className="gradient-text">Support Services</span>
          </h2>
          <p className="text-base text-text opacity-80 leading-relaxed">
            Professional customer care solutions designed exclusively for small and growing product-based businesses. Mon–Sat, 4 hours per day.
          </p>
        </div>

        {/* 3D-Tilt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services || []).map((service) => (
            <ServiceTiltCard
              key={service.id || service.slug}
              service={service}
              onSelectService={handleSelectService}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
