const bcrypt = require('bcryptjs');
const { pool, testConnection } = require('./index');

async function seedDatabase() {
  console.log('[Seed] Checking PostgreSQL connection...');
  const health = await testConnection();

  if (!health.connected) {
    console.error(`[Seed Error] Unable to connect to PostgreSQL: ${health.error}`);
    process.exit(1);
  }

  try {
    console.log('[Seed] Seeding default admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@quesolutions.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPassword@2026';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    await pool.query(
      `INSERT INTO admins (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) 
       DO UPDATE SET updated_at = CURRENT_TIMESTAMP`,
      [adminEmail, passwordHash, 'Que Solutions Admin', 'superadmin']
    );

    console.log('[Seed] Seeding site_settings...');
    await pool.query(
      `INSERT INTO site_settings (id, site_name, tagline, phone, email, location, working_hours, footer_text, social_whatsapp)
       VALUES (1, 'QUE SOLUTIONS', 'Customer Care & Call Centre Services', '7092490337', 'que.solutions.services@gmail.com', 'Erode, Tamil Nadu', 'Mon – Sat: 4 hrs/day (~104 hrs/mo)', 'Delivering reliable, technology-driven outsourced customer care and call centre services for growing businesses.', 'https://wa.me/917092490337')
       ON CONFLICT (id) DO NOTHING`
    );

    console.log('[Seed] Seeding hero_content...');
    await pool.query(
      `INSERT INTO hero_content (id, badge_text, headline, subheadline, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link)
       VALUES (1, 'SUPPORT | TECHNOLOGY | GROWTH', 'Reliable Customer Support for Growing Businesses', 'Affordable outsourced customer care, call centre and chat support for small and growing product-based businesses.', 'Get a Quote', '#contact', 'Talk to Us', 'tel:7092490337')
       ON CONFLICT (id) DO NOTHING`
    );

    console.log('[Seed] Seeding about_content...');
    await pool.query(
      `INSERT INTO about_content (id, headline, description, vision, future_scope)
       VALUES (1, 'People Today. A Brighter Tomorrow.', 'Que Solutions is a customer care and call centre service provider focused on delivering professional, responsive and reliable customer support solutions for businesses.', 'To become an affordable customer support partner for small product-based businesses, helping them provide professional customer experiences without the cost of building a large in-house support team.', 'Que Solutions plans to expand its service capabilities over time, including technology and IT-enabled business solutions, while continuing to build strong customer support capabilities.')
       ON CONFLICT (id) DO NOTHING`
    );

    console.log('[Seed] Seeding services...');
    const services = [
      {
        title: 'Inbound Call Support',
        slug: 'inbound-call-support',
        description: 'Professional handling of customer enquiries, product questions, order-related queries and support requests.',
        icon: 'PhoneIncoming',
        features: JSON.stringify([
          'Professional customer query handling',
          'Order status & tracking assistance',
          'Product information guidance',
          'Escalation & ticket logging',
          'Daily summary & interaction reporting'
        ]),
        order: 1
      },
      {
        title: 'Outbound Call Support',
        slug: 'outbound-call-support',
        description: 'Existing lead follow-ups, callbacks, order confirmations and customer feedback.',
        icon: 'PhoneOutgoing',
        features: JSON.stringify([
          'Lead follow-ups & callback scheduling',
          'Pre-dispatch order confirmation',
          'Customer feedback & satisfaction surveys',
          'Abandoned inquiry re-engagement',
          'Structured call logs & feedback recording'
        ]),
        order: 2
      },
      {
        title: 'Chat Support',
        slug: 'chat-support',
        description: 'Responsive customer assistance via website chat, WhatsApp and other agreed channels.',
        icon: 'MessageSquareText',
        features: JSON.stringify([
          'Real-time website live chat',
          'Official WhatsApp Business assistance',
          'Quick response time SLA',
          'Pre-purchase inquiry assistance',
          'Post-sales troubleshooting & FAQs'
        ]),
        order: 3
      }
    ];

    for (const s of services) {
      await pool.query(
        `INSERT INTO services (title, slug, description, icon, features, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE)
         ON CONFLICT (slug) DO UPDATE 
         SET title = EXCLUDED.title, description = EXCLUDED.description, features = EXCLUDED.features, icon = EXCLUDED.icon`,
        [s.title, s.slug, s.description, s.icon, s.features, s.order]
      );
    }

    console.log('[Seed] Seeding pricing_plans...');
    const plans = [
      {
        name: 'Starter',
        price: '₹11,999',
        numeric_price: 11999,
        billing_period: '/mo',
        hours_desc: '4 hrs/day, Mon–Sat (~104 hrs/mo)',
        includes_summary: 'Chat Support',
        features: JSON.stringify([
          'Dedicated Chat Support Agent',
          '4 hours/day, Monday to Saturday',
          '~104 productive hours per month',
          'Website Live Chat & WhatsApp',
          'Weekly interaction & query reports',
          'Agreed onboarding volume limits'
        ]),
        is_recommended: false,
        order: 1
      },
      {
        name: 'Growth',
        price: '₹15,999',
        numeric_price: 15999,
        billing_period: '/mo',
        hours_desc: '4 hrs/day, Mon–Sat (~104 hrs/mo)',
        includes_summary: 'Chat + Inbound Call Support',
        features: JSON.stringify([
          'Chat + Inbound Call Handling',
          '4 hours/day, Monday to Saturday',
          '~104 productive hours per month',
          'Order verification & inquiries',
          'Call logging & ticket management',
          'Bi-weekly performance review',
          'Agreed onboarding volume limits'
        ]),
        is_recommended: true,
        order: 2
      },
      {
        name: 'Business',
        price: '₹21,999',
        numeric_price: 21999,
        billing_period: '/mo',
        hours_desc: '4 hrs/day, Mon–Sat (~104 hrs/mo)',
        includes_summary: 'Chat + Inbound + Outbound Call Support',
        features: JSON.stringify([
          'Chat + Inbound + Outbound Calling',
          '4 hours/day, Monday to Saturday',
          '~104 productive hours per month',
          'Lead follow-ups & feedback surveys',
          'Dedicated Team Lead supervision',
          'Custom workflows & monthly SLA audits',
          'Agreed onboarding volume limits'
        ]),
        is_recommended: false,
        order: 3
      }
    ];

    // Clear old pricing plans to prevent duplicate names if IDs changed
    const planCount = await pool.query('SELECT count(*) FROM pricing_plans');
    if (parseInt(planCount.rows[0].count, 10) === 0) {
      for (const p of plans) {
        await pool.query(
          `INSERT INTO pricing_plans (name, price, numeric_price, billing_period, hours_desc, includes_summary, features, is_recommended, is_active, display_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, $9)`,
          [p.name, p.price, p.numeric_price, p.billing_period, p.hours_desc, p.includes_summary, p.features, p.is_recommended, p.order]
        );
      }
    }

    console.log('[Seed] Seeding why_us...');
    const whyItems = [
      {
        title: 'Affordable Support',
        description: 'Transparent pricing with zero hidden costs, tailor-made for small product businesses.',
        icon: 'BadgePercent',
        order: 1
      },
      {
        title: 'Flexible Working Model',
        description: 'Structured 4 hrs/day schedule that adapts to your peak customer traffic hours.',
        icon: 'Clock',
        order: 2
      },
      {
        title: 'Professional Interaction',
        description: 'Courteous, well-trained agents representing your business with brand dignity.',
        icon: 'Award',
        order: 3
      },
      {
        title: 'Scalable Support',
        description: 'Easily transition from Chat to Inbound & Outbound calling as your volume grows.',
        icon: 'TrendingUp',
        order: 4
      },
      {
        title: 'Customer-Focused Approach',
        description: 'Dedicated focus on fast resolution times, clear answers, and happy repeat buyers.',
        icon: 'HeartHandshake',
        order: 5
      },
      {
        title: 'Easy Business Communication',
        description: 'Direct communication channels with our team, daily call summaries, and hassle-free updates.',
        icon: 'MessageCircle',
        order: 6
      }
    ];

    const whyCount = await pool.query('SELECT count(*) FROM why_us');
    if (parseInt(whyCount.rows[0].count, 10) === 0) {
      for (const w of whyItems) {
        await pool.query(
          `INSERT INTO why_us (title, description, icon, display_order, is_active)
           VALUES ($1, $2, $3, $4, TRUE)`,
          [w.title, w.description, w.icon, w.order]
        );
      }
    }

    console.log('[Seed] Seeding target_clients...');
    const targets = [
      {
        title: 'Small D2C Brands',
        description: 'Provide responsive customer support for direct-to-consumer store orders and queries.',
        icon: 'ShoppingBag',
        order: 1
      },
      {
        title: 'Instagram & Social Sellers',
        description: 'Quick DM and WhatsApp response support to convert inquiries into paid orders.',
        icon: 'Camera',
        order: 2
      },
      {
        title: 'Online Product Businesses',
        description: 'Professional enquiry handling, tracking updates, and return assistance.',
        icon: 'Globe',
        order: 3
      },
      {
        title: 'Amazon & Marketplace Sellers',
        description: 'Buyer message responses and customer satisfaction follow-ups on marketplaces.',
        icon: 'Store',
        order: 4
      },
      {
        title: 'Local Brands Moving Online',
        description: 'Reliable customer care partner to handle your phone & chat inquiries as you expand.',
        icon: 'Building2',
        order: 5
      }
    ];

    const targetCount = await pool.query('SELECT count(*) FROM target_clients');
    if (parseInt(targetCount.rows[0].count, 10) === 0) {
      for (const t of targets) {
        await pool.query(
          `INSERT INTO target_clients (title, description, icon, display_order, is_active)
           VALUES ($1, $2, $3, $4, TRUE)`,
          [t.title, t.description, t.icon, t.order]
        );
      }
    }

    console.log('[Seed] Database seeding completed successfully!');
    console.log(`[Seed] Admin Email: ${adminEmail}`);
    console.log(`[Seed] Admin Password: ${adminPassword}`);
  } catch (err) {
    console.error('[Seed Error] Failed to seed database:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
