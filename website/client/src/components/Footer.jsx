import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo3D from './common/Logo3D';

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();
  const phone = settings?.phone || '7092490337';
  const email = settings?.email || 'que.solutions.services@gmail.com';
  const location = settings?.location || 'Erode, Tamil Nadu';
  const whatsappUrl = settings?.social_whatsapp || 'https://wa.me/917092490337';

  return (
    <footer className="w-full bg-surface border-t border-border/80 pt-16 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] sm:pb-16 text-text relative z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-border">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <a href="#home" className="inline-block" aria-label="QUE SOLUTIONS Home">
              <Logo3D size="md" variant="circle" />
            </a>
            <p className="text-xs font-semibold text-brand tracking-wider uppercase">
              Customer Care & Call Centre Services
            </p>
            <p className="text-xs text-text opacity-80 leading-relaxed font-normal">
              Dedicated outsourced customer care and call centre services built specifically for small and growing product-based businesses.
            </p>
            <div className="text-[11px] font-bold text-text tracking-widest pt-1">
              SUPPORT | TECHNOLOGY | GROWTH
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-brand transition-colors">Home</a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand transition-colors">Services</a>
              </li>
              <li>
                <a href="#products" className="hover:text-brand transition-colors">Products & Software</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-brand transition-colors">Pricing Plans</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-brand transition-colors">Why Partner With Us</a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand transition-colors">About Our Company</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand transition-colors">Get a Quote</a>
              </li>
            </ul>
          </div>

          {/* Services Quicklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">Our Solutions</h4>
            <ul className="space-y-2 text-xs opacity-90">
              <li>Inbound Call Support</li>
              <li>Outbound Follow-ups & COD</li>
              <li>Live Chat & WhatsApp Care</li>
              <li>QueFlow SaaS CRM</li>
              <li>Multi-Channel Escalations</li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">Contact & Location</h4>
            <div className="space-y-2.5 text-xs">
              <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-brand transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>{phone}</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-brand transition-colors">
                <Mail className="w-3.5 h-3.5 text-brand shrink-0" />
                <span className="break-all">{email}</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>Mon – Sat: 4 hrs/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-75">
          <p>© {currentYear} QUE SOLUTIONS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
