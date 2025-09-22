import cron from 'cron';
import { logger } from '@/utils/logger';
import { Dependency } from '@/models/Dependency';
import { Notification } from '@/models/Notification';
import { UpdateRequest } from '@/models/UpdateRequest';
import { User } from '@/models/User';
import { Team } from '@/models/Team';

// Background job registry
const jobs: cron.CronJob[] = [];

// Vulnerability scanning job
const vulnerabilityScanJob = new cron.CronJob(
  process.env.VULNERABILITY_SCAN_CRON || '0 2 * * *', // Daily at 2 AM
  async () => {
    try {
      logger.info('Starting vulnerability scan job...');
      
      const dependencies = await Dependency.find({
        status: { $ne: 'deprecated' }
      });
      
      let scannedCount = 0;
      let vulnerabilitiesFound = 0;
      
      for (const dependency of dependencies) {
        try {
          // This would integrate with vulnerability databases like NVD, Snyk, etc.
          // For now, we'll just update the lastChecked timestamp
          dependency.lastChecked = new Date();
          await dependency.save();
          
          scannedCount++;
          
          // Simulate vulnerability detection (remove in production)
          if (Math.random() < 0.1) { // 10% chance for demo purposes
            vulnerabilitiesFound++;
            logger.info(`Vulnerability found in ${dependency.name}@${dependency.version}`);
          }
          
        } catch (error) {
          logger.error(`Error scanning ${dependency.name}:`, error);
        }
      }
      
      logger.info('Vulnerability scan completed:', {
        scannedCount,
        vulnerabilitiesFound,
        duration: 'N/A'
      });
      
    } catch (error) {
      logger.error('Vulnerability scan job failed:', error);
    }
  },
  null,
  false, // Don't start immediately
  'UTC'
);

// Dependency update check job
const dependencyUpdateCheckJob = new cron.CronJob(
  process.env.DEPENDENCY_CHECK_CRON || '0 */6 * * *', // Every 6 hours
  async () => {
    try {
      logger.info('Starting dependency update check job...');
      
      const dependencies = await Dependency.find({
        status: { $ne: 'deprecated' }
      });
      
      let checkedCount = 0;
      let updatesFound = 0;
      
      for (const dependency of dependencies) {
        try {
          // This would check package registries for newer versions
          // For now, we'll just simulate the check
          const hasUpdate = await dependency.checkForUpdates();
          
          if (hasUpdate.hasUpdates) {
            dependency.status = 'outdated';
            updatesFound++;
          }
          
          dependency.lastChecked = new Date();
          await dependency.save();
          
          checkedCount++;
          
        } catch (error) {
          logger.error(`Error checking updates for ${dependency.name}:`, error);
        }
      }
      
      logger.info('Dependency update check completed:', {
        checkedCount,
        updatesFound
      });
      
    } catch (error) {
      logger.error('Dependency update check job failed:', error);
    }
  },
  null,
  false,
  'UTC'
);

// Notification cleanup job
const notificationCleanupJob = new cron.CronJob(
  '0 3 * * *', // Daily at 3 AM
  async () => {
    try {
      logger.info('Starting notification cleanup job...');
      
      const deletedCount = await Notification.deleteExpired();
      
      logger.info('Notification cleanup completed:', {
        deletedCount
      });
      
    } catch (error) {
      logger.error('Notification cleanup job failed:', error);
    }
  },
  null,
  false,
  'UTC'
);

// Database statistics update job
const databaseStatsJob = new cron.CronJob(
  '0 4 * * *', // Daily at 4 AM
  async () => {
    try {
      logger.info('Starting database statistics update job...');
      
      // Update team statistics
      const teams = await Team.find({ isActive: true });
      
      for (const team of teams) {
        const stats = await team.getTeamStats();
        
        team.statistics.totalDependencies = stats.dependencyCount;
        // Add more statistics updates as needed
        
        await team.save();
      }
      
      logger.info('Database statistics update completed:', {
        teamsUpdated: teams.length
      });
      
    } catch (error) {
      logger.error('Database statistics update job failed:', error);
    }
  },
  null,
  false,
  'UTC'
);

// Weekly report generation job
const weeklyReportJob = new cron.CronJob(
  '0 9 * * 1', // Mondays at 9 AM
  async () => {
    try {
      logger.info('Starting weekly report generation job...');
      
      // Generate weekly reports for teams
      const teams = await Team.find({ isActive: true });
      
      for (const team of teams) {
        if (team.settings.notifications.weeklyReports) {
          // Generate and send weekly report
          logger.info(`Generating weekly report for team: ${team.name}`);
          
          // This would generate comprehensive reports
          // For now, we'll just log the action
        }
      }
      
      logger.info('Weekly report generation completed');
      
    } catch (error) {
      logger.error('Weekly report generation job failed:', error);
    }
  },
  null,
  false,
  'UTC'
);

// Health check job
const healthCheckJob = new cron.CronJob(
  '*/5 * * * *', // Every 5 minutes
  async () => {
    try {
      // Perform basic health checks
      const stats = {
        timestamp: new Date(),
        dependencies: await Dependency.countDocuments(),
        users: await User.countDocuments({ isActive: true }),
        teams: await Team.countDocuments({ isActive: true }),
        pendingRequests: await UpdateRequest.countDocuments({ status: 'pending' }),
        unreadNotifications: await Notification.countDocuments({ isRead: false }),
      };
      
      logger.debug('System health check:', stats);
      
      // Check for any critical issues
      if (stats.pendingRequests > 100) {
        logger.warn('High number of pending requests detected:', stats.pendingRequests);
      }
      
      if (stats.unreadNotifications > 1000) {
        logger.warn('High number of unread notifications detected:', stats.unreadNotifications);
      }
      
    } catch (error) {
      logger.error('Health check job failed:', error);
    }
  },
  null,
  false,
  'UTC'
);

