# P2-L2 M2: AI Config Assistant - Backend Design

Ce document détaille la conception du service backend pour l'assistant IA de configuration BlockDeploy, dans le cadre de la Milestone 2 (M2) du Lot P2-L2.

## 1. Objectifs du Backend

- Recevoir les requêtes des utilisateurs (questions, configurations à analyser) depuis le frontend.
- Préparer et sécuriser les prompts avant de les envoyer au Modèle de Langage Large (LLM).
- Interagir avec l'API du LLM choisi (ex: OpenAI, Google Gemini).
- Traiter les réponses du LLM pour les structurer et les adapter au contexte de BlockDeploy.
- Retourner des réponses structurées et utilisables par le frontend.
- Gérer l'historique des conversations (optionnel pour une première version, mais à anticiper).
- Assurer la sécurité, la performance et la scalabilité du service.

## 2. Architecture Générale

Le backend sera un service API RESTful. Il agira comme un intermédiaire entre le frontend de BlockDeploy et le LLM externe.

```mermaid
graph LR
    A[Frontend BlockDeploy] -- HTTPS Request --> B(API Gateway BlockDeploy);
    B -- Route --> C{AI Assistant Backend Service};
    C -- Prompt (API Call) --> D[LLM API (OpenAI/Gemini)];
    D -- LLM Response --> C;
    C -- Structured Response --> B;
    B -- HTTPS Response --> A;
    C -.-> E(Base de Données / Cache);
```

- **AI Assistant Backend Service:** Le composant principal à développer.
- **LLM API:** Un service tiers (OpenAI, Gemini, etc.).
- **Base de Données / Cache (Optionnel M2, pour M4/M5):** Pour stocker l'historique des conversations, les configurations utilisateurs, les prompts affinés, ou mettre en cache des réponses fréquentes.

## 3. Endpoints API (REST)

Préfixe de l'API: `/api/v1/ai-assistant`

### 3.1. `POST /query`

- **Description:** Endpoint principal pour soumettre une question ou une demande à l'assistant IA.
- **Requête (Body):** `AIQueryRequestDTO`
- **Réponse (Succès - 200 OK):** `AIQueryResponseDTO`
- **Réponse (Erreur - 400, 422, 500):** `ErrorDTO`

### 3.2. `GET /history/{conversation_id}` (Optionnel - Post M2)

- **Description:** Récupérer l'historique d'une conversation spécifique.
- **Paramètre (Path):** `conversation_id` (string)
- **Réponse (Succès - 200 OK):** `ConversationHistoryDTO`
- **Réponse (Erreur - 404, 500):** `ErrorDTO`

### 3.3. `GET /capabilities` (Optionnel)

- **Description:** Permet au frontend de découvrir les capacités de l'assistant (ex: modèles LLM supportés, fonctionnalités spécifiques activées).
- **Réponse (Succès - 200 OK):** `AICapabilitiesDTO`

## 4. Schémas de Données (DTOs - Data Transfer Objects)

Utilisation de la notation OpenAPI/JSON Schema pour la clarté.

### 4.1. `AIQueryRequestDTO`

```json
{
  "type": "object",
  "properties": {
    "conversation_id": {
      "type": "string",
      "description": "ID unique pour suivre une conversation (optionnel, peut être généré par le backend si non fourni)."
    },
    "user_id": {
      "type": "string",
      "description": "ID de l'utilisateur authentifié (pour personnalisation, logs, etc.)."
    },
    "query_text": {
      "type": "string",
      "description": "La question ou la demande textuelle de l'utilisateur."
    },
    "context": {
      "type": "object",
      "description": "Informations contextuelles fournies par le client.",
      "properties": {
        "current_configuration": {
          "type": "object",
          "description": "Configuration actuelle de l'utilisateur (ex: YAML, JSON) si pertinente pour la requête."
        },
        "deployment_id": {
          "type": "string",
          "description": "ID du déploiement concerné, si applicable."
        },
        "ui_location": {
          "type": "string",
          "description": "Où l'utilisateur se trouve dans l'interface BlockDeploy."
        }
      }
    },
    "llm_options": {
      "type": "object",
      "description": "Options spécifiques pour l'appel au LLM (température, max_tokens, etc.). Pourrait être limité ou contrôlé par le backend.",
      "properties": {
        "model": {
          "type": "string",
          "description": "Modèle LLM à utiliser (si plusieurs sont disponibles)."
        }
      }
    }
  },
  "required": ["user_id", "query_text"]
}
```

### 4.2. `AIQueryResponseDTO`

