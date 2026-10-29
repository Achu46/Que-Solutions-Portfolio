const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/auth');

// Public: Track page view
router.post('/track', analyticsController.trackPageView);

// Protected Admin: Overview and visitor metrics
router.get('/overview', requireAuth, analyticsController.getOverview);
router.get('/visitors', requireAuth, analyticsController.getVisitors);

module.exports = router;
