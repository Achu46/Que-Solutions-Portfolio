const db = require('../db');

// Public aggregate endpoint for high-speed page load
async function getSiteData(req, res) {
  try {
    const [settingsRes, heroRes, servicesRes, pricingRes, aboutRes, whyUsRes, targetClientsRes] = await Promise.all([
      db.query('SELECT * FROM site_settings WHERE id = 1'),
      db.query('SELECT * FROM hero_content WHERE id = 1'),
      db.query('SELECT * FROM services WHERE is_active = TRUE ORDER BY display_order ASC'),
      db.query('SELECT * FROM pricing_plans WHERE is_active = TRUE ORDER BY display_order ASC'),
      db.query('SELECT * FROM about_content WHERE id = 1'),
      db.query('SELECT * FROM why_us WHERE is_active = TRUE ORDER BY display_order ASC'),
      db.query('SELECT * FROM target_clients WHERE is_active = TRUE ORDER BY display_order ASC'),
    ]);

    return res.json({
      success: true,
      data: {
        settings: settingsRes.rows[0] || {},
        hero: heroRes.rows[0] || {},
        services: servicesRes.rows,
        pricing: pricingRes.rows,
        about: aboutRes.rows[0] || {},
        whyUs: whyUsRes.rows,
        targetClients: targetClientsRes.rows,
      }
    });
  } catch (error) {
    console.error('[Site Controller Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve website data.'
    });
  }
}

// Admin: Update Site Settings
async function updateSiteSettings(req, res) {
  try {
    const { site_name, tagline, phone, email, location, working_hours, footer_text, social_whatsapp, social_linkedin, social_instagram } = req.body;

    await db.query(
      `UPDATE site_settings
       SET site_name = $1, tagline = $2, phone = $3, email = $4, location = $5,
           working_hours = $6, footer_text = $7, social_whatsapp = $8, social_linkedin = $9, social_instagram = $10,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [site_name, tagline, phone, email, location, working_hours, footer_text, social_whatsapp, social_linkedin, social_instagram]
    );

    const updated = await db.query('SELECT * FROM site_settings WHERE id = 1');
    return res.json({
      success: true,
      message: 'Site settings updated successfully.',
      data: updated.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Admin: Update Hero Content
async function updateHeroContent(req, res) {
  try {
    const { badge_text, headline, subheadline, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link } = req.body;

    await db.query(
      `UPDATE hero_content
       SET badge_text = $1, headline = $2, subheadline = $3, primary_cta_text = $4,
           primary_cta_link = $5, secondary_cta_text = $6, secondary_cta_link = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [badge_text, headline, subheadline, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link]
    );

    const updated = await db.query('SELECT * FROM hero_content WHERE id = 1');
    return res.json({
      success: true,
      message: 'Hero content updated successfully.',
      data: updated.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Admin: Update About Content
async function updateAboutContent(req, res) {
  try {
    const { headline, description, vision, future_scope } = req.body;

    await db.query(
      `UPDATE about_content
       SET headline = $1, description = $2, vision = $3, future_scope = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [headline, description, vision, future_scope]
    );

    const updated = await db.query('SELECT * FROM about_content WHERE id = 1');
    return res.json({
      success: true,
      message: 'About content updated successfully.',
      data: updated.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getSiteData,
  updateSiteSettings,
  updateHeroContent,
  updateAboutContent,
};
