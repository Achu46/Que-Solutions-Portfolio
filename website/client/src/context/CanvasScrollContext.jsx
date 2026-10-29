import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useScroll, useSpring } from 'framer-motion';

const CanvasScrollContext = createContext(null);

export function CanvasScrollProvider({ children }) {
  const [heroCardEl, setHeroCardEl] = useState(null);
  const [clipPathStyle, setClipPathStyle] = useState('none');
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  // Framer Motion Springs to smoothly drive 3D uniforms without scroll-jacking
  const springMorph = useSpring(0.0, { stiffness: 45, damping: 20 });
  const springOpacity = useSpring(0.92, { stiffness: 50, damping: 22 });
  const springScale = useSpring(1.0, { stiffness: 45, damping: 20 });
  const springPosX = useSpring(0.4, { stiffness: 45, damping: 20 });
  const springDisperse = useSpring(1.0, { stiffness: 45, damping: 20 });

  const { scrollY } = useScroll();

  // 1. Clip-Path calculation for Hero Card inset
  useEffect(() => {
    if (!heroCardEl) {
      setClipPathStyle('none');
      return;
    }

    const updateClip = () => {
      const rect = heroCardEl.getBoundingClientRect();
      const scrollVal = window.scrollY;
      const heroHeight = rect.height || window.innerHeight;

      // Scroll progress through hero (0 at top, 1 when hero card is scrolling away)
      const openProgress = Math.min(Math.max(scrollVal / (heroHeight * 0.75), 0), 1);

      if (openProgress >= 0.98) {
        setClipPathStyle('none');
      } else {
        // Interpolate inset from card rect to 0 (full viewport)
        const targetTop = Math.max(0, rect.top);
        const targetLeft = Math.max(0, rect.left);
        const targetRight = Math.max(0, window.innerWidth - rect.right);
        const targetBottom = Math.max(0, window.innerHeight - rect.bottom);
        const targetRadius = window.innerWidth < 640 ? 26 : 32;

        const curTop = targetTop * (1 - openProgress);
        const curLeft = targetLeft * (1 - openProgress);
        const curRight = targetRight * (1 - openProgress);
        const curBottom = targetBottom * (1 - openProgress);
        const curRadius = targetRadius * (1 - openProgress);

        setClipPathStyle(
          `inset(${curTop.toFixed(1)}px ${curRight.toFixed(1)}px ${curBottom.toFixed(1)}px ${curLeft.toFixed(1)}px round ${curRadius.toFixed(1)}px)`
        );
      }
    };

    updateClip();

    const resizeObserver = new ResizeObserver(() => updateClip());
    resizeObserver.observe(heroCardEl);
    window.addEventListener('scroll', updateClip, { passive: true });
    window.addEventListener('resize', updateClip, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateClip);
      window.removeEventListener('resize', updateClip);
    };
  }, [heroCardEl]);

  // 2. Drive uMorph, Opacity, Scale, and Position based on active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;

      const getSectionTop = (id) => {
        const el = document.getElementById(id);
        if (!el) return Infinity;
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY;
      };

      const heroTop = getSectionTop('home');
      const servicesTop = getSectionTop('services');
      const productsTop = getSectionTop('products');
      const pricingTop = getSectionTop('pricing');
      const whyUsTop = getSectionTop('why-us');
      const processTop = getSectionTop('process');
      const aboutTop = getSectionTop('about');
      const contactTop = getSectionTop('contact');

      if (scrollPos < servicesTop) {
        // Hero: Shape 0 (noisy organic mass)
        springMorph.set(0.0);
        springOpacity.set(0.92);
        springScale.set(1.0);
        springPosX.set(0.4);
        springDisperse.set(1.0);
      } else if (scrollPos >= servicesTop && scrollPos < productsTop) {
        // Services: Shapes 2 (Headset), 3 (Handset), 4 (Chat Bubble)
        // Subdivide services height into 3 segments
        const servicesEl = document.getElementById('services');
        const sHeight = servicesEl ? servicesEl.offsetHeight : 1000;
        const progressInServices = Math.min(Math.max((scrollPos - servicesTop) / sHeight, 0), 1);

        if (progressInServices < 0.36) {
          setActiveServiceIndex(0);
          springMorph.set(2.0); // Shape 2: Headset (Inbound Call)
        } else if (progressInServices < 0.7) {
          setActiveServiceIndex(1);
          springMorph.set(3.0); // Shape 3: Phone Handset (Outbound Call)
        } else {
          setActiveServiceIndex(2);
          springMorph.set(4.0); // Shape 4: Chat Bubble (Chat Support)
        }

        const isMobile = window.innerWidth < 768;
        springOpacity.set(0.85);
        springScale.set(isMobile ? 0.7 : 0.95);
        springPosX.set(isMobile ? 0.0 : 0.45);
        springDisperse.set(1.0);
      } else if (scrollPos >= productsTop && scrollPos < pricingTop) {
        // QueFlow Product: Shape 1 (Que infinity loop drifting to the right)
        springMorph.set(1.0);
        springOpacity.set(0.88);
        springScale.set(1.0);
        springPosX.set(1.35); // Drift to the right
        springDisperse.set(1.0);
      } else if (scrollPos >= pricingTop && scrollPos < processTop) {
        // Pricing & Why Us: Form recedes (opacity 0.25, scaled down, centered)
        springMorph.set(1.0);
        springOpacity.set(0.25);
        springScale.set(0.65);
        springPosX.set(0.0);
        springDisperse.set(0.5);
      } else if (scrollPos >= processTop && scrollPos < aboutTop) {
        // Process: particles stream along a path as steps draw in
        springMorph.set(0.5);
        springOpacity.set(0.75);
        springScale.set(0.8);
        springPosX.set(0.0);
        springDisperse.set(2.8); // Streaming dispersal along path
      } else {
        // About / Contact: Back to the infinity loop as finale
        springMorph.set(1.0);
        springOpacity.set(0.85);
        springScale.set(1.05);
        springPosX.set(0.35);
        springDisperse.set(1.0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial run

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <CanvasScrollContext.Provider
      value={{
        setHeroCardEl,
        clipPathStyle,
        activeServiceIndex,
        setActiveServiceIndex,
        springMorph,
        springOpacity,
        springScale,
        springPosX,
        springDisperse,
      }}
    >
      {children}
    </CanvasScrollContext.Provider>
  );
}

export function useCanvasScroll() {
  const context = useContext(CanvasScrollContext);
  if (!context) {
    throw new Error('useCanvasScroll must be used within CanvasScrollProvider');
  }
  return context;
}
