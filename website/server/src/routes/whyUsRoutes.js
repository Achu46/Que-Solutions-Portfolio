const express = require('express');
const router = express.Router();
const whyUsController = require('../controllers/whyUsController');
const { requireAuth } = require('../middleware/auth');

// Why Us
router.get('/why-us', whyUsController.getWhyUs);
router.post('/why-us', requireAuth, whyUsController.createWhyUs);
router.put('/why-us/:id', requireAuth, whyUsController.updateWhyUs);
router.delete('/why-us/:id', requireAuth, whyUsController.deleteWhyUs);

// Target Clients
router.get('/target-clients', whyUsController.getTargetClients);
router.post('/target-clients', requireAuth, whyUsController.createTargetClient);
router.put('/target-clients/:id', requireAuth, whyUsController.updateTargetClient);
router.delete('/target-clients/:id', requireAuth, whyUsController.deleteTargetClient);

module.exports = router;
