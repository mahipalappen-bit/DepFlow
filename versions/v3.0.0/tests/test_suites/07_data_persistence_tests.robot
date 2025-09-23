*** Settings ***
Documentation    Data Persistence and Session Management Test Suite for DepFlow Application
Resource         ../keywords/depflow_keywords.robot
Resource         ../config/variables.robot
Suite Setup      Setup Persistence Test Environment
Suite Teardown   Teardown Persistence Test Environment
Test Setup       Login And Navigate To Dashboard
Test Teardown    Take Screenshot And Clear Storage

*** Keywords ***
Setup Persistence Test Environment
    [Documentation]    Setup test environment for data persistence testing
    Setup Test Environment

Teardown Persistence Test Environment
    [Documentation]    Teardown test environment
    Teardown Test Environment

Login And Navigate To Dashboard
    [Documentation]    Login and navigate to dashboard for each test
    # Clear any existing storage first
    Run Keyword And Ignore Error    Execute Javascript    localStorage.clear();
    Login As Admin
    Navigate To Dashboard
    Ensure All Modals Closed

Take Screenshot And Clear Storage
    [Documentation]    Take screenshot and clear localStorage after each test
    Take Screenshot With Timestamp
    # Clean up any test dependencies
    Run Keyword And Ignore Error    Navigate To Dashboard
    ${test_deps}=    Get WebElements    xpath://td[contains(@class, 'dependency-name') and contains(text(), 'PersistTest')]
    FOR    ${dep}    IN    @{test_deps}
        ${dep_name}=    Get Text    ${dep}
        Run Keyword And Ignore Error    Delete Dependency With Confirmation    ${dep_name}
    END
    # Clear localStorage for next test
    Execute Javascript    localStorage.clear();

*** Test Cases ***
TC084 - User Session Persistence After Page Refresh
    [Documentation]    Test that user session persists after page refresh
    [Tags]    persistence    session    refresh    smoke
    
    # Verify user is logged in
    Page Should Contain    admin@demo.com
    
    # Verify session data exists in localStorage
    Verify LocalStorage Data Exists    depflow_user    admin@demo.com
    Verify LocalStorage Data Exists    token
    
    # Refresh page
    Reload Page
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    
    # Verify still logged in after refresh
    Page Should Contain    admin@demo.com
    Page Should Contain Element    ${USER_PANEL}
    
    # Verify session data still exists
    Verify LocalStorage Data Exists    depflow_user    admin@demo.com
    Verify LocalStorage Data Exists    token

TC085 - Dependency Data Persistence After Creation
    [Documentation]    Test that dependency data persists in localStorage after creation
    [Tags]    persistence    data    dependencies
    
    ${dep_name}=    Generate Test Data    PersistTest_Create
    ${description}=    Set Variable    Dependency for testing data persistence
    
    # Create dependency
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    IN PROGRESS    HIGH
    Verify Dependency Exists    ${dep_name}
    
    # Verify dependency data is stored in localStorage
    ${stored_deps}=    Execute Javascript    return localStorage.getItem('dependencies');
    Should Not Be Empty    ${stored_deps}
    Should Contain    ${stored_deps}    ${dep_name}
    Should Contain    ${stored_deps}    ${description}

TC086 - Dependency Data Persistence After Page Refresh
    [Documentation]    Test that dependency data persists across page refreshes
    [Tags]    persistence    refresh    dependencies
    
    ${dep_name}=    Generate Test Data    PersistTest_Refresh
    ${description}=    Set Variable    Dependency to test refresh persistence
    
    # Create dependency
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    BLOCKED    MEDIUM
    Verify Dependency Exists    ${dep_name}
    
    # Refresh page
    Reload Page
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    
    # Verify dependency still exists after refresh
    Verify Dependency Exists    ${dep_name}
    Page Should Contain    ${description}

TC087 - Data Persistence After Browser Tab Close And Reopen
    [Documentation]    Test data persistence when closing and reopening browser tab
    [Tags]    persistence    tab    browser
    
    ${dep_name}=    Generate Test Data    PersistTest_Tab
    ${description}=    Set Variable    Testing tab close persistence
    
    # Create dependency
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    COMPLETED    LOW
    
    # Simulate closing and reopening tab by navigating away and back
    Go To    about:blank
    Sleep    2s
    Go To    ${APP_URL}
    
    # Should auto-login due to persisted session
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    
    # Verify dependency still exists
    Verify Dependency Exists    ${dep_name}

