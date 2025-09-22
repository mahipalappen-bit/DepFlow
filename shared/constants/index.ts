// API Configuration
export const API_CONFIG = {
  VERSION: 'v1',
  BASE_PATH: '/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 1000,
    AUTH_WINDOW_MS: 15 * 60 * 1000,
    AUTH_MAX_REQUESTS: 10,
  },
} as const;

// Authentication Constants
export const AUTH_CONFIG = {
  TOKEN_EXPIRY: 24 * 60 * 60, // 24 hours in seconds
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  SESSION_TIMEOUT: 30 * 60, // 30 minutes in seconds
} as const;

// User Roles and Permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  TEAM_MEMBER: 'team_member',
} as const;

export const PERMISSIONS = {
  DEPENDENCIES: {
    READ: 'dependencies:read',
    CREATE: 'dependencies:create',
    UPDATE: 'dependencies:update',
    DELETE: 'dependencies:delete',
    MANAGE_ALL: 'dependencies:manage_all',
  },
  TEAMS: {
    READ: 'teams:read',
    CREATE: 'teams:create',
    UPDATE: 'teams:update',
    DELETE: 'teams:delete',
    MANAGE_MEMBERS: 'teams:manage_members',
  },
  USERS: {
    READ: 'users:read',
    CREATE: 'users:create',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    MANAGE_ROLES: 'users:manage_roles',
  },
  REQUESTS: {
    READ: 'requests:read',
    CREATE: 'requests:create',
    UPDATE: 'requests:update',
    APPROVE: 'requests:approve',
    REJECT: 'requests:reject',
  },
  NOTIFICATIONS: {
    READ: 'notifications:read',
    SEND: 'notifications:send',
    MANAGE: 'notifications:manage',
  },
  ANALYTICS: {
    READ: 'analytics:read',
    ADVANCED: 'analytics:advanced',
  },
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.DEPENDENCIES.MANAGE_ALL,
    PERMISSIONS.TEAMS.CREATE,
    PERMISSIONS.TEAMS.UPDATE,
    PERMISSIONS.TEAMS.DELETE,
    PERMISSIONS.TEAMS.MANAGE_MEMBERS,
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.UPDATE,
    PERMISSIONS.USERS.DELETE,
    PERMISSIONS.USERS.MANAGE_ROLES,
    PERMISSIONS.REQUESTS.APPROVE,
    PERMISSIONS.REQUESTS.REJECT,
    PERMISSIONS.NOTIFICATIONS.SEND,
    PERMISSIONS.NOTIFICATIONS.MANAGE,
    PERMISSIONS.ANALYTICS.ADVANCED,
  ],
  [USER_ROLES.TEAM_MEMBER]: [
    PERMISSIONS.DEPENDENCIES.READ,
    PERMISSIONS.DEPENDENCIES.CREATE,
    PERMISSIONS.DEPENDENCIES.UPDATE,
    PERMISSIONS.TEAMS.READ,
    PERMISSIONS.REQUESTS.CREATE,
    PERMISSIONS.REQUESTS.UPDATE,
    PERMISSIONS.NOTIFICATIONS.READ,
    PERMISSIONS.ANALYTICS.READ,
  ],
} as const;

// Dependency Constants
export const DEPENDENCY_TYPES = {
  LIBRARY: 'library',
  FRAMEWORK: 'framework',
  TOOL: 'tool',
  SERVICE: 'service',
  RUNTIME: 'runtime',
} as const;

export const DEPENDENCY_CATEGORIES = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  DATABASE: 'database',
  DEVOPS: 'devops',
  TESTING: 'testing',
  SECURITY: 'security',
  MONITORING: 'monitoring',
} as const;

export const DEPENDENCY_STATUSES = {
  UP_TO_DATE: 'up_to_date',
  OUTDATED: 'outdated',
  VULNERABLE: 'vulnerable',
  DEPRECATED: 'deprecated',
  UNKNOWN: 'unknown',
} as const;

export const HEALTH_SCORES = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  CRITICAL: 'critical',
  UNKNOWN: 'unknown',
} as const;

export const PACKAGE_MANAGERS = {
  NPM: 'npm',
  YARN: 'yarn',
  PIP: 'pip',
  MAVEN: 'maven',
  GRADLE: 'gradle',
  NUGET: 'nuget',
  COMPOSER: 'composer',
} as const;

// Vulnerability Constants
export const VULNERABILITY_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const CVSS_SCORE_RANGES = {
  LOW: { min: 0.1, max: 3.9 },
  MEDIUM: { min: 4.0, max: 6.9 },
  HIGH: { min: 7.0, max: 8.9 },
  CRITICAL: { min: 9.0, max: 10.0 },
} as const;

// Request Constants
export const REQUEST_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const REQUEST_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;

