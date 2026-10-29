import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import Reveal from './common/Reveal';

export default function ContactSection({ settings }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceInterested: 'Inbound Call Support',
    monthlyRequirement: 'Growth (₹15,999/mo)',
    message: '',
    website_url: '', // Honeypot field for bot suppression
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const phone = settings?.phone || '7092490337';
  const email = settings?.email || 'que.solutions.services@gmail.com';
  const location = settings?.location || 'Erode, Tamil Nadu';
  const whatsappUrl = settings?.social_whatsapp || 'https://wa.me/917092490337';

  // Listen for preselection events from Services & Pricing cards
  useEffect(() => {
    const handleServiceSelect = (e) => {
      if (e.detail?.service) {
        setFormData((prev) => ({ ...prev, serviceInterested: e.detail.service }));
      }
    };
    const handlePlanSelect = (e) => {
      if (e.detail?.plan) {
        setFormData((prev) => ({ ...prev, monthlyRequirement: `${e.detail.plan} Plan` }));
      }
    };

    window.addEventListener('que_select_service', handleServiceSelect);
    window.addEventListener('que_select_plan', handlePlanSelect);
    return () => {
      window.removeEventListener('que_select_service', handleServiceSelect);
      window.removeEventListener('que_select_plan', handlePlanSelect);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await api.submitLead(formData);
      setSuccessResult(res);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        serviceInterested: 'Inbound Call Support',
        monthlyRequirement: 'Growth (₹15,999/mo)',
        message: '',
        website_url: '',
      });
    } catch (err) {
      setErrorMessage(err.message || 'Submission failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Contact Details & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal delay={0.2}>
              <div className="rounded-3xl border border-border/80 bg-surface/85 backdrop-blur-xl p-8 sm:p-10 space-y-6 shadow-2xl">
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
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Lead Capture Form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.25}>
              <div className="rounded-3xl border border-border/80 bg-surface/85 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
              
              {/* Live Accessible Notification State */}
              <div aria-live="polite">
                {successResult && (
                  <div className="mb-6 p-4 rounded-2xl bg-brand/10 border border-brand text-text flex items-start gap-3 animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <strong className="block text-sm font-bold text-brand">Quote Request Submitted!</strong>
                      <p>{successResult.message}</p>
                      <p className="font-mono text-[11px] opacity-80">Reference Code: {successResult.leadCode}</p>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500 text-text flex items-start gap-3 animate-fadeIn">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-sm font-bold text-red-500">Submission Error</strong>
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Honeypot anti-spam field hidden from humans */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_url">Do not fill this field</label>
                  <input
                    type="text"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-text">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      minLength={2}
                      maxLength={100}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Anand Kumar"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="company" className="text-xs font-bold text-text">
                      Business / Brand Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      maxLength={100}
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Artisan Naturals"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-text">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="anand@brand.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-text">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      minLength={7}
                      maxLength={15}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="serviceInterested" className="text-xs font-bold text-text">
                      Primary Service Needed
                    </label>
                    <select
                      id="serviceInterested"
                      name="serviceInterested"
                      value={formData.serviceInterested}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand transition-colors"
                    >
                      <option value="Inbound Call Support">Inbound Call Support</option>
                      <option value="Outbound Call Support">Outbound Call Support</option>
                      <option value="Chat Support">Chat Support (Web & WhatsApp)</option>
                      <option value="Full Omnichannel Suite">Full Omnichannel Suite</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="monthlyRequirement" className="text-xs font-bold text-text">
                      Preferred Support Plan
                    </label>
                    <select
                      id="monthlyRequirement"
                      name="monthlyRequirement"
                      value={formData.monthlyRequirement}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand transition-colors"
                    >
                      <option value="Starter (₹11,999/mo)">Starter (₹11,999/mo — Chat)</option>
                      <option value="Growth (₹15,999/mo)">Growth (₹15,999/mo — Chat + Voice)</option>
                      <option value="Business (₹21,999/mo)">Business (₹21,999/mo — Full Suite)</option>
                      <option value="Custom Requirement">Custom Shift Hours</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-text">
                    Daily Volume & Message Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={2000}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your daily inquiry volume, typical customer questions, or timeline..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-text text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inverse w-full py-4 px-8 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Sending Your Request...</span>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full accent-dot" />
                        <span>Submit Quote Request</span>
                        <Send className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-text opacity-70 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                  <span>Strict privacy. Your contact details are never shared with 3rd parties.</span>
                </div>
              </form>
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