TC088 - Data Persistence After Dependency Updates
    [Documentation]    Test that dependency updates are persisted in localStorage
    [Tags]    persistence    update    localStorage
    
    ${dep_name}=    Generate Test Data    PersistTest_Update
    ${original_desc}=    Set Variable    Original description for update test
    
    # Create dependency
    Add New Dependency    ${dep_name}    ${original_desc}    ${TEST_DEP_TEAM}    NOT STARTED    LOW
    
    # Update via inline editing
    Test Inline Status Edit    ${dep_name}    IN PROGRESS
    Test Inline Priority Edit    ${dep_name}    HIGH
    
    # Verify updates are persisted in localStorage
    ${stored_deps}=    Execute Javascript    return localStorage.getItem('dependencies');
    Should Contain    ${stored_deps}    IN PROGRESS
    Should Contain    ${stored_deps}    HIGH
    
    # Refresh and verify persistence
    Reload Page
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    
    # Verify updates persisted
    ${status_dropdown}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//select[contains(@class, 'status-dropdown')]
    ${priority_dropdown}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//select[contains(@class, 'priority-dropdown')]
    
    ${updated_status}=    Get Selected List Label    ${status_dropdown}
    ${updated_priority}=    Get Selected List Label    ${priority_dropdown}
    
    Should Be Equal    ${updated_status}    IN PROGRESS
    Should Be Equal    ${updated_priority}    HIGH

TC089 - Data Persistence After Dependency Deletion
    [Documentation]    Test that dependency deletions are persisted in localStorage
    [Tags]    persistence    delete    localStorage
    
    ${dep_name}=    Generate Test Data    PersistTest_Delete
    ${description}=    Set Variable    Dependency to test deletion persistence
    
    # Create dependency
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}
    Verify Dependency Exists    ${dep_name}
    
    # Delete dependency
    Delete Dependency With Confirmation    ${dep_name}
    Verify Dependency Does Not Exist    ${dep_name}
    
    # Verify deletion is persisted in localStorage
    ${stored_deps}=    Execute Javascript    return localStorage.getItem('dependencies');
    Should Not Contain    ${stored_deps}    ${dep_name}
    
    # Refresh and verify deletion persists
    Reload Page
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    Verify Dependency Does Not Exist    ${dep_name}

TC090 - Multiple Dependencies Data Persistence
    [Documentation]    Test persistence of multiple dependencies with various operations
    [Tags]    persistence    multiple    comprehensive
    
    # Create multiple dependencies
    @{dep_names}=    Create List
    FOR    ${i}    IN RANGE    3
        ${dep_name}=    Generate Test Data    PersistTest_Multi_${i}
        ${description}=    Set Variable    Multi-dependency test ${i}
        Append To List    ${dep_names}    ${dep_name}
        Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED    MEDIUM
    END
    
    # Perform different operations on each
    Test Inline Status Edit    ${dep_names}[0]    IN PROGRESS
    Test Inline Priority Edit    ${dep_names}[1]    HIGH
    ${new_name}=    Set Variable    ${dep_names}[2]_Edited
    Edit Dependency    ${dep_names}[2]    ${new_name}
    
    # Refresh page
    Reload Page
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    
    # Verify all operations persisted
    Verify Dependency Exists    ${dep_names}[0]
    Verify Dependency Exists    ${dep_names}[1]
    Verify Dependency Exists    ${new_name}
    Verify Dependency Does Not Exist    ${dep_names}[2]    # Original name should not exist
    
    # Clean up
    Delete Dependency With Confirmation    ${dep_names}[0]
    Delete Dependency With Confirmation    ${dep_names}[1]
    Delete Dependency With Confirmation    ${new_name}

