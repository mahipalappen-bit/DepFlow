#!/usr/bin/env python3
"""
DepFlow Test Runner
Main script to execute Robot Framework test suites with various configurations
"""

import os
import sys
import argparse
from pathlib import Path
import subprocess
import datetime
import webbrowser

class DepFlowTestRunner:
    """Main test runner class for DepFlow application testing"""
    
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.results_dir = self.base_dir / "results"
        self.reports_dir = self.results_dir / "reports"
        self.logs_dir = self.results_dir / "logs"
        self.screenshots_dir = self.results_dir / "screenshots"
        
        # Create directories
        self.results_dir.mkdir(exist_ok=True)
        self.reports_dir.mkdir(exist_ok=True)
        self.logs_dir.mkdir(exist_ok=True)
        self.screenshots_dir.mkdir(exist_ok=True)
    
    def run_tests(self, test_suite=None, tags=None, browser="Chrome", headless=False, 
                  parallel=False, include_api=True, open_report=True):
        """
        Run Robot Framework tests with specified configuration
        
        Args:
            test_suite (str): Specific test suite to run
            tags (str): Test tags to include/exclude
            browser (str): Browser to use for testing
            headless (bool): Run browser in headless mode
            parallel (bool): Run tests in parallel
            include_api (bool): Include API tests
            open_report (bool): Open report in browser after completion
        """
        
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Build Robot Framework command
        cmd = ["robot"]
        
        # Output configuration
        cmd.extend([
            "--outputdir", str(self.reports_dir),
            "--output", f"output_{timestamp}.xml",
            "--log", f"log_{timestamp}.html", 
            "--report", f"report_{timestamp}.html"
        ])
        
        # Variable configuration
        cmd.extend([
            "--variable", f"BROWSER:{browser}",
            "--variable", f"HEADLESS_MODE:{headless}",
            "--variable", f"SCREENSHOTS_DIR:{self.screenshots_dir}",
            "--variable", f"REPORTS_DIR:{self.reports_dir}",
            "--variable", f"LOGS_DIR:{self.logs_dir}"
        ])
        
        # Tag configuration
        if tags:
            if tags.startswith("NOT"):
                cmd.extend(["--exclude", tags[3:].strip()])
            else:
                cmd.extend(["--include", tags])
        
        # Test suite selection
        test_suites_dir = self.base_dir / "test_suites"
        
        if test_suite:
            if test_suite == "smoke":
                cmd.extend(["--include", "smoke"])
                cmd.append(str(test_suites_dir))
            elif test_suite == "api":
                cmd.append(str(test_suites_dir / "04_api_tests.robot"))
            elif test_suite == "ui":
                cmd.extend(["--exclude", "api"])
                cmd.append(str(test_suites_dir))
            else:
                # Specific test suite file
                suite_file = test_suites_dir / f"{test_suite}.robot"
                if suite_file.exists():
                    cmd.append(str(suite_file))
                else:
                    print(f"Test suite {test_suite} not found!")
                    return False
        else:
            # Run all tests
            if not include_api:
                cmd.extend(["--exclude", "api"])
            cmd.append(str(test_suites_dir))
        
        # Parallel execution
        if parallel and not test_suite:
            print("Running tests in parallel...")
            return self._run_parallel_tests(cmd, timestamp, open_report)
        else:
            print("Running tests sequentially...")
            return self._run_sequential_tests(cmd, timestamp, open_report)
    
    def _run_sequential_tests(self, cmd, timestamp, open_report):
        """Run tests sequentially"""
        try:
            print(f"Executing command: {' '.join(cmd)}")
            result = subprocess.run(cmd, check=False, capture_output=True, text=True)
            
            print(f"Return code: {result.returncode}")
            if result.stdout:
                print("STDOUT:")
                print(result.stdout)
            if result.stderr:
                print("STDERR:")
                print(result.stderr)
            
            # Open report if requested
            if open_report:
                report_file = self.reports_dir / f"report_{timestamp}.html"
                if report_file.exists():
                    webbrowser.open(f"file://{report_file.absolute()}")
            
            return result.returncode == 0
            
        except subprocess.SubprocessError as e:
            print(f"Error running tests: {e}")
            return False
    
    def _run_parallel_tests(self, cmd, timestamp, open_report):
        """Run tests in parallel using pabot"""
        try:
            # Replace 'robot' with 'pabot' for parallel execution
            cmd[0] = "pabot"
            cmd.insert(1, "--processes")
            cmd.insert(2, "4")  # Number of parallel processes
            
            print(f"Executing parallel command: {' '.join(cmd)}")
            result = subprocess.run(cmd, check=False)
            
            # Open report if requested
            if open_report:
                report_file = self.reports_dir / f"report_{timestamp}.html"
                if report_file.exists():
                    webbrowser.open(f"file://{report_file.absolute()}")
            
            return result.returncode == 0
            
        except subprocess.SubprocessError as e:
            print(f"Error running parallel tests: {e}")
            return False
    
    def list_test_suites(self):
        """List available test suites"""
        test_suites_dir = self.base_dir / "test_suites"
        suites = []
        
        for suite_file in test_suites_dir.glob("*.robot"):
            suites.append(suite_file.stem)
        
        return suites
    
    def cleanup_old_results(self, days=7):
        """Clean up old test results older than specified days"""
        import time
        
        cutoff_time = time.time() - (days * 24 * 60 * 60)
        
        for results_subdir in [self.reports_dir, self.logs_dir, self.screenshots_dir]:
            for file_path in results_subdir.glob("*"):
                if file_path.is_file() and file_path.stat().st_mtime < cutoff_time:
                    file_path.unlink()
                    print(f"Deleted old file: {file_path}")

def main():
    """Main entry point for the test runner"""
    parser = argparse.ArgumentParser(description="DepFlow Test Runner")
    
    parser.add_argument("--suite", help="Specific test suite to run")
    parser.add_argument("--tags", help="Tags to include/exclude (e.g., 'smoke' or 'NOT slow')")
    parser.add_argument("--browser", default="Chrome", choices=["Chrome", "Firefox", "Safari", "Edge"],
                       help="Browser to use for testing")
    parser.add_argument("--headless", action="store_true", help="Run browser in headless mode")
    parser.add_argument("--parallel", action="store_true", help="Run tests in parallel")
    parser.add_argument("--no-api", action="store_true", help="Exclude API tests")
    parser.add_argument("--no-report", action="store_true", help="Don't open report after completion")
    parser.add_argument("--list-suites", action="store_true", help="List available test suites")
    parser.add_argument("--cleanup", type=int, metavar="DAYS", help="Clean up results older than N days")
    
    args = parser.parse_args()
    
    runner = DepFlowTestRunner()
    
    if args.list_suites:
        print("Available test suites:")
        for suite in runner.list_test_suites():
            print(f"  - {suite}")
        return
    
    if args.cleanup:
        runner.cleanup_old_results(args.cleanup)
        return
    
    # Run tests
    success = runner.run_tests(
        test_suite=args.suite,
        tags=args.tags,
        browser=args.browser,
        headless=args.headless,
        parallel=args.parallel,
        include_api=not args.no_api,
        open_report=not args.no_report
    )
    
    if success:
        print("Tests completed successfully!")
        sys.exit(0)
    else:
        print("Tests failed or encountered errors!")
        sys.exit(1)

if __name__ == "__main__":
    main()

