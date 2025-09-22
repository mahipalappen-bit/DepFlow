*** Settings ***
Documentation    Dependency CRUD Operations Test Suite for DepFlow Application
Resource         ../keywords/depflow_keywords.robot
Resource         ../config/variables.robot
Suite Setup      Setup Test Environment And Login
Suite Teardown   Logout And Teardown Test Environment
Test Setup       Navigate To Dashboard And Close Modals
Test Teardown    Take Screenshot With Timestamp

*** Keywords ***
Setup Test Environment And Login
    [Documentation]    Setup test environment and login as admin
    Setup Test Environment
    Login As Admin

Logout And Teardown Test Environment
    [Documentation]    Logout and teardown test environment
    Run Keyword And Ignore Error    Logout From DepFlow
    Teardown Test Environment

Navigate To Dashboard And Close Modals
    [Documentation]    Navigate to dashboard and ensure all modals are closed
    Navigate To Dashboard
    Ensure All Modals Closed

*** Test Cases ***
TC013 - Verify Dashboard Elements Present
    [Documentation]    Verify all dashboard elements are present after login
    [Tags]    smoke    dashboard    ui
    
    Page Should Contain Element    ${ADD_DEPENDENCY_BUTTON}
    Page Should Contain Element    ${TOTAL_COUNT}
    Page Should Contain Element    ${SEARCH_INPUT}
    Page Should Contain Element    ${DEPENDENCY_TABLE}
    Verify DepFlow Dashboard Logo Present

TC014 - Open Add Dependency Modal
    [Documentation]    Test opening the Add Dependency modal
    [Tags]    smoke    ui    modal
    
    Ensure All Modals Closed
    Sleep    1s
    Click Element    ${ADD_DEPENDENCY_BUTTON}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}    timeout=10s
    Element Should Be Visible    ${DEP_NAME_FIELD}
    Element Should Be Visible    ${DEP_DESCRIPTION_FIELD}
    Element Should Be Visible    ${DEP_TEAM_SELECT}
    Element Should Be Visible    ${DEP_STATUS_SELECT}
    Element Should Be Visible    ${SAVE_BUTTON}
    Element Should Be Visible    ${CANCEL_BUTTON}

TC015 - Add New Dependency Successfully
    [Documentation]    Test successful creation of a new dependency
    [Tags]    smoke    crud    create
    
    ${unique_name}=    Generate Test Data    CreateTest
    ${description}=    Set Variable    Test dependency created by Robot Framework automation
    
    Add New Dependency    ${unique_name}    ${description}    ${TEST_DEP_TEAM}    ${TEST_DEP_STATUS}    ${TEST_DEP_PRIORITY}    ${TEST_DEP_RISK}    ${TEST_JIRA_URL}
    
    # Verify dependency was created
    Verify Dependency Exists    ${unique_name}
    Verify Notification Message    successfully

TC016 - Add Dependency With Minimal Required Fields
    [Documentation]    Test creating dependency with only required fields
    [Tags]    crud    create    minimal
    
    ${unique_name}=    Generate Test Data    MinimalTest
    ${description}=    Set Variable    Minimal test dependency with required fields only
    
    Add New Dependency    ${unique_name}    ${description}    ${TEST_DEP_TEAM}
    
    Verify Dependency Exists    ${unique_name}
    Verify Notification Message    successfully

TC017 - Validate Required Field - Name
    [Documentation]    Test that name field is required for dependency creation
    [Tags]    crud    validation    negative
    
    Click Element    ${ADD_DEPENDENCY_BUTTON}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}
    
    # Leave name empty, fill other fields
    Input Text    ${DEP_DESCRIPTION_FIELD}    Test description without name
    Select From List By Label    ${DEP_TEAM_SELECT}    ${TEST_DEP_TEAM}
    
    Click Element    ${SAVE_BUTTON}
    
    # Modal should remain open due to validation error
    Element Should Be Visible    ${ADD_EDIT_MODAL}

TC018 - Validate Required Field - Description
    [Documentation]    Test that description field validation works
    [Tags]    crud    validation    negative
    
    Click Element    ${ADD_DEPENDENCY_BUTTON}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}
    
    # Fill name but leave description too short
    Input Text    ${DEP_NAME_FIELD}    Test Name
    Input Text    ${DEP_DESCRIPTION_FIELD}    Short
    Select From List By Label    ${DEP_TEAM_SELECT}    ${TEST_DEP_TEAM}
    
    Click Element    ${SAVE_BUTTON}
    
    # Should show validation error
    Element Should Be Visible    ${ADD_EDIT_MODAL}

TC019 - Edit Existing Dependency
    [Documentation]    Test editing an existing dependency
    [Tags]    crud    update    edit
    
    # First create a dependency to edit
    ${original_name}=    Generate Test Data    EditTest
    ${original_desc}=    Set Variable    Original description for edit test
    Add New Dependency    ${original_name}    ${original_desc}    ${TEST_DEP_TEAM}
    
    # Now edit it
    ${new_name}=         Set Variable    ${original_name}_EDITED
    ${new_desc}=         Set Variable    Updated description after edit
    ${new_team}=         Set Variable    Data Collection
    
    Edit Dependency    ${original_name}    ${new_name}    ${new_desc}    ${new_team}
    
    # Verify changes
    Verify Dependency Exists    ${new_name}
    Verify Dependency Does Not Exist    ${original_name}
    Verify Notification Message    successfully

