import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Authentic seed fallback data (loaded from server data.json)
export const FALLBACK_SITE_DATA = {
  settings: {
    site_name: 'QUE SOLUTIONS',
    tagline: 'Customer Care & Call Centre Services',
    brand_line: 'People Today. A Brighter Tomorrow.',
    pillars: ['SUPPORT', 'TECHNOLOGY', 'GROWTH'],
    phone: '7092490337',
    email: 'que.solutions.services@gmail.com',
    location: 'Erode, Tamil Nadu',
    working_hours: 'Mon – Sat: 4 hrs/day (~104 hrs/mo)',
    footer_text: 'Delivering reliable, technology-driven outsourced customer care and call centre services for growing businesses.',
    social_whatsapp: 'https://wa.me/917092490337',
    social_linkedin: '',
    social_instagram: '',
    show_hrms_card: true,
    show_arabic_erp_card: true
  },
  hero: {
    badge_text: 'SUPPORT | TECHNOLOGY | GROWTH',
    headline: 'Reliable Customer Support for Growing Businesses',
    subheadline: 'Affordable outsourced customer care, call centre and chat support for small and growing product-based businesses.',
    primary_cta_text: 'Get a Quote',
    primary_cta_link: '#contact',
    secondary_cta_text: 'Talk to Us',
    secondary_cta_link: 'tel:7092490337'
  },
  services: [
    {
      id: '1',
      title: 'Inbound Call Support',
      slug: 'inbound-call-support',
      description: 'Professional handling of customer enquiries, product questions, order-related queries and support requests.',
      icon: 'PhoneIncoming',
      features: [
        'Professional customer query handling',
        'Order status & tracking assistance',
        'Product information guidance',
        'Escalation & ticket logging',
        'Daily summary & interaction reporting'
      ],
      order: 1,
      active: true
    },
    {
      id: '2',
      title: 'Outbound Call Support',
      slug: 'outbound-call-support',
      description: 'Existing lead follow-ups, callbacks, order confirmations and customer feedback.',
      icon: 'PhoneOutgoing',
      features: [
        'Lead follow-ups & callback scheduling',
        'Pre-dispatch order confirmation',
        'Customer feedback & satisfaction surveys',
        'Abandoned inquiry re-engagement',
        'Structured call logs & feedback recording'
      ],
      order: 2,
      active: true
    },
    {
      id: '3',
      title: 'Chat Support',
      slug: 'chat-support',
      description: 'Responsive customer assistance via website chat, WhatsApp and other agreed channels.',
      icon: 'MessageSquareText',
      features: [
        'Real-time website live chat',
        'Official WhatsApp Business assistance',
        'Quick response time SLA',
        'Pre-purchase inquiry assistance',
        'Post-sales troubleshooting & FAQs'
      ],
      order: 3,
      active: true
    }
  ],
  pricing: [
    {
      id: '1',
      name: 'Starter',
      price: '₹11,999',
      numeric_price: 11999,
      billing_period: '/mo',
      hours_desc: '4 hrs/day, Mon–Sat (~104 hrs/mo)',
      includes_summary: 'Chat Support',
      features: [
        'Dedicated Chat Support Agent',
        '4 hours/day, Monday to Saturday',
        '~104 productive hours per month',
        'Website Live Chat & WhatsApp',
        'Weekly interaction & query reports',
        'Agreed onboarding volume limits'
      ],
      is_recommended: false,
      active: true,
      order: 1,
      cta_text: 'Get a Quote'
    },
    {
      id: '2',
      name: 'Growth',
      price: '₹15,999',
      numeric_price: 15999,
      billing_period: '/mo',
      hours_desc: '4 hrs/day, Mon–Sat (~104 hrs/mo)',
      includes_summary: 'Chat + Inbound Call Support',
      features: [
        'Chat + Inbound Call Handling',
        '4 hours/day, Monday to Saturday',
        '~104 productive hours per month',
        'Order verification & inquiries',
        'Call logging & ticket management',
        'Bi-weekly performance review',
        'Agreed onboarding volume limits'
      ],
      is_recommended: true,
      active: true,
      order: 2,
      cta_text: 'Get a Quote'
    },
    {
      id: '3',
      name: 'Business',
      price: '₹21,999',
      numeric_price: 21999,
      billing_period: '/mo',
      hours_desc: '4 hrs/day, Mon–Sat (~104 hrs/mo)',
      includes_summary: 'Chat + Inbound + Outbound Call Support',
      features: [
        'Chat + Inbound + Outbound Calling',
        '4 hours/day, Monday to Saturday',
        '~104 productive hours per month',
        'Lead follow-ups & feedback surveys',
        'Dedicated Team Lead supervision',
        'Custom workflows & monthly SLA audits',
        'Agreed onboarding volume limits'
      ],
      is_recommended: false,
      active: true,
      order: 3,
      cta_text: 'Get a Quote'
    }
  ],
  whyUs: [
    { id: '1', title: 'Affordable Support', description: 'Transparent pricing with zero hidden costs, tailor-made for small product businesses.', icon: 'BadgePercent', order: 1, active: true },
    { id: '2', title: 'Flexible Working Model', description: 'Structured 4 hrs/day schedule that adapts to your peak customer traffic hours.', icon: 'Clock', order: 2, active: true },
    { id: '3', title: 'Professional Interaction', description: 'Courteous, well-trained agents representing your business with brand dignity.', icon: 'Award', order: 3, active: true },
    { id: '4', title: 'Scalable Support', description: 'Easily transition from Chat to Inbound & Outbound calling as your volume grows.', icon: 'TrendingUp', order: 4, active: true },
    { id: '5', title: 'Customer-Focused Approach', description: 'Dedicated focus on fast resolution times, clear answers, and happy repeat buyers.', icon: 'HeartHandshake', order: 5, active: true },
    { id: '6', title: 'Easy Business Communication', description: 'Direct communication channels with our team, daily call summaries, and hassle-free updates.', icon: 'MessageCircle', order: 6, active: true }
  ],
  targetClients: [
    { id: '1', title: 'Small D2C Brands', description: 'Provide responsive customer support for direct-to-consumer store orders and queries.', icon: 'ShoppingBag', order: 1, active: true },
    { id: '2', title: 'Instagram & Social Sellers', description: 'Quick DM and WhatsApp response support to convert inquiries into paid orders.', icon: 'Camera', order: 2, active: true },
    { id: '3', title: 'Online Product Businesses', description: 'Professional enquiry handling, tracking updates, and return assistance.', icon: 'Globe', order: 3, active: true },
    { id: '4', title: 'Amazon & Marketplace Sellers', description: 'Buyer message responses and customer satisfaction follow-ups on marketplaces.', icon: 'Store', order: 4, active: true },
    { id: '5', title: 'Local Brands Moving Online', description: 'Reliable customer care partner to handle your phone & chat inquiries as you expand.', icon: 'Building2', order: 5, active: true }
  ],
  processSteps: [
    { id: '1', step: '01', title: 'Tell Us Your Requirement', description: 'Share your daily customer enquiry volume, communication channels, and target hours.', order: 1, active: true },
    { id: '2', step: '02', title: 'Choose Your Support Plan', description: 'Select Starter (Chat), Growth (Chat + Voice), or Business (Full Suite) tailored to your needs.', order: 2, active: true },
    { id: '3', step: '03', title: 'We Handle Support', description: 'Our trained agents manage incoming customer chats, inquiries, and follow-ups with high empathy.', order: 3, active: true },
    { id: '4', step: '04', title: 'Your Business Grows', description: 'Receive daily summaries and feedback insights while focusing completely on your product development.', order: 4, active: true }
  ],
  products: [
    {
      id: 'queflow',
      name: 'QueFlow CRM',
      tagline: 'Multi-Tenant SaaS CRM for Growing Small Businesses',
      description: 'Streamline leads, contacts, deals, customer follow-ups, team collaboration and real-time reports in a single intuitive workspace.',
      url: 'https://queflow.in',
      app_url: 'https://leads.queflow.in',
      status: 'live',
      features: ['Lead & Contact Management', 'Follow-up Scheduler', 'Deal Pipeline', 'Team Collaboration', 'Performance Analytics'],
      order: 1,
      active: true
    },
    {
      id: 'hrms',
      name: 'HRMS Platform',
      tagline: 'Smart Workforce & Attendance Solution',
      description: 'Modern human resource management built for seamless payroll, leave tracking, and employee records.',
      status: 'coming_soon',
      features: ['Employee Profiles', 'Attendance Tracking', 'Leave Approvals'],
      order: 2,
      active: true
    },
    {
      id: 'arabic-erp',
      name: 'Arabic ERP Solution',
      tagline: 'Enterprise Resource Planning for Regional Markets',
      description: 'Bilingual business operations management designed to adhere to regional compliance and multi-currency workflows.',
      status: 'coming_soon',
      features: ['Bilingual Support', 'Invoicing & Accounting', 'Tax Compliance'],
      order: 3,
      active: true
    }
  ],
  projects: [],
  testimonials: [],
  about: {
    headline: 'People Today. A Brighter Tomorrow.',
    description: 'Que Solutions is a customer care and call centre service provider focused on delivering professional, responsive and reliable customer support solutions for businesses.',
    vision: 'To become an affordable customer support partner for small product-based businesses, helping them provide professional customer experiences without the cost of building a large in-house support team.',
    future_scope: 'Que Solutions plans to expand its service capabilities over time, including technology and IT-enabled business solutions, while continuing to build strong customer support capabilities.'
  }
};

