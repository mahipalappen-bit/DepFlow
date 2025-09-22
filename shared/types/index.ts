// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  teamIds: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'team_member';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  teamIds: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  description: string;
  leadId?: string;
  memberIds: string[];
  projectNames: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Dependency Types
export interface Dependency {
  id: string;
  name: string;
  version: string;
  latestVersion?: string;
  description: string;
  type: DependencyType;
  category: DependencyCategory;
  ownerTeamId: string;
  usedByTeamIds: string[];
  repositoryUrl?: string;
  documentationUrl?: string;
  licenseType?: string;
  status: DependencyStatus;
  healthScore: HealthScore;
  lastChecked: Date;
  vulnerabilities: Vulnerability[];
  metadata: DependencyMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export type DependencyType = 'library' | 'framework' | 'tool' | 'service' | 'runtime';
export type DependencyCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'testing' | 'security' | 'monitoring';
export type DependencyStatus = 'up_to_date' | 'outdated' | 'vulnerable' | 'deprecated' | 'unknown';
export type HealthScore = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface DependencyMetadata {
  packageManager?: 'npm' | 'yarn' | 'pip' | 'maven' | 'gradle' | 'nuget' | 'composer';
  size?: number; // in bytes
  downloadCount?: number;
  githubStars?: number;
  lastCommitDate?: Date;
  maintainerCount?: number;
  openIssuesCount?: number;
  tags: string[];
  customFields: Record<string, any>;
}

export interface Vulnerability {
  id: string;
  severity: VulnerabilitySeverity;
  title: string;
  description: string;
  cvssScore?: number;
  publishedDate: Date;
  patchedVersion?: string;
  references: string[];
}

export type VulnerabilitySeverity = 'low' | 'medium' | 'high' | 'critical';

// Update Request Types
export interface UpdateRequest {
  id: string;
  dependencyId: string;
  requestedById: string;
  targetVersion: string;
  currentVersion: string;
  justification: string;
  priority: RequestPriority;
  status: RequestStatus;
  assignedToId?: string;
  estimatedEffort?: number; // in hours
  testingRequired: boolean;
  rollbackPlan?: string;
  approvedById?: string;
  approvedAt?: Date;
  completedAt?: Date;
  comments: RequestComment[];
  createdAt: Date;
  updatedAt: Date;
}

export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';
export type RequestStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';

export interface RequestComment {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  isRead: boolean;
  priority: NotificationPriority;
  expiresAt?: Date;
  createdAt: Date;
}

export type NotificationType = 
  | 'dependency_update' 
  | 'vulnerability_alert' 
  | 'update_request' 
  | 'request_approved' 
  | 'request_rejected'
  | 'team_assignment'
  | 'system_alert';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationData {
  dependencyId?: string;
  updateRequestId?: string;
  teamId?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Dashboard and Analytics Types
export interface DashboardData {
  overview: DashboardOverview;
  teamStats: TeamStatistics[];
  recentActivity: ActivityItem[];
  alerts: Alert[];
  trends: TrendData[];
}

export interface DashboardOverview {
  totalDependencies: number;
  healthyDependencies: number;
  outdatedDependencies: number;
  vulnerableDependencies: number;
  pendingRequests: number;
  teamsCount: number;
  lastUpdated: Date;
}

export interface TeamStatistics {
  teamId: string;
  teamName: string;
  totalDependencies: number;
  healthScore: HealthScore;
  vulnerabilityCount: number;
  pendingRequestsCount: number;
  lastActivityDate: Date;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  userId: string;
  userName: string;
  teamId?: string;
  dependencyId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type ActivityType = 
  | 'dependency_added'
  | 'dependency_updated'
  | 'dependency_removed'
  | 'vulnerability_detected'
  | 'update_requested'
  | 'request_approved'
  | 'request_completed';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedDependencies: string[];
  affectedTeams: string[];
  actionRequired: boolean;
  resolvedAt?: Date;
  createdAt: Date;
}

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface TrendData {
  period: string;
  healthyCount: number;
  outdatedCount: number;
  vulnerableCount: number;
  newDependencies: number;
  resolvedVulnerabilities: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
}

export interface ResponseMeta {
  pagination?: PaginationMeta;
  timestamp: Date;
  version: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Filter and Search Types
export interface DependencyFilters {
  teamIds?: string[];
  types?: DependencyType[];
  categories?: DependencyCategory[];
  statuses?: DependencyStatus[];
  healthScores?: HealthScore[];
  hasVulnerabilities?: boolean;
  search?: string;
  sortBy?: DependencySortField;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export type DependencySortField = 'name' | 'version' | 'status' | 'lastChecked' | 'healthScore' | 'createdAt';

// Configuration Types
export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  auth: {
    tokenExpiry: number;
    refreshTokenExpiry: number;
  };
  features: {
    notifications: boolean;
    vulnerabilityScanning: boolean;
    autoUpdates: boolean;
    analytics: boolean;
  };
  monitoring: {
    checkInterval: number;
    alertThresholds: {
      criticalVulnerabilities: number;
      outdatedDependencies: number;
    };
  };
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Export all types as a namespace for easier importing
export * from './index';


