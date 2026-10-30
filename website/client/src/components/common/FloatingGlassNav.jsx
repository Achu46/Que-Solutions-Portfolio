import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Logo3D from './Logo3D';

export default function FloatingGlassNav({ settings }) {
  const [activeSection, setActiveSection] = useState('home');
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const { isDark } = useTheme();

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Services', href: '#services', id: 'services', hasDropdown: true },
    { name: 'Products', href: '#products', id: 'products' },
    { name: 'Pricing', href: '#pricing', id: 'pricing' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const serviceSubItems = [
    { name: 'Inbound Call Support', href: '#services' },
    { name: 'Outbound Call Support', href: '#services' },
    { name: 'Chat Support (Web & WhatsApp)', href: '#services' },
  ];

  // IntersectionObserver to track active section with zero scroll overhead
  useEffect(() => {
    const sections = ['home', 'services', 'products', 'pricing', 'about', 'contact'];
    const elements = sections.map((id) => document.getElementById(id)).filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav 
      aria-label="Floating Navigation"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-1/2 -translate-x-1/2 z-40 select-none max-w-[calc(100vw-1rem)] sm:max-w-max px-1"
    >
      <div className="relative flex items-center gap-0.5 sm:gap-1.5 p-1 sm:p-2 rounded-full border border-border/80 bg-surface/90 backdrop-blur-xl shadow-2xl overflow-x-auto no-scrollbar">
        {/* Official 3D Brand Emblem */}
        <a
          href="#home"
          onClick={() => setActiveSection('home')}
          aria-label="QUE SOLUTIONS Home"
          title="QUE SOLUTIONS"
          className="relative flex-shrink-0 flex items-center justify-center pl-1 sm:pl-1.5 pr-0.5 min-h-[44px] rounded-full transition-transform active:scale-95"
        >
          <Logo3D size="xs" variant="circle" />
        </a>

        {/* Subtle Brand Divider */}
        <div className="w-[1px] h-4 bg-border/60 mx-0.5 flex-shrink-0" />

        {/* Navigation Items */}
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;

          if (link.hasDropdown) {
            return (
              <div 
                key={link.id} 
                className="relative flex-shrink-0"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <a
                  href={link.href}
                  onClick={() => setActiveSection(link.id)}
                  className={`relative flex items-center justify-center min-h-[44px] gap-1 px-3 sm:px-4 py-2 rounded-full text-[12px] sm:text-xs md:text-sm font-medium whitespace-nowrap transition-colors`}
                  style={{
                    color: isActive ? 'var(--inverse-text)' : 'var(--text)',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full inverse shadow-md -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10" style={{ color: isActive ? 'var(--inverse-text)' : undefined }}>
                    {link.name}
                  </span>
                  <ChevronDown 
                    className={`relative z-10 w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} 
                    style={{ color: isActive ? 'var(--inverse-text)' : undefined }}
                  />
                </a>

                {/* Services Dropdown Flyout */}
                <AnimatePresence>
                  {servicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 rounded-2xl border border-border bg-surface/95 backdrop-blur-xl p-2 shadow-2xl space-y-1"
                    >
                      {serviceSubItems.map((sub, idx) => (
                        <a
                          key={idx}
                          href={sub.href}
                          onClick={() => setServicesDropdownOpen(false)}
                          className="block px-3 py-2.5 min-h-[44px] flex items-center rounded-xl text-xs font-medium text-text hover:bg-elevated transition-colors"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setActiveSection(link.id)}
              className={`relative flex-shrink-0 flex items-center justify-center min-h-[44px] px-3 sm:px-4 py-2 rounded-full text-[12px] sm:text-xs md:text-sm font-medium whitespace-nowrap transition-colors`}
              style={{
                color: isActive ? 'var(--inverse-text)' : 'var(--text)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-full inverse shadow-md -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span 
                className="relative z-10" 
                style={{ 
                  color: isActive ? 'var(--inverse-text)' : undefined,
                  fontWeight: isActive ? 700 : 500,
                  opacity: isActive ? 1 : 0.8
                }}
              >
                {link.name}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
