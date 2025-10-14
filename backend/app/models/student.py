"""
Student data models.
This module contains Pydantic models for student data validation and serialization.
"""

from pydantic import BaseModel
from typing import Optional

class StudentBase(BaseModel):
    """Base model for student data."""
    name: str

class StudentCreate(StudentBase):
    """Model for creating a new student."""
    pass

class StudentUpdate(BaseModel):
    """Model for updating an existing student."""
    name: Optional[str] = None

class Student(StudentBase):
    """Complete student model with ID."""
    id: str

    class Config:
        """Pydantic configuration."""
        from_attributes = True
