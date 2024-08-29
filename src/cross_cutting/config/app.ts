import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const APP_CONFIG = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanagement',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  logLevel: process.env.LOG_LEVEL || 'info',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
};