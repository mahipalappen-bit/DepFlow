import mongoose, { Schema, Document } from 'mongoose';

export interface IDependency extends Document {
  name: string;
  version: string;
  latestVersion?: string;
  description?: string;
  type: 'library' | 'framework' | 'tool' | 'service';
  status: 'up_to_date' | 'outdated' | 'deprecated' | 'vulnerable';
  ownerTeamId: string;
  usedByTeamIds: string[];
  healthScore: 'healthy' | 'warning' | 'critical';
  lastChecked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const dependencySchema = new Schema<IDependency>({
  name: {
    type: String,
    required: [true, 'Dependency name is required'],
    trim: true,
  },
  version: {
    type: String,
    required: [true, 'Version is required'],
    trim: true,
  },
  latestVersion: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['library', 'framework', 'tool', 'service'],
    default: 'library',
  },
  status: {
    type: String,
    enum: ['up_to_date', 'outdated', 'deprecated', 'vulnerable'],
    default: 'up_to_date',
  },
  ownerTeamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  usedByTeamIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Team',
  }],
  healthScore: {
    type: String,
    enum: ['healthy', 'warning', 'critical'],
    default: 'healthy',
  },
  lastChecked: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const Dependency = mongoose.model<IDependency>('Dependency', dependencySchema);
export default Dependency;


