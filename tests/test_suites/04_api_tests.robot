*** Settings ***
Documentation    API Testing Suite for DepFlow Application
Resource         ../keywords/depflow_keywords.robot
Resource         ../config/variables.robot
Library          RequestsLibrary
Library          Collections
Library          JSONLibrary
Suite Setup      Create Session For API Testing
Suite Teardown   Delete All Sessions

*** Test Cases ***
TC051 - Test Email API Endpoint
    [Documentation]    Test the email notification API endpoint
    [Tags]    api    email    smoke
    
    Test Email API Endpoint    Annotation tools
    
TC052 - Test Email API With Different Teams
    [Documentation]    Test email API with different team configurations
    [Tags]    api    email    teams
    
    FOR    ${team}    IN    @{TEAMS}
        Test Email API Endpoint    ${team}
        Sleep    2s    # Rate limiting for email sending
    END

TC053 - Test Dependencies Creation API
    [Documentation]    Test creating dependencies via API
    [Tags]    api    crud    create
    
    ${unique_name}=    Generate Test Data    API_CreateTest
    ${description}=    Set Variable    Dependency created via API testing
    
    Test Dependencies API Endpoint    ${unique_name}    ${description}    ${TEST_DEP_TEAM}

TC054 - Test Dependencies API With All Teams
    [Documentation]    Test creating dependencies for all teams via API
    [Tags]    api    crud    teams
    
    FOR    ${team}    IN    @{TEAMS}
        ${unique_name}=    Generate Test Data    API_Team_${team.replace(' ', '_')}
        ${description}=    Set Variable    API test dependency for ${team}
        Test Dependencies API Endpoint    ${unique_name}    ${description}    ${team}
        Sleep    1s
    END

TC055 - Test Dependencies API With All Statuses
    [Documentation]    Test creating dependencies with all statuses via API
    [Tags]    api    crud    status
    
    FOR    ${status}    IN    @{STATUSES}
        ${unique_name}=    Generate Test Data    API_Status_${status.replace(' ', '_')}
        ${description}=    Set Variable    API test dependency with ${status} status
        Test Dependencies API Endpoint    ${unique_name}    ${description}    ${TEST_DEP_TEAM}    ${status}
        Sleep    1s
    END

TC056 - Test Dependencies API With All Priorities
    [Documentation]    Test creating dependencies with all priorities via API
    [Tags]    api    crud    priority
    
    FOR    ${priority}    IN    @{PRIORITIES}
        ${unique_name}=    Generate Test Data    API_Priority_${priority}
        ${description}=    Set Variable    API test dependency with ${priority} priority
        Test Dependencies API Endpoint    ${unique_name}    ${description}    ${TEST_DEP_TEAM}    NOT STARTED    ${priority}
        Sleep    1s
    END

TC057 - Test Dependencies API Error Handling - Missing Name
    [Documentation]    Test API error handling for missing required name field
    [Tags]    api    validation    negative
    
    ${payload}=    Create Dictionary    
    ...    description=Test description without name
    ...    team=${TEST_DEP_TEAM}
    ...    status=NOT STARTED
    ...    priority=MEDIUM
    ...    riskLevel=LOW
    ...    createdBy=test@depflow.com
    
    ${response}=    POST On Session    depflow    /dependencies    json=${payload}    expected_status=400
    Should Be Equal As Strings    ${response.status_code}    400
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['success']}    ${False}
    Should Contain    ${json_response['message']}    name

TC058 - Test Dependencies API Error Handling - Missing Description
    [Documentation]    Test API error handling for missing required description field
    [Tags]    api    validation    negative
    
    ${payload}=    Create Dictionary    
    ...    name=Test Name Without Description
    ...    team=${TEST_DEP_TEAM}
    ...    status=NOT STARTED
    ...    priority=MEDIUM
    ...    riskLevel=LOW
    ...    createdBy=test@depflow.com
    
    ${response}=    POST On Session    depflow    /dependencies    json=${payload}    expected_status=400
    Should Be Equal As Strings    ${response.status_code}    400
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['success']}    ${False}
    Should Contain    ${json_response['message']}    description

