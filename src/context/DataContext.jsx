import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  fallbackSiteSettings, 
  fallbackServices, 
  fallbackPlans, 
  fallbackProjects, 
  fallbackTestimonials,
  fallbackAbout,
  fallbackHero,
  fallbackProcess,
  fallbackWhyUs,
  fallbackWhoWeServe
} from '../data/fallbackData';
import { subscribeToSiteSettings } from '../services/firebase/settingsService';
import { subscribeToServices } from '../services/firebase/servicesService';
import { subscribeToPlans } from '../services/firebase/plansService';
import { subscribeToProjects } from '../services/firebase/projectsService';
import { subscribeToTestimonials } from '../services/firebase/testimonialsService';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(fallbackSiteSettings);
  const [services, setServices] = useState(fallbackServices);
  const [plans, setPlans] = useState(fallbackPlans);
  const [projects, setProjects] = useState(fallbackProjects);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [selectedPlanForQuote, setSelectedPlanForQuote] = useState('');

  useEffect(() => {
    const unsubSettings = subscribeToSiteSettings((data) => setSiteSettings(data || fallbackSiteSettings));
    const unsubServices = subscribeToServices((data) => setServices(data && data.length ? data : fallbackServices));
    const unsubPlans = subscribeToPlans((data) => setPlans(data && data.length ? data : fallbackPlans));
    const unsubProjects = subscribeToProjects((data) => setProjects(data && data.length ? data : fallbackProjects));
    const unsubTestimonials = subscribeToTestimonials((data) => setTestimonials(data || []));

    return () => {
      unsubSettings();
      unsubServices();
      unsubPlans();
      unsubProjects();
      unsubTestimonials();
    };
  }, []);

  const selectPlanForQuote = (planName) => {
    setSelectedPlanForQuote(planName);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <DataContext.Provider value={{
      siteSettings,
      services,
      plans,
      projects,
      testimonials,
      about: fallbackAbout,
      hero: fallbackHero,
      process: fallbackProcess,
      whyUs: fallbackWhyUs,
      whoWeServe: fallbackWhoWeServe,
      selectedPlanForQuote,
      selectPlanForQuote,
      setSelectedPlanForQuote,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
