const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsController');
const { requireAuth } = require('../middleware/auth');
const { leadLimiter } = require('../middleware/rateLimiter');

// Public: Submit quote lead
router.post('/', leadLimiter, leadsController.createLead);

// Protected Admin: Manage leads
router.get('/', requireAuth, leadsController.getLeads);
router.get('/:id', requireAuth, leadsController.getLeadById);
router.put('/:id', requireAuth, leadsController.updateLead);
router.post('/:id/notes', requireAuth, leadsController.addLeadNote);
router.delete('/:id', requireAuth, leadsController.deleteLead);

module.exports = router;
