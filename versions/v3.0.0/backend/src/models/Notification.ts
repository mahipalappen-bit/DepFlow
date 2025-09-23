import { Schema, model, Document, Model } from 'mongoose';
import { 
  Notification as INotification, 
  NotificationType, 
  NotificationPriority, 
  NotificationData 
} from '../../../shared/types';
import { 
  NOTIFICATION_TYPES, 
  NOTIFICATION_PRIORITIES, 
  VALIDATION 
} from '../../../shared/constants';

// Extend the interface to include Mongoose Document methods
export interface NotificationDocument extends Omit<INotification, 'id'>, Document {
  _id: string;
  markAsRead(): Promise<void>;
  markAsUnread(): Promise<void>;
  isExpired(): boolean;
  canBeDeleted(): boolean;
  getDaysOld(): number;
  getActionUrl(): string | null;
  shouldAutoExpire(): boolean;
}

// Static methods interface
interface NotificationModel extends Model<NotificationDocument> {
  findByUser(userId: string): Promise<NotificationDocument[]>;
  findUnreadByUser(userId: string): Promise<NotificationDocument[]>;
  findByType(type: NotificationType): Promise<NotificationDocument[]>;
  findByPriority(priority: NotificationPriority): Promise<NotificationDocument[]>;
  createNotification(notificationData: Partial<INotification>): Promise<NotificationDocument>;
  markAllAsRead(userId: string): Promise<void>;
  deleteExpired(): Promise<number>;
  getUnreadCount(userId: string): Promise<number>;
  createBulkNotifications(notifications: Partial<INotification>[]): Promise<NotificationDocument[]>;
  findRecentByUser(userId: string, days?: number): Promise<NotificationDocument[]>;
  getNotificationStats(userId?: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    expired: number;
  }>;
}

// Notification data sub-schema
const notificationDataSchema = new Schema({
  dependencyId: {
    type: Schema.Types.ObjectId,
    ref: 'Dependency',
  },
  updateRequestId: {
    type: Schema.Types.ObjectId,
    ref: 'UpdateRequest',
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  actionUrl: String,
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
  },
}, { _id: false });

// Main notification schema
const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      validate: {
        validator: async function(userId: string) {
          const User = model('User');
          const user = await User.findById(userId);
          return user && user.isActive;
        },
        message: 'User must be an active user',
      },
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: Object.values(NOTIFICATION_TYPES),
        message: 'Invalid notification type: {VALUE}',
      },
      required: [true, 'Notification type is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title must be less than 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [VALIDATION.DESCRIPTION_MAX_LENGTH, `Message must be less than ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`],
    },
    data: {
      type: notificationDataSchema,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: Object.values(NOTIFICATION_PRIORITIES),
        message: 'Invalid notification priority: {VALUE}',
      },
      required: [true, 'Notification priority is required'],
      default: NOTIFICATION_PRIORITIES.MEDIUM,
      index: true,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
    readAt: Date,
    
    // Additional tracking fields
    delivery: {
      channels: [{
        type: { type: String, enum: ['browser', 'email', 'slack', 'webhook'] },
        status: { type: String, enum: ['pending', 'sent', 'delivered', 'failed'] },
        sentAt: Date,
        deliveredAt: Date,
        error: String,
      }],
      attempts: { type: Number, default: 0 },
      lastAttempt: Date,
      maxAttempts: { type: Number, default: 3 },
    },
    
    // Categorization and filtering
    category: {
      type: String,
      enum: ['system', 'security', 'update', 'approval', 'reminder', 'alert'],
      default: 'system',
      index: true,
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [VALIDATION.TAG_MAX_LENGTH, `Tag must be less than ${VALIDATION.TAG_MAX_LENGTH} characters`],
    }],
    
    // Source information
    source: {
      service: { type: String, default: 'dependency-management' },
      version: { type: String, default: '1.0.0' },
      environment: { type: String, default: process.env.NODE_ENV || 'development' },
      triggeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
      triggeredAt: { type: Date, default: Date.now },
    },
    
    // Action tracking
    actions: [{
      id: String,
      label: String,
      url: String,
      method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
      primary: { type: Boolean, default: false },
      style: { type: String, enum: ['default', 'primary', 'secondary', 'success', 'warning', 'error'] },
      clickedAt: Date,
    }],
    
    // Grouping for bulk notifications
    groupId: {
      type: String,
      index: true,
    },
    groupCount: {
      type: Number,
      default: 1,
    },
    
    // Rich content support
    richContent: {
      html: String,
      attachments: [{
        name: String,
        url: String,
        type: String,
        size: Number,
      }],
      images: [{
        alt: String,
        src: String,
        width: Number,
        height: Number,
      }],
    },
    
    // Analytics and engagement
    engagement: {
      viewCount: { type: Number, default: 0 },
      clickCount: { type: Number, default: 0 },
      firstViewedAt: Date,
      lastViewedAt: Date,
      timeToRead: Number, // seconds
      interactionScore: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes for performance
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ userId: 1, priority: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ priority: -1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ groupId: 1, userId: 1 });
notificationSchema.index({ category: 1, createdAt: -1 });

