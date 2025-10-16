from fastapi import APIRouter, HTTPException
from ...models.ai_models import SummarizationRequest, SummarizationResponse, SmartSearchRequest, SmartSearchResponse
from ...services.ai_service import AISummarizationService, AISmartSearchService

router = APIRouter()
summarization_service = AISummarizationService()
smart_search_service = AISmartSearchService()

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
        summary = summarization_service.generate_summary(request)
        return SummarizationResponse(summary=summary)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate summary: {str(e)}"
        )
        
@router.post("/smart-search", response_model=SmartSearchResponse)
def smart_search(request: SmartSearchRequest) -> SmartSearchResponse:
    """
    Perform a semantic search to find questions matching a natural language query.
    
    Args:
        request (SmartSearchRequest): The request containing the search query and available questions
        
    Returns:
        SmartSearchResponse: The IDs of questions matching the search query
        
    Raises:
        HTTPException: If the search fails
    """
    try:
        matching_ids = smart_search_service.find_relevant_questions(request)
        return SmartSearchResponse(matching_question_ids=matching_ids)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to perform smart search: {str(e)}"
        )
