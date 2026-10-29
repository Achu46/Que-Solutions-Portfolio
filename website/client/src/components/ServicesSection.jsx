import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { PhoneIncoming, PhoneOutgoing, MessageSquareText, Check, ArrowRight, ShieldCheck, Headphones, Smartphone, MessageCircle } from 'lucide-react';
import { useCanvasScroll } from '../context/CanvasScrollContext';
import Reveal from './common/Reveal';

const serviceShapeHints = [
  { id: 'inbound', num: '01', shape: '3D Headset', icon: Headphones, label: 'Inbound Call Support' },
  { id: 'outbound', num: '02', shape: '3D Handset', icon: Smartphone, label: 'Outbound Call Support' },
  { id: 'chat', num: '03', shape: '3D Chat Bubble', icon: MessageCircle, label: 'Live Chat & WhatsApp' },
];

function ServiceTiltCard({ service, index, isActive, onSelectService }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for physics-based 3D tilt (max 7 degrees)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 240, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 240, damping: 25 });
  const glareOpacity = useSpring(useTransform(x, [-0.5, 0, 0.5], [0.15, 0, 0.15]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const IconComponent =
    index === 0 ? PhoneIncoming : index === 1 ? PhoneOutgoing : MessageSquareText;

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
        className={`relative h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border transition-all duration-300 p-7 sm:p-9 overflow-hidden shadow-md group ${
          isActive
            ? 'border-brand/70 bg-surface shadow-brand/10 ring-1 ring-brand/30'
            : 'border-border/80 bg-surface hover:border-brand/40'
        }`}
      >
        {/* Dynamic Pointer Glare Overlay */}
        <motion.div
          style={{ opacity: glareOpacity }}
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-brand/15 pointer-events-none rounded-2xl sm:rounded-3xl"
        />

        {/* Card Header */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-elevated border border-border flex items-center justify-center text-brand shadow-sm transition-transform duration-300 group-hover:scale-105">
              <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="font-mono text-xs sm:text-sm font-bold text-text opacity-70 tracking-widest px-3 py-1 rounded-full border border-border bg-elevated/60">
              0{index + 1}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-xl sm:text-2xl font-light tracking-tight text-text">
              {service.title}
            </h3>
            <p className="text-xs sm:text-sm text-text opacity-85 leading-relaxed font-normal">
              {service.description}
            </p>
          </div>

          {/* Outbound call ethical notice */}
          {service.title.includes('Outbound') && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-elevated border border-border text-[11px] font-medium text-text">
              <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
              <span>Existing leads, order confirms & callbacks. Zero cold calling.</span>
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
        <div className="pt-6 mt-6 border-t border-border relative z-10">
          <button
            type="button"
            onClick={() => onSelectService(service.title)}
            className="w-full inline-flex items-center justify-between px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-border bg-elevated hover:bg-hover text-text transition-all group-hover:border-brand"
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
  const { activeServiceIndex } = useCanvasScroll();

  const handleSelectService = (serviceTitle) => {
    window.dispatchEvent(new CustomEvent('que_select_service', { detail: { service: serviceTitle } }));
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 sm:py-32 bg-transparent relative z-10 content-visibility-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-xs font-mono font-semibold text-text uppercase tracking-widest">
              [ SERVICES | 01 · 02 · 03 OMNICHANNEL SUPPORT ]
            </div>
          </Reveal>
          
          <Reveal delay={0.08}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] text-text leading-tight">
              Reliable Solutions for <br />
              <span className="font-semibold text-brand">Buyer Engagement.</span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.16}>
            <p className="text-sm sm:text-base text-text opacity-85 leading-relaxed max-w-2xl mx-auto">
              Professional customer care designed exclusively for small and growing product-based businesses. Mon–Sat, 4 hours per day (~104 hrs/month).
            </p>
          </Reveal>
        </div>

        {/* 01 / 02 / 03 Interactive Progress Indicator */}
        <Reveal delay={0.2} className="mb-12">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 sm:gap-4 p-1.5 sm:p-2 rounded-full border border-border/80 bg-surface/85 backdrop-blur-xl shadow-lg">
              {serviceShapeHints.map((hint, idx) => {
                const isSelected = activeServiceIndex === idx;
                const Icon = hint.icon;
                return (
                  <div
                    key={hint.id}
                    className={`flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'inverse shadow-md font-bold'
                        : 'text-text opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{hint.num}</span>
                    <span className="hidden sm:inline font-mono text-[11px] opacity-80">• {hint.shape}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* 3D-Tilt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {(services || []).map((service, idx) => (
            <Reveal key={service.id || service.slug || idx} delay={idx * 0.08} className="h-full">
              <ServiceTiltCard
                service={service}
                index={idx}
                isActive={activeServiceIndex === idx}
                onSelectService={handleSelectService}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
