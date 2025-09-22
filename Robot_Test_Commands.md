# DepFlow Robot Framework Test Execution Commands

## 🧪 Complete Guide to Running Automated Tests

---

## Prerequisites

### 1. Ensure DepFlow Application is Running
```bash
# Start the application (required before running tests)
cd "/Users/mmoola/Cursor/Dependency Management App/frontend"
node serve_complete.js

# Verify it's running (should return 200)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

### 2. Set Up Test Environment
```bash
# Navigate to tests directory
cd "/Users/mmoola/Cursor/Dependency Management App/tests"

# Install dependencies (first time only)
pip install -r requirements.txt

# Make scripts executable (macOS/Linux)
chmod +x setup_and_run.sh
chmod +x run_tests.py
```

---

## 🚀 Quick Start Commands

### Using the Automated Scripts (Recommended)

#### **Linux/macOS - Bash Script**
```bash
# Complete setup and run smoke tests
./setup_and_run.sh run smoke

# Set up environment only
./setup_and_run.sh setup

# Run different test types
./setup_and_run.sh run all        # Complete test suite (15-30 minutes)
./setup_and_run.sh run ui         # UI tests only
./setup_and_run.sh run api        # API tests only
./setup_and_run.sh run auth       # Authentication tests
./setup_and_run.sh run crud       # CRUD operation tests
./setup_and_run.sh run filter     # Search and filter tests

# Run with visible browser (not headless)
./setup_and_run.sh run smoke --visible

# Clean up old results
./setup_and_run.sh cleanup
```

#### **Windows - PowerShell Script**
```powershell
# Complete setup and run smoke tests
.\setup_and_run.ps1 run smoke

# Set up environment only
.\setup_and_run.ps1 setup

# Run different test types
.\setup_and_run.ps1 run all        # Complete test suite
.\setup_and_run.ps1 run ui         # UI tests only
.\setup_and_run.ps1 run api        # API tests only
.\setup_and_run.ps1 run auth       # Authentication tests
.\setup_and_run.ps1 run crud       # CRUD operation tests
.\setup_and_run.ps1 run filter     # Search and filter tests

# Run with visible browser
.\setup_and_run.ps1 run smoke -Visible

# Use different browser
.\setup_and_run.ps1 run smoke -Browser Firefox

# Don't open report after tests
.\setup_and_run.ps1 run smoke -NoReport

# Clean up old results
.\setup_and_run.ps1 cleanup
```

#### **Python Test Runner (Cross-Platform)**
```bash
# Run smoke tests (fastest, ~5 minutes)
python run_tests.py --tags smoke --headless

# Run complete test suite with parallel execution
python run_tests.py --parallel --headless

# Run specific test suite
python run_tests.py --suite 01_authentication_tests
python run_tests.py --suite 02_dependency_crud_tests
python run_tests.py --suite 03_filtering_search_tests
python run_tests.py --suite 04_api_tests

# Run with different browsers
python run_tests.py --browser Chrome --tags smoke
python run_tests.py --browser Firefox --tags smoke
python run_tests.py --browser Safari --tags smoke    # macOS only
python run_tests.py --browser Edge --tags smoke      # Windows

# Run with visible browser (for debugging)
python run_tests.py --tags smoke    # Remove --headless for visible

# Run tests by tags
python run_tests.py --tags "smoke" --headless
python run_tests.py --tags "crud" --headless
python run_tests.py --tags "api" --headless
python run_tests.py --tags "NOT api" --headless      # Exclude API tests

# Don't open HTML report after completion
python run_tests.py --tags smoke --headless --no-report

# List available test suites
python run_tests.py --list-suites

# Clean up old results (files older than 7 days)
python run_tests.py --cleanup 7
```

---

## 🛠️ Direct Robot Framework Commands

### Basic Robot Commands
```bash
# Run all test suites
robot --outputdir results/reports test_suites/

# Run specific test suite
robot --outputdir results/reports test_suites/01_authentication_tests.robot
robot --outputdir results/reports test_suites/02_dependency_crud_tests.robot
robot --outputdir results/reports test_suites/03_filtering_search_tests.robot
robot --outputdir results/reports test_suites/04_api_tests.robot

