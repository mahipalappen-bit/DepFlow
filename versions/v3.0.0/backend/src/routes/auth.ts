import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';
import { Notification } from '@/models/Notification';
import { 
  generateTokens, 
  verifyRefreshToken, 
  blacklistToken,
  authRateLimit,
  clearAuthRateLimit 
} from '@/middleware/auth';
import { authRateLimiter } from '@/middleware/rateLimiter';
import { 
  AppError, 
  AuthenticationError, 
  ValidationError,
  sendSuccess,
  sendError,
  catchAsync 
} from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { cache } from '@/config/redis';
import { HTTP_STATUS, ERROR_CODES } from '../../../shared/constants';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authRateLimiter);

// User registration endpoint
router.post('/register', catchAsync(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, teamIds } = req.body;

  // Validate required fields
  if (!email || !password || !firstName || !lastName) {
    throw new ValidationError('Email, password, first name, and last name are required');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Please provide a valid email address');
  }

  // Validate password strength
  const passwordValidation = User.validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new ValidationError('Password requirements not met', {
      requirements: passwordValidation.errors
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ 
    email: email.toLowerCase() 
  });

  if (existingUser) {
    throw new AppError(
      'User with this email already exists',
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.RESOURCE_ALREADY_EXISTS
    );
  }

  // Create new user
  const userData = {
    email: email.toLowerCase(),
    password,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    teamIds: teamIds || [],
    role: 'team_member', // Default role
    isActive: true,
    emailVerified: false, // In production, you'd send verification email
  };

  const user = await User.createUser(userData);

  // Generate tokens
  const tokens = await generateTokens(user);

  // Create welcome notification
  await Notification.createNotification({
    userId: user._id.toString(),
    type: 'system_alert',
    title: 'Welcome to Dependency Management!',
    message: 'Your account has been created successfully. Start by exploring your dashboard.',
    priority: 'medium',
    data: {
      actionUrl: '/dashboard',
    },
  });

  // Log successful registration
  logger.logAuth('User registered successfully', {
    userId: user._id.toString(),
    action: 'registration',
    success: true,
    email: user.email,
  });

  // Clear rate limit on successful registration
  await clearAuthRateLimit(req, res, () => {});

  sendSuccess(res, {
    user: user.getPublicProfile(),
    tokens,
  }, 'User registered successfully', HTTP_STATUS.CREATED);
}));

// User login endpoint
router.post('/login', catchAsync(async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Find user with password field included
  const user = await User.findOne({ 
    email: email.toLowerCase(),
    isActive: true 
  }).select('+password');

  if (!user) {
    // Log failed attempt
    logger.logAuth('Login failed - user not found', {
      action: 'login',
      success: false,
      email,
      ip: req.ip,
    });

    throw new AuthenticationError('Invalid email or password');
  }

  // Check if account is locked
  if (user.isAccountLocked()) {
    logger.logSecurity('Login attempt on locked account', {
      userId: user._id.toString(),
      action: 'login_locked_account',
      severity: 'high',
      email,
      ip: req.ip,
    });

    throw new AuthenticationError('Account is temporarily locked due to multiple failed login attempts');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    // Increment failed login attempts
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

    // Lock account after 5 failed attempts
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      logger.logSecurity('Account locked due to failed attempts', {
        userId: user._id.toString(),
        action: 'account_locked',
        severity: 'high',
        failedAttempts: user.failedLoginAttempts,
      });
    }

    await user.save();

    logger.logAuth('Login failed - invalid password', {
      userId: user._id.toString(),
      action: 'login',
      success: false,
      email,
      failedAttempts: user.failedLoginAttempts,
    });

    throw new AuthenticationError('Invalid email or password');
  }

  // Successful login - update user
  await user.updateLastLogin();

  // Generate tokens
  const tokens = await generateTokens(user);

  // Store session information
  const sessionKey = `user_session:${user._id}`;
  await cache.setJSON(sessionKey, {
    userId: user._id.toString(),
    email: user.email,
    loginTime: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    rememberMe: !!rememberMe,
  }, rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60); // 7 days if remember me, 24 hours otherwise

  // Log successful login
  logger.logAuth('User logged in successfully', {
    userId: user._id.toString(),
    action: 'login',
    success: true,
    email: user.email,
    rememberMe: !!rememberMe,
  });

  // Clear rate limit on successful login
  await clearAuthRateLimit(req, res, () => {});

  sendSuccess(res, {
    user: user.getPublicProfile(),
    tokens,
    session: {
      expiresIn: rememberMe ? '7d' : '24h',
      rememberMe: !!rememberMe,
    },
  }, 'Login successful');
}));

// Token refresh endpoint
router.post('/refresh', catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('Refresh token is required');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Check if refresh token exists in cache
  const refreshTokenKey = `refresh_token:${decoded.id}`;
  const storedTokenData = await cache.getJSON(refreshTokenKey);

  if (!storedTokenData || storedTokenData.token !== refreshToken) {
    logger.logSecurity('Invalid refresh token used', {
      userId: decoded.id,
      action: 'invalid_refresh_token',
      severity: 'medium',
      ip: req.ip,
    });

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

  logger.logAuth('Token refreshed successfully', {
    userId: user._id.toString(),
    action: 'token_refresh',
    success: true,
  });

  sendSuccess(res, {
    tokens,
    user: user.getPublicProfile(),
  }, 'Token refreshed successfully');
}));

