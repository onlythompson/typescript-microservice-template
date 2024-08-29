import { Request, Response, NextFunction } from 'express';
import { AppError } from './app_error';
import { logger } from '../logging';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        logger.warn(`AppError: ${err.message}`, { statusCode: err.statusCode });
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    // Unexpected errors
    logger.error(`Unexpected error: ${err.message}`, { stack: err.stack });
    return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred',
    });
};


// // In your main app file (e.g., app.ts or server.ts)
// import { errorHandler } from './cross_cutting/error-handling/ErrorHandler';

// // ... other imports and app setup

// // Use error handler as the last middleware
// app.use(errorHandler);