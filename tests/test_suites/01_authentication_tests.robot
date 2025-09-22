*** Settings ***
Documentation    Authentication and Login Test Suite for DepFlow Application
Resource         ../keywords/depflow_keywords.robot
Resource         ../config/variables.robot
Suite Setup      Setup Test Environment
Suite Teardown   Teardown Test Environment
Test Setup       Open DepFlow Application
Test Teardown    Close DepFlow Application

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
    
    Login As Admin
    Title Should Be    DepFlow - Enterprise Dependency Management Platform
    Page Should Contain Element    ${USER_PANEL}
    Page Should Contain Element    ${DASHBOARD_PAGE}
    Page Should Contain    Admin User
    
TC004 - Successful Manual Login
    [Documentation]    Test successful login with manual credential entry
    [Tags]    authentication    manual
    
    Login To DepFlow    ${ADMIN_USERNAME}    ${ADMIN_PASSWORD}
    Navigate To Dashboard
    Page Should Contain Element    ${USER_PANEL}
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
    [Documentation]    Test that user session persists across page operations
    [Tags]    authentication    session
    
    Login As Admin
    Navigate To Dashboard
    
    # Refresh page and verify still logged in
    Reload Page
    Wait Until Page Contains Element    ${USER_PANEL}    timeout=10s
    Page Should Contain Element    ${DASHBOARD_PAGE}

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
        Input Text    ${USERNAME_FIELD}    invalid${i}@user.com
        Input Text    ${PASSWORD_FIELD}    wrongpass${i}
        Click Element    ${LOGIN_SUBMIT_BUTTON}
        Sleep    1s
        
        # Should still show login modal
        Element Should Be Visible    ${LOGIN_MODAL}
        
        # Close modal and retry
        Press Keys    ${LOGIN_MODAL}    ESCAPE
        Sleep    1s
    END
