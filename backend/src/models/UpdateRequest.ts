import { Schema, model, Document, Model } from 'mongoose';
import { 
  UpdateRequest as IUpdateRequest, 
  RequestPriority, 
  RequestStatus, 
  RequestComment 
} from '../../../shared/types';
import { 
  REQUEST_PRIORITIES, 
  REQUEST_STATUSES, 
  VALIDATION 
} from '../../../shared/constants';

// Extend the interface to include Mongoose Document methods
export interface UpdateRequestDocument extends Omit<IUpdateRequest, 'id'>, Document {
  _id: string;
  addComment(comment: Partial<RequestComment>): Promise<void>;
  approve(approvedById: string, notes?: string): Promise<void>;
  reject(rejectedById: string, reason: string): Promise<void>;
  markInProgress(assignedToId?: string): Promise<void>;
  markCompleted(completedById: string, notes?: string): Promise<void>;
  cancel(cancelledById: string, reason: string): Promise<void>;
  calculateEstimatedCompletion(): Date;
  isOverdue(): boolean;
  canBeApproved(userId: string): Promise<boolean>;
  canBeModified(userId: string): Promise<boolean>;
  getDaysOpen(): number;
  getStatusHistory(): Array<{ status: RequestStatus; changedAt: Date; changedBy: string; }>;
}

// Static methods interface
interface UpdateRequestModel extends Model<UpdateRequestDocument> {
  findByTeam(teamId: string): Promise<UpdateRequestDocument[]>;
  findByUser(userId: string): Promise<UpdateRequestDocument[]>;
  findByDependency(dependencyId: string): Promise<UpdateRequestDocument[]>;
  findByStatus(status: RequestStatus): Promise<UpdateRequestDocument[]>;
  findPending(): Promise<UpdateRequestDocument[]>;
  findOverdue(): Promise<UpdateRequestDocument[]>;
  createRequest(requestData: Partial<IUpdateRequest>): Promise<UpdateRequestDocument>;
  getRequestStats(teamId?: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    inProgress: number;
    completed: number;
    rejected: number;
    cancelled: number;
    averageApprovalTime: number;
    averageCompletionTime: number;
  }>;
}

