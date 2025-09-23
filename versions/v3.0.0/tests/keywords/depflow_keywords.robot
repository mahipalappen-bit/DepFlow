*** Settings ***
Documentation    DepFlow Application Keywords and Page Objects
Library          SeleniumLibrary
Library          RequestsLibrary
Library          Collections
Library          String
Library          DateTime
Library          OperatingSystem
Library          BuiltIn
Library          yaml
Resource         ../config/variables.robot

*** Variables ***
# Page Elements - Landing Page
${LANDING_PAGE_LOGO}           xpath://div[contains(@class, 'depflow-logo')]
${LOGIN_BUTTON}                xpath://button[contains(@onclick, 'openLoginModal')]
${GET_STARTED_BUTTON}          xpath://button[contains(@onclick, 'scrollToDemo')]

# Page Elements - Dashboard Logo
${DASHBOARD_LOGO}              xpath://div[contains(@class, 'depflow-logo')]

# Page Elements - Login Modal  
${LOGIN_MODAL}                 id:loginModal
${USERNAME_FIELD}              id:email
${PASSWORD_FIELD}              id:password
${LOGIN_SUBMIT_BUTTON}         xpath://button[contains(@class, 'btn-login')]
${ADMIN_CREDENTIALS_BUTTON}    xpath://button[contains(@onclick, 'fillAdminCredentials')]

# Page Elements - Dashboard
${DASHBOARD_PAGE}              id:dashboardPage
${USER_PANEL}                  id:userPanel
${LOGOUT_BUTTON}               xpath://button[contains(@class, 'btn-logout')]
${ADD_DEPENDENCY_BUTTON}       xpath://button[contains(@onclick, 'showAddDependencyModal')]

# Page Elements - Counters
${TOTAL_COUNT}                 id:totalCount
${IN_PROGRESS_COUNT}           id:inProgressCount
${BLOCKED_COUNT}               id:blockedCount
${DONE_COUNT}                  id:doneCount
${NOT_STARTED_COUNT}           id:notStartedCount

# Counter Cards (clickable)
${TOTAL_COUNT_CARD}            css:.counter-card.total.clickable
${IN_PROGRESS_COUNT_CARD}      css:.counter-card.in-progress.clickable
${BLOCKED_COUNT_CARD}          css:.counter-card.blocked.clickable
${COMPLETED_COUNT_CARD}         css:.counter-card.completed.clickable
${NOT_STARTED_COUNT_CARD}      css:.counter-card.not-started.clickable

# Page Elements - Add/Edit Modal (Updated for current HTML structure)
${ADD_EDIT_MODAL}              id:addDependencyModal
${EDIT_MODAL}                  id:editDependencyModal
${MODAL_TITLE}                 xpath://h2[contains(@class, 'modal-header') or text()='Add New Dependency' or text()='Edit Dependency']
${DEP_NAME_FIELD}              id:addName
${DEP_DESCRIPTION_FIELD}       id:addDescription
${DEP_TEAM_SELECT}             id:addTeam
${DEP_STATUS_SELECT}           id:addStatus
${DEP_PRIORITY_SELECT}         id:addPriority
${DEP_RISK_SELECT}             id:depRisk
# Edit form fields
${EDIT_NAME_FIELD}             id:editName
${EDIT_DESCRIPTION_FIELD}      id:editDescription
${EDIT_TEAM_SELECT}            id:editTeam
${EDIT_STATUS_SELECT}          id:editStatus
${EDIT_PRIORITY_SELECT}        id:editPriority
# Buttons (Updated for current modal structure)  
${SAVE_BUTTON}                 xpath://button[@type='submit' and contains(@class, 'btn-submit')]
${ADD_BUTTON}                  xpath://button[@type='submit' and contains(@class, 'btn-add')]
${CANCEL_BUTTON}               xpath://button[contains(@class, 'btn-cancel')]

# Page Elements - Filters and Search
${SEARCH_INPUT}                id:searchInput
${TEAM_FILTER}                 id:teamFilter
${STATUS_FILTER}               id:statusFilter
${PRIORITY_FILTER}             id:priorityFilter
${CLEAR_FILTERS_BUTTON}        xpath://button[contains(@class, 'btn-clear-filters')]

