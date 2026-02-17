const Usage = require('../models/Usage');
const Invoice = require('../models/Invoice');
const Tenant = require('../models/Tenant');
const { createInvoice } = require('./stripeService');

// Calculate cost based on usage tiers
const calculateCost = (apiCalls) => {
  let cost = 0;
  
  // Tier 1: 0-10k calls = $0 (included in plan)
  if (apiCalls <= 10000) {
    return 0;
  }
  
  // Tier 2: 10k-100k calls = $0.001 per call
  if (apiCalls <= 100000) {
    cost = (apiCalls - 10000) * 0.001;
    return parseFloat(cost.toFixed(2));
  }
  
  // Tier 3: 100k+ calls = $0.0005 per call (discounted rate)
  // First 90k calls (10k-100k) at $0.001
  cost = 90000 * 0.001;
  
  // Remaining calls at $0.0005
  cost += (apiCalls - 100000) * 0.0005;
  
  return parseFloat(cost.toFixed(2));
};

// Generate invoice for a tenant for a specific month
const generateInvoice = async (tenantId, month) => {
  // Check if invoice already exists
  const existingInvoice = await Invoice.findOne({ tenantId, month });
  if (existingInvoice) {
    throw new Error('Invoice already exists for this month');
  }

  // Get usage for the month
  const usage = await Usage.findOne({ tenantId, month });
  if (!usage) {
    throw new Error('No usage data found for this month');
  }

  // Get tenant info
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) {
    throw new Error('Tenant not found');
  }

  // Calculate amount due
  const totalCalls = usage.apiCallCount;
  const amountDue = calculateCost(totalCalls);

  // Mock Stripe invoice creation
  const stripeInvoice = await createInvoice(
    `cus_mock_${tenantId}`,
    amountDue,
    `API usage for ${month} - ${totalCalls.toLocaleString()} calls`
  );

  // Create invoice record
  const invoice = await Invoice.create({
    tenantId,
    month,
    totalCalls,
    amountDue,
    stripeInvoiceId: stripeInvoice.id,
    status: 'pending'
  });

  return invoice;
};

module.exports = {
  calculateCost,
  generateInvoice
};