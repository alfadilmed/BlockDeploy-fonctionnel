## M3.1: Intégration du `DeploymentService` avec la File d'Attente

**Objectif:** Assurer que les demandes de déploiement de contrats sont traitées de manière asynchrone en étant ajoutées à la file d'attente BullMQ (`deploymentQueue`), qui est ensuite consommée par le `deploymentWorker`. Le worker utilisera le `DeploymentService` pour effectuer le déploiement effectif.

### 1. Logique d'Ajout à la File d'Attente (Producer)

Cette logique serait typiquement située dans un service responsable de la gestion des requêtes API pour la création de contrats (par exemple, `ContractAPIService` ou un nom similaire).

**Étapes Clés du Producer:**

1.  **Validation des Entrées:** Les paramètres de la demande de déploiement (type de contrat, réseau, arguments du constructeur, etc.) sont validés.
2.  **Récupération/Validation du Template (Optionnel à ce stade, mais bon à avoir):**
    *   Vérifier que le template de contrat demandé (ex: "SimpleERC20") existe et est valide, en utilisant une méthode comme `deploymentService.getPrecompiledContract(templateKey)`.
3.  **Création d'un Enregistrement de Déploiement en Base de Données:**
    *   Avant d'ajouter le job à la file, un enregistrement est créé dans la collection `deployments` (voir `DeploymentDBSchema` défini en M2.3).
    *   Cet enregistrement aura un statut initial (ex: `DeploymentStatus.PENDING`).
    *   Un ID unique (`deploymentId`) est généré pour cet enregistrement. Cet ID sera inclus dans les données du job pour lier le job de la file d'attente à l'entrée de la base de données.
    *   **Exemple de données initiales pour la DB :**
        ```json
        {
          "_id": "unique-deployment-id-123",
          "userId": "user-abc",
          "status": "pending",
          "networkName": "sepolia",
          "contractType": "ERC20",
          "contractName": "Mon Super Token", // Nom donné par l'utilisateur
          "configuration": {
            "templateKey": "SimpleERC20",
            "constructorArgs": ["Mon Super Token", "MST", "1000000000000000000000"]
          },
          "createdAt": "2023-10-28T10:00:00.000Z",
          "updatedAt": "2023-10-28T10:00:00.000Z"
        }
        ```
4.  **Préparation des Données du Job (`DeploymentJobData`):**
    *   L'objet `DeploymentJobData` (défini dans `src/queues/deploymentQueue.ts`) est construit. Il doit contenir toutes les informations nécessaires au worker pour effectuer le déploiement, y compris le `deploymentId` de l'étape précédente.
    *   **Exemple de `DeploymentJobData` :**
        ```json
        {
          "deploymentId": "unique-deployment-id-123",
          "userId": "user-abc",
          "networkName": "sepolia",
          "contractType": "ERC20",
          "contractNameForPrecompiled": "SimpleERC20",
          "constructorArgs": ["Mon Super Token", "MST", "1000000000000000000000"]
        }
        ```
5.  **Ajout du Job à la `deploymentQueue`:**
    *   Le job est ajouté à l'instance `deploymentQueue` de BullMQ.
    *   `const job = await deploymentQueue.add('deployContractJob', jobData);`
6.  **Réponse à l'Utilisateur:**
    *   L'API répond rapidement à l'utilisateur avec un message indiquant que la demande de déploiement a été prise en compte et est en cours de traitement (ex: en retournant le `job.id` et/ou le `deploymentId`).

### 2. Logique de Traitement par le Worker (`deploymentWorker.ts`)

Le `deploymentWorker.ts` (défini en M2.2) est déjà conçu pour :

1.  **Écouter les jobs** sur `DEPLOYMENT_QUEUE_NAME`.
2.  Pour chaque job, appeler le `jobProcessor`.
3.  Le `jobProcessor` extrait les `DeploymentJobData`.
4.  **Appel au `DeploymentService`:**
    *   Le `jobProcessor` utilise les données du job pour appeler `deploymentService.deployPrecompiledContract(...)`.
    *   C'est le `DeploymentService` qui gère l'interaction avec `ProviderService` et `SecretManagerService` pour effectuer le déploiement réel.