```json
{
  "type": "object",
  "properties": {
    "conversation_id": {
      "type": "string",
      "description": "ID de la conversation."
    },
    "response_id": {
      "type": "string",
      "description": "ID unique de cette réponse spécifique."
    },
    "assistant_response": {
      "type": "object",
      "properties": {
        "text_response": {
          "type": "string",
          "description": "Réponse textuelle principale de l'IA."
        },
        "structured_data": {
          "type": "object",
          "description": "Données structurées additionnelles (ex: suggestion de configuration, liste de commandes)."
        },
        "confidence_score": {
          "type": "number",
          "format": "float",
          "description": "Score de confiance de l'IA dans sa réponse (si fourni par le LLM)."
        },
        "sources": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "url": {"type": "string"}
            }
          },
          "description": "Sources utilisées par l'IA pour générer la réponse (pour RAG)."
        }
      },
      "required": ["text_response"]
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["conversation_id", "response_id", "assistant_response", "timestamp"]
}
```

### 4.3. `ErrorDTO`

```json
{
  "type": "object",
  "properties": {
    "error_code": {
      "type": "string",
      "description": "Code d'erreur interne."
    },
    "message": {
      "type": "string",
      "description": "Message d'erreur lisible par un humain."
    },
    "details": {
      "type": "object",
      "description": "Détails supplémentaires sur l'erreur."
    }
  },
  "required": ["error_code", "message"]
}
```

## 5. Structure du Service (Exemple avec Python/FastAPI)

```
ai_assistant_service/
├── app/
│   ├── __init__.py
│   ├── main.py             # Point d'entrée de l'application FastAPI, définition des routes
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           └── query.py        # Logique pour l'endpoint /query
│   │       └── schemas/
│   │           ├── __init__.py
│   │           ├── request_dto.py
│   │           └── response_dto.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py       # Gestion de la configuration (clés API LLM, etc.)
│   │   └── security.py     # Fonctions de sécurité (validation, sanitization des prompts)
│   ├── services/
│   │   ├── __init__.py
│   │   └── llm_service.py  # Abstraction pour interagir avec le LLM (OpenAI, Gemini)
│   │   └── prompt_manager.py # Gestion et construction des prompts
│   └── utils/
│       ├── __init__.py
│       └── helpers.py      # Fonctions utilitaires
├── tests/
│   ├── __init__.py
│   ├── conftest.py         # Fixtures Pytest
│   ├── unit/               # Tests unitaires
│   │   └── test_llm_service.py
│   │   └── test_query_endpoint.py
│   └── integration/        # Tests d'intégration (optionnel M2)
├── Dockerfile
├── requirements.txt
└── README.md
```

### 5.1. `main.py`

- Initialise l'application FastAPI.
- Inclut les routeurs des endpoints.
- Gère la configuration globale.

### 5.2. `api/v1/endpoints/query.py`

- Définit le endpoint `POST /query`.
- Valide la requête `AIQueryRequestDTO`.
- Appelle `PromptManager` pour construire le prompt final.
- Appelle `LLMService` pour obtenir la réponse du LLM.
- Formate la réponse en `AIQueryResponseDTO`.
- Gère les exceptions et retourne les `ErrorDTO` appropriés.

### 5.3. `core/config.py`

- Charge les configurations depuis les variables d'environnement (API keys, modèle LLM par défaut, etc.).
- Utilise Pydantic pour la validation de la configuration.

### 5.4. `core/security.py`

- **Sanitization des Prompts:** Fonctions pour nettoyer et valider les entrées utilisateurs avant de les inclure dans les prompts afin de prévenir les injections de prompt.
- **Gestion des Secrets:** S'assurer que les clés API et autres informations sensibles sont gérées de manière sécurisée.
- **Validation des Données:** Utilisation rigoureuse des DTOs pour valider toutes les entrées et sorties.

### 5.5. `services/llm_service.py`

- Interface abstraite ou classe de base pour interagir avec différents LLMs.
- Implémentations spécifiques pour OpenAI, Gemini, etc.
    - `OpenAILLMService`, `GeminiLLMService`.
- Gère la logique d'appel à l'API du LLM (authentification, re-essais, gestion des erreurs spécifiques au LLM).
- Cache les réponses du LLM si nécessaire (pourrait être une fonctionnalité future).

### 5.6. `services/prompt_manager.py`

