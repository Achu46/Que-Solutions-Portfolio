import React, { Suspense, lazy } from 'react';
import { ExternalLink, Check, Sparkles, Layers, Clock } from 'lucide-react';
import ProductPosterFallback from './3d/ProductPosterFallback';
import { useTheme } from '../context/ThemeContext';

const Product3DCanvas = lazy(() => import('./3d/Product3DCanvas'));

export default function ProductsSection({ products, projects, settings }) {
  const { isDark } = useTheme();

  // Primary product: QueFlow CRM
  const queFlow = (products || []).find(p => p.id === 'queflow') || {
    name: 'QueFlow CRM',
    tagline: 'Multi-Tenant SaaS CRM for Growing Small Businesses',
    description: 'Streamline leads, contacts, deals, customer follow-ups, team collaboration and real-time reports in a single intuitive workspace.',
    url: 'https://queflow.in',
    features: ['Lead & Contact Management', 'Follow-up Scheduler', 'Deal Pipeline', 'Team Collaboration', 'Performance Analytics']
  };

  const showHrms = settings?.show_hrms_card !== false;
  const showArabicErp = settings?.show_arabic_erp_card !== false;

  return (
    <section id="products" className="py-24 sm:py-28 bg-surface/50 border-y border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-brand text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technology & Software Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight">
            Our Featured <span className="gradient-text">Products & Software</span>
          </h2>
          <p className="text-base text-text opacity-80 leading-relaxed">
            In-house tools and software solutions designed to empower small businesses with streamlined customer and workflow management.
          </p>
        </div>

        {/* Featured QueFlow CRM Showcase */}
        <div className="rounded-3xl border border-border bg-surface p-8 sm:p-10 lg:p-12 shadow-soft mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Product Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs font-bold text-brand">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span>Live SaaS CRM</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-text tracking-tight">
                {queFlow.name}
              </h3>

              <p className="text-base font-medium text-brand">
                {queFlow.tagline}
              </p>

              <p className="text-sm text-text opacity-80 leading-relaxed">
                {queFlow.description}
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(queFlow.features || []).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-text">
                    <span className="w-4 h-4 rounded-full bg-elevated border border-border flex items-center justify-center text-brand shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTA Link */}
              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="https://queflow.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-inverse inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-soft hover:opacity-95 transition-all"
                >
                  <span>Visit QueFlow</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://leads.queflow.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider border border-border bg-elevated hover:bg-hover text-text transition-all"
                >
                  <span>Launch App</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand" />
                </a>
              </div>
            </div>

            {/* Right: 3D Product Mock Canvas */}
            <div className="lg:col-span-6 flex items-center justify-center relative min-h-[340px]">
              <Suspense fallback={<ProductPosterFallback isDark={isDark} />}>
                <Product3DCanvas />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Coming Soon Cards: HRMS & Arabic ERP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showHrms && (
            <div className="rounded-2xl border border-border bg-surface p-7 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-[11px] font-bold text-text opacity-80">
                  <Clock className="w-3 h-3 text-brand" />
                  <span>Coming Soon</span>
                </div>
                <h4 className="text-xl font-bold text-text">HRMS Platform</h4>
                <p className="text-xs text-text opacity-75 leading-relaxed">
                  Smart workforce, payroll, and attendance platform designed to streamline employee records and leave tracking for growing enterprises.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-brand pt-2">
                Planned Future Release • Active Roadmap
              </div>
            </div>
          )}

          {showArabicErp && (
            <div className="rounded-2xl border border-border bg-surface p-7 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-[11px] font-bold text-text opacity-80">
                  <Clock className="w-3 h-3 text-brand" />
                  <span>Coming Soon</span>
                </div>
                <h4 className="text-xl font-bold text-text">Arabic ERP Solution</h4>
                <p className="text-xs text-text opacity-75 leading-relaxed">
                  Bilingual enterprise resource planning software tailored for regional compliance, multi-currency invoicing, and operational accounting.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-brand pt-2">
                Planned Future Release • Regional Market Expansion
              </div>
            </div>
          )}
        </div>

        {/* Admin-Added Projects (Rendered only if projects exist) */}
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
