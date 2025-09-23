# DepFlow Test Framework Setup and Execution Script (PowerShell)
# This script automates the setup and execution of Robot Framework tests on Windows

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [string]$TestType = "smoke",
    
    [switch]$Visible,
    [switch]$NoReport,
    [string]$Browser = "Chrome"
)

# Function to write colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if DepFlow app is running
function Test-AppRunning {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -UseBasicParsing
        return $true
    }
    catch {
        return $false
    }
}

# Function to wait for application to be ready
function Wait-ForApp {
    Write-Status "Waiting for DepFlow application to be ready..."
    
    for ($i = 1; $i -le 30; $i++) {
        if (Test-AppRunning) {
            Write-Success "DepFlow application is running and ready!"
            return $true
        }
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
    }
    
    Write-Host ""
    Write-Error "Timeout waiting for DepFlow application"
    return $false
}

# Function to setup test environment
function Setup-TestEnvironment {
    Write-Status "Setting up DepFlow Test Environment..."
    
    # Check prerequisites
    Write-Status "Checking prerequisites..."
    
    if (-not (Test-Command "python") -and -not (Test-Command "python3")) {
        Write-Error "Python 3.8+ is required but not installed"
        Write-Host "Please install Python from: https://www.python.org/downloads/"
        exit 1
    }
    
    # Determine Python command
    if (Test-Command "python3") {
        $script:PythonCmd = "python3"
        $script:PipCmd = "pip3"
    } else {
        $script:PythonCmd = "python"
        $script:PipCmd = "pip"
    }
    
    $pythonVersion = & $script:PythonCmd --version 2>&1
    Write-Success "Python found: $pythonVersion"
    
    # Create virtual environment if it doesn't exist
    if (-not (Test-Path "venv")) {
        Write-Status "Creating Python virtual environment..."
        & $script:PythonCmd -m venv venv
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create virtual environment"
            exit 1
        }
        Write-Success "Virtual environment created"
    }
    
    # Activate virtual environment
    Write-Status "Activating virtual environment..."
    & "venv\Scripts\Activate.ps1"
    
    # Upgrade pip
    Write-Status "Upgrading pip..."
    python -m pip install --upgrade pip --quiet
    
    # Install dependencies
    Write-Status "Installing Robot Framework and dependencies..."
    pip install -r requirements.txt --quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install dependencies"
        exit 1
    }
    Write-Success "Dependencies installed successfully"
    
    # Verify Robot Framework installation
    Write-Status "Verifying Robot Framework installation..."
    robot --version
    Write-Success "Robot Framework is ready"
}

# Function to start DepFlow application
function Start-DepFlowApp {
    Write-Status "Checking if DepFlow application is running..."
    
    if (Test-AppRunning) {
        Write-Success "DepFlow application is already running"
        return
    }
    
    Write-Status "Starting DepFlow application..."
    Write-Warning "Please start the DepFlow application manually:"
    Write-Host ""
    Write-Host "  1. Open a new PowerShell window"
    Write-Host "  2. Navigate to: cd '..\frontend'"
    Write-Host "  3. Run: node serve_complete.js"
    Write-Host ""
    Write-Host "Press Enter when the application is running..."
    Read-Host
    
    if (-not (Wait-ForApp)) {
        Write-Error "Failed to detect running DepFlow application"
        exit 1
    }
}

