const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_FILE = path.join(__dirname, 'data.json');

// Default initial state
function getDefaultData() {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPassword@2026', salt);

  return {
    admins: [
      {
        id: 1,
        email: process.env.ADMIN_EMAIL || 'admin@quesolutions.com',
        password_hash: passwordHash,
        name: 'Que Solutions Admin',
        role: 'superadmin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    sessions: [],
    site_settings: [
      {
        id: 1,
        site_name: 'QUE SOLUTIONS',
        tagline: 'Customer Care & Call Centre Services',
        phone: '7092490337',
        email: 'que.solutions.services@gmail.com',
        location: 'Erode, Tamil Nadu',
        working_hours: 'Mon – Sat: 4 hrs/day (~104 hrs/mo)',
        footer_text: 'Delivering reliable, technology-driven outsourced customer care and call centre services for growing businesses.',
        social_whatsapp: 'https://wa.me/917092490337',
        social_linkedin: '',
        social_instagram: '',
        updated_at: new Date().toISOString()
      }
    ],
    hero_content: [
      {
        id: 1,
        badge_text: 'SUPPORT | TECHNOLOGY | GROWTH',
        headline: 'Reliable Customer Support for Growing Businesses',
        subheadline: 'Affordable outsourced customer care, call centre and chat support for small and growing product-based businesses.',
        primary_cta_text: 'Get a Quote',
        primary_cta_link: '#contact',
        secondary_cta_text: 'Talk to Us',
        secondary_cta_link: 'tel:7092490337',
        updated_at: new Date().toISOString()
      }
    ],
    services: [
      {
        id: 1,
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
        display_order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
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
        display_order: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
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
        display_order: 3,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    pricing_plans: [
      {
        id: 1,
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
        is_active: true,
        display_order: 1,
        cta_text: 'Get a Quote',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
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
        is_active: true,
        display_order: 2,
        cta_text: 'Get a Quote',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
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
        is_active: true,
        display_order: 3,
        cta_text: 'Get a Quote',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    about_content: [
      {
        id: 1,
        headline: 'People Today. A Brighter Tomorrow.',
        description: 'Que Solutions is a customer care and call centre service provider focused on delivering professional, responsive and reliable customer support solutions for businesses.',
        vision: 'To become an affordable customer support partner for small product-based businesses, helping them provide professional customer experiences without the cost of building a large in-house support team.',
        future_scope: 'Que Solutions plans to expand its service capabilities over time, including technology and IT-enabled business solutions, while continuing to build strong customer support capabilities.',
        updated_at: new Date().toISOString()
      }
    ],
    why_us: [
      {
        id: 1,
        title: 'Affordable Support',
        description: 'Transparent pricing with zero hidden costs, tailor-made for small product businesses.',
        icon: 'BadgePercent',
        display_order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Flexible Working Model',
        description: 'Structured 4 hrs/day schedule that adapts to your peak customer traffic hours.',
        icon: 'Clock',
        display_order: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Professional Interaction',
        description: 'Courteous, well-trained agents representing your business with brand dignity.',
        icon: 'Award',
        display_order: 3,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Scalable Support',
        description: 'Easily transition from Chat to Inbound & Outbound calling as your volume grows.',
        icon: 'TrendingUp',
        display_order: 4,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Customer-Focused Approach',
        description: 'Dedicated focus on fast resolution times, clear answers, and happy repeat buyers.',
        icon: 'HeartHandshake',
        display_order: 5,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 6,
        title: 'Easy Business Communication',
        description: 'Direct communication channels with our team, daily call summaries, and hassle-free updates.',
        icon: 'MessageCircle',
        display_order: 6,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    target_clients: [
      {
        id: 1,
        title: 'Small D2C Brands',
        description: 'Provide responsive customer support for direct-to-consumer store orders and queries.',
        icon: 'ShoppingBag',
        display_order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Instagram & Social Sellers',
        description: 'Quick DM and WhatsApp response support to convert inquiries into paid orders.',
        icon: 'Camera',
        display_order: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Online Product Businesses',
        description: 'Professional enquiry handling, tracking updates, and return assistance.',
        icon: 'Globe',
        display_order: 3,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Amazon & Marketplace Sellers',
        description: 'Buyer message responses and customer satisfaction follow-ups on marketplaces.',
        icon: 'Store',
        display_order: 4,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Local Brands Moving Online',
        description: 'Reliable customer care partner to handle your phone & chat inquiries as you expand.',
        icon: 'Building2',
        display_order: 5,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    leads: [],
    lead_notes: [],
    email_logs: [],
    visitor_sessions: [],
    page_views: []
  };
}

class LocalStore {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_FILE)) {
      this.data = getDefaultData();
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('[LocalStore Error] Corrupted data file, resetting to default:', err.message);
        this.data = getDefaultData();
        this.save();
      }
    }
  }

  save() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf8');
  }

  getTable(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }

  getNextId(tableName) {
    const table = this.getTable(tableName);
    if (table.length === 0) return 1;
    return Math.max(...table.map(r => r.id || 0)) + 1;
  }
}

const localStore = new LocalStore();
module.exports = localStore;
