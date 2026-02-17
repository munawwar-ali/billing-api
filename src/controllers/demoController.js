const { successResponse } = require('../utils/response');

// Protected endpoint that tracks usage
const getDemoData = async (req, res, next) => {
  try {
    // Return some dummy data
    const dummyData = {
      message: 'This is protected data',
      timestamp: new Date().toISOString(),
      tenantId: req.tenantId,
      userId: req.user.userId,
      items: [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
        { id: 3, name: 'Item 3', value: 300 }
      ]
    };

    return successResponse(res, 200, 'Data retrieved successfully', dummyData);
  } catch (error) {
    next(error);
  }
};

// Public endpoint (no auth, no usage tracking)
const getPublicData = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'Public endpoint accessed', {
      message: 'This endpoint does not require authentication',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDemoData,
  getPublicData
};