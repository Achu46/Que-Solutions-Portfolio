import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { NAV_LINKS, COMPANY_NAME } from '../../config/constants';
import { trackEvent } from '../../services/firebase/analyticsService';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section active spy
      const sections = NAV_LINKS.map(l => l.href.substring(1));
      const scrollPos = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (href, label) => {
    setMobileMenuOpen(false);
    trackEvent('nav_click', { link: label });
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    trackEvent('cta_click', { location: 'navbar', label: 'Get a Quote' });
    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-bg/85 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-transparent border-b border-border/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Unmodified Official Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
          aria-label={`${COMPANY_NAME} Home`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border flex items-center justify-center p-1.5 shadow-sm overflow-hidden flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="QUE SOLUTIONS" 
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links with animated indicator */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.label);
                }}
                className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-full ${
                  isActive ? 'text-brand font-semibold' : 'text-text hover:text-brand'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-brand rounded-full transition-all" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Controls: Theme Toggle & Get a Quote */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          
          <button
            type="button"
            onClick={handleCtaClick}
            className="brand-inverse inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide shadow-md hover:bg-brand-deep transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <span>Get a Quote</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-border bg-surface text-text hover:bg-hover focus-visible:ring-2 focus-visible:ring-brand"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 top-20 z-50 bg-bg/95 backdrop-blur-xl border-b border-border lg:hidden flex flex-col justify-between p-6 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.label);
                }}
                className="block px-4 py-3 rounded-xl text-lg font-medium text-text hover:bg-surface border border-transparent hover:border-border transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-border">
            <button
              type="button"
              onClick={handleCtaClick}
              className="brand-inverse w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-semibold shadow-lg active:scale-98"
            >
              <span>Get a Quote</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-center text-xs text-text/80">
              4 hrs/day, Mon to Sat (~104 hrs/mo)
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
