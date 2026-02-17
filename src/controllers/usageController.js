const Usage = require('../models/Usage');
const Tenant = require('../models/Tenant');
const { successResponse, errorResponse } = require('../utils/response');

// Get current month usage
const getCurrentUsage = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    
    // Get current month in YYYY-MM format
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Get tenant info for limits
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return errorResponse(res, 404, 'Tenant not found');
    }

    // Get usage for current month
    const usage = await Usage.findOne({ tenantId, month });
    const currentUsage = usage ? usage.apiCallCount : 0;

    // Calculate remaining quota
    const remaining = Math.max(0, tenant.apiCallLimit - currentUsage);
    const percentageUsed = ((currentUsage / tenant.apiCallLimit) * 100).toFixed(2);

    return successResponse(res, 200, 'Usage retrieved successfully', {
      month,
      plan: tenant.plan,
      limit: tenant.apiCallLimit,
      used: currentUsage,
      remaining,
      percentageUsed: parseFloat(percentageUsed),
      lastUpdated: usage ? usage.lastUpdated : null
    });
  } catch (error) {
    next(error);
  }
};

// Get usage history (last 6 months)
const getUsageHistory = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    
    // Get last 6 months of usage
    const usageHistory = await Usage.find({ tenantId })
      .sort({ month: -1 })
      .limit(6);

    return successResponse(res, 200, 'Usage history retrieved successfully', {
      history: usageHistory.map(u => ({
        month: u.month,
        apiCallCount: u.apiCallCount,
        lastUpdated: u.lastUpdated
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUsage,
  getUsageHistory
};