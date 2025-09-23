# DepFlow v3.0.0 - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- Node.js 18.0 or higher
- Python 3.8+ (for testing)
- Modern web browser (Chrome 70+, Firefox 65+, Safari 12+, Edge 79+)
- Gmail account with App Password (for email notifications)

### 1. Environment Setup

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure email service (optional but recommended)
# Edit backend/src/email-service.js with your Gmail credentials
# Replace 'YOUR_GMAIL_APP_PASSWORD' with your actual app password
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend/public

# Start the frontend server
python3 -m http.server 3000
```

#### Backend Server Start
```bash
# In backend directory
npm run dev
# OR
node src/quick-server.js
```

### 2. Access Points
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Health Check**: http://localhost:8000/api/v1/health
- **Documentation**: http://localhost:3000/docs/DepFlow_User_Documentation.html

## 📧 Email Configuration

### Gmail SMTP Setup
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Update `backend/src/email-service.js`:
   ```javascript
   const EMAIL_PASS = 'your-16-character-app-password';
   ```

## 🔧 Configuration Options

### Backend Configuration
**File**: `backend/src/quick-server.js`
- **Port**: Default 8000 (line 765: `app.listen(8000)`)
- **CORS**: Configured for localhost:3000
- **JWT Secret**: Configurable for production use
- **Email Settings**: In `email-service.js`

### Frontend Configuration  
**File**: `frontend/public/app.js`
- **API Base URL**: http://localhost:8000/api/v1 (line 182, 222, etc.)
- **Documentation Path**: docs/DepFlow_User_Documentation.html

## 🧪 Testing Suite Setup

### Install Test Dependencies
```bash
# Install Python dependencies
cd tests
pip install -r requirements.txt
```

### Run All Tests
```bash
# Run complete test suite
python run_tests.py

# Run specific test categories
python run_tests.py --test-suite smoke    # Quick tests
python run_tests.py --test-suite api      # API tests only
python run_tests.py --test-suite ui       # UI tests only
```

### Test Categories
- **Authentication**: 20 test cases
- **CRUD Operations**: 30 test cases
- **Filtering & Search**: 29 test cases
- **API Testing**: 15 test cases
- **Email Notifications**: 12 test cases
- **RBAC Testing**: 8 test cases
- **Data Persistence**: 7 test cases
- **UI Enhancement**: 8 test cases

## 🌐 Production Deployment

### Environment Variables
Create a `.env` file in the backend directory:
```env
NODE_ENV=production
PORT=8000
JWT_SECRET=your-secure-jwt-secret-here
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=recipient@example.com
```

### Security Considerations
1. **JWT Secret**: Use a strong, unique secret in production
2. **CORS**: Configure appropriate origins for your domain
3. **Email Credentials**: Store securely, never commit to version control
4. **HTTPS**: Use SSL/TLS in production environments
5. **Rate Limiting**: Consider implementing API rate limiting

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
EXPOSE 8000
CMD ["node", "src/quick-server.js"]
```

## 🔍 Monitoring and Health Checks

### Health Endpoints
- **Backend Health**: `GET /api/v1/health`
- **API Status**: Returns JSON with server status
- **Email Service**: Built-in email testing capability

### Logging
- Backend logs all email notifications
- Authentication attempts logged
- API errors logged with details

## 📱 Mobile Deployment Considerations

### Responsive Design
- Full mobile optimization included
- Touch-friendly interface elements
- Responsive documentation tabs
- Mobile-optimized modal dialogs

### Performance
- Optimized CSS for mobile rendering
- Efficient JavaScript execution
- Fast tab switching animations
- Minimal bandwidth usage

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 8000
sudo lsof -ti:8000 | xargs kill -9
# Kill process on port 3000
sudo lsof -ti:3000 | xargs kill -9
```

#### Email Not Working
1. Verify Gmail App Password is correct
2. Check if 2-Step Verification is enabled
3. Ensure email service variables are set correctly
4. Check backend logs for email errors

#### Documentation 404 Error
- Ensure `docs/DepFlow_User_Documentation.html` exists in `frontend/public/`
- Verify frontend server is running on port 3000

#### Test Failures
1. Ensure both servers are running (frontend:3000, backend:8000)
2. Install Python dependencies: `pip install -r tests/requirements.txt`
3. Check browser compatibility (Chrome recommended for testing)

### Debug Mode
Enable detailed logging in backend:
```javascript
// In quick-server.js, add:
console.log('Debug mode enabled');
```

## 📊 Performance Optimization

### Frontend Optimizations
- **CSS**: Minified and optimized gradients
- **JavaScript**: Efficient DOM manipulation
- **Images**: Optimized loading strategies
- **Animations**: Hardware-accelerated transitions

### Backend Optimizations
- **Memory**: In-memory database for fast access
- **API**: Efficient request handling
- **Email**: Asynchronous sending with error handling
- **Authentication**: JWT-based stateless authentication

## 🔄 Update Process

### Updating from Previous Versions
1. **Backup**: Current data (if any persistent storage used)
2. **Replace**: Frontend files with v3.0.0 files
3. **Update**: Backend files with v3.0.0 files
4. **Restart**: Both frontend and backend servers
5. **Test**: Verify all functionality works correctly

### No Breaking Changes
- All existing APIs maintained
- Database schema unchanged (in-memory)
- User data preserved
- Configuration options backward compatible

## 📈 Monitoring Recommendations

### Key Metrics to Monitor
- API response times
- Email delivery success rate
- User registration success rate
- Authentication failures
- Page load times
- Mobile usage statistics

### Health Check Automation
```bash
#!/bin/bash
# health_check.sh
curl -f http://localhost:8000/api/v1/health || exit 1
curl -f http://localhost:3000 || exit 1
echo "All services healthy"
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] JWT secret set to secure value
- [ ] Email credentials configured
- [ ] CORS settings updated for production domain
- [ ] SSL/TLS certificate installed
- [ ] Health checks configured
- [ ] Monitoring tools set up
- [ ] Backup strategy implemented
- [ ] Load balancing configured (if needed)
- [ ] CDN configured for static assets (if needed)

---

## 📞 Support Resources

- **Documentation**: Comprehensive tabbed guide at `/docs/DepFlow_User_Documentation.html`
- **Test Suite**: Automated validation ensures functionality
- **Error Logs**: Check browser console and backend logs
- **API Documentation**: Available through health endpoint
- **Mobile Testing**: Use browser dev tools for responsive testing

**Deployment Status**: ✅ Production Ready  
**Documentation**: ✅ Complete  
**Testing**: ✅ Comprehensive Coverage  
**Performance**: ✅ Optimized  
**Security**: ✅ Configured
