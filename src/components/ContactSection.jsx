import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, FileText, ExternalLink } from 'lucide-react';
import Reveal from './common/Reveal';

export default function ContactSection({ settings }) {
  const phone = settings?.phone || '70924 90337';
  const email = settings?.email || 'que.solutions.services@gmail.com';
  const location = settings?.location || 'Erode, Tamil Nadu';
  const whatsappUrl = 'https://wa.me/917092490337';
  const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeHWPoqo14hoM9QqY9Z-1x8z1R4aolL1t1kyEArTB3TFxuxJQ/viewform?usp=publish-editor';

  return (
    <section id="contact" className="py-24 sm:py-32 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-xs font-mono font-semibold text-text uppercase tracking-widest">
              [ INQUIRY | REQUEST A QUOTE ]
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.035em] text-text leading-tight">
              Request a <br />
              <span className="font-semibold text-brand">Personalized Proposal.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-sm sm:text-base text-text opacity-85 leading-relaxed max-w-2xl mx-auto">
              Tell us about your product store, daily inquiry volumes, and preferred channels. We respond with a structured onboarding proposal within 24 hours.
            </p>
          </Reveal>
        </div>

        {/* Direct Contact Details & Quote Action */}
        <div className="max-w-2xl mx-auto">
          <Reveal delay={0.2}>
            <div className="rounded-3xl border border-border/80 bg-surface p-8 sm:p-10 space-y-6 shadow-md">
              <h3 className="text-2xl font-light text-text tracking-tight">Direct Contact</h3>
              
              <div className="space-y-4">
                <a
                  href={`tel:${phone}`}
                  className="p-4 rounded-2xl border border-border/70 bg-elevated/70 flex items-center gap-4 hover:border-brand transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-brand shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-text opacity-70">Direct Phone</div>
                    <div className="text-sm font-bold text-text">{phone}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="p-4 rounded-2xl border border-border/70 bg-elevated/70 flex items-center gap-4 hover:border-brand transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-brand shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-text opacity-70">Official Email</div>
                    <div className="text-sm font-bold text-text break-all">{email}</div>
                  </div>
                </a>

                <a
                  href="https://maps.google.com/?q=Erode,+Tamil+Nadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl border border-border/70 bg-elevated/70 flex items-center gap-4 hover:border-brand transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-brand shrink-0 group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-text opacity-70">Headquarters</div>
                    <div className="text-sm font-bold text-text">{location}</div>
                  </div>
                </a>

                <div className="p-4 rounded-2xl border border-border/70 bg-elevated/70 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-brand shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-text opacity-70">Operating Hours</div>
                    <div className="text-sm font-bold text-text">Mon – Sat: 4 hrs/day (~104 hrs/mo)</div>
                  </div>
                </div>

                <a
                  href={googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl border border-brand/50 bg-brand/5 flex items-center gap-4 hover:border-brand transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-brand shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-brand font-semibold">Official Quote Form</div>
                    <div className="text-sm font-bold text-text flex items-center gap-1.5">
                      <span>Fill via Google Forms</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </div>
                  </div>
                </a>
              </div>

              {/* Instant WhatsApp Action */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl inverse text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 70924 90337)</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
