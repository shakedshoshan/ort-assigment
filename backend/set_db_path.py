#!/usr/bin/env python3
"""
Script to set the database path.
Usage: py set_db_path.py [path]
"""

import os
import sys
from pathlib import Path

def set_database_path(path=None):
    """Set the database path in environment variable."""
    if path is None:
        # Interactive mode
        print("Current DATABASE_PATH:", os.getenv('DATABASE_PATH', 'Not set (uses default: ./app.db)'))
        print()
        print("Examples:")
        print("  ./app.db                    - Relative to backend directory")
        print("  data/app.db                 - In data subdirectory")
        print("  C:/myapp/database.db        - Absolute Windows path")
        print("  /home/user/app.db           - Absolute Unix path")
        print()
        
        path = input("Enter database path (or press Enter for default): ").strip()
        if not path:
            path = "./app.db"
    
    # Set the environment variable
    os.environ['DATABASE_PATH'] = path
    print(f"Set DATABASE_PATH to: {path}")
    
    # Test the configuration
    try:
        # Add the app directory to the Python path
        app_dir = Path(__file__).parent / "app"
        sys.path.insert(0, str(app_dir))
        
        from database.config import get_database_path
        resolved_path = get_database_path()
        print(f"Resolved path: {resolved_path}")
        print(f"Directory will be created: {Path(resolved_path).parent}")
        
        # Create a .env file with this setting
        env_file = Path(__file__).parent / ".env"
        with open(env_file, 'w') as f:
            f.write(f"DATABASE_PATH={path}\n")
        print(f"Saved to .env file: {env_file}")
        
    except Exception as e:
        print(f"Error testing configuration: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        set_database_path(sys.argv[1])
    else:
        set_database_path()
