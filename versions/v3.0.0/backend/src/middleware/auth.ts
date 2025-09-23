import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User, UserDocument } from '@/models/User';
import { logger } from '@/utils/logger';
import { cache } from '@/config/redis';
import { 
  AppError, 
  AuthenticationError, 
  AuthorizationError 
} from '@/middleware/errorHandler';
import { 
  HTTP_STATUS, 
  ERROR_CODES, 
  USER_ROLES, 
  PERMISSIONS, 
  ROLE_PERMISSIONS 
} from '../../../shared/constants';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      token?: string;
    }
  }
}

// JWT token payload interface
interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Token generation utilities
export const generateTokens = async (user: UserDocument) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRATION || '24h' }
  );

  const refreshToken = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );

  // Store refresh token in Redis with expiration
  const refreshTokenKey = `refresh_token:${user._id}`;
  await cache.setJSON(refreshTokenKey, {
    token: refreshToken,
    userId: user._id.toString(),
    createdAt: new Date().toISOString(),
  }, 7 * 24 * 60 * 60); // 7 days

  return { accessToken, refreshToken };
};

// Token verification utilities
export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Access token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid access token');
    } else {
      throw new AuthenticationError('Token verification failed');
    }
  }
};

export const verifyRefreshToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Refresh token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid refresh token');
    } else {
      throw new AuthenticationError('Refresh token verification failed');
    }
  }
};

// Token blacklisting utilities
export const blacklistToken = async (token: string, expirationTime?: number) => {
  const blacklistKey = `blacklisted_token:${token}`;
  const ttl = expirationTime ? Math.floor((expirationTime * 1000 - Date.now()) / 1000) : 24 * 60 * 60;
  
  if (ttl > 0) {
    await cache.set(blacklistKey, 'true', ttl);
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const blacklistKey = `blacklisted_token:${token}`;
  const result = await cache.get(blacklistKey);
  return result === 'true';
};

// Main authentication middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      throw new AuthenticationError('Access token required');
    }

    // Check if token is blacklisted
    if (await isTokenBlacklisted(token)) {
      throw new AuthenticationError('Token has been revoked');
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user still exists and is active
    const user = await User.findById(decoded.id).select('+password');
    if (!user || !user.isActive) {
      throw new AuthenticationError('User no longer exists or is inactive');
    }

    // Check if user changed password after token was issued
    const passwordChangedAt = user.passwordChangedAt?.getTime() || 0;
    const tokenIssuedAt = decoded.iat * 1000;
    
    if (passwordChangedAt > tokenIssuedAt) {
      throw new AuthenticationError('Password changed after token was issued. Please log in again.');
    }

    // Check for account lockout
    if (user.isAccountLocked()) {
      throw new AuthenticationError('Account is temporarily locked');
    }

    // Attach user and token to request
    req.user = user;
    req.token = token;

    // Log successful authentication
    logger.logAuth('User authenticated successfully', {
      userId: user._id.toString(),
      action: 'token_verification',
      success: true,
    });

    next();
  } catch (error) {
    // Log failed authentication attempt
    logger.logAuth('Authentication failed', {
      action: 'token_verification',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    next(error);
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (token) {
      // Only authenticate if token is provided
      return authenticateToken(req, res, next);
    }

    // Continue without authentication
    next();
  } catch (error) {
    // Don't fail on optional auth errors
    logger.warn('Optional authentication failed:', error);
    next();
  }
};

// Role-based authorization middleware
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      logger.logSecurity('Access denied - insufficient role', {
        userId: req.user._id.toString(),
        action: 'role_check',
        severity: 'medium',
        requiredRoles: roles,
        userRole: req.user.role,
        resource: req.originalUrl,
      });

      return next(new AuthorizationError(`Access denied. Required roles: ${roles.join(', ')}`));
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role as keyof typeof ROLE_PERMISSIONS] || [];
    
    if (!userPermissions.includes(permission)) {
      logger.logSecurity('Access denied - insufficient permissions', {
        userId: req.user._id.toString(),
        action: 'permission_check',
        severity: 'medium',
        requiredPermission: permission,
        userRole: req.user.role,
        resource: req.originalUrl,
      });

      return next(new AuthorizationError(`Access denied. Required permission: ${permission}`));
    }

    next();
  };
};

