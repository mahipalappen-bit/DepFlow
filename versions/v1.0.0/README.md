# DepFlow - Enterprise Dependency Management Platform

<div align="center">
  
  ![DepFlow Logo](https://img.shields.io/badge/DepFlow-Enterprise%20Platform-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjIuNSIgZmlsbD0iIzFlM2E4YSIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjgiIHI9IjIuNSIgZmlsbD0iIzFlM2E4YSIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjgiIHI9IjIuNSIgZmlsbD0iIzFlM2E4YSIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjE2IiByPSIyLjUiIGZpbGw9IiMzYjgyZjYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iMi41IiBmaWxsPSIjM2I4MmY2Ii8+CjxjaXJjbGUgY3g9IjgiIGN5PSIyNCIgcj0iMi41IiBmaWxsPSIjMWUzYThhIi8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMjQiIHI9IjIuNSIgZmlsbD0iIzFlM2E4YSIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyLjUiIGZpbGw9IiMxZTNhOGEiLz4KPC9zdmc+)
  
  **Streamlined Software Lifecycle Management**
  
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-4.18+-blue.svg)](https://expressjs.com/)
  [![Robot Framework](https://img.shields.io/badge/Robot%20Framework-6.1+-orange.svg)](https://robotframework.org/)
  [![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

## 🌟 Overview

DepFlow is a modern, enterprise-grade dependency management platform designed to help organizations track, manage, and monitor software dependencies throughout their development lifecycle. Built with a focus on team collaboration, real-time notifications, and comprehensive reporting.

### ✨ Key Features

- 🔐 **Secure Authentication** - Role-based access control with admin and user roles
- 📊 **Interactive Dashboard** - Real-time counters and visual dependency overview
- 🔍 **Advanced Search & Filtering** - Powerful search with multi-criteria filtering
- 📧 **Email Notifications** - Automated notifications for team assignments and changes
- 🎯 **Team Management** - Organized team-based dependency assignment
- 🔄 **Status Tracking** - Complete lifecycle from "Not Started" to "Completed"
- ⚡ **Real-time Updates** - Live counter updates and instant filtering
- 📱 **Responsive Design** - Works seamlessly across desktop and mobile devices
- 🚀 **REST API** - Full API access for integrations and automation
- 🧪 **Comprehensive Testing** - Complete test automation suite included

## 🏗️ Architecture

### Technology Stack

**Frontend**:
- Pure JavaScript (ES6+) with modern browser APIs
- CSS3 with responsive design and animations
- Font Awesome icons and Google Fonts
- Service Worker for offline capabilities

**Backend**:
- Node.js with Express.js framework
- Nodemailer for email notifications
- In-memory data storage (configurable for databases)
- RESTful API architecture

**Testing**:
- Robot Framework for end-to-end testing
- Python-based test automation
- Selenium WebDriver for UI testing
- Comprehensive API testing suite

**Email Integration**:
- Gmail SMTP integration
- HTML email templates
- Team-based notification routing
- Real-time delivery confirmation

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.8+** - [Download here](https://www.python.org/)
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge
- **Gmail Account** - For email notifications (optional)

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd "Dependency Management App"
   ```

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install  # If package.json exists, otherwise skip
   ```

3. **Configure Email (Optional)**
   ```bash
   # Edit frontend/serve_complete.js
   # Lines 24-25: Set your Gmail credentials
   # Line 110: Set your Gmail address
   ```

4. **Start the Application**
   ```bash
   cd frontend
   node serve_complete.js
   ```

5. **Access the Application**
   - Open your browser to: http://localhost:3000
   - Click "Login" and use "Fill Admin Credentials" for demo access

## 📖 Documentation

### User Documentation
- 📚 [**User Manual**](docs/User_Manual.md) - Complete guide for end users
- 🔌 [**API Documentation**](docs/API_Documentation.md) - REST API reference and examples

### Technical Documentation
- 🧪 [**Test Framework Guide**](tests/README.md) - Robot Framework test automation
- ⚙️ [**Configuration Guide**](#configuration) - Setup and configuration options

## 🧪 Testing

DepFlow includes a comprehensive test automation framework built with Robot Framework and Python.

### Running Tests

1. **Setup Test Environment**
   ```bash
   cd tests
   pip install -r requirements.txt
   ```

2. **Start the Application** (in another terminal)
   ```bash
   cd frontend
   node serve_complete.js
   ```

3. **Run All Tests**
   ```bash
   python run_tests.py
   ```

4. **Run Specific Test Suites**
   ```bash
   # Authentication tests
   python run_tests.py --suite 01_authentication_tests
   
   # CRUD operations tests
   python run_tests.py --suite 02_dependency_crud_tests
   
   # Search and filtering tests
   python run_tests.py --suite 03_filtering_search_tests
   
   # API tests
   python run_tests.py --suite 04_api_tests
   ```

5. **Run Tests by Tags**
   ```bash
   # Run only smoke tests
   python run_tests.py --tags smoke
   
   # Run all except API tests
   python run_tests.py --tags "NOT api"
   ```

### Test Coverage

| Test Suite | Test Cases | Coverage |
|------------|------------|----------|
| Authentication | 12 | Login, logout, user roles, session management |
| CRUD Operations | 16 | Create, read, update, delete dependencies |
| Search & Filtering | 22 | Text search, filters, counters, combinations |
| API Testing | 20 | REST endpoints, validation, error handling |
| **Total** | **70** | **Complete application coverage** |

## 🔧 Configuration

### Application Settings

**Port Configuration**:
```javascript
// In serve_complete.js
const PORT = 3000; // Change as needed
```

**Team Owner Mappings**:
```javascript
// In serve_complete.js (lines 7-18)
const teamOwners = {
    'Quality flow': 'your-email@company.com',
    'Annotation tools': 'your-email@company.com',
    // ... customize for your teams
};
```

### Email Configuration

1. **Enable Gmail 2FA** in your Google Account settings
2. **Generate App Password** for DepFlow
3. **Update Configuration** in `serve_complete.js`:
   ```javascript
   // Lines 24-25
   user: 'your-gmail@gmail.com',
   pass: 'your16characterapppassword'
   
   // Line 110
   from: 'your-gmail@gmail.com'
   ```

### Environment Variables (Optional)

Create a `.env` file for environment-specific settings:
```env
PORT=3000
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
NODE_ENV=production
```

## 📊 API Usage

### Quick API Examples

**Create a Dependency**:
```bash
curl -X POST http://localhost:3000/api/dependencies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "React Authentication Component",
    "description": "Secure user authentication with JWT tokens",
    "team": "Data Engineering",
    "priority": "HIGH",
    "createdBy": "developer@company.com"
  }'
```

**Send Test Email**:
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"team": "Data Engineering"}'
```

**JavaScript Example**:
```javascript
// Create dependency
const response = await fetch('/api/dependencies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Dependency',
    description: 'Detailed description here',
    team: 'Quality flow',
    priority: 'MEDIUM'
  })
});

const result = await response.json();
console.log('Created:', result);
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   # Set production environment
   export NODE_ENV=production
   export PORT=8080
   ```

2. **Process Management** (using PM2)
   ```bash
   npm install -g pm2
   cd frontend
   pm2 start serve_complete.js --name "depflow-app"
   ```

3. **Reverse Proxy** (using Nginx)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Docker Deployment

**Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY frontend/ .
EXPOSE 3000
CMD ["node", "serve_complete.js"]
```

**Docker Commands**:
```bash
# Build image
docker build -t depflow:latest .

# Run container
docker run -d -p 3000:3000 --name depflow-app depflow:latest
```

## 🔒 Security

### Security Features

- ✅ **Input Validation** - Server-side validation for all user inputs
- ✅ **XSS Protection** - Content Security Policy and input sanitization
- ✅ **Session Management** - Secure session handling
- ✅ **Email Security** - Secure SMTP with authentication
- ✅ **Role-based Access** - Admin and user permission levels

### Security Best Practices

1. **Change Default Credentials** - Update admin credentials for production
2. **Enable HTTPS** - Use SSL/TLS certificates for production deployment
3. **Regular Updates** - Keep Node.js and dependencies updated
4. **Email Security** - Use app passwords, not account passwords
5. **Access Logging** - Monitor and log application access

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/depflow.git
   cd depflow
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development Workflow**
   - Make your changes
   - Run tests: `cd tests && python run_tests.py`
   - Ensure all tests pass
   - Test manually in browser

4. **Submit Pull Request**
   - Commit with clear messages
   - Push to your fork
   - Create pull request with description

### Code Style

- **JavaScript**: Use ES6+ features, camelCase naming
- **HTML/CSS**: Semantic markup, consistent indentation
- **Comments**: Clear, concise explanations for complex logic
- **Testing**: Add tests for new features

## 📈 Roadmap

### Version 1.1 (Planned)
- 🔄 Database integration (PostgreSQL/MySQL)
- 🔑 API key authentication
- 📊 Advanced analytics dashboard
- 📋 Bulk import/export functionality
- 🔗 Enhanced JIRA integration

### Version 1.2 (Future)
- 👥 Advanced user management
- 📱 Mobile application
- 🔔 Webhook notifications
- 📈 Custom reporting
- 🌐 Multi-tenant support

### Version 2.0 (Long-term)
- 🤖 AI-powered dependency recommendations
- 📊 Predictive analytics
- 🔄 CI/CD pipeline integration
- 🌍 Multi-language support
- ☁️ Cloud-native architecture

## 📞 Support

### Getting Help

- 📖 **Documentation**: Check the [User Manual](docs/User_Manual.md) and [API Docs](docs/API_Documentation.md)
- 🐛 **Bug Reports**: Create an issue with detailed reproduction steps
- 💡 **Feature Requests**: Suggest new features through issues
- 💬 **Questions**: Use GitHub Discussions for general questions

### Community

- 🌟 **GitHub**: Star the repository if you find it useful
- 🐦 **Twitter**: Follow updates @DepFlowApp (if available)
- 📧 **Email**: Contact maintainers for enterprise support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to:
- **Robot Framework Community** - For excellent testing framework
- **Express.js Team** - For the robust web framework
- **Font Awesome** - For beautiful icons
- **Google Fonts** - For typography
- **All Contributors** - For making DepFlow better

---

<div align="center">
  
  **Built with ❤️ for Enterprise Teams**
  
  [⭐ Star this repository](https://github.com/yourusername/depflow) | [📖 Documentation](docs/) | [🐛 Report Bug](https://github.com/yourusername/depflow/issues) | [💡 Request Feature](https://github.com/yourusername/depflow/issues)

</div>