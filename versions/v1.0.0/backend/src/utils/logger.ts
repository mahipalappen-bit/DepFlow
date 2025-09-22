import winston from 'winston';
import path from 'path';

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Define colors for each log level
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'grey',
  debug: 'white',
  silly: 'grey',
};

winston.addColors(logColors);

// Create log directory path
const logDir = path.join(process.cwd(), 'logs');

// Determine log level based on environment
const getLogLevel = (): string => {
  const env = process.env.NODE_ENV || 'development';
  const logLevel = process.env.LOG_LEVEL;
  
  if (logLevel) {
    return logLevel;
  }
  
  switch (env) {
    case 'development':
      return 'debug';
    case 'test':
      return 'error';
    case 'production':
      return 'warn';
    default:
      return 'info';
  }
};

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports array
const transports: winston.transport[] = [];

// Console transport (always enabled except in test)
if (process.env.NODE_ENV !== 'test') {
  transports.push(
    new winston.transports.Console({
      level: getLogLevel(),
      format: consoleFormat,
    })
  );
}

// File transports (only in production or when specified)
const enableFileLogging = process.env.NODE_ENV === 'production' || process.env.ENABLE_FILE_LOGGING === 'true';

if (enableFileLogging) {
  // Error log file
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: parseInt(process.env.LOG_MAX_SIZE?.replace('m', '') || '10', 10) * 1024 * 1024,
      maxFiles: parseInt(process.env.LOG_MAX_FILES || '5', 10),
      tailable: true,
    })
  );

  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: fileFormat,
      maxsize: parseInt(process.env.LOG_MAX_SIZE?.replace('m', '') || '10', 10) * 1024 * 1024,
      maxFiles: parseInt(process.env.LOG_MAX_FILES || '5', 10),
      tailable: true,
    })
  );

  // HTTP requests log (if enabled)
  if (process.env.LOG_HTTP_REQUESTS === 'true') {
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, 'requests.log'),
        level: 'http',
        format: fileFormat,
        maxsize: 20 * 1024 * 1024, // 20MB
        maxFiles: 10,
        tailable: true,
      })
    );
  }
}

// Create the logger instance
const logger = winston.createLogger({
  levels: logLevels,
  level: getLogLevel(),
  format: winston.format.errors({ stack: true }),
  transports,
  exitOnError: false,
});

// Handle uncaught exceptions and unhandled rejections
if (process.env.NODE_ENV === 'production') {
  logger.exceptions.handle(
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      format: fileFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    })
  );

  logger.rejections.handle(
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      format: fileFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    })
  );
}

// Enhanced logger methods with additional context
interface LogContext {
  userId?: string;
  requestId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

class EnhancedLogger {
  private logger: winston.Logger;

  constructor(winstonLogger: winston.Logger) {
    this.logger = winstonLogger;
  }

  // Standard log methods
  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  http(message: string, meta?: any): void {
    this.logger.http(message, meta);
  }

  verbose(message: string, meta?: any): void {
    this.logger.verbose(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  // Contextual log methods
  logRequest(message: string, context: LogContext): void {
    this.logger.http(message, {
      type: 'REQUEST',
      userId: context.userId,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      userAgent: context.userAgent,
      ip: context.ip,
      ...context,
    });
  }

  logResponse(message: string, context: LogContext): void {
    this.logger.http(message, {
      type: 'RESPONSE',
      userId: context.userId,
      requestId: context.requestId,
      method: context.method,
      url: context.url,
      statusCode: context.statusCode,
      duration: context.duration,
      ...context,
    });
  }

  logAuth(message: string, context: { userId?: string; action: string; success: boolean; [key: string]: any }): void {
    this.logger.info(message, {
      type: 'AUTH',
      userId: context.userId,
      action: context.action,
      success: context.success,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

  logDependency(message: string, context: { dependencyId?: string; action: string; userId?: string; [key: string]: any }): void {
    this.logger.info(message, {
      type: 'DEPENDENCY',
      dependencyId: context.dependencyId,
      action: context.action,
      userId: context.userId,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

  logSecurity(message: string, context: { userId?: string; action: string; severity: 'low' | 'medium' | 'high' | 'critical'; [key: string]: any }): void {
    this.logger.warn(message, {
      type: 'SECURITY',
      userId: context.userId,
      action: context.action,
      severity: context.severity,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

  logPerformance(message: string, context: { operation: string; duration: number; [key: string]: any }): void {
    this.logger.debug(message, {
      type: 'PERFORMANCE',
      operation: context.operation,
      duration: context.duration,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

  logDatabase(message: string, context: { operation: string; collection?: string; duration?: number; [key: string]: any }): void {
    this.logger.debug(message, {
      type: 'DATABASE',
      operation: context.operation,
      collection: context.collection,
      duration: context.duration,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

  // Child logger for specific contexts
  child(defaultMeta: any) {
    return new EnhancedLogger(this.logger.child(defaultMeta));
  }

  // Stream interface for Morgan
  stream = {
    write: (message: string) => {
      this.logger.http(message.trim());
    },
  };
}

// Create enhanced logger instance
const enhancedLogger = new EnhancedLogger(logger);

// Export the enhanced logger as default
export { enhancedLogger as logger };

// Export the winston logger for advanced usage
export { logger as winstonLogger };

// Export types
export type { LogContext };

// Performance monitoring decorator
export function LogPerformance(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    const className = target.constructor.name;
    const methodName = propertyName;

    try {
      const result = await method.apply(this, args);
      const duration = Date.now() - start;
      
      enhancedLogger.logPerformance(`${className}.${methodName} completed`, {
        operation: `${className}.${methodName}`,
        duration,
        success: true,
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      
      enhancedLogger.logPerformance(`${className}.${methodName} failed`, {
        operation: `${className}.${methodName}`,
        duration,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  };

  return descriptor;
}

export default enhancedLogger;


