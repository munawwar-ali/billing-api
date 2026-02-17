const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const { jwtSecret } = require('../config/env');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const { successResponse, errorResponse } = require('../utils/response');

// Register new tenant + admin user
const register = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 400, 'Validation failed', error.details.map(d => d.message));
    }

    const { email, password, tenantName } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'User with this email already exists');
    }

    // Create tenant
    const tenant = await Tenant.create({
      name: tenantName,
      plan: 'starter',
      apiCallLimit: 10000
    });

    // Create admin user
    const user = await User.create({
      email,
      password,
      tenantId: tenant._id,
      role: 'admin'
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        tenantId: tenant._id,
        role: user.role
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return successResponse(res, 201, 'Registration successful', {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      tenant: {
        id: tenant._id,
        name: tenant.name,
        plan: tenant.plan,
        apiCallLimit: tenant.apiCallLimit
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 400, 'Validation failed', error.details.map(d => d.message));
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Get tenant info
    const tenant = await Tenant.findById(user.tenantId);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        tenantId: user.tenantId,
        role: user.role
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return successResponse(res, 200, 'Login successful', {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      tenant: {
        id: tenant._id,
        name: tenant.name,
        plan: tenant.plan,
        apiCallLimit: tenant.apiCallLimit
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};