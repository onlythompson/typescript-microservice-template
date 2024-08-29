import { Request, Response, NextFunction } from 'express';
import logger from '../logging/logger';
/**
 * Middleware to handle errors in the application.
 * 
 * @param err - The error object
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.name}: ${err.message}\n${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};