TC020 - Delete Dependency Successfully  
    [Documentation]    Test successful deletion of a dependency
    [Tags]    crud    delete
    
    # Create dependency to delete
    ${dep_name}=    Generate Test Data    DeleteTest
    ${description}=    Set Variable    Dependency created for deletion test
    Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}
    
    # Delete the dependency
    Delete Dependency    ${dep_name}
    
    # Verify it's gone
    Verify Dependency Does Not Exist    ${dep_name}

TC021 - Cancel Add Dependency Operation
    [Documentation]    Test canceling the add dependency operation
    [Tags]    crud    ui    cancel
    
    Click Element    ${ADD_DEPENDENCY_BUTTON}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}
    
    # Fill some fields
    Input Text    ${DEP_NAME_FIELD}    Cancelled Dependency
    Input Text    ${DEP_DESCRIPTION_FIELD}    This should not be saved
    
    # Cancel instead of save
    Click Element    ${CANCEL_BUTTON}
    Wait Until Element Is Not Visible    ${ADD_EDIT_MODAL}
    
    # Verify dependency was not created
    Verify Dependency Does Not Exist    Cancelled Dependency

TC022 - Add Dependency With All Teams
    [Documentation]    Test creating dependencies for all available teams
    [Tags]    crud    teams    comprehensive
    
    FOR    ${team}    IN    @{TEAMS}
        ${unique_name}=    Generate Test Data    Team_${team.replace(' ', '_')}
        ${description}=    Set Variable    Test dependency for ${team} team
        
        Add New Dependency    ${unique_name}    ${description}    ${team}
        Verify Dependency Exists    ${unique_name}
        Sleep    1s    # Brief pause between creations
    END

TC023 - Add Dependency With All Status Options
    [Documentation]    Test creating dependencies with all available statuses
    [Tags]    crud    status    comprehensive
    
    FOR    ${status}    IN    @{STATUSES}
        ${unique_name}=    Generate Test Data    Status_${status.replace(' ', '_')}
        ${description}=    Set Variable    Test dependency with ${status} status
        
        Add New Dependency    ${unique_name}    ${description}    ${TEST_DEP_TEAM}    ${status}
        Verify Dependency Exists    ${unique_name}
        Sleep    1s
    END

TC024 - Add Dependency With All Priority Levels
    [Documentation]    Test creating dependencies with all priority levels
    [Tags]    crud    priority    comprehensive
    
    FOR    ${priority}    IN    @{PRIORITIES}
        ${unique_name}=    Generate Test Data    Priority_${priority}
        ${description}=    Set Variable    Test dependency with ${priority} priority
        
        Add New Dependency    ${unique_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED    ${priority}
        Verify Dependency Exists    ${unique_name}
        Sleep    1s
    END

TC025 - Verify Counter Updates After CRUD Operations
    [Documentation]    Test that counters update correctly after CRUD operations
    [Tags]    crud    counters    integration
    
    # Get initial count
    ${initial_count}=    Get Counter Value    ${TOTAL_COUNT}
    
    # Add a dependency
    ${dep_name}=    Generate Test Data    CounterTest
    Add New Dependency    ${dep_name}    Test for counter updates    ${TEST_DEP_TEAM}
    
    # Verify counter increased
    ${after_add_count}=    Get Counter Value    ${TOTAL_COUNT}
    ${expected_count}=    Evaluate    ${initial_count} + 1
    Should Be Equal As Numbers    ${after_add_count}    ${expected_count}
    
    # Delete the dependency
    Delete Dependency    ${dep_name}
    
    # Verify counter decreased
    ${after_delete_count}=    Get Counter Value    ${TOTAL_COUNT}
    Should Be Equal As Numbers    ${after_delete_count}    ${initial_count}

TC026 - Add Dependency With Special Characters
    [Documentation]    Test creating dependency with special characters in name and description
    [Tags]    crud    special_characters    edge_case
    
    ${special_name}=       Set Variable    Test-Dep_With@Special#Chars!
    ${special_desc}=       Set Variable    Description with special chars: @#$%^&*()_+-={}[]|\\:";'<>?,./
    
    Add New Dependency    ${special_name}    ${special_desc}    ${TEST_DEP_TEAM}
    Verify Dependency Exists    ${special_name}

TC027 - Add Dependency With Long Text
    [Documentation]    Test creating dependency with maximum length text fields
    [Tags]    crud    boundary    edge_case
    
    ${long_name}=    Set Variable    ${'Very Long Dependency Name That Exceeds Normal Length To Test Field Boundaries' * 2}
    ${long_desc}=    Set Variable    ${'This is a very long description that tests the maximum length boundaries of the description field in the dependency management system. ' * 10}
    
    Add New Dependency    ${long_name}    ${long_desc}    ${TEST_DEP_TEAM}
    Verify Dependency Exists    ${long_name}

TC028 - Bulk Delete Dependencies
    [Documentation]    Test deleting multiple dependencies in sequence
    [Tags]    crud    bulk    delete
    
    # Create multiple dependencies
    @{dep_names}=    Create List
    FOR    ${i}    IN RANGE    3
        ${dep_name}=    Generate Test Data    BulkDelete_${i}
        Append To List    ${dep_names}    ${dep_name}
        Add New Dependency    ${dep_name}    Bulk delete test dependency ${i}    ${TEST_DEP_TEAM}
    END
    
    # Delete all created dependencies  
    FOR    ${dep_name}    IN    @{dep_names}
        Delete Dependency    ${dep_name}
        Verify Dependency Does Not Exist    ${dep_name}
    END
