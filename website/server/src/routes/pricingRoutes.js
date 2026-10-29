const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const { requireAuth } = require('../middleware/auth');

// Public
router.get('/', pricingController.getPricingPlans);

// Protected Admin
router.post('/', requireAuth, pricingController.createPricingPlan);
router.put('/:id', requireAuth, pricingController.updatePricingPlan);
router.delete('/:id', requireAuth, pricingController.deletePricingPlan);

module.exports = router;
