/**
 * Central Company Facts & Formatters
 * Strict data adherence - no fabricated data.
 */

export const COMPANY_NAME = "QUE SOLUTIONS";
export const TAGLINE = "People Today. A Brighter Tomorrow.";
export const PILLARS = ["SUPPORT", "TECHNOLOGY", "GROWTH"];

export const CONTACT_INFO = {
  email: "que.solutions.services@gmail.com",
  phone: "7092490337",
  displayPhone: "+91 70924 90337",
  whatsappUrl: "https://wa.me/917092490337",
  location: "Erode, Tamil Nadu",
  operatingHours: "4 hrs/day, Mon to Sat (~104 hrs/month)",
  operatingScheduleDesc: "Structured non-24/7 outsourced coverage tailored for growing product businesses",
  vision: "Affordable customer support partner for small product businesses; future expansion into IT-enabled business solutions.",
};

// Central Indian Rupee Currency Formatter
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatINR = (amount) => {
  if (typeof amount !== 'number') return amount;
  return inrFormatter.format(amount);
};

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#projects' },
  { label: 'Process', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
];
