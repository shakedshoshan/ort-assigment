"""
Student service layer.
This module handles business logic for student operations.
"""

import json
import os
from typing import List, Dict, Any, Optional
from fastapi import HTTPException


class StudentService:
    """Service class for student operations."""
    
    def __init__(self, data_file_path: str = None):
        """
        Initialize the student service with a data file path.
        
        Args:
            data_file_path: Path to the JSON file containing student data
        """
        if data_file_path is None:
            # Check if running in Docker container
            if os.getenv("DOCKER_CONTAINER") == "true":
                # In Docker, data folder is mounted at /app/data
                data_file_path = "/app/data/students.json"
            else:
                # Default path to students.json in the data folder
                current_dir = os.path.dirname(os.path.abspath(__file__))
                data_file_path = os.path.join(current_dir, "..", "..", "..", "data", "students.json")
        self.data_file_path = data_file_path
    
    def _load_students(self) -> List[Dict[str, Any]]:
        """
        Load students from the JSON file.
        
        Returns:
            List of student dictionaries
            
        Raises:
            HTTPException: If there's an error loading the file
        """
        try:
            with open(self.data_file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return []
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading students: {str(e)}")
    
    def get_all_students(self) -> List[Dict[str, Any]]:
        """
        Get all students.
        
        Returns:
            List of student dictionaries
        """
        return self._load_students()
    
    def get_student_by_id(self, student_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific student by ID.
        
        Args:
            student_id: The ID of the student to retrieve
            
        Returns:
            Student dictionary if found, None otherwise
            
        Raises:
            HTTPException: If student not found
        """
        students = self._load_students()
        for student in students:
            if student.get("id") == student_id:
                return student
        raise HTTPException(status_code=404, detail="Student not found")
    
    def validate_student_id(self, student_id: str) -> bool:
        """
        Validate if a student ID exists.
        
        Args:
            student_id: The ID of the student to validate
            
        Returns:
            True if the student exists, False otherwise
        """
        students = self._load_students()
        return any(student.get("id") == student_id for student in students)