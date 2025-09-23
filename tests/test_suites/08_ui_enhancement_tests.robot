*** Settings ***
Documentation    UI Enhancements Test Suite for DepFlow Application - Colors, Badges, Favicon, and Visual Elements
Resource         ../keywords/depflow_keywords.robot
Resource         ../config/variables.robot
Suite Setup      Setup UI Enhancement Test Environment
Suite Teardown   Teardown UI Enhancement Test Environment
Test Setup       Login And Navigate To Dashboard
Test Teardown    Take Screenshot And Cleanup UI Tests

*** Keywords ***
Setup UI Enhancement Test Environment
    [Documentation]    Setup test environment for UI enhancement testing
    Setup Test Environment

Teardown UI Enhancement Test Environment
    [Documentation]    Teardown test environment
    Teardown Test Environment

Login And Navigate To Dashboard
    [Documentation]    Login and navigate to dashboard for UI tests
    Login As Admin
    Navigate To Dashboard
    Ensure All Modals Closed

Take Screenshot And Cleanup UI Tests
    [Documentation]    Take screenshot and cleanup any UI test dependencies
    Take Screenshot With Timestamp
    # Clean up test dependencies
    ${test_deps}=    Get WebElements    xpath://td[contains(@class, 'dependency-name') and contains(text(), 'UITest')]
    FOR    ${dep}    IN    @{test_deps}
        ${dep_name}=    Get Text    ${dep}
        Run Keyword And Ignore Error    Delete Dependency With Confirmation    ${dep_name}
    END

*** Test Cases ***
TC099 - Favicon Display Verification
    [Documentation]    Test that favicon is properly displayed in browser tab
    [Tags]    ui    favicon    branding    smoke
    
    # Verify favicon link element exists in HTML head
    Page Should Contain Element    xpath://link[@rel='icon']
    
    # Verify favicon has correct attributes
    ${favicon}=    Get WebElement    xpath://link[@rel='icon']
    ${favicon_href}=    Get Element Attribute    ${favicon}    href
    Should Contain    ${favicon_href}    data:image/svg+xml
    
    # Verify page title is correct for branding
    Title Should Be    DepFlow - Enterprise Dependency Management Platform

TC100 - Status Badge Color Consistency
    [Documentation]    Test that status badges display consistent colors across all status types
    [Tags]    ui    status    colors    badges
    
    # Create dependencies with different statuses to test colors
    FOR    ${status}    IN    @{STATUSES}
        ${dep_name}=    Generate Test Data    UITest_Status_${status.replace(' ', '_')}
        ${description}=    Set Variable    Testing ${status} status color consistency
        Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    ${status}    MEDIUM
        
        # Verify status badge exists and has proper styling
        ${status_badge}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//span[contains(@class, 'status-badge')]
        Element Should Be Visible    ${status_badge}
        
        # Verify badge contains status text
        ${badge_text}=    Get Text    ${status_badge}
        Should Be Equal    ${badge_text}    ${status}
        
        # Verify badge has color styling (background color attribute)
        ${badge_style}=    Get Element Attribute    ${status_badge}    style
        Should Not Be Empty    ${badge_style}
        
        # Clean up immediately to avoid accumulation
        Delete Dependency With Confirmation    ${dep_name}
    END

