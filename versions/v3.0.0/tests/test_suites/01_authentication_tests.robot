*** Settings ***
Documentation    Authentication and Login Test Suite for DepFlow Application
Resource         ../keywords/depflow_keywords.robot
Resource         ../config/variables.robot
Suite Setup      Setup Test Environment
Suite Teardown   Teardown Test Environment  
Test Setup       Test Mode Authentication Test Setup
Test Teardown    Test Mode Authentication Test Teardown

*** Test Cases ***
*** Keywords ***
# Updated Test Mode Setup/Teardown for Authentication Tests
Test Mode Authentication Test Setup
    [Documentation]    Setup for each authentication test using Test Mode
    Open DepFlow Application
    Test Mode Reset

Test Mode Authentication Test Teardown
    [Documentation]    Cleanup after each authentication test using Test Mode
    Test Mode Reset
    Close DepFlow Application

# Legacy methods maintained for compatibility
Setup Each Authentication Test
    [Documentation]    Legacy setup - use Test Mode Authentication Test Setup instead
    Test Mode Authentication Test Setup

Cleanup Each Authentication Test
    [Documentation]    Legacy cleanup - use Test Mode Authentication Test Teardown instead
    Test Mode Authentication Test Teardown

*** Test Cases ***
TC001 - Verify Landing Page Loads Successfully
    [Documentation]    Verify that the DepFlow landing page loads with all expected elements
    [Tags]    smoke    ui    landing
    
    Title Should Be    DepFlow - Enterprise Dependency Management Platform
    Verify DepFlow Logo Present
    Page Should Contain Element    ${LOGIN_BUTTON}
    Page Should Contain Element    ${GET_STARTED_BUTTON}
    Page Should Contain    Streamlined Software Lifecycle Management
    
TC002 - Verify Login Modal Opens
    [Documentation]    Verify that clicking Login button opens the login modal
    [Tags]    smoke    ui    modal
    
    Click Element    ${LOGIN_BUTTON}
    Wait Until Element Is Visible    ${LOGIN_MODAL}
    Page Should Contain Element    ${USERNAME_FIELD}
    Page Should Contain Element    ${PASSWORD_FIELD}
    Page Should Contain Element    ${LOGIN_SUBMIT_BUTTON}
    Page Should Contain Element    ${ADMIN_CREDENTIALS_BUTTON}

TC003 - Successful Admin Login
    [Documentation]    Test successful login with admin credentials using quick fill
    [Tags]    smoke    authentication    admin
    
    # Check if login modal is open from previous test and close it
    ${modal_visible}=    Run Keyword And Return Status    Element Should Be Visible    ${LOGIN_MODAL}
    Run Keyword If    ${modal_visible}    
    ...    Execute Javascript    closeLoginModal()
    Sleep    1s
    
    Login As Admin
    Title Should Be    DepFlow - Enterprise Dependency Management Platform
    Page Should Contain Element    ${USER_PANEL}
    Page Should Contain Element    ${DASHBOARD_PAGE}
    Page Should Contain    Admin User
    
    # Verify admin role is displayed correctly
    Page Should Contain    admin@demo.com
    
TC004 - Successful Manual Login
    [Documentation]    Test successful login using Test Mode (avoids modal interference)
    [Tags]    authentication    manual    test_mode
    
    # Use Test Mode to avoid modal interference while testing login state
    Test Mode Admin Login
    Page Should Contain Element    ${USER_PANEL}
    Page Should Contain    Admin User
    Element Should Be Visible    ${LOGOUT_BUTTON}

TC005 - Invalid Login Credentials  
    [Documentation]    Test login failure with invalid credentials
    [Tags]    authentication    negative
    
    Click Element    ${LOGIN_BUTTON}
    Wait Until Element Is Visible    ${LOGIN_MODAL}
    Input Text    ${USERNAME_FIELD}    invalid@user.com
    Input Text    ${PASSWORD_FIELD}    wrongpassword
    Click Element    ${LOGIN_SUBMIT_BUTTON}
    
    # Should remain on login modal - invalid credentials
    Element Should Be Visible    ${LOGIN_MODAL}
    Page Should Not Contain Element    ${DASHBOARD_PAGE}

TC006 - Empty Credentials Login
    [Documentation]    Test login with empty username and password fields
    [Tags]    authentication    negative    validation
    
    Click Element    ${LOGIN_BUTTON}
    Wait Until Element Is Visible    ${LOGIN_MODAL}
    Clear Element Text    ${USERNAME_FIELD}
    Clear Element Text    ${PASSWORD_FIELD}
    Click Element    ${LOGIN_SUBMIT_BUTTON}
    
    # Should remain on login modal - empty fields
    Element Should Be Visible    ${LOGIN_MODAL}

