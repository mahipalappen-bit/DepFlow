const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server: SocketIOServer } = require('socket.io');
const { sendNotificationEmail } = require('./email-service');

const app = express();
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
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
  max: 1000,
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

// In-memory data store
const inMemoryDB = {
  users: new Map(),
  teams: new Map(),
  dependencies: new Map(),
  notifications: new Map(),
  updateRequests: new Map(),
};

// Helper functions
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    'demo-secret-key',
    { expiresIn: '24h' }
  );
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Access token required' }
    });
  }

  try {
    const decoded = jwt.verify(token, 'demo-secret-key');
    const user = inMemoryDB.users.get(decoded.userId);
    
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

// Initialize demo data
const initializeDemoData = async () => {
  try {
    console.log('🌱 Initializing demo data...');

    // Create admin user
    const adminId = generateId();
    const adminUser = {
      id: adminId,
      email: 'admin@demo.com',
      password: await hashPassword('admin123456'),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      teamIds: [],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryDB.users.set(adminId, adminUser);

    // Create demo user
    const userId = generateId();
    const demoUser = {
      id: userId,
      email: 'user@demo.com',
      password: await hashPassword('user123456'),
      firstName: 'Demo',
      lastName: 'User',
      role: 'team_member',
      teamIds: [],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryDB.users.set(userId, demoUser);

    // Create teams
    const frontendTeamId = generateId();
    const frontendTeam = {
      id: frontendTeamId,
      name: 'Frontend Team',
      description: 'React and Next.js development team',
      memberIds: [userId],
      leadId: userId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryDB.teams.set(frontendTeamId, frontendTeam);

    const backendTeamId = generateId();
    const backendTeam = {
      id: backendTeamId,
      name: 'Backend Team',
      description: 'Node.js and API development team',
      memberIds: [userId],
      leadId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryDB.teams.set(backendTeamId, backendTeam);

    const devopsTeamId = generateId();
    const devopsTeam = {
      id: devopsTeamId,
      name: 'DevOps Team',
      description: 'Infrastructure and deployment team',
      memberIds: [userId],
      leadId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryDB.teams.set(devopsTeamId, devopsTeam);

    // Update demo user with team assignments
    demoUser.teamIds = [frontendTeamId, backendTeamId, devopsTeamId];

    // Create sample dependencies
    const dependencies = [
      {
        id: generateId(),
        name: 'react',
        version: '18.2.0',
        latestVersion: '18.2.0',
        description: 'A JavaScript library for building user interfaces',
        type: 'library',
        status: 'up_to_date',
        ownerTeamId: frontendTeamId,
        usedByTeamIds: [frontendTeamId],
        healthScore: 'healthy',
        lastChecked: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        name: 'express',
        version: '4.18.2',
        latestVersion: '4.18.2',
        description: 'Fast, unopinionated, minimalist web framework for Node.js',
        type: 'framework',
        status: 'up_to_date',
        ownerTeamId: backendTeamId,
        usedByTeamIds: [backendTeamId],
        healthScore: 'healthy',
        lastChecked: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        name: 'lodash',
        version: '4.17.15',
        latestVersion: '4.17.21',
        description: 'A modern JavaScript utility library',
        type: 'library',
        status: 'vulnerable',
        ownerTeamId: frontendTeamId,
        usedByTeamIds: [frontendTeamId, backendTeamId],
        healthScore: 'critical',
        lastChecked: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        name: 'webpack',
        version: '5.88.0',
        latestVersion: '5.89.0',
        description: 'A bundler for javascript and friends',
        type: 'tool',
        status: 'outdated',
        ownerTeamId: frontendTeamId,
        usedByTeamIds: [frontendTeamId],
        healthScore: 'warning',
        lastChecked: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        name: 'kubernetes',
        version: '1.28.0',
        latestVersion: '1.29.0',
        description: 'Container orchestration platform',
        type: 'service',
        status: 'outdated',
        ownerTeamId: devopsTeamId,
        usedByTeamIds: [devopsTeamId],
        healthScore: 'warning',
        lastChecked: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        name: 'typescript',
        version: '5.2.2',
        latestVersion: '5.3.0',
        description: 'TypeScript is a language for application scale JavaScript development',
        type: 'tool',
        status: 'outdated',
        ownerTeamId: frontendTeamId,
        usedByTeamIds: [frontendTeamId, backendTeamId],
        healthScore: 'warning',
        lastChecked: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    dependencies.forEach(dep => {
      inMemoryDB.dependencies.set(dep.id, dep);
    });

    // Create welcome notifications
    const notifications = [
      {
        id: generateId(),
        userId: adminId,
        type: 'system_alert',
        title: 'Welcome to Dependency Management!',
        message: 'Your admin account has been set up successfully. You can now manage dependencies across all teams.',
        priority: 'medium',
        isRead: false,
        data: { actionUrl: '/dashboard' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        userId: userId,
        type: 'vulnerability_alert',
        title: 'Security Alert: lodash vulnerability detected',
        message: 'A critical vulnerability was detected in lodash 4.17.15. Please update to version 4.17.21 or later.',
        priority: 'high',
        isRead: false,
        data: { 
          dependencyName: 'lodash',
          currentVersion: '4.17.15',
          recommendedVersion: '4.17.21',
          actionUrl: '/dependencies'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        userId: userId,
        type: 'dependency_update',
        title: 'Dependencies need updates',
        message: 'You have 4 dependencies that need updates. Review and create update requests.',
        priority: 'medium',
        isRead: false,
        data: { actionUrl: '/dependencies' },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    notifications.forEach(notif => {
      inMemoryDB.notifications.set(notif.id, notif);
    });

    console.log('✅ Demo data initialized successfully!');
    console.log(`👤 Users: ${inMemoryDB.users.size}`);
    console.log(`👥 Teams: ${inMemoryDB.teams.size}`);
    console.log(`📦 Dependencies: ${inMemoryDB.dependencies.size}`);
    console.log(`📬 Notifications: ${inMemoryDB.notifications.size}`);

  } catch (error) {
    console.error('❌ Failed to initialize demo data:', error);
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
      database: 'in-memory (demo mode)',
      version: '1.0.0',
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

    // Find user by email
    const user = Array.from(inMemoryDB.users.values()).find(u => u.email === email && u.isActive);
    
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const accessToken = generateToken(user.id, user.email, user.role);
    const refreshToken = generateToken(user.id, user.email, user.role);

    const { password: userPassword, ...userResponse } = user;

    res.json({
      success: true,
      data: {
        user: userResponse,
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

    const existingUser = Array.from(inMemoryDB.users.values()).find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User with this email already exists' }
      });
    }

    const userId = generateId();
    const hashedPassword = await hashPassword(password);
    
    const newUser = {
      id: userId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'team_member',
      teamIds: [],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryDB.users.set(userId, newUser);

    const accessToken = generateToken(userId, email, 'team_member');
    const refreshToken = generateToken(userId, email, 'team_member');

    const { password: newUserPassword, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
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

app.get('/api/v1/auth/me', authenticateToken, (req, res) => {
  const { password, ...userResponse } = req.user;
  
  res.json({
    success: true,
    data: {
      user: userResponse,
    },
  });
});

// Dependencies routes
app.get('/api/v1/dependencies', authenticateToken, (req, res) => {
  try {
    const dependencies = Array.from(inMemoryDB.dependencies.values())
      .map(dep => {
        const ownerTeam = inMemoryDB.teams.get(dep.ownerTeamId);
        const usedByTeams = dep.usedByTeamIds.map(teamId => inMemoryDB.teams.get(teamId)).filter(Boolean);
        
        return {
          ...dep,
          ownerTeam: ownerTeam ? { id: ownerTeam.id, name: ownerTeam.name } : null,
          usedByTeams: usedByTeams.map(team => ({ id: team.id, name: team.name }))
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      data: { 
        dependencies,
        total: dependencies.length,
        pagination: {
          page: 1,
          limit: 50,
          total: dependencies.length,
        }
      },
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
app.get('/api/v1/teams', authenticateToken, (req, res) => {
  try {
    const teams = Array.from(inMemoryDB.teams.values())
      .filter(team => team.isActive)
      .map(team => {
        const members = team.memberIds
          .map(memberId => inMemoryDB.users.get(memberId))
          .filter(Boolean)
          .map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }));
        
        const lead = team.leadId ? inMemoryDB.users.get(team.leadId) : null;
        
        return {
          ...team,
          members,
          lead: lead ? {
            id: lead.id,
            firstName: lead.firstName,
            lastName: lead.lastName,
            email: lead.email
          } : null
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

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
app.get('/api/v1/notifications', authenticateToken, (req, res) => {
  try {
    const notifications = Array.from(inMemoryDB.notifications.values())
      .filter(notification => notification.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);

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

app.get('/api/v1/notifications/unread-count', authenticateToken, (req, res) => {
  try {
    const count = Array.from(inMemoryDB.notifications.values())
      .filter(notification => notification.userId === req.user.id && !notification.isRead)
      .length;

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

app.put('/api/v1/notifications/:id/read', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const notification = inMemoryDB.notifications.get(id);
    
    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Notification not found' }
      });
    }

    notification.isRead = true;
    notification.updatedAt = new Date();
    inMemoryDB.notifications.set(id, notification);

    res.json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
});

// Email routes
app.post('/api/v1/send-email', authenticateToken, async (req, res) => {
  try {
    const { type, dependency, user } = req.body;
    
    // Validate required fields
    if (!type || !dependency || !user) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: type, dependency, user'
      });
    }
    
    console.log(`📧 Sending email notification: ${type} for dependency "${dependency.name}"`);
    
    // Send email notification
    const emailResult = await sendNotificationEmail(type, dependency, user);
    
    if (emailResult.success) {
      console.log(`✅ Email sent successfully: ${emailResult.messageId}`);
      res.json({
        success: true,
        message: 'Email notification sent successfully',
        messageId: emailResult.messageId
      });
    } else {
      console.error(`❌ Email sending failed: ${emailResult.error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to send email notification',
        error: emailResult.error
      });
    }
    
  } catch (error) {
    console.error('❌ Email API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending email',
      error: error.message
    });
  }
});

// Analytics routes
app.get('/api/v1/analytics/dashboard', authenticateToken, (req, res) => {
  try {
    const dependencies = Array.from(inMemoryDB.dependencies.values());
    const teams = Array.from(inMemoryDB.teams.values()).filter(team => team.isActive);
    const users = Array.from(inMemoryDB.users.values()).filter(user => user.isActive);

    const totalDependencies = dependencies.length;
    const healthyDependencies = dependencies.filter(dep => dep.status === 'up_to_date').length;
    const outdatedDependencies = dependencies.filter(dep => dep.status === 'outdated').length;
    const vulnerableDependencies = dependencies.filter(dep => dep.status === 'vulnerable').length;
    
    const healthScore = Math.round((healthyDependencies / Math.max(totalDependencies, 1)) * 100);

    res.json({
      success: true,
      data: {
        overview: {
          totalDependencies,
          healthyDependencies,
          outdatedDependencies,
          vulnerableDependencies,
          totalTeams: teams.length,
          totalUsers: users.length,
          healthScore,
        },
        teamStats: teams.map(team => ({
          id: team.id,
          name: team.name,
          dependencyCount: dependencies.filter(dep => 
            dep.ownerTeamId === team.id || dep.usedByTeamIds.includes(team.id)
          ).length,
          memberCount: team.memberIds.length,
          healthScore: Math.floor(Math.random() * 20) + 80,
        })),
        healthTrends: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          healthy: [89, 92, 88, 91, 87, 90, healthScore],
          warning: [8, 6, 9, 7, 10, 8, Math.floor(outdatedDependencies / totalDependencies * 100)],
          critical: [3, 2, 3, 2, 3, 2, Math.floor(vulnerableDependencies / totalDependencies * 100)],
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
  console.log('📡 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('📡 Client disconnected:', socket.id);
  });

  socket.emit('notification', {
    type: 'connection',
    message: 'Connected to real-time updates',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
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

// Start server
const startServer = async () => {
  try {
    await initializeDemoData();

    const PORT = process.env.PORT || 8000;
    httpServer.listen(PORT, () => {
      console.log('🚀 Dependency Management Backend Server Started!');
      console.log('='.repeat(50));
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/v1/health`);
      console.log(`📊 Mode: Demo (in-memory database)`);
      console.log('='.repeat(50));
    console.log('🔐 Demo Credentials:');
    console.log('   👑 Admin: admin@demo.com / admin123456');
    console.log('   👤 User:  user@demo.com / user123456');
    console.log('📧 Email: mahipal.appen@gmail.com → mmahipal.reddy@gmail.com');
    console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}


