import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

// Import configuration and utilities
import { connectDatabase } from '@/config/database';
import { connectRedis } from '@/config/redis';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { rateLimiter } from '@/middleware/rateLimiter';
import { authMiddleware } from '@/middleware/auth';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import teamRoutes from '@/routes/teams';
import dependencyRoutes from '@/routes/dependencies';
import requestRoutes from '@/routes/requests';
import notificationRoutes from '@/routes/notifications';
import analyticsRoutes from '@/routes/analytics';
import healthRoutes from '@/routes/health';

// Import WebSocket configuration
import { configureWebSocket } from '@/config/websocket';

// Import background jobs
import { startBackgroundJobs } from '@/services/backgroundJobs';

class Server {
  private app: express.Application;
  private httpServer: any;
  private io: SocketServer;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '5000', 10);
    
    // Create HTTP server
    this.httpServer = createServer(this.app);
    
    // Initialize Socket.IO
    this.io = new SocketServer(this.httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
      },
    });
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await connectDatabase();
      logger.info('Database connection established successfully');
      
      if (process.env.REDIS_URL) {
        await connectRedis();
        logger.info('Redis connection established successfully');
      }
    } catch (error) {
      logger.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  private configureMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", 'ws:', 'wss:'],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Compression and parsing
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan(process.env.LOG_FORMAT || 'combined', {
        stream: { write: (message) => logger.info(message.trim()) }
      }));
    }

    // Rate limiting
    this.app.use(rateLimiter);

    // Make Socket.IO available in routes
    this.app.use((req, res, next) => {
      (req as any).io = this.io;
      next();
    });
  }

  private configureRoutes(): void {
    const apiPrefix = '/api/v1';

    // Health check route (no auth required)
    this.app.use(`${apiPrefix}/health`, healthRoutes);

    // Authentication routes (no auth required)
    this.app.use(`${apiPrefix}/auth`, authRoutes);

    // Protected routes (auth required)
    this.app.use(`${apiPrefix}/users`, authMiddleware, userRoutes);
    this.app.use(`${apiPrefix}/teams`, authMiddleware, teamRoutes);
    this.app.use(`${apiPrefix}/dependencies`, authMiddleware, dependencyRoutes);
    this.app.use(`${apiPrefix}/requests`, authMiddleware, requestRoutes);
    this.app.use(`${apiPrefix}/notifications`, authMiddleware, notificationRoutes);
    this.app.use(`${apiPrefix}/analytics`, authMiddleware, analyticsRoutes);

    // Serve uploaded files (with auth)
    this.app.use('/uploads', authMiddleware, express.static(path.join(__dirname, '../uploads')));

    // Default route
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Dependency Management API Server',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
      });
    });

    // 404 handler for undefined routes
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'ROUTE_NOT_FOUND',
          message: `Route ${req.method} ${req.originalUrl} not found`,
        },
      });
    });

    // Global error handler (must be last)
    this.app.use(errorHandler);
  }

  private configureWebSocket(): void {
    configureWebSocket(this.io);
  }

  private startBackgroundJobs(): void {
    if (process.env.NODE_ENV !== 'test') {
      startBackgroundJobs();
      logger.info('Background jobs started');
    }
  }

  private gracefulShutdown(): void {
    const signals = ['SIGTERM', 'SIGINT'];

    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, starting graceful shutdown`);

        // Close HTTP server
        this.httpServer.close(() => {
          logger.info('HTTP server closed');
        });

        // Close Socket.IO server
        this.io.close(() => {
          logger.info('Socket.IO server closed');
        });

        // Give time for connections to close
        setTimeout(() => {
          logger.info('Graceful shutdown completed');
          process.exit(0);
        }, 5000);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled promise rejection:', { reason, promise });
      process.exit(1);
    });
  }

  public async start(): Promise<void> {
    try {
      // Initialize database connections
      await this.initializeDatabase();

      // Configure middleware
      this.configureMiddleware();

      // Configure routes
      this.configureRoutes();

      // Configure WebSocket
      this.configureWebSocket();

      // Start background jobs
      this.startBackgroundJobs();

      // Setup graceful shutdown
      this.gracefulShutdown();

      // Start the server
      this.httpServer.listen(this.port, () => {
        logger.info(`
🚀 Dependency Management Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server URL: http://localhost:${this.port}
🏥 Health Check: http://localhost:${this.port}/api/v1/health
📡 Socket.IO: Enabled
🗄️  Database: Connected
📊 Redis Cache: ${process.env.REDIS_URL ? 'Enabled' : 'Disabled'}
🔒 Security: Enabled
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);
      });

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  // Getter methods for testing
  public getApp(): express.Application {
    return this.app;
  }

  public getHttpServer(): any {
    return this.httpServer;
  }

  public getSocketServer(): SocketServer {
    return this.io;
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new Server();
  server.start().catch((error) => {
    logger.error('Failed to start application:', error);
    process.exit(1);
  });
}

export { Server };
export default Server;


