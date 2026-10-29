import React from 'react';
import { ExternalLink, Check, Sparkles, Clock, ArrowUpRight, ShieldCheck, Database, Layers } from 'lucide-react';
import Reveal from './common/Reveal';

export default function ProductsSection({ products, projects, settings }) {
  // Primary product: QueFlow CRM
  const queFlow = (products || []).find((p) => p.id === 'queflow') || {
    name: 'QueFlow CRM',
    tagline: 'Multi-Tenant SaaS CRM for Growing Small Businesses',
    description:
      'Streamline leads, contacts, deals, customer follow-ups, team collaboration and real-time reports in a single intuitive workspace.',
    url: 'https://queflow.in',
    features: [
      'Lead & Contact Management',
      'Follow-up Scheduler & Reminders',
      'Visual Deal Pipelines',
      'Team Multi-Tenant Access',
      'Instant Daily Activity Reports',
    ],
  };

  const showHrms = settings?.show_hrms_card !== false;
  const showArabicErp = settings?.show_arabic_erp_card !== false;

  return (
    <section id="products" className="py-24 sm:py-32 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-xs font-mono font-semibold text-text uppercase tracking-widest">
              [ PRODUCTS | QUEFLOW SAAS ECOSYSTEM ]
            </div>
          </Reveal>
          
          <Reveal delay={0.08}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] text-text leading-tight">
              Purpose-Built Software for <br />
              <span className="font-semibold text-brand">Growing Enterprises.</span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.16}>
            <p className="text-sm sm:text-base text-text opacity-85 leading-relaxed max-w-2xl mx-auto">
              In-house software solutions engineered to give founders seamless visibility over every lead, order verification, and client conversation.
            </p>
          </Reveal>
        </div>

        {/* Featured QueFlow CRM Showcase */}
        <Reveal delay={0.2} className="mb-14">
          <div className="rounded-3xl border border-border/80 bg-surface/85 backdrop-blur-xl p-8 sm:p-12 lg:p-14 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Product Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs font-bold text-text">
                  <span className="w-2 h-2 rounded-full accent-dot animate-pulse" />
                  <span>Flagship SaaS Product</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-light tracking-tight text-text">
                    {queFlow.name}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-brand">
                    {queFlow.tagline}
                  </p>
                </div>

                <p className="text-sm text-text opacity-85 leading-relaxed">
                  {queFlow.description}
                </p>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(queFlow.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-text">
                      <span className="w-4 h-4 rounded-full bg-elevated border border-border flex items-center justify-center text-brand shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className="opacity-90">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA Pills */}
                <div className="pt-4 flex flex-wrap gap-4">
                  <a
                    href="https://queflow.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inverse inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-95 transition-all"
                  >
                    <span className="w-2 h-2 rounded-full accent-dot" />
                    <span>Visit QueFlow</span>
                    <ArrowUpRight className="w-4 h-4 opacity-70" />
                  </a>

                  <a
                    href="https://leads.queflow.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider border border-border bg-elevated hover:bg-hover text-text transition-all"
                  >
                    <span>Launch Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-brand" />
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive CRM Workflow Preview (complements the drifting 3D infinity loop) */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="p-6 sm:p-7 rounded-2xl border border-border/80 bg-elevated/70 backdrop-blur-md shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-brand" />
                      <span className="text-xs font-bold text-text">Live Pipeline Activity</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface border border-border text-brand font-semibold">
                      v2.4 Active
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-surface/80 border border-border/70 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-text">Order Confirmation Call</div>
                        <div className="text-[11px] opacity-75">Customer #8492 • Erode Store</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-elevated text-brand border border-border">
                        Completed
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface/80 border border-border/70 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-text">Abandoned Cart Recovery</div>
                        <div className="text-[11px] opacity-75">WhatsApp Follow-up • Sent</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-elevated text-brand border border-border">
                        Converted
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface/80 border border-border/70 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-text">Support Ticket Escalation</div>
                        <div className="text-[11px] opacity-75">Inbound Call Logged • Resolved</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-elevated text-brand border border-border">
                        SLA Met
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono opacity-70 text-center pt-1">
                    Integrated directly with Que Solutions call teams
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Coming Soon Cards: HRMS & Arabic ERP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showHrms && (
            <Reveal delay={0.25} className="h-full">
              <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-surface/80 backdrop-blur-xl p-8 flex flex-col justify-between space-y-4 shadow-xl h-full">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-[11px] font-mono font-bold text-text opacity-80">
                    <Clock className="w-3 h-3 text-brand" />
                    <span>[ COMING SOON ]</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-light text-text">HRMS Platform</h4>
                  <p className="text-xs sm:text-sm text-text opacity-80 leading-relaxed font-normal">
                    Smart workforce, payroll, and attendance platform designed to streamline employee records and leave tracking for growing enterprises.
                  </p>
                </div>
                <div className="text-xs font-mono font-medium text-brand pt-2 border-t border-border/60">
                  Planned Future Release • Active Roadmap
                </div>
              </div>
            </Reveal>
          )}

          {showArabicErp && (
            <Reveal delay={0.3} className="h-full">
              <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-surface/80 backdrop-blur-xl p-8 flex flex-col justify-between space-y-4 shadow-xl h-full">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-[11px] font-mono font-bold text-text opacity-80">
                    <Clock className="w-3 h-3 text-brand" />
                    <span>[ COMING SOON ]</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-light text-text">Arabic ERP Solution</h4>
                  <p className="text-xs sm:text-sm text-text opacity-80 leading-relaxed font-normal">
                    Bilingual enterprise resource planning software tailored for regional compliance, multi-currency invoicing, and operational accounting.
                  </p>
                </div>
                <div className="text-xs font-mono font-medium text-brand pt-2 border-t border-border/60">
                  Planned Future Release • Regional Market Expansion
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* Real Projects (Rendered only if projects exist in database) */}
        {projects && projects.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border space-y-8">
            <h3 className="text-2xl font-bold text-text">Client Work & Implementations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="rounded-2xl border border-border bg-surface p-6 space-y-3">
                  <h4 className="text-base font-bold text-text">{proj.title}</h4>
                  <p className="text-xs text-text opacity-80">{proj.summary}</p>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline pt-2"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
