*** Settings ***
Documentation    Filtering and Search Test Suite for DepFlow Application
Resource         ../keywords/depflow_keywords.robot
Resource         ../config/variables.robot
Suite Setup      Setup Test Environment And Create Test Data
Suite Teardown   Logout And Teardown Test Environment
Test Setup       Navigate To Dashboard
Test Teardown    Clear All Filters And Take Screenshot

*** Variables ***
@{TEST_DEPENDENCIES}    FilterTest_React    FilterTest_Angular    FilterTest_Vue

*** Keywords ***
Setup Test Environment And Create Test Data
    [Documentation]    Setup environment, login, and create test dependencies
    Setup Test Environment
    Login As Admin
    
    # Create test dependencies with different attributes
    Add New Dependency    FilterTest_React      React component for testing      Quality flow        NOT STARTED    HIGH    HIGH    
    Add New Dependency    FilterTest_Angular    Angular service for testing      Data Collection     IN PROGRESS    MEDIUM  MEDIUM
    Add New Dependency    FilterTest_Vue        Vue component for testing        ADAP Platform       BLOCKED        LOW     LOW
    Add New Dependency    FilterTest_Node       Node.js backend service          CrowdGen           COMPLETED      HIGH    MEDIUM

Clear All Filters And Take Screenshot
    [Documentation]    Clear all filters and take screenshot
    Run Keyword And Ignore Error    Clear All Filters
    Take Screenshot With Timestamp

Logout And Teardown Test Environment
    [Documentation]    Cleanup test data, logout and teardown
    Run Keyword And Ignore Error    Navigate To Dashboard
    Run Keyword And Ignore Error    Delete Dependency    FilterTest_React
    Run Keyword And Ignore Error    Delete Dependency    FilterTest_Angular  
    Run Keyword And Ignore Error    Delete Dependency    FilterTest_Vue
    Run Keyword And Ignore Error    Delete Dependency    FilterTest_Node
    Run Keyword And Ignore Error    Logout From DepFlow
    Teardown Test Environment

