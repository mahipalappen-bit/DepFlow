# DepFlow API Documentation
## Enterprise Dependency Management Platform REST API

---

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL and Headers](#base-url-and-headers)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Examples](#examples)
9. [SDKs and Libraries](#sdks-and-libraries)
10. [Changelog](#changelog)

---

## Overview

The DepFlow API provides programmatic access to the Enterprise Dependency Management Platform. This RESTful API allows you to:

- Create, read, update, and delete dependencies
- Send email notifications to team owners
- Integrate with external systems and workflows
- Automate dependency management processes

### API Version
- **Current Version**: 1.0
- **Protocol**: HTTP/HTTPS
- **Data Format**: JSON
- **Authentication**: Session-based (for web interface) + API key (for programmatic access)

### Base Information
- **API Base URL**: `http://localhost:3000/api`
- **Web Interface**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **Character Encoding**: UTF-8

---

## Authentication

### Session-Based Authentication (Web Interface)
For web interface usage, authentication is handled through the standard login process:

1. User logs in through the web interface
2. Session is maintained via HTTP cookies
3. All subsequent API calls inherit the session authentication

### API Key Authentication (Future Implementation)
*Note: API key authentication is planned for future releases for programmatic access.*

```http
Authorization: Bearer YOUR_API_KEY_HERE
```

---

## Base URL and Headers

### Base URL
```
http://localhost:3000/api
```

### Required Headers
```http
Content-Type: application/json
Accept: application/json
```

### Optional Headers
```http
User-Agent: YourApp/1.0
X-Requested-With: XMLHttpRequest
```

---

## API Endpoints

### 1. Email Notifications

#### Send Test Email
Send a test email notification to verify email configuration.

**Endpoint**: `POST /api/test-email`

**Request Body**:
```json
{
  "team": "Annotation tools"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Real email sent to mmahipal.reddy@gmail.com",
  "teamOwner": "mmahipal.reddy@gmail.com",
  "timestamp": "2025-09-22T04:40:13.396Z"
}
```

**Response** (Error - 500):
```json
{
  "success": false,
  "message": "No team owner configured for team: InvalidTeam"
}
```

**Parameters**:
- `team` (string, required): Team name for email notification

**Available Teams**:
- "Quality flow"
- "Annotation tools"
- "Data Collection"
- "ADAP Platform"
- "CrowdGen"
- "Mercury"
- "Marketing Cloud"
- "Data Engineering"
- "Analytics"
- "Product Management"

---

### 2. Dependencies Management

#### Create New Dependency
Create a new dependency and send email notification to team owner.

**Endpoint**: `POST /api/dependencies`

**Request Body**:
```json
{
  "name": "React User Authentication Component",
  "description": "Implement secure user authentication using React hooks and context API",
  "team": "Annotation tools",
  "status": "NOT STARTED",
  "priority": "HIGH",
  "riskLevel": "MEDIUM",
  "jiraTicket": "https://jira.example.com/AUTH-123",
  "createdBy": "developer@company.com"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Dependency created successfully",
  "dependency": {
    "name": "React User Authentication Component",
    "description": "Implement secure user authentication using React hooks and context API",
    "team": "Annotation tools",
    "status": "NOT STARTED",
    "priority": "HIGH",
    "riskLevel": "MEDIUM",
    "jiraTicket": "https://jira.example.com/AUTH-123",
    "createdBy": "developer@company.com",
    "lastUpdated": "2025-09-22T04:27:54.854Z"
  },
  "emailSent": true,
  "emailMessage": "Real email sent to mmahipal.reddy@gmail.com"
}
```

**Validation Rules**:
- `name`: Required, minimum 2 characters
- `description`: Required, minimum 10 characters
- `team`: Required, must be valid team name
- `status`: Optional, defaults to "NOT STARTED"
- `priority`: Optional, defaults to "MEDIUM"
- `riskLevel`: Optional, defaults to "LOW"
- `jiraTicket`: Optional, URL format recommended
- `createdBy`: Required, email format recommended

---

#### Update Existing Dependency
Update an existing dependency. Email notification sent only if team changes.

**Endpoint**: `PUT /api/dependencies/:id`

**URL Parameters**:
- `id` (integer, required): Dependency ID

**Request Body**:
```json
{
  "name": "Updated React Authentication Component",
  "description": "Enhanced secure user authentication with multi-factor support",
  "team": "Data Collection",
  "status": "IN PROGRESS",
  "priority": "HIGH",
  "riskLevel": "LOW",
  "jiraTicket": "https://jira.example.com/AUTH-123-UPDATED",
  "originalTeam": "Annotation tools"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Dependency updated successfully",
  "dependency": {
    "id": 1,
    "name": "Updated React Authentication Component",
    "description": "Enhanced secure user authentication with multi-factor support",
    "team": "Data Collection",
    "status": "IN PROGRESS",
    "priority": "HIGH",
    "riskLevel": "LOW",
    "jiraTicket": "https://jira.example.com/AUTH-123-UPDATED",
    "lastUpdated": "2025-09-22T04:28:16.587Z"
  },
  "emailSent": true,
  "emailMessage": "Real email sent to mmahipal.reddy@gmail.com"
}
```

**Email Notification Logic**:
- Email sent only when `team` field changes
- Include `originalTeam` in request to enable change detection
- New team owner receives the notification

---

## Data Models

### Dependency Object
```json
{
  "id": 1,
  "name": "string (required, min: 2 chars)",
  "description": "string (required, min: 10 chars)",
  "team": "string (required, valid team name)",
  "status": "string (NOT STARTED|IN PROGRESS|BLOCKED|COMPLETED)",
  "priority": "string (HIGH|MEDIUM|LOW)",
  "riskLevel": "string (HIGH|MEDIUM|LOW)",
  "jiraTicket": "string (optional, URL format)",
  "createdBy": "string (email format)",
  "lastUpdated": "string (ISO 8601 datetime)"
}
```

### Email Notification Object
```json
{
  "success": true,
  "message": "string (descriptive message)",
  "teamOwner": "string (email address)",
  "timestamp": "string (ISO 8601 datetime)"
}
```

### Error Object
```json
{
  "success": false,
  "message": "string (error description)",
  "code": "string (optional error code)",
  "details": "object (optional additional info)"
}
```

### Validation Rules

#### Team Names (Exact Match Required)
- "Quality flow"
- "Annotation tools"
- "Data Collection"
- "ADAP Platform"
- "CrowdGen"
- "Mercury"
- "Marketing Cloud"
- "Data Engineering"
- "Analytics"
- "Product Management"

#### Status Values
- "NOT STARTED" (default)
- "IN PROGRESS"
- "BLOCKED"
- "COMPLETED"

#### Priority Levels
- "HIGH"
- "MEDIUM" (default)
- "LOW"

#### Risk Levels
- "HIGH"
- "MEDIUM"
- "LOW" (default)

---

## Error Handling

### HTTP Status Codes

| Status Code | Meaning | Usage |
|-------------|---------|-------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request data/validation errors |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

### Error Response Format
All errors follow this consistent format:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "timestamp": "2025-09-22T04:40:13.396Z"
}
```

### Common Error Scenarios

#### Validation Errors (400)
```json
{
  "success": false,
  "message": "Dependency name must be at least 2 characters long"
}
```

#### Missing Required Fields (400)
```json
{
  "success": false,
  "message": "Please select a responsible team"
}
```

#### Invalid Team Name (400)
```json
{
  "success": false,
  "message": "Invalid team name provided"
}
```

#### Email Configuration Error (500)
```json
{
  "success": false,
  "message": "Failed to send email notification: Invalid login credentials"
}
```

---

## Rate Limiting

### Current Implementation
- **No formal rate limiting** implemented in current version
- **Email throttling**: Built-in delays for email sending to prevent spam
- **Recommended**: Implement reasonable delays between API calls

### Future Implementation
Planned rate limiting:
- **100 requests per minute** per IP/user
- **Email notifications**: Maximum 10 per minute per team
- **Bulk operations**: Maximum 50 dependencies per request

### Headers (Future)
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Examples

### Complete Workflow Example

#### 1. Create a New Dependency
```bash
curl -X POST http://localhost:3000/api/dependencies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JWT Authentication Middleware",
    "description": "Implement JSON Web Token authentication middleware for Express.js API endpoints with refresh token support",
    "team": "Data Engineering",
    "status": "NOT STARTED",
    "priority": "HIGH",
    "riskLevel": "MEDIUM",
    "jiraTicket": "https://jira.company.com/DE-456",
    "createdBy": "api-user@company.com"
  }'
```

#### 2. Update the Dependency Status
```bash
curl -X PUT http://localhost:3000/api/dependencies/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JWT Authentication Middleware",
    "description": "Implement JSON Web Token authentication middleware for Express.js API endpoints with refresh token support",
    "team": "Data Engineering",
    "status": "IN PROGRESS",
    "priority": "HIGH",
    "riskLevel": "MEDIUM",
    "jiraTicket": "https://jira.company.com/DE-456",
    "originalTeam": "Data Engineering"
  }'
