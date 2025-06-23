# Devlog - Lot P2-L3 : Implémentation de l'AI Config Assistant

Ce journal documente les activités, décisions, et progrès concernant l'implémentation de l'AI Config Assistant pour BlockDeploy (Lot P2-L3).

## [Date Actuelle - YYYY-MM-DD] - Initialisation du Lot P2-L3 et Planification

- **Activité:** Création du document de planification `docs/phase_2/P2_L3_AI_ASSISTANT_IMPLEMENTATION.md`.
    - Définition de l'objectif général du lot d'implémentation.
    - Proposition d'une approche de développement itératif.
    - Ébauche des milestones d'implémentation (M1 à M6) :
        - M1: Initialisation du Backend et MVP du LLMService
        - M2: Implémentation Initiale de la RAG et Base de Connaissances
        - M3: Développement du Frontend Initial (Panneau de Chat)
        - M4: Itération sur les Fonctionnalités Clés et Intégration Avancée
        - M5: Tests Complets, Sécurité et Optimisation
        - M6: Préparation au Déploiement et Documentation Utilisateur
    - Confirmation des technologies envisagées.
    - Principes de gestion de projet et de suivi.
- **Activité:** Création de ce fichier `devlog/LOT_P2_L3_LOG.md`.
- **Décision:** Le document de planification `P2_L3_AI_ASSISTANT_IMPLEMENTATION.md` servira de feuille de route principale pour ce lot. Il sera présenté pour validation avant le démarrage effectif de la M1.
- **Prochaine Étape:** Présenter le plan d'implémentation pour validation. Après validation, démarrer la Milestone M1.

## [2024-08-02] - Démarrage Milestone M1 (Lot P2-L3): Initialisation du Backend et MVP du LLMService

- **Plan d'Implémentation P2-L3 Validé.**
- **Activité:** Création de la structure de base du projet backend FastAPI dans `backend/`.
    - Initialisation de `requirements.txt`, `Dockerfile` de base, `.env.example`.
    - Création de l'arborescence `app/` (main, core, api, services) et `tests/` (conftest, unit).
- **Activité:** Définition des DTOs (Data Transfer Objects) dans `backend/app/api/v1/schemas/`.
    - `AIQueryRequestDTO`, `AIQueryResponseDTO`, `ErrorDTO` et leurs sous-modèles (`ContextData`, `LLMOptionsData`, etc.) implémentés avec Pydantic.
- **Activité:** Implémentation d'une version mockée du `LLMService` dans `backend/app/services/llm_service.py`.
    - `BaseLLMService` (ABC), `MockLLMService` fonctionnel, placeholders pour services OpenAI/Gemini.
    - Factory `get_llm_service()` configurée pour retourner `MockLLMService` pour M1.
- **Activité:** Création du `PromptManager` de base dans `backend/app/services/prompt_manager.py`.
    - Construit un prompt simple à partir de `AIQueryRequestDTO`, sans RAG pour l'instant.
- **Activité:** Implémentation du endpoint `/api/v1/ai-assistant/query` dans `backend/app/api/v1/endpoints/query.py`.
    - Utilise `PromptManager` et `LLMService` (mocké), retourne une réponse structurée, gère les erreurs de base.
- **Activité:** Écriture des tests unitaires initiaux dans `backend/tests/unit/`.
    - `test_llm_service.py`: Valide le `MockLLMService` et la factory.
    - `test_query_endpoint.py`: Valide le endpoint `/query` (succès, erreurs).
- **Activité:** Création du document de suivi `docs/phase_2/implementation/P2_L3_M1_BACKEND_INIT.md`.
    - Documente les actions réalisées, les choix techniques et les conclusions pour M1.
- **Statut M1:** **Terminée.** Les fondations backend sont posées.
- **Prochaine Étape (M2):** Implémentation Initiale de la RAG et Base de Connaissances.

## [2024-08-05] - Milestone M2 (Lot P2-L3): Implémentation Initiale de la RAG et Base de Connaissances

- **Activité:** Création du document de suivi `docs/phase_2/implementation/P2_L3_M2_RAG_AND_KB_SETUP.md`.
- **Activité:** Ajout des dépendances `sentence-transformers`, `faiss-cpu`, `PyPDF2`, `unstructured`, `markdown` à `backend/requirements.txt`.
- **Activité:** Développement du module `RAGProcessor` (`backend/app/services/rag_processor.py`).
    - Chargement et prétraitement des documents Markdown (avec fallback si `unstructured` est absent).
    - Génération d'embeddings avec `all-MiniLM-L6-v2`.
    - Création, sauvegarde et chargement d'index FAISS local (`backend/app/data/`).
    - Fonction de recherche de similarité.
- **Activité:** Création du script d'indexation `backend/scripts/index_documentation.py` pour traiter le répertoire `/docs` et construire l'index FAISS.
- **Activité:** Modification du `PromptManager` pour intégrer le `RAGProcessor`.
    - Récupération de contexte pertinent basé sur la requête utilisateur.
    - Injection du contexte RAG dans le template de prompt système.
- **Activité:** Mise à jour du endpoint `/query` pour initialiser et utiliser le `RAGProcessor` via une dépendance FastAPI, et le passer au `PromptManager`.
- **Activité:** Adaptation du `MockLLMService` pour logger/afficher le contexte RAG reçu et l'inclure partiellement dans sa réponse simulée pour vérification.
- **Activité:** Écriture de tests unitaires et d'intégration :
    - `test_rag_processor.py`: Valide les fonctionnalités du `RAGProcessor`.
    - `test_prompt_manager_with_rag.py`: Valide l'intégration RAG dans `PromptManager` avec un RAGProcessor mocké.
    - `test_query_endpoint_with_rag.py`: Teste le endpoint `/query` avec un `RAGProcessor` réel (utilisant un index de test) et un `LLMService` mocké.
- **Activité:** Documentation des actions et décisions dans `docs/phase_2/implementation/P2_L3_M2_RAG_AND_KB_SETUP.md`.
- **Statut M2:** **Terminée.** Le pipeline RAG de base est fonctionnel et testé. L'assistant peut théoriquement utiliser la documentation BlockDeploy pour contextualiser ses réponses.
- **Prochaine Étape (M3):** Développement du Frontend Initial (Panneau de Chat).
