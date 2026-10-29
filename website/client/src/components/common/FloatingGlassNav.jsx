import React, { useState, useEffect } from 'react';
import { ChevronDown, Sun, Moon, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function FloatingGlassNav({ settings }) {
  const [activeSection, setActiveSection] = useState('home');
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

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

  // Intersection observer to track active section while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'products', 'pricing', 'about', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollPos) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      aria-label="Floating Navigation"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-1/2 -translate-x-1/2 z-40 select-none max-w-[calc(100vw-1rem)] sm:max-w-max px-1"
    >
      <div className="relative flex items-center gap-0.5 sm:gap-1.5 p-1 sm:p-2 rounded-full border border-border/80 bg-surface/90 backdrop-blur-xl shadow-2xl overflow-x-auto no-scrollbar">
        
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
                  className={`relative flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'text-text font-bold' : 'text-text opacity-70 hover:opacity-100'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full inverse shadow-md -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{link.name}</span>
                  <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
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
                          className="block px-3 py-2 rounded-xl text-xs font-medium text-text hover:bg-elevated transition-colors"
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
              className={`relative flex-shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-text font-bold' : 'text-text opacity-70 hover:opacity-100'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-full inverse shadow-md -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span>{link.name}</span>
            </a>
          );
        })}

        {/* Vertical divider */}
        <div className="w-[1px] h-4 sm:h-5 bg-border mx-0.5 sm:mx-1 flex-shrink-0" />

        {/* Theme Toggle Sun / Moon */}
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="p-1.5 sm:p-2 rounded-full text-text hover:bg-elevated transition-colors flex-shrink-0"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-brand-lime" /> : <Moon className="w-3.5 h-3.5 text-brand" />}
        </button>
      </div>
    </nav>
  );
}