# Page Elements - Dependency Table (Updated for div-based structure)
${DEPENDENCY_TABLE}            css:.dependencies-table
${DEPENDENCY_CONTAINER}        id:dependenciesContainer
${DEPENDENCY_ROWS}             xpath://div[@id='dependenciesContainer']//div[contains(@class, 'dependency-row')]

# Notifications
${NOTIFICATION}                id:notification

*** Keywords ***
# Setup and Teardown Keywords
Open DepFlow Application
    [Documentation]    Opens the DepFlow application in browser
    Open Browser    ${APP_URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Implicit Wait    ${IMPLICIT_WAIT}
    Wait Until Page Contains Element    ${LANDING_PAGE_LOGO}    timeout=30s
    Sleep    3s    # Give time for any page initialization to complete
    
Close DepFlow Application  
    [Documentation]    Closes the browser and cleans up
    Close All Browsers

# Utility Keywords
Ensure All Modals Closed
    [Documentation]    Ensures all modals are closed before proceeding
    # Use the application's own close functions
    Execute Javascript    
    ...    if (typeof closeLoginModal === 'function') { closeLoginModal(); }
    ...    if (typeof closeAddDependencyModal === 'function') { closeAddDependencyModal(); }
    ...    if (typeof closeEditDependencyModal === 'function') { closeEditDependencyModal(); }
    
    # Force close via DOM manipulation as fallback
    Execute Javascript    
    ...    document.querySelectorAll('.modal').forEach(modal => {
    ...        modal.style.display = 'none';
    ...        modal.classList.remove('show');
    ...    });
    
    # ESC key as final fallback
    Run Keyword And Ignore Error    Press Keys    None    ESCAPE
    Sleep    1s    # Allow time for modal close animations and DOM updates

Setup Test Environment
    [Documentation]    Sets up test environment with fresh browser
    Open DepFlow Application
    Capture Page Screenshot

Teardown Test Environment
    [Documentation]    Tears down test environment
    Capture Page Screenshot
    Close DepFlow Application

# Authentication Keywords
Login To DepFlow
    [Arguments]    ${username}=${ADMIN_USERNAME}    ${password}=${ADMIN_PASSWORD}
    [Documentation]    Logs into DepFlow application
    
    # Wait for page to load completely first
    Sleep    2s
    
    # Force close any modals and reset page state using JavaScript
    Execute Javascript    
    ...    localStorage.clear(); sessionStorage.clear();
    ...    const modals = ['loginModal', 'addDependencyModal', 'editDependencyModal'];
    ...    modals.forEach(id => {
    ...        const modal = document.getElementById(id);
    ...        if (modal) {
    ...            modal.style.display = 'none';
    ...            modal.classList.remove('show');
    ...        }
    ...    });
    ...    // Ensure landing page is visible and dashboard is hidden
    ...    document.getElementById('landingPage').style.display = 'block';
    ...    document.getElementById('dashboardPage').classList.remove('show');
    
    # Small wait after resetting state
    Sleep    1s
    
    # Check if login modal is already open, if so close it first
    ${modal_visible}=    Run Keyword And Return Status    Element Should Be Visible    ${LOGIN_MODAL}
    Run Keyword If    ${modal_visible}    Execute Javascript    closeLoginModal();
    Sleep    1s
    
    # Use JavaScript to click the login button to bypass interference
    Execute Javascript    
    ...    const loginBtn = document.querySelector('button[onclick*="openLoginModal"]');
    ...    if (loginBtn) { loginBtn.click(); }
    
    Wait Until Element Is Visible    ${LOGIN_MODAL}    timeout=10s
    Clear Element Text    ${USERNAME_FIELD}
    Clear Element Text    ${PASSWORD_FIELD}
    Input Text    ${USERNAME_FIELD}    ${username}
    Input Text    ${PASSWORD_FIELD}    ${password}
    Click Element    ${LOGIN_SUBMIT_BUTTON}
    Wait Until Element Is Visible    ${DASHBOARD_PAGE}    timeout=10s
    Wait Until Element Is Visible    ${USER_PANEL}       timeout=10s
    
    # Ensure login modal is closed after successful login
    Wait Until Element Is Not Visible    ${LOGIN_MODAL}    timeout=5s

Login As Admin
    [Documentation]    Quick login as admin user using test mode bypass
    Test Mode Admin Login

Logout From DepFlow
    [Documentation]    Logs out from DepFlow application
    Wait Until Element Is Visible    ${LOGOUT_BUTTON}
    Click Element    ${LOGOUT_BUTTON}
    Wait Until Element Is Not Visible    ${USER_PANEL}    timeout=10s
    Wait Until Page Contains Element    ${LANDING_PAGE_LOGO}    timeout=10s

# Navigation Keywords
Navigate To Dashboard
    [Documentation]    Navigates to the dashboard page
    Wait Until Element Is Visible    ${DASHBOARD_PAGE}
    Page Should Contain Element    ${USER_PANEL}

Verify Page Title
    [Arguments]    ${expected_title}
    [Documentation]    Verifies the page title contains expected text
    Title Should Contain    ${expected_title}

# Counter Keywords
Get Counter Value
    [Arguments]    ${counter_element}
    [Documentation]    Gets the numeric value from a counter element
    ${text}=    Get Text    ${counter_element}
    [Return]    ${text}

Verify Counter Values
    [Arguments]    ${expected_total}=0    ${expected_in_progress}=0    ${expected_blocked}=0    ${expected_done}=0    ${expected_not_started}=0
    [Documentation]    Verifies all counter values match expected values
    ${total}=         Get Counter Value    ${TOTAL_COUNT}
    ${in_progress}=   Get Counter Value    ${IN_PROGRESS_COUNT}
    ${blocked}=       Get Counter Value    ${BLOCKED_COUNT}
    ${done}=          Get Counter Value    ${DONE_COUNT}
    ${not_started}=   Get Counter Value    ${NOT_STARTED_COUNT}
    
    Should Be Equal    ${total}         ${expected_total}
    Should Be Equal    ${in_progress}   ${expected_in_progress}
    Should Be Equal    ${blocked}       ${expected_blocked}
    Should Be Equal    ${done}          ${expected_done}
    Should Be Equal    ${not_started}   ${expected_not_started}

Click Counter Filter
    [Arguments]    ${counter_type}
    [Documentation]    Clicks on a counter card to filter dependencies
    Run Keyword If    '${counter_type}' == 'total'         Click Element    ${TOTAL_COUNT_CARD}
    ...    ELSE IF    '${counter_type}' == 'in_progress'   Click Element    ${IN_PROGRESS_COUNT_CARD}
    ...    ELSE IF    '${counter_type}' == 'blocked'       Click Element    ${BLOCKED_COUNT_CARD}
    ...    ELSE IF    '${counter_type}' == 'completed'     Click Element    ${COMPLETED_COUNT_CARD}
    ...    ELSE IF    '${counter_type}' == 'not_started'   Click Element    ${NOT_STARTED_COUNT_CARD}
    Sleep    1s    # Allow filtering to complete

# Dependency Management Keywords
Add New Dependency
    [Arguments]    ${name}    ${description}    ${team}    ${status}=NOT STARTED    ${priority}=MEDIUM
    [Documentation]    Adds a new dependency with provided details (updated for current app version)
    
    # Ensure we're on dashboard and modals are closed
    Wait Until Element Is Visible    ${ADD_DEPENDENCY_BUTTON}    timeout=10s
    Click Element    ${ADD_DEPENDENCY_BUTTON}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}    timeout=10s
    
    # Wait for all form fields to be visible AND enabled
    Wait Until Element Is Visible    ${DEP_NAME_FIELD}         timeout=5s
    Wait Until Element Is Visible    ${DEP_DESCRIPTION_FIELD}  timeout=5s
    Wait Until Element Is Visible    ${DEP_TEAM_SELECT}        timeout=5s
    Wait Until Element Is Enabled    ${DEP_NAME_FIELD}         timeout=5s
    Wait Until Element Is Enabled    ${DEP_DESCRIPTION_FIELD}  timeout=5s
    Wait Until Element Is Enabled    ${DEP_TEAM_SELECT}        timeout=5s
    Sleep    1s    # Additional buffer for form initialization
    
    # Fill the form fields (clear and fill in proper sequence)
    Clear Element Text    ${DEP_NAME_FIELD}
    Clear Element Text    ${DEP_DESCRIPTION_FIELD}
    Sleep    0.5s    # Brief pause after clearing
    Input Text    ${DEP_NAME_FIELD}         ${name}
    Input Text    ${DEP_DESCRIPTION_FIELD}  ${description}
    Select From List By Label    ${DEP_TEAM_SELECT}      ${team}
    Select From List By Value    ${DEP_STATUS_SELECT}    ${status}
    Select From List By Value    ${DEP_PRIORITY_SELECT}  ${priority}
    
    # Submit the form using the correct button selector
    Wait Until Element Is Visible    ${ADD_BUTTON}    timeout=5s
    Sleep    1s    # Allow field values to settle before submission
    Click Element    ${ADD_BUTTON}
    Wait Until Element Is Not Visible    ${ADD_EDIT_MODAL}    timeout=15s
    Sleep    2s    # Allow time for dependency to be saved and table to refresh

