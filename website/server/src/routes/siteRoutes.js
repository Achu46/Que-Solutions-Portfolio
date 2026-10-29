const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { requireAuth } = require('../middleware/auth');

// Public
router.get('/', siteController.getSiteData);

// Protected Admin CMS
router.put('/settings', requireAuth, siteController.updateSiteSettings);
router.put('/hero', requireAuth, siteController.updateHeroContent);
router.put('/about', requireAuth, siteController.updateAboutContent);

module.exports = router;
