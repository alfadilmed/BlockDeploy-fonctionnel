## Plan Détaillé – Phase 1 / Lot 2: ERC-20 MVP & Support Polygon

**Objectif du Lot 2:** Implémenter la fonctionnalité de déploiement pour un token ERC-20 avec des options de configuration de base (MVP), et étendre le support de la plateforme au réseau Polygon (Testnet Mumbai et Mainnet).

### Milestones Suggérées pour le Lot 2

*   **L2-M1: Développement du Smart Contract ERC-20 MVP & Configuration**
    *   L2-M1.1: Écriture et test du contrat Solidity pour l'ERC-20 MVP.
    *   L2-M1.2: Définition de la structure de configuration pour ce contrat (API et DB).
*   **L2-M2: Intégration Backend pour ERC-20 MVP**
    *   L2-M2.1: Adaptation du `DeploymentService` pour gérer le nouveau type de contrat ERC-20 MVP.
    *   L2-M2.2: Création/Mise à jour des endpoints API pour configuration et déploiement ERC-20 MVP.
    *   L2-M2.3: Intégration avec la file d'attente pour déploiement asynchrone.
*   **L2-M3: Intégration du Réseau Polygon**
    *   L2-M3.1: Configuration du `ProviderService` pour Polygon (Mumbai Testnet, Polygon Mainnet).
    *   L2-M3.2: Tests de connectivité et de déploiement de base sur Polygon.
*   **L2-M4: Développement Frontend pour Création ERC-20 MVP**
    *   L2-M4.1: Création du formulaire de configuration (UI/UX).
    *   L2-M4.2: Logique frontend pour l'appel API de déploiement.
    *   L2-M4.3: Affichage du feedback post-déploiement.
*   **L2-M5: Tests de Bout en Bout & Documentation**
    *   L2-M5.1: Tests E2E du déploiement ERC-20 MVP sur Sepolia et Polygon.
    *   L2-M5.2: Mise à jour de la documentation utilisateur et du `devlog/LOT_2_LOG.md`.

---

### 1. Architecture et Flux pour le Déploiement ERC-20 MVP

*   **Référence:** Axe 1: Module ERC-20 Avancé - Priorité 1.
*   **Fonctionnalités Contrat ERC-20 MVP:**
    *   Base: Nom, Symbole, Décimales (fixées à 18).
    *   Supply: Fixe ou Variable (Plafonnée/Capped) avec supply initiale.
    *   Options: Burnable (détenteurs), Pausable (propriétaire).
    *   Rôle: Owner par défaut (pas de `MINTER_ROLE` séparé pour MVP).
*   **Smart Contract (`ERC20MVP.sol`):**
    *   Basé sur OpenZeppelin: `ERC20`, `ERC20Burnable`, `ERC20Pausable`, `ERC20Capped` (si Capped), `Ownable`.
    *   Constructeur gérant les options (via booléens `isPausable_`, `isBurnable_`, `isCapped_`).
*   **Flux de Déploiement:** Formulaire Frontend -> API Backend (`POST /api/v1/erc20/deploy-mvp`) -> Validation, Création DB (`DeploymentStatus.PENDING`), Préparation `DeploymentJobData` (avec ABI/Bytecode de templates pré-compilés pour MVP), Ajout à `deploymentQueue` -> Réponse `202 Accepted` -> `deploymentWorker` traite job -> `DeploymentService` déploie -> MàJ DB.

### 2. Gestion des Options de Configuration

*   **API Backend (`POST /api/v1/erc20/deploy-mvp` Payload):**
    ```json
    {
      "networkName": "polygon_mumbai",
      "userGivenName": "Mon ERC20 MVP",
      "tokenConfig": {
        "name": "Mon MVP Token",
        "symbol": "MMT",
        "supplyType": "fixed", // "fixed" ou "capped"
        "initialSupply": "1000000", // En unités token (sera converti en wei)
        "cap": "2000000", // Si supplyType "capped"
        "features": { "burnable": true, "pausable": true }
      }
    }
    ```
*   **`DeploymentDBSchema.configuration`:** Stocke `tokenConfig`.
*   **`SmartContractTemplateDBSchema`:** Entrées pour templates ERC-20 MVP pré-compilés (ex: "ERC20MVP_Fixed_PausBurn").
*   **Conversion Supply:** Backend convertit supply (unités token) en wei (18 décimales).

### 3. Intégration Réseau Polygon

*   **`ProviderService`:** Ajouter configs pour Polygon Mainnet & Mumbai (URLs RPC via `process.env`).
*   **Frontend `NetworkSelector`:** Ajouter Polygon Mainnet & Mumbai.
*   **Liens Explorateur:** Utiliser `mumbai.polygonscan.com` et `polygonscan.com`.
*   **Tests:** Déployer et interagir sur Mumbai.

### 4. UI/UX pour Formulaire de Création ERC-20 MVP

*   **Champs:** Sélection Réseau (incluant Polygon), Nom, Symbole, Type Supply (Fixe/Plafonnée) avec champs conditionnels pour supply/cap, Cases à cocher pour Burnable/Pausable. Tooltips explicatifs.
*   **Validation:** En temps réel et soumission.
*   **Récapitulatif:** Avant déploiement.
*   **Feedback:** Alert/Toast pour statut.

### 5. Tests & Feedback Post-Déploiement

*   **Tests Unitaires (Solidity):** Couvrir options contrat (fixe/capped, pausable, burnable).
*   **Tests Intégration (Backend):** API -> Queue -> Worker -> Déploiement -> DB (sur Sepolia & Polygon Mumbai).
*   **Tests E2E (Full Flow):** Formulaire -> Déploiement -> Vérification sur Dashboard & Explorateur.
*   **Feedback UI:** Notification succès/échec, infos contrat, lien explorateur, redirection dashboard.

---
Ce document servira de guide pour le développement du Lot 2.
