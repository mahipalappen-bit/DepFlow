# DepFlow Test Automation Framework

## Overview

This is a comprehensive test automation framework for the **DepFlow - Enterprise Dependency Management Platform** built using Robot Framework with Python. The framework provides automated testing for UI functionality, API endpoints, and end-to-end workflows.

## Framework Structure

```
tests/
├── README.md                     # This file
├── requirements.txt              # Python dependencies
├── run_tests.py                  # Main test runner script
├── config/
│   ├── test_config.yaml         # Test configuration
│   └── variables.robot          # Robot Framework variables
├── keywords/
│   └── depflow_keywords.robot   # Reusable keywords and page objects
├── test_suites/
│   ├── 01_authentication_tests.robot    # Login/logout tests
│   ├── 02_dependency_crud_tests.robot   # CRUD operation tests
│   ├── 03_filtering_search_tests.robot  # Search and filter tests
│   └── 04_api_tests.robot               # API endpoint tests
└── results/                     # Test results (auto-generated)
    ├── reports/                 # HTML test reports
    ├── logs/                    # Test execution logs
    └── screenshots/             # Test screenshots
```

## Prerequisites

### Software Requirements

1. **Python 3.8+**
2. **Node.js** (for running the DepFlow application)
3. **Chrome Browser** (default for testing)
4. **Git** (for version control)

### Application Requirements

1. **DepFlow application** must be running on `http://localhost:3000`
2. **Email configuration** should be properly set up for email testing

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Dependency Management App"
```

### 2. Set Up Test Environment
```bash
cd tests
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Install WebDriver (Chrome)
```bash
# WebDriver will be automatically managed by webdriver-manager
# No manual installation required
```

### 4. Start DepFlow Application
```bash
cd ../frontend
node serve_complete.js
```

## Running Tests

### Using the Test Runner Script (Recommended)

#### Run All Tests
```bash
python run_tests.py
```

#### Run Specific Test Suite
```bash
python run_tests.py --suite 01_authentication_tests
```

#### Run Tests by Tags
```bash
# Run only smoke tests
python run_tests.py --tags smoke

# Run all tests except API tests
python run_tests.py --tags "NOT api"
```

#### Run Tests in Different Browser
```bash
python run_tests.py --browser Firefox
```

#### Run Tests in Headless Mode
```bash
python run_tests.py --headless
```

#### Run Tests in Parallel
```bash
python run_tests.py --parallel
```

#### List Available Test Suites
```bash
python run_tests.py --list-suites
```

### Using Robot Framework Directly

#### Run All Tests
```bash
robot --outputdir results/reports test_suites/
```

#### Run Specific Test Suite
```bash
robot --outputdir results/reports test_suites/01_authentication_tests.robot
```

#### Run Tests with Tags
```bash
robot --outputdir results/reports --include smoke test_suites/
```

## Test Suites Overview

### 1. Authentication Tests (01_authentication_tests.robot)
- **Purpose**: Tests login, logout, and authentication flows
- **Test Cases**: 12 test cases
- **Coverage**: 
  - Landing page verification
  - Login modal functionality
  - Admin and manual login
  - Invalid credentials handling
  - Session persistence
  - User role display

### 2. Dependency CRUD Tests (02_dependency_crud_tests.robot)
- **Purpose**: Tests Create, Read, Update, Delete operations for dependencies
- **Test Cases**: 16 test cases
- **Coverage**:
  - Add new dependencies
  - Edit existing dependencies
  - Delete dependencies
  - Form validation
  - Counter updates
  - Bulk operations

### 3. Filtering and Search Tests (03_filtering_search_tests.robot)
- **Purpose**: Tests search functionality and filtering capabilities
- **Test Cases**: 22 test cases
- **Coverage**:
  - Search by name and description
  - Filter by team, status, priority
  - Combined filters
  - Counter-based filtering
  - Clear filters functionality

