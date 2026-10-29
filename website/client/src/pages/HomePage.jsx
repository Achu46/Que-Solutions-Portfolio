import React, { useState, useEffect, Suspense, useMemo } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import ProductsSection from '../components/ProductsSection';
import PricingSection from '../components/PricingSection';
import WhyUsSection from '../components/WhyUsSection';
import TargetClientsSection from '../components/TargetClientsSection';
import ProcessSection from '../components/ProcessSection';
import AboutSection from '../components/AboutSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import { CanvasScrollProvider, useCanvasScroll } from '../context/CanvasScrollContext';
import { api, FALLBACK_SITE_DATA } from '../services/api';
import Lenis from 'lenis';

const Hero3DCanvas = React.lazy(() => import('../components/3d/Hero3DCanvas'));

function PersistentHeroCanvas() {
  const {
    clipPathStyle,
    springMorph,
    springOpacity,
    springScale,
    springPosX,
    springDisperse,
  } = useCanvasScroll();

  const scrollControls = useMemo(
    () => ({
      springMorph,
      springOpacity,
      springScale,
      springPosX,
      springDisperse,
    }),
    [springMorph, springOpacity, springScale, springPosX, springDisperse]
  );

  return (
    <Suspense fallback={null}>
      <Hero3DCanvas
        isPersistent={true}
        clipPath={clipPathStyle}
        scrollControls={scrollControls}
      />
    </Suspense>
  );
}

export default function HomePage() {
  const [siteData, setSiteData] = useState(FALLBACK_SITE_DATA);
  const [loading, setLoading] = useState(true);

  // Initialize Lenis smooth scroll (respecting prefers-reduced-motion)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Fetch live site data from Firestore
  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getSiteData();
        if (data) {
          setSiteData(data);
        }
      } catch (err) {
        console.warn('[HomePage] Using fallback content:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <CanvasScrollProvider>
      <PersistentHeroCanvas />
      <PublicLayout settings={siteData.settings}>
      {/* 1. Hero (100dvh) */}
      <HeroSection hero={siteData.hero} settings={siteData.settings} />

      {/* 2. Services */}
      <ServicesSection services={siteData.services} />

      {/* 3. Products / Portfolio (QueFlow CRM 3D Showcase & Coming Soon cards) */}
      <ProductsSection 
        products={siteData.products} 
        projects={siteData.projects} 
        settings={siteData.settings} 
      />

      {/* 4. Pricing */}
      <PricingSection pricing={siteData.pricing} />

      {/* 5. Why Us & Who We Serve */}
      <WhyUsSection whyUs={siteData.whyUs} />
      <TargetClientsSection targetClients={siteData.targetClients} />

      {/* 6. Process (4-step animated timeline) */}
      <ProcessSection />

      {/* 7. About (Headline, vision, future scope, 3 pillars) */}
      <AboutSection about={siteData.about} settings={siteData.settings} />

      {/* 8. Testimonials (Rendered ONLY if approved items exist; otherwise hidden) */}
      <TestimonialsSection testimonials={siteData.testimonials} />

      {/* 9. Contact (Lead form with honeypot & 60s cooldown, direct contact) */}
      <ContactSection settings={siteData.settings} />
    </PublicLayout>
    </CanvasScrollProvider>
  );
}
