import React, { useState, useEffect } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import PricingSection from '../components/PricingSection';
import WhyUsSection from '../components/WhyUsSection';
import TargetClientsSection from '../components/TargetClientsSection';
import ProcessSection from '../components/ProcessSection';
import AboutSection from '../components/AboutSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import { api, FALLBACK_SITE_DATA } from '../services/api';

export default function HomePage() {
  // Render with FALLBACK data instantly to never block first paint
  const [siteData, setSiteData] = useState(FALLBACK_SITE_DATA);

  // Background hydration of live site data from Firestore without blocking first paint
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const data = await api.getSiteData();
        if (data && mounted) {
          setSiteData(data);
        }
      } catch (err) {
        console.warn('[HomePage] Using fallback content:', err.message);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PublicLayout settings={siteData.settings}>
      {/* 1. Hero (100dvh) */}
      <HeroSection hero={siteData.hero} settings={siteData.settings} />

      {/* 2. Services */}
      <ServicesSection services={siteData.services} />

      {/* 3. Pricing */}
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
  );
}
