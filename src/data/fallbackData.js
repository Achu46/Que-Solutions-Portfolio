/**
 * Bundled offline fallback data.
 * Renders instantly without layout shift before Firestore delivers remote data.
 */

export const fallbackSiteSettings = {
  name: "QUE SOLUTIONS",
  tagline: "People Today. A Brighter Tomorrow.",
  pillars: ["SUPPORT", "TECHNOLOGY", "GROWTH"],
  email: "que.solutions.services@gmail.com",
  phone: "7092490337",
  displayPhone: "+91 70924 90337",
  whatsappUrl: "https://wa.me/917092490337",
  location: "Erode, Tamil Nadu",
  hours: "4 hrs/day, Mon to Sat (~104 hrs/month)",
  scheduleDesc: "Structured non-24/7 coverage",
  themeDefault: "system",
  sectionVisibility: {
    hero: true,
    about: true,
    services: true,
    projects: true,
    process: true,
    pricing: true,
    whyUs: true,
    whoWeServe: true,
    testimonials: false, // Hidden until real client testimonials exist
    contact: true,
  },
};

export const fallbackHero = {
  headline: "Customer Care That Feels Personal",
  tagline: "People Today. A Brighter Tomorrow.",
  subtitle: "Dedicated outsourced customer care and call centre services built specifically for small & growing product-based businesses.",
  primaryCtaText: "Get a Quote",
  secondaryCtaText: "View Our Work",
};

export const fallbackAbout = {
  title: "About QUE SOLUTIONS",
  tagline: "People Today. A Brighter Tomorrow.",
  description: "QUE SOLUTIONS provides professional outsourced customer care and call centre operations tailored for small and growing product-based businesses. We bridge the gap between high-ticket enterprise call centres and overburdened business founders, delivering structured, high-touch support that converts inquiries into loyal customers.",
  vision: "Affordable customer support partner for small product businesses; future expansion into IT-enabled business solutions.",
  pillars: [
    { title: "SUPPORT", description: "Empathetic, brand-aligned customer care handling inbound calls, outbound verification, and omnichannel messaging." },
    { title: "TECHNOLOGY", description: "Integrating intelligent CRM, automated lead tracking, and streamlined workflow management for real-time visibility." },
    { title: "GROWTH", description: "Empowering founders to reclaim valuable time while driving conversions, repeat orders, and customer retention." },
  ],
  stats: [
    { value: "4 hrs/day", label: "Structured Daily Coverage", sub: "Mon to Sat" },
    { value: "~104 hrs", label: "Monthly Dedicated Support", sub: "Per Team" },
    { value: "3 Channels", label: "Integrated Touchpoints", sub: "Call, WhatsApp & Chat" },
  ],
};

export const fallbackServices = [
  {
    id: "chat-support",
    title: "Chat Support",
    slug: "chat-support",
    order: 1,
    isActive: true,
    icon: "MessageSquare",
    shortDesc: "Omnichannel digital communication across website live chat, WhatsApp Business, and Instagram direct messages.",
    features: [
      "Website Live Chat assistance & lead response",
      "Official WhatsApp Business message handling",
      "Instagram Direct Message customer replies",
      "Order status, sizing, and product inquiries",
      "FAQ resolution & escalation triage",
      "Brand-tone aligned prompt communication",
    ],
  },
  {
    id: "inbound-support",
    title: "Inbound Call Support",
    slug: "inbound-support",
    order: 2,
    isActive: true,
    icon: "PhoneIncoming",
    shortDesc: "Courteous, voice-based customer inquiry handling to resolve buyer questions and drive repeat sales.",
    features: [
      "Voice customer call answering (Mon–Sat)",
      "Pre-purchase queries & order confirmation calls",
      "Delivery delay tracking and logistics updates",
      "Returns, exchange, and refund ticket handling",
      "Detailed call logs and interaction records",
      "Empathetic, native-language communication",
    ],
  },
  {
    id: "outbound-support",
    title: "Outbound Call Support",
    slug: "outbound-support",
    order: 3,
    isActive: true,
    icon: "PhoneOutgoing",
    shortDesc: "Proactive outreach to confirm Cash on Delivery orders, recover abandoned checkouts, and follow up leads.",
    features: [
      "COD (Cash on Delivery) order verification",
      "RTO (Return to Origin) reduction callbacks",
      "Customer feedback & satisfaction surveys",
      "Abandoned checkout recovery touchpoints",
      "Warm follow-ups on interested prospects",
      "Dedicated team lead supervision",
    ],
  },
];

