const db = require('../db');

// Why Us CRUD
async function getWhyUs(req, res) {
  try {
    const result = await db.query('SELECT * FROM why_us ORDER BY display_order ASC');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function createWhyUs(req, res) {
  try {
    const { title, description, icon, display_order, is_active } = req.body;
    const result = await db.query(
      `INSERT INTO why_us (title, description, icon, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, icon || 'CheckCircle', display_order || 0, is_active !== false]
    );
    return res.status(201).json({ success: true, message: 'Card added successfully.', data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateWhyUs(req, res) {
  try {
    const { id } = req.params;
    const { title, description, icon, display_order, is_active } = req.body;
    const result = await db.query(
      `UPDATE why_us
       SET title = $1, description = $2, icon = $3, display_order = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [title, description, icon, display_order, is_active, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    return res.json({ success: true, message: 'Updated successfully.', data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteWhyUs(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM why_us WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    return res.json({ success: true, message: 'Deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Target Clients CRUD
async function getTargetClients(req, res) {
  try {
    const result = await db.query('SELECT * FROM target_clients ORDER BY display_order ASC');
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function createTargetClient(req, res) {
  try {
    const { title, description, icon, display_order, is_active } = req.body;
    const result = await db.query(
      `INSERT INTO target_clients (title, description, icon, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, icon || 'ShoppingBag', display_order || 0, is_active !== false]
    );
    return res.status(201).json({ success: true, message: 'Target client category created.', data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateTargetClient(req, res) {
  try {
    const { id } = req.params;
    const { title, description, icon, display_order, is_active } = req.body;
    const result = await db.query(
      `UPDATE target_clients
       SET title = $1, description = $2, icon = $3, display_order = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [title, description, icon, display_order, is_active, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    return res.json({ success: true, message: 'Updated successfully.', data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteTargetClient(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM target_clients WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    return res.json({ success: true, message: 'Deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getWhyUs,
  createWhyUs,
  updateWhyUs,
  deleteWhyUs,
  getTargetClients,
  createTargetClient,
  updateTargetClient,
  deleteTargetClient,
};
