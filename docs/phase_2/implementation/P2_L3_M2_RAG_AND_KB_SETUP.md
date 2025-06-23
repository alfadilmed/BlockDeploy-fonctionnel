# P2-L3 M2: Implémentation Initiale de la RAG et Base de Connaissances - Suivi

**Date de Réalisation:** [Date Actuelle]

## 1. Objectifs de la Milestone M2

Conformément au plan d'implémentation `P2_L3_AI_ASSISTANT_IMPLEMENTATION.md`, les objectifs de cette milestone sont :
- Mettre en place une base de connaissances locale en utilisant FAISS.
- Structurer les documents sources (markdown de `/docs/`) pour l'indexation.
- Implémenter les fonctions d'indexation (texte vers embeddings vers FAISS).
- Implémenter la fonction de récupération de contexte (requête vers documents similaires).
- Intégrer le contexte récupéré dans le `PromptManager`.
- Connecter ce pipeline au `LLMService` (toujours mocké pour M2, mais il doit pouvoir "voir" le contexte RAG).
- Ajouter des tests pour valider le pipeline RAG.
- Obtenir une première version de l'assistant capable de répondre avec du contexte issu de la documentation BlockDeploy.

## 2. Actions Réalisées

### 2.1. Ajout des Dépendances
- **Action:** Ajout de `sentence-transformers`, `faiss-cpu`, `PyPDF2`, `unstructured`, et `markdown` au fichier `backend/requirements.txt`.
- **Statut:** Terminé.

### 2.2. Développement du `RAGProcessor` (`backend/app/services/rag_processor.py`)
- **Chargement et Prétraitement des Documents:**
    - **Action:** Implémentation de `load_and_process_documents` utilisant `unstructured` (si disponible) pour parser les fichiers Markdown du répertoire `/docs` et les diviser en chunks. Un fallback basique est prévu si `unstructured` n'est pas fonctionnel. Ajout d'une méthode `_clean_text` pour le nettoyage de base.
    - **Statut:** Terminé.
- **Génération des Embeddings:**
    - **Action:** Utilisation de `SentenceTransformer` (modèle `all-MiniLM-L6-v2` par défaut) pour convertir les chunks de texte en vecteurs d'embedding.
    - **Statut:** Terminé (intégré dans `create_and_save_index`).
- **Création/Sauvegarde et Chargement de l'Index FAISS:**
    - **Action:** Implémentation de `create_and_save_index` pour construire un index FAISS (IndexFlatL2) à partir des embeddings et le sauvegarder sur disque. Implémentation de `_load_index_and_metadata` pour charger un index et les métadonnées associées (chunks de texte et sources) depuis le disque. Les fichiers sont stockés dans `backend/app/data/`.
    - **Statut:** Terminé.
- **Recherche de Similarité:**
    - **Action:** Implémentation de `search_similar_documents` pour prendre une requête, l'embedder, et interroger l'index FAISS pour trouver les `k` chunks les plus similaires.
    - **Statut:** Terminé.

### 2.3. Script d'Indexation (`backend/scripts/index_documentation.py`)
- **Action:** Création d'un script qui utilise `RAGProcessor` pour parcourir le répertoire `docs/` (racine du projet), traiter les fichiers Markdown, et générer/sauvegarder l'index FAISS et les métadonnées.
- **Statut:** Terminé.

### 2.4. Modification du `PromptManager` (`backend/app/services/prompt_manager.py`)
- **Action:**
    - Le `PromptManager` accepte désormais une instance optionnelle de `RAGProcessor` à l'initialisation.
    - La méthode `build_prompt` appelle `rag_processor.search_similar_documents` avec la requête de l'utilisateur.
    - Le template de prompt système a été mis à jour pour inclure une section "Retrieved Documentation Context:" où les documents récupérés (formatés par `_format_retrieved_documents`) sont injectés.
    - Si RAG n'est pas disponible ou ne trouve rien, des messages appropriés sont insérés dans le prompt.
- **Statut:** Terminé.

### 2.5. Mise à Jour du Endpoint `/query` (`backend/app/api/v1/endpoints/query.py`)
- **Action:**
    - Ajout d'une fonction de dépendance `get_rag_processor_instance()` qui initialise et retourne une instance singleton du `RAGProcessor`. Elle gère le chargement de l'index au démarrage (ou au premier appel).
    - La dépendance `get_prompt_manager()` a été mise à jour pour recevoir et injecter l'instance du `RAGProcessor` dans `PromptManager`.
- **Statut:** Terminé.

