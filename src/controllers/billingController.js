const Invoice = require('../models/Invoice');
const { generateInvoice } = require('../services/billingService');
const { successResponse, errorResponse } = require('../utils/response');

// Generate invoice for current month
const calculateInvoice = async (req, res, next) => {
  try {
    // Only admins can generate invoices
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Only admins can generate invoices');
    }

    const tenantId = req.tenantId;
    
    // Get current month in YYYY-MM format
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Generate invoice
    const invoice = await generateInvoice(tenantId, month);

    return successResponse(res, 201, 'Invoice generated successfully', {
      id: invoice._id,
      month: invoice.month,
      totalCalls: invoice.totalCalls,
      amountDue: invoice.amountDue,
      stripeInvoiceId: invoice.stripeInvoiceId,
      status: invoice.status,
      createdAt: invoice.createdAt
    });
  } catch (error) {
    if (error.message === 'Invoice already exists for this month') {
      return errorResponse(res, 400, error.message);
    }
    if (error.message === 'No usage data found for this month') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

// Get all invoices for tenant
const getInvoices = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    
    // Get all invoices for this tenant
    const invoices = await Invoice.find({ tenantId })
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Invoices retrieved successfully', {
      invoices: invoices.map(inv => ({
        id: inv._id,
        month: inv.month,
        totalCalls: inv.totalCalls,
        amountDue: inv.amountDue,
        stripeInvoiceId: inv.stripeInvoiceId,
        status: inv.status,
        createdAt: inv.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Get specific invoice
const getInvoiceById = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const invoiceId = req.params.id;
    
    // Find invoice and ensure it belongs to this tenant
    const invoice = await Invoice.findOne({ _id: invoiceId, tenantId });
    
    if (!invoice) {
      return errorResponse(res, 404, 'Invoice not found');
    }

    return successResponse(res, 200, 'Invoice retrieved successfully', {
      id: invoice._id,
      month: invoice.month,
      totalCalls: invoice.totalCalls,
      amountDue: invoice.amountDue,
      stripeInvoiceId: invoice.stripeInvoiceId,
      status: invoice.status,
      createdAt: invoice.createdAt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateInvoice,
  getInvoices,
  getInvoiceById
};