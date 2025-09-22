import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import simplified models
import User, { IUser } from './models/simple/User';
import Team, { ITeam } from './models/simple/Team';
import Dependency, { IDependency } from './models/simple/Dependency';
import Notification, { INotification } from './models/simple/Notification';

const app = express();
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.',
    },
  },
});
app.use('/api/', limiter);

// Socket.IO setup
const io = new SocketIOServer(httpServer, {
  cors: corsOptions,
});

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Access token required' }
    });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found or inactive' }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
    });
  }
};

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/dependency_management';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// API Routes

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// Auth routes
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Email and password are required' }
      });
    }

    const user = await User.findOne({ email, isActive: true });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' }
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile(),
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'All fields are required' }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User already exists' }
      });
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: 'team_member',
      emailVerified: true, // Simplified for demo
    });

    await user.save();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json({
      success: true,
      data: {
        user: user.getPublicProfile(),
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
});

app.get('/api/v1/auth/me', authenticateToken, (req: any, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.getPublicProfile(),
    },
  });
});

// Dependencies routes
app.get('/api/v1/dependencies', authenticateToken, async (req: any, res) => {
  try {
    const dependencies = await Dependency.find()
      .populate('ownerTeamId', 'name')
      .populate('usedByTeamIds', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { dependencies },
    });
  } catch (error) {
    console.error('Get dependencies error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
});

// Teams routes
app.get('/api/v1/teams', authenticateToken, async (req: any, res) => {
  try {
    const teams = await Team.find({ isActive: true })
      .populate('memberIds', 'firstName lastName email')
      .populate('leadId', 'firstName lastName email')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: { teams },
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
});

// Notifications routes
app.get('/api/v1/notifications', authenticateToken, async (req: any, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: { notifications },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
});

app.get('/api/v1/notifications/unread-count', authenticateToken, async (req: any, res) => {
  try {
    const count = await Notification.countDocuments({ 
      userId: req.user._id, 
      isRead: false 
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
});

// Analytics routes
app.get('/api/v1/analytics/dashboard', authenticateToken, async (req: any, res) => {
  try {
    const [
      totalDependencies,
      healthyDependencies,
      outdatedDependencies,
      vulnerableDependencies,
      totalTeams,
      totalUsers,
    ] = await Promise.all([
      Dependency.countDocuments(),
      Dependency.countDocuments({ status: 'up_to_date' }),
      Dependency.countDocuments({ status: 'outdated' }),
      Dependency.countDocuments({ status: 'vulnerable' }),
      Team.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalDependencies,
          healthyDependencies,
          outdatedDependencies,
          vulnerableDependencies,
          totalTeams,
          totalUsers,
          healthScore: Math.round((healthyDependencies / Math.max(totalDependencies, 1)) * 100),
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' }
  });
});

// Seed database function
const seedDatabase = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@demo.com' });
    if (adminExists) {
      console.log('🌱 Database already seeded');
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@demo.com',
      password: 'admin123456',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      emailVerified: true,
    });
    await adminUser.save();

    // Create demo user
    const demoUser = new User({
      email: 'user@demo.com',
      password: 'user123456',
      firstName: 'Demo',
      lastName: 'User',
      role: 'team_member',
      emailVerified: true,
    });
    await demoUser.save();

    // Create teams
    const frontendTeam = new Team({
      name: 'Frontend Team',
      description: 'React and Next.js development team',
      memberIds: [demoUser._id],
      leadId: demoUser._id,
    });
    await frontendTeam.save();

    const backendTeam = new Team({
      name: 'Backend Team',
      description: 'Node.js and API development team',
      memberIds: [demoUser._id],
    });
    await backendTeam.save();

    // Update demo user with team assignments
    demoUser.teamIds = [frontendTeam._id, backendTeam._id];
    await demoUser.save();

    // Create sample dependencies
    const dependencies = [
      {
        name: 'react',
        version: '18.2.0',
        latestVersion: '18.2.0',
        description: 'A JavaScript library for building user interfaces',
        type: 'library',
        status: 'up_to_date',
        ownerTeamId: frontendTeam._id,
        usedByTeamIds: [frontendTeam._id],
        healthScore: 'healthy',
      },
      {
        name: 'express',
        version: '4.18.2',
        latestVersion: '4.18.2',
        description: 'Fast, unopinionated, minimalist web framework',
        type: 'framework',
        status: 'up_to_date',
        ownerTeamId: backendTeam._id,
        usedByTeamIds: [backendTeam._id],
        healthScore: 'healthy',
      },
      {
        name: 'lodash',
        version: '4.17.15',
        latestVersion: '4.17.21',
        description: 'A modern JavaScript utility library',
        type: 'library',
        status: 'vulnerable',
        ownerTeamId: frontendTeam._id,
        usedByTeamIds: [frontendTeam._id, backendTeam._id],
        healthScore: 'critical',
      },
    ];

    for (const dep of dependencies) {
      const dependency = new Dependency(dep);
      await dependency.save();
    }

    // Create welcome notifications
    const welcomeNotifications = [
      {
        userId: adminUser._id,
        type: 'system_alert',
        title: 'Welcome to Dependency Management!',
        message: 'Your admin account has been set up successfully.',
        priority: 'medium',
      },
      {
        userId: demoUser._id,
        type: 'vulnerability_alert',
        title: 'Security Alert: lodash vulnerability',
        message: 'A critical vulnerability was detected in lodash 4.17.15',
        priority: 'high',
      },
    ];

    for (const notif of welcomeNotifications) {
      const notification = new Notification(notif);
      await notification.save();
    }

    console.log('🌱 Database seeded successfully!');
    console.log('🔐 Demo credentials:');
    console.log('   Admin: admin@demo.com / admin123456');
    console.log('   User:  user@demo.com / user123456');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`🌐 API: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export default app;


