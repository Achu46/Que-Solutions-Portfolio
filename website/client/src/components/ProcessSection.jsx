import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ClipboardList, CheckSquare, Headphones, TrendingUp } from 'lucide-react';
import Reveal from './common/Reveal';

const steps = [
  {
    num: '01',
    title: 'Tell Us Your Requirement',
    desc: 'Share your daily customer enquiry volume, sales channels (WhatsApp, phone, Instagram, web), and preferred support hours.',
    icon: ClipboardList,
  },
  {
    num: '02',
    title: 'Choose Your Support Plan',
    desc: 'Select from Starter, Growth, or Business plans based on whether you need Chat-only or integrated Inbound & Outbound call support.',
    icon: CheckSquare,
  },
  {
    num: '03',
    title: 'We Handle Support',
    desc: 'Our trained support professionals manage incoming calls, resolve buyer chats, track orders, and log detailed daily interactions.',
    icon: Headphones,
  },
  {
    num: '04',
    title: 'Your Business Grows',
    desc: 'Focus your time on marketing, inventory, and product development while your customers receive dedicated, professional attention.',
    icon: TrendingUp,
  },
];

export default function ProcessSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" ref={containerRef} className="py-24 sm:py-32 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-xs font-mono font-semibold text-text uppercase tracking-widest">
              [ ONBOARDING | HOW IT WORKS ]
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] text-text leading-tight">
              Simple 4-Step <br />
              <span className="font-semibold text-brand">Integration Flow.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-sm sm:text-base text-text opacity-85 leading-relaxed max-w-2xl mx-auto">
              From initial enquiry to active customer care, our onboarding process is transparent, structured, and rapid.
            </p>
          </Reveal>
        </div>

        {/* Desktop Connecting Line that draws on scroll */}
        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-12 right-12 h-0.5 bg-border/80 -z-0">
            <motion.div
              style={{ scaleX, transformOrigin: 'left' }}
              className="h-full bg-brand"
            />
          </div>

          {/* 4 Step Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <Reveal key={st.num} delay={idx * 0.08} className="h-full">
                  <div className="h-full rounded-2xl sm:rounded-3xl border border-border/80 bg-surface/80 backdrop-blur-xl p-7 sm:p-8 flex flex-col justify-between space-y-4 shadow-2xl hover:border-brand/50 hover:bg-surface/90 transition-all duration-300 group">
                    <div className="space-y-4">
                      {/* Number circle badge & Icon */}
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-elevated border border-border flex items-center justify-center text-brand shadow-sm font-extrabold text-sm group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-brand tracking-widest font-mono">
                          {st.num}
                        </span>
                      </div>

                      <h3 className="text-lg font-light text-text tracking-tight">
                        {st.title}
                      </h3>

                      <p className="text-xs text-text opacity-85 leading-relaxed font-normal">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