# Run tests with tags
robot --outputdir results/reports --include smoke test_suites/
robot --outputdir results/reports --include crud test_suites/
robot --outputdir results/reports --include api test_suites/
robot --outputdir results/reports --exclude api test_suites/

# Run with specific browser
robot --outputdir results/reports --variable BROWSER:Chrome test_suites/
robot --outputdir results/reports --variable BROWSER:Firefox test_suites/
robot --outputdir results/reports --variable BROWSER:Safari test_suites/    # macOS
robot --outputdir results/reports --variable BROWSER:Edge test_suites/      # Windows

# Run in headless mode
robot --outputdir results/reports --variable HEADLESS_MODE:True test_suites/

# Run with custom output names
robot --outputdir results/reports \
      --output smoke_output.xml \
      --log smoke_log.html \
      --report smoke_report.html \
      --include smoke test_suites/

# Run with debug logging
robot --outputdir results/reports --loglevel DEBUG test_suites/

# Run with custom variables
robot --outputdir results/reports \
      --variable APP_URL:http://localhost:3000 \
      --variable BROWSER:Chrome \
      --variable IMPLICIT_WAIT:15 \
      test_suites/
```

### Advanced Robot Commands
```bash
# Parallel execution using pabot
pabot --processes 4 --outputdir results/reports test_suites/

# Run with test data file
robot --outputdir results/reports --variablefile config/test_config.yaml test_suites/

# Run with custom timeout
robot --outputdir results/reports --variable TIMEOUT:30 test_suites/

# Run specific test cases
robot --outputdir results/reports --test "TC001 - Verify Landing Page Loads Successfully" test_suites/
robot --outputdir results/reports --test "*Login*" test_suites/

# Run and generate JUnit XML for CI/CD
robot --outputdir results/reports --xunit junit.xml test_suites/

# Run with random test order
robot --outputdir results/reports --randomize tests test_suites/

# Run with retry on failure
robot --outputdir results/reports --rerunfailed results/reports/output.xml test_suites/
```

---

## 📊 Test Execution Examples by Scenario

### 1. Quick Smoke Test (5-10 minutes)
```bash
# Fastest way to verify basic functionality
python run_tests.py --tags smoke --headless --browser Chrome
```

### 2. Complete Regression Test (15-30 minutes)
```bash
# Full test suite for release validation
python run_tests.py --parallel --headless --browser Chrome
```

### 3. Authentication Testing
```bash
# Focus on login/logout functionality
python run_tests.py --suite 01_authentication_tests --headless
```

### 4. CRUD Operations Testing
```bash
# Test all create, read, update, delete operations
python run_tests.py --suite 02_dependency_crud_tests --headless
```

### 5. Search and Filter Testing
```bash
# Test all search and filtering functionality
python run_tests.py --suite 03_filtering_search_tests --headless
```

### 6. API Integration Testing
```bash
# Test all REST API endpoints
python run_tests.py --suite 04_api_tests
```

### 7. Cross-Browser Testing
```bash
# Test in multiple browsers (run separately)
python run_tests.py --tags smoke --browser Chrome --headless
python run_tests.py --tags smoke --browser Firefox --headless
python run_tests.py --tags smoke --browser Edge --headless      # Windows
python run_tests.py --tags smoke --browser Safari --headless    # macOS
```

### 8. Debug Mode (Visible Browser)
```bash
# Run with visible browser for debugging
python run_tests.py --tags smoke --browser Chrome    # Remove --headless
```

### 9. CI/CD Integration
```bash
# Automated testing in continuous integration
python run_tests.py --parallel --headless --no-report --browser Chrome
```

### 10. Custom Test Run
```bash
# Combine multiple test types
robot --outputdir results/reports \
      --include "smoke OR api" \
      --variable BROWSER:Chrome \
      --variable HEADLESS_MODE:True \
      test_suites/
```

---

## 📈 Test Execution Results

### Result Files Location
```
tests/results/
├── reports/
│   ├── report_TIMESTAMP.html       # Main HTML test report
│   ├── log_TIMESTAMP.html          # Detailed execution log
│   └── output_TIMESTAMP.xml        # Machine-readable results
├── screenshots/
│   └── screenshot_TIMESTAMP.png    # Failure screenshots
└── logs/
    └── execution_TIMESTAMP.log     # System logs