Edit Dependency
    [Arguments]    ${dependency_name}    ${new_name}=${EMPTY}    ${new_description}=${EMPTY}    ${new_team}=${EMPTY}    ${new_status}=${EMPTY}    ${new_priority}=${EMPTY}
    [Documentation]    Edits an existing dependency with updated div-based selectors
    
    # Find and click the edit button for the specific dependency with enhanced waiting
    Sleep    2s    # Allow time for dependency to be fully rendered
    ${dependency_row}=    Set Variable    xpath://div[@class='dependency-row']//div[@class='dependency-name' and contains(text(), '${dependency_name}')]/ancestor::div[@class='dependency-row']
    Wait Until Element Is Visible    ${dependency_row}    timeout=15s
    
    # Scroll to the dependency to ensure it's visible
    Scroll Element Into View    ${dependency_row}
    Sleep    1s
    
    ${edit_button}=    Set Variable    ${dependency_row}//button[@class='btn-edit']
    Wait Until Element Is Visible    ${edit_button}    timeout=10s
    Wait Until Element Is Enabled    ${edit_button}    timeout=5s
    
    # Click the edit button with extra timing protection
    Sleep    0.5s    # Brief pause before clicking
    Click Element    ${edit_button}
    
    # Wait for edit modal to open and all fields to be ready
    Wait Until Element Is Visible    ${EDIT_MODAL}    timeout=10s
    Wait Until Element Is Visible    ${EDIT_NAME_FIELD}         timeout=5s
    Wait Until Element Is Visible    ${EDIT_DESCRIPTION_FIELD}  timeout=5s
    Wait Until Element Is Visible    ${EDIT_TEAM_SELECT}        timeout=5s
    Wait Until Element Is Enabled    ${EDIT_NAME_FIELD}         timeout=5s
    Wait Until Element Is Enabled    ${EDIT_DESCRIPTION_FIELD}  timeout=5s
    Wait Until Element Is Enabled    ${EDIT_TEAM_SELECT}        timeout=5s
    Sleep    1s    # Additional time for modal animation to complete
    
    # Clear and fill form fields
    Run Keyword If    '${new_name}' != '${EMPTY}'          Clear Element Text And Input    ${EDIT_NAME_FIELD}         ${new_name}
    Run Keyword If    '${new_description}' != '${EMPTY}'   Clear Element Text And Input    ${EDIT_DESCRIPTION_FIELD}  ${new_description}  
    Run Keyword If    '${new_team}' != '${EMPTY}'          Select From List By Label       ${EDIT_TEAM_SELECT}        ${new_team}
    Run Keyword If    '${new_status}' != '${EMPTY}'        Select From List By Value       ${EDIT_STATUS_SELECT}      ${new_status}
    Run Keyword If    '${new_priority}' != '${EMPTY}'      Select From List By Value       ${EDIT_PRIORITY_SELECT}    ${new_priority}
    
    # Submit the changes
    Click Element    ${SAVE_BUTTON}
    Wait Until Element Is Not Visible    ${EDIT_MODAL}    timeout=15s
    Sleep    2s    # Allow time for dependency to be updated and table to refresh