- Responsable de la construction des prompts finaux envoyés au LLM.
- Combine le `query_text` de l'utilisateur, le `context`, et un `system_prompt` de base.
- Peut inclure une logique pour sélectionner différents `system_prompts` en fonction du `ui_location` ou du type de requête.
- Pourra intégrer la logique de RAG (Retrieval Augmented Generation) dans les étapes futures (M4).
- **System Prompt de Base (Exemple):**
    ```
    Tu es un assistant expert pour la plateforme de déploiement BlockDeploy.
    Ton rôle est d'aider les utilisateurs à configurer leurs applications, optimiser leurs déploiements,
    et résoudre les problèmes de configuration.
    Réponds de manière claire, concise et utile.
    Si tu as besoin de plus d'informations, n'hésite pas à poser des questions.
    Contexte utilisateur fourni : {user_context}
    ```

## 6. Intégration avec le LLM (OpenAI/Gemini)

- Utilisation des SDKs officiels (ex: `openai` python package, `google-generativeai`).
- Les clés API seront stockées de manière sécurisée via `core/config.py` et les variables d'environnement.
- **Gestion des erreurs LLM:** Le `LLMService` doit intercepter les erreurs spécifiques de l'API du LLM (quotas dépassés, erreurs de modèle, etc.) et les traduire en `ErrorDTO` compréhensibles pour le frontend ou initier des re-essais si pertinent.

### 6.1. Sécurité des Prompts et Confidentialité

- **Ne pas inclure d'informations sensibles inutiles dans les prompts.** Le `PromptManager` doit filtrer/anonymiser les données du `context` si nécessaire.
- **Informer l'utilisateur:** Clarifier quelles données sont envoyées au LLM.
- **Revue des prompts:** Les system prompts et les stratégies de construction de prompt doivent être revus pour éviter les fuites d'informations ou les comportements indésirables.
- **Pas de stockage de données sensibles brutes:** Si l'historique est implémenté, s'assurer de la conformité RGPD et des politiques de sécurité.

## 7. Tests Unitaires et Mocks

- **Framework de Test:** Pytest.
- **Mocks:** Utiliser `unittest.mock` ou `pytest-mock` pour simuler les appels externes, en particulier à l'API du LLM.

### 7.1. Tests pour `llm_service.py`

- `test_llm_api_call_success`: Simuler un appel réussi à l'API LLM et vérifier que la réponse est correctement traitée.
- `test_llm_api_call_failure`: Simuler différentes erreurs de l'API LLM (4xx, 5xx) et vérifier qu'elles sont gérées.
- `test_prompt_formatting`: Vérifier que les prompts sont correctement formatés avant l'envoi.

### 7.2. Tests pour `api/v1/endpoints/query.py`

- `test_query_endpoint_success`: Envoyer une requête valide et vérifier que la réponse 200 OK est correcte, en mockant le `LLMService`.
- `test_query_endpoint_invalid_request`: Envoyer des requêtes invalides (champs manquants, types incorrects) et vérifier les réponses d'erreur 400/422.
- `test_query_endpoint_llm_error`: Simuler une erreur provenant du `LLMService` et vérifier que l'endpoint la propage correctement.

### 7.3. Tests pour `core/security.py`

- `test_prompt_sanitization`: Tester la fonction de nettoyage des prompts avec différentes entrées potentiellement malveillantes.

### 7.4. Tests pour `services/prompt_manager.py`

- `test_system_prompt_selection`: Si plusieurs system prompts existent, tester la logique de sélection.
- `test_context_integration`: Vérifier que le contexte utilisateur est correctement intégré dans le prompt final.

## 8. Dépendances Clés (Python)

- `fastapi`: Framework web.
- `uvicorn`: Serveur ASGI.
- `pydantic`: Validation de données et gestion de la configuration.
- `openai` ou `google-generativeai`: SDKs pour les LLMs.
- `httpx`: Client HTTP asynchrone (utilisé par les SDKs LLM ou pour d'autres appels).
- `pytest`, `pytest-mock`, `httpx` (pour les tests).

## 9. Prochaines Étapes (Post-M2)

- **M3 (Frontend):** Intégration de ce backend avec l'interface utilisateur.
- **M4 (Affinage IA):** Développement de prompts plus sophistiqués, potentiellement introduction de RAG avec une base de connaissances BlockDeploy.
- **M5 (Tests Utilisateurs):** Collecte de retours et itérations.
- **Monitoring et Logging:** Mettre en place un logging structuré et un monitoring des performances et des erreurs du service backend.
- **Caching:** Stratégies de cache pour les réponses LLM afin de réduire la latence et les coûts.

Ce document servira de guide pour le développement du backend de l'assistant IA. Il pourra être mis à jour au fur et à mesure des découvertes et des décisions prises pendant l'implémentation.