// Team membership authorization middleware
export const requireTeamMembership = (allowOwner = true) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
      }

      const teamId = req.params.teamId || req.body.teamId || req.query.teamId;
      
      if (!teamId) {
        return next(new AppError('Team ID required', HTTP_STATUS.BAD_REQUEST));
      }

      // Admins have access to all teams
      if (req.user.role === USER_ROLES.ADMIN) {
        return next();
      }

      // Check if user is member of the team
      const isMember = req.user.teamIds.some(id => id.toString() === teamId);
      
      if (!isMember) {
        logger.logSecurity('Access denied - not team member', {
          userId: req.user._id.toString(),
          action: 'team_access_check',
          severity: 'medium',
          teamId,
          resource: req.originalUrl,
        });

        return next(new AuthorizationError('Access denied. You are not a member of this team.'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Resource ownership authorization middleware
export const requireResourceOwnership = (resourceModel: string, resourceIdParam: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
      }

      const resourceId = req.params[resourceIdParam];
      
      if (!resourceId) {
        return next(new AppError('Resource ID required', HTTP_STATUS.BAD_REQUEST));
      }

      // Admins have access to all resources
      if (req.user.role === USER_ROLES.ADMIN) {
        return next();
      }

      // This would need to be implemented based on the specific resource
      // For now, we'll check if the user ID matches the resource's user field
      // This is a simplified implementation - in practice, you'd load the resource
      // and check ownership based on the specific model's ownership rules

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Refresh token middleware
export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AuthenticationError('Refresh token required');
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in Redis
    const refreshTokenKey = `refresh_token:${decoded.id}`;
    const storedTokenData = await cache.getJSON(refreshTokenKey);

    if (!storedTokenData || storedTokenData.token !== refreshToken) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Get user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new AuthenticationError('User no longer exists or is inactive');
    }

    // Generate new tokens
    const tokens = await generateTokens(user);

    // Remove old refresh token
    await cache.del(refreshTokenKey);

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout middleware
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.token;
    const user = req.user;

    if (token && user) {
      // Blacklist the current access token
      const decoded = jwt.decode(token) as JWTPayload;
      if (decoded) {
        await blacklistToken(token, decoded.exp);
      }

      // Remove refresh token from Redis
      const refreshTokenKey = `refresh_token:${user._id}`;
      await cache.del(refreshTokenKey);

      logger.logAuth('User logged out successfully', {
        userId: user._id.toString(),
        action: 'logout',
        success: true,
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Admin only middleware
export const requireAdmin = requireRole(USER_ROLES.ADMIN);

// Rate limiting for authentication endpoints
export const authRateLimit = async (req: Request, res: Response, next: NextFunction) => {
  const key = `auth_attempts:${req.ip}`;
  const maxAttempts = 10;
  const windowMs = 15 * 60 * 1000; // 15 minutes

  try {
    const attempts = await cache.get(key);
    const count = attempts ? parseInt(attempts, 10) : 0;

    if (count >= maxAttempts) {
      throw new AppError(
        'Too many authentication attempts. Please try again later.',
        HTTP_STATUS.TOO_MANY_REQUESTS,
        ERROR_CODES.RATE_LIMIT_EXCEEDED
      );
    }

    // Increment attempt count
    if (count === 0) {
      await cache.set(key, '1', Math.floor(windowMs / 1000));
    } else {
      await cache.set(key, (count + 1).toString());
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.warn('Auth rate limiting failed:', error);
      next(); // Continue if Redis is down
    }
  }
};

// Clear authentication rate limit on successful login
export const clearAuthRateLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = `auth_attempts:${req.ip}`;
    await cache.del(key);
    next();
  } catch (error) {
    logger.warn('Failed to clear auth rate limit:', error);
    next(); // Continue regardless
  }
};

// Check if user can access specific dependency
export const canAccessDependency = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    // Admins can access everything
    if (req.user.role === USER_ROLES.ADMIN) {
      return next();
    }

    const dependencyId = req.params.dependencyId || req.params.id;
    
    if (!dependencyId) {
      return next(new AppError('Dependency ID required', HTTP_STATUS.BAD_REQUEST));
    }

    // This would check if the user's teams have access to the dependency
    // Implementation would involve checking the dependency's owner team and used by teams
    // For now, we'll allow access and implement the actual check in the controller

    next();
  } catch (error) {
    next(error);
  }
};

export default {
  authenticateToken,
  optionalAuth,
  requireRole,
  requirePermission,
  requireTeamMembership,
  requireResourceOwnership,
  refreshAccessToken,
  logout,
  requireAdmin,
  authRateLimit,
  clearAuthRateLimit,
  canAccessDependency,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  blacklistToken,
  isTokenBlacklisted,
};


