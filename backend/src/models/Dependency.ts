import { Schema, model, Document, Model } from 'mongoose';
import { 
  Dependency as IDependency, 
  DependencyType, 
  DependencyCategory, 
  DependencyStatus, 
  HealthScore,
  Vulnerability,
  VulnerabilitySeverity
} from '../../../shared/types';
import { 
  DEPENDENCY_TYPES, 
  DEPENDENCY_CATEGORIES, 
  DEPENDENCY_STATUSES, 
  HEALTH_SCORES,
  VULNERABILITY_SEVERITIES,
  PACKAGE_MANAGERS,
  VALIDATION 
} from '../../../shared/constants';

// Extend the interface to include Mongoose Document methods
export interface DependencyDocument extends Omit<IDependency, 'id'>, Document {
  _id: string;
  updateHealthScore(): Promise<void>;
  addVulnerability(vulnerability: Partial<Vulnerability>): Promise<void>;
  removeVulnerability(vulnerabilityId: string): Promise<void>;
  addUsingTeam(teamId: string): Promise<void>;
  removeUsingTeam(teamId: string): Promise<void>;
  checkForUpdates(): Promise<{ hasUpdates: boolean; latestVersion?: string; }>;
  calculateRiskScore(): number;
  isOutdated(): boolean;
  hasVulnerabilities(): boolean;
  hasCriticalVulnerabilities(): boolean;
  getUsageCount(): Promise<number>;
}

// Static methods interface
interface DependencyModel extends Model<DependencyDocument> {
  findByTeam(teamId: string): Promise<DependencyDocument[]>;
  findByOwnerTeam(teamId: string): Promise<DependencyDocument[]>;
  findByStatus(status: DependencyStatus): Promise<DependencyDocument[]>;
  findVulnerable(): Promise<DependencyDocument[]>;
  findOutdated(): Promise<DependencyDocument[]>;
  searchByName(query: string): Promise<DependencyDocument[]>;
  createDependency(dependencyData: Partial<IDependency>): Promise<DependencyDocument>;
  getPopularDependencies(limit?: number): Promise<DependencyDocument[]>;
  getDependenciesByType(type: DependencyType): Promise<DependencyDocument[]>;
  getDependenciesByCategory(category: DependencyCategory): Promise<DependencyDocument[]>;
}

// Vulnerability sub-schema
const vulnerabilitySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  severity: {
    type: String,
    enum: Object.values(VULNERABILITY_SEVERITIES),
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  cvssScore: {
    type: Number,
    min: 0,
    max: 10,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  patchedVersion: String,
  references: [String],
}, { _id: false });

// Dependency metadata sub-schema
const metadataSchema = new Schema({
  packageManager: {
    type: String,
    enum: Object.values(PACKAGE_MANAGERS),
  },
  size: {
    type: Number,
    min: 0,
  },
  downloadCount: {
    type: Number,
    min: 0,
  },
  githubStars: {
    type: Number,
    min: 0,
  },
  lastCommitDate: Date,
  maintainerCount: {
    type: Number,
    min: 0,
  },
  openIssuesCount: {
    type: Number,
    min: 0,
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [VALIDATION.TAG_MAX_LENGTH, `Tag must be less than ${VALIDATION.TAG_MAX_LENGTH} characters`],
  }],
  customFields: {
    type: Map,
    of: Schema.Types.Mixed,
  },
}, { _id: false });

