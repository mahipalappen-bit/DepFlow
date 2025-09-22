import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { cache } from '@/config/redis';
import { HTTP_STATUS, ERROR_CODES } from '../../../shared/constants';

// Rate limiting configuration based on environment
const getRateLimitConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    // More restrictive in production
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || (isProduction ? '100' : '1000'), 10),
    authMaxRequests: parseInt(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS || (isProduction ? '5' : '10'), 10),
    skip: isDevelopment ? () => false : undefined, // Skip in development if needed
  };
};

const config = getRateLimitConfig();

// Custom key generator that includes user ID when available
const createKeyGenerator = (prefix: string) => {
  return (req: Request): string => {
    const userId = (req as any).user?.id || 'anonymous';
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    return `${prefix}:${userId}:${ip}`;
  };
};

// Custom store using Redis (if available)
class RedisRateLimitStore {
  private prefix: string;
  private windowMs: number;

  constructor(prefix: string, windowMs: number) {
    this.prefix = prefix;
    this.windowMs = windowMs;
  }

  async incr(key: string): Promise<{ totalHits: number; timeToExpire?: number }> {
    const redisKey = `${this.prefix}:${key}`;
    
    try {
      // Try Redis first
      const current = await cache.get(redisKey);
      const hits = current ? parseInt(current, 10) + 1 : 1;
      
      if (hits === 1) {
        // Set with expiration on first hit
        await cache.set(redisKey, hits.toString(), Math.floor(this.windowMs / 1000));
        return { totalHits: hits, timeToExpire: this.windowMs };
      } else {
        // Increment existing key
        await cache.set(redisKey, hits.toString());
        return { totalHits: hits };
      }
    } catch (error) {
      // Fallback to memory (handled by express-rate-limit default store)
      logger.warn('Redis rate limiting failed, falling back to memory store:', error);
      throw error;
    }
  }

  async decrement(key: string): Promise<void> {
    const redisKey = `${this.prefix}:${key}`;
    
    try {
      const current = await cache.get(redisKey);
      if (current) {
        const hits = Math.max(0, parseInt(current, 10) - 1);
        if (hits === 0) {
          await cache.del(redisKey);
        } else {
          await cache.set(redisKey, hits.toString());
        }
      }
    } catch (error) {
      logger.warn('Redis rate limiting decrement failed:', error);
    }
  }

  async resetKey(key: string): Promise<void> {
    const redisKey = `${this.prefix}:${key}`;
    
    try {
      await cache.del(redisKey);
    } catch (error) {
      logger.warn('Redis rate limiting reset failed:', error);
    }
  }

  async resetAll(): Promise<void> {
    try {
      // This would need to be implemented based on your Redis setup
      // For now, we'll just log it
      logger.info('Rate limit store reset requested');
    } catch (error) {
      logger.warn('Redis rate limiting reset all failed:', error);
    }
  }
}

// Create rate limit store
const createRateLimitStore = (prefix: string, windowMs: number) => {
  try {
    return new RedisRateLimitStore(prefix, windowMs);
  } catch (error) {
    logger.warn('Redis not available for rate limiting, using memory store');
    return undefined; // Will use default memory store
  }
};

// Standard rate limiter for general API endpoints
export const generalRateLimiter = rateLimit({
  windowMs: config.windowMs,
  max: config.maxRequests,
  keyGenerator: createKeyGenerator('general'),
  store: createRateLimitStore('rate_limit:general', config.windowMs),
  message: {
    success: false,
    error: {
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded:', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      user: (req as any).user?.id,
    });

    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message: 'Too many requests, please try again later',
      },
    });
  },
  skip: config.skip,
});

// Strict rate limiter for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: config.windowMs,
  max: config.authMaxRequests,
  keyGenerator: createKeyGenerator('auth'),
  store: createRateLimitStore('rate_limit:auth', config.windowMs),
  message: {
    success: false,
    error: {
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many authentication attempts, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Auth rate limit exceeded:', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      body: { email: req.body?.email }, // Log email but not password
    });

    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message: 'Too many authentication attempts, please try again later',
      },
    });
  },
  skip: config.skip,
});

