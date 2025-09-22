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
${ADD_DEPENDENCY_BUTTON}       xpath://button[contains(@class, 'btn-add')]

# Page Elements - Counters
${TOTAL_COUNT}                 id:totalCount
${IN_PROGRESS_COUNT}           id:inProgressCount
${BLOCKED_COUNT}               id:blockedCount
${DONE_COUNT}                  id:doneCount
${NOT_STARTED_COUNT}           id:notStartedCount

# Counter Cards (clickable)
${TOTAL_COUNT_CARD}            id:totalCountCard
${IN_PROGRESS_COUNT_CARD}      id:inProgressCountCard
${BLOCKED_COUNT_CARD}          id:blockedCountCard
${DONE_COUNT_CARD}             id:doneCountCard
${NOT_STARTED_COUNT_CARD}      id:notStartedCountCard

# Page Elements - Add/Edit Modal
${ADD_EDIT_MODAL}              id:addEditModal
${MODAL_TITLE}                 id:modalTitle
${DEP_NAME_FIELD}              id:depName
${DEP_DESCRIPTION_FIELD}       id:depDescription
${DEP_TEAM_SELECT}             id:depTeam
${DEP_STATUS_SELECT}           id:depStatus
${DEP_PRIORITY_SELECT}         id:depPriority
${DEP_RISK_SELECT}             id:depRisk
${DEP_JIRA_FIELD}              id:depJira
${SAVE_BUTTON}                 xpath://button[contains(@class, 'btn-save')]
${CANCEL_BUTTON}               xpath://button[contains(@class, 'btn-cancel') and contains(@onclick, 'closeAddEditModal')]

# Page Elements - Filters and Search
${SEARCH_INPUT}                id:searchInput
${TEAM_FILTER}                 id:teamFilter
${STATUS_FILTER}               id:statusFilter
${PRIORITY_FILTER}             id:priorityFilter
${CLEAR_FILTERS_BUTTON}        xpath://button[contains(@class, 'btn-clear')]

# Page Elements - Dependency Table
${DEPENDENCY_TABLE}            xpath://table[contains(@class, 'table')]
${DEPENDENCY_TABLE_BODY}       id:dependencyTableBody
${DEPENDENCY_ROWS}             xpath://tbody[@id='dependencyTableBody']/tr

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
    
Close DepFlow Application  
    [Documentation]    Closes the browser and cleans up
    Close All Browsers

# Utility Keywords
Ensure All Modals Closed
    [Documentation]    Ensures all modals are closed before proceeding
    Run Keyword And Ignore Error    Press Keys    None    ESCAPE
    ${modal_elements}=    Get WebElements    xpath://div[contains(@class, 'login-modal') or contains(@class, 'modal')]
    FOR    ${modal}    IN    @{modal_elements}
        ${display}=    Get Element Attribute    ${modal}    style
        Run Keyword If    'display: flex' in '${display}' or 'display: block' in '${display}'    Execute Javascript    arguments[0].style.display = 'none';    ARGUMENTS    ${modal}
    END

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
    Click Element    ${LOGIN_BUTTON}
    Wait Until Element Is Visible    ${LOGIN_MODAL}
    Input Text    ${USERNAME_FIELD}    ${username}
    Input Text    ${PASSWORD_FIELD}    ${password}
    Click Element    ${LOGIN_SUBMIT_BUTTON}
    Wait Until Element Is Visible    ${DASHBOARD_PAGE}    timeout=10s
    Wait Until Element Is Visible    ${USER_PANEL}       timeout=10s

Login As Admin
    [Documentation]    Quick login as admin user
    Click Element    ${LOGIN_BUTTON}
    Wait Until Element Is Visible    ${LOGIN_MODAL}
    Click Element    ${ADMIN_CREDENTIALS_BUTTON}
    Click Element    ${LOGIN_SUBMIT_BUTTON}
    Wait Until Element Is Visible    ${DASHBOARD_PAGE}    timeout=10s

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
    ...    ELSE IF    '${counter_type}' == 'completed'     Click Element    ${DONE_COUNT_CARD}
    ...    ELSE IF    '${counter_type}' == 'not_started'   Click Element    ${NOT_STARTED_COUNT_CARD}
    Sleep    1s    # Allow filtering to complete

# Dependency Management Keywords
Add New Dependency
    [Arguments]    ${name}    ${description}    ${team}    ${status}=NOT STARTED    ${priority}=MEDIUM    ${risk}=LOW    ${jira}=${EMPTY}
    [Documentation]    Adds a new dependency with provided details
    Click Element    ${ADD_DEPENDENCY_BUTTON}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}
    
    Input Text    ${DEP_NAME_FIELD}         ${name}
    Input Text    ${DEP_DESCRIPTION_FIELD}  ${description}
    Select From List By Label    ${DEP_TEAM_SELECT}      ${team}
    Select From List By Value    ${DEP_STATUS_SELECT}    ${status}
    Select From List By Value    ${DEP_PRIORITY_SELECT}  ${priority}
    Select From List By Value    ${DEP_RISK_SELECT}      ${risk}
    Run Keyword If    '${jira}' != '${EMPTY}'    Input Text    ${DEP_JIRA_FIELD}    ${jira}
    
    Click Element    ${SAVE_BUTTON}
    Wait Until Element Is Not Visible    ${ADD_EDIT_MODAL}    timeout=15s
    Sleep    2s    # Allow time for dependency to be saved and table to refresh

Edit Dependency
    [Arguments]    ${dependency_name}    ${new_name}=${EMPTY}    ${new_description}=${EMPTY}    ${new_team}=${EMPTY}
    [Documentation]    Edits an existing dependency
    ${edit_button}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dependency_name}')]]//button[contains(@class, 'btn-edit')]
    Click Element    ${edit_button}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}
    
    Run Keyword If    '${new_name}' != '${EMPTY}'          Clear Element Text And Input    ${DEP_NAME_FIELD}         ${new_name}
    Run Keyword If    '${new_description}' != '${EMPTY}'   Clear Element Text And Input    ${DEP_DESCRIPTION_FIELD}  ${new_description}  
    Run Keyword If    '${new_team}' != '${EMPTY}'          Select From List By Label       ${DEP_TEAM_SELECT}        ${new_team}
    
    Click Element    ${SAVE_BUTTON}
    Wait Until Element Is Not Visible    ${ADD_EDIT_MODAL}    timeout=15s

Delete Dependency
    [Arguments]    ${dependency_name}
    [Documentation]    Deletes a dependency by name
    ${delete_button}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dependency_name}')]]//button[contains(@class, 'btn-delete')]
    Click Element    ${delete_button}
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

# Verification Keywords
Verify Dependency Exists
    [Arguments]    ${dependency_name}
    [Documentation]    Verifies that a dependency exists in the table
    Wait Until Page Contains Element    xpath://td[contains(@class, 'dependency-name') and contains(text(), '${dependency_name}')]    timeout=10s

Verify Dependency Does Not Exist
    [Arguments]    ${dependency_name}
    [Documentation]    Verifies that a dependency does not exist in the table
    Page Should Not Contain Element    xpath://td[contains(@class, 'dependency-name') and contains(text(), '${dependency_name}')]

Get Visible Dependencies Count
    [Documentation]    Returns count of visible dependencies in table
    ${elements}=    Get WebElements    xpath://tbody[@id='dependencyTableBody']/tr[not(contains(@style, 'display: none'))]
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