```

### Understanding Test Results
```bash
# View latest HTML report (automatically opens)
# Report contains:
# - Test execution summary
# - Pass/fail statistics
# - Detailed test case results
# - Screenshots for failed tests
# - Execution timeline
# - Log messages and errors

# Check test statistics
grep -r "PASS\|FAIL" results/reports/output*.xml

# View failed test details
grep -A5 -B5 "FAIL" results/reports/log*.html
```

---

## 🔧 Troubleshooting Commands

### Common Issues and Solutions

#### 1. Application Not Running
```bash
# Check if application is accessible
curl -I http://localhost:3000

# Start application if needed
cd "/Users/mmoola/Cursor/Dependency Management App/frontend"
node serve_complete.js &    # Run in background

# Wait for application to be ready
sleep 10
```

#### 2. Browser Driver Issues
```bash
# Update WebDriver (handled automatically by webdriver-manager)
pip install --upgrade webdriver-manager selenium

# Clear WebDriver cache
rm -rf ~/.wdm/    # Linux/macOS
# or manually delete WebDriver cache directory
```

#### 3. Permission Issues
```bash
# Make scripts executable
chmod +x setup_and_run.sh
chmod +x run_tests.py

# Fix Python permissions
python -m pip install --user -r requirements.txt
```

#### 4. Port Conflicts
```bash
# Check what's using port 3000
lsof -i :3000
netstat -an | grep 3000

# Kill process if needed
kill -9 <PID>
```

#### 5. Test Environment Issues
```bash
# Reset test environment
rm -rf venv/
python -m venv venv
source venv/bin/activate    # Linux/macOS
pip install -r requirements.txt
```

#### 6. Clean Up and Reset
```bash
# Clean all test results
rm -rf results/reports/* results/screenshots/* results/logs/*

# or use the cleanup command
python run_tests.py --cleanup 1    # Remove all files older than 1 day
```

---

## 📝 Test Execution Checklist

### Pre-Test Setup
- [ ] DepFlow application is running on localhost:3000
- [ ] Test dependencies are installed (`pip install -r requirements.txt`)
- [ ] Scripts have execute permissions
- [ ] Browser is installed and accessible
- [ ] Network connectivity is available

### During Test Execution
- [ ] Monitor console output for errors
- [ ] Check that tests are progressing (not stuck)
- [ ] Verify browser windows open/close properly (if visible)
- [ ] Watch for any system resource issues

### Post-Test Review
- [ ] Review HTML test report for results
- [ ] Check failed test screenshots
- [ ] Analyze error logs for recurring issues
- [ ] Clean up old test results if needed
- [ ] Update test documentation if issues found

---

## 🎯 Best Practices

### 1. Regular Test Execution
```bash
# Daily smoke tests
python run_tests.py --tags smoke --headless

# Weekly full regression
python run_tests.py --parallel --headless

# Before releases
python run_tests.py --parallel --browser Chrome --browser Firefox
```

### 2. Test Data Management
```bash
# Tests automatically create and clean up test data
# No manual cleanup required for standard test runs

# If tests are interrupted, restart application to reset state
cd frontend && node serve_complete.js
```

### 3. Reporting and Monitoring
```bash
# Generate timestamped reports
python run_tests.py --tags smoke --headless

# Archive important test results
mkdir -p archived_results/$(date +%Y%m%d)
cp -r results/reports/* archived_results/$(date +%Y%m%d)/
```

### 4. Performance Optimization
```bash
# Use headless mode for faster execution
python run_tests.py --headless --tags smoke

# Use parallel execution for large test suites
python run_tests.py --parallel --headless

# Clean up old results regularly
python run_tests.py --cleanup 7
```

---

## 📞 Support

### If Tests Fail
1. **Check the HTML report** for detailed error information
2. **Review screenshots** of failed test steps
3. **Verify application is running** and accessible
4. **Check browser compatibility** and versions
5. **Review test logs** for system-level issues

### Getting Help
- **Documentation**: Check test framework README.md
- **Application Logs**: Review DepFlow server console output
- **System Requirements**: Verify all prerequisites are met
- **Contact Support**: Reach out to your system administrator

---

**🎉 Happy Testing with DepFlow Robot Framework!**

*All tests are designed to be reliable, maintainable, and provide clear reporting. The framework supports enterprise-level testing requirements and can be integrated into CI/CD pipelines.*

