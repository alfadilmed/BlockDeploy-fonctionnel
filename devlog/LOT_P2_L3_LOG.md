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

## [2024-08-06] - Milestone M3 (Lot P2-L3): Développement Frontend Initial (Panneau de Chat)

- **Activité:** Création du document de suivi `docs/phase_2/implementation/P2_L3_M3_CHAT_FRONTEND.md`.
- **Activité:** Mise en place de la structure de base pour les composants frontend de l'assistant IA (React/TypeScript) dans `frontend/src/features/aiAssistant/`.
    - Création des placeholders pour les composants `AssistantChatPanel.tsx`, `MessageList.tsx`, `MessageInput.tsx`.
    - Création du service `aiAssistantService.ts` pour les appels API.
    - Création du hook `useChatState.ts` pour la gestion de l'état du chat et la persistance `localStorage`.
    - Création d'un placeholder pour un store Zustand (`store/chatStore.ts`), bien que `useChatState` soit utilisé pour M3.
- **Activité:** Développement du composant `AssistantChatPanel.tsx` avec UI de base (panneau flottant/dockable, en-tête, zones de messages et de saisie).
- **Activité:** Développement du composant `MessageList.tsx` pour afficher les messages (utilisateur, assistant, système) avec des styles distincts.
- **Activité:** Développement du composant `MessageInput.tsx` pour la saisie de texte et le bouton d'envoi, gérant l'état de chargement.
- **Activité:** Connexion du `AssistantChatPanel` au service API via `useChatState` pour envoyer des messages et recevoir des réponses (du MockLLM backend).
- **Activité:** Gestion visuelle des états UI (chargement, erreurs, état initial, affichage des réponses texte).
- **Activité:** Écriture de tests unitaires initiaux pour les composants React (`MessageList`, `MessageInput`, `AssistantChatPanel`), le hook `useChatState`, et le service `aiAssistantService`.
- **Activité:** Documentation des actions, choix d'implémentation et structure dans `docs/phase_2/implementation/P2_L3_M3_CHAT_FRONTEND.md`.
- **Statut M3:** **Terminée.** Une première version fonctionnelle de l'interface du panneau de chat est en place et testée unitairement.
- **Prochaine Étape (M4):** Itération sur les Fonctionnalités Clés et Intégration Avancée (connexion LLM réel, affinage RAG, fonctionnalités spécifiques).

## [2024-08-07] - Milestone M4 (Lot P2-L3): Itération sur les Fonctionnalités Clés et Aide Contextuelle

- **Activité:** Création du document de suivi `docs/phase_2/implementation/P2_L3_M4_CONTEXTUAL_ASSISTANT.md`.
- **Activité:** Amélioration de la gestion d'erreurs et feedbacks UI (Frontend) :
    - Styles des messages d'erreur système améliorés dans `MessageList.tsx`.
    - Ajout de l'état `isAssistantTyping` dans `useChatState` et affichage "Assistant is typing..." dans `AssistantChatPanel`.
    - `MessageList.tsx` et `useChatState` adaptés pour afficher les sources RAG sous les messages de l'assistant.
- **Activité:** Affinage du pipeline RAG pour cas d'usage ciblés (Backend & Contenu) :
    - Création de documents de connaissance spécifiques (`docs/knowledge_base/erc20_token_config.md`, `docs/knowledge_base/deployment_parameters.md`).
    - (Conceptuellement) Ré-indexation de la documentation.
- **Activité:** Mise à jour des Prompts (Backend) :
    - `PromptManager` modifié pour inclure `{task_specific_instructions}` et pour utiliser `ui_location` afin d'affiner la recherche RAG et les instructions LLM.
- **Activité:** Implémentation de l'aide contextuelle (Frontend & Backend) :
    - Création du composant `MockConfigPage.tsx` avec boutons d'aide contextuelle.
    - Ajout de la fonction `sendContextualQuery` à `useChatState` pour gérer les requêtes contextuelles.
    - Le backend (`PromptManager`) utilise le contexte UI enrichi.
- **Activité:** Ajout et adaptation des tests (Frontend & Backend) :
    - Tests pour `sendContextualQuery` dans `useChatState.test.ts`.
    - Tests pour `MockConfigPage.test.tsx`.
    - Adaptation des tests de `test_prompt_manager_with_rag.py` pour les nouvelles logiques de prompt.
- **Activité:** Documentation des actions, choix et conclusions dans `docs/phase_2/implementation/P2_L3_M4_CONTEXTUAL_ASSISTANT.md`.
- **Statut M4:** **Terminée.** L'assistant est plus intelligent, avec des feedbacks améliorés et une première version de l'aide contextuelle.
- **Prochaine Étape (M5):** Tests Complets, Sécurité et Optimisation (incluant le passage à un LLM réel).

## [2024-08-08] - Milestone M5 (Lot P2-L3): Tests Complets, Sécurité et Optimisation

- **Activité:** Création du document de suivi `docs/phase_2/implementation/P2_L3_M5_TESTS_AND_SECURITY.md`.
- **Activité:** Exécution (simulée) des tests manuels et exploratoires basés sur `P2_L2_M5_AI_ASSISTANT_TEST_PLAN.md`. Identification de cas non couverts pour le futur.
- **Activité:** Tests et Protections contre le Prompt Injection (Backend) :
    - Renforcement du system prompt dans `PromptManager` avec des instructions de sécurité plus robustes.
    - Création de tests unitaires (`test_prompt_manager_security.py`) pour vérifier la construction des prompts sécurisés.
- **Activité:** Optimisations des Performances du Backend :
    - Ajout de `slowapi` et configuration du rate limiting (10 req/min/IP par défaut) sur le endpoint `/query`.
    - Analyse de la pertinence du cache d'embeddings de requêtes (reporté pour M5).
- **Activité:** Tests de Performance et Cas Limites Supplémentaires :
    - Ajout de tests unitaires dans `test_rag_processor.py` pour les erreurs de chargement/corruption d'index RAG.
    - Ajout d'un test d'intégration de performance basique pour le flux RAG dans `test_query_endpoint_with_rag.py`.
- **Activité:** Implémentation d'une Métrique de Satisfaction Utilisateur (Frontend) :
    - Ajout d'icônes 👍/👎 dans `MessageList.tsx`.
    - Logique dans `useChatState.ts` pour enregistrer le feedback (console.log et localStorage pour M5).
    - Tests unitaires pour la fonctionnalité de feedback.
- **Activité:** Documentation des tests effectués, mesures de sécurité, optimisations et conclusions dans `docs/phase_2/implementation/P2_L3_M5_TESTS_AND_SECURITY.md`.
- **Statut M5:** **Terminée.** L'assistant a été testé plus en profondeur, des mesures de sécurité initiales et des optimisations ont été appliquées. Une fonctionnalité de feedback utilisateur a été ajoutée.
- **Prochaine Étape (M6):** Préparation au Déploiement et Documentation Utilisateur (et connexion à un LLM réel).
