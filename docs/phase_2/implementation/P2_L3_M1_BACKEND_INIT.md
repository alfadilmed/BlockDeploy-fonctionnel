# P2-L3 M1: Initialisation du Backend et MVP du LLMService - Suivi

**Date de Réalisation:** [Date Actuelle]

## 1. Objectifs de la Milestone M1

Tel que défini dans le plan d'implémentation `P2_L3_AI_ASSISTANT_IMPLEMENTATION.md`, les objectifs de cette milestone étaient :
- Mettre en place la structure de base du service backend (FastAPI).
- Implémenter une première version du `LLMService` capable de communiquer avec un LLM (mocké pour M1).
- Développer le endpoint `/query` de base sans RAG.
- Mettre en place les premiers tests unitaires pour le backend.
- Valider les fondations techniques pour les prochaines étapes d'intégration.

## 2. Actions Réalisées

### 2.1. Structure du Projet Backend (FastAPI)
- Un nouveau répertoire `backend/` a été créé à la racine du projet.
- La structure de base d'un projet FastAPI a été mise en place, suivant les conventions :
    - `backend/app/`: Contient le code source de l'application.
        - `main.py`: Point d'entrée de l'application FastAPI.
        - `core/`: Pour la configuration (`config.py` utilisant Pydantic-settings et python-dotenv).
        - `api/v1/`: Pour la version 1 de l'API.
            - `routers.py`: Agrège les routeurs d'endpoints.
            - `endpoints/`: Contient la logique des endpoints (ex: `query.py`).
            - `schemas/`: Contient les modèles Pydantic pour la validation des données (DTOs).
        - `services/`: Pour la logique métier (ex: `llm_service.py`, `prompt_manager.py`).
    - `backend/tests/`: Contient les tests.
        - `conftest.py`: Fixtures Pytest (client de test FastAPI).
        - `unit/`: Pour les tests unitaires.
    - `backend/requirements.txt`: Liste les dépendances Python (FastAPI, Uvicorn, Pydantic, Pytest, etc.).
    - `backend/Dockerfile`: Fichier Docker de base pour conteneuriser l'application.
    - `backend/.env.example`: Fichier d'exemple pour les variables d'environnement.

### 2.2. Définition des DTOs (Data Transfer Objects)
- Les DTOs pour les requêtes et réponses ont été créés dans `backend/app/api/v1/schemas/` en s'appuyant sur le document de conception `docs/phase_2/backend/P2_L2_M2_AI_BACKEND_DESIGN.md`.
    - `query_dtos.py`: Contient `AIQueryRequestDTO`, `AIQueryResponseDTO`, et leurs sous-modèles (`ContextData`, `LLMOptionsData`, `AIResponseData`, `SourceData`).
        - `ContextData` a été enrichi avec `conversation_history` comme prévu dans la conception frontend M4 de P2-L2.
    - `error_dtos.py`: Contient le `ErrorDTO` générique.
- Ces DTOs utilisent Pydantic pour la validation automatique des données par FastAPI.

### 2.3. Implémentation du `LLMService` (Mocké)
- Un `LLMService` a été implémenté dans `backend/app/services/llm_service.py`.
- Il comprend :
    - Une classe de base abstraite `BaseLLMService` définissant l'interface.
    - Une implémentation `MockLLMService` qui simule des réponses sans appeler un LLM réel. Elle peut retourner des réponses variées (texte simple, code, réponse longue) et simuler des erreurs.
    - Des classes placeholder `OpenAILLMService` et `GeminiLLMService` pour une future implémentation.
    - Une fonction factory `get_llm_service()` qui instancie le service approprié en fonction de la configuration `settings.LLM_PROVIDER`. Pour M1, elle est configurée pour toujours retourner `MockLLMService` afin d'assurer un comportement prédictible et sans coûts externes.

