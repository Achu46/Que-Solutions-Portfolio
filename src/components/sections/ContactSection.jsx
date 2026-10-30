import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { CONTACT_INFO } from '../../config/constants';
import { submitLead } from '../../services/firebase/leadsService';
import { trackEvent } from '../../services/firebase/analyticsService';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  email: z.string().email('Please enter a valid email address').max(150),
  phone: z.string().min(5, 'Phone number is required').max(25, 'Invalid phone number length'),
  company: z.string().max(150).optional().or(z.literal('')),
  businessType: z.string().min(1, 'Please select your business type'),
  selectedPlan: z.string().min(1, 'Please select a plan'),
  message: z.string().max(2000, 'Message cannot exceed 2000 characters').optional().or(z.literal('')),
  website_hp: z.string().max(0, 'Bot detected').optional().or(z.literal('')), // Honeypot field
});

const COOLDOWN_KEY = 'que_contact_cooldown';
const COOLDOWN_MS = 60000; // 60 seconds cooldown

export default function ContactSection() {
  const { siteSettings, plans, selectedPlanForQuote, setSelectedPlanForQuote } = useData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Capture UTM parameters from URL if present
  const [sourceData, setSourceData] = useState('Website Contact Form');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source');
      const utmCampaign = params.get('utm_campaign');
      if (utmSource) {
        setSourceData(`UTM: ${utmSource}${utmCampaign ? ' / ' + utmCampaign : ''}`);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      businessType: 'Small D2C Brand',
      selectedPlan: selectedPlanForQuote || 'Growth (₹15,999/mo)',
      message: '',
      website_hp: '',
    },
  });

  // Sync selected plan from pricing card click
  useEffect(() => {
    if (selectedPlanForQuote) {
      setValue('selectedPlan', selectedPlanForQuote);
    }
  }, [selectedPlanForQuote, setValue]);

  // Check cooldown on load
  useEffect(() => {
    const lastSubmit = localStorage.getItem(COOLDOWN_KEY);
    if (lastSubmit) {
      const diff = Date.now() - Number(lastSubmit);
      if (diff < COOLDOWN_MS) {
        setCooldownRemaining(Math.ceil((COOLDOWN_MS - diff) / 1000));
        const timer = setInterval(() => {
          const currentDiff = Date.now() - Number(lastSubmit);
          if (currentDiff >= COOLDOWN_MS) {
            setCooldownRemaining(0);
            clearInterval(timer);
          } else {
            setCooldownRemaining(Math.ceil((COOLDOWN_MS - currentDiff) / 1000));
          }
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, [submissionStatus]);

  const onSubmit = async (data) => {
    // Honeypot check
    if (data.website_hp) {
      console.warn("Honeypot triggered");
      return;
    }

    // Cooldown check
    const lastSubmit = localStorage.getItem(COOLDOWN_KEY);
    if (lastSubmit && (Date.now() - Number(lastSubmit) < COOLDOWN_MS)) {
      setErrorMessage(`Please wait ${cooldownRemaining}s before submitting again.`);
      setSubmissionStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || '',
        businessType: data.businessType,
        selectedPlan: data.selectedPlan,
        message: data.message || '',
        source: sourceData,
      };

      await submitLead(payload);
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      trackEvent('lead_submitted', { plan: data.selectedPlan, businessType: data.businessType });

      setSubmissionStatus('success');
      reset();
      setSelectedPlanForQuote('');
    } catch (err) {
      setSubmissionStatus('error');
      setErrorMessage(err.message || 'Unable to submit request. Please try contacting via WhatsApp or phone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      aria-label="Contact and Quote Request"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-brand tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Inquiry</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
            Get a Personalized Quote
          </h2>
          <p className="text-base sm:text-lg text-text/80 leading-relaxed">
            Tell us about your brand and weekly ticket volumes. Our team will review your requirements and outline a tailored customer support shift.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Card (Left 5 Cols) */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-card border border-border bg-surface space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-text">
                QUE SOLUTIONS
              </h3>
              <p className="text-xs font-semibold text-brand mt-1 uppercase tracking-wider">
                Support | Technology | Growth
              </p>
              <p className="mt-3 text-sm text-text/80 leading-relaxed">
                Connect directly with our team in Erode, Tamil Nadu for prompt consultation and custom shift configurations.
              </p>
            </div>

            <div className="space-y-5">
              <a 
                href={`tel:${siteSettings?.phone || CONTACT_INFO.phone}`}
                className="flex items-center gap-3.5 text-text hover:text-brand transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="text-xs text-text/60 font-medium">Call Us Directly</div>
                  <div className="text-sm font-semibold">{siteSettings?.displayPhone || CONTACT_INFO.displayPhone}</div>
                </div>
              </a>

              <a 
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 text-text hover:text-brand transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="text-xs text-text/60 font-medium">WhatsApp Support Chat</div>
                  <div className="text-sm font-semibold">Message on WhatsApp (Fastest)</div>
                </div>
              </a>

              <a 
                href={`mailto:${siteSettings?.email || CONTACT_INFO.email}`}
                className="flex items-center gap-3.5 text-text hover:text-brand transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="text-xs text-text/60 font-medium">Email Inquiries</div>
                  <div className="text-sm font-semibold break-all">{siteSettings?.email || CONTACT_INFO.email}</div>
                </div>
              </a>

              <div className="flex items-center gap-3.5 text-text">
                <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand">
                  <MapPin className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="text-xs text-text/60 font-medium">Operating Hub</div>
                  <div className="text-sm font-semibold">{siteSettings?.location || CONTACT_INFO.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-text">
                <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center text-brand mt-0.5">
                  <Clock className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="text-xs text-text/60 font-medium">Operating Model</div>
                  <div className="text-sm font-semibold">{siteSettings?.hours || CONTACT_INFO.operatingHours}</div>
                  <div className="text-xs text-text/70 mt-0.5">Structured non-24/7 dedicated coverage</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-elevated border border-border text-xs text-text/80 space-y-1">
              <span className="font-semibold text-brand">Client Privacy Guarantee:</span>
              <p>Your business contact data is handled strictly for confidential consultation and quote generation.</p>
            </div>
          </div>

          {/* Lead Capture Form (Right 7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-card border border-border bg-surface shadow-xl">
            {submissionStatus === 'success' ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-brand-darker border border-brand/40 text-brand-sage flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-brand-sage" />
                </div>
                <h3 className="text-2xl font-bold text-text">
                  Quote Request Received!
                </h3>
                <p className="text-sm text-text/80 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to QUE SOLUTIONS. Our client lead will review your requirements and follow up within 4 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmissionStatus(null)}
                  className="brand-inverse px-6 py-2.5 rounded-full text-xs font-semibold shadow-md hover:bg-brand-deep transition-all mt-4"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                
                {/* Honeypot field (hidden from real users) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_hp">Leave this blank</label>
                  <input
                    id="website_hp"
                    type="text"
                    tabIndex="-1"
                    autoComplete="off"
                    {...register('website_hp')}
                  />
                </div>

                {/* Error Banner */}
                {submissionStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-3 text-red-400 text-xs font-medium animate-fadeIn">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage || "Submission error occurred. Please try again."}</span>
                  </div>
                )}

                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-semibold text-text">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      {...register('name')}
                      className={`w-full px-4 py-3 rounded-xl border bg-elevated text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                        errors.name ? 'border-red-500' : 'border-border'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs font-semibold text-text">
                      Phone / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      {...register('phone')}
                      className={`w-full px-4 py-3 rounded-xl border bg-elevated text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                        errors.phone ? 'border-red-500' : 'border-border'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-500 font-medium">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Email & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold text-text">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. founder@yourbrand.com"
                      {...register('email')}
                      className={`w-full px-4 py-3 rounded-xl border bg-elevated text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                        errors.email ? 'border-red-500' : 'border-border'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-500 font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="company" className="block text-xs font-semibold text-text">
                      Brand / Store Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      placeholder="e.g. Aura Naturals"
                      {...register('company')}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                  </div>
                </div>

                {/* Row 3: Business Type & Selected Plan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="businessType" className="block text-xs font-semibold text-text">
                      Business Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="businessType"
                      {...register('businessType')}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <option value="Small D2C Brand">Small D2C Brand</option>
                      <option value="Instagram / Social Seller">Instagram / Social Seller</option>
                      <option value="Online Product Business">Online Product Business</option>
                      <option value="Amazon / Marketplace Seller">Amazon / Marketplace Seller</option>
                      <option value="Local Brand Moving Online">Local Brand Moving Online</option>
                      <option value="Other Product Enterprise">Other Product Enterprise</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="selectedPlan" className="block text-xs font-semibold text-text">
                      Interested Plan <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="selectedPlan"
                      {...register('selectedPlan')}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} (₹{p.price.toLocaleString('en-IN')}/mo)
                        </option>
                      ))}
                      <option value="Custom Enterprise Solution">Custom Inbound/Outbound Shift</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold text-text">
                    Current Support Requirements & Daily Ticket Volumes
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us about your customer support channels, peak hours, or specific questions..."
                    {...register('message')}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand resize-y"
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-500 font-medium">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cooldownRemaining > 0}
                  className="brand-inverse w-full py-4 rounded-xl text-base font-bold shadow-lg hover:bg-brand-deep active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending Your Request...</span>
                    </>
                  ) : cooldownRemaining > 0 ? (
                    <span>Wait {cooldownRemaining}s Before Next Request</span>
                  ) : (
                    <>
                      <span>Submit Quote Request</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-text/60">
                  By submitting, you agree to receive a personalized quote via email or WhatsApp from QUE SOLUTIONS.
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