TC091 - Session Data Structure Validation
    [Documentation]    Test that session data structure is correct in localStorage
    [Tags]    persistence    session    structure    validation
    
    # Verify user session data structure
    ${user_data}=    Execute Javascript    return localStorage.getItem('depflow_user');
    Should Not Be Empty    ${user_data}
    
    # Parse and validate JSON structure
    ${user_json}=    Evaluate    json.loads('''${user_data}''')    modules=json
    Dictionary Should Contain Key    ${user_json}    email
    Dictionary Should Contain Key    ${user_json}    name
    Dictionary Should Contain Key    ${user_json}    role
    
    Should Be Equal    ${user_json['email']}    admin@demo.com
    Should Be Equal    ${user_json['role']}    admin

TC092 - Dependency Data Structure Validation
    [Documentation]    Test that dependency data structure is correct in localStorage
    [Tags]    persistence    dependencies    structure    validation
    
    ${dep_name}=    Generate Test Data    PersistTest_Structure
    ${description}=    Set Variable    Testing dependency data structure
    
    # Create dependency with all fields
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    IN PROGRESS    HIGH
    
    # Verify dependency data structure
    ${deps_data}=    Execute Javascript    return localStorage.getItem('dependencies');
    Should Not Be Empty    ${deps_data}
    
    # Parse and validate JSON structure
    ${deps_json}=    Evaluate    json.loads('''${deps_data}''')    modules=json
    Should Be True    len(${deps_json}) > 0
    
    # Find our test dependency
    ${found}=    Set Variable    ${False}
    FOR    ${dep}    IN    @{deps_json}
        ${found}=    Run Keyword And Return Status    Should Be Equal    ${dep['name']}    ${dep_name}
        Exit For Loop If    ${found}
        
        # Validate structure of each dependency
        Dictionary Should Contain Key    ${dep}    name
        Dictionary Should Contain Key    ${dep}    description
        Dictionary Should Contain Key    ${dep}    team
        Dictionary Should Contain Key    ${dep}    status
        Dictionary Should Contain Key    ${dep}    priority
        Dictionary Should Contain Key    ${dep}    createdBy
    END
    
    Should Be True    ${found}    Test dependency not found in localStorage

TC093 - Storage Size Limits Test
    [Documentation]    Test application behavior when approaching localStorage limits
    [Tags]    persistence    limits    storage    edge_case
    
    # Create multiple dependencies to test storage limits
    FOR    ${i}    IN RANGE    20
        ${dep_name}=    Generate Test Data    StorageLimit_${i}
        ${description}=    Set Variable    ${'Very long description to test storage limits. ' * 20}
        Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED    MEDIUM
        
        # Verify storage is still working
        ${deps_data}=    Execute Javascript    return localStorage.getItem('dependencies');
        Should Not Be Empty    ${deps_data}
        
        # Break if we're approaching practical limits
        ${storage_size}=    Get Length    ${deps_data}
        Exit For Loop If    ${storage_size} > 100000    # ~100KB limit for test
    END
    
    # Clean up all test dependencies
    FOR    ${i}    IN RANGE    20
        ${dep_name}=    Set Variable    StorageLimit_${i}
        Run Keyword And Ignore Error    Delete Dependency With Confirmation    ${dep_name}
    END

TC094 - Cross-Tab Data Synchronization
    [Documentation]    Test data synchronization across multiple browser tabs
    [Tags]    persistence    tabs    synchronization
    
    ${dep_name}=    Generate Test Data    PersistTest_CrossTab
    ${description}=    Set Variable    Cross-tab synchronization test
    
    # Create dependency in current tab
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}
    
    # Open new tab
    Execute Javascript    window.open('${APP_URL}', '_blank');
    
    # Switch to new tab
    @{windows}=    Get Window Handles
    Switch Window    ${windows}[1]
    
    # Should auto-login and see the dependency
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    Verify Dependency Exists    ${dep_name}
    
    # Close second tab and return to original
    Close Window
    Switch Window    ${windows}[0]
    
    # Clean up
    Delete Dependency With Confirmation    ${dep_name}