### 2.6. Adaptation du `MockLLMService` (`backend/app/services/llm_service.py`)
- **Action:** Le `MockLLMService` a été modifié pour :
    - Détecter la présence de la section "Retrieved Documentation Context:" dans le prompt.
    - Logger (via `print` pour l'instant) les premiers caractères du contexte RAG s'il est présent et non vide.
    - Inclure un petit "écho" du contexte RAG vu dans sa réponse textuelle simulée, pour faciliter la vérification du pipeline.
- **Statut:** Terminé.

### 2.7. Écriture des Tests Unitaires et d'Intégration
- **Tests pour `rag_processor.py`:**
    - **Action:** Création de `backend/tests/unit/test_rag_processor.py`. Tests couvrant l'initialisation, le chargement/traitement de documents de test, la création/sauvegarde/chargement de l'index, et la recherche de similarité. Utilisation de `tmp_path_factory` pour des répertoires de test isolés.
    - **Statut:** Terminé.
- **Tests pour l'intégration RAG dans `PromptManager`:**
    - **Action:** Création de `backend/tests/unit/test_prompt_manager_with_rag.py`. Tests avec un `RAGProcessor` mocké pour vérifier la correcte injection du contexte RAG dans les prompts, y compris les cas où aucun document n'est trouvé ou si RAG n'est pas disponible.
    - **Statut:** Terminé.
- **Tests pour le endpoint `/query` avec RAG:**
    - **Action:** Création de `backend/tests/integration/test_query_endpoint_with_rag.py`. Tests d'intégration qui utilisent un `RAGProcessor` réel avec un index FAISS de test dédié et un `LLMService` mocké. Vérifie que le contexte RAG est bien récupéré et inclus dans le prompt final.
    - **Statut:** Terminé.

## 3. Choix Techniques et Justifications

- **Modèle d'Embedding:** `all-MiniLM-L6-v2` (de `sentence-transformers`) a été choisi comme modèle par défaut car il offre un bon compromis entre performance et taille, et est bien adapté pour la recherche sémantique sur CPU. Il produit des embeddings normalisés, ce qui est utile pour les scores de similarité.
- **Stratégie de Chunking:**
    - Utilisation de la bibliothèque `unstructured` pour le partitionnement des fichiers Markdown. Elle permet une segmentation plus sémantique que le simple découpage par taille fixe (ex: respect des titres, listes).
    - En cas d'indisponibilité d'`unstructured`, un fallback vers un chunking basique par taille fixe avec chevauchement est implémenté dans `RAGProcessor` pour assurer la fonctionnalité.
    - La taille des chunks est gérée par `unstructured` ou fixée à ~1000 caractères pour le fallback, ce qui est une taille courante pour les modèles d'embedding.
- **Stockage de l'Index FAISS:** L'index FAISS (`IndexFlatL2`) et les métadonnées des chunks (texte original et source) sont stockés localement dans le répertoire `backend/app/data/`. `IndexFlatL2` est simple et efficace pour un nombre modéré de vecteurs et ne nécessite pas d'étape d'entraînement.
- **Gestion des Dépendances (RAGProcessor dans l'API):**
    - Le `RAGProcessor` est initialisé comme un singleton via une fonction de dépendance FastAPI (`get_rag_processor_instance`). Cela assure que l'index (potentiellement lourd) n'est chargé qu'une seule fois.
    - Ce singleton est ensuite injecté dans le `PromptManager` via une autre dépendance.
- **Source de Documents pour la KB:** Pour cette M2, les documents Markdown existants dans le répertoire `/docs` du projet sont utilisés comme source de connaissance. Le script `scripts/index_documentation.py` est responsable de leur traitement.

## 4. Points en Attente / Pour Prochaines Milestones

- **Optimisation de la Pertinence RAG:** Le chunking et la recherche peuvent être affinés (ex: re-ranking, gestion des métadonnées plus fine, test d'autres modèles d'embedding).
- **Mise à Jour de la KB:** Actuellement, l'index est statique. Un mécanisme de mise à jour de l'index (automatique ou manuel) sera nécessaire lorsque la documentation évolue.
- **Feedback Utilisateur sur la Pertinence RAG:** Intégrer un moyen pour les utilisateurs de signaler si les sources utilisées étaient pertinentes.
- **Interface pour Visualiser les Sources:** Le frontend (M3) devra afficher les sources utilisées par l'IA, comme prévu dans le DTO `AIQueryResponseDTO`.
- **Passage à un LLM Réel:** Le `LLMService` est toujours mocké. La prochaine étape majeure sera de l'intégrer avec un vrai LLM (OpenAI/Gemini) pour évaluer la qualité des réponses de bout en bout.
- **Gestion d'Erreurs Plus Fine pour RAG:** Améliorer la robustesse du `RAGProcessor` face à des formats de documents inattendus ou des erreurs d'indexation/recherche.

## 5. Conclusion de la Milestone M2

La Milestone M2 est considérée comme **achevée**. Le pipeline RAG initial est fonctionnel :
- Les documents Markdown peuvent être chargés, traités et indexés dans FAISS.
- Le `PromptManager` récupère dynamiquement du contexte pertinent à partir de cet index en fonction de la requête utilisateur.
- Ce contexte est injecté dans le prompt envoyé au `LLMService`.
- Le `MockLLMService` a été adapté pour confirmer la réception de ce contexte.
- Des tests unitaires et d'intégration valident le fonctionnement de chaque composant et du pipeline global.

L'assistant IA est maintenant théoriquement capable (avec un LLM réel) de fournir des réponses basées sur la documentation de BlockDeploy. Les prochaines étapes se concentreront sur l'intégration frontend (M3) et la connexion à un LLM réel.
