"""
Teacher authentication API endpoints.
This module handles teacher login functionality using passcode validation.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create router for authentication endpoints
router = APIRouter()

class LoginRequest(BaseModel):
    """Request model for teacher login."""
    passcode: str

class LoginResponse(BaseModel):
    """Response model for teacher login."""
    success: bool
    message: str

@router.post("/login", response_model=LoginResponse)
async def teacher_login(request: LoginRequest):
    """
    Authenticate teacher using passcode.
    
    """
    # Get the expected passcode from environment variables
    expected_passcode = os.getenv("TEACHER_PASSCODE")
    
    # Check if TEACHER_PASSCODE is configured
    if not expected_passcode:
        raise HTTPException(
            status_code=500,
            detail="Teacher authentication not configured. Please set TEACHER_PASSCODE environment variable."
        )
    
    # Validate the provided passcode
    if request.passcode == expected_passcode:
        return LoginResponse(
            success=True,
            message="Authentication successful"
        )
    else:
        return LoginResponse(
            success=False,
            message="Invalid passcode"
        )