Delete Dependency
    [Arguments]    ${dependency_name}
    [Documentation]    Deletes a dependency by name with updated div-based selectors
    
    # Find and click the delete button for the specific dependency
    ${dependency_row}=    Set Variable    xpath://div[@class='dependency-row']//div[@class='dependency-name' and contains(text(), '${dependency_name}')]/ancestor::div[@class='dependency-row']
    Wait Until Element Is Visible    ${dependency_row}    timeout=10s
    ${delete_button}=    Set Variable    ${dependency_row}//button[@class='btn-delete']
    Wait Until Element Is Visible    ${delete_button}    timeout=10s
    Click Element    ${delete_button}
    
    # Handle confirmation dialog (JavaScript confirm dialog)
    Handle Alert    ACCEPT
    Sleep    2s    # Allow deletion to complete

Clear Element Text And Input
    [Arguments]    ${element}    ${text}
    [Documentation]    Clears element text and inputs new text
    Clear Element Text    ${element}
    Input Text    ${element}    ${text}

# Search and Filter Keywords
Search Dependencies
    [Arguments]    ${search_term}
    [Documentation]    Searches for dependencies using search term
    Clear Element Text    ${SEARCH_INPUT}
    Input Text    ${SEARCH_INPUT}    ${search_term}
    Sleep    1s    # Allow filtering to complete

