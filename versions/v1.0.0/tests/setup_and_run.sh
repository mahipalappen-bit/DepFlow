#!/bin/bash

# DepFlow Test Framework Setup and Execution Script
# This script automates the setup and execution of Robot Framework tests

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if DepFlow app is running
check_app_running() {
    if curl -s http://localhost:3000 >/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to wait for application to be ready
wait_for_app() {
    print_status "Waiting for DepFlow application to be ready..."
    for i in {1..30}; do
        if check_app_running; then
            print_success "DepFlow application is running and ready!"
            return 0
        fi
        echo -n "."
        sleep 2
    done
    print_error "Timeout waiting for DepFlow application"
    return 1
}

# Main setup function
setup_test_environment() {
    print_status "Setting up DepFlow Test Environment..."
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists python && ! command_exists python3; then
        print_error "Python 3.8+ is required but not installed"
        exit 1
    fi
    
    if ! command_exists pip && ! command_exists pip3; then
        print_error "pip is required but not installed"
        exit 1
    fi
    
    # Determine Python command
    if command_exists python3; then
        PYTHON_CMD="python3"
        PIP_CMD="pip3"
    else
        PYTHON_CMD="python"
        PIP_CMD="pip"
    fi
    
    print_success "Python found: $($PYTHON_CMD --version)"
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        $PYTHON_CMD -m venv venv
        print_success "Virtual environment created"
    fi
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    
    # Upgrade pip
    print_status "Upgrading pip..."
    python -m pip install --upgrade pip --quiet
    
    # Install dependencies
    print_status "Installing Robot Framework and dependencies..."
    pip install -r requirements.txt --quiet
    print_success "Dependencies installed successfully"
    
    # Verify Robot Framework installation
    print_status "Verifying Robot Framework installation..."
    robot --version
    print_success "Robot Framework is ready"
}

# Function to start DepFlow application
start_depflow_app() {
    print_status "Checking if DepFlow application is running..."
    
    if check_app_running; then
        print_success "DepFlow application is already running"
        return 0
    fi
    
    print_status "Starting DepFlow application..."
    print_warning "Please start the DepFlow application manually:"
    echo ""
    echo "  1. Open a new terminal window"
    echo "  2. Navigate to: cd '../frontend'"
    echo "  3. Run: node serve_complete.js"
    echo ""
    echo "Press Enter when the application is running..."
    read -r
    
    if wait_for_app; then
        return 0
    else
        print_error "Failed to detect running DepFlow application"
        exit 1
    fi
}

# Function to run tests
run_tests() {
    local test_type="$1"
    local additional_args="$2"
    
    print_status "Running DepFlow tests..."
    
    case $test_type in
        "smoke")
            print_status "Running smoke tests (critical functionality)..."
            python run_tests.py --tags smoke --headless $additional_args
            ;;
        "ui")
            print_status "Running UI tests (all user interface tests)..."
            python run_tests.py --no-api --headless $additional_args
            ;;
        "api")
            print_status "Running API tests (backend endpoints)..."
            python run_tests.py --suite 04_api_tests $additional_args
            ;;
        "auth")
            print_status "Running authentication tests..."
            python run_tests.py --suite 01_authentication_tests --headless $additional_args
            ;;
        "crud")
            print_status "Running CRUD operation tests..."
            python run_tests.py --suite 02_dependency_crud_tests --headless $additional_args
            ;;
        "filter")
            print_status "Running search and filter tests..."
            python run_tests.py --suite 03_filtering_search_tests --headless $additional_args
            ;;
        "all")
            print_status "Running complete test suite..."
            python run_tests.py --parallel --headless $additional_args
            ;;
        *)
            print_status "Running default test suite..."
            python run_tests.py --tags smoke --headless $additional_args
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        print_success "Tests completed successfully!"
    else
        print_warning "Some tests may have failed. Check the HTML report for details."
    fi
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up test environment..."
    
    # Clean up old results (older than 7 days)
    python run_tests.py --cleanup 7 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Function to show usage
show_usage() {
    echo ""
    echo "DepFlow Test Framework Setup and Execution Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  setup          Set up test environment and dependencies"
    echo "  run [TYPE]     Run tests (default: smoke tests)"
    echo "  cleanup        Clean up old test results"
    echo "  help          Show this help message"
    echo ""
    echo "Test Types:"
    echo "  smoke         Critical functionality tests (fastest)"
    echo "  ui            All user interface tests"
    echo "  api           Backend API tests only"
    echo "  auth          Authentication and login tests"
    echo "  crud          Create/Read/Update/Delete tests"
    echo "  filter        Search and filtering tests"
    echo "  all           Complete test suite (takes 15-30 minutes)"
    echo ""
    echo "Options:"
    echo "  --visible     Run tests with visible browser (not headless)"
    echo "  --no-report   Don't open HTML report after tests"
    echo "  --browser     Specify browser (Chrome, Firefox, Safari, Edge)"
    echo ""
    echo "Examples:"
    echo "  $0 setup                    # Set up test environment"
    echo "  $0 run                      # Run smoke tests (default)"
    echo "  $0 run smoke                # Run smoke tests explicitly"
    echo "  $0 run all                  # Run complete test suite"
    echo "  $0 run ui --visible         # Run UI tests with visible browser"
    echo "  $0 run api --no-report      # Run API tests without opening report"
    echo "  $0 cleanup                  # Clean up old test results"
    echo ""
}

# Main script logic
main() {
    local command="${1:-help}"
    local test_type="${2:-smoke}"
    local additional_args="${*:3}"
    
    # Change to tests directory
    cd "$(dirname "$0")"
    
    case $command in
        "setup")
            setup_test_environment
            print_success "Test environment setup completed!"
            echo ""
            echo "Next steps:"
            echo "  1. Start DepFlow app: cd ../frontend && node serve_complete.js"
            echo "  2. Run tests: $0 run smoke"
            ;;
        "run")
            setup_test_environment
            start_depflow_app
            run_tests "$test_type" "$additional_args"
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            print_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"