```

#### 3. Reassign to Different Team
```bash
curl -X PUT http://localhost:3000/api/dependencies/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JWT Authentication Middleware",
    "description": "Implement JSON Web Token authentication middleware for Express.js API endpoints with refresh token support",
    "team": "Analytics",
    "status": "IN PROGRESS",
    "priority": "HIGH",
    "riskLevel": "MEDIUM",
    "jiraTicket": "https://jira.company.com/DE-456",
    "originalTeam": "Data Engineering"
  }'
```

#### 4. Test Email Notifications
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"team": "Analytics"}'
```

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

class DepFlowAPI {
  constructor(baseURL = API_BASE) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async createDependency(dependencyData) {
    try {
      const response = await this.client.post('/dependencies', dependencyData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create dependency: ${error.response?.data?.message || error.message}`);
    }
  }

  async updateDependency(id, dependencyData) {
    try {
      const response = await this.client.put(`/dependencies/${id}`, dependencyData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update dependency: ${error.response?.data?.message || error.message}`);
    }
  }

  async sendTestEmail(team) {
    try {
      const response = await this.client.post('/test-email', { team });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send test email: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Usage Example
async function example() {
  const depflow = new DepFlowAPI();
  
  try {
    // Create new dependency
    const newDep = await depflow.createDependency({
      name: "API Rate Limiting Service",
      description: "Implement Redis-based rate limiting for all API endpoints",
      team: "Data Engineering",
      status: "NOT STARTED",
      priority: "MEDIUM",
      riskLevel: "LOW",
      createdBy: "developer@company.com"
    });
    
    console.log('Dependency created:', newDep);
    
    // Send test email
    const emailResult = await depflow.sendTestEmail("Data Engineering");
    console.log('Email sent:', emailResult);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

example();
```

### Python Example

```python
import requests
import json
from typing import Dict, Any

class DepFlowAPI:
    def __init__(self, base_url: str = "http://localhost:3000/api"):
        self.base_url = base_url
        self.headers = {"Content-Type": "application/json"}
    
    def create_dependency(self, dependency_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new dependency"""
        response = requests.post(
            f"{self.base_url}/dependencies",
            headers=self.headers,
            json=dependency_data
        )
        response.raise_for_status()
        return response.json()
    
    def update_dependency(self, dep_id: int, dependency_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing dependency"""
        response = requests.put(
            f"{self.base_url}/dependencies/{dep_id}",
            headers=self.headers,
            json=dependency_data
        )
        response.raise_for_status()
        return response.json()
    
    def send_test_email(self, team: str) -> Dict[str, Any]:
        """Send a test email notification"""
        response = requests.post(
            f"{self.base_url}/test-email",
            headers=self.headers,
            json={"team": team}
        )
        response.raise_for_status()
        return response.json()

# Usage Example
def main():
    depflow = DepFlowAPI()
    
    try:
        # Create dependency
        new_dependency = {
            "name": "Database Migration Scripts",
            "description": "Create automated database migration scripts for production deployment",
            "team": "Data Engineering",
            "status": "NOT STARTED",
            "priority": "HIGH",
            "riskLevel": "HIGH",
            "jiraTicket": "https://jira.company.com/DB-789",
            "createdBy": "python-script@company.com"
        }
        
        result = depflow.create_dependency(new_dependency)
        print(f"Created dependency: {result['dependency']['name']}")
        print(f"Email sent: {result['emailSent']}")
        
        # Test email
        email_result = depflow.send_test_email("Data Engineering")
        print(f"Test email result: {email_result['message']}")
        
    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")

if __name__ == "__main__":
    main()
```

---

## SDKs and Libraries

### Official SDKs
*Coming Soon*: Official SDKs planned for:
- JavaScript/Node.js
- Python
- Java
- .NET/C#

### Community Libraries
- Currently none available
- Community contributions welcome

### Integration Tools
**Recommended Tools**:
- **Postman**: Import API collection for testing
- **Insomnia**: REST client for API development
- **curl**: Command-line testing
- **HTTPie**: User-friendly command-line HTTP client

---

## Changelog

### Version 1.0.0 (Current)
**Release Date**: September 2025

**New Features**:
- ✅ Dependency creation API endpoint
- ✅ Dependency update API endpoint
- ✅ Email notification API endpoint
- ✅ Comprehensive error handling
- ✅ JSON request/response format
- ✅ Email notifications for team changes

**API Endpoints**:
- `POST /api/dependencies` - Create dependency
- `PUT /api/dependencies/:id` - Update dependency
- `POST /api/test-email` - Send test email

**Known Limitations**:
- No authentication for API endpoints (session-based only)
- No rate limiting implemented
- No bulk operations support
- No dependency deletion via API
- No dependency listing/search via API

### Planned for Version 1.1.0
**Upcoming Features**:
- 🔄 API key authentication
- 🔄 Rate limiting implementation
- 🔄 Dependency listing/search endpoints
- 🔄 Bulk operations support
- 🔄 Dependency deletion endpoint
- 🔄 Webhook notifications
- 🔄 API usage analytics

---

## Support and Resources

### Documentation
- **API Documentation**: This document
- **User Manual**: Complete user guide
- **Integration Examples**: Code samples and tutorials

### Testing and Development
- **Test Environment**: Use localhost:3000 for development
- **Test Data**: Create test dependencies with unique names
- **Email Testing**: Use test-email endpoint to verify configuration

### Getting Help
- **Technical Issues**: Contact your system administrator
- **Integration Support**: Review examples and test with curl/Postman first
- **Feature Requests**: Submit through your organization's standard process

### Best Practices
1. **Error Handling**: Always check the `success` field in responses
2. **Email Notifications**: Test email configuration before production use
3. **Data Validation**: Validate data client-side before API calls
4. **Rate Limiting**: Implement reasonable delays between API calls
5. **Monitoring**: Log API responses for troubleshooting

---

*This API documentation was last updated for DepFlow version 1.0.0. For the most current API specification, contact your system administrator.*