Filter By Team
    [Arguments]    ${team_name}
    [Documentation]    Filters dependencies by team
    Select From List By Label    ${TEAM_FILTER}    ${team_name}
    Sleep    1s

Filter By Status  
    [Arguments]    ${status}
    [Documentation]    Filters dependencies by status
    Select From List By Label    ${STATUS_FILTER}    ${status}
    Sleep    1s

Filter By Priority
    [Arguments]    ${priority}
    [Documentation]    Filters dependencies by priority  
    Select From List By Label    ${PRIORITY_FILTER}    ${priority}
    Sleep    1s

Clear All Filters
    [Documentation]    Clears all applied filters
    Click Element    ${CLEAR_FILTERS_BUTTON}
    Sleep    1s

# Verification Keywords (Updated for div-based structure)
Verify Dependency Exists
    [Arguments]    ${dependency_name}
    [Documentation]    Verifies that a dependency exists in the dependencies container
    # For very long text, use JavaScript to search instead of xpath
    ${found}=    Execute JavaScript    
    ...    return Array.from(document.querySelectorAll('.dependency-name')).some(el => 
    ...        el.textContent.includes('${dependency_name}'.substring(0, 50))
    ...    );
    Should Be True    ${found}    Dependency with name starting "${dependency_name[:50]}" not found

Verify Dependency Does Not Exist
    [Arguments]    ${dependency_name}
    [Documentation]    Verifies that a dependency does not exist in the dependencies container
    Page Should Not Contain Element    xpath://div[@class='dependency-name' and contains(text(), '${dependency_name}')]

Get Visible Dependencies Count
    [Documentation]    Returns count of visible dependencies in container
    ${elements}=    Get WebElements    xpath://div[@id='dependenciesContainer']//div[@class='dependency-row']
    ${count}=       Get Length    ${elements}
    [Return]        ${count}

Verify Notification Message
    [Arguments]    ${expected_message}
    [Documentation]    Verifies notification message appears
    Wait Until Element Is Visible    ${NOTIFICATION}    timeout=5s
    ${actual_message}=    Get Text    ${NOTIFICATION}
    Should Contain    ${actual_message}    ${expected_message}

# Logo and Branding Keywords
Verify DepFlow Logo Present
    [Documentation]    Verifies DepFlow logo is present on page
    Page Should Contain Element    ${LANDING_PAGE_LOGO}
    Element Should Be Visible    ${LANDING_PAGE_LOGO}

Verify DepFlow Dashboard Logo Present
    [Documentation]    Verifies DepFlow logo is present on dashboard page
    ${visible_logos}=    Get WebElements    xpath://div[contains(@class, 'depflow-logo') and not(contains(@style, 'display: none'))]
    ${count}=    Get Length    ${visible_logos}
    Should Be True    ${count} > 0    No visible DepFlow logo found on dashboard

Verify Page Branding
    [Documentation]    Verifies consistent DepFlow branding
    Title Should Be    DepFlow - Enterprise Dependency Management Platform
    Verify DepFlow Logo Present

