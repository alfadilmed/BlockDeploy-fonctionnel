from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Based on docs/phase_2/backend/P2_L2_M2_AI_BACKEND_DESIGN.md

class ContextData(BaseModel):
    current_configuration: Optional[Dict[str, Any]] = Field(None, description="Configuration actuelle de l'utilisateur (ex: YAML, JSON) si pertinente pour la requête.")
    deployment_id: Optional[str] = Field(None, description="ID du déploiement concerné, si applicable.")
    ui_location: Optional[str] = Field(None, description="Où l'utilisateur se trouve dans l'interface BlockDeploy.")
    # Added conversation_history as per M4 frontend integration design
    conversation_history: Optional[List[Dict[str, str]]] = Field(None, description="Historique récent des messages {role: 'user'/'assistant', content: '...'} ")


class LLMOptionsData(BaseModel):
    model: Optional[str] = Field(None, description="Modèle LLM à utiliser (si plusieurs sont disponibles).")
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0, description="Température pour la génération LLM.")
    max_tokens: Optional[int] = Field(None, gt=0, description="Nombre maximum de tokens à générer.")


class AIQueryRequestDTO(BaseModel):
    conversation_id: Optional[str] = Field(None, description="ID unique pour suivre une conversation (optionnel, peut être généré par le backend si non fourni).")
    user_id: str = Field(..., description="ID de l'utilisateur authentifié (pour personnalisation, logs, etc.).")
    query_text: str = Field(..., min_length=1, description="La question ou la demande textuelle de l'utilisateur.")
    context: Optional[ContextData] = Field(None, description="Informations contextuelles fournies par le client.")
    llm_options: Optional[LLMOptionsData] = Field(None, description="Options spécifiques pour l'appel au LLM.")


class SourceData(BaseModel):
    name: Optional[str] = Field(None, description="Nom de la source d'information.")
    url: Optional[str] = Field(None, description="URL de la source, si applicable.")
    content_snippet: Optional[str] = Field(None, description="Extrait pertinent de la source.") # Added for RAG display


class AIResponseData(BaseModel):
    text_response: str = Field(..., description="Réponse textuelle principale de l'IA.")
    structured_data: Optional[Dict[str, Any]] = Field(None, description="Données structurées additionnelles (ex: suggestion de configuration, liste de commandes).")
    confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0, description="Score de confiance de l'IA dans sa réponse (si fourni par le LLM).")
    sources: Optional[List[SourceData]] = Field(None, description="Sources utilisées par l'IA pour générer la réponse (pour RAG).")


class AIQueryResponseDTO(BaseModel):
    conversation_id: str = Field(..., description="ID de la conversation.")
    response_id: str = Field(..., description="ID unique de cette réponse spécifique.")
    assistant_response: AIResponseData = Field(..., description="La réponse de l'assistant.")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Timestamp de la réponse.")

    class Config:
        # Ensure datetime is serialized in ISO format
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        # For Pydantic V2, use `model_config` instead of `Config`
        # from pydantic import ConfigDict
        # model_config = ConfigDict(json_encoders={datetime: lambda v: v.isoformat()})
