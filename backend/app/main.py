"""
Main FastAPI application module.
This is the entry point for the FastAPI server.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import database configuration with fallback for direct execution
try:
    from app.database.config import create_tables
except ImportError:
    # Fallback for direct execution
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app.database.config import create_tables

# Create FastAPI application instance
app = FastAPI(
    title="ORT Assignment API",
    description="A simple FastAPI server for the ORT assignment with SQLite database",
    version="1.0.0"
)

# Initialize database tables on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on application startup."""
    # Skip database initialization in testing mode (uses in-memory DB)
    if os.getenv("TESTING") == "true":
        print("🧪 Testing mode - skipping database initialization")
        return
    
    try:
        create_tables()  # Create all SQLAlchemy tables from models
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        print("💡 Run 'py init_database.py' to set up your database")
        raise

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (frontend domains) - restrict in production
    allow_credentials=True,  # Allow cookies/auth headers in requests
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all request headers (Content-Type, Authorization, etc.)
)

# Import routers
try:
    from app.api import api_router
except ImportError:
    # Fallback for direct execution
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app.api import api_router

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint that returns a welcome message."""
    return {"message": "Welcome to ORT Assignment API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "ort-assignment-api"}

def run_dev():
    """Run the FastAPI server in development mode with auto-reload."""
    import uvicorn
    uvicorn.run(
        "app.main:app",  # Module path to FastAPI app instance
        host="0.0.0.0",  # Listen on all network interfaces
        port=8000,  # Default port for API
        reload=True,  # Auto-reload on code changes
        reload_dirs=["app"]  # Watch only app directory for changes
    )

# def run_prod():
#     """Run the FastAPI server in production mode."""
#     import uvicorn
#     uvicorn.run(
#         "app.main:app",  # Module path to FastAPI app instance
#         host="0.0.0.0",  # Listen on all network interfaces
#         port=8000,  # Default port for API
#         workers=1  # Single worker process (SQLite doesn't support multiple workers)
#     )

if __name__ == "__main__":
    run_dev()