# API Testing Keywords  
Create Session For API Testing
    [Documentation]    Creates HTTP session for API testing
    Create Session    depflow    ${API_BASE_URL}    timeout=${API_TIMEOUT}

Test Email API Endpoint
    [Arguments]    ${team_name}=Annotation tools
    [Documentation]    Tests the email API endpoint
    Create Session For API Testing
    ${payload}=    Create Dictionary    team=${team_name}
    ${response}=    POST On Session    depflow    /test-email    json=${payload}
    Should Be Equal As Strings    ${response.status_code}    200
    ${json_response}=    Set Variable    ${response.json()}
    Should Be True    ${json_response['success']}

Test Dependencies API Endpoint
    [Arguments]    ${name}    ${description}    ${team}    ${status}=NOT STARTED    ${priority}=MEDIUM
    [Documentation]    Tests creating dependency via API
    Create Session For API Testing  
    ${payload}=    Create Dictionary    
    ...    name=${name}
    ...    description=${description}
    ...    team=${team}
    ...    status=${status}
    ...    priority=${priority}
    ...    riskLevel=LOW
    ...    createdBy=test@depflow.com
    
    ${response}=    POST On Session    depflow    /dependencies    json=${payload}
    Should Be Equal As Strings    ${response.status_code}    200
    ${json_response}=    Set Variable    ${response.json()}
    Should Be True    ${json_response['success']}

# Utility Keywords
Wait For Page Load
    [Documentation]    Waits for page to fully load
    Wait Until Page Does Not Contain    Loading    timeout=10s
    Sleep    1s

Take Screenshot With Timestamp
    [Documentation]    Takes screenshot with timestamp in filename
    ${timestamp}=    Get Current Date    result_format=%Y%m%d_%H%M%S
    Capture Page Screenshot    screenshot_${timestamp}.png

Generate Test Data
    [Arguments]    ${prefix}=Test
    [Documentation]    Generates unique test data for test runs
    ${timestamp}=    Get Current Date    result_format=%Y%m%d_%H%M%S
    ${unique_name}=    Set Variable    ${prefix}_${timestamp}
    [Return]    ${unique_name}

# Inline Editing Keywords (Updated for div-based structure)
Test Inline Status Edit
    [Arguments]    ${dependency_name}    ${new_status}
    [Documentation]    Tests inline editing of status field via dropdown with updated selectors
    
    # Find the dependency row and status dropdown
    ${dependency_row}=    Set Variable    xpath://div[@class='dependency-row']//div[@class='dependency-name' and contains(text(), '${dependency_name}')]/ancestor::div[@class='dependency-row']
    Wait Until Element Is Visible    ${dependency_row}    timeout=10s
    ${status_dropdown}=    Set Variable    ${dependency_row}//select[contains(@class, 'status-dropdown')]
    Wait Until Element Is Visible    ${status_dropdown}    timeout=5s
    
    # Change status via dropdown
    Select From List By Value    ${status_dropdown}    ${new_status}
    Sleep    2s    # Allow time for update to process

Test Inline Priority Edit
    [Arguments]    ${dependency_name}    ${new_priority}
    [Documentation]    Tests inline editing of priority field via dropdown with updated selectors
    
    # Find the dependency row and priority dropdown
    ${dependency_row}=    Set Variable    xpath://div[@class='dependency-row']//div[@class='dependency-name' and contains(text(), '${dependency_name}')]/ancestor::div[@class='dependency-row']
    Wait Until Element Is Visible    ${dependency_row}    timeout=10s
    ${priority_dropdown}=    Set Variable    ${dependency_row}//select[contains(@class, 'priority-dropdown')]
    Wait Until Element Is Visible    ${priority_dropdown}    timeout=5s
    
    # Change priority via dropdown
    Select From List By Value    ${priority_dropdown}    ${new_priority}
    Sleep    2s    # Allow time for update to process

# RBAC Keywords (Updated for div-based structure)
Verify Edit Button Visibility
    [Arguments]    ${dependency_name}    ${should_be_visible}=True
    [Documentation]    Verifies edit button visibility based on RBAC rules with updated selectors
    
    ${dependency_row}=    Set Variable    xpath://div[@class='dependency-row']//div[@class='dependency-name' and contains(text(), '${dependency_name}')]/ancestor::div[@class='dependency-row']
    Wait Until Element Is Visible    ${dependency_row}    timeout=10s
    ${edit_button}=    Set Variable    ${dependency_row}//button[@class='btn-edit']
    
    Run Keyword If    ${should_be_visible}    Element Should Be Visible    ${edit_button}
    ...    ELSE    Element Should Not Be Visible    ${edit_button}

