## Détail du Lot 1 – Phase 1: Fondations Techniques & UI Kit

**Objectif du Lot 1:** Mettre en place le socle technique et les éléments d'interface utilisateur réutilisables indispensables pour le développement des fonctionnalités de BlockDeploy.

### 1. Kit UI Standardisé (Prérequis P0.1)

**Objectif:** Créer un ensemble cohérent et réutilisable de composants React.

**Arborescence Suggérée (`src/components/ui/`):**
```
Button/, Input/, Modal/, Card/, Select/, Tooltip/, Spinner/, Alert/, Badge/, Avatar/, Typography/, Icon/, ProgressBar/, Toast/
```
(Chaque dossier avec `Component.tsx` et `Component.stories.tsx` ou `Component.test.tsx`)

**Composants Clés & Specs Minimales:**
*   **`Button`**: props `variant`, `size`, `isLoading`, `disabled`, `iconLeft`, `iconRight`, etc.
*   **`Input`**: props `type`, `placeholder`, `label`, `disabled`, `error`, etc.
*   **`Modal`**: props `isOpen`, `onClose`, `title`, `children`, `size`.
*   **`Card`**: props `children`, `className`, `padding`, `variant`.
*   **`Select`**: props `options`, `value`, `onChange`, `placeholder`, `label`.
*   **`Tooltip`**: props `content`, `children`, `position`.
*   **`Spinner`**: props `size`, `color`.
*   **`Alert`**: props `variant`, `title`, `message`.
*   **`Badge`**: props `variant`, `size`.
*   **`Typography` (`Heading`, `Text`)**: props `as`, `size`, `weight`, `color`.
*   **`Toast`**: `ToastProvider`, `useToast` hook.

**Outils/Démarche:** Tailwind CSS, Storybook, Tests unitaires/visuels, Accessibilité (ARIA).

### 2. Spécifications Techniques de l'Architecture de Déploiement Backend (Prérequis P0.2)

**a. Stratégie de Compilation/Sélection des Smart Contracts (Hybride Recommandée):**
1.  **Contrats de Base Pré-compilés:** Pour configurations standard (ERC-20 simple, NFT simple). ABI/bytecode en DB ou fichiers JSON.
2.  **Génération/Assemblage Dynamique pour Options Avancées:** Backend assemble code Solidity depuis snippets. Service de compilation sécurisé (ex: AWS Lambda + `solc-js`).

**b. Gestion Sécurisée des Clés Privées du Wallet Serveur:**
*   Utiliser **AWS Secrets Manager** ou **HashiCorp Vault**.
*   Clé privée chiffrée, obtenue dynamiquement par le backend via IAM/token Vault.
*   Jamais de clé en clair dans code, env vars directes, ou DB.

**c. Système de File d'Attente (Queue) pour les Déploiements:**
*   API (`POST /api/v1/.../deploy`) ajoute demande à queue (Redis Queue, RabbitMQ, AWS SQS) et répond "En cours".
*   **Workers** (processus/fonctions serverless) consomment tâches, déploient, mettent à jour statut en DB.
*   Notifications frontend via WebSockets/SSE (optionnel Lot 1).

**d. Service d'Interaction Blockchain (Abstractions):**
*   `ProviderService`: Gère connexion RPCs multi-réseaux.
*   `DeploymentService`: Déploie contrats (utilise `ProviderService`, gestion clés).
*   `ContractReaderService`: Appelle fonctions `view` pour Dashboard.
*   `TransactionBuilderService`: Construit transactions non signées pour actions Dashboard.

**e. Validation et Tests (Prérequis P0.4):**
*   Valider service authentification existant.
*   Tests unitaires/intégration pour services backend.

### 3. Planning d'Implémentation Suggéré pour le Lot 1 (Milestones)

*   **Semaine 1-2: Config Initiale & UI Kit (Partie 1)**
    *   **M1.1:** Choix outils, config environnements.
    *   **M1.2:** Développement 3-4 composants UI critiques.
    *   **M1.3:** `ProviderService` de base (Sepolia).
    *   **M1.4:** Config initiale gestionnaire de secrets.
*   **Semaine 3-4: Backend Déploiement (Base) & UI Kit (Partie 2)**
    *   **M2.1:** `DeploymentService` (contrats pré-compilés simples).
    *   **M2.2:** Implémentation file d'attente (setup base).
    *   **M2.3:** Finalisation schémas DB initiaux.
    *   **M2.4:** Développement autres composants UI clés.
*   **Semaine 5-6: Intégration & Tests Initiaux**
    *   **M3.1:** Intégration `DeploymentService` avec queue.
    *   **M3.2:** API minimale pour test déploiement contrat pré-compilé (Sepolia).
    *   **M3.3:** Validation auth avec services backend.
    *   **M3.4:** Tests intégration flux déploiement.
    *   **M3.5:** (Opt.) Développement service compilation de base.
*   **Fin du Lot 1 (Objectif à 6 semaines):** UI Kit base fonctionnel. Arch. backend capable de déployer contrat pré-compilé simple via queue. DB, Auth, RPC Sepolia OK.
