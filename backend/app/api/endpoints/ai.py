from fastapi import APIRouter, HTTPException
from ...models.ai_models import SummarizationRequest, SummarizationResponse
from ...services.ai_service import AISummarizationService

router = APIRouter()
ai_service = AISummarizationService()

@router.post("/summarize", response_model=SummarizationResponse)
def summarize_answers(request: SummarizationRequest) -> SummarizationResponse:
    """
    Generate an AI-powered summary of student answers.
    
    Args:
        request (SummarizationRequest): The request containing question context and student answers
        
    Returns:
        SummarizationResponse: The generated summary or error message
        
    Raises:
        HTTPException: If summarization fails
    """
    try:
        summary = ai_service.generate_summary(request)
        return SummarizationResponse(summary=summary)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate summary: {str(e)}"
        )