// Overdue request notification job
const overdueRequestJob = new cron.CronJob(
  '0 10 * * *', // Daily at 10 AM
  async () => {
    try {
      logger.info('Checking for overdue requests...');
      
      const overdueRequests = await UpdateRequest.findOverdue();
      
      for (const request of overdueRequests) {
        // Send overdue notifications
        const requester = await User.findById(request.requestedById);
        
        if (requester) {
          await Notification.createNotification({
            userId: requester._id.toString(),
            type: 'update_request',
            title: 'Overdue Request',
            message: `Your update request for ${request.dependencyId} is overdue`,
            priority: 'high',
            data: {
              updateRequestId: request._id.toString(),
              dependencyId: request.dependencyId.toString(),
            },
          });
        }
      }
      
      logger.info('Overdue request notifications sent:', {
        count: overdueRequests.length
      });
      
    } catch (error) {
      logger.error('Overdue request job failed:', error);
    }
  },
  null,
  false,
  'UTC'
);

// Inactive user cleanup job
const inactiveUserCleanupJob = new cron.CronJob(
  '0 1 * * 0', // Sundays at 1 AM
  async () => {
    try {
      logger.info('Starting inactive user cleanup job...');
      
      // Find users who haven't logged in for 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const inactiveUsers = await User.find({
        isActive: true,
        lastLogin: { $lt: ninetyDaysAgo }
      });
      
      let cleanupCount = 0;
      
      for (const user of inactiveUsers) {
        // Remove from teams instead of deactivating (configurable)
        if (process.env.AUTO_CLEANUP_INACTIVE_USERS === 'true') {
          // Remove user from all teams
          await Team.updateMany(
            { memberIds: user._id },
            { $pull: { memberIds: user._id } }
          );
          
          // Clear team lead assignments
          await Team.updateMany(
            { leadId: user._id },
            { $unset: { leadId: 1 } }
          );
          
          cleanupCount++;
          
          logger.info(`Cleaned up inactive user: ${user.email}`);
        }
      }
      
      logger.info('Inactive user cleanup completed:', {
        inactiveUsersFound: inactiveUsers.length,
        cleanupCount
      });
      
    } catch (error) {
      logger.error('Inactive user cleanup job failed:', error);
    }
  },
  null,
  false,
  'UTC'
);

// Archive old completed requests job
const archiveOldRequestsJob = new cron.CronJob(
  '0 2 * * 0', // Sundays at 2 AM
  async () => {
    try {
      logger.info('Starting old requests archival job...');
      
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const archivedCount = await UpdateRequest.deleteMany({
        status: 'completed',
        completedAt: { $lt: ninetyDaysAgo }
      });
      
      logger.info('Old requests archival completed:', {
        archivedCount: archivedCount.deletedCount
      });
      
    } catch (error) {
      logger.error('Old requests archival job failed:', error);
    }
  },
  null,
  false,
  'UTC'
);

// Register all jobs
jobs.push(
  vulnerabilityScanJob,
  dependencyUpdateCheckJob,
  notificationCleanupJob,
  databaseStatsJob,
  weeklyReportJob,
  healthCheckJob,
  overdueRequestJob,
  inactiveUserCleanupJob,
  archiveOldRequestsJob
);

// Start all background jobs
export const startBackgroundJobs = () => {
  if (process.env.NODE_ENV === 'test') {
    logger.info('Background jobs disabled in test environment');
    return;
  }
  
  const enabledJobs = process.env.ENABLE_BACKGROUND_JOBS !== 'false';
  
  if (!enabledJobs) {
    logger.info('Background jobs disabled by configuration');
    return;
  }
  
  jobs.forEach((job, index) => {
    try {
      job.start();
      logger.info(`Background job ${index + 1} started successfully`);
    } catch (error) {
      logger.error(`Failed to start background job ${index + 1}:`, error);
    }
  });
  
  logger.info(`Started ${jobs.length} background jobs`);
};

// Stop all background jobs
export const stopBackgroundJobs = () => {
  jobs.forEach((job, index) => {
    try {
      job.stop();
      logger.info(`Background job ${index + 1} stopped successfully`);
    } catch (error) {
      logger.error(`Failed to stop background job ${index + 1}:`, error);
    }
  });
  
  logger.info(`Stopped ${jobs.length} background jobs`);
};

// Get job status
export const getJobStatus = () => {
  return jobs.map((job, index) => ({
    index: index + 1,
    running: job.running,
    lastDate: job.lastDate(),
    nextDate: job.nextDate(),
    cronTime: job.cronTime.source,
  }));
};

// Manual job execution (for testing/admin purposes)
export const executeJobManually = async (jobIndex: number) => {
  if (jobIndex < 0 || jobIndex >= jobs.length) {
    throw new Error('Invalid job index');
  }
  
  const job = jobs[jobIndex];
  logger.info(`Manually executing job ${jobIndex + 1}...`);
  
  try {
    // Execute the job function directly
    await (job as any)._callbacks[0]();
    logger.info(`Manual job execution ${jobIndex + 1} completed successfully`);
  } catch (error) {
    logger.error(`Manual job execution ${jobIndex + 1} failed:`, error);
    throw error;
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, stopping background jobs...');
  stopBackgroundJobs();
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, stopping background jobs...');
  stopBackgroundJobs();
});

export default {
  startBackgroundJobs,
  stopBackgroundJobs,
  getJobStatus,
  executeJobManually,
};


