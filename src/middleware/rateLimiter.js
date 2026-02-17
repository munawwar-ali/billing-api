const Usage = require('../models/Usage');
const Tenant = require('../models/Tenant');
const { errorResponse } = require('../utils/response');

// Middleware to enforce API rate limits
const rateLimiter = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    
    // Get current month in YYYY-MM format
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Get tenant's plan and limit
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return errorResponse(res, 404, 'Tenant not found');
    }

    // Get current usage
    const usage = await Usage.findOne({ tenantId, month });
    const currentUsage = usage ? usage.apiCallCount : 0;

    // Check if limit exceeded
    if (currentUsage >= tenant.apiCallLimit) {
      // Calculate when limit resets (first day of next month)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const retryAfter = Math.ceil((nextMonth - now) / 1000); // seconds until reset

      res.set('X-RateLimit-Limit', tenant.apiCallLimit);
      res.set('X-RateLimit-Remaining', 0);
      res.set('X-RateLimit-Reset', nextMonth.toISOString());
      res.set('Retry-After', retryAfter);

      return errorResponse(
        res, 
        429, 
        `API call limit exceeded. Limit resets on ${nextMonth.toISOString().split('T')[0]}`
      );
    }

    // Add rate limit headers to response
    res.set('X-RateLimit-Limit', tenant.apiCallLimit);
    res.set('X-RateLimit-Remaining', tenant.apiCallLimit - currentUsage);

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    return errorResponse(res, 500, 'Error checking rate limit');
  }
};

module.exports = rateLimiter;