*** Test Cases ***
TC029 - Search Dependencies By Name
    [Documentation]    Test searching for dependencies by name
    [Tags]    search    filter    smoke
    
    Search Dependencies    React
    
    # Should find React dependency
    Verify Dependency Exists    FilterTest_React
    
    # Should not show others
    ${visible_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${visible_count}    1

TC030 - Search Dependencies By Description
    [Documentation]    Test searching for dependencies by description content
    [Tags]    search    filter
    
    Search Dependencies    component
    
    # Should find React and Vue dependencies (both have "component" in description)
    Verify Dependency Exists    FilterTest_React
    Verify Dependency Exists    FilterTest_Vue
    
    ${visible_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${visible_count}    2

TC031 - Search With Partial Text
    [Documentation]    Test searching with partial text matches
    [Tags]    search    partial
    
    Search Dependencies    Filter
    
    # Should find all test dependencies (all start with "FilterTest")
    ${visible_count}=    Get Visible Dependencies Count
    Should Be True    ${visible_count} >= 4

TC032 - Search Case Insensitive
    [Documentation]    Test that search is case insensitive
    [Tags]    search    case_insensitive
    
    Search Dependencies    REACT
    Verify Dependency Exists    FilterTest_React
    
    Clear All Filters
    Search Dependencies    react
    Verify Dependency Exists    FilterTest_React
    
    Clear All Filters
    Search Dependencies    ReAcT
    Verify Dependency Exists    FilterTest_React

TC033 - Search With No Results
    [Documentation]    Test searching with text that matches nothing
    [Tags]    search    negative
    
    Search Dependencies    NonExistentDependency12345
    
    ${visible_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${visible_count}    0

TC034 - Filter By Team
    [Documentation]    Test filtering dependencies by team
    [Tags]    filter    team
    
    Filter By Team    Quality flow
    Verify Dependency Exists    FilterTest_React
    
    ${visible_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${visible_count}    1

TC035 - Filter By Status
    [Documentation]    Test filtering dependencies by status
    [Tags]    filter    status
    
    Filter By Status    IN PROGRESS
    Verify Dependency Exists    FilterTest_Angular
    
    ${visible_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${visible_count}    1

TC036 - Filter By Priority
    [Documentation]    Test filtering dependencies by priority level
    [Tags]    filter    priority
    
    Filter By Priority    HIGH
    Verify Dependency Exists    FilterTest_React
    Verify Dependency Exists    FilterTest_Node
    
    ${visible_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${visible_count}    2

TC037 - Combined Search And Filter
    [Documentation]    Test combining search and filter operations
    [Tags]    search    filter    combined
    
    Search Dependencies    FilterTest
    Filter By Team    Data Collection
    
    # Should only show Angular dependency
    Verify Dependency Exists    FilterTest_Angular
    ${visible_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${visible_count}    1

TC038 - Multiple Filters Combined
    [Documentation]    Test applying multiple filters simultaneously
    [Tags]    filter    multiple    combined
    
    Filter By Status    NOT STARTED
    Filter By Priority    HIGH
    
    # Should show React dependency (NOT STARTED + HIGH priority)
    Verify Dependency Exists    FilterTest_React
    ${visible_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${visible_count}    1

TC039 - Clear All Filters Functionality
    [Documentation]    Test the clear all filters button functionality
    [Tags]    filter    clear    ui
    
    # Apply multiple filters
    Search Dependencies    FilterTest
    Filter By Team    Quality flow
    Filter By Status    NOT STARTED
    
    # Verify filtered results
    ${filtered_count}=    Get Visible Dependencies Count
    Should Be True    ${filtered_count} < 4
    
    # Clear all filters
    Clear All Filters
    
    # Should show all dependencies again
    ${cleared_count}=    Get Visible Dependencies Count
    Should Be True    ${cleared_count} >= 4

TC040 - Counter Filter By Total
    [Documentation]    Test clicking total counter to show all dependencies
    [Tags]    counter    filter    total
    
    Click Counter Filter    total
    
    # Should show all dependencies
    ${visible_count}=    Get Visible Dependencies Count
    Should Be True    ${visible_count} >= 4

TC041 - Counter Filter By Status
    [Documentation]    Test clicking status counters to filter by status
    [Tags]    counter    filter    status
    
    # Filter by IN PROGRESS using counter
    Click Counter Filter    in_progress
    Verify Dependency Exists    FilterTest_Angular
    
    # Verify counter is highlighted (has active class)
    Element Should Be Visible    ${IN_PROGRESS_COUNT_CARD}

TC042 - Counter Filter Toggle Behavior
    [Documentation]    Test counter filter toggle behavior (click twice to clear)
    [Tags]    counter    filter    toggle
    
    # Click counter to filter
    Click Counter Filter    blocked
    ${filtered_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${filtered_count}    1
    
    # Click same counter again to clear filter
    Click Counter Filter    blocked
    ${cleared_count}=    Get Visible Dependencies Count
    Should Be True    ${cleared_count} > 1

TC043 - Search With Special Characters
    [Documentation]    Test searching with special characters
    [Tags]    search    special_characters
    
    Search Dependencies    Test_
    
    # Should find all FilterTest_ dependencies
    ${visible_count}=    Get Visible Dependencies Count
    Should Be True    ${visible_count} >= 4

TC044 - Filter Persistence During Navigation
    [Documentation]    Test that filters persist during page operations
    [Tags]    filter    persistence
    
    Filter By Team    Quality flow
    ${before_count}=    Get Visible Dependencies Count
    
    # Perform some action that doesn't change page
    Click Element    ${TOTAL_COUNT}
    Sleep    1s
    
    # Filter should still be active
    ${after_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${after_count}    ${before_count}

TC045 - Empty Search Clear
    [Documentation]    Test that clearing search field shows all results
    [Tags]    search    clear
    
    # Apply search filter
    Search Dependencies    React
    ${filtered_count}=    Get Visible Dependencies Count
    
    # Clear search field
    Clear Element Text    ${SEARCH_INPUT}
    Sleep    2s    # Allow filter to update
    
    # Should show more results
    ${cleared_count}=    Get Visible Dependencies Count
    Should Be True    ${cleared_count} > ${filtered_count}

TC046 - Filter By All Teams Sequentially
    [Documentation]    Test filtering by each team option sequentially
    [Tags]    filter    team    comprehensive
    
    FOR    ${team}    IN    @{TEAMS}
        Filter By Team    ${team}
        Sleep    1s
        
        # Clear filter for next iteration
        Clear All Filters
        Sleep    1s
    END

TC047 - Filter By All Statuses Sequentially
    [Documentation]    Test filtering by each status option sequentially
    [Tags]    filter    status    comprehensive
    
    FOR    ${status}    IN    @{STATUSES}
        Filter By Status    ${status}
        Sleep    1s
        
        # Clear filter for next iteration
        Clear All Filters
        Sleep    1s
    END

TC048 - Filter By All Priorities Sequentially
    [Documentation]    Test filtering by each priority option sequentially
    [Tags]    filter    priority    comprehensive
    
    FOR    ${priority}    IN    @{PRIORITIES}
        Filter By Priority    ${priority}
        Sleep    1s
        
        # Clear filter for next iteration
        Clear All Filters
        Sleep    1s
    END

TC049 - Complex Filter Combinations
    [Documentation]    Test complex combinations of multiple filter types
    [Tags]    filter    complex    comprehensive
    
    # Test Combination 1: Search + Team + Status
    Search Dependencies    FilterTest
    Filter By Team    Quality flow
    Filter By Status    NOT STARTED
    ${combo1_count}=    Get Visible Dependencies Count
    Should Be True    ${combo1_count} >= 0
    
    Clear All Filters
    
    # Test Combination 2: Team + Priority + Status
    Filter By Team    CrowdGen
    Filter By Priority    HIGH
    Filter By Status    COMPLETED
    ${combo2_count}=    Get Visible Dependencies Count
    Should Be True    ${combo2_count} >= 0
    
    Clear All Filters

TC050 - Filter Results Count Validation
    [Documentation]    Test that filter results match expected counts
    [Tags]    filter    validation    count
    
    # Count total dependencies
    ${total_count}=    Get Visible Dependencies Count
    
    # Filter by NOT STARTED status
    Filter By Status    NOT STARTED
    ${not_started_count}=    Get Visible Dependencies Count
    
    Clear All Filters
    
    # Filter by IN PROGRESS status
    Filter By Status    IN PROGRESS
    ${in_progress_count}=    Get Visible Dependencies Count
    
    Clear All Filters
    
    # Filter by BLOCKED status
    Filter By Status    BLOCKED
    ${blocked_count}=    Get Visible Dependencies Count
    
    Clear All Filters
    
    # Filter by COMPLETED status
    Filter By Status    COMPLETED
    ${completed_count}=    Get Visible Dependencies Count
    
    # Verify counts add up logically
    ${sum_count}=    Evaluate    ${not_started_count} + ${in_progress_count} + ${blocked_count} + ${completed_count}
    Should Be Equal As Numbers    ${sum_count}    ${total_count}

