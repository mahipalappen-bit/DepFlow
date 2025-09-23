// Import all models
import User, { UserDocument, UserModel } from './User';
import Team, { TeamDocument, TeamModel } from './Team';
import Dependency, { DependencyDocument, DependencyModel } from './Dependency';
import UpdateRequest, { UpdateRequestDocument, UpdateRequestModel } from './UpdateRequest';
import Notification, { NotificationDocument, NotificationModel } from './Notification';

// Export models
export {
  User,
  Team,
  Dependency,
  UpdateRequest,
  Notification,
};

// Export document interfaces
export type {
  UserDocument,
  TeamDocument,
  DependencyDocument,
  UpdateRequestDocument,
  NotificationDocument,
};

// Export model interfaces
export type {
  UserModel,
  TeamModel,
  DependencyModel,
  UpdateRequestModel,
  NotificationModel,
};

// Model registry for easier access
export const Models = {
  User,
  Team,
  Dependency,
  UpdateRequest,
  Notification,
} as const;

// Type for model names
export type ModelName = keyof typeof Models;

// Helper function to get model by name
export function getModel<T extends ModelName>(modelName: T): typeof Models[T] {
  return Models[modelName];
}

// Database initialization helper
export async function initializeModels(): Promise<void> {
  try {
    // Ensure indexes are created for all models
    await Promise.all([
      User.createIndexes(),
      Team.createIndexes(),
      Dependency.createIndexes(),
      UpdateRequest.createIndexes(),
      Notification.createIndexes(),
    ]);

    console.log('📊 Database models initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database models:', error);
    throw error;
  }
}

// Model validation helpers
export const ModelValidators = {
  User: {
    validateEmail: (email: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    validatePassword: User.validatePassword,
  },
  
  Team: {
    validateTeamName: (name: string): boolean => {
      return name.length >= 2 && name.length <= 100;
    },
  },
  
  Dependency: {
    validateVersion: (version: string): boolean => {
      return /^\d+\.\d+\.\d+(-[\w\d\.]+)?(\+[\w\d\.]+)?$/.test(version);
    },
    validateUrl: (url: string): boolean => {
      return /^https?:\/\/.+/.test(url);
    },
  },
  
  UpdateRequest: {
    validateJustification: (text: string): boolean => {
      return text.length >= 10 && text.length <= 1000;
    },
  },
  
  Notification: {
    validateTitle: (title: string): boolean => {
      return title.length >= 1 && title.length <= 200;
    },
  },
};

// Database relationship helpers
export const ModelRelations = {
  // User relations
  getUserTeams: async (userId: string) => {
    return Team.find({ memberIds: userId, isActive: true });
  },
  
  getUserDependencies: async (userId: string) => {
    const userTeams = await Team.find({ memberIds: userId, isActive: true });
    const teamIds = userTeams.map(team => team._id);
    
    return Dependency.find({
      $or: [
        { ownerTeamId: { $in: teamIds } },
        { usedByTeamIds: { $in: teamIds } }
      ]
    });
  },
  
  getUserNotifications: async (userId: string, unreadOnly = false) => {
    const query: any = { userId };
    if (unreadOnly) {
      query.isRead = false;
    }
    return Notification.find(query).sort({ createdAt: -1 });
  },
  
  // Team relations
  getTeamMembers: async (teamId: string) => {
    return User.find({ teamIds: teamId, isActive: true });
  },
  
  getTeamDependencies: async (teamId: string) => {
    return Dependency.find({
      $or: [
        { ownerTeamId: teamId },
        { usedByTeamIds: teamId }
      ]
    });
  },
  
  getTeamRequests: async (teamId: string) => {
    const dependencies = await Dependency.find({
      $or: [
        { ownerTeamId: teamId },
        { usedByTeamIds: teamId }
      ]
    });
    
    const dependencyIds = dependencies.map(dep => dep._id);
    return UpdateRequest.find({ dependencyId: { $in: dependencyIds } });
  },
  
  // Dependency relations
  getDependencyOwnerTeam: async (dependencyId: string) => {
    const dependency = await Dependency.findById(dependencyId);
    if (!dependency) return null;
    return Team.findById(dependency.ownerTeamId);
  },
  
  getDependencyUsingTeams: async (dependencyId: string) => {
    const dependency = await Dependency.findById(dependencyId);
    if (!dependency) return [];
    return Team.find({ _id: { $in: dependency.usedByTeamIds } });
  },
  
  getDependencyRequests: async (dependencyId: string) => {
    return UpdateRequest.find({ dependencyId });
  },
  
  // Update request relations
  getRequestDependency: async (requestId: string) => {
    const request = await UpdateRequest.findById(requestId);
    if (!request) return null;
    return Dependency.findById(request.dependencyId);
  },
  
  getRequestRequester: async (requestId: string) => {
    const request = await UpdateRequest.findById(requestId);
    if (!request) return null;
    return User.findById(request.requestedById);
  },
  
  getRequestApprover: async (requestId: string) => {
    const request = await UpdateRequest.findById(requestId);
    if (!request || !request.approvedById) return null;
    return User.findById(request.approvedById);
  },
};

// Database cleanup utilities
export const ModelCleanup = {
  // Remove expired notifications
  cleanupExpiredNotifications: async (): Promise<number> => {
    return Notification.deleteExpired();
  },
  
  // Remove inactive users from teams
  cleanupInactiveUsers: async (): Promise<void> => {
    const inactiveUsers = await User.find({ isActive: false });
    const inactiveUserIds = inactiveUsers.map(user => user._id);
    
    // Remove from teams
    await Team.updateMany(
      { memberIds: { $in: inactiveUserIds } },
      { $pull: { memberIds: { $in: inactiveUserIds } } }
    );
    
    // Clear team lead assignments
    await Team.updateMany(
      { leadId: { $in: inactiveUserIds } },
      { $unset: { leadId: 1 } }
    );
  },
  
  // Archive old completed requests
  archiveOldRequests: async (daysOld = 90): Promise<number> => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await UpdateRequest.deleteMany({
      status: 'completed',
      completedAt: { $lt: cutoffDate }
    });
    
    return result.deletedCount || 0;
  },
  
  // Update dependency statistics
  updateDependencyStats: async (): Promise<void> => {
    const dependencies = await Dependency.find();
    
    for (const dependency of dependencies) {
      const stats = {
        activeProjects: dependency.usedByTeamIds.length,
        popularity: dependency.usedByTeamIds.length,
      };
      
      await Dependency.findByIdAndUpdate(
        dependency._id,
        { $set: { 'usage.activeProjects': stats.activeProjects, 'usage.popularity': stats.popularity } }
      );
    }
  },
};

