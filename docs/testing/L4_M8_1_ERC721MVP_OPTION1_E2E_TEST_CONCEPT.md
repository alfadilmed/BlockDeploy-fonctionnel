## L4-M8.1: Concept de Test d'Intégration E2E pour NFT ERC-721 MVP (Option 1: `baseTokenURI`)

**Objectif:** Valider le déploiement d'une collection NFT ERC-721 MVP avec `baseTokenURI` externe.

### 1. Prérequis (Conceptuels)
*   Frontend (L4-M6): Formulaire NFT Option 1 fonctionnel.
*   Backend API (L4-M5.1): Endpoint `/api/v1/deploy/nft-erc721-mvp` prêt.
*   Auth, Queue, Worker, Services Backend (Deployment, Provider, SecretManager) OK.
*   DB (M2.3 Lot 1): Schémas prêts.
*   Métadonnées Externes: Dossier IPFS avec au moins `1.json` (conforme, pointant vers image valide) prêt. URL de base du dossier connue.

### 2. Scénario de Test E2E: Déploiement Collection NFT sur Sepolia avec `baseTokenURI`

1.  **Étape 1: Configuration & Soumission Frontend (L4-M6.1, L4-M6.2)**
    *   **Action (Simulée):** Remplir formulaire NFT: Réseau "Sepolia", Nom Collection, Symbole, **URL Base Métadonnées** (l'URL IPFS préparée, finissant par `/`), infos Royalties, Pausable coché. Soumettre.
    *   **Vérifications (Frontend):** Validation OK. Payload API correct.

2.  **Étape 2: Traitement API & Mise en File d'Attente (L4-M5.1, L4-M5.2)**
    *   **Action:** Frontend envoie requête.
    *   **Vérifications (Backend API):** `userId` OK. `DeploymentDBSchema` créé (`status: PENDING`, `networkName: "sepolia"`, `contractType: "NFT_ERC721"`). Template "ERC721MVP_Std_RoyaltyPausBurn_v1" sélectionné. `constructorArgs` (incluant `baseTokenURI`) formatés. `DeploymentJobData` ajouté à queue. API répond `202 Accepted`.
    *   **Vérifications (Frontend):** Notification "Déploiement en cours..."

3.  **Étape 3: Traitement Worker & `DeploymentService`**
    *   **Action:** `deploymentWorker` prend job.
    *   **Vérifications (Worker & Services):** Logs OK. (Simulé) DB Statut -> `PROCESSING`. `DeploymentService` appelé. `ProviderService` pour `sepolia`. ABI/Bytecode "ERC721MVP_Std_RoyaltyPausBurn_v1" (placeholders) récupérés. Tentative déploiement.

4.  **Étape 4: Résultat Déploiement (Simulé) & Feedback**
    *   **Cas Succès (si bytecode réel):** `DeploymentService` retourne `contractAddress`/`transactionHash` (fictifs). Logs Worker/BullMQ: job `completed`. Statut DB (simulé) -> `SUCCESS`. Frontend notifié (adresse, hash, lien Etherscan Sepolia).

5.  **Étape 5: Mint NFT & Vérification `tokenURI` (Conceptuel Post-Déploiement)**
    *   **Action (Simulée):** Appeler `safeMint(toAddress)` sur contrat déployé (minte `tokenId` 1).
    *   **Vérifications:**
        *   Appel On-Chain (simulé): Lire `tokenURI(1)`.
        *   Attendu: `ipfs://QmYourFolderCID/1` (ou `.../1.json`).
        *   Visualisation Externe (simulée): URL `tokenURI(1)` (via gateway IPFS) affiche JSON correct.
        *   Marketplace Test (simulée): NFT (contrat/ID 1) sur OpenSea Testnet (Sepolia) affiche métadonnées & royalties.

### Points de Vérification Clés (NFT Option 1)
*   Exactitude `baseTokenURI` enregistrée et utilisée.
*   Concaténation `baseTokenURI` + `tokenId` par `tokenURI()` du contrat.
*   Fonctionnement royalties EIP-2981.
*   Options Pausable/Burnable. Mint par propriétaire.

Ce test valide le flux NFT ERC-721 avec métadonnées externes.