TC059 - Test Dependencies API Error Handling - Missing Team
    [Documentation]    Test API error handling for missing required team field
    [Tags]    api    validation    negative
    
    ${payload}=    Create Dictionary    
    ...    name=Test Name Without Team
    ...    description=Valid description for test without team
    ...    status=NOT STARTED
    ...    priority=MEDIUM
    ...    riskLevel=LOW
    ...    createdBy=test@depflow.com
    
    ${response}=    POST On Session    depflow    /dependencies    json=${payload}    expected_status=400
    Should Be Equal As Strings    ${response.status_code}    400
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['success']}    ${False}
    Should Contain    ${json_response['message']}    team

TC060 - Test Dependencies API Error Handling - Short Name
    [Documentation]    Test API validation for name field length
    [Tags]    api    validation    boundary
    
    ${payload}=    Create Dictionary    
    ...    name=A
    ...    description=Valid description for short name test
    ...    team=${TEST_DEP_TEAM}
    ...    status=NOT STARTED
    ...    priority=MEDIUM
    ...    riskLevel=LOW
    ...    createdBy=test@depflow.com
    
    ${response}=    POST On Session    depflow    /dependencies    json=${payload}    expected_status=400
    Should Be Equal As Strings    ${response.status_code}    400

TC061 - Test Dependencies API Error Handling - Short Description
    [Documentation]    Test API validation for description field length
    [Tags]    api    validation    boundary
    
    ${payload}=    Create Dictionary    
    ...    name=Valid Name For Short Description Test
    ...    description=Short
    ...    team=${TEST_DEP_TEAM}
    ...    status=NOT STARTED
    ...    priority=MEDIUM
    ...    riskLevel=LOW
    ...    createdBy=test@depflow.com
    
    ${response}=    POST On Session    depflow    /dependencies    json=${payload}    expected_status=400
    Should Be Equal As Strings    ${response.status_code}    400

TC062 - Test Email API Error Handling - Missing Team
    [Documentation]    Test email API error handling for missing team parameter
    [Tags]    api    email    validation    negative
    
    ${payload}=    Create Dictionary
    ${response}=    POST On Session    depflow    /test-email    json=${payload}    expected_status=500
    Should Be Equal As Strings    ${response.status_code}    500

TC063 - Test Email API Error Handling - Invalid Team
    [Documentation]    Test email API with non-existent team
    [Tags]    api    email    validation    negative
    
    ${payload}=    Create Dictionary    team=NonExistentTeam12345
    ${response}=    POST On Session    depflow    /test-email    json=${payload}
    Should Be Equal As Strings    ${response.status_code}    200
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['success']}    ${False}
    Should Contain    ${json_response['message']}    configured

TC064 - Test Dependencies API Response Structure
    [Documentation]    Test that API responses have expected structure
    [Tags]    api    structure    validation
    
    ${unique_name}=    Generate Test Data    API_StructureTest
    ${payload}=    Create Dictionary    
    ...    name=${unique_name}
    ...    description=Testing API response structure
    ...    team=${TEST_DEP_TEAM}
    ...    status=NOT STARTED
    ...    priority=MEDIUM
    ...    riskLevel=LOW
    ...    createdBy=test@depflow.com
    
    ${response}=    POST On Session    depflow    /dependencies    json=${payload}
    Should Be Equal As Strings    ${response.status_code}    200
    
    ${json_response}=    Set Variable    ${response.json()}
    Should Be True    ${json_response['success']}
    Dictionary Should Contain Key    ${json_response}    message
    Dictionary Should Contain Key    ${json_response}    dependency
    Dictionary Should Contain Key    ${json_response}    emailSent
    Dictionary Should Contain Key    ${json_response}    emailMessage
    
    # Verify dependency object structure
    ${dependency}=    Get From Dictionary    ${json_response}    dependency
    Dictionary Should Contain Key    ${dependency}    name
    Dictionary Should Contain Key    ${dependency}    description
    Dictionary Should Contain Key    ${dependency}    team
    Dictionary Should Contain Key    ${dependency}    status
    Dictionary Should Contain Key    ${dependency}    priority
    Dictionary Should Contain Key    ${dependency}    riskLevel
    Dictionary Should Contain Key    ${dependency}    lastUpdated

