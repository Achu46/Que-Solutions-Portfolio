import React from 'react';
import { ExternalLink, Sparkles, UtensilsCrossed, ShoppingBag, CheckCircle2, ArrowRight, Globe, Star, Layers } from 'lucide-react';
import Reveal from './common/Reveal';

export default function WorkSection() {
  const highlightedProjects = [
    {
      id: 'food-delivery',
      title: 'Food Delivery Website',
      subtitle: 'Bismillah Foods Ordering Platform',
      category: 'Food & Hospitality • Online Delivery',
      url: 'https://food-delivery-template-two.vercel.app/',
      icon: UtensilsCrossed,
      tag: 'Featured Client Work',
      description: 'A modern, high-conversion online food ordering platform equipped with dynamic menu categorization (Biryani, Shawarma, Starters, Grills), live cart management, and seamless Razorpay digital payment checkout.',
      highlights: [
        'Dynamic menu categorization & instant search',
        'Real-time cart management & order summary',
        'Official Razorpay payment gateway integration',
        '100% responsive mobile-first dining UI'
      ],
      techStack: ['React', 'Tailwind CSS', 'Razorpay', 'Vercel Deployment'],
      gradient: 'from-amber-500/20 via-brand/10 to-transparent',
      borderColor: 'border-brand/60',
      badgeColor: 'bg-brand/15 text-brand border-brand/30'
    },
    {
      id: 'ecommerce-suite',
      title: 'MONO™ E-Commerce & Admin Suite',
      subtitle: 'Minimalist Storefront & Operations Console',
      category: 'Retail & E-Commerce Platform',
      url: 'https://e-commerce-template-lake-mu.vercel.app/',
      icon: ShoppingBag,
      tag: 'Featured Client Work',
      description: 'An ultra-modern monochrome e-commerce storefront engineered with fluid product catalogs, real-time cart state, persistent dark/light theme switching, and an integrated administrative management architecture.',
      highlights: [
        'Fluid product catalog with reactive filtering',
        'Complete administrative management suite',
        'Instant zero-flash dark/light theme engine',
        'Streamlined mobile shopping experience'
      ],
      techStack: ['React', 'Framer Motion', 'Tailwind CSS', 'Admin Console', 'Vercel'],
      gradient: 'from-brand/20 via-surface to-transparent',
      borderColor: 'border-brand/60',
      badgeColor: 'bg-brand/15 text-brand border-brand/30'
    }
  ];

  const additionalProducts = [
    {
      id: 'queflow-crm',
      title: 'QueFlow SaaS CRM',
      category: 'Enterprise SaaS Platform',
      url: 'https://queflow.in',
      icon: Layers,
      description: 'Multi-tenant CRM platform built for sales workflows, automated lead routing, and customer support tracking.',
      techStack: ['React', 'Node.js', 'REST API', 'Tailwind CSS']
    }
  ];

  return (
    <section id="work" className="py-24 sm:py-32 bg-transparent relative z-10 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-xs font-mono font-semibold text-text uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>[ PORTFOLIO | WORK DONE BY US ]</span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] text-text leading-tight">
              Work Done By Us. <br />
              <span className="font-semibold text-brand">Featured Live Projects.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-sm sm:text-base text-text opacity-85 leading-relaxed max-w-2xl mx-auto">
              Explore production web platforms, custom e-commerce storefronts, and cloud applications designed and delivered by QUE SOLUTIONS.
            </p>
          </Reveal>
        </div>

        {/* Highlighted Primary Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {highlightedProjects.map((project, idx) => {
            const Icon = project.icon;
            return (
              <Reveal key={project.id} delay={0.2 + idx * 0.1}>
                <div className={`relative h-full flex flex-col justify-between rounded-3xl border ${project.borderColor} bg-surface p-8 sm:p-10 shadow-xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 ring-1 ring-brand/20`}>
                  
                  {/* Subtle Accent Glow */}
                  <div className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-br ${project.gradient} rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

                  <div className="relative z-10 space-y-6">
                    
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider bg-brand/10 border-brand/40 text-brand">
                          <Star className="w-3 h-3 fill-brand text-brand" />
                          <span>{project.tag}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Live Project</span>
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-text opacity-60 tracking-wider">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 pt-2">
                      <div className="w-14 h-14 rounded-2xl bg-elevated border border-border flex items-center justify-center text-brand shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-brand tracking-wide uppercase">
                          {project.category}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
                          {project.title}
                        </h3>
                        <p className="text-xs text-text opacity-70 font-medium">
                          {project.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-text opacity-85 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Highlights Checkmarks */}
                    <div className="space-y-2 pt-2 border-t border-border/60">
                      {project.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2.5 text-xs text-text">
                          <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                          <span className="opacity-90">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border border-border bg-elevated text-text opacity-80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-8 relative z-10">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brand-inverse w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-95 transition-all group/btn"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Visit Live Website</span>
                      <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Additional SaaS Highlight Card */}
        <Reveal delay={0.4}>
          <div className="rounded-3xl border border-border/80 bg-surface/70 backdrop-blur-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-brand tracking-wider uppercase">Internal SaaS Platform</div>
                <h4 className="text-lg sm:text-xl font-bold text-text">QueFlow CRM & Automation</h4>
                <p className="text-xs text-text opacity-75 max-w-xl">
                  Enterprise-grade multi-tenant customer relationship engine configured to manage support queues, follow-ups, and client interactions.
                </p>
              </div>
            </div>
            <a
              href="https://queflow.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-elevated hover:bg-hover text-text text-xs font-bold uppercase tracking-wider transition-all shrink-0 hover:border-brand"
            >
              <span>Explore QueFlow</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
