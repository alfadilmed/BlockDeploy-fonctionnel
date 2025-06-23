from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

# Based on docs/phase_2/backend/P2_L2_M2_AI_BACKEND_DESIGN.md

class ErrorDTO(BaseModel):
    error_code: str = Field(..., description="Code d'erreur interne ou standardisé.")
    message: str = Field(..., description="Message d'erreur lisible par un humain.")
    details: Optional[Dict[str, Any]] = Field(None, description="Détails supplémentaires sur l'erreur, peut être une structure JSON.")

# Example Usage for specific errors (can be defined elsewhere or used directly)
# class ValidationErrorDetail(BaseModel):
#     loc: List[str] = Field(..., description="Location of the error in the request.")
#     msg: str = Field(..., description="Error message.")
#     type: str = Field(..., description="Type of error.")

# class HTTPValidationError(BaseModel):
#     detail: List[ValidationErrorDetail]

# This ErrorDTO is generic enough for most cases.
# FastAPI's default RequestValidationError uses a different structure,
# but we can catch it and convert to this ErrorDTO if needed via an exception handler.
