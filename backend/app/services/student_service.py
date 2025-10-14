"""
Student service layer.
This module handles business logic for student operations.
"""

import json
import os
from typing import List, Optional
from fastapi import HTTPException

try:
    from app.models.student import Student, StudentCreate, StudentUpdate
except ImportError:
    # Fallback for direct execution
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app.models.student import Student, StudentCreate, StudentUpdate

class StudentService:
    """Service class for student operations."""
    
    def __init__(self, data_file_path: str = None):
        """Initialize the student service with a data file path."""
        if data_file_path is None:
            # Default path to students.json in the data folder
            current_dir = os.path.dirname(os.path.abspath(__file__))
            data_file_path = os.path.join(current_dir, "..", "..", "..", "data", "students.json")
        self.data_file_path = data_file_path
    
    def _load_students(self) -> List[Student]:
        """Load students from the JSON file."""
        try:
            with open(self.data_file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return [Student(**student) for student in data]
        except FileNotFoundError:
            return []
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading students: {str(e)}")
    
    def get_all_students(self) -> List[Student]:
        """Get all students."""
        return self._load_students()
    
    def get_student_by_id(self, student_id: str) -> Student:
        """Get a specific student by ID."""
        students = self._load_students()
        for student in students:
            if student.id == student_id:
                return student
        raise HTTPException(status_code=404, detail="Student not found")
    