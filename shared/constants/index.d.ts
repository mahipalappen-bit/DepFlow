export declare const API_CONFIG: {
    readonly VERSION: "v1";
    readonly BASE_PATH: "/api";
    readonly TIMEOUT: 30000;
    readonly RETRY_ATTEMPTS: 3;
    readonly RATE_LIMIT: {
        readonly WINDOW_MS: number;
        readonly MAX_REQUESTS: 1000;
        readonly AUTH_WINDOW_MS: number;
        readonly AUTH_MAX_REQUESTS: 10;
    };
};
export declare const AUTH_CONFIG: {
    readonly TOKEN_EXPIRY: number;
    readonly REFRESH_TOKEN_EXPIRY: number;
    readonly PASSWORD_MIN_LENGTH: 8;
    readonly PASSWORD_REQUIREMENTS: {
        readonly minLength: 8;
        readonly requireUppercase: true;
        readonly requireLowercase: true;
        readonly requireNumbers: true;
        readonly requireSpecialChars: true;
    };
    readonly SESSION_TIMEOUT: number;
};
export declare const USER_ROLES: {
    readonly ADMIN: "admin";
    readonly TEAM_MEMBER: "team_member";
};
export declare const PERMISSIONS: {
    readonly DEPENDENCIES: {
        readonly READ: "dependencies:read";
        readonly CREATE: "dependencies:create";
        readonly UPDATE: "dependencies:update";
        readonly DELETE: "dependencies:delete";
        readonly MANAGE_ALL: "dependencies:manage_all";
    };
    readonly TEAMS: {
        readonly READ: "teams:read";
        readonly CREATE: "teams:create";
        readonly UPDATE: "teams:update";
        readonly DELETE: "teams:delete";
        readonly MANAGE_MEMBERS: "teams:manage_members";
    };
    readonly USERS: {
        readonly READ: "users:read";
        readonly CREATE: "users:create";
        readonly UPDATE: "users:update";
        readonly DELETE: "users:delete";
        readonly MANAGE_ROLES: "users:manage_roles";
    };
    readonly REQUESTS: {
        readonly READ: "requests:read";
        readonly CREATE: "requests:create";
        readonly UPDATE: "requests:update";
        readonly APPROVE: "requests:approve";
        readonly REJECT: "requests:reject";
    };
    readonly NOTIFICATIONS: {
        readonly READ: "notifications:read";
        readonly SEND: "notifications:send";
        readonly MANAGE: "notifications:manage";
    };
    readonly ANALYTICS: {
        readonly READ: "analytics:read";
        readonly ADVANCED: "analytics:advanced";
    };
};
export declare const ROLE_PERMISSIONS: {
    readonly admin: readonly ["dependencies:manage_all", "teams:create", "teams:update", "teams:delete", "teams:manage_members", "users:create", "users:update", "users:delete", "users:manage_roles", "requests:approve", "requests:reject", "notifications:send", "notifications:manage", "analytics:advanced"];
    readonly team_member: readonly ["dependencies:read", "dependencies:create", "dependencies:update", "teams:read", "requests:create", "requests:update", "notifications:read", "analytics:read"];
};
export declare const DEPENDENCY_TYPES: {
    readonly LIBRARY: "library";
    readonly FRAMEWORK: "framework";
    readonly TOOL: "tool";
    readonly SERVICE: "service";
    readonly RUNTIME: "runtime";
};
export declare const DEPENDENCY_CATEGORIES: {
    readonly FRONTEND: "frontend";
    readonly BACKEND: "backend";
    readonly DATABASE: "database";
    readonly DEVOPS: "devops";
    readonly TESTING: "testing";
    readonly SECURITY: "security";
    readonly MONITORING: "monitoring";
};
export declare const DEPENDENCY_STATUSES: {
    readonly UP_TO_DATE: "up_to_date";
    readonly OUTDATED: "outdated";
    readonly VULNERABLE: "vulnerable";
    readonly DEPRECATED: "deprecated";
    readonly UNKNOWN: "unknown";
};
export declare const HEALTH_SCORES: {
    readonly HEALTHY: "healthy";
    readonly WARNING: "warning";
    readonly CRITICAL: "critical";
    readonly UNKNOWN: "unknown";
};
export declare const PACKAGE_MANAGERS: {
    readonly NPM: "npm";
    readonly YARN: "yarn";
    readonly PIP: "pip";
    readonly MAVEN: "maven";
    readonly GRADLE: "gradle";
    readonly NUGET: "nuget";
    readonly COMPOSER: "composer";
};
export declare const VULNERABILITY_SEVERITIES: {
    readonly LOW: "low";
    readonly MEDIUM: "medium";
    readonly HIGH: "high";
    readonly CRITICAL: "critical";
};
export declare const CVSS_SCORE_RANGES: {
    readonly LOW: {
        readonly min: 0.1;
        readonly max: 3.9;
    };
    readonly MEDIUM: {
        readonly min: 4;
        readonly max: 6.9;
    };
    readonly HIGH: {
        readonly min: 7;
        readonly max: 8.9;
    };
    readonly CRITICAL: {
        readonly min: 9;
        readonly max: 10;
    };
};
export declare const REQUEST_PRIORITIES: {
    readonly LOW: "low";
    readonly MEDIUM: "medium";
    readonly HIGH: "high";
    readonly URGENT: "urgent";
};
export declare const REQUEST_STATUSES: {
    readonly PENDING: "pending";
    readonly APPROVED: "approved";
    readonly IN_PROGRESS: "in_progress";
    readonly COMPLETED: "completed";
    readonly REJECTED: "rejected";
    readonly CANCELLED: "cancelled";
};
export declare const NOTIFICATION_TYPES: {
    readonly DEPENDENCY_UPDATE: "dependency_update";
    readonly VULNERABILITY_ALERT: "vulnerability_alert";
    readonly UPDATE_REQUEST: "update_request";
    readonly REQUEST_APPROVED: "request_approved";
    readonly REQUEST_REJECTED: "request_rejected";
    readonly TEAM_ASSIGNMENT: "team_assignment";
    readonly SYSTEM_ALERT: "system_alert";
};
export declare const NOTIFICATION_PRIORITIES: {
    readonly LOW: "low";
    readonly MEDIUM: "medium";
    readonly HIGH: "high";
    readonly URGENT: "urgent";
};
export declare const ACTIVITY_TYPES: {
    readonly DEPENDENCY_ADDED: "dependency_added";
    readonly DEPENDENCY_UPDATED: "dependency_updated";
    readonly DEPENDENCY_REMOVED: "dependency_removed";
    readonly VULNERABILITY_DETECTED: "vulnerability_detected";
    readonly UPDATE_REQUESTED: "update_requested";
    readonly REQUEST_APPROVED: "request_approved";
    readonly REQUEST_COMPLETED: "request_completed";
};
export declare const ALERT_SEVERITIES: {
    readonly INFO: "info";
    readonly WARNING: "warning";
    readonly ERROR: "error";
    readonly CRITICAL: "critical";
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
    readonly MIN_LIMIT: 5;
};
export declare const VALIDATION: {
    readonly NAME_MIN_LENGTH: 2;
    readonly NAME_MAX_LENGTH: 100;
    readonly DESCRIPTION_MAX_LENGTH: 1000;
    readonly EMAIL_REGEX: RegExp;
    readonly VERSION_REGEX: RegExp;
    readonly URL_REGEX: RegExp;
    readonly TAG_MAX_LENGTH: 50;
    readonly MAX_TAGS: 20;
    readonly COMMENT_MAX_LENGTH: 2000;
};
export declare const FILE_UPLOAD: {
    readonly MAX_SIZE: number;
    readonly ALLOWED_TYPES: readonly ["application/json", "text/plain", "text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    readonly DEPENDENCY_IMPORT_FORMATS: readonly ["package.json", "requirements.txt", "pom.xml", "build.gradle"];
};
export declare const CACHE: {
    readonly TTL: {
        readonly DEPENDENCIES: number;
        readonly TEAMS: number;
        readonly USERS: number;
        readonly NOTIFICATIONS: number;
        readonly DASHBOARD: number;
    };
    readonly KEYS: {
        readonly DEPENDENCIES: "deps:";
        readonly TEAMS: "teams:";
        readonly USERS: "users:";
        readonly NOTIFICATIONS: "notifs:";
        readonly DASHBOARD: "dashboard:";
    };
};
export declare const MONITORING: {
    readonly CHECK_INTERVALS: {
        readonly VULNERABILITY_SCAN: number;
        readonly DEPENDENCY_UPDATE: number;
        readonly HEALTH_CHECK: number;
    };
    readonly ALERT_THRESHOLDS: {
        readonly CRITICAL_VULNERABILITIES: 1;
        readonly HIGH_VULNERABILITIES: 5;
        readonly OUTDATED_DEPENDENCIES_PERCENTAGE: 30;
        readonly RESPONSE_TIME_MS: 5000;
        readonly ERROR_RATE_PERCENTAGE: 5;
    };
    readonly METRICS: {
        readonly REQUEST_DURATION_HISTOGRAM: "http_request_duration_seconds";
        readonly REQUEST_COUNT: "http_requests_total";
        readonly DEPENDENCY_COUNT_BY_STATUS: "dependencies_by_status_total";
        readonly VULNERABILITY_COUNT_BY_SEVERITY: "vulnerabilities_by_severity_total";
    };
};
export declare const SOCKET_EVENTS: {
    readonly CLIENT: {
        readonly JOIN_ROOM: "join:room";
        readonly LEAVE_ROOM: "leave:room";
        readonly SUBSCRIBE_NOTIFICATIONS: "subscribe:notifications";
        readonly UNSUBSCRIBE_NOTIFICATIONS: "unsubscribe:notifications";
    };
    readonly SERVER: {
        readonly NOTIFICATION: "notification";
        readonly DEPENDENCY_UPDATE: "dependency:update";
        readonly VULNERABILITY_ALERT: "vulnerability:alert";
        readonly REQUEST_STATUS_CHANGE: "request:status_change";
        readonly TEAM_UPDATE: "team:update";
        readonly SYSTEM_ALERT: "system:alert";
    };
    readonly ROOMS: {
        readonly USER: (userId: string) => string;
        readonly TEAM: (teamId: string) => string;
        readonly ADMIN: "admin";
        readonly SYSTEM: "system";
    };
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly BAD_GATEWAY: 502;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const ERROR_CODES: {
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly TOKEN_INVALID: "TOKEN_INVALID";
    readonly ACCESS_DENIED: "ACCESS_DENIED";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly REQUIRED_FIELD_MISSING: "REQUIRED_FIELD_MISSING";
    readonly INVALID_FORMAT: "INVALID_FORMAT";
    readonly VALUE_OUT_OF_RANGE: "VALUE_OUT_OF_RANGE";
    readonly RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND";
    readonly RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS";
    readonly RESOURCE_CONFLICT: "RESOURCE_CONFLICT";
    readonly INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS";
    readonly DEPENDENCY_IN_USE: "DEPENDENCY_IN_USE";
    readonly INVALID_STATUS_TRANSITION: "INVALID_STATUS_TRANSITION";
    readonly INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR";
    readonly DATABASE_ERROR: "DATABASE_ERROR";
    readonly EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR";
    readonly RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED";
};
export declare const ENVIRONMENTS: {
    readonly DEVELOPMENT: "development";
    readonly STAGING: "staging";
    readonly PRODUCTION: "production";
    readonly TEST: "test";
};
export declare const FEATURE_FLAGS: {
    readonly VULNERABILITY_SCANNING: "vulnerability_scanning";
    readonly AUTO_UPDATES: "auto_updates";
    readonly ADVANCED_ANALYTICS: "advanced_analytics";
    readonly EMAIL_NOTIFICATIONS: "email_notifications";
    readonly SLACK_INTEGRATION: "slack_integration";
    readonly JIRA_INTEGRATION: "jira_integration";
};
export * from './index';
//# sourceMappingURL=index.d.ts.map