// TTL index for automatic expiration
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual fields
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

notificationSchema.virtual('daysOld').get(function() {
  const now = new Date();
  return Math.ceil((now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

notificationSchema.virtual('actionUrl').get(function() {
  return this.data?.actionUrl || 
         this.actions.find((action: any) => action.primary)?.url ||
         this.actions[0]?.url ||
         null;
});

// Instance Methods
notificationSchema.methods.markAsRead = async function() {
  const notification = this as NotificationDocument;
  
  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    
    // Update engagement
    if (!notification.engagement.firstViewedAt) {
      notification.engagement.firstViewedAt = new Date();
    }
    notification.engagement.lastViewedAt = new Date();
    notification.engagement.viewCount += 1;
    
    await notification.save();
  }
};

notificationSchema.methods.markAsUnread = async function() {
  const notification = this as NotificationDocument;
  
  if (notification.isRead) {
    notification.isRead = false;
    notification.readAt = undefined;
    await notification.save();
  }
};

notificationSchema.methods.isExpired = function(): boolean {
  const notification = this as NotificationDocument;
  return !!(notification.expiresAt && new Date() > notification.expiresAt);
};

notificationSchema.methods.canBeDeleted = function(): boolean {
  const notification = this as NotificationDocument;
  
  // Can delete if read and older than 30 days, or expired
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return (notification.isRead && notification.createdAt < thirtyDaysAgo) || 
         notification.isExpired();
};

notificationSchema.methods.getDaysOld = function(): number {
  const notification = this as NotificationDocument;
  const now = new Date();
  return Math.ceil((now.getTime() - notification.createdAt.getTime()) / (1000 * 60 * 60 * 24));
};

notificationSchema.methods.getActionUrl = function(): string | null {
  const notification = this as NotificationDocument;
  return notification.data?.actionUrl || 
         notification.actions.find((action: any) => action.primary)?.url ||
         notification.actions[0]?.url ||
         null;
};

notificationSchema.methods.shouldAutoExpire = function(): boolean {
  const notification = this as NotificationDocument;
  
  // Auto-expire certain types after specific periods
  const autoExpireRules = {
    [NOTIFICATION_TYPES.DEPENDENCY_UPDATE]: 7, // days
    [NOTIFICATION_TYPES.VULNERABILITY_ALERT]: 30,
    [NOTIFICATION_TYPES.UPDATE_REQUEST]: 14,
    [NOTIFICATION_TYPES.REQUEST_APPROVED]: 7,
    [NOTIFICATION_TYPES.REQUEST_REJECTED]: 7,
    [NOTIFICATION_TYPES.TEAM_ASSIGNMENT]: 1,
    [NOTIFICATION_TYPES.SYSTEM_ALERT]: 3,
  };
  
  const expireDays = autoExpireRules[notification.type as keyof typeof autoExpireRules];
  if (!expireDays) return false;
  
  const expireDate = new Date(notification.createdAt);
  expireDate.setDate(expireDate.getDate() + expireDays);
  
  return new Date() > expireDate;
};

// Static Methods
notificationSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId, expiresAt: { $gt: new Date() } })
    .sort({ createdAt: -1 });
};

notificationSchema.statics.findUnreadByUser = function(userId: string) {
  return this.find({ 
    userId, 
    isRead: false,
    $or: [
      { expiresAt: { $gt: new Date() } },
      { expiresAt: null }
    ]
  }).sort({ priority: -1, createdAt: -1 });
};

notificationSchema.statics.findByType = function(type: NotificationType) {
  return this.find({ type }).sort({ createdAt: -1 });
};

notificationSchema.statics.findByPriority = function(priority: NotificationPriority) {
  return this.find({ priority }).sort({ createdAt: -1 });
};

notificationSchema.statics.createNotification = async function(notificationData: Partial<INotification>) {
  // Set default expiration if not provided
  if (!notificationData.expiresAt && notificationData.type) {
    const defaultExpirations = {
      [NOTIFICATION_TYPES.DEPENDENCY_UPDATE]: 7,
      [NOTIFICATION_TYPES.VULNERABILITY_ALERT]: 30,
      [NOTIFICATION_TYPES.UPDATE_REQUEST]: 14,
      [NOTIFICATION_TYPES.REQUEST_APPROVED]: 7,
      [NOTIFICATION_TYPES.REQUEST_REJECTED]: 7,
      [NOTIFICATION_TYPES.TEAM_ASSIGNMENT]: 1,
      [NOTIFICATION_TYPES.SYSTEM_ALERT]: 3,
    };
    
    const expireDays = defaultExpirations[notificationData.type as keyof typeof defaultExpirations];
    if (expireDays) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expireDays);
      notificationData.expiresAt = expiresAt;
    }
  }
  
  const notification = new this(notificationData);
  await notification.save();
  return notification;
};

notificationSchema.statics.markAllAsRead = async function(userId: string) {
  await this.updateMany(
    { userId, isRead: false },
    { 
      $set: { 
        isRead: true, 
        readAt: new Date(),
        'engagement.lastViewedAt': new Date(),
      },
      $inc: { 'engagement.viewCount': 1 }
    }
  );
};