// Main dependency schema
const dependencySchema = new Schema<DependencyDocument>(
  {
    name: {
      type: String,
      required: [true, 'Dependency name is required'],
      trim: true,
      minlength: [VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`],
      maxlength: [VALIDATION.NAME_MAX_LENGTH, `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`],
      index: true,
    },
    version: {
      type: String,
      required: [true, 'Dependency version is required'],
      trim: true,
      match: [VALIDATION.VERSION_REGEX, 'Please enter a valid semantic version (e.g., 1.0.0)'],
    },
    latestVersion: {
      type: String,
      trim: true,
      match: [VALIDATION.VERSION_REGEX, 'Please enter a valid semantic version (e.g., 1.0.0)'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [VALIDATION.DESCRIPTION_MAX_LENGTH, `Description must be less than ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`],
    },
    type: {
      type: String,
      enum: {
        values: Object.values(DEPENDENCY_TYPES),
        message: 'Invalid dependency type: {VALUE}',
      },
      required: [true, 'Dependency type is required'],
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: Object.values(DEPENDENCY_CATEGORIES),
        message: 'Invalid dependency category: {VALUE}',
      },
      required: [true, 'Dependency category is required'],
      index: true,
    },
    ownerTeamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Owner team is required'],
      validate: {
        validator: async function(teamId: string) {
          const Team = model('Team');
          const team = await Team.findById(teamId);
          return team && team.isActive;
        },
        message: 'Owner team must be an active team',
      },
      index: true,
    },
    usedByTeamIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Team',
      validate: {
        validator: async function(teamIds: string[]) {
          const Team = model('Team');
          const teams = await Team.find({ 
            _id: { $in: teamIds },
            isActive: true 
          });
          return teams.length === teamIds.length;
        },
        message: 'All using teams must be active teams',
      },
      index: true,
    }],
    repositoryUrl: {
      type: String,
      trim: true,
      match: [VALIDATION.URL_REGEX, 'Please enter a valid repository URL'],
    },
    documentationUrl: {
      type: String,
      trim: true,
      match: [VALIDATION.URL_REGEX, 'Please enter a valid documentation URL'],
    },
    licenseType: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(DEPENDENCY_STATUSES),
        message: 'Invalid dependency status: {VALUE}',
      },
      required: [true, 'Dependency status is required'],
      default: DEPENDENCY_STATUSES.UNKNOWN,
      index: true,
    },
    healthScore: {
      type: String,
      enum: {
        values: Object.values(HEALTH_SCORES),
        message: 'Invalid health score: {VALUE}',
      },
      required: [true, 'Health score is required'],
      default: HEALTH_SCORES.UNKNOWN,
      index: true,
    },
    lastChecked: {
      type: Date,
      required: [true, 'Last checked date is required'],
      default: Date.now,
      index: true,
    },
    vulnerabilities: [vulnerabilitySchema],
    metadata: {
      type: metadataSchema,
      default: () => ({}),
    },
    
    // Additional tracking fields
    usage: {
      installCount: { type: Number, default: 0 },
      activeProjects: { type: Number, default: 0 },
      lastUsed: Date,
      popularity: { type: Number, default: 0 },
    },
    
    // Compliance and security
    compliance: {
      approved: { type: Boolean, default: false },
      approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      approvedAt: Date,
      licenseCompliant: { type: Boolean, default: true },
      securityReviewed: { type: Boolean, default: false },
      reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: Date,
    },
    
    // Performance metrics
    performance: {
      buildImpact: { type: Number, default: 0 }, // in seconds
      bundleSize: { type: Number, default: 0 }, // in bytes
      loadTime: { type: Number, default: 0 }, // in milliseconds
      memoryUsage: { type: Number, default: 0 }, // in bytes
    },
    
    // Update tracking
    updateHistory: [{
      fromVersion: String,
      toVersion: String,
      updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      updatedAt: { type: Date, default: Date.now },
      notes: String,
    }],
    
    // Deprecation info
    deprecation: {
      isDeprecated: { type: Boolean, default: false },
      deprecatedAt: Date,
      replacementSuggestion: String,
      endOfLifeDate: Date,
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

// Compound indexes for better query performance
dependencySchema.index({ name: 1, version: 1 }, { unique: true });
dependencySchema.index({ ownerTeamId: 1, status: 1 });
dependencySchema.index({ usedByTeamIds: 1, status: 1 });
dependencySchema.index({ type: 1, category: 1 });
dependencySchema.index({ healthScore: 1, status: 1 });
dependencySchema.index({ lastChecked: -1 });
dependencySchema.index({ 'vulnerabilities.severity': 1 });
dependencySchema.index({ 'metadata.tags': 1 });
dependencySchema.index({ createdAt: -1 });
dependencySchema.index({ updatedAt: -1 });
dependencySchema.index({ 'usage.popularity': -1 });

// Text index for search functionality
dependencySchema.index({
  name: 'text',
  description: 'text',
  'metadata.tags': 'text'
}, {
  weights: {
    name: 10,
    description: 5,
    'metadata.tags': 3
  }
});

// Virtual fields
dependencySchema.virtual('isOutdated').get(function() {
  return this.latestVersion && this.version !== this.latestVersion;
});

dependencySchema.virtual('vulnerabilityCount').get(function() {
  return this.vulnerabilities ? this.vulnerabilities.length : 0;
});

dependencySchema.virtual('criticalVulnerabilityCount').get(function() {
  return this.vulnerabilities ? 
    this.vulnerabilities.filter((v: any) => v.severity === 'critical').length : 0;
});

dependencySchema.virtual('riskScore').get(function() {
  return this.calculateRiskScore();
});

// Instance Methods
dependencySchema.methods.updateHealthScore = async function() {
  const dependency = this as DependencyDocument;
  
  let score = HEALTH_SCORES.HEALTHY;
  
  // Check for critical vulnerabilities
  if (dependency.hasCriticalVulnerabilities()) {
    score = HEALTH_SCORES.CRITICAL;
  } else if (dependency.hasVulnerabilities()) {
    score = HEALTH_SCORES.WARNING;
  } else if (dependency.isOutdated()) {
    score = HEALTH_SCORES.WARNING;
  } else if (dependency.deprecation.isDeprecated) {
    score = HEALTH_SCORES.CRITICAL;
  }
  
  dependency.healthScore = score as HealthScore;
  dependency.lastChecked = new Date();
  
  await dependency.save();
};

dependencySchema.methods.addVulnerability = async function(vulnerabilityData: Partial<Vulnerability>) {
  const dependency = this as DependencyDocument;
  
  const vulnerability = {
    id: vulnerabilityData.id || `vuln-${Date.now()}`,
    severity: vulnerabilityData.severity || 'medium',
    title: vulnerabilityData.title || 'Unknown Vulnerability',
    description: vulnerabilityData.description || '',
    publishedDate: vulnerabilityData.publishedDate || new Date(),
    cvssScore: vulnerabilityData.cvssScore,
    patchedVersion: vulnerabilityData.patchedVersion,
    references: vulnerabilityData.references || [],
  };
  
  // Remove existing vulnerability with same ID
  dependency.vulnerabilities = dependency.vulnerabilities.filter(v => v.id !== vulnerability.id);
  
  // Add new vulnerability
  dependency.vulnerabilities.push(vulnerability as any);
  
  // Update health score and status
  await dependency.updateHealthScore();
  
  if (dependency.status !== DEPENDENCY_STATUSES.VULNERABLE) {
    dependency.status = DEPENDENCY_STATUSES.VULNERABLE as DependencyStatus;
  }
  
  await dependency.save();
};

dependencySchema.methods.removeVulnerability = async function(vulnerabilityId: string) {
  const dependency = this as DependencyDocument;
  
  dependency.vulnerabilities = dependency.vulnerabilities.filter(v => v.id !== vulnerabilityId);
  
  // Update health score and status
  await dependency.updateHealthScore();
  
  // Update status if no vulnerabilities remain
  if (dependency.vulnerabilities.length === 0 && dependency.status === DEPENDENCY_STATUSES.VULNERABLE) {
    dependency.status = dependency.isOutdated() ? 
      DEPENDENCY_STATUSES.OUTDATED : DEPENDENCY_STATUSES.UP_TO_DATE;
  }
  
  await dependency.save();
};

dependencySchema.methods.addUsingTeam = async function(teamId: string) {
  const dependency = this as DependencyDocument;
  
  if (!dependency.usedByTeamIds.includes(teamId as any)) {
    dependency.usedByTeamIds.push(teamId as any);
    dependency.usage.activeProjects += 1;
    dependency.usage.popularity += 1;
    await dependency.save();
  }
};

dependencySchema.methods.removeUsingTeam = async function(teamId: string) {
  const dependency = this as DependencyDocument;
  
  dependency.usedByTeamIds = dependency.usedByTeamIds.filter(id => id.toString() !== teamId);
  dependency.usage.activeProjects = Math.max(0, dependency.usage.activeProjects - 1);
  dependency.usage.popularity = Math.max(0, dependency.usage.popularity - 1);
  
  await dependency.save();
};

dependencySchema.methods.checkForUpdates = async function() {
  const dependency = this as DependencyDocument;
  
  // This would integrate with package registries (npm, PyPI, Maven, etc.)
  // For now, we'll return a placeholder
  // In production, this would call external APIs based on packageManager
  
  return {
    hasUpdates: dependency.version !== dependency.latestVersion,
    latestVersion: dependency.latestVersion,
  };
};

dependencySchema.methods.calculateRiskScore = function(): number {
  const dependency = this as DependencyDocument;
  let risk = 0;
  
  // Vulnerability risk
  dependency.vulnerabilities.forEach((vuln: any) => {
    switch (vuln.severity) {
      case 'critical': risk += 40; break;
      case 'high': risk += 20; break;
      case 'medium': risk += 10; break;
      case 'low': risk += 5; break;
    }
  });
  
  // Outdated risk
  if (dependency.isOutdated()) {
    risk += 15;
  }
  
  // Deprecation risk
  if (dependency.deprecation.isDeprecated) {
    risk += 30;
  }
  
  // Maintenance risk (based on last commit date)
  if (dependency.metadata.lastCommitDate) {
    const daysSinceLastCommit = (Date.now() - dependency.metadata.lastCommitDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastCommit > 365) risk += 20;
    else if (daysSinceLastCommit > 180) risk += 10;
  }
  
  return Math.min(100, risk);
};

dependencySchema.methods.isOutdated = function(): boolean {
  const dependency = this as DependencyDocument;
  return !!(dependency.latestVersion && dependency.version !== dependency.latestVersion);
};

dependencySchema.methods.hasVulnerabilities = function(): boolean {
  const dependency = this as DependencyDocument;
  return dependency.vulnerabilities.length > 0;
};

dependencySchema.methods.hasCriticalVulnerabilities = function(): boolean {
  const dependency = this as DependencyDocument;
  return dependency.vulnerabilities.some((v: any) => v.severity === 'critical');
};

dependencySchema.methods.getUsageCount = async function(): Promise<number> {
  const dependency = this as DependencyDocument;
  return dependency.usedByTeamIds.length + 1; // +1 for owner team
};

// Static Methods
dependencySchema.statics.findByTeam = function(teamId: string) {
  return this.find({
    $or: [
      { ownerTeamId: teamId },
      { usedByTeamIds: teamId }
    ]
  }).sort({ name: 1 });
};

dependencySchema.statics.findByOwnerTeam = function(teamId: string) {
  return this.find({ ownerTeamId: teamId }).sort({ name: 1 });
};

dependencySchema.statics.findByStatus = function(status: DependencyStatus) {
  return this.find({ status }).sort({ name: 1 });
};

dependencySchema.statics.findVulnerable = function() {
  return this.find({
    vulnerabilities: { $exists: true, $ne: [] }
  }).sort({ 'vulnerabilities.severity': 1, name: 1 });
};

dependencySchema.statics.findOutdated = function() {
  return this.find({
    $expr: { $ne: ['$version', '$latestVersion'] },
    latestVersion: { $exists: true, $ne: null }
  }).sort({ name: 1 });
};

dependencySchema.statics.searchByName = function(query: string) {
  return this.find({
    $text: { $search: query }
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } });
};

dependencySchema.statics.createDependency = async function(dependencyData: Partial<IDependency>) {
  const dependency = new this(dependencyData);
  
  // Add owner team to usedByTeamIds if not already included
  if (dependency.ownerTeamId && !dependency.usedByTeamIds.includes(dependency.ownerTeamId)) {
    dependency.usedByTeamIds.push(dependency.ownerTeamId);
  }
  
  await dependency.save();
  return dependency;
};

dependencySchema.statics.getPopularDependencies = function(limit = 10) {
  return this.find()
    .sort({ 'usage.popularity': -1, name: 1 })
    .limit(limit);
};

dependencySchema.statics.getDependenciesByType = function(type: DependencyType) {
  return this.find({ type }).sort({ name: 1 });
};

dependencySchema.statics.getDependenciesByCategory = function(category: DependencyCategory) {
  return this.find({ category }).sort({ name: 1 });
};

// Pre-save middleware
dependencySchema.pre('save', async function(next) {
  const dependency = this as DependencyDocument;
  
  // Ensure owner team is in usedByTeamIds
  if (dependency.ownerTeamId && !dependency.usedByTeamIds.includes(dependency.ownerTeamId)) {
    dependency.usedByTeamIds.push(dependency.ownerTeamId);
  }
  
  // Update status based on vulnerabilities and version
  if (dependency.hasVulnerabilities() && dependency.status !== DEPENDENCY_STATUSES.VULNERABLE) {
    dependency.status = DEPENDENCY_STATUSES.VULNERABLE as DependencyStatus;
  } else if (!dependency.hasVulnerabilities()) {
    if (dependency.isOutdated()) {
      dependency.status = DEPENDENCY_STATUSES.OUTDATED as DependencyStatus;
    } else if (dependency.status !== DEPENDENCY_STATUSES.UP_TO_DATE) {
      dependency.status = DEPENDENCY_STATUSES.UP_TO_DATE as DependencyStatus;
    }
  }
  
  // Update usage statistics
  dependency.usage.activeProjects = dependency.usedByTeamIds.length;
  
  next();
});

// Post-save middleware for logging
dependencySchema.post('save', function(doc, next) {
  const dependency = doc as DependencyDocument;
  console.log(`Dependency ${dependency.name}@${dependency.version} saved successfully`);
  next();
});

// Create and export the model
const Dependency = model<DependencyDocument, DependencyModel>('Dependency', dependencySchema);

export default Dependency;
export { Dependency, DependencyModel };