# Function to run tests
function Invoke-Tests {
    param(
        [string]$TestType,
        [switch]$Visible,
        [switch]$NoReport,
        [string]$Browser
    )
    
    Write-Status "Running DepFlow tests..."
    
    # Build arguments
    $args = @()
    
    # Add browser argument
    if ($Browser) {
        $args += "--browser", $Browser
    }
    
    # Add headless/visible argument
    if (-not $Visible) {
        $args += "--headless"
    }
    
    # Add no-report argument
    if ($NoReport) {
        $args += "--no-report"
    }
    
    switch ($TestType) {
        "smoke" {
            Write-Status "Running smoke tests (critical functionality)..."
            $args = @("--tags", "smoke") + $args
        }
        "ui" {
            Write-Status "Running UI tests (all user interface tests)..."
            $args = @("--no-api") + $args
        }
        "api" {
            Write-Status "Running API tests (backend endpoints)..."
            $args = @("--suite", "04_api_tests") + $args
        }
        "auth" {
            Write-Status "Running authentication tests..."
            $args = @("--suite", "01_authentication_tests") + $args
        }
        "crud" {
            Write-Status "Running CRUD operation tests..."
            $args = @("--suite", "02_dependency_crud_tests") + $args
        }
        "filter" {
            Write-Status "Running search and filter tests..."
            $args = @("--suite", "03_filtering_search_tests") + $args
        }
        "all" {
            Write-Status "Running complete test suite..."
            $args = @("--parallel") + $args
        }
        default {
            Write-Status "Running default test suite..."
            $args = @("--tags", "smoke") + $args
        }
    }
    
    # Execute tests
    & python run_tests.py @args
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Tests completed successfully!"
    } else {
        Write-Warning "Some tests may have failed. Check the HTML report for details."
    }
}

# Function to cleanup old results
function Invoke-Cleanup {
    Write-Status "Cleaning up test environment..."
    
    try {
        python run_tests.py --cleanup 7 2>$null
    }
    catch {
        # Ignore cleanup errors
    }
    
    Write-Success "Cleanup completed"
}

# Function to show usage
function Show-Usage {
    Write-Host ""
    Write-Host "DepFlow Test Framework Setup and Execution Script (PowerShell)"
    Write-Host ""
    Write-Host "Usage: .\setup_and_run.ps1 [COMMAND] [TYPE] [OPTIONS]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  setup          Set up test environment and dependencies"
    Write-Host "  run [TYPE]     Run tests (default: smoke tests)"
    Write-Host "  cleanup        Clean up old test results"
    Write-Host "  help          Show this help message"
    Write-Host ""
    Write-Host "Test Types:"
    Write-Host "  smoke         Critical functionality tests (fastest)"
    Write-Host "  ui            All user interface tests"
    Write-Host "  api           Backend API tests only"
    Write-Host "  auth          Authentication and login tests"
    Write-Host "  crud          Create/Read/Update/Delete tests"
    Write-Host "  filter        Search and filtering tests"
    Write-Host "  all           Complete test suite (takes 15-30 minutes)"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Visible      Run tests with visible browser (not headless)"
    Write-Host "  -NoReport     Don't open HTML report after tests"
    Write-Host "  -Browser      Specify browser (Chrome, Firefox, Edge)"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\setup_and_run.ps1 setup                    # Set up test environment"
    Write-Host "  .\setup_and_run.ps1 run                      # Run smoke tests (default)"
    Write-Host "  .\setup_and_run.ps1 run smoke                # Run smoke tests explicitly"
    Write-Host "  .\setup_and_run.ps1 run all                  # Run complete test suite"
    Write-Host "  .\setup_and_run.ps1 run ui -Visible          # Run UI tests with visible browser"
    Write-Host "  .\setup_and_run.ps1 run api -NoReport        # Run API tests without opening report"
    Write-Host "  .\setup_and_run.ps1 cleanup                  # Clean up old test results"
    Write-Host ""
}

# Main script logic
function Main {
    # Change to tests directory
    Set-Location $PSScriptRoot
    
    switch ($Command.ToLower()) {
        "setup" {
            Setup-TestEnvironment
            Write-Success "Test environment setup completed!"
            Write-Host ""
            Write-Host "Next steps:"
            Write-Host "  1. Start DepFlow app: cd ..\frontend; node serve_complete.js"
            Write-Host "  2. Run tests: .\setup_and_run.ps1 run smoke"
        }
        "run" {
            Setup-TestEnvironment
            Start-DepFlowApp
            Invoke-Tests -TestType $TestType -Visible:$Visible -NoReport:$NoReport -Browser $Browser
        }
        "cleanup" {
            Invoke-Cleanup
        }
        "help" {
            Show-Usage
        }
        default {
            Write-Error "Unknown command: $Command"
            Show-Usage
            exit 1
        }
    }
}

# Execute main function
try {
    Main
}
catch {
    Write-Error "An error occurred: $_"
    exit 1
}

