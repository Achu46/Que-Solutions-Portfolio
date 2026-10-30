import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const VARIANTS_MAP = {
  'fade-up': {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  'scale-in': {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
};

export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className = '',
  style = {},
  tag = 'div',
}) {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isDebug, setIsDebug] = useState(false);
  const elementRef = useRef(null);

  // Dev-only debug flag: ?debug=reveal
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('debug=reveal')) {
      setIsDebug(true);
    }
  }, []);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Safety net: force visible after 1.5s if intersection didn't fire
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      clearTimeout(safetyTimer);
      return;
    }

    // Trigger BEFORE element enters: 15% positive bottom margin
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(safetyTimer);
          observer.unobserve(el);
          if (isDebug) {
            console.log(`[Reveal] Triggered '${variant}' (delay ${delay}s):`, el);
          }
        }
      },
      {
        rootMargin: '0px 0px 15% 0px',
        threshold: threshold || 0.1,
      }
    );

    observer.observe(el);

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [threshold, variant, delay, isDebug]);

  const selectedVariant = VARIANTS_MAP[variant] || VARIANTS_MAP['fade-up'];

  const activeHidden = shouldReduceMotion ? { opacity: 0 } : selectedVariant.hidden;
  const activeVisible = shouldReduceMotion ? { opacity: 1 } : selectedVariant.visible;
  const activeTransition = shouldReduceMotion
    ? { duration: 0.2, ease: 'easeOut' }
    : {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      };

  const Component = motion[tag] || motion.div;

  return (
    <Component
      ref={elementRef}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        hidden: activeHidden,
        visible: activeVisible,
      }}
      transition={activeTransition}
      className={`reveal-animated ${className} ${isDebug ? 'outline outline-1 outline-dashed outline-brand/60' : ''}`}
      style={style}
    >
      {children}
    </Component>
  );
}
