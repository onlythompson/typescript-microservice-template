import cors from 'cors';
import { APP_CONFIG } from './../../../cross_cutting/config/app';

/**
 * Middleware to handle Cross-Origin Resource Sharing (CORS).
 */
export const corsMiddleware = cors({
  origin: APP_CONFIG.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
});