// Comment sub-schema
const commentSchema = new Schema({
  id: {
    type: String,
    default: () => new Date().getTime().toString(),
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [VALIDATION.COMMENT_MAX_LENGTH, `Comment must be less than ${VALIDATION.COMMENT_MAX_LENGTH} characters`],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

// Status history sub-schema
const statusHistorySchema = new Schema({
  status: {
    type: String,
    enum: Object.values(REQUEST_STATUSES),
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  changedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: String,
}, { _id: false });

// Main update request schema
const updateRequestSchema = new Schema<UpdateRequestDocument>(
  {
    dependencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Dependency',
      required: [true, 'Dependency is required'],
      validate: {
        validator: async function(dependencyId: string) {
          const Dependency = model('Dependency');
          const dependency = await Dependency.findById(dependencyId);
          return !!dependency;
        },
        message: 'Dependency must exist',
      },
      index: true,
    },
    requestedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester is required'],
      validate: {
        validator: async function(userId: string) {
          const User = model('User');
          const user = await User.findById(userId);
          return user && user.isActive;
        },
        message: 'Requester must be an active user',
      },
      index: true,
    },
    targetVersion: {
      type: String,
      required: [true, 'Target version is required'],
      trim: true,
      match: [VALIDATION.VERSION_REGEX, 'Please enter a valid semantic version (e.g., 1.0.0)'],
    },
    currentVersion: {
      type: String,
      required: [true, 'Current version is required'],
      trim: true,
      match: [VALIDATION.VERSION_REGEX, 'Please enter a valid semantic version (e.g., 1.0.0)'],
    },
    justification: {
      type: String,
      required: [true, 'Justification is required'],
      trim: true,
      minlength: [10, 'Justification must be at least 10 characters'],
      maxlength: [VALIDATION.DESCRIPTION_MAX_LENGTH, `Justification must be less than ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`],
    },
    priority: {
      type: String,
      enum: {
        values: Object.values(REQUEST_PRIORITIES),
        message: 'Invalid priority: {VALUE}',
      },
      required: [true, 'Priority is required'],
      default: REQUEST_PRIORITIES.MEDIUM,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(REQUEST_STATUSES),
        message: 'Invalid status: {VALUE}',
      },
      required: [true, 'Status is required'],
      default: REQUEST_STATUSES.PENDING,
      index: true,
    },
    assignedToId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async function(userId: string) {
          if (!userId) return true; // Assignment is optional
          const User = model('User');
          const user = await User.findById(userId);
          return user && user.isActive;
        },
        message: 'Assigned user must be an active user',
      },
      index: true,
    },
    estimatedEffort: {
      type: Number,
      min: [0.5, 'Estimated effort must be at least 0.5 hours'],
      max: [1000, 'Estimated effort cannot exceed 1000 hours'],
    },
    testingRequired: {
      type: Boolean,
      default: true,
    },
    rollbackPlan: {
      type: String,
      trim: true,
      maxlength: [VALIDATION.DESCRIPTION_MAX_LENGTH, `Rollback plan must be less than ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`],
    },
    approvedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async function(userId: string) {
          if (!userId) return true; // Approval is optional initially
          const User = model('User');
          const user = await User.findById(userId);
          return user && user.isActive;
        },
        message: 'Approver must be an active user',
      },
    },
    approvedAt: Date,
    completedAt: Date,
    comments: [commentSchema],
    
    // Additional tracking fields
    impact: {
      breaking: { type: Boolean, default: false },
      affectedTeams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
      affectedProjects: [String],
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
      },
    },
    
    // Timeline tracking
    timeline: {
      requestedAt: { type: Date, default: Date.now },
      targetDate: Date,
      expectedCompletionDate: Date,
      actualStartDate: Date,
      actualCompletionDate: Date,
    },
    
    // Approval workflow
    approval: {
      requiredApprovers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      currentApprovers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      rejectedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      autoApprove: { type: Boolean, default: false },
      skipApproval: { type: Boolean, default: false },
    },
    
    // Testing and validation
    testing: {
      testPlanUrl: String,
      testResultsUrl: String,
      automatedTestsPassed: Boolean,
      manualTestsPassed: Boolean,
      performanceTestsPassed: Boolean,
      securityTestsPassed: Boolean,
    },
    
    // Dependencies and blockers
    dependencies: [{
      requestId: { type: Schema.Types.ObjectId, ref: 'UpdateRequest' },
      type: { type: String, enum: ['blocks', 'blocked_by', 'related'] },
      description: String,
    }],
    
    // Status history
    statusHistory: [statusHistorySchema],
    
    // Metrics
    metrics: {
      viewCount: { type: Number, default: 0 },
      commentCount: { type: Number, default: 0 },
      likeCount: { type: Number, default: 0 },
      urgencyScore: { type: Number, default: 0 },
    },
    
    // Attachments and links
    attachments: [{
      name: String,
      url: String,
      type: { type: String, enum: ['document', 'image', 'link'] },
      uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now },
    }],
    
    // Integration data
    integration: {
      jiraTicket: String,
      githubPR: String,
      slackThread: String,
      confluencePage: String,
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
updateRequestSchema.index({ dependencyId: 1, status: 1 });
updateRequestSchema.index({ requestedById: 1, status: 1 });
updateRequestSchema.index({ assignedToId: 1, status: 1 });
updateRequestSchema.index({ approvedById: 1, status: 1 });
updateRequestSchema.index({ priority: 1, status: 1 });
updateRequestSchema.index({ 'timeline.requestedAt': -1 });
updateRequestSchema.index({ 'timeline.targetDate': 1 });
updateRequestSchema.index({ createdAt: -1 });
updateRequestSchema.index({ updatedAt: -1 });

// Compound indexes
updateRequestSchema.index({ status: 1, priority: -1, 'timeline.requestedAt': -1 });
updateRequestSchema.index({ dependencyId: 1, status: 1, priority: -1 });

// Virtual fields
updateRequestSchema.virtual('daysOpen').get(function() {
  const now = new Date();
  const created = this.timeline.requestedAt || this.createdAt;
  return Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
});

updateRequestSchema.virtual('isOverdue').get(function() {
  return this.timeline.targetDate && new Date() > this.timeline.targetDate;
});

updateRequestSchema.virtual('estimatedCompletion').get(function() {
  return this.calculateEstimatedCompletion();
});

// Instance Methods
updateRequestSchema.methods.addComment = async function(commentData: Partial<RequestComment>) {
  const request = this as UpdateRequestDocument;
  
  const comment = {
    id: commentData.id || new Date().getTime().toString(),
    authorId: commentData.authorId!,
    content: commentData.content!,
    createdAt: new Date(),
  };
  
  request.comments.push(comment as any);
  request.metrics.commentCount = request.comments.length;
  
  await request.save();
};

updateRequestSchema.methods.approve = async function(approvedById: string, notes?: string) {
  const request = this as UpdateRequestDocument;
  
  if (request.status !== REQUEST_STATUSES.PENDING) {
    throw new Error('Only pending requests can be approved');
  }
  
  request.status = REQUEST_STATUSES.APPROVED as RequestStatus;
  request.approvedById = approvedById as any;
  request.approvedAt = new Date();
  
  // Add to status history
  request.statusHistory.push({
    status: REQUEST_STATUSES.APPROVED,
    changedAt: new Date(),
    changedBy: approvedById as any,
    notes: notes || 'Request approved',
  } as any);
  
  // Add comment if notes provided
  if (notes) {
    await request.addComment({
      authorId: approvedById,
      content: `Request approved: ${notes}`,
    });
  }
  
  await request.save();
};

updateRequestSchema.methods.reject = async function(rejectedById: string, reason: string) {
  const request = this as UpdateRequestDocument;
  
  if (request.status !== REQUEST_STATUSES.PENDING) {
    throw new Error('Only pending requests can be rejected');
  }
  
  request.status = REQUEST_STATUSES.REJECTED as RequestStatus;
  
  // Add to status history
  request.statusHistory.push({
    status: REQUEST_STATUSES.REJECTED,
    changedAt: new Date(),
    changedBy: rejectedById as any,
    notes: reason,
  } as any);
  
  // Add rejection comment
  await request.addComment({
    authorId: rejectedById,
    content: `Request rejected: ${reason}`,
  });
  
  await request.save();
};

updateRequestSchema.methods.markInProgress = async function(assignedToId?: string) {
  const request = this as UpdateRequestDocument;
  
  if (request.status !== REQUEST_STATUSES.APPROVED) {
    throw new Error('Only approved requests can be marked in progress');
  }
  
  request.status = REQUEST_STATUSES.IN_PROGRESS as RequestStatus;
  
  if (assignedToId) {
    request.assignedToId = assignedToId as any;
  }
  
  request.timeline.actualStartDate = new Date();
  
  // Add to status history
  request.statusHistory.push({
    status: REQUEST_STATUSES.IN_PROGRESS,
    changedAt: new Date(),
    changedBy: assignedToId as any || request.requestedById,
    notes: 'Work started on request',
  } as any);
  
  await request.save();
};

updateRequestSchema.methods.markCompleted = async function(completedById: string, notes?: string) {
  const request = this as UpdateRequestDocument;
  
  if (request.status !== REQUEST_STATUSES.IN_PROGRESS) {
    throw new Error('Only in-progress requests can be completed');
  }
  
  request.status = REQUEST_STATUSES.COMPLETED as RequestStatus;
  request.completedAt = new Date();
  request.timeline.actualCompletionDate = new Date();
  
  // Add to status history
  request.statusHistory.push({
    status: REQUEST_STATUSES.COMPLETED,
    changedAt: new Date(),
    changedBy: completedById as any,
    notes: notes || 'Request completed successfully',
  } as any);
  
  // Add completion comment
  if (notes) {
    await request.addComment({
      authorId: completedById,
      content: `Request completed: ${notes}`,
    });
  }
  
  await request.save();
};

updateRequestSchema.methods.cancel = async function(cancelledById: string, reason: string) {
  const request = this as UpdateRequestDocument;
  
  if ([REQUEST_STATUSES.COMPLETED, REQUEST_STATUSES.CANCELLED].includes(request.status as any)) {
    throw new Error('Completed or cancelled requests cannot be cancelled');
  }
  
  request.status = REQUEST_STATUSES.CANCELLED as RequestStatus;
  
  // Add to status history
  request.statusHistory.push({
    status: REQUEST_STATUSES.CANCELLED,
    changedAt: new Date(),
    changedBy: cancelledById as any,
    notes: reason,
  } as any);
  
  // Add cancellation comment
  await request.addComment({
    authorId: cancelledById,
    content: `Request cancelled: ${reason}`,
  });
  
  await request.save();
};

updateRequestSchema.methods.calculateEstimatedCompletion = function(): Date {
  const request = this as UpdateRequestDocument;
  
  // Base calculation on estimated effort and priority
  const baseHours = request.estimatedEffort || 8;
  let adjustedHours = baseHours;
  
  // Adjust based on priority
  switch (request.priority) {
    case REQUEST_PRIORITIES.URGENT:
      adjustedHours *= 0.5; // Rush job
      break;
    case REQUEST_PRIORITIES.HIGH:
      adjustedHours *= 0.8;
      break;
    case REQUEST_PRIORITIES.LOW:
      adjustedHours *= 1.5;
      break;
  }
  
  // Adjust based on complexity (breaking changes take longer)
  if (request.impact.breaking) {
    adjustedHours *= 2;
  }
  
  const estimatedDate = new Date(request.timeline.requestedAt || request.createdAt);
  estimatedDate.setHours(estimatedDate.getHours() + adjustedHours);
  
  return estimatedDate;
};

updateRequestSchema.methods.isOverdue = function(): boolean {
  const request = this as UpdateRequestDocument;
  return !!(request.timeline.targetDate && new Date() > request.timeline.targetDate);
};

updateRequestSchema.methods.canBeApproved = async function(userId: string): Promise<boolean> {
  const request = this as UpdateRequestDocument;
  
  // Can't approve own request
  if (request.requestedById.toString() === userId) {
    return false;
  }
  
  // Must be pending
  if (request.status !== REQUEST_STATUSES.PENDING) {
    return false;
  }
  
  // Check user permissions (admin or team lead)
  const User = model('User');
  const user = await User.findById(userId);
  
  if (!user) return false;
  
  // Admins can approve any request
  if (user.role === 'admin') {
    return true;
  }
  
  // Check if user is team lead of any affected team
  const Dependency = model('Dependency');
  const dependency = await Dependency.findById(request.dependencyId).populate('ownerTeamId usedByTeamIds');
  
  if (!dependency) return false;
  
  const Team = model('Team');
  const ownerTeam = await Team.findById(dependency.ownerTeamId);
  
  return ownerTeam?.leadId?.toString() === userId;
};

updateRequestSchema.methods.canBeModified = async function(userId: string): Promise<boolean> {
  const request = this as UpdateRequestDocument;
  
  // Can modify own request if pending
  if (request.requestedById.toString() === userId && request.status === REQUEST_STATUSES.PENDING) {
    return true;
  }
  
  // Admins can modify any request
  const User = model('User');
  const user = await User.findById(userId);
  
  return user?.role === 'admin';
};

updateRequestSchema.methods.getDaysOpen = function(): number {
  const request = this as UpdateRequestDocument;
  const now = new Date();
  const created = request.timeline.requestedAt || request.createdAt;
  return Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
};

updateRequestSchema.methods.getStatusHistory = function() {
  const request = this as UpdateRequestDocument;
  return request.statusHistory.sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());
};

