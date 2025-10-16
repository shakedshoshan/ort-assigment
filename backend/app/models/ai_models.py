from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class SummarizationContext(BaseModel):
    """Context for summarization request."""
    question_id: int = Field(..., description="ID of the question being summarized")
    question_text: str = Field(..., description="Text of the question")
    summary_instructions: str = Field(..., description="Instructions for how to summarize")

class StudentAnswer(BaseModel):
    """Student answer data."""
    student_id: str = Field(..., description="ID of the student")
    student_name: str = Field(..., description="Name of the student")
    answer_text: str = Field(..., description="Text of the student's answer")
    submitted_at: str = Field(..., description="Timestamp when answer was submitted")

class SummarizationRequest(BaseModel):
    """Request model for summarization endpoint."""
    context: SummarizationContext = Field(..., description="Context for the summarization")
    student_answers: List[StudentAnswer] = Field(..., description="List of student answers to summarize")

class SummarizationResponse(BaseModel):
    """Response model for summarization endpoint."""
    summary: str = Field(..., description="Generated summary of student answers")
    error: Optional[str] = Field(None, description="Error message if summarization failed")

class QuestionItem(BaseModel):
    """Question item for smart search."""
    id: int = Field(..., description="ID of the question")
    text: str = Field(..., description="Text of the question")

class SmartSearchRequest(BaseModel):
    """Request model for smart search endpoint."""
    query: str = Field(..., description="Natural language search query")
    available_questions: List[QuestionItem] = Field(..., description="List of questions to search through")

class SmartSearchResponse(BaseModel):
    """Response model for smart search endpoint."""
    matching_question_ids: List[int] = Field(..., description="IDs of questions matching the search query")
    error: Optional[str] = Field(None, description="Error message if search failed")