5.  **Mise à Jour du Statut en Base de Données:**
    *   **En cas de succès:** Le `jobProcessor` (ou le `DeploymentService`) met à jour l'enregistrement `deployments` correspondant au `deploymentId` avec :
        *   `status: DeploymentStatus.SUCCESS`
        *   `contractAddress`
        *   `transactionHash`
        *   `deployerAddress`
        *   `deploymentTimestamp`
        *   `gasUsed` (si récupérable du reçu)
    *   **En cas d'échec:** Le `jobProcessor` (ou le `DeploymentService`) met à jour l'enregistrement `deployments` avec :
        *   `status: DeploymentStatus.FAILED`
        *   `errorMessage`
        *   `errorDetails` (optionnel)
6.  **Retour du Résultat du Job:** Le `jobProcessor` retourne un `DeploymentJobResult` indiquant le succès ou l'échec, qui sera enregistré par BullMQ.

### Modifications ou Points d'Attention

*   **`DeploymentService`:** Aucune modification majeure n'est nécessaire au `DeploymentService` lui-même pour cette intégration, car il est déjà conçu pour prendre les paramètres de déploiement et les exécuter. Le changement principal est *qui* appelle le `DeploymentService` (le worker au lieu du service API directement).
*   **Gestion des Erreurs:** Une gestion robuste des erreurs est cruciale à la fois dans le producer (ex: échec de l'ajout à la DB ou à la queue) et dans le worker (échec du déploiement). Les tentatives de BullMQ (`attempts` et `backoff` dans la config de la queue) aideront pour les erreurs transitoires.
*   **Idempotence (Avancé):** Pour des systèmes très robustes, s'assurer que si un job est retraité pour une raison quelconque (ex: après un crash du worker), il ne cause pas de déploiements multiples ou d'effets de bord non désirés. Utiliser le `deploymentId` pour vérifier si un déploiement a déjà été tenté/réussi peut être une stratégie. Pour le déploiement de contrat, cela signifie vérifier si un contrat existe déjà pour ce `deploymentId` avant de tenter un nouveau déploiement.
*   **Mise à jour de la Base de Données:** Les appels pour mettre à jour la base de données avec le statut du déploiement doivent être fiables. Si le worker et la DB sont des services séparés, gérer les échecs de communication.

Cette structure assure que l'API reste réactive et que les déploiements (qui peuvent être longs) sont gérés de manière fiable en arrière-plan.

---
### 3. Cas Spécifique: Déploiement d'un ERC-20 MVP (Lot 2 - L2-M2.3)

L'intégration de la file d'attente pour le déploiement des contrats ERC-20 MVP (introduits dans le Lot 2) suit les mêmes principes généraux décrits précédemment, avec les spécificités suivantes dans la préparation des données du job par le **Producer** (ex: le service API `POST /api/v1/deploy/erc20-mvp`).

**a. Endpoint API (`POST /api/v1/deploy/erc20-mvp`) - Producer Logic:**

1.  **Réception de la Configuration:** L'API reçoit la `tokenConfig` de l'utilisateur (nom, symbole, supplyType, initialSupply, cap, features).
2.  **Validation et Préparation (Logique clé avant la mise en file d'attente):**
    *   Valider la `tokenConfig` (ex: `cap` >= `initialSupply` si `capped`).
    *   Récupérer l'`userId` de l'utilisateur authentifié.
    *   **Sélection du Template `SmartContractTemplateDBSchema`:**
        *   En fonction de `tokenConfig.supplyType` et `tokenConfig.features`, déterminer la `templateKey` exacte du contrat pré-compilé (ex: "ERC20MVP_Fixed_PausBurn_v1" ou "ERC20MVP_Capped_PausBurnMint_v1"). Cette clé est utilisée par le `DeploymentService` pour obtenir l'ABI/Bytecode.
    *   **Formatage des `constructorArgs`:**
        *   Construire le tableau exact des arguments attendus par le constructeur du contrat Solidity sélectionné, à partir de `tokenConfig`.
        *   Exemple pour "ERC20MVP_Fixed_PausBurn_v1": `constructorArgs = [tokenConfig.name, tokenConfig.symbol, ownerAddress, ethers.parseUnits(tokenConfig.initialSupply, 18)]`
        *   Exemple pour "ERC20MVP_Capped_PausBurnMint_v1": `constructorArgs = [tokenConfig.name, tokenConfig.symbol, ownerAddress, ethers.parseUnits(tokenConfig.initialSupply, 18), ethers.parseUnits(tokenConfig.cap, 18)]`
3.  **Création de l'Enregistrement `DeploymentDBSchema`:** Statut `PENDING`, `deploymentId` unique, `userId`, `networkName`, `tokenConfig` stockée dans `configuration`.
4.  **Préparation de `DeploymentJobData`:**
    *   `deploymentId`, `userId`, `networkName`, `contractType: "ERC20"`.
    *   `contractNameForPrecompiled`: La `templateKey` exacte (ex: "ERC20MVP_Fixed_PausBurn_v1").
    *   `constructorArgs`: Le tableau d'arguments formatés.
5.  **Ajout à `deploymentQueue`:** Le job est ajouté.
6.  **Réponse API:** `202 Accepted` avec `deploymentId` et `jobId`.

**b. `deploymentWorker` - Consumer Logic:**

*   Le worker récupère le job.
*   Il passe `jobData.contractNameForPrecompiled`, `jobData.constructorArgs`, et `jobData.networkName` à `deploymentService.deployPrecompiledContract()`.
*   Aucune modification majeure n'est nécessaire au `deploymentWorker` ou au `DeploymentService` si les `constructorArgs` sont correctement préparés par le producer et que `contractNameForPrecompiled` est la clé correcte pour le `PRECOMPILED_CONTRACTS_STORE` (ou équivalent DB) du `DeploymentService`.
*   Le worker met à jour l'enregistrement `DeploymentDBSchema` avec le résultat.

Cette approche maintient la logique de transformation de la configuration spécifique au type de contrat (ERC-20 MVP) dans le producer (service API), gardant le `DeploymentService` et le worker plus génériques.
---
### 4. Cas Spécifique: Déploiement d'un NFT ERC-721 MVP (Lot 4 - L4-M5.2)

L'intégration de la file d'attente pour les NFT ERC-721 MVP (Option 1: URL métadonnées externe) suit les principes établis.

**a. Endpoint API (`POST /api/v1/deploy/nft-erc721-mvp`) - Producer Logic:**

1.  **Réception Configuration:** API reçoit `collectionConfig` (nom, symbole, `baseTokenURI`, royalties, features, `initialOwner`).
2.  **Validation & Préparation:**
    *   Valider `collectionConfig`. Récupérer `userId`.
    *   **Sélection Template:** Utiliser `templateKey`: "ERC721MVP_Std_RoyaltyPausBurn_v1".
    *   **Formatage `constructorArgs`:** Pour `ERC721MVP.sol` à partir de `collectionConfig`:
        `[name, symbol, ownerAddress, baseTokenURI, royalties.receiver, royalties.fractionBps]`
3.  **Création `DeploymentDBSchema`:** `status: PENDING`, `contractType: "NFT_ERC721"`, `configuration` (stocke `collectionConfig`), `templateKeyUsed`.
4.  **Préparation `DeploymentJobData`:**
    *   `deploymentId`, `userId`, `networkName`, `contractType: "NFT_ERC721"`.
    *   `contractNameForPrecompiled`: "ERC721MVP_Std_RoyaltyPausBurn_v1".
    *   `constructorArgs`: Arguments formatés.
5.  **Ajout à `deploymentQueue`**.
6.  **Réponse API:** `202 Accepted`.

**b. `deploymentWorker` - Consumer Logic:**
*   Worker récupère job. `jobData.contractType` ("NFT_ERC721") et `jobData.contractNameForPrecompiled` guident le traitement.
*   Appel à `deploymentService.deployPrecompiledContract()` avec ABI/bytecode du template "ERC721MVP_Std_RoyaltyPausBurn_v1" et `constructorArgs` du job.
*   Mise à jour `DeploymentDBSchema` (succès/échec) identique au flux ERC-20.
