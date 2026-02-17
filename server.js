const app = require('./src/app');
const connectDB = require('./src/config/database');
const { port } = require('./src/config/env');

// Connect to MongoDB
connectDB();

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});