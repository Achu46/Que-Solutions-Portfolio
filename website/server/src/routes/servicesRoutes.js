const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const { requireAuth } = require('../middleware/auth');

// Public
router.get('/', servicesController.getServices);

// Protected Admin
router.post('/', requireAuth, servicesController.createService);
router.put('/:id', requireAuth, servicesController.updateService);
router.delete('/:id', requireAuth, servicesController.deleteService);

module.exports = router;
