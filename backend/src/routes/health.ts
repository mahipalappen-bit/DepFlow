import { Router, Request, Response } from 'express';
import { databaseHealthCheck } from '@/config/database';
import { redisHealthCheck } from '@/config/redis';
import { getJobStatus } from '@/services/backgroundJobs';
import { logger } from '@/utils/logger';
import { HTTP_STATUS } from '../../../shared/constants';

const router = Router();

// Basic health check endpoint
router.get('/', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      responseTime: 0,
      services: {} as any,
    };

    // Check database health
    try {
      const dbHealth = await databaseHealthCheck();
      health.services.database = dbHealth;
    } catch (error) {
      health.services.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Database check failed',
      };
      health.status = 'degraded';
    }

    // Check Redis health
    try {
      const redisHealth = await redisHealthCheck();
      health.services.redis = redisHealth;
    } catch (error) {
      health.services.redis = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Redis check failed',
      };
      // Redis is optional, so don't mark as degraded
    }

    // Check background jobs status
    try {
      const jobsStatus = getJobStatus();
      health.services.backgroundJobs = {
        status: 'healthy',
        details: {
          totalJobs: jobsStatus.length,
          runningJobs: jobsStatus.filter(job => job.running).length,
          jobs: jobsStatus.slice(0, 3), // Show first 3 jobs only
        },
      };
    } catch (error) {
      health.services.backgroundJobs = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Jobs check failed',
      };
    }

    // Calculate response time
    health.responseTime = Date.now() - startTime;

    // Determine overall status
    const serviceStatuses = Object.values(health.services).map((service: any) => service.status);
    if (serviceStatuses.includes('unhealthy')) {
      health.status = 'unhealthy';
    } else if (serviceStatuses.includes('degraded')) {
      health.status = 'degraded';
    }

    // Return appropriate HTTP status code
    const httpStatus = health.status === 'healthy' ? HTTP_STATUS.OK : 
                      health.status === 'degraded' ? HTTP_STATUS.OK : 
                      HTTP_STATUS.SERVICE_UNAVAILABLE;

    res.status(httpStatus).json(health);

  } catch (error) {
    logger.error('Health check failed:', error);
    
    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Health check failed',
      responseTime: Date.now() - startTime,
    });
  }
});

// Detailed health check endpoint
router.get('/detailed', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        version: {
          node: process.version,
          npm: process.env.npm_package_version || '1.0.0',
          app: '1.0.0',
        },
        environment: process.env.NODE_ENV || 'development',
        platform: process.platform,
        arch: process.arch,
      },
      services: {} as any,
      metrics: {} as any,
    };

    // Database detailed check
    try {
      const dbHealth = await databaseHealthCheck();
      detailedHealth.services.database = {
        ...dbHealth,
        collections: {
          // Add collection counts if needed
        },
      };
    } catch (error) {
      detailedHealth.services.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Database check failed',
      };
      detailedHealth.status = 'unhealthy';
    }

    // Redis detailed check
    try {
      const redisHealth = await redisHealthCheck();
      detailedHealth.services.redis = redisHealth;
    } catch (error) {
      detailedHealth.services.redis = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Redis check failed',
      };
    }

    // Background jobs detailed status
    try {
      const jobsStatus = getJobStatus();
      detailedHealth.services.backgroundJobs = {
        status: 'healthy',
        details: {
          totalJobs: jobsStatus.length,
          runningJobs: jobsStatus.filter(job => job.running).length,
          jobs: jobsStatus,
        },
      };
    } catch (error) {
      detailedHealth.services.backgroundJobs = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Jobs check failed',
      };
    }

    // Add application metrics
    detailedHealth.metrics = {
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };

    // Determine overall status
    const serviceStatuses = Object.values(detailedHealth.services).map((service: any) => service.status);
    if (serviceStatuses.includes('unhealthy')) {
      detailedHealth.status = 'unhealthy';
    } else if (serviceStatuses.includes('degraded')) {
      detailedHealth.status = 'degraded';
    }

    const httpStatus = detailedHealth.status === 'healthy' ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;
    res.status(httpStatus).json(detailedHealth);

  } catch (error) {
    logger.error('Detailed health check failed:', error);
    
    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Detailed health check failed',
      responseTime: Date.now() - startTime,
    });
  }
});

// Readiness probe (for Kubernetes)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check if application is ready to serve traffic
    const dbHealth = await databaseHealthCheck();
    
    if (dbHealth.status === 'healthy') {
      res.status(HTTP_STATUS.OK).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        status: 'not_ready',
        reason: 'Database not available',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      status: 'not_ready',
      reason: error instanceof Error ? error.message : 'Readiness check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// Liveness probe (for Kubernetes)
router.get('/live', (req: Request, res: Response) => {
  // Simple liveness check - if the process is running, it's alive
  res.status(HTTP_STATUS.OK).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Startup probe (for Kubernetes)
router.get('/startup', async (req: Request, res: Response) => {
  try {
    // Check if application has completed startup
    const dbHealth = await databaseHealthCheck();
    
    if (dbHealth.status === 'healthy') {
      res.status(HTTP_STATUS.OK).json({
        status: 'started',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    } else {
      res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        status: 'starting',
        reason: 'Still initializing services',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      status: 'starting',
      reason: error instanceof Error ? error.message : 'Startup check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// Version endpoint
router.get('/version', (req: Request, res: Response) => {
  res.json({
    version: process.env.npm_package_version || '1.0.0',
    name: 'Dependency Management API',
    node: process.version,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    commit: process.env.GIT_COMMIT || 'unknown',
    buildDate: process.env.BUILD_DATE || 'unknown',
  });
});

// Metrics endpoint (basic)
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      system: {
        loadavg: require('os').loadavg(),
        freemem: require('os').freemem(),
        totalmem: require('os').totalmem(),
        platform: process.platform,
        arch: process.arch,
      },
      process: {
        pid: process.pid,
        ppid: process.ppid,
        uid: process.getuid ? process.getuid() : null,
        gid: process.getgid ? process.getgid() : null,
        cwd: process.cwd(),
        execPath: process.execPath,
        argv: process.argv,
      },
    };

    res.json(metrics);
  } catch (error) {
    logger.error('Metrics endpoint failed:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to collect metrics',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;


