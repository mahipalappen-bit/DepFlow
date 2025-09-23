*** Settings ***
Documentation    Validation test for authentication bypass solution
Resource         keywords/depflow_keywords.robot
Resource         config/variables.robot

*** Test Cases ***
Validate Test Mode Login Admin
    [Documentation]    Test that admin login bypass works
    [Tags]    validation    auth_bypass
    
    Open DepFlow Application
    Test Mode Admin Login
    
    # Verify dashboard is visible
    Element Should Be Visible    ${DASHBOARD_PAGE}
    Element Should Be Visible    ${USER_PANEL}
    Page Should Contain    Admin User
    
    # Verify state
    ${state}=    Verify Test Mode State
    Should Contain    ${state}    "isLoggedIn":true
    Should Contain    ${state}    "dashboardVisible":true
    
    Capture Page Screenshot    test_mode_admin_login.png
    Close DepFlow Application

Validate Test Mode Login User
    [Documentation]    Test that user login bypass works
    [Tags]    validation    auth_bypass
    
    Open DepFlow Application
    Test Mode User Login
    
    # Verify dashboard is visible
    Element Should Be Visible    ${DASHBOARD_PAGE}
    Element Should Be Visible    ${USER_PANEL}  
    Page Should Contain    Regular User
    
    # Verify state
    ${state}=    Verify Test Mode State
    Should Contain    ${state}    "isLoggedIn":true
    Should Contain    ${state}    "dashboardVisible":true
    
    Capture Page Screenshot    test_mode_user_login.png
    Close DepFlow Application

Validate Test Mode Reset
    [Documentation]    Test that reset works properly
    [Tags]    validation    auth_bypass
    
    Open DepFlow Application
    Test Mode Admin Login
    Element Should Be Visible    ${DASHBOARD_PAGE}
    
    # Reset and verify we're back to landing page
    Test Mode Reset
    Element Should Be Visible    ${LANDING_PAGE_LOGO}
    Element Should Not Be Visible    ${DASHBOARD_PAGE}
    
    Close DepFlow Application

Validate Test Mode Suite Flow
    [Documentation]    Test complete suite setup/teardown flow
    [Tags]    validation    auth_bypass    suite_flow
    
    Test Mode Suite Setup
    
    # Should be logged in and ready
    Element Should Be Visible    ${DASHBOARD_PAGE}
    Element Should Be Visible    ${USER_PANEL}
    
    # Test individual test setup
    Test Mode Test Setup  
    Element Should Be Visible    ${DASHBOARD_PAGE}
    
    # Test teardown
    Test Mode Test Teardown
    
    # Suite teardown
    Test Mode Suite Teardown
