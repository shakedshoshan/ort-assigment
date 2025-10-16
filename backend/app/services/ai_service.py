import json
from typing import List, Optional
from openai import OpenAI
from ..config.ai_config import get_ai_config
from ..models.ai_models import SummarizationRequest, StudentAnswer

class AISummarizationService:
    """Service for AI-powered summarization of student answers."""

    def __init__(self):
        """Initialize the service with OpenAI client."""
        self.config = get_ai_config()
        self._client = None
        
        # Validate configuration
        if not self.config.OPENAI_API_KEY:
            print("Warning: OPENAI_API_KEY not provided. AI summarization will not work.")
    
    @property
    def client(self):
        """Lazy initialization of OpenAI client."""
        if self._client is None:
            if not self.config.OPENAI_API_KEY:
                raise ValueError("OPENAI_API_KEY environment variable is required")
            self._client = OpenAI(api_key=self.config.OPENAI_API_KEY)
        return self._client

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
            # Create the chat completion
            response = self.client.chat.completions.create(
                model=self.config.OPENAI_MODEL,
                temperature=self.config.OPENAI_TEMPERATURE,
                max_tokens=self.config.OPENAI_MAX_TOKENS,
                messages=[
                    {"role": "system", "content": self._format_system_prompt()},
                    {"role": "user", "content": self._format_user_prompt(request)}
                ]
            )
            
            # Extract and return the summary text
            return response.choices[0].message.content.strip()
        except Exception as e:
            # Log the error and raise it for handling in the endpoint
            print(f"Error generating summary: {str(e)}")
            raise