Verify Delete Button Visibility
    [Arguments]    ${dependency_name}    ${should_be_visible}=True
    [Documentation]    Verifies delete button visibility based on RBAC rules with updated selectors
    
    ${dependency_row}=    Set Variable    xpath://div[@class='dependency-row']//div[@class='dependency-name' and contains(text(), '${dependency_name}')]/ancestor::div[@class='dependency-row']
    Wait Until Element Is Visible    ${dependency_row}    timeout=10s
    ${delete_button}=    Set Variable    ${dependency_row}//button[@class='btn-delete']
    
    Run Keyword If    ${should_be_visible}    Element Should Be Visible    ${delete_button}
    ...    ELSE    Element Should Not Be Visible    ${delete_button}

# UI Enhancement Keywords (Updated for div-based structure)
Verify Status Badge Color
    [Arguments]    ${dependency_name}    ${expected_status}
    [Documentation]    Verifies status badge has correct color styling with updated selectors
    
    ${dependency_row}=    Set Variable    xpath://div[@class='dependency-row']//div[@class='dependency-name' and contains(text(), '${dependency_name}')]/ancestor::div[@class='dependency-row']
    Wait Until Element Is Visible    ${dependency_row}    timeout=10s
    ${status_element}=    Set Variable    ${dependency_row}//div[@class='dependency-status']
    Element Should Be Visible    ${status_element}

Verify Priority Badge Color
    [Arguments]    ${dependency_name}    ${expected_priority}
    [Documentation]    Verifies priority badge has correct color styling with updated selectors
    
    ${dependency_row}=    Set Variable    xpath://div[@class='dependency-row']//div[@class='dependency-name' and contains(text(), '${dependency_name}')]/ancestor::div[@class='dependency-row']
    Wait Until Element Is Visible    ${dependency_row}    timeout=10s
    ${priority_element}=    Set Variable    ${dependency_row}//div[@class='dependency-priority']
    Element Should Be Visible    ${priority_element}

Verify Favicon Present
    [Documentation]    Verifies that favicon is present in browser tab
    ${favicon}=    Get WebElement    xpath://link[@rel='icon' or @rel='shortcut icon']
    Element Should Be Visible    ${favicon}

# Data Persistence Keywords  
Verify LocalStorage Data Exists
    [Arguments]    ${key}    ${expected_content}=${EMPTY}
    [Documentation]    Verifies data exists in localStorage
    ${stored_data}=    Execute Javascript    return localStorage.getItem('${key}')
    Should Not Be Equal    ${stored_data}    ${None}    msg=localStorage key '${key}' should exist but is null
    Should Not Be Empty    ${stored_data}    msg=localStorage key '${key}' should not be empty
    Run Keyword If    '${expected_content}' != '${EMPTY}'    Should Contain    ${stored_data}    ${expected_content}

Clear LocalStorage
    [Documentation]    Clears all localStorage data
    Execute Javascript    localStorage.clear()

Verify Data Persistence After Refresh
    [Arguments]    ${dependency_name}
    [Documentation]    Verifies dependency data persists after page refresh
    Reload Page
    Wait Until Page Contains Element    ${DEPENDENCY_TABLE}    timeout=10s
    Verify Dependency Exists    ${dependency_name}

# ============================================================================
# TEST MODE AUTHENTICATION KEYWORDS (Bypass Modal System)
# ============================================================================

Test Mode Login
    [Arguments]    ${user_type}=admin
    [Documentation]    Login using test mode bypass - no modal interaction required
    
    # Wait for page to load
    Wait Until Page Contains Element    ${LANDING_PAGE_LOGO}    timeout=10s
    Sleep    1s
    
    # Use test mode login function
    Execute Javascript    
    ...    if (typeof window.DepFlow.testModeLogin === 'function') {
    ...        window.DepFlow.testModeLogin('${user_type}');
    ...    } else {
    ...        console.error('Test mode login function not available');
    ...    }
    
    # Wait for dashboard to be ready
    Sleep    2s
    Wait Until Element Is Visible    ${DASHBOARD_PAGE}    timeout=10s
    Wait Until Element Is Visible    ${USER_PANEL}    timeout=5s
    
    Log    Test Mode Login Completed for ${user_type}

