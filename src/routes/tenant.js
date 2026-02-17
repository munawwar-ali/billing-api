const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tenantIsolation = require('../middleware/tenantIsolation');
const { getTenant } = require('../controllers/tenantController');

// GET /api/tenant - Get current tenant info
router.get('/', auth, tenantIsolation, getTenant);

module.exports = router;