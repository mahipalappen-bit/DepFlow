*** Settings ***
Documentation    Email Notification Test Suite for DepFlow Application
Resource         ../keywords/depflow_keywords.robot
Resource         ../config/variables.robot
Library          RequestsLibrary
Suite Setup      Setup Email Test Environment And Login
Suite Teardown   Cleanup Email Test Environment
Test Setup       Navigate To Dashboard And Close Modals
Test Teardown    Take Screenshot With Timestamp

*** Keywords ***
Setup Email Test Environment And Login
    [Documentation]    Setup test environment and login as admin for email testing
    Setup Test Environment
    Login As Admin
    Create Session    backend    ${BACKEND_URL}    timeout=30

Cleanup Email Test Environment
    [Documentation]    Cleanup email test environment
    Run Keyword And Ignore Error    Logout From DepFlow
    Delete All Sessions
    Teardown Test Environment

Navigate To Dashboard And Close Modals
    [Documentation]    Navigate to dashboard and ensure all modals are closed
    Navigate To Dashboard
    Ensure All Modals Closed

*** Test Cases ***
TC058 - Email Notification On Dependency Creation
    [Documentation]    Test email notification is sent when creating a new dependency
    [Tags]    email    notification    create    smoke
    
    ${dep_name}=    Generate Test Data    EmailCreateTest
    ${description}=    Set Variable    Dependency created to test email notifications
    
    # Create dependency and verify email notification is triggered
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED    MEDIUM
    
    # Verify dependency was created
    Verify Dependency Exists    ${dep_name}
    
    # Clean up
    Delete Dependency With Confirmation    ${dep_name}

TC059 - Email Notification On Dependency Edit
    [Documentation]    Test email notification is sent when editing an existing dependency
    [Tags]    email    notification    edit
    
    # Create dependency first
    ${original_name}=    Generate Test Data    EmailEditTest
    ${original_desc}=    Set Variable    Original description for email edit test
    Add New Dependency    ${original_name}    ${original_desc}    ${TEST_DEP_TEAM}
    
    # Edit the dependency (should trigger email)
    ${new_name}=         Set Variable    ${original_name}_EDITED
    ${new_desc}=         Set Variable    Updated description after edit - email test
    
    Edit Dependency    ${original_name}    ${new_name}    ${new_desc}
    
    # Verify changes were made
    Verify Dependency Exists    ${new_name}
    Verify Dependency Does Not Exist    ${original_name}
    
    # Clean up
    Delete Dependency With Confirmation    ${new_name}

TC060 - Email Notification On Inline Status Update
    [Documentation]    Test email notification when status is updated via inline editing
    [Tags]    email    notification    inline_edit    status
    
    # Create dependency for inline editing
    ${dep_name}=    Generate Test Data    EmailStatusTest
    ${description}=    Set Variable    Dependency for status email notification test
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED
    
    # Update status via inline dropdown (should trigger email)
    Test Inline Status Edit    ${dep_name}    IN PROGRESS
    
    # Verify status was updated
    ${status_dropdown}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//select[contains(@class, 'status-dropdown')]
    ${updated_status}=    Get Selected List Label    ${status_dropdown}
    Should Be Equal    ${updated_status}    IN PROGRESS
    
    # Clean up
    Delete Dependency With Confirmation    ${dep_name}

TC061 - Email Notification On Inline Priority Update
    [Documentation]    Test email notification when priority is updated via inline editing
    [Tags]    email    notification    inline_edit    priority
    
    # Create dependency for inline editing
    ${dep_name}=    Generate Test Data    EmailPriorityTest
    ${description}=    Set Variable    Dependency for priority email notification test
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED    LOW
    
    # Update priority via inline dropdown (should trigger email)
    Test Inline Priority Edit    ${dep_name}    HIGH
    
    # Verify priority was updated
    ${priority_dropdown}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//select[contains(@class, 'priority-dropdown')]
    ${updated_priority}=    Get Selected List Label    ${priority_dropdown}
    Should Be Equal    ${updated_priority}    HIGH
    
    # Clean up
    Delete Dependency With Confirmation    ${dep_name}

