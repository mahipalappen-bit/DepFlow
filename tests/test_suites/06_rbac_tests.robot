*** Settings ***
Documentation    Role-Based Access Control (RBAC) Test Suite for DepFlow Application
Resource         ../keywords/depflow_keywords.robot
Resource         ../config/variables.robot
Suite Setup      Setup RBAC Test Environment
Suite Teardown   Teardown RBAC Test Environment
Test Setup       Ensure Clean Dashboard State
Test Teardown    Take Screenshot With Timestamp And Cleanup

*** Variables ***
${ADMIN_CREATED_DEP}    AdminDep
${USER_CREATED_DEP}     UserDep

*** Keywords ***
Setup RBAC Test Environment
    [Documentation]    Setup test environment for RBAC testing
    Setup Test Environment

Teardown RBAC Test Environment
    [Documentation]    Teardown test environment
    Teardown Test Environment

Ensure Clean Dashboard State
    [Documentation]    Ensure clean state before each test
    # Start with admin login
    Run Keyword And Ignore Error    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    Ensure All Modals Closed

Take Screenshot With Timestamp And Cleanup
    [Documentation]    Take screenshot and perform test cleanup
    Take Screenshot With Timestamp
    # Clean up any test dependencies
    Run Keyword And Ignore Error    Delete Dependency With Confirmation    ${ADMIN_CREATED_DEP}
    Run Keyword And Ignore Error    Delete Dependency With Confirmation    ${USER_CREATED_DEP}

*** Test Cases ***
TC071 - Admin User Can Create Dependencies
    [Documentation]    Test that admin users can create new dependencies
    [Tags]    rbac    admin    create    smoke
    
    ${dep_name}=    Generate Test Data    AdminCreateTest
    ${description}=    Set Variable    Dependency created by admin user for RBAC test
    
    # Admin should be able to create dependency
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED    MEDIUM
    Verify Dependency Exists    ${dep_name}
    
    # Clean up
    Delete Dependency With Confirmation    ${dep_name}

TC072 - Regular User Can Create Dependencies
    [Documentation]    Test that regular users can create new dependencies
    [Tags]    rbac    user    create
    
    # Login as regular user
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    ${dep_name}=    Generate Test Data    UserCreateTest
    ${description}=    Set Variable    Dependency created by regular user for RBAC test
    
    # User should be able to create dependency
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED    MEDIUM
    Verify Dependency Exists    ${dep_name}
    
    # Clean up
    Delete Dependency With Confirmation    ${dep_name}
    
    # Switch back to admin
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard

TC073 - Admin Can Edit Any Dependency
    [Documentation]    Test that admin users can edit dependencies created by any user
    [Tags]    rbac    admin    edit    comprehensive
    
    # First create dependency as regular user
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    ${user_dep_name}=    Generate Test Data    UserDepForAdminEdit
    Add New Dependency    ${user_dep_name}    User created dependency    ${TEST_DEP_TEAM}
    
    # Switch to admin and try to edit user's dependency
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    
    # Admin should be able to see and use edit button
    Verify Edit Button Visibility    ${user_dep_name}    True
    
    # Admin should be able to edit the dependency
    ${new_name}=    Set Variable    ${user_dep_name}_AdminEdited
    Edit Dependency    ${user_dep_name}    ${new_name}
    Verify Dependency Exists    ${new_name}
    
    # Clean up
    Delete Dependency With Confirmation    ${new_name}

TC074 - Admin Can Delete Any Dependency
    [Documentation]    Test that admin users can delete dependencies created by any user
    [Tags]    rbac    admin    delete    comprehensive
    
    # Create dependency as regular user
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    ${user_dep_name}=    Generate Test Data    UserDepForAdminDelete
    Add New Dependency    ${user_dep_name}    User dependency for admin deletion test    ${TEST_DEP_TEAM}
    
    # Switch to admin and delete user's dependency
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    
    # Admin should be able to see and use delete button
    Verify Delete Button Visibility    ${user_dep_name}    True
    
    # Admin should be able to delete the dependency
    Delete Dependency With Confirmation    ${user_dep_name}
    Verify Dependency Does Not Exist    ${user_dep_name}

TC075 - User Can Only Edit Own Dependencies
    [Documentation]    Test that regular users can only edit dependencies they created
    [Tags]    rbac    user    edit    restriction
    
    # Create dependency as admin first
    ${admin_dep_name}=    Generate Test Data    AdminDepForUserTest
    Add New Dependency    ${admin_dep_name}    Admin created dependency    ${TEST_DEP_TEAM}
    
    # Create dependency as user
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    ${user_dep_name}=    Generate Test Data    UserOwnDepEdit
    Add New Dependency    ${user_dep_name}    User's own dependency    ${TEST_DEP_TEAM}
    
    # User should be able to edit their own dependency
    Verify Edit Button Visibility    ${user_dep_name}    True
    
    # User should NOT be able to edit admin's dependency
    Verify Edit Button Visibility    ${admin_dep_name}    False
    
    # Test that user can actually edit their own dependency
    ${new_name}=    Set Variable    ${user_dep_name}_UserEdited
    Edit Dependency    ${user_dep_name}    ${new_name}
    Verify Dependency Exists    ${new_name}
    
    # Clean up
    Delete Dependency With Confirmation    ${new_name}
    
    # Switch back to admin and clean up admin dependency
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    Delete Dependency With Confirmation    ${admin_dep_name}