export const fallbackPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 11999,
    billingPeriod: "/ month",
    hoursDesc: "4 hrs/day, Mon to Sat (~104 hrs/mo)",
    includesSummary: "Digital Chat Support",
    isRecommended: false,
    order: 1,
    isActive: true,
    features: [
      "Website Live Chat support",
      "WhatsApp Business messaging",
      "Instagram DM customer management",
      "Standard ticket logging & CRM handoff",
      "Weekly performance summary report",
      "Structured non-24/7 dedicated shift",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 15999,
    billingPeriod: "/ month",
    hoursDesc: "4 hrs/day, Mon to Sat (~104 hrs/mo)",
    includesSummary: "Chat + Inbound Call Support",
    isRecommended: true,
    order: 2,
    isActive: true,
    features: [
      "Everything in Starter plan",
      "Inbound Voice Call Support",
      "Product & delivery query resolution",
      "Priority query turnaround time",
      "Order status & complaint management",
      "Bi-weekly reviews & CRM integration",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 21999,
    billingPeriod: "/ month",
    hoursDesc: "4 hrs/day, Mon to Sat (~104 hrs/mo)",
    includesSummary: "Chat + Inbound + Outbound Support",
    isRecommended: false,
    order: 3,
    isActive: true,
    features: [
      "Everything in Growth plan",
      "Outbound Call Support & Verification",
      "COD verification calls (RTO reduction)",
      "Abandoned checkout follow-ups",
      "Dedicated Team Lead assigned",
      "Custom weekly SLA & deep-dive reports",
    ],
  },
];

export const fallbackProjects = [
  {
    id: "queflow-crm",
    title: "QueFlow CRM",
    slug: "queflow-crm",
    category: "SaaS Platform",
    status: "live",
    order: 1,
    isPublished: true,
    summary: "Multi-tenant SaaS CRM built for high-velocity sales and lead workflows.",
    description: "QueFlow CRM is an enterprise-grade multi-tenant CRM engine engineered for growing businesses. It centralizes lead pipelines, automated range assignment, follow-up queues, deal tracking, team tasks, performance reports, and granular role-based permissions.",
    techStack: ["React", "Node.js", "Multi-Tenant Architecture", "REST API", "Tailwind CSS"],
    features: [
      "Automated lead ingestion and range assignment",
      "Multi-stage deal pipelines with status tracking",
      "Task delegation & scheduled follow-up reminders",
      "Role-based access control (Admin, Lead, Agent)",
      "Comprehensive conversion and SLA reporting",
    ],
    liveUrl: "https://queflow.in",
    images: [],
  },
  {
    id: "que-website-cms",
    title: "Que Solutions Company Platform",
    slug: "que-website-cms",
    category: "Corporate Web App & CMS",
    status: "live",
    order: 2,
    isPublished: true,
    summary: "Production company portal with interactive 3D, secure admin CMS, and real-time lead capture.",
    description: "The primary digital face of QUE SOLUTIONS featuring a React 18 & Three.js 3D support hub, dark/light dual-mode system, Firestore-backed administrative control panel, real-time lead pipeline, and analytics.",
    techStack: ["React 18", "Three.js / R3F", "Tailwind CSS", "Firebase Firestore", "Framer Motion"],
    features: [
      "Interactive 3D procedural support hub with mouse parallax",
      "Unified light and dark themes with system preference sync",
      "Real-time admin lead management with CSV export and status tracking",
      "Instant offline fallback data rendering without layout shift",
    ],
    liveUrl: "https://quesolutions.in",
    images: [],
  },
  {
    id: "que-hrms",
    title: "Que HRMS",
    slug: "que-hrms",
    category: "Enterprise System",
    status: "coming-soon",
    order: 3,
    isPublished: true,
    summary: "Human Resource Management Suite for shifts, attendance, and payroll.",
    description: "An upcoming streamlined human resource management system tailored for outsourced call centre operations and small enterprises. Features attendance logging, shift allocation, leave approval workflows, and automated payroll calculations.",
    techStack: ["React", "Cloud Microservices", "Tailwind CSS"],
    features: [
      "Agent shift scheduling & hourly logging",
      "Biometric & cloud attendance tracking",
      "Automated payroll & performance incentives",
    ],
    liveUrl: "",
    images: [],
  },
  {
    id: "arabic-erp",
    title: "Arabic-Language ERP",
    slug: "arabic-erp",
    category: "ERP Solution",
    status: "coming-soon",
    order: 4,
    isPublished: true,
    summary: "Full-suite RTL enterprise resource planning solution in native Arabic.",
    description: "An upcoming specialized ERP platform architected natively for Arabic-speaking markets with comprehensive Right-to-Left (RTL) interface ergonomics, localized invoicing, supply chain inventory, and financial reporting.",
    techStack: ["Next.js", "RTL CSS Engine", "PostgreSQL", "Cloud APIs"],
    features: [
      "Native Right-to-Left (RTL) typography and layout",
      "GCC tax compliant invoicing & ledger accounting",
      "Multi-currency inventory & warehouse tracking",
    ],
    liveUrl: "",
    images: [],
  },
];