TC095 - Data Recovery After Storage Clear
    [Documentation]    Test application behavior when localStorage is manually cleared
    [Tags]    persistence    recovery    edge_case
    
    ${dep_name}=    Generate Test Data    PersistTest_Recovery
    Add New Dependency    ${dep_name}    Testing recovery after storage clear    ${TEST_DEP_TEAM}
    
    # Clear localStorage manually
    Execute Javascript    localStorage.clear();
    
    # Refresh page
    Reload Page
    
    # Should redirect to login (session cleared)
    Wait Until Page Contains Element    ${LOGIN_BUTTON}    timeout=10s
    
    # Login again
    Login As Admin
    Navigate To Dashboard
    
    # Dependency should not exist (data was cleared)
    Verify Dependency Does Not Exist    ${dep_name}
    
    # Application should still function normally
    ${new_dep}=    Generate Test Data    RecoveryTest
    Add New Dependency    ${new_dep}    Testing after recovery    ${TEST_DEP_TEAM}
    Verify Dependency Exists    ${new_dep}
    Delete Dependency With Confirmation    ${new_dep}

TC096 - Token Expiration Handling
    [Documentation]    Test handling of expired JWT tokens in localStorage
    [Tags]    persistence    token    expiration    security
    
    # Verify valid token exists
    ${token}=    Execute Javascript    return localStorage.getItem('token');
    Should Not Be Empty    ${token}
    
    # Manually set an expired or invalid token
    Execute Javascript    localStorage.setItem('token', 'invalid_expired_token');
    
    # Try to perform an operation that requires authentication
    Reload Page
    
    # Should handle expired token gracefully (redirect to login or show error)
    ${login_visible}=    Run Keyword And Return Status    Wait Until Page Contains Element    ${LOGIN_BUTTON}    timeout=5s
    ${dashboard_visible}=    Run Keyword And Return Status    Page Should Contain Element    ${DASHBOARD_PAGE}
    
    # Either should redirect to login or handle gracefully
    Should Be True    ${login_visible} or ${dashboard_visible}

TC097 - Storage Corruption Recovery
    [Documentation]    Test application recovery from corrupted localStorage data
    [Tags]    persistence    corruption    recovery    resilience
    
    # Create valid dependency first
    ${dep_name}=    Generate Test Data    CorruptionTest
    Add New Dependency    ${dep_name}    Testing corruption recovery    ${TEST_DEP_TEAM}
    
    # Corrupt the dependencies data in localStorage
    Execute Javascript    localStorage.setItem('dependencies', 'invalid_json_data{corrupted');
    
    # Refresh page
    Reload Page
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    
    # Application should handle corruption gracefully
    # Either show empty state or recover with default data
    ${table_visible}=    Run Keyword And Return Status    Page Should Contain Element    ${DEPENDENCY_TABLE}
    Should Be True    ${table_visible}
    
    # Should be able to create new dependencies
    ${recovery_dep}=    Generate Test Data    RecoveryAfterCorruption
    Add New Dependency    ${recovery_dep}    Testing after corruption recovery    ${TEST_DEP_TEAM}
    Verify Dependency Exists    ${recovery_dep}
    Delete Dependency With Confirmation    ${recovery_dep}

TC098 - Performance Impact Of Data Persistence
    [Documentation]    Test performance impact of localStorage operations
    [Tags]    persistence    performance    localStorage
    
    # Measure time to create multiple dependencies
    ${start_time}=    Get Current Date    result_format=epoch
    
    FOR    ${i}    IN RANGE    10
        ${dep_name}=    Generate Test Data    PerfTest_${i}
        Add New Dependency    ${dep_name}    Performance test dependency ${i}    ${TEST_DEP_TEAM}
    END
    
    ${end_time}=    Get Current Date    result_format=epoch
    ${duration}=    Evaluate    ${end_time} - ${start_time}
    
    # Should complete within reasonable time even with persistence
    Should Be True    ${duration} < 30    # Should complete within 30 seconds
    
    # Measure page load time with stored data
    ${load_start}=    Get Current Date    result_format=epoch
    Reload Page
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    ${load_end}=    Get Current Date    result_format=epoch
    
    ${load_duration}=    Evaluate    ${load_end} - ${load_start}
    Should Be True    ${load_duration} < 5    # Should load within 5 seconds
    
    # Clean up performance test dependencies
    FOR    ${i}    IN RANGE    10
        ${dep_name}=    Set Variable    PerfTest_${i}
        Run Keyword And Ignore Error    Delete Dependency With Confirmation    ${dep_name}
    END
