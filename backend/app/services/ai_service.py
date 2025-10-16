import json
import os
import requests
from typing import List, Optional, Dict, Any
from ..config.ai_config import get_ai_config
from ..models.ai_models import SummarizationRequest, StudentAnswer, SmartSearchRequest

class AIBaseService:
    """Base class for AI services."""
    
    def __init__(self):
        """Initialize the service."""
        self.config = get_ai_config()
        
        # Validate configuration
        if not self.config.OPENAI_API_KEY:
            print("Warning: OPENAI_API_KEY not provided. AI services will not work.")
            
    def _make_openai_request(self, messages: List[dict], json_response: bool = False) -> Any:
        """Make a direct HTTP request to OpenAI API.
        
        Args:
            messages: List of message objects for the API
            json_response: Whether to expect and parse a JSON response
            
        Returns:
            str or dict: The API response content, parsed as JSON if json_response=True
            
        Raises:
            ValueError: If the API request fails
        """
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
        
        # For JSON responses, add the response format parameter
        if json_response:
            data["response_format"] = {"type": "json_object"}
            data["temperature"] = 0.3  # Lower temperature for more deterministic results
            data["max_tokens"] = 500   # Smaller response size needed
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            if not result.get("choices") or not result["choices"][0].get("message", {}).get("content"):
                raise ValueError("Empty response from OpenAI API")
                
            content = result["choices"][0]["message"]["content"].strip()
            
            # Parse JSON if requested
            if json_response:
                try:
                    return json.loads(content)
                except json.JSONDecodeError as e:
                    raise ValueError(f"Failed to parse JSON response: {str(e)}")
            
            return content
            
        except requests.exceptions.RequestException as e:
            raise ValueError(f"OpenAI API request failed: {str(e)}")
        except (KeyError, IndexError) as e:
            raise ValueError(f"Invalid response format from OpenAI API: {str(e)}")


class AISummarizationService(AIBaseService):
    """Service for AI-powered summarization of student answers."""

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
            
            
class AISmartSearchService(AIBaseService):
    """Service for AI-powered semantic search of questions."""
    
    def _format_system_prompt(self) -> str:
        """Format the system prompt for the AI."""
        return """You are an intelligent search agent specialized in semantic matching of educational questions.
        Your task is to match a 'query' to the most relevant questions from the 'available_questions' list.
        
        You MUST only return a single JSON object containing one key: 'matching_question_ids', which holds a list of 
        the integer IDs of the relevant questions. If no questions are relevant, return an empty list.
        
        Based on the semantic relevance of the 'query' to the 'text' of each question, identify the IDs of 
        the top 1-3 matching questions. Strictly output the result as a single JSON object.
        
        Example Format:
        {"matching_question_ids": [102, 103, 105]}
        """
    
    def _format_user_prompt(self, request: SmartSearchRequest) -> str:
        """Format the user prompt with the request data."""
        data = {
            "query": request.query,
            "available_questions": [
                {
                    "id": question.id,
                    "text": question.text
                }
                for question in request.available_questions
            ]
        }
        return json.dumps(data, indent=2)
        
    def find_relevant_questions(self, request: SmartSearchRequest) -> List[int]:
        """Find questions that are semantically relevant to the search query.
        
        Args:
            request (SmartSearchRequest): The request containing the search query and available questions
            
        Returns:
            List[int]: List of question IDs that match the search query
            
        Raises:
            ValueError: If the search fails
        """
        try:
            # Validate request
            if not request.available_questions:
                return []  # No questions to search through
                
            if not request.query.strip():
                raise ValueError("Search query cannot be empty")
                
            # Prepare messages for the API
            messages = [
                {"role": "system", "content": self._format_system_prompt()},
                {"role": "user", "content": self._format_user_prompt(request)}
            ]
            
            # Make the API request with JSON response
            result = self._make_openai_request(messages, json_response=True)
            
            # Extract and validate matching question IDs
            matching_ids = result.get("matching_question_ids", [])
            if not isinstance(matching_ids, list):
                raise ValueError("Invalid response format: matching_question_ids must be a list")
                
            # Ensure all IDs are integers and exist in the available questions
            valid_ids = set(q.id for q in request.available_questions)
            matching_ids = [id for id in matching_ids if isinstance(id, int) and id in valid_ids]
            
            return matching_ids
            
        except ValueError as e:
            # Re-raise validation errors as-is
            print(f"Validation error: {str(e)}")
            raise
        except Exception as e:
            # Log the error and raise it for handling in the endpoint
            print(f"Error finding relevant questions: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            raise ValueError(f"Failed to find relevant questions: {str(e)}")