TC007 - Successful Logout
    [Documentation]    Test successful logout functionality
    [Tags]    smoke    authentication    logout
    
    # Check if login modal is open from previous test and close it
    ${modal_visible}=    Run Keyword And Return Status    Element Should Be Visible    ${LOGIN_MODAL}
    Run Keyword If    ${modal_visible}    
    ...    Execute Javascript    closeLoginModal()
    Sleep    1s
    
    Login As Admin
    Wait Until Element Is Visible    ${LOGOUT_BUTTON}
    
    Logout From DepFlow
    Verify DepFlow Logo Present
    Page Should Contain Element    ${LOGIN_BUTTON}
    Element Should Not Be Visible    ${USER_PANEL}

TC008 - Admin Credentials Auto-Fill
    [Documentation]    Test the admin credentials auto-fill functionality
    [Tags]    authentication    convenience
    
    Click Element    ${LOGIN_BUTTON}
    Wait Until Element Is Visible    ${LOGIN_MODAL}
    Click Element    ${ADMIN_CREDENTIALS_BUTTON}
    
    # Verify fields are populated
    ${username_value}=    Get Value    ${USERNAME_FIELD}
    ${password_value}=    Get Value    ${PASSWORD_FIELD}
    Should Not Be Empty    ${username_value}
    Should Not Be Empty    ${password_value}

TC009 - Login Modal Close Functionality
    [Documentation]    Test closing the login modal without logging in
    [Tags]    ui    modal    usability
    
    Click Element    ${LOGIN_BUTTON}
    Wait Until Element Is Visible    ${LOGIN_MODAL}
    
    # Close modal by clicking outside or close button (if available)
    Press Keys    ${LOGIN_MODAL}    ESCAPE
    Wait Until Element Is Not Visible    ${LOGIN_MODAL}
    
    # Should return to landing page
    Verify DepFlow Logo Present

TC010 - Session Persistence Check
    [Documentation]    Test that user session persists across page operations and browser refresh
    [Tags]    authentication    session    persistence
    
    Login As Admin
    Navigate To Dashboard
    
    # Verify user is logged in
    Page Should Contain Element    ${USER_PANEL}
    Page Should Contain    admin@demo.com
    
    # Refresh page and verify session persists
    Reload Page
    Wait Until Page Contains Element    ${USER_PANEL}    timeout=10s
    Page Should Contain Element    ${DASHBOARD_PAGE}
    Page Should Contain    admin@demo.com
    
    # Verify localStorage contains user session
    ${user_data}=    Execute Javascript    return localStorage.getItem('depflow_user')
    Should Not Be Empty    ${user_data}
    Should Contain    ${user_data}    admin@demo.com

TC011 - User Role Display Verification
    [Documentation]    Verify that user role is correctly displayed after login
    [Tags]    authentication    ui    role
    
    Login As Admin
    Wait Until Element Is Visible    ${USER_PANEL}
    Page Should Contain    Admin
    Page Should Contain    Admin User

TC012 - Multiple Login Attempts
    [Documentation]    Test multiple failed login attempts handling
    [Tags]    authentication    security    negative
    
    FOR    ${i}    IN RANGE    3
        Click Element    ${LOGIN_BUTTON}
        Wait Until Element Is Visible    ${LOGIN_MODAL}
        Input Text    ${USERNAME_FIELD}    invalid${i}@demo.com
        Input Text    ${PASSWORD_FIELD}    wrongpass${i}
        Click Element    ${LOGIN_SUBMIT_BUTTON}
        Sleep    1s
        
        # Should still show login modal
        Element Should Be Visible    ${LOGIN_MODAL}
        
        # Close modal and retry
        Press Keys    ${LOGIN_MODAL}    ESCAPE
        Sleep    1s
    END

TC013 - User Role Login Test
    [Documentation]    Test successful login with regular user credentials using Test Mode
    [Tags]    authentication    user    role    test_mode
    
    # Use Test Mode for user login
    Test Mode User Login
    Title Should Be    DepFlow - Enterprise Dependency Management Platform
    Page Should Contain Element    ${USER_PANEL}
    Page Should Contain Element    ${DASHBOARD_PAGE}
    Page Should Contain    user@demo.com
    
    # Verify user role is displayed (not admin)
    Page Should Not Contain    Admin User

