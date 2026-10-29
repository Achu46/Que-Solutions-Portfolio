const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { requireAuth } = require('../middleware/auth');

// All email routes are protected for admin
router.post('/send', requireAuth, emailController.handleSendEmail);
router.get('/', requireAuth, emailController.getEmailLogs);

module.exports = router;
