const { errorResponse } = require('../utils/response');

// Middleware to ensure tenant isolation
// This middleware should run AFTER auth middleware
const tenantIsolation = (req, res, next) => {
  try {
    if (!req.user || !req.user.tenantId) {
      return errorResponse(res, 401, 'Tenant information missing');
    }

    // Attach tenantId to query for easy filtering
    req.tenantId = req.user.tenantId;
    
    next();
  } catch (error) {
    return errorResponse(res, 500, 'Server error during tenant isolation');
  }
};

module.exports = tenantIsolation;