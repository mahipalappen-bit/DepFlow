import { Schema, model, Document, Model } from 'mongoose';
import { Team as ITeam } from '../../../shared/types';
import { VALIDATION } from '../../../shared/constants';

// Extend the interface to include Mongoose Document methods
export interface TeamDocument extends Omit<ITeam, 'id'>, Document {
  _id: string;
  getActiveMembers(): Promise<any[]>;
  getDependencyCount(): Promise<number>;
  addMember(userId: string): Promise<void>;
  removeMember(userId: string): Promise<void>;
  isTeamLead(userId: string): boolean;
  getTeamStats(): Promise<{
    memberCount: number;
    dependencyCount: number;
    activeRequestsCount: number;
    lastActivity: Date | null;
  }>;
}

// Static methods interface
interface TeamModel extends Model<TeamDocument> {
  findActiveTeams(): Promise<TeamDocument[]>;
  findByUser(userId: string): Promise<TeamDocument[]>;
  createTeam(teamData: Partial<ITeam>): Promise<TeamDocument>;
  findByName(name: string): Promise<TeamDocument | null>;
  getTeamsByProject(projectName: string): Promise<TeamDocument[]>;
}

// Team schema definition
const teamSchema = new Schema<TeamDocument>(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
      minlength: [VALIDATION.NAME_MIN_LENGTH, `Team name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`],
      maxlength: [VALIDATION.NAME_MAX_LENGTH, `Team name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [VALIDATION.DESCRIPTION_MAX_LENGTH, `Description must be less than ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`],
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async function(leadId: string) {
          if (!leadId) return true; // Lead is optional
          
          const User = model('User');
          const user = await User.findById(leadId);
          return user && user.isActive;
        },
        message: 'Team lead must be an active user',
      },
      index: true,
    },
    memberIds: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async function(memberIds: string[]) {
          const User = model('User');
          const users = await User.find({ 
            _id: { $in: memberIds },
            isActive: true 
          });
          return users.length === memberIds.length;
        },
        message: 'All team members must be active users',
      },
    }],
    projectNames: [{
      type: String,
      trim: true,
      maxlength: [100, 'Project name must be less than 100 characters'],
    }],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    settings: {
      notifications: {
        dependencyUpdates: { type: Boolean, default: true },
        vulnerabilityAlerts: { type: Boolean, default: true },
        requestUpdates: { type: Boolean, default: true },
        weeklyReports: { type: Boolean, default: false },
      },
      permissions: {
        canCreateDependencies: { type: Boolean, default: true },
        canRequestUpdates: { type: Boolean, default: true },
        canViewAnalytics: { type: Boolean, default: true },
        canManageSettings: { type: Boolean, default: false },
      },
      dependencies: {
        autoUpdateMinor: { type: Boolean, default: false },
        requireApprovalForMajor: { type: Boolean, default: true },
        vulnerabilityScanEnabled: { type: Boolean, default: true },
        alertThreshold: {
          type: String,
          enum: ['low', 'medium', 'high', 'critical'],
          default: 'medium',
        },
      },
    },
    integrations: {
      slack: {
        enabled: { type: Boolean, default: false },
        channelId: String,
        webhookUrl: String,
      },
      jira: {
        enabled: { type: Boolean, default: false },
        projectKey: String,
        boardId: String,
      },
      github: {
        enabled: { type: Boolean, default: false },
        organization: String,
        repositories: [String],
      },
    },
    metadata: {
      department: String,
      cost_center: String,
      manager: String,
      location: String,
      timezone: { type: String, default: 'UTC' },
      tags: [{ 
        type: String,
        maxlength: [VALIDATION.TAG_MAX_LENGTH, `Tag must be less than ${VALIDATION.TAG_MAX_LENGTH} characters`],
      }],
      customFields: {
        type: Map,
        of: Schema.Types.Mixed,
      },
    },
    statistics: {
      totalDependencies: { type: Number, default: 0 },
      healthyDependencies: { type: Number, default: 0 },
      outdatedDependencies: { type: Number, default: 0 },
      vulnerableDependencies: { type: Number, default: 0 },
      lastDependencyUpdate: Date,
      lastVulnerabilityScan: Date,
      totalRequests: { type: Number, default: 0 },
      approvedRequests: { type: Number, default: 0 },
      rejectedRequests: { type: Number, default: 0 },
      averageRequestTime: { type: Number, default: 0 }, // in hours
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
teamSchema.index({ name: 1, isActive: 1 });
teamSchema.index({ memberIds: 1, isActive: 1 });
teamSchema.index({ leadId: 1, isActive: 1 });
teamSchema.index({ projectNames: 1, isActive: 1 });
teamSchema.index({ 'metadata.department': 1, isActive: 1 });
teamSchema.index({ createdAt: -1 });
teamSchema.index({ updatedAt: -1 });

// Virtual for member count
teamSchema.virtual('memberCount').get(function() {
  return this.memberIds ? this.memberIds.length : 0;
});

// Virtual for project count
teamSchema.virtual('projectCount').get(function() {
  return this.projectNames ? this.projectNames.length : 0;
});

// Instance Methods
teamSchema.methods.getActiveMembers = async function() {
  const team = this as TeamDocument;
  const User = model('User');
  
  return User.find({ 
    _id: { $in: team.memberIds }, 
    isActive: true 
  }).select('-password').sort({ firstName: 1, lastName: 1 });
};

teamSchema.methods.getDependencyCount = async function() {
  const team = this as TeamDocument;
  const Dependency = model('Dependency');
  
  return Dependency.countDocuments({
    $or: [
      { ownerTeamId: team._id },
      { usedByTeamIds: team._id }
    ]
  });
};

teamSchema.methods.addMember = async function(userId: string) {
  const team = this as TeamDocument;
  const User = model('User');
  
  // Verify user exists and is active
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw new Error('User not found or inactive');
  }
  
  // Add member if not already in team
  if (!team.memberIds.includes(userId as any)) {
    team.memberIds.push(userId as any);
    
    // Add team to user's teamIds
    if (!user.teamIds.includes(team._id)) {
      user.teamIds.push(team._id);
      await user.save();
    }
    
    await team.save();
  }
};

teamSchema.methods.removeMember = async function(userId: string) {
  const team = this as TeamDocument;
  const User = model('User');
  
  // Remove member from team
  team.memberIds = team.memberIds.filter(id => id.toString() !== userId);
  
  // If removing team lead, clear leadId
  if (team.leadId && team.leadId.toString() === userId) {
    team.leadId = undefined;
  }
  
  // Remove team from user's teamIds
  const user = await User.findById(userId);
  if (user) {
    user.teamIds = user.teamIds.filter(id => id.toString() !== team._id.toString());
    await user.save();
  }
  
  await team.save();
};

teamSchema.methods.isTeamLead = function(userId: string): boolean {
  const team = this as TeamDocument;
  return team.leadId?.toString() === userId;
};

teamSchema.methods.getTeamStats = async function() {
  const team = this as TeamDocument;
  const Dependency = model('Dependency');
  const UpdateRequest = model('UpdateRequest');
  
  const [dependencyCount, activeRequestsCount] = await Promise.all([
    team.getDependencyCount(),
    UpdateRequest.countDocuments({
      $or: [
        { 'dependency.ownerTeamId': team._id },
        { 'dependency.usedByTeamIds': team._id }
      ],
      status: { $in: ['pending', 'approved', 'in_progress'] }
    })
  ]);
  
  // Get last activity from dependencies or requests
  const lastDependencyActivity = await Dependency.findOne({
    $or: [
      { ownerTeamId: team._id },
      { usedByTeamIds: team._id }
    ]
  }).sort({ updatedAt: -1 }).select('updatedAt');
  
  const lastRequestActivity = await UpdateRequest.findOne({
    $or: [
      { 'dependency.ownerTeamId': team._id },
      { 'dependency.usedByTeamIds': team._id }
    ]
  }).sort({ updatedAt: -1 }).select('updatedAt');
  
  let lastActivity: Date | null = null;
  if (lastDependencyActivity || lastRequestActivity) {
    const dates = [
      lastDependencyActivity?.updatedAt,
      lastRequestActivity?.updatedAt,
    ].filter(Boolean) as Date[];
    
    if (dates.length > 0) {
      lastActivity = new Date(Math.max(...dates.map(d => d.getTime())));
    }
  }
  
  return {
    memberCount: team.memberIds.length,
    dependencyCount,
    activeRequestsCount,
    lastActivity,
  };
};

// Static Methods
teamSchema.statics.findActiveTeams = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

teamSchema.statics.findByUser = function(userId: string) {
  return this.find({ 
    memberIds: userId, 
    isActive: true 
  }).sort({ name: 1 });
};

teamSchema.statics.createTeam = async function(teamData: Partial<ITeam>) {
  const team = new this(teamData);
  await team.save();
  
  // Add team to members' teamIds
  if (team.memberIds && team.memberIds.length > 0) {
    const User = model('User');
    await User.updateMany(
      { _id: { $in: team.memberIds } },
      { $addToSet: { teamIds: team._id } }
    );
  }
  
  return team;
};

teamSchema.statics.findByName = function(name: string) {
  return this.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') }, 
    isActive: true 
  });
};

teamSchema.statics.getTeamsByProject = function(projectName: string) {
  return this.find({ 
    projectNames: { $regex: new RegExp(projectName, 'i') }, 
    isActive: true 
  }).sort({ name: 1 });
};

// Pre-save middleware for validation and updates
teamSchema.pre('save', async function(next) {
  const team = this as TeamDocument;
  
  // Ensure leadId is in memberIds
  if (team.leadId && !team.memberIds.includes(team.leadId)) {
    team.memberIds.push(team.leadId);
  }
  
  // Update statistics if dependencies changed
  if (team.isModified('memberIds') || team.isModified('projectNames')) {
    // Trigger statistics update (could be done in background)
    // This is a simplified version - in production, use a background job
    team.statistics.totalDependencies = await team.getDependencyCount();
  }
  
  next();
});

// Post-save middleware for logging and cleanup
teamSchema.post('save', function(doc, next) {
  const team = doc as TeamDocument;
  console.log(`Team ${team.name} saved successfully`);
  next();
});

// Pre-remove middleware for cleanup
teamSchema.pre('remove', async function(next) {
  const team = this as TeamDocument;
  const User = model('User');
  
  // Remove team from all users' teamIds
  await User.updateMany(
    { teamIds: team._id },
    { $pull: { teamIds: team._id } }
  );
  
  next();
});

// Create and export the model
const Team = model<TeamDocument, TeamModel>('Team', teamSchema);

export default Team;
export { Team, TeamModel };


