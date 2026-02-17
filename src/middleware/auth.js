const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { errorResponse } = require('../utils/response');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return errorResponse(res, 401, 'No token provided, authorization denied');
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired');
    }
    return errorResponse(res, 500, 'Server error during authentication');
  }
};

module.exports = auth;