### 4. API Tests (04_api_tests.robot)
- **Purpose**: Tests REST API endpoints
- **Test Cases**: 20 test cases
- **Coverage**:
  - Email API endpoint
  - Dependencies creation API
  - Error handling and validation
  - Response structure validation
  - Performance testing

## Test Tags

Tests are organized using the following tags:

- **smoke**: Critical functionality tests
- **api**: API-related tests
- **ui**: User interface tests
- **crud**: Create/Read/Update/Delete tests
- **authentication**: Login/logout tests
- **filter**: Search and filtering tests
- **negative**: Error handling tests
- **validation**: Input validation tests
- **performance**: Performance-related tests

## Configuration

### Test Configuration (config/test_config.yaml)

Key configuration options:
- Application URL and browser settings
- User credentials for testing
- Test data templates
- Email configuration
- API endpoints and timeouts

### Variables (config/variables.robot)

Robot Framework variables including:
- Application URLs and timeouts
- Test user credentials
- Element locators
- Test data values

## Test Data Management

### Test Users
- **Admin User**: `admin@depflow.com` / `admin123`
- **Regular User**: `user@depflow.com` / `user123`

### Test Dependencies
Tests create and clean up their own test data using unique naming patterns to avoid conflicts.

## Reporting

### HTML Reports
After test execution, HTML reports are generated in `results/reports/`:
- **report_TIMESTAMP.html**: Comprehensive test report
- **log_TIMESTAMP.html**: Detailed execution log
- **output_TIMESTAMP.xml**: Machine-readable results

### Screenshots
Screenshots are automatically captured:
- On test failures
- At the end of each test case
- During critical test steps

## Troubleshooting

### Common Issues

#### 1. Application Not Running
```
Error: Connection refused to localhost:3000
```
**Solution**: Start the DepFlow application first:
```bash
cd frontend && node serve_complete.js
```

#### 2. WebDriver Issues
```
Error: ChromeDriver not found
```
**Solution**: WebDriver is managed automatically. If issues persist:
```bash
pip install --upgrade webdriver-manager
```

#### 3. Element Not Found
```
Error: Element not located
```
**Solution**: Check if application is fully loaded. Increase wait times in variables.robot if needed.

#### 4. Permission Denied on run_tests.py
```bash
chmod +x run_tests.py
```

### Debug Mode

Run tests with verbose logging:
```bash
robot --loglevel DEBUG --outputdir results/reports test_suites/
```

Enable browser debugging:
```bash
python run_tests.py --browser Chrome --no-headless
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: DepFlow Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: |
          cd tests
          pip install -r requirements.txt
      - name: Start DepFlow App
        run: |
          cd frontend
          npm install
          node serve_complete.js &
          sleep 10
      - name: Run Tests
        run: |
          cd tests
          python run_tests.py --headless --no-report
```

## Best Practices

### 1. Test Organization
- Keep test suites focused on specific functionality
- Use descriptive test case names
- Group related tests using tags

### 2. Test Data
- Use unique test data for each test run
- Clean up test data after execution
- Avoid hardcoded test values

### 3. Element Locators
- Use stable locators (ID > CSS > XPath)
- Avoid brittle selectors dependent on layout
- Centralize locators in keywords file

### 4. Assertions
- Use specific assertions over generic ones
- Provide meaningful error messages
- Verify both positive and negative scenarios

## Maintenance

### Regular Tasks
- Review and update test cases for new features
- Update dependencies in requirements.txt
- Clean up old test results
- Review and optimize test execution times

### Cleanup Old Results
```bash
python run_tests.py --cleanup 7  # Remove files older than 7 days
```

## Support

For questions or issues with the test framework:
1. Check this README for common solutions
2. Review test logs in `results/logs/`
3. Enable debug mode for detailed information
4. Check application logs for server-side issues

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add appropriate tags for test organization
3. Update this README if adding new test suites
4. Ensure tests clean up their test data
5. Test both positive and negative scenarios

