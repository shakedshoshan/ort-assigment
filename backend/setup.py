#!/usr/bin/env python3
"""
Quick setup script for ORT Assignment project.
This script helps users get started quickly.
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    """Main setup function."""
    print("🚀 ORT Assignment - Quick Setup")
    print("=" * 40)
    print()
    
    # Check if we're in the right directory
    if not Path("app").exists():
        print("❌ Please run this script from the backend directory")
        print("   cd backend")
        print("   py setup.py")
        return False
    
    print("1. 📦 Installing dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True)
        print("   ✅ Dependencies installed")
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Failed to install dependencies: {e}")
        return False
    
    print("\n2. 🗄️  Setting up database...")
    try:
        subprocess.run([sys.executable, "init_database.py", "--quick"], check=True)
        print("   ✅ Database setup complete")
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Database setup failed: {e}")
        return False
    
    print("\n3. 🎉 Setup complete!")
    print()
    print("To start the application:")
    print("   py -m app.main")
    print()
    print("To start with custom database setup:")
    print("   py init_database.py")
    print()
    print("API will be available at: http://localhost:8000")
    print("API documentation: http://localhost:8000/docs")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
