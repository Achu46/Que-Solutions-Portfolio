import React from 'react';
import { MessageSquare, PhoneIncoming, PhoneOutgoing, CheckCircle2, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { trackEvent } from '../../services/firebase/analyticsService';

const iconMap = {
  MessageSquare: MessageSquare,
  PhoneIncoming: PhoneIncoming,
  PhoneOutgoing: PhoneOutgoing,
};

export default function ServicesSection() {
  const { services, selectPlanForQuote } = useData();

  const handleInquireService = (serviceTitle) => {
    trackEvent('service_inquire', { service: serviceTitle });
    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="services" 
      aria-label="Our Support Services"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-brand tracking-wider uppercase">
            <span>Specialized Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            Customer Support Built for Growing Brands
          </h2>
          <p className="text-base sm:text-lg text-text/80 leading-relaxed">
            Professional outsourced customer care designed to handle your daily call volume, WhatsApp inquiries, and Instagram DMs with genuine empathy and speed.
          </p>
        </div>

        {/* 3 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || MessageSquare;

            return (
              <div 
                key={service.id || service.slug}
                className="group p-8 rounded-card border border-border bg-surface flex flex-col justify-between space-y-8 hover:border-brand transition-all duration-300 hover:shadow-xl"
              >
                <div className="space-y-6">
                  {/* Icon Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-brand-darker border border-brand/30 flex items-center justify-center text-brand-sage group-hover:scale-105 transition-transform">
                    <IconComponent className="w-7 h-7 text-brand-sage" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-text group-hover:text-brand transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-text/80 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-brand">
                      What's Included:
                    </div>
                    <ul className="space-y-2">
                      {service.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text/90">
                          <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => handleInquireService(service.title)}
                    className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-elevated hover:bg-brand hover:text-white transition-all text-xs font-semibold text-text group/btn"
                  >
                    <span>Inquire About {service.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
