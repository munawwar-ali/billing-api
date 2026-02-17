const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tenantIsolation = require('../middleware/tenantIsolation');
const { getCurrentUsage, getUsageHistory } = require('../controllers/usageController');

// GET /api/usage - Get current month usage
router.get('/', auth, tenantIsolation, getCurrentUsage);

// GET /api/usage/history - Get usage history (last 6 months)
router.get('/history', auth, tenantIsolation, getUsageHistory);

module.exports = router;