notificationSchema.statics.deleteExpired = async function(): Promise<number> {
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      // Delete read notifications older than 30 days
      { 
        isRead: true,
        createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    ]
  });
  
  return result.deletedCount || 0;
};

notificationSchema.statics.getUnreadCount = async function(userId: string): Promise<number> {
  return this.countDocuments({
    userId,
    isRead: false,
    $or: [
      { expiresAt: { $gt: new Date() } },
      { expiresAt: null }
    ]
  });
};

notificationSchema.statics.createBulkNotifications = async function(notifications: Partial<INotification>[]) {
  const processedNotifications = notifications.map(notif => {
    // Set default expiration if not provided
    if (!notif.expiresAt && notif.type) {
      const defaultExpirations = {
        [NOTIFICATION_TYPES.DEPENDENCY_UPDATE]: 7,
        [NOTIFICATION_TYPES.VULNERABILITY_ALERT]: 30,
        [NOTIFICATION_TYPES.UPDATE_REQUEST]: 14,
        [NOTIFICATION_TYPES.REQUEST_APPROVED]: 7,
        [NOTIFICATION_TYPES.REQUEST_REJECTED]: 7,
        [NOTIFICATION_TYPES.TEAM_ASSIGNMENT]: 1,
        [NOTIFICATION_TYPES.SYSTEM_ALERT]: 3,
      };
      
      const expireDays = defaultExpirations[notif.type as keyof typeof defaultExpirations];
      if (expireDays) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expireDays);
        notif.expiresAt = expiresAt;
      }
    }
    
    return notif;
  });
  
  return this.insertMany(processedNotifications);
};

notificationSchema.statics.findRecentByUser = function(userId: string, days = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    userId,
    createdAt: { $gte: cutoffDate },
    $or: [
      { expiresAt: { $gt: new Date() } },
      { expiresAt: null }
    ]
  }).sort({ createdAt: -1 });
};

notificationSchema.statics.getNotificationStats = async function(userId?: string) {
  const matchQuery = userId ? { userId } : {};
  
  const pipeline = [
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: {
          $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
        },
        expired: {
          $sum: {
            $cond: [
              { $lt: ['$expiresAt', new Date()] },
              1,
              0
            ]
          }
        },
        byType: {
          $push: {
            type: '$type',
            count: 1
          }
        },
        byPriority: {
          $push: {
            priority: '$priority',
            count: 1
          }
        }
      }
    }
  ];
  
  const [result] = await this.aggregate(pipeline);
  
  if (!result) {
    return {
      total: 0,
      unread: 0,
      byType: {},
      byPriority: {},
      expired: 0,
    };
  }
  
  // Process type and priority counts
  const byType: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  
  result.byType.forEach((item: any) => {
    byType[item.type] = (byType[item.type] || 0) + 1;
  });
  
  result.byPriority.forEach((item: any) => {
    byPriority[item.priority] = (byPriority[item.priority] || 0) + 1;
  });
  
  return {
    total: result.total,
    unread: result.unread,
    byType,
    byPriority,
    expired: result.expired,
  };
};

// Pre-save middleware
notificationSchema.pre('save', function(next) {
  const notification = this as NotificationDocument;
  
  // Generate group ID for similar notifications
  if (!notification.groupId && notification.type && notification.data) {
    const groupComponents = [
      notification.type,
      notification.data.dependencyId,
      notification.data.updateRequestId,
      notification.data.teamId,
    ].filter(Boolean);
    
    if (groupComponents.length > 1) {
      notification.groupId = groupComponents.join(':');
    }
  }
  
  // Set default category based on type
  if (!notification.category) {
    const categoryMap = {
      [NOTIFICATION_TYPES.VULNERABILITY_ALERT]: 'security',
      [NOTIFICATION_TYPES.DEPENDENCY_UPDATE]: 'update',
      [NOTIFICATION_TYPES.UPDATE_REQUEST]: 'approval',
      [NOTIFICATION_TYPES.REQUEST_APPROVED]: 'approval',
      [NOTIFICATION_TYPES.REQUEST_REJECTED]: 'approval',
      [NOTIFICATION_TYPES.SYSTEM_ALERT]: 'system',
      [NOTIFICATION_TYPES.TEAM_ASSIGNMENT]: 'system',
    };
    
    notification.category = categoryMap[notification.type as keyof typeof categoryMap] || 'system';
  }
  
  next();
});

// Post-save middleware for real-time updates
notificationSchema.post('save', function(doc, next) {
  const notification = doc as NotificationDocument;
  console.log(`Notification created for user ${notification.userId}: ${notification.title}`);
  
  // Here you would emit Socket.IO events for real-time notifications
  // Example: io.to(`user:${notification.userId}`).emit('notification', notification);
  
  next();
});

// Create and export the model
const Notification = model<NotificationDocument, NotificationModel>('Notification', notificationSchema);

export default Notification;
export { Notification, NotificationModel };


