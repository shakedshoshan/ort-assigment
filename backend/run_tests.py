#!/usr/bin/env python3
"""
Simple test runner script for the ORT Assignment backend tests.
"""

import subprocess
import sys
import os

def check_dependencies():
    """Check if required testing dependencies are installed."""
    try:
        import pytest
        import httpx
        return True
    except ImportError:
        return False

def install_dependencies():
    """Install missing test dependencies."""
    print("Installing test dependencies...")
    try:
        subprocess.run([
            sys.executable, "-m", "pip", "install", 
            "pytest==7.4.3", "pytest-asyncio==0.21.1", "httpx==0.25.2"
        ], check=True)
        print("Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError:
        print("Failed to install dependencies. Please run manually:")
        print("   pip install pytest pytest-asyncio httpx")
        return False

def run_tests():
    """Run all backend tests using pytest."""
    print("Running ORT Assignment Backend Tests...")
    print("=" * 50)
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Check and install dependencies if needed
    if not check_dependencies():
        print("Test dependencies not found.")
        if not install_dependencies():
            return 1
        print("\nRetrying tests...")
    
    try:
        # Run pytest with verbose output
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "tests/", 
            "-v",  # Verbose output
            "--tb=short",  # Short traceback format
        ], check=True)
        
        print("\nAll tests passed!")
        return 0
        
    except subprocess.CalledProcessError as e:
        print(f"\nTests failed with exit code {e.returncode}")
        return e.returncode
    except FileNotFoundError:
        print("pytest not found. Please install test dependencies:")
        print("   pip install pytest pytest-asyncio httpx")
        return 1

if __name__ == "__main__":
    exit_code = run_tests()
    sys.exit(exit_code)