// Static Methods
updateRequestSchema.statics.findByTeam = function(teamId: string) {
  return this.find()
    .populate({
      path: 'dependencyId',
      match: {
        $or: [
          { ownerTeamId: teamId },
          { usedByTeamIds: teamId }
        ]
      }
    })
    .sort({ 'timeline.requestedAt': -1 });
};

updateRequestSchema.statics.findByUser = function(userId: string) {
  return this.find({
    $or: [
      { requestedById: userId },
      { assignedToId: userId },
      { approvedById: userId }
    ]
  }).sort({ 'timeline.requestedAt': -1 });
};

updateRequestSchema.statics.findByDependency = function(dependencyId: string) {
  return this.find({ dependencyId }).sort({ 'timeline.requestedAt': -1 });
};

updateRequestSchema.statics.findByStatus = function(status: RequestStatus) {
  return this.find({ status }).sort({ priority: -1, 'timeline.requestedAt': -1 });
};

updateRequestSchema.statics.findPending = function() {
  return this.find({ status: REQUEST_STATUSES.PENDING })
    .sort({ priority: -1, 'timeline.requestedAt': -1 });
};

updateRequestSchema.statics.findOverdue = function() {
  return this.find({
    'timeline.targetDate': { $lt: new Date() },
    status: { $nin: [REQUEST_STATUSES.COMPLETED, REQUEST_STATUSES.CANCELLED] }
  }).sort({ 'timeline.targetDate': 1 });
};

