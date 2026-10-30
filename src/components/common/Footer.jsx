import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, MessageCircle, Shield } from 'lucide-react';
import { CONTACT_INFO, COMPANY_NAME, TAGLINE, PILLARS, NAV_LINKS } from '../../config/constants';
import { useData } from '../../context/DataContext';

export default function Footer() {
  const { siteSettings } = useData();

  return (
    <footer className="w-full bg-surface border-t border-border mt-24 text-text transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt={COMPANY_NAME} 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm font-medium text-brand">
              {TAGLINE}
            </p>
            <p className="text-xs text-text/80 leading-relaxed">
              Outsourced customer care and call centre services dedicated to small and growing product-based businesses.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {PILLARS.map((pillar) => (
                <span 
                  key={pillar}
                  className="px-2.5 py-1 text-[11px] font-semibold tracking-wider rounded-md bg-elevated border border-border text-brand-sage"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-text/80 hover:text-brand transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text">
              Direct Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href={`tel:${siteSettings?.phone || CONTACT_INFO.phone}`} 
                  className="flex items-center gap-2.5 text-text/80 hover:text-brand transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                  <span>{siteSettings?.displayPhone || CONTACT_INFO.displayPhone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={CONTACT_INFO.whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 text-text/80 hover:text-brand transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-brand flex-shrink-0" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${siteSettings?.email || CONTACT_INFO.email}`} 
                  className="flex items-center gap-2.5 text-text/80 hover:text-brand transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                  <span className="break-all">{siteSettings?.email || CONTACT_INFO.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-text/80">
                <MapPin className="w-4 h-4 text-brand flex-shrink-0" />
                <span>{siteSettings?.location || CONTACT_INFO.location}</span>
              </li>
              <li className="flex items-start gap-2.5 text-text/80">
                <Clock className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <span>{siteSettings?.hours || CONTACT_INFO.operatingHours}</span>
              </li>
            </ul>
          </div>

          {/* Legal & Operations */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text">
              Compliance & Legal
            </h3>
            <p className="text-xs text-text/80 leading-relaxed">
              Operating model: Structured non-24/7 dedicated coverage tailored for D2C brands and marketplace sellers.
            </p>
            <ul className="space-y-2 text-sm pt-2">
              <li>
                <Link to="/privacy" className="text-text/80 hover:text-brand transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-text/80 hover:text-brand transition-colors">
                  Terms of Service
                </Link>
              </li>
              {/* <li>
                <Link to="/que" className="inline-flex items-center gap-1.5 text-xs text-text/60 hover:text-brand transition-colors pt-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </li> */}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text/70">
          <p>© 2026 {COMPANY_NAME}. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Designed for high conversion and brand excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