// Notification Constants
export const NOTIFICATION_TYPES = {
  DEPENDENCY_UPDATE: 'dependency_update',
  VULNERABILITY_ALERT: 'vulnerability_alert',
  UPDATE_REQUEST: 'update_request',
  REQUEST_APPROVED: 'request_approved',
  REQUEST_REJECTED: 'request_rejected',
  TEAM_ASSIGNMENT: 'team_assignment',
  SYSTEM_ALERT: 'system_alert',
} as const;

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// Activity Constants
export const ACTIVITY_TYPES = {
  DEPENDENCY_ADDED: 'dependency_added',
  DEPENDENCY_UPDATED: 'dependency_updated',
  DEPENDENCY_REMOVED: 'dependency_removed',
  VULNERABILITY_DETECTED: 'vulnerability_detected',
  UPDATE_REQUESTED: 'update_requested',
  REQUEST_APPROVED: 'request_approved',
  REQUEST_COMPLETED: 'request_completed',
} as const;

// Alert Constants
export const ALERT_SEVERITIES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 5,
} as const;

// Validation Constants
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  VERSION_REGEX: /^\d+\.\d+\.\d+(-[\w\d\.]+)?(\+[\w\d\.]+)?$/,
  URL_REGEX: /^https?:\/\/.+/,
  TAG_MAX_LENGTH: 50,
  MAX_TAGS: 20,
  COMMENT_MAX_LENGTH: 2000,
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/json',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  DEPENDENCY_IMPORT_FORMATS: ['package.json', 'requirements.txt', 'pom.xml', 'build.gradle'],
} as const;

// Caching Constants
export const CACHE = {
  TTL: {
    DEPENDENCIES: 5 * 60, // 5 minutes
    TEAMS: 10 * 60, // 10 minutes
    USERS: 15 * 60, // 15 minutes
    NOTIFICATIONS: 1 * 60, // 1 minute
    DASHBOARD: 2 * 60, // 2 minutes
  },
  KEYS: {
    DEPENDENCIES: 'deps:',
    TEAMS: 'teams:',
    USERS: 'users:',
    NOTIFICATIONS: 'notifs:',
    DASHBOARD: 'dashboard:',
  },
} as const;

// Monitoring Constants
export const MONITORING = {
  CHECK_INTERVALS: {
    VULNERABILITY_SCAN: 24 * 60 * 60 * 1000, // 24 hours
    DEPENDENCY_UPDATE: 12 * 60 * 60 * 1000, // 12 hours
    HEALTH_CHECK: 5 * 60 * 1000, // 5 minutes
  },
  ALERT_THRESHOLDS: {
    CRITICAL_VULNERABILITIES: 1,
    HIGH_VULNERABILITIES: 5,
    OUTDATED_DEPENDENCIES_PERCENTAGE: 30,
    RESPONSE_TIME_MS: 5000,
    ERROR_RATE_PERCENTAGE: 5,
  },
  METRICS: {
    REQUEST_DURATION_HISTOGRAM: 'http_request_duration_seconds',
    REQUEST_COUNT: 'http_requests_total',
    DEPENDENCY_COUNT_BY_STATUS: 'dependencies_by_status_total',
    VULNERABILITY_COUNT_BY_SEVERITY: 'vulnerabilities_by_severity_total',
  },
} as const;

// WebSocket Events
export const SOCKET_EVENTS = {
  CLIENT: {
    JOIN_ROOM: 'join:room',
    LEAVE_ROOM: 'leave:room',
    SUBSCRIBE_NOTIFICATIONS: 'subscribe:notifications',
    UNSUBSCRIBE_NOTIFICATIONS: 'unsubscribe:notifications',
  },
  SERVER: {
    NOTIFICATION: 'notification',
    DEPENDENCY_UPDATE: 'dependency:update',
    VULNERABILITY_ALERT: 'vulnerability:alert',
    REQUEST_STATUS_CHANGE: 'request:status_change',
    TEAM_UPDATE: 'team:update',
    SYSTEM_ALERT: 'system:alert',
  },
  ROOMS: {
    USER: (userId: string) => `user:${userId}`,
    TEAM: (teamId: string) => `team:${teamId}`,
    ADMIN: 'admin',
    SYSTEM: 'system',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication Errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT: 'INVALID_FORMAT',
  VALUE_OUT_OF_RANGE: 'VALUE_OUT_OF_RANGE',
  
  // Resource Errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Business Logic Errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  DEPENDENCY_IN_USE: 'DEPENDENCY_IN_USE',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  
  // System Errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

// Environment Constants
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  VULNERABILITY_SCANNING: 'vulnerability_scanning',
  AUTO_UPDATES: 'auto_updates',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  EMAIL_NOTIFICATIONS: 'email_notifications',
  SLACK_INTEGRATION: 'slack_integration',
  JIRA_INTEGRATION: 'jira_integration',
} as const;

// Export all constants
export * from './index';


