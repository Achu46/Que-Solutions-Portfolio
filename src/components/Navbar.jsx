import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Logo3D from './common/Logo3D';

export default function Navbar({ settings }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const phone = settings?.phone || '7092490337';

  useEffect(() => {
    let lastScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 24;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Work', href: '#work' },
    // { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/85 backdrop-blur-md border-b border-border shadow-soft py-2 sm:py-2.5'
          : 'bg-transparent border-b border-transparent py-2.5 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Official Brand Logo with 3D Effect */}
          <a href="#home" className="flex items-center gap-3 group select-none">
            <Logo3D size="md" variant="circle" />
            <span className="hidden sm:inline-block text-base font-bold tracking-wider text-text group-hover:text-brand transition-colors">
              QUE SOLUTIONS
            </span>
          </a>

          {/* Desktop Nav Links with Animated Underline */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium text-text hover:text-brand transition-colors py-1 group"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action CTAs & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Sun / Moon */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 sm:p-2.5 rounded-full border border-border/80 bg-surface/90 hover:bg-hover text-text transition-all duration-200 cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-brand flex items-center justify-center min-w-[40px] min-h-[40px]"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-brand transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-brand transition-transform hover:-rotate-12" />
              )}
            </button>

            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-xs font-semibold text-text bg-surface hover:bg-hover border border-border px-3.5 py-2 rounded-full transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-brand" />
              <span>{phone}</span>
            </a>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeHWPoqo14hoM9QqY9Z-1x8z1R4aolL1t1kyEArTB3TFxuxJQ/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold px-5 py-2.5 min-h-[44px] rounded-full shadow-soft hover:opacity-95 active:scale-95 transition-all z-10"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
              }}
            >
              <span className="font-bold tracking-wide text-black" style={{ color: '#000000' }}>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" style={{ color: '#000000' }} />
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-lg border border-border bg-surface text-text cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px]"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="w-4 h-4 text-brand" /> : <Moon className="w-4 h-4 text-brand" />}
            </button>
            <a
              href={`tel:${phone}`}
              className="p-2 text-text bg-surface border border-border rounded-lg"
              title={`Call ${phone}`}
            >
              <Phone className="w-4 h-4 text-brand" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text hover:bg-surface rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-x-0 top-[73px] bottom-0 bg-surface/98 backdrop-blur-xl border-b border-border px-6 pt-6 pb-10 shadow-2xl flex flex-col justify-between overflow-y-auto animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-text hover:text-brand py-2 border-b border-border/50"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-6 flex flex-col gap-3">
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 text-sm font-semibold bg-elevated text-text py-3 rounded-xl border border-border"
            >
              <Phone className="w-4 h-4 text-brand" />
              <span>Call {phone}</span>
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeHWPoqo14hoM9QqY9Z-1x8z1R4aolL1t1kyEArTB3TFxuxJQ/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="brand-inverse flex items-center justify-center gap-2 text-sm font-bold py-3.5 rounded-xl shadow-soft"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