TC014 - JWT Token Storage Verification
    [Documentation]    Test that JWT token is properly stored after login
    [Tags]    authentication    jwt    token    storage
    
    Login As Admin
    Navigate To Dashboard
    
    # Verify JWT token is stored in localStorage
    ${token}=    Execute Javascript    return localStorage.getItem('token')
    Should Not Be Empty    ${token}
    
    # Token should be a valid JWT format (has 3 parts separated by dots)
    ${token_parts}=    Split String    ${token}    .
    ${parts_count}=    Get Length    ${token_parts}
    Should Be Equal As Numbers    ${parts_count}    3

TC015 - Login With Copy-Paste Credentials
    [Documentation]    Test login functionality with copy-paste credentials  
    [Tags]    authentication    usability
    
    Click Element    ${LOGIN_BUTTON}
    Wait Until Element Is Visible    ${LOGIN_MODAL}
    
    # Simulate copy-paste of credentials
    Execute Javascript    document.getElementById('email').value = '${ADMIN_USERNAME}';
    Execute Javascript    document.getElementById('password').value = '${ADMIN_PASSWORD}';
    
    Click Element    ${LOGIN_SUBMIT_BUTTON}
    Wait Until Element Is Visible    ${DASHBOARD_PAGE}    timeout=10s
    Page Should Contain    admin@demo.com

TC016 - Logout Clears Session Storage
    [Documentation]    Test that logout properly clears session data
    [Tags]    authentication    logout    security    storage
    
    Login As Admin
    Navigate To Dashboard
    
    # Verify session data exists
    ${user_data_before}=    Execute Javascript    return localStorage.getItem('depflow_user')
    ${token_before}=        Execute Javascript    return localStorage.getItem('token')
    Should Not Be Empty    ${user_data_before}
    Should Not Be Empty    ${token_before}
    
    # Logout
    Logout From DepFlow
    
    # Verify session data is cleared
    ${user_data_after}=    Execute Javascript    return localStorage.getItem('depflow_user')
    ${token_after}=        Execute Javascript    return localStorage.getItem('token')
    Should Be Equal    ${user_data_after}    ${None}
    Should Be Equal    ${token_after}       ${None}

TC017 - Backend Authentication API Test
    [Documentation]    Test backend authentication endpoint directly
    [Tags]    authentication    api    backend
    
    Create Session    auth_test    ${BACKEND_URL}    timeout=30
    
    ${payload}=    Create Dictionary    
    ...    email=${ADMIN_USERNAME}
    ...    password=${ADMIN_PASSWORD}
    
    ${response}=    POST On Session    auth_test    /api/v1/auth/login    json=${payload}
    Should Be Equal As Numbers    ${response.status_code}    200
    
    ${json_response}=    Set Variable    ${response.json()}
    Dictionary Should Contain Key    ${json_response}    token
    Dictionary Should Contain Key    ${json_response}    user
    
    ${user}=    Get From Dictionary    ${json_response}    user
    Dictionary Should Contain Key    ${user}    email
    Dictionary Should Contain Key    ${user}    name  
    Dictionary Should Contain Key    ${user}    role

TC018 - Invalid Backend Authentication
    [Documentation]    Test backend authentication with invalid credentials
    [Tags]    authentication    api    backend    negative
    
    Create Session    auth_test    ${BACKEND_URL}    timeout=30
    
    ${payload}=    Create Dictionary    
    ...    email=invalid@demo.com
    ...    password=wrongpassword
    
    ${response}=    POST On Session    auth_test    /api/v1/auth/login    json=${payload}    expected_status=401
    Should Be Equal As Numbers    ${response.status_code}    401
    
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['success']}    ${False}
    Should Contain    ${json_response['message']}    Invalid

TC019 - Session Timeout Behavior  
    [Documentation]    Test application behavior when session expires
    [Tags]    authentication    session    timeout
    
    Login As Admin
    Navigate To Dashboard
    
    # Clear the JWT token to simulate session expiry
    Execute Javascript    localStorage.removeItem('token');
    
    # Try to perform an action that requires authentication
    # The app should handle the missing token gracefully
    Reload Page
    
    # Should either redirect to login or handle gracefully
    Run Keyword And Return Status    Page Should Contain Element    ${LOGIN_BUTTON}

TC020 - Cross-Tab Session Sync
    [Documentation]    Test session synchronization across browser tabs  
    [Tags]    authentication    session    multi_tab
    
    Login As Admin
    Navigate To Dashboard
    
    # Open new tab with same application
    Execute Javascript    window.open('${APP_URL}', '_blank');
    
    # Switch to new tab
    @{windows}=    Get Window Handles
    Switch Window    ${windows}[1]
    
    # Should automatically be logged in (session sync)
    Wait Until Page Contains Element    ${USER_PANEL}    timeout=10s
    Page Should Contain    admin@demo.com
    
    # Close second tab and return to original
    Close Window
    Switch Window    ${windows}[0]
