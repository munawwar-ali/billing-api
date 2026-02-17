const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tenantIsolation = require('../middleware/tenantIsolation');
const { calculateInvoice, getInvoices, getInvoiceById } = require('../controllers/billingController');

// POST /api/billing/calculate - Generate invoice for current month
router.post('/calculate', auth, tenantIsolation, calculateInvoice);

// GET /api/billing/invoices - Get all invoices for tenant
router.get('/invoices', auth, tenantIsolation, getInvoices);

// GET /api/billing/invoices/:id - Get specific invoice
router.get('/invoices/:id', auth, tenantIsolation, getInvoiceById);

module.exports = router;