updateRequestSchema.statics.createRequest = async function(requestData: Partial<IUpdateRequest>) {
  const request = new this({
    ...requestData,
    timeline: {
      requestedAt: new Date(),
      ...requestData.timeline,
    },
    statusHistory: [{
      status: REQUEST_STATUSES.PENDING,
      changedAt: new Date(),
      changedBy: requestData.requestedById,
      notes: 'Request created',
    }],
  });
  
  await request.save();
  return request;
};

updateRequestSchema.statics.getRequestStats = async function(teamId?: string) {
  const matchQuery = teamId ? {
    $lookup: {
      from: 'dependencies',
      localField: 'dependencyId',
      foreignField: '_id',
      as: 'dependency'
    }
  } : {};
  
  const pipeline = [
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
        count: { $sum: 1 },
        avgApprovalTime: {
          $avg: {
            $cond: [
              { $and: ['$approvedAt', '$timeline.requestedAt'] },
              { $subtract: ['$approvedAt', '$timeline.requestedAt'] },
              null
            ]
          }
        },
        avgCompletionTime: {
          $avg: {
            $cond: [
              { $and: ['$completedAt', '$timeline.requestedAt'] },
              { $subtract: ['$completedAt', '$timeline.requestedAt'] },
              null
            ]
          }
        }
      }
    }
  ];
  
  const results = await this.aggregate(pipeline);
  
  const stats = {
    total: 0,
    pending: 0,
    approved: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0,
    averageApprovalTime: 0,
    averageCompletionTime: 0,
  };
  
  results.forEach(result => {
    const status = result._id;
    const count = result.count;
    
    stats.total += count;
    
    switch (status) {
      case REQUEST_STATUSES.PENDING:
        stats.pending = count;
        break;
      case REQUEST_STATUSES.APPROVED:
        stats.approved = count;
        break;
      case REQUEST_STATUSES.IN_PROGRESS:
        stats.inProgress = count;
        break;
      case REQUEST_STATUSES.COMPLETED:
        stats.completed = count;
        stats.averageCompletionTime = result.avgCompletionTime / (1000 * 60 * 60); // Convert to hours
        break;
      case REQUEST_STATUSES.REJECTED:
        stats.rejected = count;
        break;
      case REQUEST_STATUSES.CANCELLED:
        stats.cancelled = count;
        break;
    }
    
    if (result.avgApprovalTime) {
      stats.averageApprovalTime = result.avgApprovalTime / (1000 * 60 * 60); // Convert to hours
    }
  });
  
  return stats;
};