TC076 - User Can Only Delete Own Dependencies
    [Documentation]    Test that regular users can only delete dependencies they created
    [Tags]    rbac    user    delete    restriction
    
    # Create dependency as admin first
    ${admin_dep_name}=    Generate Test Data    AdminDepForUserDeleteTest
    Add New Dependency    ${admin_dep_name}    Admin created dependency for user delete test    ${TEST_DEP_TEAM}
    
    # Switch to user
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    # Create dependency as user
    ${user_dep_name}=    Generate Test Data    UserOwnDepDelete
    Add New Dependency    ${user_dep_name}    User's own dependency for deletion    ${TEST_DEP_TEAM}
    
    # User should be able to delete their own dependency
    Verify Delete Button Visibility    ${user_dep_name}    True
    
    # User should NOT be able to delete admin's dependency
    Verify Delete Button Visibility    ${admin_dep_name}    False
    
    # Test that user can actually delete their own dependency
    Delete Dependency With Confirmation    ${user_dep_name}
    Verify Dependency Does Not Exist    ${user_dep_name}
    
    # Switch back to admin and clean up admin dependency
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    Delete Dependency With Confirmation    ${admin_dep_name}

TC077 - User Can Inline Edit Own Dependencies
    [Documentation]    Test that users can inline edit status/priority of their own dependencies
    [Tags]    rbac    user    inline_edit    own_dependencies
    
    # Login as regular user
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    # Create dependency as user
    ${user_dep_name}=    Generate Test Data    UserInlineEditTest
    Add New Dependency    ${user_dep_name}    User dependency for inline editing    ${TEST_DEP_TEAM}    NOT STARTED    LOW
    
    # User should be able to inline edit status of their own dependency
    Test Inline Status Edit    ${user_dep_name}    IN PROGRESS
    
    # User should be able to inline edit priority of their own dependency
    Test Inline Priority Edit    ${user_dep_name}    HIGH
    
    # Clean up
    Delete Dependency With Confirmation    ${user_dep_name}
    
    # Switch back to admin
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard

TC078 - User Cannot Inline Edit Other's Dependencies
    [Documentation]    Test that users cannot inline edit dependencies created by others
    [Tags]    rbac    user    inline_edit    restriction
    
    # Create dependency as admin
    ${admin_dep_name}=    Generate Test Data    AdminDepInlineEditRestrict
    Add New Dependency    ${admin_dep_name}    Admin dependency - user should not edit    ${TEST_DEP_TEAM}    NOT STARTED    MEDIUM
    
    # Switch to regular user
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    # User should not be able to see inline edit dropdowns for admin's dependency
    ${status_dropdown}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${admin_dep_name}')]]//select[contains(@class, 'status-dropdown')]
    ${priority_dropdown}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${admin_dep_name}')]]//select[contains(@class, 'priority-dropdown')]
    
    # Dropdowns should be disabled or not present for other users' dependencies
    Run Keyword And Return Status    Element Should Not Be Visible    ${status_dropdown}
    Run Keyword And Return Status    Element Should Not Be Visible    ${priority_dropdown}
    
    # Switch back to admin and clean up
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    Delete Dependency With Confirmation    ${admin_dep_name}

TC079 - Role Display Verification
    [Documentation]    Test that user roles are correctly displayed in the UI
    [Tags]    rbac    role_display    ui
    
    # Test admin role display
    Page Should Contain    Admin
    Page Should Contain    admin@demo.com
    
    # Switch to regular user and verify role display
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    Page Should Contain    user@demo.com
    Page Should Not Contain    Admin    # Regular users should not have admin designation
    
    # Switch back to admin
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard

TC080 - RBAC Consistency Across Sessions
    [Documentation]    Test RBAC rules are consistent across different browser sessions
    [Tags]    rbac    consistency    session
    
    # Create dependency as admin
    ${admin_dep_name}=    Generate Test Data    RBACConsistencyTest
    Add New Dependency    ${admin_dep_name}    RBAC consistency test dependency    ${TEST_DEP_TEAM}
    
    # Switch to user and verify restrictions
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    # User should not be able to edit admin's dependency
    Verify Edit Button Visibility    ${admin_dep_name}    False
    Verify Delete Button Visibility    ${admin_dep_name}    False
    
    # Refresh page and verify restrictions persist
    Reload Page
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    
    Verify Edit Button Visibility    ${admin_dep_name}    False
    Verify Delete Button Visibility    ${admin_dep_name}    False
    
    # Switch back to admin and verify admin privileges persist
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    
    Verify Edit Button Visibility    ${admin_dep_name}    True
    Verify Delete Button Visibility    ${admin_dep_name}    True
    
    # Clean up
    Delete Dependency With Confirmation    ${admin_dep_name}

