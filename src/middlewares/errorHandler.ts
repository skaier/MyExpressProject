import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import logger from '../utils/logger';

interface ErrorResponse {
  success: boolean;
  message: string;
  stack?: string;
}

const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;

  // Handle non-ApiError instances
  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Log the error
  logger.error(error.toString());

  // Prepare response
  const response: ErrorResponse = {
    success: false,
    message: error.message
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  // Send response
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  res.status(statusCode).json(response);
};

export default errorHandler;