// Logout endpoint
router.post('/logout', catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;

  if (token) {
    try {
      // Decode token to get user info and expiration
      const decoded = require('jsonwebtoken').decode(token) as any;
      
      if (decoded) {
        // Blacklist the access token
        await blacklistToken(token, decoded.exp);

        // Remove refresh token from cache
        const refreshTokenKey = `refresh_token:${decoded.id}`;
        await cache.del(refreshTokenKey);

        // Remove session data
        const sessionKey = `user_session:${decoded.id}`;
        await cache.del(sessionKey);

        logger.logAuth('User logged out successfully', {
          userId: decoded.id,
          action: 'logout',
          success: true,
        });
      }
    } catch (error) {
      logger.warn('Error during logout token handling:', error);
      // Continue with logout even if token handling fails
    }
  }

  sendSuccess(res, null, 'Logged out successfully');
}));

// Get current user endpoint
router.get('/me', catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;

  if (!token) {
    throw new AuthenticationError('Access token required');
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    // Get unread notification count
    const unreadNotificationCount = await Notification.getUnreadCount(user._id.toString());

    sendSuccess(res, {
      user: user.getPublicProfile(),
      unreadNotifications: unreadNotificationCount,
      session: {
        tokenIssuedAt: new Date(decoded.iat * 1000),
        tokenExpiresAt: new Date(decoded.exp * 1000),
      },
    }, 'User data retrieved successfully');

  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
}));

// Change password endpoint
router.post('/change-password', catchAsync(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;

  if (!token) {
    throw new AuthenticationError('Access token required');
  }

  if (!currentPassword || !newPassword) {
    throw new ValidationError('Current password and new password are required');
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await User.findById(decoded.id).select('+password');
    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      logger.logSecurity('Invalid current password during change attempt', {
        userId: user._id.toString(),
        action: 'password_change_failed',
        severity: 'medium',
      });

      throw new AuthenticationError('Current password is incorrect');
    }

    // Validate new password
    const passwordValidation = User.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new ValidationError('New password requirements not met', {
        requirements: passwordValidation.errors
      });
    }

    // Check if new password is different from current
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      throw new ValidationError('New password must be different from current password');
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    // Blacklist current token to force re-login
    await blacklistToken(token, decoded.exp);

    // Remove all refresh tokens for this user
    const refreshTokenKey = `refresh_token:${user._id}`;
    await cache.del(refreshTokenKey);

    // Create notification
    await Notification.createNotification({
      userId: user._id.toString(),
      type: 'system_alert',
      title: 'Password Changed',
      message: 'Your password has been changed successfully. Please log in again.',
      priority: 'high',
    });

    logger.logSecurity('Password changed successfully', {
      userId: user._id.toString(),
      action: 'password_change',
      severity: 'low',
    });

    sendSuccess(res, null, 'Password changed successfully. Please log in again.');

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AuthenticationError('Invalid or expired token');
  }
}));

// Forgot password endpoint (placeholder)
router.post('/forgot-password', catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError('Email is required');
  }

  // In production, this would:
  // 1. Generate a secure reset token
  // 2. Store it with expiration
  // 3. Send email with reset link
  // For now, we'll just log the attempt

  const user = await User.findOne({ 
    email: email.toLowerCase(),
    isActive: true 
  });

  // Always return success to prevent email enumeration
  sendSuccess(res, null, 'If an account with that email exists, a password reset link has been sent.');

  if (user) {
    logger.logAuth('Password reset requested', {
      userId: user._id.toString(),
      action: 'password_reset_request',
      success: true,
      email,
    });
  }
}));

// Reset password endpoint (placeholder)
router.post('/reset-password', catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ValidationError('Token and new password are required');
  }

  // In production, this would:
  // 1. Verify the reset token
  // 2. Check expiration
  // 3. Update the password
  // For now, we'll just return an error

  throw new AppError(
    'Password reset functionality not implemented in demo',
    HTTP_STATUS.NOT_FOUND,
    ERROR_CODES.RESOURCE_NOT_FOUND
  );
}));

// Account verification endpoint (placeholder)
router.post('/verify-email', catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new ValidationError('Verification token is required');
  }

  // In production, this would verify the email verification token
  throw new AppError(
    'Email verification functionality not implemented in demo',
    HTTP_STATUS.NOT_FOUND,
    ERROR_CODES.RESOURCE_NOT_FOUND
  );
}));

// Check authentication status
router.get('/status', catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;

  if (!token) {
    return sendSuccess(res, { 
      authenticated: false 
    }, 'Not authenticated');
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await User.findById(decoded.id);
    const isAuthenticated = !!(user && user.isActive);

    sendSuccess(res, {
      authenticated: isAuthenticated,
      tokenValid: true,
      expiresAt: new Date(decoded.exp * 1000),
      user: isAuthenticated ? user!.getPublicProfile() : null,
    }, 'Authentication status checked');

  } catch (error) {
    sendSuccess(res, {
      authenticated: false,
      tokenValid: false,
      error: 'Invalid or expired token',
    }, 'Authentication status checked');
  }
}));

export default router;