TC081 - Bulk Operations RBAC
    [Documentation]    Test RBAC rules apply to bulk operations
    [Tags]    rbac    bulk    operations
    
    # Create multiple dependencies as admin
    @{admin_deps}=    Create List
    FOR    ${i}    IN RANGE    3
        ${dep_name}=    Generate Test Data    AdminBulk_${i}
        Append To List    ${admin_deps}    ${dep_name}
        Add New Dependency    ${dep_name}    Admin bulk test dependency ${i}    ${TEST_DEP_TEAM}
    END
    
    # Switch to user
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    # Create dependencies as user
    @{user_deps}=    Create List
    FOR    ${i}    IN RANGE    2
        ${dep_name}=    Generate Test Data    UserBulk_${i}
        Append To List    ${user_deps}    ${dep_name}
        Add New Dependency    ${dep_name}    User bulk test dependency ${i}    ${TEST_DEP_TEAM}
    END
    
    # User should only be able to delete their own dependencies
    FOR    ${dep_name}    IN    @{user_deps}
        Verify Delete Button Visibility    ${dep_name}    True
        Delete Dependency With Confirmation    ${dep_name}
    END
    
    # User should not be able to delete admin dependencies
    FOR    ${dep_name}    IN    @{admin_deps}
        Verify Delete Button Visibility    ${dep_name}    False
    END
    
    # Switch back to admin and clean up
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    
    FOR    ${dep_name}    IN    @{admin_deps}
        Delete Dependency With Confirmation    ${dep_name}
    END

TC082 - RBAC Data Isolation
    [Documentation]    Test that user data is properly isolated based on RBAC rules
    [Tags]    rbac    data_isolation    security
    
    # Create dependencies with similar names but different owners
    ${admin_dep}=    Generate Test Data    IsolationTest_Admin
    Add New Dependency    ${admin_dep}    Admin isolation test    ${TEST_DEP_TEAM}    IN PROGRESS    HIGH
    
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    ${user_dep}=    Generate Test Data    IsolationTest_User
    Add New Dependency    ${user_dep}    User isolation test    ${TEST_DEP_TEAM}    NOT STARTED    LOW
    
    # User should only see edit/delete options for their own dependency
    Verify Edit Button Visibility    ${user_dep}    True
    Verify Delete Button Visibility    ${user_dep}    True
    
    Verify Edit Button Visibility    ${admin_dep}    False
    Verify Delete Button Visibility    ${admin_dep}    False
    
    # User should not be able to modify admin's dependency even via direct manipulation
    ${admin_status_dropdown}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${admin_dep}')]]//select[contains(@class, 'status-dropdown')]
    Run Keyword And Return Status    Element Should Not Be Visible    ${admin_status_dropdown}
    
    # Clean up user dependency
    Delete Dependency With Confirmation    ${user_dep}
    
    # Switch back to admin and clean up admin dependency
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    Delete Dependency With Confirmation    ${admin_dep}

TC083 - RBAC Performance Impact
    [Documentation]    Test that RBAC checks don't significantly impact page performance
    [Tags]    rbac    performance    load
    
    # Create multiple dependencies with mixed ownership
    FOR    ${i}    IN RANGE    5
        ${admin_dep}=    Generate Test Data    PerfAdmin_${i}
        Add New Dependency    ${admin_dep}    Admin perf test ${i}    ${TEST_DEP_TEAM}
    END
    
    Logout From DepFlow
    Login To DepFlow    ${USER_USERNAME}    ${USER_PASSWORD}
    Navigate To Dashboard
    
    FOR    ${i}    IN RANGE    5
        ${user_dep}=    Generate Test Data    PerfUser_${i}
        Add New Dependency    ${user_dep}    User perf test ${i}    ${TEST_DEP_TEAM}
    END
    
    # Measure page load time with RBAC checks
    ${start_time}=    Get Current Date    result_format=epoch
    Reload Page
    Wait Until Page Contains Element    ${DASHBOARD_PAGE}    timeout=10s
    ${end_time}=    Get Current Date    result_format=epoch
    
    # Page should load within reasonable time even with RBAC checks
    ${duration}=    Evaluate    ${end_time} - ${start_time}
    Should Be True    ${duration} < 5    # Should load within 5 seconds
    
    # Clean up user dependencies
    FOR    ${i}    IN RANGE    5
        ${user_dep}=    Set Variable    PerfUser_${i}
        Run Keyword And Ignore Error    Delete Dependency With Confirmation    ${user_dep}
    END
    
    # Switch back to admin and clean up admin dependencies
    Logout From DepFlow
    Login As Admin
    Navigate To Dashboard
    
    FOR    ${i}    IN RANGE    5
        ${admin_dep}=    Set Variable    PerfAdmin_${i}
        Run Keyword And Ignore Error    Delete Dependency With Confirmation    ${admin_dep}
    END
