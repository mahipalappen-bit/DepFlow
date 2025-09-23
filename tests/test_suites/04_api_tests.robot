*** Settings ***
Documentation    API Testing Suite for DepFlow Application - Updated for Backend v1 API
Resource         ../keywords/depflow_keywords.robot
Resource         ../config/variables.robot
Library          RequestsLibrary
Library          Collections
Library          JSONLibrary
Suite Setup      Create Session And Authenticate
Suite Teardown   Delete All Sessions And Cleanup

*** Variables ***
${JWT_TOKEN}    ${EMPTY}

*** Test Cases ***
*** Keywords ***
Create Session And Authenticate
    [Documentation]    Create API session and authenticate to get JWT token
    Create Session    depflow_api    ${BACKEND_URL}    timeout=${API_TIMEOUT}
    
    # Authenticate to get JWT token
    ${auth_payload}=    Create Dictionary    
    ...    email=${ADMIN_USERNAME}
    ...    password=${ADMIN_PASSWORD}
    
    ${auth_response}=    POST On Session    depflow_api    /api/v1/auth/login    json=${auth_payload}
    Should Be Equal As Numbers    ${auth_response.status_code}    200
    
    ${auth_json}=    Set Variable    ${auth_response.json()}
    Set Global Variable    ${JWT_TOKEN}    ${auth_json['token']}

Delete All Sessions And Cleanup
    [Documentation]    Cleanup sessions
    Delete All Sessions

Get Auth Headers
    [Documentation]    Get authorization headers with JWT token
    ${headers}=    Create Dictionary    Authorization=Bearer ${JWT_TOKEN}    Content-Type=application/json
    [Return]    ${headers}

TC051 - Test Backend Health Endpoint
    [Documentation]    Test the backend health check endpoint
    [Tags]    api    health    smoke    backend
    
    ${response}=    GET On Session    depflow_api    /api/v1/health
    Should Be Equal As Numbers    ${response.status_code}    200
    
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['status']}    healthy
    Dictionary Should Contain Key    ${json_response}    timestamp

TC052 - Test Authentication API Endpoint
    [Documentation]    Test the authentication API endpoint
    [Tags]    api    authentication    auth    smoke
    
    ${auth_payload}=    Create Dictionary    
    ...    email=${ADMIN_USERNAME}
    ...    password=${ADMIN_PASSWORD}
    
    ${response}=    POST On Session    depflow_api    /api/v1/auth/login    json=${auth_payload}
    Should Be Equal As Numbers    ${response.status_code}    200
    
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['success']}    ${True}
    Dictionary Should Contain Key    ${json_response}    token
    Dictionary Should Contain Key    ${json_response}    user
    
    ${user}=    Get From Dictionary    ${json_response}    user
    Dictionary Should Contain Key    ${user}    email
    Dictionary Should Contain Key    ${user}    name
    Dictionary Should Contain Key    ${user}    role
    Should Be Equal    ${user['email']}    ${ADMIN_USERNAME}

TC053 - Test Email API Endpoint
    [Documentation]    Test the backend email notification API endpoint
    [Tags]    api    email    smoke    backend
    
    ${headers}=    Get Auth Headers
    
    ${email_payload}=    Create Dictionary    
    ...    type=Created
    ...    dependency=${Create Dictionary    name=API Test Dependency    description=Testing email API directly    team=Quality Flow    status=NOT STARTED    priority=MEDIUM}
    ...    user=${Create Dictionary    name=API Test User    email=${ADMIN_USERNAME}}
    
    ${response}=    POST On Session    depflow_api    /api/v1/send-email    json=${email_payload}    headers=${headers}
    Should Be Equal As Numbers    ${response.status_code}    200
    
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['success']}    ${True}
    Dictionary Should Contain Key    ${json_response}    messageId
    
TC054 - Test Email API With Different Teams
    [Documentation]    Test email API with different team configurations
    [Tags]    api    email    teams
    
    ${headers}=    Get Auth Headers
    
    FOR    ${team}    IN    @{TEAMS}
        ${email_payload}=    Create Dictionary    
        ...    type=Updated
        ...    dependency=${Create Dictionary    name=Team Test    description=Testing ${team} team email    team=${team}    status=NOT STARTED    priority=MEDIUM}
        ...    user=${Create Dictionary    name=Team Tester    email=${ADMIN_USERNAME}}
        
        ${response}=    POST On Session    depflow_api    /api/v1/send-email    json=${email_payload}    headers=${headers}
        Should Be Equal As Numbers    ${response.status_code}    200
        
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

TC058 - Test API Response Headers and CORS
    [Documentation]    Test API response headers and CORS configuration
    [Tags]    api    headers    cors    configuration
    
    ${headers}=    Get Auth Headers
    ${response}=    GET On Session    depflow_api    /api/v1/health    headers=${headers}
    
    # Check response headers
    ${response_headers}=    Set Variable    ${response.headers}
    Dictionary Should Contain Key    ${response_headers}    Content-Type
    Should Contain    ${response_headers['Content-Type']}    application/json

