# DepFlow v1.0.0 - Deployment Guide

## 🚀 Quick Start

### **1. Prerequisites**
```bash
- Node.js v22.19.0 or higher
- npm package manager
- Gmail account with App Password
- Modern web browser
```

### **2. Installation**
```bash
# Clone or extract version files
cd "Dependency Management App/versions/v1.0.0"

# Install backend dependencies
cd backend
npm install

# Configure email (edit src/email-service.js)
# Update EMAIL_PASS with your Gmail App Password
```

### **3. Configuration**
```bash
# Backend Configuration
Port: 8000
Email: mahipal.appen@gmail.com → mmahipal.reddy@gmail.com
Database: In-memory (demo mode)

# Frontend Configuration
Served from: backend/public/
Access URL: http://localhost:8000
```

### **4. Start Application**
```bash
cd backend
npm run dev
# or
node src/quick-server.js

# Access at: http://localhost:8000
```

## 🔐 User Accounts

### **Demo Credentials**
- **Admin**: admin@demo.com / admin123456
- **User**: user@demo.com / user123456

## 📧 Email Setup

### **Gmail App Password Setup**
1. Enable 2-Step Verification on Gmail
2. Go to Google Account settings
3. Select "Security" → "App passwords"
4. Generate app password for "Mail"
5. Copy password to `src/email-service.js`

### **Email Configuration**
```javascript
const EMAIL_USER = 'mahipal.appen@gmail.com';
const EMAIL_PASS = 'your-app-password-here';
const EMAIL_TO = 'mmahipal.reddy@gmail.com';
```

## 🎯 Feature Verification

### **Testing Checklist**
- [ ] Server starts on port 8000
- [ ] Login with demo credentials
- [ ] Add new dependency
- [ ] Edit dependency (inline)
- [ ] Delete dependency (admin only)
- [ ] Filter by team/status
- [ ] Counter filtering works
- [ ] Email notifications sent
- [ ] Session persistence after refresh
- [ ] RBAC enforced properly

## 🔧 Troubleshooting

### **Common Issues**
- **Port 8000 in use**: Kill process or change port
- **Email not working**: Check App Password setup
- **Login fails**: Verify backend is running
- **UI not loading**: Clear browser cache

### **Server Status**
```bash
# Check if server is running
curl http://localhost:8000/api/v1/health

# Expected response:
{"status":"healthy","timestamp":"..."}
```

---
*DepFlow v1.0.0 - Ready for Production*