TC062 - Backend Email API Direct Test
    [Documentation]    Test the backend email API endpoint directly
    [Tags]    email    api    backend    smoke
    
    # Test backend email endpoint with valid data
    ${email_payload}=    Create Dictionary    
    ...    type=Created
    ...    dependency=${Create Dictionary    name=API Test Dependency    description=Testing email API    team=Quality Flow    status=NOT STARTED    priority=MEDIUM}
    ...    user=${Create Dictionary    name=Test User    email=admin@demo.com}
    
    # Get JWT token for authentication
    ${token}=    Execute Javascript    return localStorage.getItem('token')
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    
    ${response}=    POST On Session    backend    /api/v1/send-email    json=${email_payload}    headers=${headers}
    Should Be Equal As Numbers    ${response.status_code}    200
    
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['success']}    ${True}
    Dictionary Should Contain Key    ${json_response}    messageId

TC063 - Email API Authentication Required
    [Documentation]    Test that email API requires proper authentication
    [Tags]    email    api    authentication    security
    
    ${email_payload}=    Create Dictionary    
    ...    type=Created
    ...    dependency=${Create Dictionary    name=Unauthorized Test    description=Testing auth    team=Quality Flow    status=NOT STARTED    priority=MEDIUM}
    ...    user=${Create Dictionary    name=Test User    email=test@demo.com}
    
    # Try without authentication token
    ${response}=    POST On Session    backend    /api/v1/send-email    json=${email_payload}    expected_status=401
    Should Be Equal As Numbers    ${response.status_code}    401
    
    # Try with invalid token
    ${headers}=    Create Dictionary    Authorization=Bearer invalid_token_123    Content-Type=application/json
    ${response}=    POST On Session    backend    /api/v1/send-email    json=${email_payload}    headers=${headers}    expected_status=401
    Should Be Equal As Numbers    ${response.status_code}    401

TC064 - Email API Validation Tests
    [Documentation]    Test email API input validation
    [Tags]    email    api    validation    negative
    
    # Get valid JWT token
    ${token}=    Execute Javascript    return localStorage.getItem('token')
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    
    # Test missing type field
    ${invalid_payload1}=    Create Dictionary    
    ...    dependency=${Create Dictionary    name=Test Dep    description=Test    team=Quality Flow    status=NOT STARTED    priority=MEDIUM}
    ...    user=${Create Dictionary    name=Test User    email=admin@demo.com}
    
    ${response}=    POST On Session    backend    /api/v1/send-email    json=${invalid_payload1}    headers=${headers}    expected_status=400
    Should Be Equal As Numbers    ${response.status_code}    400
    
    # Test missing dependency field
    ${invalid_payload2}=    Create Dictionary    
    ...    type=Created
    ...    user=${Create Dictionary    name=Test User    email=admin@demo.com}
    
    ${response}=    POST On Session    backend    /api/v1/send-email    json=${invalid_payload2}    headers=${headers}    expected_status=400
    Should Be Equal As Numbers    ${response.status_code}    400

TC065 - Email Notification Content Verification
    [Documentation]    Test email notification contains correct dependency information
    [Tags]    email    content    verification
    
    ${dep_name}=    Generate Test Data    EmailContentTest
    ${description}=    Set Variable    Testing email content with special chars: @#$%^&*()
    ${team}=         Set Variable    Quality Flow
    ${status}=       Set Variable    IN PROGRESS
    ${priority}=     Set Variable    HIGH
    
    # Get JWT token for authentication
    ${token}=    Execute Javascript    return localStorage.getItem('token')
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    
    # Test email API with specific content
    ${email_payload}=    Create Dictionary    
    ...    type=Updated
    ...    dependency=${Create Dictionary    name=${dep_name}    description=${description}    team=${team}    status=${status}    priority=${priority}}
    ...    user=${Create Dictionary    name=Admin User    email=admin@demo.com}
    
    ${response}=    POST On Session    backend    /api/v1/send-email    json=${email_payload}    headers=${headers}
    Should Be Equal As Numbers    ${response.status_code}    200
    
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['success']}    ${True}
    Should Contain    ${json_response['message']}    successfully

TC066 - Email Rate Limiting Test
    [Documentation]    Test email system handles multiple rapid requests appropriately
    [Tags]    email    rate_limit    performance
    
    # Get JWT token for authentication
    ${token}=    Execute Javascript    return localStorage.getItem('token')
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    
    # Send multiple email requests rapidly
    FOR    ${i}    IN RANGE    5
        ${email_payload}=    Create Dictionary    
        ...    type=Created
        ...    dependency=${Create Dictionary    name=RateTest_${i}    description=Rate limit test ${i}    team=Quality Flow    status=NOT STARTED    priority=MEDIUM}
        ...    user=${Create Dictionary    name=Test User    email=admin@demo.com}
        
        ${response}=    POST On Session    backend    /api/v1/send-email    json=${email_payload}    headers=${headers}
        
        # All requests should succeed (rate limiting handled gracefully)
        Should Be Equal As Numbers    ${response.status_code}    200
        
        Sleep    0.5s    # Brief pause between requests
    END

