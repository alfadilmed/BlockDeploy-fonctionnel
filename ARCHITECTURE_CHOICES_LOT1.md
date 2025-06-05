## Choix Technologiques et Configuration d'Environnement pour Lot 1

Ce document formalise les choix technologiques validés pour les fondations techniques du Lot 1 et décrit les configurations d'environnement associées.

### 1. Outils Finalisés (Prérequis M1.1)

*   **Composants UI (Storybook) :**
    *   **Outil :** Storybook
    *   **Usage :** Développement, documentation et test en isolation des composants React du UI Kit.
    *   **Configuration Environnement (Développement) :**
        *   Installation des dépendances Storybook (`@storybook/react-vite`, `@storybook/addon-essentials`, etc.).
        *   Configuration du fichier `main.ts` et `preview.ts` de Storybook pour s'intégrer avec Vite, TypeScript, Tailwind CSS.
        *   Scripts NPM/Yarn pour lancer Storybook (`storybook dev`, `build-storybook`).
*   **File d'Attente (Queue) :**
    *   **Outils :** BullMQ (librairie Node.js) + Redis (serveur de données en mémoire).
    *   **Usage :** Gestion des tâches de déploiement de smart contracts de manière asynchrone.
    *   **Configuration Environnement :**
        *   **Développement Local :** Instance Redis locale (ex: via Docker).
        *   **Test/Production :** Instance Redis managée (ex: AWS ElastiCache).
        *   Variables d'environnement pour la connexion à Redis (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`).
        *   Installation de `bullmq` et `ioredis` dans le backend.
*   **Gestion des Secrets (Wallet Serveur) :**
    *   **Outil :** AWS Secrets Manager (pour la production).
    *   **Usage :** Stockage sécurisé de la clé privée du wallet serveur.
    *   **Configuration Environnement :**
        *   **Développement Local (Simulation) :** Clé lue depuis `DEV_SERVER_WALLET_PRIVATE_KEY` (non sécurisé pour prod).
        *   **Test/Production :** Création d'un secret dans AWS Secrets Manager. Rôle IAM pour l'application backend avec permissions de lecture. `SecretManagerService` utilise AWS SDK. Variables d'env: `AWS_SECRET_NAME`, `AWS_REGION`.

### 2. Configuration Générale des Environnements

*   **Variables d'Environnement (`.env` files) :** Pour configurations spécifiques (RPC URLs, Redis config, AWS secret name, etc.).
*   **Docker (Optionnel Recommandé pour Dev) :** `docker-compose.yml` pour services locaux (Redis).
*   **CI/CD (Anticipation) :** Gestion sécurisée des configurations pour les pipelines.