// Short TTL in-memory cache to keep reads low
let siteDataCache = null;
let siteDataCacheTime = 0;
const CACHE_TTL = 300000; // 5 minutes

export const api = {
  // Public Site Data Loader
  getSiteData: async () => {
    const now = Date.now();
    if (siteDataCache && now - siteDataCacheTime < CACHE_TTL) {
      return siteDataCache;
    }

    try {
      // Fetch collections with fallback
      const [
        settingsDoc,
        heroDoc,
        aboutDoc,
        servicesSnap,
        pricingSnap,
        whyUsSnap,
        targetSnap,
        processSnap,
        productsSnap,
        projectsSnap,
        testimonialsSnap
      ] = await Promise.all([
        getDoc(doc(db, 'siteSettings', 'main')).catch(() => null),
        getDoc(doc(db, 'heroContent', 'main')).catch(() => null),
        getDoc(doc(db, 'aboutContent', 'main')).catch(() => null),
        getDocs(query(collection(db, 'services'), where('active', '==', true))).catch(() => null),
        getDocs(query(collection(db, 'pricingPlans'), where('active', '==', true))).catch(() => null),
        getDocs(query(collection(db, 'whyUs'), where('active', '==', true))).catch(() => null),
        getDocs(query(collection(db, 'targetClients'), where('active', '==', true))).catch(() => null),
        getDocs(query(collection(db, 'processSteps'), where('active', '==', true))).catch(() => null),
        getDocs(query(collection(db, 'products'), where('active', '==', true))).catch(() => null),
        getDocs(query(collection(db, 'projects'), where('active', '==', true))).catch(() => null),
        getDocs(query(collection(db, 'testimonials'), where('approved', '==', true))).catch(() => null)
      ]);

      const formatDocs = (snap, fallback) => {
        if (!snap || snap.empty) return fallback;
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return items.sort((a, b) => (a.order || 0) - (b.order || 0));
      };

      const result = {
        settings: settingsDoc?.exists() ? { ...FALLBACK_SITE_DATA.settings, ...settingsDoc.data() } : FALLBACK_SITE_DATA.settings,
        hero: heroDoc?.exists() ? { ...FALLBACK_SITE_DATA.hero, ...heroDoc.data() } : FALLBACK_SITE_DATA.hero,
        about: aboutDoc?.exists() ? { ...FALLBACK_SITE_DATA.about, ...aboutDoc.data() } : FALLBACK_SITE_DATA.about,
        services: formatDocs(servicesSnap, FALLBACK_SITE_DATA.services),
        pricing: formatDocs(pricingSnap, FALLBACK_SITE_DATA.pricing),
        whyUs: formatDocs(whyUsSnap, FALLBACK_SITE_DATA.whyUs),
        targetClients: formatDocs(targetSnap, FALLBACK_SITE_DATA.targetClients),
        processSteps: formatDocs(processSnap, FALLBACK_SITE_DATA.processSteps),
        products: formatDocs(productsSnap, FALLBACK_SITE_DATA.products),
        projects: projectsSnap && !projectsSnap.empty ? projectsSnap.docs.map(d => ({ id: d.id, ...d.data() })) : [],
        testimonials: testimonialsSnap && !testimonialsSnap.empty ? testimonialsSnap.docs.map(d => ({ id: d.id, ...d.data() })) : []
      };

      siteDataCache = result;
      siteDataCacheTime = now;
      return result;
    } catch (err) {
      console.warn('[Firestore] Using fallback site data:', err.message);
      return FALLBACK_SITE_DATA;
    }
  },

  // Lead Submission with rate limit cooldown & honeypot verification
  submitLead: async (leadData) => {
    // 1. Honeypot check
    if (leadData.website_url) {
      // Silently discard bot spam without error
      return { success: true, message: 'Message sent successfully' };
    }

    // 2. Client-side cooldown (60s)
    const lastSubKey = 'que_last_lead_sub';
    const lastSub = parseInt(localStorage.getItem(lastSubKey) || '0', 10);
    const now = Date.now();
    if (now - lastSub < 60000) {
      const waitSec = Math.ceil((60000 - (now - lastSub)) / 1000);
      throw new Error(`Please wait ${waitSec}s before submitting another request.`);
    }

    // 3. Validation limits
    const name = (leadData.name || '').trim();
    const email = (leadData.email || '').trim().toLowerCase();
    const phone = (leadData.phone || '').trim().replace(/\s+/g, '');
    const message = (leadData.message || '').trim();

    if (name.length < 2 || name.length > 100) {
      throw new Error('Name must be between 2 and 100 characters.');
    }
    if (!/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (phone.length < 7 || phone.length > 15) {
      throw new Error('Please enter a valid phone number (7-15 digits).');
    }
    if (message.length > 2000) {
      throw new Error('Message cannot exceed 2000 characters.');
    }

    // Generate unique human-readable lead code
    const leadCode = `QUE-${now.toString(36).toUpperCase()}`;

    const payload = {
      leadCode,
      name,
      company: (leadData.company || '').trim(),
      email,
      phone,
      serviceInterested: leadData.serviceInterested || leadData.service || 'General Inquiry',
      monthlyRequirement: leadData.monthlyRequirement || leadData.plan || 'Not specified',
      message: message || 'No message provided',
      status: 'new',
      source: leadData.source || 'website',
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'leads'), payload);
    localStorage.setItem(lastSubKey, now.toString());

    return { 
      success: true, 
      leadId: docRef.id, 
      leadCode,
      message: 'Thank you! Your quote request has been received. Our team will contact you shortly.' 
    };
  },

  // Admin Leads Management
  getLeads: async () => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toISOString() : new Date().toISOString()
    }));
  },

  updateLeadStatus: async (leadId, status) => {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { status });
    return { success: true };
  },

  addLeadNote: async (leadId, noteText) => {
    const notesCol = collection(db, 'leads', leadId, 'notes');
    await addDoc(notesCol, {
      text: noteText,
      createdAt: serverTimestamp()
    });
    return { success: true };
  },

  deleteLead: async (leadId) => {
    await deleteDoc(doc(db, 'leads', leadId));
    return { success: true };
  },

  // Admin CMS Updates
  updateSettings: async (settingsData) => {
    siteDataCache = null;
    await setDoc(doc(db, 'siteSettings', 'main'), settingsData, { merge: true });
    return { success: true };
  },

  updateHero: async (heroData) => {
    siteDataCache = null;
    await setDoc(doc(db, 'heroContent', 'main'), heroData, { merge: true });
    return { success: true };
  },

  updateAbout: async (aboutData) => {
    siteDataCache = null;
    await setDoc(doc(db, 'aboutContent', 'main'), aboutData, { merge: true });
    return { success: true };
  },

  // Services CRUD
  getServices: async () => {
    const snap = await getDocs(collection(db, 'services'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  createService: async (data) => {
    siteDataCache = null;
    const ref = await addDoc(collection(db, 'services'), { ...data, active: true, createdAt: serverTimestamp() });
    return { id: ref.id, ...data };
  },
  updateService: async (id, data) => {
    siteDataCache = null;
    await updateDoc(doc(db, 'services', id), data);
    return { success: true };
  },
  deleteService: async (id) => {
    siteDataCache = null;
    await deleteDoc(doc(db, 'services', id));
    return { success: true };
  },

  // Pricing Plans CRUD
  getPricingPlans: async () => {
    const snap = await getDocs(collection(db, 'pricingPlans'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  createPricingPlan: async (data) => {
    siteDataCache = null;
    const ref = await addDoc(collection(db, 'pricingPlans'), { ...data, active: true, createdAt: serverTimestamp() });
    return { id: ref.id, ...data };
  },
  updatePricingPlan: async (id, data) => {
    siteDataCache = null;
    await updateDoc(doc(db, 'pricingPlans', id), data);
    return { success: true };
  },
  deletePricingPlan: async (id) => {
    siteDataCache = null;
    await deleteDoc(doc(db, 'pricingPlans', id));
    return { success: true };
  },

  // Products CRUD
  getProducts: async () => {
    const snap = await getDocs(collection(db, 'products'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  createProduct: async (data) => {
    siteDataCache = null;
    const ref = await addDoc(collection(db, 'products'), { ...data, active: true, createdAt: serverTimestamp() });
    return { id: ref.id, ...data };
  },
  updateProduct: async (id, data) => {
    siteDataCache = null;
    await updateDoc(doc(db, 'products', id), data);
    return { success: true };
  },
  deleteProduct: async (id) => {
    siteDataCache = null;
    await deleteDoc(doc(db, 'products', id));
    return { success: true };
  },

  // Projects CRUD
  getProjects: async () => {
    const snap = await getDocs(collection(db, 'projects'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  createProject: async (data) => {
    siteDataCache = null;
    const ref = await addDoc(collection(db, 'projects'), { ...data, active: true, createdAt: serverTimestamp() });
    return { id: ref.id, ...data };
  },
  updateProject: async (id, data) => {
    siteDataCache = null;
    await updateDoc(doc(db, 'projects', id), data);
    return { success: true };
  },
  deleteProject: async (id) => {
    siteDataCache = null;
    await deleteDoc(doc(db, 'projects', id));
    return { success: true };
  },

  // Testimonials CRUD
  getTestimonials: async () => {
    const snap = await getDocs(collection(db, 'testimonials'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  createTestimonial: async (data) => {
    siteDataCache = null;
    const ref = await addDoc(collection(db, 'testimonials'), { ...data, approved: false, createdAt: serverTimestamp() });
    return { id: ref.id, ...data };
  },
  updateTestimonial: async (id, data) => {
    siteDataCache = null;
    await updateDoc(doc(db, 'testimonials', id), data);
    return { success: true };
  },
  deleteTestimonial: async (id) => {
    siteDataCache = null;
    await deleteDoc(doc(db, 'testimonials', id));
    return { success: true };
  },

  // Real-time listener helper for leads dashboard
  subscribeToLeads: (callback) => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toISOString() : new Date().toISOString()
      }));
      callback(leads);
    }, (err) => {
      console.warn('[Firestore] Real-time leads listener fallback:', err.message);
    });
  },

  // Analytics Overview (derived from real leads data)
  getOverview: async () => {
    try {
      const snap = await getDocs(collection(db, 'leads'));
      const total = snap.size;
      let newCount = 0;
      let contacted = 0;
      let won = 0;
      snap.forEach(doc => {
        const status = doc.data().status;
        if (status === 'new') newCount++;
        if (status === 'contacted') contacted++;
        if (status === 'won') won++;
      });
      return { total, newCount, contacted, won };
    } catch {
      return { total: 0, newCount: 0, contacted: 0, won: 0 };
    }
  },

  trackPageView: () => {} // Analytics track no-op for privacy
};