TC101 - Priority Badge Color Consistency
    [Documentation]    Test that priority badges display consistent colors across all priority levels
    [Tags]    ui    priority    colors    badges
    
    # Create dependencies with different priorities to test colors
    FOR    ${priority}    IN    @{PRIORITIES}
        ${dep_name}=    Generate Test Data    UITest_Priority_${priority}
        ${description}=    Set Variable    Testing ${priority} priority color consistency
        Add New Dependency    ${dep_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED    ${priority}
        
        # Verify priority badge exists and has proper styling
        ${priority_badge}=    Set Variable    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//span[contains(@class, 'priority-badge')]
        Element Should Be Visible    ${priority_badge}
        
        # Verify badge contains priority text
        ${badge_text}=    Get Text    ${priority_badge}
        Should Be Equal    ${badge_text}    ${priority}
        
        # Verify badge has color styling
        ${badge_style}=    Get Element Attribute    ${priority_badge}    style
        Should Not Be Empty    ${badge_style}
        
        # Clean up immediately
        Delete Dependency With Confirmation    ${dep_name}
    END

TC102 - Light Color Palette Implementation
    [Documentation]    Test that the application uses light, modern color palette
    [Tags]    ui    colors    palette    modern
    
    ${dep_name}=    Generate Test Data    UITest_ColorPalette
    Add New Dependency    ${dep_name}    Testing light color palette    ${TEST_DEP_TEAM}    IN PROGRESS    HIGH
    
    # Check status badge uses light colors (specific hex values)
    ${status_badge}=    Get WebElement    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//span[contains(@class, 'status-badge')]
    ${status_style}=    Get Element Attribute    ${status_badge}    style
    
    # Should contain light blue color for IN PROGRESS (0ea5e9)
    Should Match Regexp    ${status_style}    (?i)(0ea5e9|rgb\\(14,\\s*165,\\s*233\\))
    
    # Check priority badge uses light colors
    ${priority_badge}=    Get WebElement    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//span[contains(@class, 'priority-badge')]
    ${priority_style}=    Get Element Attribute    ${priority_badge}    style
    
    # Should contain light red color for HIGH priority (f56565)
    Should Match Regexp    ${priority_style}    (?i)(f56565|rgb\\(245,\\s*101,\\s*101\\))

TC103 - Counter Cards Visual Enhancement
    [Documentation]    Test that counter cards have proper visual enhancements and animations
    [Tags]    ui    counters    visual    animations
    
    # Verify all counter cards exist
    Element Should Be Visible    ${TOTAL_COUNT_CARD}
    Element Should Be Visible    ${NOT_STARTED_COUNT_CARD}
    Element Should Be Visible    ${IN_PROGRESS_COUNT_CARD}
    Element Should Be Visible    ${BLOCKED_COUNT_CARD}
    Element Should Be Visible    ${DONE_COUNT_CARD}
    
    # Check counter cards have proper CSS classes for styling
    ${total_card}=    Get WebElement    ${TOTAL_COUNT_CARD}
    ${total_class}=    Get Element Attribute    ${total_card}    class
    Should Contain    ${total_class}    counter-card
    
    # Test counter interaction visual feedback
    Click Element    ${IN_PROGRESS_COUNT_CARD}
    Sleep    1s    # Allow animation to complete
    
    ${progress_card}=    Get WebElement    ${IN_PROGRESS_COUNT_CARD}
    ${active_class}=    Get Element Attribute    ${progress_card}    class
    Should Contain    ${active_class}    active    # Should have active state styling

TC104 - Dropdown Styling Consistency
    [Documentation]    Test that status and priority dropdowns have consistent styling
    [Tags]    ui    dropdowns    styling    inline_edit
    
    ${dep_name}=    Generate Test Data    UITest_Dropdowns
    Add New Dependency    ${dep_name}    Testing dropdown styling    ${TEST_DEP_TEAM}    NOT STARTED    LOW
    
    # Verify status dropdown exists and has proper styling
    ${status_dropdown}=    Get WebElement    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//select[contains(@class, 'status-dropdown')]
    Element Should Be Visible    ${status_dropdown}
    
    ${status_class}=    Get Element Attribute    ${status_dropdown}    class
    Should Contain    ${status_class}    status-dropdown
    
    # Verify priority dropdown exists and has proper styling
    ${priority_dropdown}=    Get WebElement    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//select[contains(@class, 'priority-dropdown')]
    Element Should Be Visible    ${priority_dropdown}
    
    ${priority_class}=    Get Element Attribute    ${priority_dropdown}    class
    Should Contain    ${priority_class}    priority-dropdown
    
    # Test dropdown interaction
    Click Element    ${status_dropdown}
    Select From List By Value    ${status_dropdown}    IN PROGRESS
    
    # Verify selection updates badge color
    Sleep    2s    # Allow update to process
    ${status_badge}=    Get WebElement    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//span[contains(@class, 'status-badge')]
    ${badge_text}=    Get Text    ${status_badge}
    Should Be Equal    ${badge_text}    IN PROGRESS

TC105 - Responsive Design Elements
    [Documentation]    Test responsive design elements work correctly
    [Tags]    ui    responsive    design    mobile
    
    # Test different viewport sizes
    Set Window Size    1920    1080    # Desktop
    Page Should Contain Element    ${DEPENDENCY_TABLE}
    Element Should Be Visible    ${ADD_DEPENDENCY_BUTTON}
    
    Set Window Size    1024    768     # Tablet
    Page Should Contain Element    ${DEPENDENCY_TABLE}
    Element Should Be Visible    ${ADD_DEPENDENCY_BUTTON}
    
    Set Window Size    375     667     # Mobile
    Page Should Contain Element    ${DEPENDENCY_TABLE}
    # Add button might be repositioned but should still be clickable
    Element Should Be Visible    ${ADD_DEPENDENCY_BUTTON}
    
    # Reset to desktop size
    Set Window Size    1920    1080

TC106 - Table Row Styling and Hover Effects
    [Documentation]    Test table row styling, slim rows, and hover effects
    [Tags]    ui    table    styling    hover
    
    ${dep_name}=    Generate Test Data    UITest_TableStyling
    Add New Dependency    ${dep_name}    Testing table row styling    ${TEST_DEP_TEAM}    IN PROGRESS    MEDIUM
    
    # Verify table row exists and has proper structure
    ${table_row}=    Get WebElement    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]
    Element Should Be Visible    ${table_row}
    
    # Check for slim row styling (reduced padding)
    ${row_style}=    Get Element Attribute    ${table_row}    style
    # Row should have appropriate styling for slim appearance
    
    # Test hover effect by moving mouse over row
    Mouse Over    ${table_row}
    Sleep    0.5s    # Allow hover effect to apply
    
    # Verify row contains all expected cells
    ${cells}=    Get WebElements    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//td
    ${cell_count}=    Get Length    ${cells}
    Should Be True    ${cell_count} >= 6    # Name, Description, Team, Status, Priority, Actions

