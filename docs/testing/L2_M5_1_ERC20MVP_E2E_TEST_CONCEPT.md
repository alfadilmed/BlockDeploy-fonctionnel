## L2-M5.1: Concept de Test d'Intégration E2E pour ERC-20 MVP (Lot 2)

**Objectif:** Valider le déploiement d'un token ERC-20 MVP via le nouveau formulaire, en ciblant Polygon (Mumbai Testnet), et vérifier l'intégration des composants du Lot 1 et Lot 2.

### Prérequis (État Attendu)
*   Frontend (L2-M4): Formulaire ERC-20 MVP, logique appel API, gestion feedback.
*   Backend API (L2-M2.2): Endpoint `/api/v1/deploy/erc20-mvp`.
*   Auth (M3.3 Lot 1): `userId` disponible.
*   Queue (L2-M2.3): Ajout jobs ERC-20 MVP OK.
*   Worker (M2.2 Lot 1): Traitement jobs ERC-20 MVP, logique sélection template et formatage `constructorArgs`.
*   Services Backend: `DeploymentService` (L2-M2.1) connaît templates ERC-20 MVP, `ProviderService` (L2-M3.1) configuré pour Polygon, `SecretManagerService` (M1.4 Lot 1) OK.
*   DB (M2.3 Lot 1): Schémas prêts.

### Scénario de Test E2E: ERC-20 MVP "Capped, Pausable, Burnable" sur Polygon Mumbai

1.  **Étape 1: Configuration et Soumission Frontend**
    *   **Action (Utilisateur Simulé):** Sélectionner "Polygon Mumbai Testnet". Remplir formulaire (Nom Projet, Nom Token "Mumbai Capped Token", Symbole "MCT", Type Supply "Capped", InitialSupply "100000", Cap "500000", Features Pausable/Burnable cochées). Vérifier récapitulatif. Cliquer "Déployer".
    *   **Vérifications (Frontend):** Validation OK. `isLoading` true. Payload API correct (`networkName: "polygon_mumbai"`).

2.  **Étape 2: Traitement API et Mise en File d'Attente**
    *   **Action:** Frontend envoie requête à `POST /api/v1/deploy/erc20-mvp`.
    *   **Vérifications (Backend API):** `userId` OK. Enregistrement `DeploymentDBSchema` créé (`status: PENDING`, `networkName: "polygon_mumbai"`, `chainId: 80001`, `tokenConfig` stockée, `deploymentId` généré). Template "ERC20MVP_Capped_PausBurnMint_v1" sélectionné. `constructorArgs` formatés (nom, symbole, owner, supply convertie en wei, cap converti en wei). `DeploymentJobData` correct ajouté à queue. API répond `202 Accepted`.
    *   **Vérifications (Frontend):** Notification "Déploiement en cours..."

3.  **Étape 3: Traitement par le Worker et `DeploymentService`**
    *   **Action:** `deploymentWorker` prend le job.
    *   **Vérifications (Worker & Services):** Logs BullMQ/Worker OK. (Simulé) Statut DB -> `PROCESSING`. `DeploymentService` appelé. `ProviderService` pour `polygon_mumbai`. `SecretManagerService` OK. Template ERC-20 MVP récupéré. Tentative déploiement.

4.  **Étape 4: Résultat du Déploiement (Simulé) et Feedback Final**
    *   **Cas Échec (attendu avec bytecode placeholder):** Erreur ethers.js. Logs Worker/BullMQ: job `failed`. Statut DB (simulé) -> `FAILED` + `errorMessage`. Frontend notifié.
    *   **Cas Succès (si bytecode réel):** `DeploymentService` retourne `contractAddress`/`transactionHash` (fictifs si placeholder). Logs Worker/BullMQ: job `completed`. Statut DB (simulé) -> `SUCCESS` + infos déploiement. Frontend notifié, affiche adresse, hash, et liens Polygonscan Mumbai (ex: `https://mumbai.polygonscan.com/address/{contractAddress}`).

### Points de Vérification Spécifiques à Polygon
*   Utilisation `chainId: 80001` (Mumbai) ou `137` (Mainnet).
*   Utilisation RPCs Polygon.
*   Génération liens Polygonscan.
*   (Test réel) Comportement gas/temps confirmation sur Polygon.