// Database aggregation utilities
export const ModelAggregations = {
  // Get dashboard statistics
  getDashboardStats: async (teamId?: string) => {
    const matchCondition = teamId ? {
      $or: [
        { ownerTeamId: teamId },
        { usedByTeamIds: teamId }
      ]
    } : {};
    
    const dependencyStats = await Dependency.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          healthy: {
            $sum: { $cond: [{ $eq: ['$healthScore', 'healthy'] }, 1, 0] }
          },
          warning: {
            $sum: { $cond: [{ $eq: ['$healthScore', 'warning'] }, 1, 0] }
          },
          critical: {
            $sum: { $cond: [{ $eq: ['$healthScore', 'critical'] }, 1, 0] }
          },
          vulnerable: {
            $sum: { $cond: [{ $ne: ['$vulnerabilities', []] }, 1, 0] }
          },
          outdated: {
            $sum: {
              $cond: [
                { $ne: ['$version', '$latestVersion'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
    
    const requestStats = await UpdateRequest.aggregate([
      ...(teamId ? [
        {
          $lookup: {
            from: 'dependencies',
            localField: 'dependencyId',
            foreignField: '_id',
            as: 'dependency'
          }
        },
        {
          $match: {
            'dependency.0': {
              $or: [
                { ownerTeamId: teamId },
                { usedByTeamIds: teamId }
              ]
            }
          }
        }
      ] : []),
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    return {
      dependencies: dependencyStats[0] || {
        total: 0, healthy: 0, warning: 0, critical: 0, vulnerable: 0, outdated: 0
      },
      requests: requestStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>)
    };
  },
  
  // Get team performance metrics
  getTeamMetrics: async (teamId: string, days = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return {
      dependenciesAdded: await Dependency.countDocuments({
        ownerTeamId: teamId,
        createdAt: { $gte: cutoffDate }
      }),
      requestsCreated: await UpdateRequest.countDocuments({
        requestedById: { $in: await User.find({ teamIds: teamId }).distinct('_id') },
        createdAt: { $gte: cutoffDate }
      }),
      requestsCompleted: await UpdateRequest.countDocuments({
        requestedById: { $in: await User.find({ teamIds: teamId }).distinct('_id') },
        status: 'completed',
        completedAt: { $gte: cutoffDate }
      }),
      vulnerabilitiesResolved: 0, // This would require tracking vulnerability resolution
    };
  },
};

// Default export
export default Models;