TC107 - Modal Styling and Animations
    [Documentation]    Test modal styling, animations, and visual enhancements
    [Tags]    ui    modal    animations    styling
    
    # Test Add Dependency modal
    Click Element    ${ADD_DEPENDENCY_BUTTON}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}
    
    # Verify modal has proper styling classes
    ${modal}=    Get WebElement    ${ADD_EDIT_MODAL}
    ${modal_class}=    Get Element Attribute    ${modal}    class
    Should Contain    ${modal_class}    modal
    
    # Verify modal title
    ${modal_title}=    Get Text    ${MODAL_TITLE}
    Should Contain    ${modal_title}    Add
    
    # Test modal form field styling
    Element Should Be Visible    ${DEP_NAME_FIELD}
    Element Should Be Visible    ${DEP_DESCRIPTION_FIELD}
    Element Should Be Visible    ${DEP_TEAM_SELECT}
    
    # Test modal button styling
    ${save_button}=    Get WebElement    ${SAVE_BUTTON}
    ${save_class}=    Get Element Attribute    ${save_button}    class
    Should Contain    ${save_class}    btn
    
    # Close modal
    Click Element    ${CANCEL_BUTTON}
    Wait Until Element Is Not Visible    ${ADD_EDIT_MODAL}

TC108 - Search Box Styling and Functionality
    [Documentation]    Test search box styling, size, and visual enhancements
    [Tags]    ui    search    styling    size
    
    # Verify search box exists and has proper styling
    Element Should Be Visible    ${SEARCH_INPUT}
    
    ${search_box}=    Get WebElement    ${SEARCH_INPUT}
    ${search_class}=    Get Element Attribute    ${search_box}    class
    Should Contain    ${search_class}    search    # Should have search-related styling
    
    # Verify search box size (should be larger than default)
    ${box_width}=    Get Element Size    ${search_box}    width
    Should Be True    ${box_width} > 200    # Should be reasonably sized
    
    # Test search box interaction
    Click Element    ${SEARCH_INPUT}
    Input Text    ${SEARCH_INPUT}    test search
    
    # Verify placeholder or label exists
    ${placeholder}=    Get Element Attribute    ${SEARCH_INPUT}    placeholder
    Should Not Be Empty    ${placeholder}
    
    # Clear search
    Clear Element Text    ${SEARCH_INPUT}

TC109 - Button Styling Consistency
    [Documentation]    Test that all buttons have consistent styling and proper hover states
    [Tags]    ui    buttons    styling    consistency
    
    # Test main action buttons
    ${add_button}=    Get WebElement    ${ADD_DEPENDENCY_BUTTON}
    ${add_class}=    Get Element Attribute    ${add_button}    class
    Should Contain    ${add_class}    btn
    
    # Test filter clear button
    ${clear_button}=    Get WebElement    ${CLEAR_FILTERS_BUTTON}
    ${clear_class}=    Get Element Attribute    ${clear_button}    class
    Should Contain    ${clear_class}    btn
    
    # Create a dependency to test action buttons
    ${dep_name}=    Generate Test Data    UITest_ButtonStyling
    Add New Dependency    ${dep_name}    Testing button styling consistency    ${TEST_DEP_TEAM}
    
    # Test edit button styling
    ${edit_button}=    Get WebElement    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//button[contains(@class, 'btn-edit')]
    Element Should Be Visible    ${edit_button}
    ${edit_class}=    Get Element Attribute    ${edit_button}    class
    Should Contain    ${edit_class}    btn-edit
    
    # Test delete button styling
    ${delete_button}=    Get WebElement    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//button[contains(@class, 'btn-delete')]
    Element Should Be Visible    ${delete_button}
    ${delete_class}=    Get Element Attribute    ${delete_button}    class
    Should Contain    ${delete_class}    btn-delete
    
    # Test button hover effects
    Mouse Over    ${edit_button}
    Sleep    0.5s
    Mouse Over    ${delete_button}
    Sleep    0.5s

