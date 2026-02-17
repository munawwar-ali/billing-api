const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tenantIsolation = require('../middleware/tenantIsolation');
const usageTracking = require('../middleware/usageTracking');
const rateLimiter = require('../middleware/rateLimiter');
const { getDemoData, getPublicData } = require('../controllers/demoController');

// GET /api/demo/data - Protected endpoint that tracks usage
router.get('/data', auth, tenantIsolation, rateLimiter, usageTracking, getDemoData);

// GET /api/demo/public - Public endpoint (no auth, no usage tracking)
router.get('/public', getPublicData);

module.exports = router;