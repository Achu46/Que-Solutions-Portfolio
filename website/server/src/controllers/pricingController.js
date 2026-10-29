const db = require('../db');

// Get all pricing plans
async function getPricingPlans(req, res) {
  try {
    const result = await db.query('SELECT * FROM pricing_plans ORDER BY display_order ASC');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Create new pricing plan
async function createPricingPlan(req, res) {
  try {
    const { name, price, numeric_price, billing_period, hours_desc, includes_summary, features, is_recommended, is_active, display_order, cta_text } = req.body;
    const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);

    const result = await db.query(
      `INSERT INTO pricing_plans (name, price, numeric_price, billing_period, hours_desc, includes_summary, features, is_recommended, is_active, display_order, cta_text)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        name,
        price,
        numeric_price || 0,
        billing_period || '/mo',
        hours_desc || '4 hrs/day, Mon–Sat (~104 hrs/mo)',
        includes_summary,
        featuresJson,
        !!is_recommended,
        is_active !== false,
        display_order || 0,
        cta_text || 'Get a Quote'
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Pricing plan created successfully.',
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Update pricing plan
async function updatePricingPlan(req, res) {
  try {
    const { id } = req.params;
    const { name, price, numeric_price, billing_period, hours_desc, includes_summary, features, is_recommended, is_active, display_order, cta_text } = req.body;
    const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);

    const result = await db.query(
      `UPDATE pricing_plans
       SET name = $1, price = $2, numeric_price = $3, billing_period = $4, hours_desc = $5,
           includes_summary = $6, features = $7, is_recommended = $8, is_active = $9,
           display_order = $10, cta_text = $11, updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        name,
        price,
        numeric_price || 0,
        billing_period,
        hours_desc,
        includes_summary,
        featuresJson,
        !!is_recommended,
        is_active,
        display_order,
        cta_text,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pricing plan not found.' });
    }

    return res.json({
      success: true,
      message: 'Pricing plan updated successfully.',
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Delete pricing plan
async function deletePricingPlan(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM pricing_plans WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pricing plan not found.' });
    }
    return res.json({ success: true, message: 'Pricing plan deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
};