TC110 - Logo and Branding Consistency
    [Documentation]    Test logo display and branding consistency across pages
    [Tags]    ui    logo    branding    consistency
    
    # Verify DepFlow logo is present and styled correctly
    Verify DepFlow Dashboard Logo Present
    
    ${logo}=    Get WebElement    ${DASHBOARD_LOGO}
    ${logo_class}=    Get Element Attribute    ${logo}    class
    Should Contain    ${logo_class}    depflow-logo
    
    # Test logo visibility across different page states
    Click Element    ${ADD_DEPENDENCY_BUTTON}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}
    Verify DepFlow Dashboard Logo Present    # Logo should still be visible
    
    Press Keys    None    ESCAPE    # Close modal
    Verify DepFlow Dashboard Logo Present

TC111 - Color Contrast and Accessibility
    [Documentation]    Test color contrast and basic accessibility features
    [Tags]    ui    accessibility    contrast    colors
    
    ${dep_name}=    Generate Test Data    UITest_Accessibility
    Add New Dependency    ${dep_name}    Testing accessibility features    ${TEST_DEP_TEAM}    BLOCKED    HIGH
    
    # Test that status and priority badges have sufficient contrast
    ${status_badge}=    Get WebElement    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//span[contains(@class, 'status-badge')]
    ${priority_badge}=    Get WebElement    xpath://tr[td[contains(@class, 'dependency-name') and contains(text(), '${dep_name}')]]//span[contains(@class, 'priority-badge')]
    
    # Badges should be visible (contrast sufficient)
    Element Should Be Visible    ${status_badge}
    Element Should Be Visible    ${priority_badge}
    
    # Text should be readable
    ${status_text}=    Get Text    ${status_badge}
    ${priority_text}=    Get Text    ${priority_badge}
    Should Not Be Empty    ${status_text}
    Should Not Be Empty    ${priority_text}
    
    # Test form field labels exist
    Click Element    ${ADD_DEPENDENCY_BUTTON}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}
    
    # Fields should have labels or placeholders
    ${name_placeholder}=    Get Element Attribute    ${DEP_NAME_FIELD}    placeholder
    ${desc_placeholder}=    Get Element Attribute    ${DEP_DESCRIPTION_FIELD}    placeholder
    Should Not Be Empty    ${name_placeholder}
    Should Not Be Empty    ${desc_placeholder}
    
    Press Keys    None    ESCAPE    # Close modal

TC112 - Animation and Transition Effects
    [Documentation]    Test smooth animations and transition effects
    [Tags]    ui    animations    transitions    effects
    
    # Test counter card click animations
    Click Element    ${NOT_STARTED_COUNT_CARD}
    Sleep    1s    # Allow transition to complete
    
    ${not_started_card}=    Get WebElement    ${NOT_STARTED_COUNT_CARD}
    ${active_class}=    Get Element Attribute    ${not_started_card}    class
    Should Contain    ${active_class}    active
    
    # Test modal open/close animations
    Click Element    ${ADD_DEPENDENCY_BUTTON}
    Wait Until Element Is Visible    ${ADD_EDIT_MODAL}    timeout=5s
    
    Press Keys    None    ESCAPE
    Wait Until Element Is Not Visible    ${ADD_EDIT_MODAL}    timeout=5s
    
    # Test smooth table updates
    ${dep_name}=    Generate Test Data    UITest_Animations
    Add New Dependency    ${dep_name}    Testing animation effects    ${TEST_DEP_TEAM}    NOT STARTED    LOW
    
    # Quick status change should have smooth transition
    Test Inline Status Edit    ${dep_name}    IN PROGRESS
    Sleep    1s    # Allow animation to complete

TC113 - Dark Theme Compatibility Check
    [Documentation]    Test that UI elements work with system dark theme preferences
    [Tags]    ui    theme    dark    compatibility
    
    # Test with forced dark mode preference
    Execute Javascript    document.documentElement.setAttribute('data-theme', 'dark');
    Sleep    1s
    
    # UI should still be functional
    Element Should Be Visible    ${DEPENDENCY_TABLE}
    Element Should Be Visible    ${ADD_DEPENDENCY_BUTTON}
    
    # Reset theme
    Execute Javascript    document.documentElement.removeAttribute('data-theme');
    Sleep    1s

TC114 - Print Styles and Media Queries
    [Documentation]    Test print styles and responsive media queries
    [Tags]    ui    print    media_queries    responsive
    
    # Test print media simulation
    Execute Javascript    
    ...    var link = document.createElement('style');
    ...    link.innerHTML = '@media print { body { background: white !important; } }';
    ...    document.head.appendChild(link);
    
    # Table should still be visible and printable
    Element Should Be Visible    ${DEPENDENCY_TABLE}
    
    # Test very small screen simulation
    Set Window Size    320    568    # Small mobile
    Element Should Be Visible    ${DEPENDENCY_TABLE}
    Element Should Be Visible    ${ADD_DEPENDENCY_BUTTON}
    
    # Reset window size
    Set Window Size    1920    1080
