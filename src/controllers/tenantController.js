const Tenant = require('../models/Tenant');
const { successResponse, errorResponse } = require('../utils/response');

// Get current tenant info
const getTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.tenantId);
    
    if (!tenant) {
      return errorResponse(res, 404, 'Tenant not found');
    }

    return successResponse(res, 200, 'Tenant retrieved successfully', {
      id: tenant._id,
      name: tenant.name,
      plan: tenant.plan,
      apiCallLimit: tenant.apiCallLimit,
      createdAt: tenant.createdAt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTenant
};