*** Settings ***
Documentation    Global variables for DepFlow test automation

*** Variables ***
# Application Configuration
${APP_URL}              http://localhost:3000
${APP_NAME}             DepFlow - Enterprise Dependency Management Platform
${BROWSER}              Chrome
${IMPLICIT_WAIT}        10
${EXPLICIT_WAIT}        30

# Test User Credentials
${ADMIN_USERNAME}       admin@depflow.com
${ADMIN_PASSWORD}       admin123
${USER_USERNAME}        user@depflow.com  
${USER_PASSWORD}        user123

# API Configuration
${API_BASE_URL}         http://localhost:3000/api
${API_TIMEOUT}          30

# Test Data
${TEST_DEP_NAME}        Robot Framework Test Dependency
${TEST_DEP_DESC}        This dependency was created by automated Robot Framework tests
${TEST_DEP_TEAM}        Annotation tools
${TEST_DEP_STATUS}      NOT STARTED
${TEST_DEP_PRIORITY}    MEDIUM
${TEST_DEP_RISK}        LOW
${TEST_JIRA_URL}        https://jira.example.com/RF-TEST-123

# Email Configuration
${TEST_EMAIL_RECIPIENT}    mmahipal.reddy@gmail.com

# Teams List
@{TEAMS}                Quality flow    Annotation tools    Data Collection    ADAP Platform    CrowdGen    Mercury    Marketing Cloud    Data Engineering    Analytics    Product Management

# Status List  
@{STATUSES}             NOT STARTED    IN PROGRESS    BLOCKED    COMPLETED

# Priority List
@{PRIORITIES}           HIGH    MEDIUM    LOW

# Risk Levels
@{RISK_LEVELS}          HIGH    MEDIUM    LOW

# Browser Configuration
${BROWSER_WIDTH}        1920
${BROWSER_HEIGHT}       1080
${HEADLESS_MODE}        False

# Timeouts (in seconds)
${SHORT_WAIT}           5
${MEDIUM_WAIT}          15  
${LONG_WAIT}            30

# Test Environment
${SCREENSHOTS_DIR}      ${EXECDIR}/results/screenshots
${REPORTS_DIR}          ${EXECDIR}/results/reports
${LOGS_DIR}             ${EXECDIR}/results/logs

