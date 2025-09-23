*** Settings ***
Documentation    Global variables for DepFlow test automation

*** Variables ***
# Application Configuration
${APP_URL}              http://localhost:3000
${BACKEND_URL}          http://localhost:8000
${APP_NAME}             DepFlow - Enterprise Dependency Management Platform
${BROWSER}              Chrome
${IMPLICIT_WAIT}        10
${EXPLICIT_WAIT}        30

# Test User Credentials (Updated for new authentication system)
${ADMIN_USERNAME}       admin@demo.com
${ADMIN_PASSWORD}       admin123456
${USER_USERNAME}        user@demo.com  
${USER_PASSWORD}        user123456

# API Configuration (Updated for new backend port)
${API_BASE_URL}         http://localhost:8000/api/v1
${API_TIMEOUT}          30

# Test Data
${TEST_DEP_NAME}        Robot Framework Test Dependency
${TEST_DEP_DESC}        This dependency was created by automated Robot Framework tests
${TEST_DEP_TEAM}        Quality Flow
${TEST_DEP_STATUS}      NOT STARTED
${TEST_DEP_PRIORITY}    MEDIUM
${TEST_DEP_RISK}        LOW
${TEST_JIRA_URL}        https://jira.example.com/RF-TEST-123

# Email Configuration
${TEST_EMAIL_RECIPIENT}    mmahipal.reddy@gmail.com
${SENDER_EMAIL}            mahipal.appen@gmail.com

# Frontend Server Configuration
${FRONTEND_SERVER_URL}     http://localhost:3000

# Teams List (Updated to match current application HTML exactly)
@{TEAMS}                Crowdgen    Annotation Tools    ADAP Platform    Product Management    Quality Flow    Data Collection

# Status List  
@{STATUSES}             NOT STARTED    IN PROGRESS    BLOCKED    COMPLETED

# Priority List
@{PRIORITIES}           HIGH    MEDIUM    LOW

# Risk Levels (Note: Risk column has been removed in current version)
@{RISK_LEVELS}          HIGH    MEDIUM    LOW

# Authentication Test Data
@{VALID_ADMIN_CREDENTIALS}     admin@demo.com    admin123456
@{VALID_USER_CREDENTIALS}      user@demo.com     user123456
@{INVALID_CREDENTIALS}         invalid@demo.com  wrongpassword

# UI Color Testing
@{STATUS_COLORS}        22c55e    0ea5e9    f56565    71717a    # Green, Blue, Red, Gray
@{PRIORITY_COLORS}      f56565    fbbf24    22c55e              # Red, Amber, Green

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

# Notification System
${NOTIFICATION}         id:notification