// Pre-save middleware
updateRequestSchema.pre('save', function(next) {
  const request = this as UpdateRequestDocument;
  
  // Update metrics
  request.metrics.commentCount = request.comments.length;
  
  // Calculate urgency score
  let urgency = 0;
  switch (request.priority) {
    case REQUEST_PRIORITIES.URGENT: urgency += 40; break;
    case REQUEST_PRIORITIES.HIGH: urgency += 20; break;
    case REQUEST_PRIORITIES.MEDIUM: urgency += 10; break;
    case REQUEST_PRIORITIES.LOW: urgency += 5; break;
  }
  
  // Add urgency based on age
  const daysOpen = request.getDaysOpen();
  urgency += Math.min(30, daysOpen); // Cap at 30 points for age
  
  // Add urgency for overdue requests
  if (request.isOverdue()) {
    urgency += 20;
  }
  
  request.metrics.urgencyScore = urgency;
  
  next();
});

// Post-save middleware for notifications
updateRequestSchema.post('save', function(doc, next) {
  const request = doc as UpdateRequestDocument;
  console.log(`Update request for dependency ${request.dependencyId} saved with status ${request.status}`);
  // Here you would trigger notifications to relevant users
  next();
});

// Create and export the model
const UpdateRequest = model<UpdateRequestDocument, UpdateRequestModel>('UpdateRequest', updateRequestSchema);

export default UpdateRequest;
export { UpdateRequest, UpdateRequestModel };


