/**
 * ============================================================================
 * Centralized Error Handling Middleware
 * ============================================================================
 * This middleware catches all errors thrown in the application and returns
 * consistent JSON error responses to the client.
 *
 * Benefits:
 * - Consistent error response format across all endpoints
 * - Proper HTTP status codes for different error types
 * - Error logging for debugging
 * - Prevents sensitive error details from leaking to clients in production
 * ============================================================================
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Custom error interface for structured error handling
 */
interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Error Handler Middleware
 *
 * This function is called whenever an error is thrown or passed to next(error)
 * in any route handler or middleware.
 *
 * @param err - The error object thrown by the application
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function (required for error middleware signature)
 *
 * Error handling flow:
 * 1. Log the error for debugging
 * 2. Determine the appropriate HTTP status code
 * 3. Format the error message
 * 4. Send JSON response to client
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error for debugging (in production, use a proper logging service)
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default status code is 500 (Internal Server Error)
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma-specific errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference

    // P2002: Unique constraint violation (e.g., duplicate email)
    if (err.code === 'P2002') {
      statusCode = 400;
      message = 'A record with this value already exists';
    }

    // P2025: Record not found (e.g., trying to update/delete non-existent record)
    if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    }

    // P2003: Foreign key constraint violation
    if (err.code === 'P2003') {
      statusCode = 400;
      message = 'Invalid reference to related record';
    }
  }

  // Handle Prisma validation errors (e.g., invalid data types)
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  }

  // Send error response to client
  res.status(statusCode).json({
    error: message,
    // Include additional details in development mode only
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.message,
    }),
  });
};

/**
 * Not Found Handler
 *
 * This middleware handles requests to undefined routes.
 * It should be placed after all route definitions.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
  });
};

