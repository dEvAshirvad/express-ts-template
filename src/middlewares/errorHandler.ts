import { NextFunction, Request, Response } from 'express';
import { APIError } from '../errors/APIError';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      title: error.title,
      status: error.statusCode,
      message: error.message,
    });
  }
  res.status(500).json({
    success: false,
    status: 'error',
    title: 'Internal Server Error',
    message: error.message,
  });
  next();
}