### 2.4. Création du `PromptManager` de Base
- Un `PromptManager` initial a été créé dans `backend/app/services/prompt_manager.py`.
- Sa méthode `build_prompt` prend un `AIQueryRequestDTO` et construit un prompt textuel simple.
- Il intègre le contexte utilisateur (y compris l'historique de conversation de base) et la requête de l'utilisateur dans un template de prompt système.
- Aucune logique RAG n'est incluse à ce stade (prévu pour M2).

### 2.5. Implémentation du Endpoint `/query`
- Le endpoint `POST /api/v1/ai-assistant/query` a été implémenté dans `backend/app/api/v1/endpoints/query.py`.
- Il utilise FastAPI `APIRouter`.
- Il injecte les dépendances `LLMService` et `PromptManager` via `Depends()`.
- Le flux est le suivant :
    1. Reçoit et valide `AIQueryRequestDTO`.
    2. Utilise `PromptManager` pour construire le prompt.
    3. Prépare les options pour l'appel LLM.
    4. Appelle la méthode `generate_response` du `LLMService` injecté.
    5. Construit et retourne une `AIQueryResponseDTO` structurée.
    6. Gère les exceptions `LLMServiceError` et les erreurs génériques en retournant des `ErrorDTO` appropriés avec les codes HTTP correspondants.

### 2.6. Écriture des Tests Unitaires Initiaux
- Des tests unitaires ont été ajoutés dans `backend/tests/unit/`:
    - `test_llm_service.py`: Teste le `MockLLMService` pour s'assurer qu'il génère les réponses attendues, gère les options, simule des erreurs correctement, et que la factory `get_llm_service` se comporte comme prévu (notamment le fallback vers Mock).
    - `test_query_endpoint.py`: Teste le endpoint `/query` pour :
        - Les cas de succès avec des réponses mockées.
        - La gestion des erreurs de validation (ex: champ manquant).
        - La propagation correcte des erreurs du `LLMService`.
        - La gestion des erreurs serveur inattendues.
        - Le fonctionnement du endpoint racine `/`.
- Les tests utilisent `pytest` et `FastAPI.TestClient`. Les dépendances des services dans l'endpoint sont mockées en utilisant `monkeypatch` et `unittest.mock.AsyncMock`.

## 3. Choix Techniques et Justifications

- **FastAPI:** Choisi pour sa performance, sa facilité d'utilisation, sa validation de données intégrée avec Pydantic, et sa génération automatique de documentation OpenAPI. Cela correspond aux standards modernes pour les API Python.
- **Pydantic:** Utilisé pour tous les DTOs et la configuration, offrant une validation robuste et une autocomplétion améliorée.
- **Structure du Projet:** Modulaire et inspirée des conventions FastAPI, visant à séparer les préoccupations (API, services, configuration) pour faciliter la maintenance et l'évolution.
- **MockLLMService pour M1:** Permet de développer et tester l'ensemble du flux backend sans dépendance réelle à un LLM externe, ce qui économise des coûts et assure des tests déterministes. La transition vers un LLM réel sera plus simple grâce à l'abstraction `BaseLLMService`.
- **Injection de Dépendances FastAPI:** Utilisée pour `LLMService` et `PromptManager`, facilitant le remplacement des implémentations (ex: mock vs réel) et les tests.
- **Tests Unitaires Précoces:** Intégrés dès cette première milestone pour assurer la qualité et faciliter les refactorings futurs.

## 4. Points en Attente / Pour Prochaines Milestones

- Intégration d'un LLM réel (OpenAI, Gemini) dans les services correspondants (prévu après M1, potentiellement en parallèle de M2/M3).
- Implémentation de la logique RAG dans `PromptManager` et création des services associés (M2).
- Logique de sécurité plus avancée pour les prompts (M3 du lot P2-L2, à implémenter progressivement).
- Mécanismes de logging plus robustes que les `print()` actuels.
- Authentification/autorisation réelles pour le endpoint (actuellement, `user_id` est juste un champ de la requête).

## 5. Conclusion de la Milestone M1

La Milestone M1 du Lot P2-L3 est considérée comme **achevée**. Les fondations techniques du backend sont en place, avec un endpoint fonctionnel (utilisant un LLM mocké) et des DTOs définis. Les tests unitaires initiaux valident le comportement de base. Cette base solide permettra de poursuivre avec l'implémentation de la RAG (M2) et le développement du frontend (M3).
