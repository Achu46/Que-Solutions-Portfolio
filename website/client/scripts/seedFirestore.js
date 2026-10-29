/**
 * Idempotent seed script to migrate authentic content from website/server/src/db/data.json into Cloud Firestore.
 * Usage: node scripts/seedFirestore.js
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read authentic seed data from server data.json
const dataJsonPath = path.resolve(__dirname, '../../server/src/db/data.json');
const fallbackPath = path.resolve(__dirname, '../server/src/db/data.json');
const resolvedPath = fs.existsSync(dataJsonPath) ? dataJsonPath : fallbackPath;

if (!fs.existsSync(resolvedPath)) {
  console.error('Error: Could not locate server data.json at', resolvedPath);
  process.exit(1);
}

const rawData = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

// Extract required collections (excluding admins, sessions, password hashes, visitor logs, sample leads)
const siteSettings = rawData.site_settings?.[0] || {};
const heroContent = rawData.hero_content?.[0] || {};
const aboutContent = rawData.about_content?.[0] || {};
const services = rawData.services || [];
const pricingPlans = rawData.pricing_plans || [];
const whyUs = rawData.why_us || [];
const targetClients = rawData.target_clients || [];

const processSteps = [
  { id: '1', step: '01', title: 'Tell Us Your Requirement', description: 'Share your daily customer enquiry volume, communication channels, and target hours.', order: 1, active: true },
  { id: '2', step: '02', title: 'Choose Your Support Plan', description: 'Select Starter (Chat), Growth (Chat + Voice), or Business (Full Suite) tailored to your needs.', order: 2, active: true },
  { id: '3', step: '03', title: 'We Handle Support', description: 'Our trained agents manage incoming customer chats, inquiries, and follow-ups with high empathy.', order: 3, active: true },
  { id: '4', step: '04', title: 'Your Business Grows', description: 'Receive daily summaries and feedback insights while focusing completely on your product development.', order: 4, active: true }
];

const products = [
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
];

async function runSeed() {
  const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
  const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

  if (!fs.existsSync(serviceAccountPath) && !isEmulator) {
    console.log('ℹ️  No serviceAccountKey.json found and FIRESTORE_EMULATOR_HOST not set.');
    console.log('Validating seed extraction from server data.json:');
    console.log(`✓ siteSettings: "${siteSettings.site_name}" - "${siteSettings.tagline}"`);
    console.log(`✓ heroContent: "${heroContent.headline}"`);
    console.log(`✓ aboutContent: "${aboutContent.headline}"`);
    console.log(`✓ services: ${services.length} items (${services.map(s => s.title).join(', ')})`);
    console.log(`✓ pricingPlans: ${pricingPlans.length} items (${pricingPlans.map(p => p.name).join(', ')})`);
    console.log(`✓ whyUs: ${whyUs.length} items`);
    console.log(`✓ targetClients: ${targetClients.length} items`);
    console.log(`✓ products: ${products.length} items`);
    console.log('\n[PASS] Seed dataset successfully mapped from server data.json.');
    console.log('To run against live project, add serviceAccountKey.json and execute `npm run seed`.');
    return;
  }

  if (!getApps().length) {
    if (isEmulator) {
      initializeApp({ projectId: 'que-solutions-prod' });
    } else {
      const sa = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      initializeApp({ credential: cert(sa) });
    }
  }

  const db = getFirestore();
  console.log('🚀 Seeding authentic data into Cloud Firestore...');

  // 1. siteSettings/main
  await db.collection('siteSettings').doc('main').set({
    site_name: siteSettings.site_name || 'QUE SOLUTIONS',
    tagline: siteSettings.tagline || 'Customer Care & Call Centre Services',
    brand_line: 'People Today. A Brighter Tomorrow.',
    pillars: ['SUPPORT', 'TECHNOLOGY', 'GROWTH'],
    phone: siteSettings.phone || '7092490337',
    email: siteSettings.email || 'que.solutions.services@gmail.com',
    location: siteSettings.location || 'Erode, Tamil Nadu',
    working_hours: siteSettings.working_hours || 'Mon – Sat: 4 hrs/day (~104 hrs/mo)',
    footer_text: siteSettings.footer_text || '',
    social_whatsapp: siteSettings.social_whatsapp || 'https://wa.me/917092490337',
    show_hrms_card: true,
    show_arabic_erp_card: true,
  }, { merge: true });
  console.log('✓ siteSettings/main');

  // 2. heroContent/main
  await db.collection('heroContent').doc('main').set({
    badge_text: heroContent.badge_text || 'SUPPORT | TECHNOLOGY | GROWTH',
    headline: heroContent.headline || 'Reliable Customer Support for Growing Businesses',
    subheadline: heroContent.subheadline || 'Affordable outsourced customer care, call centre and chat support for small and growing product-based businesses.',
    primary_cta_text: heroContent.primary_cta_text || 'Get a Quote',
    primary_cta_link: heroContent.primary_cta_link || '#contact',
    secondary_cta_text: heroContent.secondary_cta_text || 'Talk to Us',
    secondary_cta_link: heroContent.secondary_cta_link || 'tel:7092490337',
  }, { merge: true });
  console.log('✓ heroContent/main');

  // 3. aboutContent/main
  await db.collection('aboutContent').doc('main').set({
    headline: aboutContent.headline || 'People Today. A Brighter Tomorrow.',
    description: aboutContent.description || '',
    vision: aboutContent.vision || '',
    future_scope: aboutContent.future_scope || '',
  }, { merge: true });
  console.log('✓ aboutContent/main');

  // 4. services
  for (const s of services) {
    await db.collection('services').doc(String(s.id)).set({
      title: s.title,
      slug: s.slug,
      description: s.description,
      icon: s.icon,
      features: s.features || [],
      order: s.display_order || s.id,
      active: s.is_active !== false,
    }, { merge: true });
  }
  console.log(`✓ services: ${services.length} items`);

  // 5. pricingPlans
  for (const p of pricingPlans) {
    await db.collection('pricingPlans').doc(String(p.id)).set({
      name: p.name,
      price: p.price,
      priceNumeric: p.numeric_price,
      billingPeriod: p.billing_period,
      hoursDesc: p.hours_desc,
      includesSummary: p.includes_summary,
      features: p.features || [],
      recommended: !!p.is_recommended,
      order: p.display_order || p.id,
      active: p.is_active !== false,
    }, { merge: true });
  }
  console.log(`✓ pricingPlans: ${pricingPlans.length} items`);

  // 6. whyUs
  for (const w of whyUs) {
    await db.collection('whyUs').doc(String(w.id)).set({
      title: w.title,
      description: w.description,
      icon: w.icon,
      order: w.display_order || w.id,
      active: w.is_active !== false,
    }, { merge: true });
  }
  console.log(`✓ whyUs: ${whyUs.length} items`);

  // 7. targetClients
  for (const t of targetClients) {
    await db.collection('targetClients').doc(String(t.id)).set({
      title: t.title,
      description: t.description,
      icon: t.icon,
      order: t.display_order || t.id,
      active: t.is_active !== false,
    }, { merge: true });
  }
  console.log(`✓ targetClients: ${targetClients.length} items`);

  // 8. processSteps
  for (const ps of processSteps) {
    await db.collection('processSteps').doc(ps.id).set(ps, { merge: true });
  }
  console.log(`✓ processSteps: ${processSteps.length} items`);

  // 9. products
  for (const pr of products) {
    await db.collection('products').doc(pr.id).set(pr, { merge: true });
  }
  console.log(`✓ products: ${products.length} items`);

  console.log('\n🎉 Real database seed complete! All collections populated idempotently.');
}

runSeed().catch(err => {
  console.error('Seed execution error:', err);
  process.exit(1);
});
