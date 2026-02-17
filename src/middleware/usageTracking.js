const Usage = require('../models/Usage');

// Middleware to track API usage per tenant
const usageTracking = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    
    // Get current month in YYYY-MM format
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Increment API call count for this tenant and month
    await Usage.findOneAndUpdate(
      { tenantId, month },
      { 
        $inc: { apiCallCount: 1 },
        $set: { lastUpdated: new Date() }
      },
      { 
        upsert: true, // Create if doesn't exist
        new: true 
      }
    );

    next();
  } catch (error) {
    // Don't block the request if usage tracking fails
    console.error('Usage tracking error:', error);
    next();
  }
};

module.exports = usageTracking;