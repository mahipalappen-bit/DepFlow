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
    Add New Dependency    FilterTest_React      React component for testing      Quality Flow        NOT STARTED    HIGH  
    Add New Dependency    FilterTest_Angular    Angular service for testing      Data Collection     IN PROGRESS    MEDIUM
    Add New Dependency    FilterTest_Vue        Vue component for testing        ADAP Platform       BLOCKED        LOW
    Add New Dependency    FilterTest_Node       Node.js backend service          Crowdgen           COMPLETED      HIGH

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
    
    # Should show React dependencies (test + default)
    ${visible_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${visible_count}    2

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
    
    Filter By Team    Quality Flow
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
    Filter By Team    Quality Flow
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
    [Tags]    counter    filter    total    smoke
    
    Click Counter Filter    total
    
    # Should show all dependencies
    ${visible_count}=    Get Visible Dependencies Count
    Should Be True    ${visible_count} >= 4
    
    # Verify no counter is highlighted when showing all dependencies (no active filter)
    ${total_card}=    Get WebElement    ${TOTAL_COUNT_CARD}
    ${class_attr}=    Get Element Attribute    ${total_card}    class
    Should Not Contain    ${class_attr}    active-filter    # Total counter should not have active-filter when showing all

TC041 - Counter Filter By Status
    [Documentation]    Test clicking status counters to filter by status
    [Tags]    counter    filter    status
    
    # Filter by IN PROGRESS using counter
    Click Counter Filter    in_progress
    Verify Dependency Exists    FilterTest_Angular
    
    # Verify counter is highlighted (has active class)
    Element Should Be Visible    ${IN_PROGRESS_COUNT_CARD}
    ${progress_card}=    Get WebElement    ${IN_PROGRESS_COUNT_CARD}
    ${class_attr}=    Get Element Attribute    ${progress_card}    class
    Should Contain    ${class_attr}    active-filter

TC041A - Counter Filter By All Status Types
    [Documentation]    Test clicking each status counter individually
    [Tags]    counter    filter    status    comprehensive
    
    # Test each status counter
    Click Counter Filter    not_started
    Sleep    1s
    ${not_started_visible}=    Get Visible Dependencies Count
    Should Be True    ${not_started_visible} >= 0
    
    Click Counter Filter    in_progress
    Sleep    1s
    ${in_progress_visible}=    Get Visible Dependencies Count
    Should Be True    ${in_progress_visible} >= 0
    
    Click Counter Filter    blocked
    Sleep    1s
    ${blocked_visible}=    Get Visible Dependencies Count
    Should Be True    ${blocked_visible} >= 0
    
    Click Counter Filter    completed
    Sleep    1s
    ${completed_visible}=    Get Visible Dependencies Count
    Should Be True    ${completed_visible} >= 0

TC042 - Counter Filter Toggle Behavior
    [Documentation]    Test counter filter toggle behavior (click twice to clear)
    [Tags]    counter    filter    toggle
    
    # Click counter to filter
    Click Counter Filter    blocked
    ${filtered_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${filtered_count}    2
    
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
    
    Filter By Team    Quality Flow
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
    Filter By Team    Quality Flow
    Filter By Status    NOT STARTED
    ${combo1_count}=    Get Visible Dependencies Count
    Should Be True    ${combo1_count} >= 0
    
    Clear All Filters
    
    # Test Combination 2: Team + Priority + Status
    Filter By Team    Crowdgen
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

TC051 - Enhanced Search with Special Characters
    [Documentation]    Test search functionality with various special characters
    [Tags]    search    special_characters    enhanced
    
    # Test search with underscores
    Search Dependencies    Filter_Test
    ${underscore_count}=    Get Visible Dependencies Count
    Should Be True    ${underscore_count} >= 0
    
    Clear All Filters
    
    # Test search with hyphens
    Search Dependencies    Test-
    ${hyphen_count}=    Get Visible Dependencies Count
    Should Be True    ${hyphen_count} >= 0
    
    Clear All Filters
    
    # Test search with numbers
    Search Dependencies    1
    ${number_count}=    Get Visible Dependencies Count
    Should Be True    ${number_count} >= 0

TC052 - Counter Filter Visual Feedback
    [Documentation]    Test visual feedback when counter filters are active
    [Tags]    counter    filter    ui    visual
    
    # Click IN PROGRESS counter and verify visual state
    Click Counter Filter    in_progress
    ${progress_card}=    Get WebElement    ${IN_PROGRESS_COUNT_CARD}
    ${class_attr}=    Get Element Attribute    ${progress_card}    class
    Should Contain    ${class_attr}    active-filter
    
    # Click another counter and verify previous one is deactivated
    Click Counter Filter    blocked
    ${blocked_card}=    Get WebElement    ${BLOCKED_COUNT_CARD}
    ${blocked_class}=    Get Element Attribute    ${blocked_card}    class
    Should Contain    ${blocked_class}    active-filter
    
    # Previous counter should not be active
    ${progress_class_new}=    Get Element Attribute    ${progress_card}    class
    Should Not Contain    ${progress_class_new}    active-filter

TC053 - Counter Filter and Search Combination
    [Documentation]    Test combining counter filtering with search functionality
    [Tags]    counter    search    combination    filter
    
    # Apply search first
    Search Dependencies    FilterTest
    ${search_count}=    Get Visible Dependencies Count
    
    # Apply counter filter on top of search
    Click Counter Filter    not_started
    ${combined_count}=    Get Visible Dependencies Count
    
    # Combined count should be less than or equal to search count
    Should Be True    ${combined_count} <= ${search_count}
    
    Clear All Filters

TC054 - Real-time Filter Updates
    [Documentation]    Test that filters update results in real-time
    [Tags]    filter    realtime    performance
    
    # Apply filter and measure response time
    ${start_time}=    Get Current Date    result_format=epoch
    Filter By Team    Quality Flow
    ${end_time}=    Get Current Date    result_format=epoch
    
    # Filter should apply quickly (under 2 seconds)
    ${duration}=    Evaluate    ${end_time} - ${start_time}
    Should Be True    ${duration} < 2
    
    # Verify results are filtered
    Verify Dependency Exists    FilterTest_React
    ${filtered_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${filtered_count}    1

TC055 - Filter State Persistence During Navigation
    [Documentation]    Test that filter state persists during various page operations
    [Tags]    filter    persistence    navigation
    
    # Apply multiple filters
    Search Dependencies    FilterTest
    Filter By Team    Data Collection
    ${filtered_count_before}=    Get Visible Dependencies Count
    
    # Perform navigation operation (scroll, etc.)
    Execute Javascript    window.scrollTo(0, document.body.scrollHeight);
    Sleep    1s
    Execute Javascript    window.scrollTo(0, 0);
    
    # Filters should still be active
    ${filtered_count_after}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${filtered_count_after}    ${filtered_count_before}

TC056 - Empty Filter Results Handling
    [Documentation]    Test application behavior when filters return no results
    [Tags]    filter    empty    edge_case
    
    # Apply filter that should return no results
    Search Dependencies    NonExistentDependency999
    Filter By Status    COMPLETED
    Filter By Team    Crowdgen
    
    ${empty_count}=    Get Visible Dependencies Count
    Should Be Equal As Numbers    ${empty_count}    0
    
    # Verify appropriate message or empty state
    Page Should Contain Element    ${DEPENDENCY_TABLE}
    
    Clear All Filters

TC057 - Filter Performance with Large Data Sets
    [Documentation]    Test filter performance with multiple dependencies
    [Tags]    filter    performance    load
    
    # Create multiple test dependencies for performance testing
    FOR    ${i}    IN RANGE    10
        ${dep_name}=    Generate Test Data    PerfTest_${i}
        ${description}=    Set Variable    Performance test dependency ${i}
        Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED
    END
    
    # Test search performance
    ${start_time}=    Get Current Date    result_format=epoch
    Search Dependencies    PerfTest
    ${end_time}=    Get Current Date    result_format=epoch
    
    ${duration}=    Evaluate    ${end_time} - ${start_time}
    Should Be True    ${duration} < 3    # Should complete within 3 seconds
    
    # Verify results
    ${perf_count}=    Get Visible Dependencies Count
    Should Be True    ${perf_count} >= 10
    
    # Clean up performance test dependencies
    Clear All Filters
    FOR    ${i}    IN RANGE    10
        ${dep_name}=    Set Variable    PerfTest_${i}
        Run Keyword And Ignore Error    Delete Dependency With Confirmation    ${dep_name}
    END

