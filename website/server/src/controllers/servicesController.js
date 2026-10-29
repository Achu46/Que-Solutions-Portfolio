const db = require('../db');

// Get all services (Admin view includes inactive)
async function getServices(req, res) {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY display_order ASC');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Create new service
async function createService(req, res) {
  try {
    const { title, slug, description, icon, features, display_order, is_active } = req.body;
    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);

    const result = await db.query(
      `INSERT INTO services (title, slug, description, icon, features, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, generatedSlug, description, icon || 'PhoneIncoming', featuresJson, display_order || 0, is_active !== false]
    );

    return res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Update existing service
async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { title, slug, description, icon, features, display_order, is_active } = req.body;
    const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);

    const result = await db.query(
      `UPDATE services
       SET title = $1, slug = $2, description = $3, icon = $4, features = $5, display_order = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, slug, description, icon, featuresJson, display_order, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    return res.json({
      success: true,
      message: 'Service updated successfully.',
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Delete service
async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    return res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
