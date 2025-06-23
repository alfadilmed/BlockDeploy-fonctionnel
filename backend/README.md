# AI Assistant Backend

Ce service backend fournit l'API pour l'Assistant IA de BlockDeploy. Il utilise FastAPI et intègre un pipeline RAG (Retrieval Augmented Generation) pour fournir des réponses contextuelles basées sur la documentation.

## Table des Matières
1. [Prérequis](#prérequis)
2. [Configuration](#configuration)
3. [Installation des Dépendances](#installation-des-dépendances)
4. [Construction de l'Index RAG](#construction-de-lindex-rag)
5. [Exécution des Tests](#exécution-des-tests)
6. [Lancement du Service](#lancement-du-service)
   - [Localement avec Uvicorn](#localement-avec-uvicorn)
   - [Avec Docker Compose (Recommandé pour le développement)](#avec-docker-compose-recommandé-pour-le-développement)
7. [Structure du Projet](#structure-du-projet)
8. [Endpoints API](#endpoints-api)

## 1. Prérequis

- Python 3.10+
- Pip (gestionnaire de paquets Python)
- Docker et Docker Compose (optionnel, mais recommandé pour un lancement facile)
- Accès au répertoire `docs/` à la racine du projet (pour la construction de l'index RAG).

## 2. Configuration

Le service est configuré via des variables d'environnement. Un fichier d'exemple `.env.example` est fourni dans ce répertoire (`backend/`).

1.  **Copiez `.env.example` vers `.env`** :
    ```bash
    cp .env.example .env
    ```
2.  **Modifiez `.env`** avec vos configurations :
    - `LLM_PROVIDER`: Peut être `mock`, `openai`, ou `gemini`. Pour l'instant, seul `mock` est pleinement fonctionnel.
    - `LLM_API_KEY`: Votre clé API si vous utilisez `openai` ou `gemini`. Non nécessaire pour `mock`.
    - `LLM_DEFAULT_MODEL`: Le modèle LLM par défaut (ex: `gpt-3.5-turbo`, `gemini-pro`, ou `mock-model`).
    - `FAISS_INDEX_PATH`: Nom du fichier pour l'index FAISS (ex: `faiss_index.bin`). Relatif à `backend/app/data/`.
    - `DOC_METADATA_PATH`: Nom du fichier pour les métadonnées des documents (ex: `doc_metadata.json`). Relatif à `backend/app/data/`.
    - `EMBEDDING_MODEL_NAME`: Nom du modèle SentenceTransformer (ex: `all-MiniLM-L6-v2`).
    - `DEFAULT_RATE_LIMIT`: Limite de taux pour l'API (ex: `10/minute`).

Le répertoire `backend/app/data/` sera créé automatiquement s'il n'existe pas et stockera l'index FAISS et les métadonnées.

## 3. Installation des Dépendances

Naviguez vers le répertoire `backend/` et installez les dépendances Python :

```bash
cd backend
pip install -r requirements.txt
```

## 4. Construction de l'Index RAG

L'assistant IA utilise un index FAISS construit à partir de la documentation du projet (située dans le répertoire `docs/` à la racine du projet global). Pour construire ou mettre à jour cet index :

1.  Assurez-vous d'être dans le répertoire `backend/`.
2.  Exécutez le script d'indexation :
    ```bash
    python scripts/index_documentation.py
    ```
    Cela créera (ou mettra à jour) les fichiers d'index et de métadonnées dans `backend/app/data/`. Vous devez exécuter ce script chaque fois que la documentation source dans `/docs/` est modifiée de manière significative.

## 5. Exécution des Tests

Pour exécuter les tests unitaires et d'intégration :

1.  Assurez-vous d'être dans le répertoire `backend/`.
2.  Construisez l'index RAG de test si ce n'est pas déjà fait (certains tests d'intégration en dépendent, mais les fixtures de test tentent de créer des index isolés).
3.  Exécutez Pytest :
    ```bash
    pytest
    ```
    Pour voir la couverture des tests :
    ```bash
    pytest --cov=app
    ```

## 6. Lancement du Service

### Localement avec Uvicorn

1.  Assurez-vous que les dépendances sont installées et que l'index RAG est construit.
2.  Depuis le répertoire `backend/`, lancez Uvicorn :
    ```bash
    uvicorn app.main:app --reload
    ```
    L'option `--reload` est utile pour le développement car elle redémarre le serveur lors des modifications de code.
    Le service sera accessible à `http://localhost:8000`. La documentation OpenAPI (Swagger UI) sera disponible à `http://localhost:8000/api/v1/openapi.json` et l'interface Swagger à `http://localhost:8000/docs`. (Note: l'URL openapi est `/api/v1/openapi.json`, donc Swagger UI est à `/api/v1/docs` si `main.py` est configuré avec `openapi_url=f"{settings.API_V1_STR}/openapi.json"` et que l'app FastAPI n'a pas de `root_path` spécifique. Si `/docs` ne marche pas, essayez `/api/v1/docs`).
    Correction: L'OpenAPI URL est `/api/v1/openapi.json`. Par défaut, FastAPI met `/docs` et `/redoc` à la racine de l'application.

### Avec Docker Compose (Recommandé pour le développement)

Un fichier `docker-compose.yml` est fourni à la racine du projet.

1.  **Assurez-vous que Docker et Docker Compose sont installés.**
2.  **Créez votre fichier `.env`** dans le répertoire `backend/` comme décrit dans la section [Configuration](#configuration).
3.  **(Optionnel mais recommandé pour la première fois ou après des changements majeurs dans `docs/`) Construisez l'index RAG localement** :
    ```bash
    # Depuis la racine du projet
    python backend/scripts/index_documentation.py
    ```
    Le `docker-compose.yml` est configuré pour monter le répertoire `backend/app/data` dans le conteneur, donc l'index construit localement sera utilisé.
4.  **Depuis la racine du projet**, lancez Docker Compose :
    ```bash
    docker-compose up --build
    ```
    Pour lancer en mode détaché :
    ```bash
    docker-compose up --build -d
    ```
5.  Le service sera accessible à `http://localhost:8000`.

Pour arrêter les services :
```bash
docker-compose down
```

Si vous avez besoin de reconstruire l'image Docker (par exemple, après avoir modifié `requirements.txt` ou `Dockerfile`) :
```bash
docker-compose build ai_assistant_backend
```

## 7. Structure du Projet (`backend/`)

-   `app/`: Code source de l'application FastAPI.
    -   `main.py`: Point d'entrée de l'application.
    -   `api/`: Modules liés à l'API (routes, schémas).
        -   `v1/`: Version 1 de l'API.
            -   `endpoints/`: Logique des endpoints (ex: `query.py`).
            -   `schemas/`: Modèles Pydantic (DTOs).
            -   `routers.py`: Agrégation des routeurs.
    -   `core/`: Configuration (`config.py`), etc.
    -   `services/`: Logique métier (ex: `llm_service.py`, `prompt_manager.py`, `rag_processor.py`).
    -   `data/`: (Créé par `RAGProcessor` ou le script d'indexation) Stocke l'index FAISS et les métadonnées. **Ce répertoire doit être dans `.gitignore` s'il contient des données volumineuses ou spécifiques à l'environnement.** (Note: pour ce projet, il est petit et peut être versionné s'il est générique).
-   `scripts/`: Scripts utilitaires (ex: `index_documentation.py`).
-   `tests/`: Tests unitaires et d'intégration.
-   `.env.example`: Exemple de fichier de configuration d'environnement.
-   `Dockerfile`: Instructions pour construire l'image Docker du service.
-   `requirements.txt`: Dépendances Python.
-   `README.md`: Ce fichier.

## 8. Endpoints API

Consultez la documentation OpenAPI (Swagger UI) générée automatiquement par FastAPI lorsque le service est en cours d'exécution. Typiquement à l'adresse : `http://localhost:8000/docs`.

L'endpoint principal est :
-   `POST /api/v1/ai-assistant/query`: Soumet une requête à l'assistant IA.
    -   **Request Body**: `AIQueryRequestDTO`
    -   **Response Body**: `AIQueryResponseDTO` ou `ErrorDTO`

Reportez-vous aux schémas (`backend/app/api/v1/schemas/`) pour les détails des DTOs.
```
