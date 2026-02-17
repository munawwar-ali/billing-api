const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  month: {
    type: String, // Format: YYYY-MM
    required: true
  },
  totalCalls: {
    type: Number,
    required: true
  },
  amountDue: {
    type: Number, // In USD
    required: true
  },
  stripeInvoiceId: {
    type: String, // Mock Stripe invoice ID
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one invoice per tenant per month
invoiceSchema.index({ tenantId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', invoiceSchema);