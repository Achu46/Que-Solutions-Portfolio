const crypto = require('crypto');
const db = require('../db');
const { sendLeadNotification } = require('../services/mailService');

function generateLeadCode() {
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `QUE-${rand}`;
}

// Public: Submit quote request / contact lead
async function createLead(req, res) {
  try {
    const {
      name,
      company_name,
      email,
      phone,
      service_interested,
      monthly_requirement,
      message,
      source_page,
      _gotcha // honeypot
    } = req.body;

    // Honeypot spam trap
    if (_gotcha) {
      console.warn('[Spam Detected] Honeypot triggered, dropping submission.');
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your quote request has been received.',
        lead_code: 'QUE-SPAMTRAP'
      });
    }

    // Input validation
    if (!name || !company_name || !email || !phone || !service_interested) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: Name, Company Name, Email, Phone, and Service Interested In.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number with at least 8 digits.'
      });
    }

    const leadCode = generateLeadCode();
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const result = await db.query(
      `INSERT INTO leads (
        lead_code, name, company_name, email, phone,
        service_interested, monthly_requirement, message,
        status, source_page, ip_address, user_agent, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'NEW', $9, $10, $11, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        leadCode,
        name.trim(),
        company_name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        service_interested.trim(),
        monthly_requirement ? monthly_requirement.trim() : '',
        message ? message.trim() : '',
        source_page || '/',
        clientIp,
        userAgent
      ]
    );

    const savedLead = result.rows[0];

    // Asynchronously dispatch email notification (non-blocking for fast UI response)
    sendLeadNotification({
      leadCode,
      name: savedLead.name,
      company: savedLead.company_name,
      email: savedLead.email,
      phone: savedLead.phone,
      service: savedLead.service_interested,
      requirement: savedLead.monthly_requirement,
      message: savedLead.message,
    }).catch(err => console.error('[Lead Notification Email Error]', err.message));

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your quote request has been submitted successfully. Our team will contact you shortly.',
      lead_code: leadCode,
      lead: {
        id: savedLead.id,
        lead_code: savedLead.lead_code,
        name: savedLead.name,
        company_name: savedLead.company_name,
        created_at: savedLead.created_at
      }
    });
  } catch (error) {
    console.error('[Create Lead Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit your quote request at this moment. Please call or WhatsApp us directly at 7092490337.'
    });
  }
}

// Admin: Get all leads with search, filter, and pagination
async function getLeads(req, res) {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    let leads = (await db.query('SELECT * FROM leads ORDER BY created_at DESC')).rows;

    // Apply filters in memory or SQL
    if (status && status !== 'ALL') {
      leads = leads.filter(l => l.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l =>
        (l.lead_code && l.lead_code.toLowerCase().includes(q)) ||
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.company_name && l.company_name.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.phone && l.phone.includes(q)) ||
        (l.service_interested && l.service_interested.toLowerCase().includes(q))
      );
    }

    const totalCount = leads.length;
    const paginated = leads.slice(parseInt(offset, 10), parseInt(offset, 10) + parseInt(limit, 10));

    return res.json({
      success: true,
      data: paginated,
      pagination: {
        total: totalCount,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Admin: Get single lead by ID
async function getLeadById(req, res) {
  try {
    const { id } = req.params;
    const leadRes = await db.query('SELECT * FROM leads WHERE id = $1', [id]);

    if (leadRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    const lead = leadRes.rows[0];
    const notesRes = await db.query('SELECT * FROM lead_notes WHERE lead_id = $1 ORDER BY created_at DESC', [id]);
    const emailsRes = await db.query('SELECT * FROM email_logs WHERE lead_id = $1 ORDER BY sent_at DESC', [id]);

    return res.json({
      success: true,
      data: {
        ...lead,
        notes: notesRes.rows || [],
        emails: emailsRes.rows || [],
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Admin: Update lead status or details
async function updateLead(req, res) {
  try {
    const { id } = req.params;
    const { status, monthly_requirement, message } = req.body;

    const validStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL SENT', 'NEGOTIATION', 'WON', 'LOST'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const result = await db.query(
      `UPDATE leads
       SET status = COALESCE($1, status),
           monthly_requirement = COALESCE($2, monthly_requirement),
           message = COALESCE($3, message),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [status, monthly_requirement, message, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    return res.json({
      success: true,
      message: 'Lead updated successfully.',
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Admin: Add note to lead
async function addLeadNote(req, res) {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: 'Note content is required.' });
    }

    const authorName = req.admin ? req.admin.name : 'Admin';
    const result = await db.query(
      `INSERT INTO lead_notes (lead_id, note, author_name, created_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       RETURNING *`,
      [id, note.trim(), authorName]
    );

    return res.status(201).json({
      success: true,
      message: 'Note added.',
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Admin: Delete lead
async function deleteLead(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM leads WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }
    return res.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  addLeadNote,
  deleteLead,
};
