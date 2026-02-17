const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  month: {
    type: String, // Format: YYYY-MM
    required: true
  },
  apiCallCount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one usage record per tenant per month
usageSchema.index({ tenantId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Usage', usageSchema);