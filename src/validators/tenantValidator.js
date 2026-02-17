const Joi = require('joi');

const updateTenantSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .messages({
      'string.min': 'Tenant name must be at least 2 characters'
    }),
  plan: Joi.string()
    .valid('starter', 'pro', 'enterprise')
    .messages({
      'any.only': 'Plan must be starter, pro, or enterprise'
    })
});

module.exports = { updateTenantSchema };