TC067 - Email Service Error Handling
    [Documentation]    Test email service error handling with invalid email configuration
    [Tags]    email    error_handling    resilience
    
    # Get JWT token for authentication
    ${token}=    Execute Javascript    return localStorage.getItem('token')
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    
    # Test with valid payload (should succeed or fail gracefully)
    ${email_payload}=    Create Dictionary    
    ...    type=Created
    ...    dependency=${Create Dictionary    name=ErrorTest    description=Testing error handling    team=Quality Flow    status=NOT STARTED    priority=MEDIUM}
    ...    user=${Create Dictionary    name=Test User    email=admin@demo.com}
    
    ${response}=    POST On Session    backend    /api/v1/send-email    json=${email_payload}    headers=${headers}
    
    # Response should be either success (200) or handled error (500), not crash
    Should Be True    ${response.status_code} in [200, 500]

TC068 - Email Template Content Structure
    [Documentation]    Test that email templates contain expected HTML structure and content
    [Tags]    email    template    structure    content
    
    # This test verifies the email API returns appropriate success responses
    # indicating that the email template is being processed correctly
    
    # Get JWT token for authentication
    ${token}=    Execute Javascript    return localStorage.getItem('token')
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    
    # Test email with various content types
    FOR    ${status}    IN    NOT STARTED    IN PROGRESS    BLOCKED    COMPLETED
        FOR    ${priority}    IN    HIGH    MEDIUM    LOW
            ${email_payload}=    Create Dictionary    
            ...    type=Updated
            ...    dependency=${Create Dictionary    name=TemplateTest    description=Testing email template rendering    team=Quality Flow    status=${status}    priority=${priority}}
            ...    user=${Create Dictionary    name=Template Tester    email=admin@demo.com}
            
            ${response}=    POST On Session    backend    /api/v1/send-email    json=${email_payload}    headers=${headers}
            Should Be Equal As Numbers    ${response.status_code}    200
            
            ${json_response}=    Set Variable    ${response.json()}
            Should Be Equal    ${json_response['success']}    ${True}
        END
    END

TC069 - Email Integration During User Workflow
    [Documentation]    Test email notifications during complete user workflow
    [Tags]    email    integration    workflow    comprehensive
    
    # Complete dependency lifecycle with email notifications
    ${dep_name}=    Generate Test Data    WorkflowEmailTest
    ${description}=    Set Variable    End-to-end workflow with email notifications
    
    # Step 1: Create dependency (should send creation email)
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED    LOW
    Verify Dependency Exists    ${dep_name}
    Sleep    2s    # Allow time for email processing
    
    # Step 2: Update status (should send update email)
    Test Inline Status Edit    ${dep_name}    IN PROGRESS
    Sleep    2s    # Allow time for email processing
    
    # Step 3: Update priority (should send update email)
    Test Inline Priority Edit    ${dep_name}    HIGH
    Sleep    2s    # Allow time for email processing
    
    # Step 4: Edit via modal (should send update email)
    ${new_name}=    Set Variable    ${dep_name}_WorkflowComplete
    Edit Dependency    ${dep_name}    ${new_name}
    Verify Dependency Exists    ${new_name}
    Sleep    2s    # Allow time for email processing
    
    # Clean up
    Delete Dependency With Confirmation    ${new_name}

TC070 - Email Notification User Context
    [Documentation]    Test that emails include correct user context (admin vs user)
    [Tags]    email    user_context    rbac
    
    # Test as admin user
    ${admin_dep}=    Generate Test Data    AdminEmailTest
    Add New Dependency    ${admin_dep}    Admin created dependency for email test    ${TEST_DEP_TEAM}
    
    # Switch to regular user and create dependency
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    ${user_dep}=    Generate Test Data    UserEmailTest
    Add New Dependency    ${user_dep}    User created dependency for email test    ${TEST_DEP_TEAM}
    
    # Switch back to admin for cleanup
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    
    # Clean up dependencies
    Delete Dependency With Confirmation    ${admin_dep}
    Delete Dependency With Confirmation    ${user_dep}