export const fallbackProcess = [
  {
    step: "01",
    title: "Discover",
    subtitle: "Understanding Your Workflow",
    description: "We analyze your product catalog, FAQs, order volumes, brand tone, and existing messaging channels to design a seamless support playbook.",
  },
  {
    step: "02",
    title: "Onboard",
    subtitle: "Setup & Knowledge Integration",
    description: "We configure your CRM, connect WhatsApp Business and voice routing, and train our assigned agents on your specific business processes.",
  },
  {
    step: "03",
    title: "Operate",
    subtitle: "Structured 4 hrs/day Support",
    description: "Our dedicated agents execute customer inquiries, inbound calls, and outbound verifications during structured peak operating hours (Mon–Sat).",
  },
  {
    step: "04",
    title: "Report",
    subtitle: "Transparent Insights & Growth",
    description: "We deliver detailed weekly summaries, ticket breakdowns, conversion metrics, and actionable customer feedback to fuel your business growth.",
  },
];

export const fallbackWhyUs = [
  {
    title: "Affordable Support",
    description: "Predictable, transparent monthly pricing tailored for growing businesses without massive enterprise setup costs or hidden fees.",
    icon: "BadgePercent",
  },
  {
    title: "Flexible Working Model",
    description: "Structured 4 hours/day (Mon to Sat, ~104 hrs/month) non-24/7 coverage focused right when your customers need assistance most.",
    icon: "Clock",
  },
  {
    title: "Professional Interaction",
    description: "Trained, courteous agents who represent your brand with genuine empathy, precision, and native fluency.",
    icon: "Award",
  },
  {
    title: "Scalable Support",
    description: "Effortlessly upgrade from Chat to Voice and Outbound as your order volume surges without recruiting headaches.",
    icon: "TrendingUp",
  },
  {
    title: "Customer-Focused Approach",
    description: "We prioritize first-contact resolution, reducing returns (RTO) and turning first-time buyers into loyal repeat brand advocates.",
    icon: "HeartHandshake",
  },
  {
    title: "Easy Business Communication",
    description: "Direct lines of communication with our team via WhatsApp, phone, and scheduled check-ins for prompt adjustments.",
    icon: "PhoneCall",
  },
];

export const fallbackWhoWeServe = [
  {
    title: "Small D2C Brands",
    description: "Direct-to-consumer businesses needing structured order confirmation, sizing advice, and prompt resolution.",
    icon: "ShoppingBag",
  },
  {
    title: "Instagram & Social Sellers",
    description: "Founders overwhelmed by high volumes of DMs, comments, and WhatsApp inquiries turning chats into completed orders.",
    icon: "Instagram",
  },
  {
    title: "Online Product Businesses",
    description: "E-commerce stores requiring reliable helpdesks for shipment tracking, exchanges, and pre-purchase guidance.",
    icon: "Globe",
  },
  {
    title: "Amazon & Marketplace Sellers",
    description: "Brands selling on Flipkart, Amazon, and Meesho looking to improve seller ratings with prompt buyer communications.",
    icon: "Package",
  },
  {
    title: "Local Brands Moving Online",
    description: "Traditional brick-and-mortar retail companies expanding digitally into omnichannel sales across India.",
    icon: "Store",
  },
];

export const fallbackTestimonials = []; // Strict requirement: zero fabricated testimonials. Hidden automatically until enabled in admin with real data.
