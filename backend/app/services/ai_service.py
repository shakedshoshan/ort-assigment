import json
import os
import requests
from typing import List, Optional
from ..config.ai_config import get_ai_config
from ..models.ai_models import SummarizationRequest, StudentAnswer

class AISummarizationService:
    """Service for AI-powered summarization of student answers."""

    def __init__(self):
        """Initialize the service."""
        self.config = get_ai_config()
        
        # Validate configuration
        if not self.config.OPENAI_API_KEY:
            print("Warning: OPENAI_API_KEY not provided. AI summarization will not work.")
    
    def _make_openai_request(self, messages: List[dict]) -> str:
        """Make a direct HTTP request to OpenAI API."""
        if not self.config.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.config.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.config.OPENAI_MODEL,
            "messages": messages,
            "temperature": self.config.OPENAI_TEMPERATURE,
            "max_tokens": self.config.OPENAI_MAX_TOKENS
        }
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            if not result.get("choices") or not result["choices"][0].get("message", {}).get("content"):
                raise ValueError("Empty response from OpenAI API")
                
            return result["choices"][0]["message"]["content"].strip()
            
        except requests.exceptions.RequestException as e:
            raise ValueError(f"OpenAI API request failed: {str(e)}")
        except (KeyError, IndexError) as e:
            raise ValueError(f"Invalid response format from OpenAI API: {str(e)}")

    def _format_system_prompt(self) -> str:
        """Format the system prompt for the AI."""
        return """You are an advanced educational analysis assistant. Your sole task is to analyze a set of student answers 
        to a single question and generate a comprehensive summary strictly following the provided 'summary_instructions'.
        
        Your output MUST be ONLY the summary text. Do NOT include any introductory phrases like "Based on the data..." 
        or "Here is the summary," or any surrounding JSON/Markdown blocks."""

    def _format_user_prompt(self, request: SummarizationRequest) -> str:
        """Format the user prompt with the request data."""
        # Convert request to dict and format it as JSON
        data = {
            "context": {
                "question_id": request.context.question_id,
                "question_text": request.context.question_text,
                "summary_instructions": request.context.summary_instructions
            },
            "student_answers": [
                {
                    "student_id": answer.student_id,
                    "student_name": answer.student_name,
                    "answer_text": answer.answer_text,
                    "submitted_at": answer.submitted_at
                }
                for answer in request.student_answers
            ]
        }
        return json.dumps(data, indent=2)

    def generate_summary(self, request: SummarizationRequest) -> str:
        """Generate a summary of student answers based on the provided instructions."""
        try:
            # Validate request
            if not request.student_answers:
                raise ValueError("No student answers provided for summarization")
            
            if not request.context.summary_instructions.strip():
                raise ValueError("Summary instructions cannot be empty")
            
            # Prepare messages for the API
            messages = [
                {"role": "system", "content": self._format_system_prompt()},
                {"role": "user", "content": self._format_user_prompt(request)}
            ]
            
            # Make the API request
            summary = self._make_openai_request(messages)
            return summary
            
        except ValueError as e:
            # Re-raise validation errors as-is
            print(f"Validation error: {str(e)}")
            raise
        except Exception as e:
            # Log the error and raise it for handling in the endpoint
            print(f"Error generating summary: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            raise ValueError(f"Failed to generate summary: {str(e)}")
