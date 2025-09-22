import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as IUser, UserRole } from '../../../shared/types';
import { USER_ROLES, VALIDATION } from '../../../shared/constants';

// Extend the interface to include Mongoose Document methods
export interface UserDocument extends Omit<IUser, 'id'>, Document {
  _id: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): Omit<UserDocument, 'password'>;
  updateLastLogin(): Promise<void>;
  isAccountLocked(): boolean;
}

// Static methods interface
interface UserModel extends Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findActiveUsers(): Promise<UserDocument[]>;
  createUser(userData: Partial<IUser> & { password: string }): Promise<UserDocument>;
  findByTeam(teamId: string): Promise<UserDocument[]>;
  validatePassword(password: string): { isValid: boolean; errors: string[] };
}

// User schema definition
const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [VALIDATION.EMAIL_REGEX, 'Please enter a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Don't include password in queries by default
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [VALIDATION.NAME_MIN_LENGTH, `First name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`],
      maxlength: [VALIDATION.NAME_MAX_LENGTH, `First name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [VALIDATION.NAME_MIN_LENGTH, `Last name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`],
      maxlength: [VALIDATION.NAME_MAX_LENGTH, `Last name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`],
    },
    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLES),
        message: 'Invalid user role: {VALUE}',
      },
      required: [true, 'User role is required'],
      default: USER_ROLES.TEAM_MEMBER,
      index: true,
    },
    teamIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Team',
      index: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        browser: { type: Boolean, default: true },
        slack: { type: Boolean, default: false },
      },
      dashboard: {
        defaultView: { type: String, default: 'overview' },
        itemsPerPage: { type: Number, default: 20 },
      },
      theme: {
        mode: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
        primaryColor: { type: String, default: '#1976d2' },
      },
    },
    metadata: {
      avatar: String,
      bio: String,
      location: String,
      timezone: { type: String, default: 'UTC' },
      language: { type: String, default: 'en' },
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
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ teamIds: 1, isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  const user = this as UserDocument;
  
  // Only hash password if it's modified
  if (!user.isModified('password')) {
    return next();
  }
  
  try {
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
    user.password = await bcrypt.hash(user.password, saltRounds);
    
    // Update password changed timestamp
    user.passwordChangedAt = new Date();
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance Methods
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument;
  
  if (!user.password) {
    throw new Error('Password not available for comparison');
  }
  
  return bcrypt.compare(candidatePassword, user.password);
};

userSchema.methods.getPublicProfile = function() {
  const user = this as UserDocument;
  const userObject = user.toObject();
  
  // Remove sensitive fields
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.failedLoginAttempts;
  delete userObject.lockUntil;
  
  return userObject;
};

userSchema.methods.updateLastLogin = async function(): Promise<void> {
  const user = this as UserDocument;
  user.lastLogin = new Date();
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();
};

userSchema.methods.isAccountLocked = function(): boolean {
  const user = this as UserDocument;
  return !!(user.lockUntil && user.lockUntil > new Date());
};

// Static Methods
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

userSchema.statics.createUser = async function(userData: Partial<IUser> & { password: string }) {
  const user = new this(userData);
  await user.save();
  return user;
};

userSchema.statics.findByTeam = function(teamId: string) {
  return this.find({ 
    teamIds: teamId, 
    isActive: true 
  }).sort({ firstName: 1, lastName: 1 });
};

userSchema.statics.validatePassword = function(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  };

  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`);
  }

  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Pre-validate middleware for additional checks
userSchema.pre('validate', function(next) {
  const user = this as UserDocument;
  
  // Validate password strength for new users or password changes
  if (user.isModified('password')) {
    const validation = (User as UserModel).validatePassword(user.password);
    if (!validation.isValid) {
      const error = new Error(validation.errors.join(', '));
      return next(error);
    }
  }
  
  // Ensure email is lowercase
  if (user.email) {
    user.email = user.email.toLowerCase();
  }
  
  next();
});

// Post-save middleware for logging
userSchema.post('save', function(doc, next) {
  const user = doc as UserDocument;
  console.log(`User ${user.email} saved successfully`);
  next();
});

// Create and export the model
const User = model<UserDocument, UserModel>('User', userSchema);

export default User;
export { User, UserModel };


