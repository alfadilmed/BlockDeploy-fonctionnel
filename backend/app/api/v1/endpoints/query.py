from fastapi import APIRouter, HTTPException, Body, Depends
from typing import Annotated
import uuid
from datetime import datetime

from ..schemas import AIQueryRequestDTO, AIQueryResponseDTO, ErrorDTO, AIResponseData, SourceData # Added SourceData
from ....services.llm_service import BaseLLMService, get_llm_service, LLMServiceError
from ....services.prompt_manager import PromptManager
from ....core.config import settings


router = APIRouter()

# Dependency for PromptManager (can be customized if PromptManager needs config)
def get_prompt_manager():
    return PromptManager()

@router.post(
    "/query",
    response_model=AIQueryResponseDTO,
    responses={
        422: {"model": ErrorDTO, "description": "Validation Error"},
        500: {"model": ErrorDTO, "description": "Internal Server Error"},
        503: {"model": ErrorDTO, "description": "LLM Service Unavailable"}
    },
    summary="Submit a query to the AI Assistant",
    description="Receives a user query and context, processes it through an LLM, and returns a structured AI response."
)
async def query_ai_assistant(
    request_dto: AIQueryRequestDTO = Body(...),
    llm_service: BaseLLMService = Depends(get_llm_service), # Injects the configured LLM service
    prompt_manager: PromptManager = Depends(get_prompt_manager) # Injects PromptManager
):
    """
    Endpoint to interact with the AI Assistant.

    - **conversation_id**: Optional ID to track a conversation. If not provided, a new one might be implied or handled by client.
    - **user_id**: Identifier for the authenticated user.
    - **query_text**: The user's textual query.
    - **context**: Optional contextual information (current UI location, config details, conversation history).
    - **llm_options**: Optional LLM-specific parameters (model, temperature).
    """
    try:
        # 1. Build the prompt using PromptManager
        full_prompt = prompt_manager.build_prompt(request_dto)

        # 2. Prepare LLM options from request DTO or use defaults
        llm_call_options = {}
        if request_dto.llm_options:
            if request_dto.llm_options.model:
                llm_call_options["model"] = request_dto.llm_options.model
            if request_dto.llm_options.temperature is not None:
                llm_call_options["temperature"] = request_dto.llm_options.temperature
            if request_dto.llm_options.max_tokens is not None:
                llm_call_options["max_tokens"] = request_dto.llm_options.max_tokens

        # Ensure a default model is passed if not specified
        if "model" not in llm_call_options:
            llm_call_options["model"] = settings.LLM_DEFAULT_MODEL


        # 3. Call the LLM service
        llm_response_data = await llm_service.generate_response(full_prompt, llm_call_options)

        # 4. Construct the response DTO
        # For M1, conversation_id can be passed through or generated if not present.
        # For simplicity in M1, we'll echo back if provided, or generate a new one.
        conversation_id = request_dto.conversation_id or str(uuid.uuid4())
        response_id = str(uuid.uuid4())

        # Adapt llm_response_data to AIResponseData schema
        # The mock service currently returns keys that match well.
        # In a real scenario, mapping might be more complex.
        assistant_response_content = AIResponseData(
            text_response=llm_response_data.get("text_response", "No text response from LLM."),
            structured_data=llm_response_data.get("structured_data"),
            confidence_score=llm_response_data.get("confidence_score"),
            sources=[SourceData(**source) for source in llm_response_data.get("sources", [])] if llm_response_data.get("sources") else None
        )

        api_response = AIQueryResponseDTO(
            conversation_id=conversation_id,
            response_id=response_id,
            assistant_response=assistant_response_content,
            timestamp=datetime.utcnow() # Already has default_factory, but can be explicit
        )
        return api_response

    except LLMServiceError as e:
        # Specific error from our LLM service wrapper
        raise HTTPException(status_code=e.status_code, detail={"error_code": "LLM_SERVICE_ERROR", "message": e.message})
    except ValueError as ve: # Catch potential ValueErrors from services (e.g. bad config)
        # Log the error server-side for diagnosis
        print(f"ValueError in query_ai_assistant: {ve}") # Replace with proper logging
        raise HTTPException(status_code=400, detail={"error_code": "INVALID_INPUT", "message": str(ve)})
    except Exception as e:
        # Generic catch-all for other unexpected errors
        # Log the full error server-side for diagnosis
        print(f"Unexpected error in query_ai_assistant: {e}") # Replace with proper logging
        raise HTTPException(status_code=500, detail={"error_code": "INTERNAL_SERVER_ERROR", "message": "An unexpected error occurred."})

# This makes the router available for inclusion in main.py or other router files.
# The actual inclusion is done in app/api/v1/routers.py
# No, this file is imported as `query_router` in `routers.py`, so `router` instance will be used.
