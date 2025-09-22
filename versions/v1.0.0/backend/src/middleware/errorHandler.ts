import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { HTTP_STATUS, ERROR_CODES } from '../../../shared/constants';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = ERROR_CODES.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    
    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error class
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(
      message,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      true,
      details
    );
  }
}

// Authentication error class
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(
      message,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_CREDENTIALS,
      true
    );
  }
}

// Authorization error class
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(
      message,
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.ACCESS_DENIED,
      true
    );
  }
}

// Not found error class
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(
      `${resource} not found`,
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.RESOURCE_NOT_FOUND,
      true
    );
  }
}

// Conflict error class
export class ConflictError extends AppError {
  constructor(message: string) {
    super(
      message,
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.RESOURCE_CONFLICT,
      true
    );
  }
}

// Rate limit error class
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(
      message,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      true
    );
  }
}

// Database error handler
const handleDatabaseError = (error: any): AppError => {
  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    return new ConflictError(`${field} '${value}' already exists`);
  }
  
  // MongoDB validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
    return new ValidationError('Validation failed', errors);
  }
  
  // MongoDB cast error
  if (error.name === 'CastError') {
    return new ValidationError(`Invalid ${error.path}: ${error.value}`);
  }
  
  // Generic database error
  return new AppError(
    'Database operation failed',
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_CODES.DATABASE_ERROR
  );
};

// JWT error handler
const handleJWTError = (error: any): AppError => {
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }
  
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }
  
  return new AuthenticationError('Token verification failed');
};

// Development error response
const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  logger.error('Error in development:', {
    error: err,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: (req as any).user?.id,
  });

  res.status(err.statusCode).json({
    success: false,
    error: {
      code: err.code,
      message: err.message,
      details: err.details,
    },
    stack: err.stack,
    request: {
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  });
};

// Production error response
const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  // Log error details
  logger.error('Production error:', {
    code: err.code,
    message: err.message,
    url: req.url,
    method: req.method,
    user: (req as any).user?.id,
    statusCode: err.statusCode,
  });

  // Only send operational errors to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  } else {
    // Generic error message for programming errors
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      },
    });
  }
};

// Async error handler wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// Main error handling middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let err = error;
  
  // Convert non-AppError instances to AppError
  if (!(err instanceof AppError)) {
    // Handle specific error types
    if (err.name === 'ValidationError' || err.code === 11000 || err.name === 'CastError') {
      err = handleDatabaseError(err);
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      err = handleJWTError(err);
    } else {
      // Generic error
      err = new AppError(
        err.message || 'Something went wrong',
        err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        false
      );
    }
  }
  
  // Send error response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    sendErrorProd(err, req, res);
  }
};

// 404 handler (should be used before error handler)
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.method} ${req.originalUrl}`);
  next(error);
};

// Unhandled promise rejection handler
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Promise Rejection:', {
      reason,
      promise,
      stack: reason?.stack,
    });
    
    // Graceful shutdown
    process.exit(1);
  });
};

// Uncaught exception handler
export const handleUncaughtException = () => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', {
      message: error.message,
      stack: error.stack,
    });
    
    // Graceful shutdown
    process.exit(1);
  });
};

// Express error boundary for async routes
export const errorBoundary = (controller: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Validation error formatter
export const formatValidationError = (errors: any[]): any => {
  return {
    code: ERROR_CODES.VALIDATION_ERROR,
    message: 'Validation failed',
    details: errors.map(err => ({
      field: err.field || err.path,
      message: err.message,
      value: err.value,
    })),
  };
};

// API response helpers
export const sendSuccess = (
  res: Response,
  data: any = null,
  message: string = 'Success',
  statusCode: number = HTTP_STATUS.OK
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  code: string = ERROR_CODES.INTERNAL_SERVER_ERROR,
  details?: any
) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  });
};

// Error monitoring integration (placeholder for services like Sentry)
export const reportError = (error: AppError, req?: Request, user?: any) => {
  // In production, you would integrate with error monitoring services
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { user, extra: { req } });
    logger.error('Error reported to monitoring service:', {
      error: error.message,
      code: error.code,
      user: user?.id,
      url: req?.url,
      method: req?.method,
    });
  }
};

export default errorHandler;


