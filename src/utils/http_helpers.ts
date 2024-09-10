import { Response } from 'express';

// Centralized response error handling
export const httpRequestErrorHandler = ((res: Response, error: unknown): void => {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  });