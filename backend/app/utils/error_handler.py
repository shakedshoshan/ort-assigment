"""
Centralized error handling utility for API endpoints.
This module provides reusable error handling functions to avoid code duplication.
"""

from fastapi import HTTPException
from fastapi import status


def handle_http_exception(operation: str, error: Exception) -> HTTPException:
    """
    Handle HTTP exceptions with consistent formatting.
    
    Args:
        operation: Description of the operation that failed
        error: The exception that occurred
        
    Returns:
        HTTPException: Formatted HTTP exception
    """
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Failed to {operation}: {str(error)}"
    )


def handle_not_found_exception(resource_type: str, resource_id: str) -> HTTPException:
    """
    Handle resource not found exceptions.
    
    Args:
        resource_type: Type of resource (e.g., "Question", "Student")
        resource_id: ID or identifier of the resource
        
    Returns:
        HTTPException: 404 Not Found exception
    """
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{resource_type} with ID '{resource_id}' not found"
    )


def handle_conflict_exception(message: str) -> HTTPException:
    """
    Handle conflict exceptions (409).
    
    Args:
        message: Conflict message
        
    Returns:
        HTTPException: 409 Conflict exception
    """
    return HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=message
    )


def handle_service_error(operation: str) -> HTTPException:
    """
    Handle service operation failures.
    
    Args:
        operation: Description of the failed service operation
        
    Returns:
        HTTPException: 500 Internal Server Error exception
    """
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Failed to {operation}"
    )


def handle_unexpected_error(operation: str, error: Exception) -> HTTPException:
    """
    Handle unexpected errors with consistent formatting.
    
    Args:
        operation: Description of the operation that failed
        error: The unexpected exception that occurred
        
    Returns:
        HTTPException: 500 Internal Server Error exception
    """
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Failed to {operation}: {str(error)}"
    )