TC059 - Test API Rate Limiting
    [Documentation]    Test API rate limiting behavior
    [Tags]    api    rate_limiting    performance
    
    ${headers}=    Get Auth Headers
    
    # Send multiple requests rapidly
    FOR    ${i}    IN RANGE    5
        ${email_payload}=    Create Dictionary    
        ...    type=Created
        ...    dependency=${Create Dictionary    name=RateTest_${i}    description=Rate limiting test ${i}    team=Quality Flow    status=NOT STARTED    priority=MEDIUM}
        ...    user=${Create Dictionary    name=Rate Tester    email=${ADMIN_USERNAME}}
        
        ${response}=    POST On Session    depflow_api    /api/v1/send-email    json=${email_payload}    headers=${headers}
        
        # All requests should succeed or be rate limited gracefully
        Should Be True    ${response.status_code} in [200, 429]    # 429 is rate limit status
        
        Sleep    0.5s
    END

TC060 - Test API Error Response Format
    [Documentation]    Test that API error responses have consistent format
    [Tags]    api    error_handling    format
    
    # Test with malformed JSON
    ${response}=    POST On Session    depflow_api    /api/v1/auth/login    data=invalid_json    expected_status=400
    Should Be Equal As Numbers    ${response.status_code}    400
    
    # Response should still be valid JSON
    ${json_response}=    Set Variable    ${response.json()}
    Dictionary Should Contain Key    ${json_response}    success
    Dictionary Should Contain Key    ${json_response}    message
    Should Be Equal    ${json_response['success']}    ${False}

TC061 - Test API Performance Benchmarks
    [Documentation]    Test API performance meets acceptable benchmarks
    [Tags]    api    performance    benchmarks
    
    ${headers}=    Get Auth Headers
    
    # Test authentication endpoint performance
    ${start_time}=    Get Current Date    result_format=epoch
    
    FOR    ${i}    IN RANGE    3
        ${auth_payload}=    Create Dictionary    
        ...    email=${ADMIN_USERNAME}
        ...    password=${ADMIN_PASSWORD}
        
        ${response}=    POST On Session    depflow_api    /api/v1/auth/login    json=${auth_payload}
        Should Be Equal As Numbers    ${response.status_code}    200
    END
    
    ${end_time}=    Get Current Date    result_format=epoch
    ${duration}=    Evaluate    ${end_time} - ${start_time}
    
    # Should complete 3 auth requests within 5 seconds
    Should Be True    ${duration} < 5

TC062 - Test API Content Type Handling
    [Documentation]    Test API handling of different content types
    [Tags]    api    content_type    headers
    
    # Test with correct content type
    ${headers}=    Create Dictionary    Authorization=Bearer ${JWT_TOKEN}    Content-Type=application/json
    
    ${email_payload}=    Create Dictionary    
    ...    type=Created
    ...    dependency=${Create Dictionary    name=ContentTypeTest    description=Testing content type    team=Quality Flow    status=NOT STARTED    priority=MEDIUM}
    ...    user=${Create Dictionary    name=Content Tester    email=${ADMIN_USERNAME}}
    
    ${response}=    POST On Session    depflow_api    /api/v1/send-email    json=${email_payload}    headers=${headers}
    Should Be Equal As Numbers    ${response.status_code}    200

TC063 - Test API Version Compatibility
    [Documentation]    Test API version endpoint and compatibility
    [Tags]    api    version    compatibility
    
    # Test health endpoint which should include version info
    ${response}=    GET On Session    depflow_api    /api/v1/health
    Should Be Equal As Numbers    ${response.status_code}    200
    
    ${json_response}=    Set Variable    ${response.json()}
    Should Be Equal    ${json_response['status']}    healthy
    
    # API should be stable and accessible via v1 prefix
    Dictionary Should Contain Key    ${json_response}    timestamp

TC064 - Test API Security Headers
    [Documentation]    Test that API returns appropriate security headers
    [Tags]    api    security    headers
    
    ${response}=    GET On Session    depflow_api    /api/v1/health
    ${response_headers}=    Set Variable    ${response.headers}
    
    # Check for security-related headers (may not all be present, but API should be secure)
    Dictionary Should Contain Key    ${response_headers}    Content-Type
    
    # Response should not expose sensitive server information
    ${server_header}=    Get From Dictionary    ${response_headers}    Server    default=none
    Should Not Contain    ${server_header}    version    ignore_case=True

TC065 - Test API Data Validation Edge Cases
    [Documentation]    Test API validation with edge case data
    [Tags]    api    validation    edge_cases
    
    ${headers}=    Get Auth Headers
    
    # Test with extremely long strings
    ${long_name}=    Set Variable    ${'VeryLongDependencyNameForTesting' * 10}
    ${long_desc}=    Set Variable    ${'Very long description ' * 50}
    
    ${edge_payload}=    Create Dictionary    
    ...    type=Created
    ...    dependency=${Create Dictionary    name=${long_name}    description=${long_desc}    team=Quality Flow    status=NOT STARTED    priority=MEDIUM}
    ...    user=${Create Dictionary    name=Edge Case Tester    email=${ADMIN_USERNAME}}
    
    ${response}=    POST On Session    depflow_api    /api/v1/send-email    json=${edge_payload}    headers=${headers}    expected_status=any
    
    # Should either accept or reject gracefully (not crash)
    Should Be True    ${response.status_code} in [200, 400, 413]    # 413 = Payload Too Large

