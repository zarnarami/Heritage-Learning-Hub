const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB, getIsConnected } = require('./config/db');
const { initFallbackDB } = require('./services/storage');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check and root info
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'Heritage Learning Hub API',
    tagline: "Discover. Learn. Preserve. Celebrate India's Heritage.",
    dbEngine: getIsConnected() ? 'MongoDB Cluster' : 'Integrated High-Performance Persistence Storage',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/heritage', require('./routes/heritageRoutes'));
app.use('/api/modules', require('./routes/moduleRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server & Database
const startServer = async () => {
  // Try connecting to MongoDB; if not available, init fallback database
  const connected = await connectDB();
  if (!connected) {
    initFallbackDB();
  }

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏛️  HERITAGE LEARNING HUB API IS RUNNING ON PORT ${PORT}`);
    console.log(`    Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`    Database Mode: ${getIsConnected() ? 'MongoDB' : 'High-Performance Persistent Engine'}`);
    console.log(`    Official Documentation & Source Attribution: ASI, UNESCO, Ministry of Culture`);
    console.log(`=======================================================`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
