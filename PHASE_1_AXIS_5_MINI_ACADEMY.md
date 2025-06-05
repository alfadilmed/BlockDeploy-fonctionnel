## Axe 5: Mini-Academy & Glossaire Web3

Objectif : Fournir des ressources éducatives accessibles pour aider les utilisateurs à comprendre les concepts clés du Web3 et les fonctionnalités de BlockDeploy.

### 1. Features (Fonctionnalités Utilisateur)

*   **F5.1: Section "Guides" ou "Apprendre"**
    *   Articles courts et didactiques sur des sujets fondamentaux (Smart Contracts, ERC-20, NFT, DAO, Gas, Sécurité Wallet, etc.).
    *   Guides spécifiques à BlockDeploy (Déployer ERC-20/NFT avec BlockDeploy).
*   **F5.2: Glossaire Web3 Interactif**
    *   Liste alphabétique des termes techniques courants avec définitions claires.
    *   (Optionnel) Liens internes entre termes et articles.
*   **F5.3: Structure de Contenu Facile à Naviguer**
    *   Catégorisation des articles.
    *   Barre de recherche.
*   **F5.4: (Optionnel MVP+) Quiz ou Auto-Évaluations Simples**
    *   Questions à la fin des articles pour auto-évaluation.

### 2. Sous-Tâches Techniques (Backend & Frontend)

*   **ST2.1: Choix de la Plateforme de Gestion de Contenu (CMS) ou Solution Custom**
    *   Option 1 (CMS Headless): Strapi, Contentful, etc.
    *   Option 2 (Fichiers Markdown): Stockés dans le repo frontend (Recommandé pour MVP).
    *   Option 3 (Modèle en Base de Données).
*   **ST2.2: Développement des Composants Frontend pour l'Academy**
    *   `ArticlePageLayout`, `GlossaryPageLayout`.
    *   Composants de navigation (catégories, recherche).
    *   Intégration parseur Markdown (si Option 2).
*   **ST2.3: Création du Contenu (Rédactionnel)**
    *   Rédiger articles et définitions. Qualité, clarté, exactitude.
*   **ST2.4: (Si CMS) Configuration du CMS et Modèles de Données.**
*   **ST2.5: (Optionnel) Logique pour Quiz (Frontend).**

### 3. UI/UX (Frontend)

*   **UI3.1: Design de la Section Academy/Glossaire**
    *   Lisibilité, navigation intuitive, esthétique cohérente.
*   **UI3.2: Mise en Page des Articles**
    *   Structure claire, intégration possible d'images/code.
*   **UI3.3: Interactivité du Glossaire**
    *   Recherche rapide, filtres, liens interactifs (optionnel).

### 4. Dépendances

*   **D4.1: Structure de Navigation Globale du Site.** (EXISTANT)
*   **D4.2: (Si CMS) Le CMS choisi et son API.**
*   **D4.3: (Si Markdown) Bibliothèque de parsing Markdown.**
*   **D4.4: Expertise en Rédaction Technique Web3.**

### 5. Ordre de Développement Priorisé (Suggestion)

1.  **Priorité 1 (Glossaire de Base - Markdown):**
    *   Choisir approche Markdown. Développer layout glossaire. Rédiger 20-30 termes critiques.
2.  **Priorité 2 (Articles Fondamentaux - Markdown):**
    *   Développer layout articles. Rédiger 3-5 articles fondamentaux.
3.  **Priorité 3 (Améliorations UI/UX et Contenu):**
    *   Recherche, catégories. Plus d'articles (guides BlockDeploy). Liens interactifs.
4.  **Priorité 4 (Quiz - Optionnel).**

### 6. Progressive Delivery

*   **Lancer avec un petit ensemble de contenu.**
*   **Ajouter du contenu itérativement.**
*   **Recueillir feedback sur sujets désirés.**
*   **Feature flag pour Quiz.**

### 7. Prérequis Critiques

*   **P7.1: Stratégie de Contenu Claire.**
*   **P7.2: Ressources pour Création de Contenu.**
*   **P7.3: Décision sur Solution Technique de Gestion de Contenu.**
