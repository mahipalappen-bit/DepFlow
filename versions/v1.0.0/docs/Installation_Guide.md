# DepFlow Installation Guide
## Step-by-Step Setup Instructions

---

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Pre-Installation Checklist](#pre-installation-checklist)  
3. [Application Installation](#application-installation)
4. [Test Framework Setup](#test-framework-setup)
5. [Email Configuration](#email-configuration)
6. [Verification and Testing](#verification-and-testing)
7. [Production Setup](#production-setup)
8. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10, macOS 10.14, Ubuntu 18.04+ (or equivalent Linux)
- **Node.js**: Version 18.0 or higher
- **Python**: Version 3.8 or higher  
- **Memory**: 2GB RAM minimum, 4GB recommended
- **Storage**: 500MB free space for application and dependencies
- **Network**: Internet connection for email notifications and package downloads

### Recommended Requirements
- **Operating System**: Latest stable versions
- **Node.js**: Latest LTS version
- **Python**: Latest stable version (3.11+)
- **Memory**: 8GB RAM or more
- **Storage**: 2GB+ free space
- **Browser**: Chrome 100+, Firefox 95+, Safari 15+, Edge 100+

### Software Dependencies
- **Git** (for version control and cloning repository)
- **Text Editor/IDE** (VS Code, Atom, Sublime Text, etc.)
- **Terminal/Command Prompt** access
- **Gmail Account** (for email notifications - optional but recommended)

---

## Pre-Installation Checklist

### ✅ Before You Begin

1. **Check Node.js Installation**
   ```bash
   node --version
   npm --version
   ```
   - Should show v18.0.0+ for Node.js
   - Should show v8.0.0+ for npm

2. **Check Python Installation**
   ```bash
   python --version
   # or
   python3 --version
   ```
   - Should show Python 3.8.0+

3. **Verify Git Installation**
   ```bash
   git --version
   ```
   - Should show Git 2.0+

4. **Check Available Ports**
   ```bash
   # On Windows
   netstat -an | findstr :3000
   
   # On macOS/Linux  
   lsof -i :3000
   ```
   - Port 3000 should be available (or choose different port)

### 📝 What You'll Need

- [ ] Repository URL or downloaded source code
- [ ] Gmail credentials (for email features)
- [ ] Administrator access to your machine
- [ ] 30-60 minutes for complete setup
- [ ] Network access for downloading dependencies

---

## Application Installation

### Step 1: Download DepFlow

**Option A: Clone from Git Repository**
```bash
git clone <repository-url>
cd "Dependency Management App"
```

**Option B: Download and Extract ZIP**
1. Download the ZIP file from the repository
2. Extract to your desired location
3. Open terminal/command prompt in the extracted folder

### Step 2: Install Node.js Dependencies

```bash
# Navigate to the frontend directory
cd frontend

# Install any npm dependencies (if package.json exists)
npm install

# If no package.json, dependencies are included in serve_complete.js
```

### Step 3: Verify Application Structure

Check that your directory structure looks like this:
```
Dependency Management App/
├── README.md
├── frontend/
│   └── serve_complete.js
├── tests/
│   ├── README.md
│   ├── requirements.txt
│   ├── run_tests.py
│   ├── config/
│   ├── keywords/
│   └── test_suites/
└── docs/
    ├── User_Manual.md
    ├── API_Documentation.md
    └── Installation_Guide.md
```

### Step 4: Initial Application Start

```bash
# From the frontend directory
node serve_complete.js
```

You should see output similar to:
```
🚀 Complete Dependency Management System running at http://localhost:3000
✅ Full Features: Login, Dashboard, CRUD, Search, Filtering, RBAC, Data Persistence
📧 REAL EMAIL SENDING ENABLED! (Configure Gmail credentials below)
```

### Step 5: Access the Application

1. Open your web browser
2. Navigate to: http://localhost:3000
3. You should see the DepFlow landing page
4. Click "Login" to access the application
5. Use "Fill Admin Credentials" for initial testing

---

## Test Framework Setup

### Step 1: Navigate to Tests Directory

```bash
# From the project root
cd tests
```

### Step 2: Create Python Virtual Environment (Recommended)

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Python Dependencies

```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install test dependencies
pip install -r requirements.txt
```

This will install:
- Robot Framework
- Selenium WebDriver
- Requests library
- Browser automation tools
- Reporting and analysis tools

### Step 4: Verify Test Installation

```bash
# Check Robot Framework installation
robot --version

# List available test suites
python run_tests.py --list-suites
```

Expected output:
```
Robot Framework 6.1.1 (Python 3.11.0 on darwin)

Available test suites:
  - 01_authentication_tests
  - 02_dependency_crud_tests
  - 03_filtering_search_tests
  - 04_api_tests
```

---

## Email Configuration

### Step 1: Set Up Gmail App Password

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the 16-character app password

### Step 2: Configure DepFlow Email Settings

Edit `frontend/serve_complete.js`:

**Line 24-25: Gmail Authentication**
```javascript
auth: {
    user: 'your-gmail-address@gmail.com',     // Replace with your Gmail
    pass: 'your16characterapppassword'        // Replace with your app password (no spaces)
}
```

**Line 110: Email From Address**
```javascript
from: 'your-gmail-address@gmail.com',    // Must match the authenticated Gmail account
```

### Step 3: Update Team Owner Mappings (Optional)

Edit lines 7-18 in `serve_complete.js` to configure team owners:
```javascript
const teamOwners = {
    'Quality flow': 'team-lead-1@company.com',
    'Annotation tools': 'team-lead-2@company.com',
    'Data Collection': 'team-lead-3@company.com',
    // ... update with your actual team leads
};
```

### Step 4: Test Email Configuration

1. **Restart the application**
   ```bash
   # Stop with Ctrl+C, then restart
   node serve_complete.js
   ```

2. **Test via API**
   ```bash
   curl -X POST http://localhost:3000/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"team": "Annotation tools"}'
   ```

3. **Test via Web Interface**
   - Log into the application
   - Create a new dependency
   - Assign it to a team
   - Check if email is received

---

## Verification and Testing

### Step 1: Application Functionality Test

**Basic Function Check:**
1. ✅ Application starts without errors
2. ✅ Web interface loads at http://localhost:3000
3. ✅ Login functionality works
4. ✅ Dashboard displays correctly
5. ✅ Can create, edit, and delete dependencies
6. ✅ Search and filtering works
7. ✅ Email notifications send successfully

### Step 2: Run Automated Tests

**Quick Smoke Test:**
```bash
# From the tests directory (with application running)
python run_tests.py --tags smoke --headless
```

**Full Test Suite:**
```bash
# Run all tests (takes 15-30 minutes)
python run_tests.py --parallel
```

**Individual Test Suites:**
```bash
# Test authentication
python run_tests.py --suite 01_authentication_tests

# Test CRUD operations  
python run_tests.py --suite 02_dependency_crud_tests

# Test search and filtering
python run_tests.py --suite 03_filtering_search_tests

# Test API endpoints
python run_tests.py --suite 04_api_tests
```

### Step 3: Verify Test Results

After tests complete:
1. **HTML Report**: Opens automatically in browser
2. **Results Location**: `tests/results/reports/`
3. **Screenshots**: Available in `tests/results/screenshots/`
4. **Logs**: Detailed logs in `tests/results/logs/`

**Expected Results:**
- ✅ 70+ test cases should pass
- ⚠️ Some tests may fail if email is not configured
- 📊 Test report shows success rate and details

---

## Production Setup

### Step 1: Environment Configuration

**Create Production Environment File:**
```bash
# In frontend directory, create .env file
cat > .env << EOF
NODE_ENV=production
PORT=8080
GMAIL_USER=production-email@company.com
GMAIL_PASS=production-app-password
LOG_LEVEL=info
EOF
```

**Update serve_complete.js for Environment Variables:**
```javascript
// Add at the top of the file
require('dotenv').config();

// Update port configuration
const PORT = process.env.PORT || 3000;

// Update email configuration
auth: {
    user: process.env.GMAIL_USER || 'your-gmail@gmail.com',
    pass: process.env.GMAIL_PASS || 'your-app-password'
}
```

### Step 2: Process Management with PM2

**Install PM2:**
```bash
npm install -g pm2
```

**Create PM2 Configuration:**
```bash
# In frontend directory, create ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'depflow-app',
    script: 'serve_complete.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    }
  }]
};
EOF
```

**Start Production Application:**
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs depflow-app

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 3: Reverse Proxy Setup (Nginx)

**Install Nginx:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install nginx

# macOS with Homebrew
brew install nginx
```

**Configure Nginx:**
```nginx
# /etc/nginx/sites-available/depflow
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/depflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: SSL/HTTPS Setup with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

---

## Troubleshooting

### Common Installation Issues

#### Node.js/npm Issues

**Error: "node: command not found"**
- **Solution**: Install Node.js from https://nodejs.org/
- **Verify**: `node --version` should show v18+

**Error: "Permission denied" on npm install**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### Python/pip Issues

**Error: "python: command not found"**
- **Windows**: Install Python from python.org, ensure "Add to PATH" is checked
- **macOS**: Install with Homebrew: `brew install python`
- **Linux**: Install with package manager: `sudo apt install python3 python3-pip`

**Error: "pip install failed"**
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Use user install if permission issues
pip install --user -r requirements.txt
```

#### Application Issues

**Error: "Port 3000 already in use"**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process or use different port
kill -9 <PID>
# OR change port in serve_complete.js
```

**Error: "Cannot access application in browser"**
- ✅ Check if application is running: `curl http://localhost:3000`
- ✅ Verify firewall settings allow port 3000
- ✅ Try different browser or incognito mode
- ✅ Check for proxy or VPN interference

#### Email Configuration Issues

**Error: "535-5.7.8 Username and Password not accepted"**
- ✅ Verify 2-Factor Authentication is enabled
- ✅ Use App Password, not regular password
- ✅ Remove spaces from app password
- ✅ Ensure "from" email matches authenticated account

**Error: "Connection refused to SMTP server"**
- ✅ Check internet connectivity
- ✅ Verify firewall allows SMTP connections
- ✅ Check corporate network restrictions

#### Test Framework Issues

**Error: "WebDriver not found"**
```bash
# WebDriver should auto-install, but if issues:
pip install --upgrade webdriver-manager selenium
```

**Error: "Tests fail to start"**
- ✅ Ensure application is running on localhost:3000
- ✅ Check if Chrome browser is installed
- ✅ Try running tests in headless mode: `--headless`

### Performance Issues

**Slow Application Loading**
- ✅ Check system resources (CPU, memory)
- ✅ Close other applications
- ✅ Verify adequate free disk space
- ✅ Check network connectivity

**Test Execution Slow**
- ✅ Run tests in headless mode
- ✅ Use parallel execution: `--parallel`
- ✅ Close unnecessary browser tabs
- ✅ Disable browser extensions

### Getting Additional Help

**Log Analysis:**
```bash
# Application logs
tail -f /path/to/logs/application.log

# PM2 logs (production)
pm2 logs depflow-app

# Test execution logs
ls tests/results/logs/
```

**Debug Mode:**
```bash
# Run application with debug info
DEBUG=* node serve_complete.js

# Run tests with verbose logging
robot --loglevel DEBUG test_suites/
```

**Community Support:**
- 📖 Review documentation in `/docs` folder
- 🐛 Check GitHub issues for similar problems
- 💬 Contact system administrator
- 📧 Reach out to development team

---

## Post-Installation Steps

### Security Checklist

- [ ] Changed default admin credentials
- [ ] Configured proper email credentials
- [ ] Set up HTTPS for production
- [ ] Configured proper firewall rules
- [ ] Updated team owner mappings
- [ ] Tested backup and restore procedures

### Maintenance Tasks

- [ ] Schedule regular dependency updates
- [ ] Set up log rotation
- [ ] Configure monitoring and alerting
- [ ] Plan regular security reviews
- [ ] Document custom configurations
- [ ] Train team members on usage

### Next Steps

1. **User Training**: Share User Manual with team members
2. **Integration**: Set up API integrations with existing tools
3. **Customization**: Adapt team configurations to your organization
4. **Monitoring**: Set up application and performance monitoring
5. **Backup**: Configure data backup procedures

---

*Installation complete! 🎉 Your DepFlow Enterprise Dependency Management Platform is ready to use.*

For ongoing support, refer to the [User Manual](User_Manual.md) and [API Documentation](API_Documentation.md).