// Progressive delay middleware for repeated requests
export const progressiveDelay = (baseDelayMs: number = 1000, maxDelayMs: number = 30000) => {
  const delays = new Map<string, { count: number; lastRequest: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip}:${req.url}`;
    const now = Date.now();
    const entry = delays.get(key);

    if (entry) {
      const timeSinceLastRequest = now - entry.lastRequest;
      
      // Reset count if enough time has passed
      if (timeSinceLastRequest > 60000) { // 1 minute reset
        entry.count = 1;
      } else {
        entry.count++;
      }

      // Calculate delay based on request count
      const delay = Math.min(baseDelayMs * Math.pow(2, entry.count - 1), maxDelayMs);
      
      if (delay > 0) {
        logger.info('Progressive delay applied:', {
          ip: req.ip,
          url: req.url,
          count: entry.count,
          delay,
        });

        setTimeout(() => {
          next();
        }, delay);
      } else {
        next();
      }

      entry.lastRequest = now;
    } else {
      delays.set(key, { count: 1, lastRequest: now });
      next();
    }

    // Cleanup old entries
    if (delays.size > 10000) {
      const cutoff = now - 3600000; // 1 hour
      for (const [k, v] of delays.entries()) {
        if (v.lastRequest < cutoff) {
          delays.delete(k);
        }
      }
    }
  };
};

// Adaptive rate limiter that adjusts based on system load
export const adaptiveRateLimiter = (baseMax: number = 100) => {
  let currentMax = baseMax;
  let lastAdjustment = Date.now();

  return rateLimit({
    windowMs: config.windowMs,
    max: () => currentMax,
    keyGenerator: createKeyGenerator('adaptive'),
    store: createRateLimitStore('rate_limit:adaptive', config.windowMs),
    handler: (req: Request, res: Response) => {
      // Reduce limit on rate limit hits
      if (Date.now() - lastAdjustment > 60000) { // Adjust max once per minute
        currentMax = Math.max(10, Math.floor(currentMax * 0.8));
        lastAdjustment = Date.now();
        
        logger.info('Adaptive rate limit adjusted:', {
          newMax: currentMax,
          reason: 'rate_limit_hit',
        });
      }

      res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        error: {
          code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
          message: 'System under high load, please try again later',
        },
      });
    },
    onLimitReached: () => {
      // This fires when the limit is reached but before the handler
      logger.warn('Adaptive rate limit reached:', { currentMax });
    },
    skip: config.skip,
  });
};

// IP whitelist middleware
export const createIPWhitelist = (whitelist: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (whitelist.includes(clientIP || '')) {
      next();
    } else {
      logger.warn('IP not whitelisted:', { ip: clientIP, url: req.url });
      
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: ERROR_CODES.ACCESS_DENIED,
          message: 'Access denied from this IP address',
        },
      });
    }
  };
};

// User-specific rate limiter (requires authentication middleware first)
export const userRateLimiter = (maxRequestsPerUser: number = 1000) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: maxRequestsPerUser,
    keyGenerator: (req: Request) => {
      const user = (req as any).user;
      return user ? `user:${user.id}` : `ip:${req.ip}`;
    },
    store: createRateLimitStore('rate_limit:user', config.windowMs),
    handler: (req: Request, res: Response) => {
      logger.warn('User rate limit exceeded:', {
        user: (req as any).user?.id,
        ip: req.ip,
        url: req.url,
      });

      res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        error: {
          code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
          message: 'User request limit exceeded',
        },
      });
    },
    skip: config.skip,
  });
};

// Endpoint-specific rate limiters
export const dependencyRateLimiter = rateLimit({
  windowMs: config.windowMs,
  max: Math.floor(config.maxRequests / 2), // More restrictive for dependency operations
  keyGenerator: createKeyGenerator('dependency'),
  store: createRateLimitStore('rate_limit:dependency', config.windowMs),
  message: {
    success: false,
    error: {
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many dependency requests, please try again later',
    },
  },
  skip: config.skip,
});

export const notificationRateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // Very restrictive for notifications
  keyGenerator: createKeyGenerator('notification'),
  store: createRateLimitStore('rate_limit:notification', 60000),
  message: {
    success: false,
    error: {
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many notification requests',
    },
  },
  skip: config.skip,
});

// Rate limit status endpoint (for monitoring)
export const rateLimitStatus = async (req: Request, res: Response) => {
  try {
    // This would show current rate limit status
    // Implementation depends on your monitoring needs
    res.json({
      success: true,
      data: {
        windowMs: config.windowMs,
        maxRequests: config.maxRequests,
        authMaxRequests: config.authMaxRequests,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Rate limit status error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Failed to get rate limit status',
      },
    });
  }
};

// Default export combines general rate limiting
export default generalRateLimiter;