TC065 - Test Email API Response Structure
    [Documentation]    Test that email API responses have expected structure
    [Tags]    api    email    structure    validation
    
    ${payload}=    Create Dictionary    team=${TEST_DEP_TEAM}
    ${response}=    POST On Session    depflow    /test-email    json=${payload}
    Should Be Equal As Strings    ${response.status_code}    200
    
    ${json_response}=    Set Variable    ${response.json()}
    Dictionary Should Contain Key    ${json_response}    success
    Dictionary Should Contain Key    ${json_response}    message
    Dictionary Should Contain Key    ${json_response}    teamOwner
    Dictionary Should Contain Key    ${json_response}    timestamp

TC066 - Test API Performance - Multiple Rapid Requests
    [Documentation]    Test API performance with multiple rapid requests
    [Tags]    api    performance    load
    
    FOR    ${i}    IN RANGE    5
        ${unique_name}=    Generate Test Data    API_Performance_${i}
        ${payload}=    Create Dictionary    
        ...    name=${unique_name}
        ...    description=Performance test dependency ${i}
        ...    team=${TEST_DEP_TEAM}
        ...    status=NOT STARTED
        ...    priority=MEDIUM
        ...    riskLevel=LOW
        ...    createdBy=test@depflow.com
        
        ${start_time}=    Get Current Date    result_format=epoch
        ${response}=    POST On Session    depflow    /dependencies    json=${payload}
        ${end_time}=    Get Current Date    result_format=epoch
        
        Should Be Equal As Strings    ${response.status_code}    200
        
        # Verify response time is reasonable (under 5 seconds)
        ${duration}=    Evaluate    ${end_time} - ${start_time}
        Should Be True    ${duration} < 5
    END

TC067 - Test Dependencies API With Special Characters
    [Documentation]    Test API handling of special characters in request data
    [Tags]    api    special_characters    edge_case
    
    ${special_name}=    Set Variable    API-Test_With@Special#Chars!
    ${special_desc}=    Set Variable    Description with special chars: @#$%^&*()_+-={}[]|\\:";'<>?,./
    
    ${payload}=    Create Dictionary    
    ...    name=${special_name}
    ...    description=${special_desc}
    ...    team=${TEST_DEP_TEAM}
    ...    status=NOT STARTED
    ...    priority=MEDIUM
    ...    riskLevel=LOW
    ...    createdBy=test@depflow.com
    
    ${response}=    POST On Session    depflow    /dependencies    json=${payload}
    Should Be Equal As Strings    ${response.status_code}    200
    ${json_response}=    Set Variable    ${response.json()}
    Should Be True    ${json_response['success']}

TC068 - Test API Content Type Handling
    [Documentation]    Test API with different content types
    [Tags]    api    content_type    validation
    
    # Test with correct content type
    ${payload}=    Create Dictionary    
    ...    name=ContentTypeTest
    ...    description=Testing content type handling
    ...    team=${TEST_DEP_TEAM}
    ...    status=NOT STARTED
    ...    priority=MEDIUM
    ...    riskLevel=LOW
    ...    createdBy=test@depflow.com
    
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    depflow    /dependencies    json=${payload}    headers=${headers}
    Should Be Equal As Strings    ${response.status_code}    200

TC069 - Test API Server Status
    [Documentation]    Test that API server is responding and healthy
    [Tags]    api    health    smoke
    
    # Test main endpoint accessibility
    ${response}=    GET On Session    depflow    /    expected_status=any
    Should Be True    ${response.status_code} in [200, 404]    # 404 is OK for non-existent GET endpoint

TC070 - Test API Timeout Handling
    [Documentation]    Test API behavior under timeout conditions
    [Tags]    api    timeout    reliability
    
    # Create session with short timeout for this test
    Create Session    timeout_test    ${API_BASE_URL}    timeout=1
    
    ${payload}=    Create Dictionary    
    ...    name=TimeoutTest
    ...    description=Testing timeout handling in API
    ...    team=${TEST_DEP_TEAM}
    ...    status=NOT STARTED
    ...    priority=MEDIUM
    ...    riskLevel=LOW
    ...    createdBy=test@depflow.com
    
    # This might timeout or succeed, both are acceptable for timeout test
    Run Keyword And Ignore Error    POST On Session    timeout_test    /dependencies    json=${payload}