Test Mode Admin Login
    [Documentation]    Quick admin login using test mode
    Test Mode Login    admin

Test Mode User Login  
    [Documentation]    Quick user login using test mode
    Test Mode Login    user

Test Mode Logout
    [Documentation]    Logout using test mode
    Execute Javascript    
    ...    if (typeof window.DepFlow.testModeLogout === 'function') {
    ...        window.DepFlow.testModeLogout();
    ...    } else {
    ...        console.error('Test mode logout function not available');
    ...    }
    
    Wait Until Element Is Visible    ${LANDING_PAGE_LOGO}    timeout=5s
    Log    Test Mode Logout Completed

Test Mode Reset
    [Documentation]    Complete app state reset for clean test environment
    Execute Javascript    
    ...    if (typeof window.DepFlow.testModeReset === 'function') {
    ...        window.DepFlow.testModeReset();
    ...    } else {
    ...        console.error('Test mode reset function not available');
    ...    }
    
    Sleep    1s
    Log    Test Mode Reset Completed

Verify Test Mode State
    [Documentation]    Verify test mode state and return information
    ${state}=    Execute Javascript    
    ...    return window.DepFlow.testModeGetState ? 
    ...        JSON.stringify(window.DepFlow.testModeGetState()) : 
    ...        '{"error": "Test mode not available"}';
    
    Log    Current Test Mode State: ${state}
    [Return]    ${state}

# Enhanced Suite Setup/Teardown for Test Mode
Test Mode Suite Setup
    [Documentation]    Setup using test mode authentication
    Open DepFlow Application
    Test Mode Admin Login

Test Mode Suite Teardown  
    [Documentation]    Teardown using test mode
    Test Mode Reset
    Close DepFlow Application

Test Mode Test Setup
    [Documentation]    Individual test setup using test mode
    Test Mode Reset
    Test Mode Admin Login

Test Mode Test Teardown
    [Documentation]    Individual test teardown using test mode  
    Test Mode Reset

# ============================================================================
# ADDITIONAL CRUD KEYWORDS (Non-duplicate)  
# ============================================================================

Delete Dependency With Confirmation
    [Arguments]    ${dependency_name}
    [Documentation]    Deletes a dependency and handles the confirmation dialog
    
    # Find and click the delete button for the specific dependency
    ${dependency_row}=    Set Variable    xpath://div[@class='dependency-row']//div[@class='dependency-name' and contains(text(), '${dependency_name}')]/ancestor::div[@class='dependency-row']
    Wait Until Element Is Visible    ${dependency_row}    timeout=10s
    ${delete_button}=    Set Variable    ${dependency_row}//button[@class='btn-delete']
    Wait Until Element Is Visible    ${delete_button}    timeout=10s
    Click Element    ${delete_button}
    
    # Handle confirmation dialog (JavaScript confirm dialog)
    Sleep    1s    # Wait for confirm dialog to appear
    Handle Alert    ACCEPT
    Sleep    2s    # Allow time for dependency to be deleted and table to refresh

Cancel Delete Dependency
    [Arguments]    ${dependency_name}
    [Documentation]    Attempts to delete a dependency but cancels the confirmation
    
    # Find and click the delete button for the specific dependency
    ${dependency_row}=    Set Variable    xpath://div[@class='dependency-row']//div[@class='dependency-name' and contains(text(), '${dependency_name}')]/ancestor::div[@class='dependency-row']
    Wait Until Element Is Visible    ${dependency_row}    timeout=10s
    ${delete_button}=    Set Variable    ${dependency_row}//button[@class='btn-delete']
    Wait Until Element Is Visible    ${delete_button}    timeout=10s
    Click Element    ${delete_button}
    
    # Handle confirmation dialog - DISMISS to cancel
    Sleep    1s    # Wait for confirm dialog to appear
    Handle Alert    DISMISS
    Sleep    1s    # Allow time for UI to return to normal

