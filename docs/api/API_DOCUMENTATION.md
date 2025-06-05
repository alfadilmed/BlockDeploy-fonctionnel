# Documentation des APIs BlockDeploy

Ce document fournit des exemples d'appels API et de réponses pour les endpoints de la plateforme BlockDeploy.

---
## Endpoints de Déploiement (Lot 1 & 2)

### 1. Déployer un contrat ERC-20 Simple (Pré-compilé - Test Initial Lot 1)

*   **Endpoint:** `POST /api/v1/test-deploy/simple-erc20`
*   **Méthode:** `POST`
*   **Description:** Initie le déploiement d'un contrat ERC-20 très simple pré-compilé. Principalement pour tester le flux de base du Lot 1.
*   **Authentification:** Requise.
*   **Corps de la Requête:**
    ```json
    {
      "networkName": "sepolia",
      "userGivenName": "MonTokenDeTestAPI_Lot1",
      "constructorArgs": {
        "name": "Mon Token de Test Lot1",
        "symbol": "MTSTL1",
        "initialSupply": "1000000000000000000000"
      }
    }
    ```
*   **Réponse Succès (`202 Accepted`):**
    ```json
    {
      "message": "Demande de déploiement acceptée et mise en file d'attente.",
      "deploymentId": "abcdef-12345-ghijkl-67890",
      "jobId": "789"
    }
    ```

### 2. Déployer un contrat ERC-20 MVP (Lot 2)

*   **Endpoint:** `POST /api/v1/deploy/erc20-mvp`
*   **Méthode:** `POST`
*   **Description:** Initie le déploiement d'un contrat ERC-20 MVP configurable.
*   **Authentification:** Requise.
*   **Corps de la Requête:**
    ```json
    {
      "networkName": "sepolia",
      "userGivenName": "MonTokenERC20MVP",
      "tokenConfig": {
        "name": "Mon Token MVP",
        "symbol": "MMVP",
        "supplyType": "capped",
        "initialSupply": "500000",
        "cap": "1000000",
        "features": { "burnable": true, "pausable": true }
      }
    }
    ```
*   **Réponse Succès (`202 Accepted`):**
    ```json
    {
      "message": "Demande de déploiement pour ERC-20 MVP acceptée et mise en file d'attente.",
      "deploymentId": "new-deployment-id-xyz-789",
      "jobId": "101112"
    }
    ```

---
## Endpoints du Dashboard Utilisateur (Lot 3+)

### 3. Lister les Déploiements d'un Utilisateur

*   **Endpoint:** `GET /api/v1/user/deployments`
*   **Méthode:** `GET`
*   **Description:** Récupère la liste paginée des contrats déployés par l'utilisateur authentifié.
*   **Authentification:** Requise.
*   **Paramètres de Requête (Query Parameters):**
    *   `page` (number, optionnel, défaut: 1)
    *   `limit` (number, optionnel, défaut: 10, max: 50)
    *   `status` (string, optionnel): `pending`, `processing`, `success`, `failed`
    *   `networkName` (string, optionnel): ex: `sepolia`, `polygon_mumbai`
    *   `sortBy` (string, optionnel, défaut: `createdAt`)
    *   `sortOrder` (string, optionnel, défaut: `desc`): `asc` ou `desc`
*   **Réponse Succès (`200 OK`):**
    ```json
    {
      "data": [
        {
          "deploymentId": "abcdef-12345-ghijkl-67890",
          "userGivenName": "Mon Premier Token de Test",
          "contractType": "ERC20",
          "networkName": "sepolia",
          "chainId": 11155111,
          "status": "success",
          "contractAddress": "0x123...",
          "transactionHash": "0xabc...",
          "createdAt": "2023-10-28T10:00:00.000Z",
          "updatedAt": "2023-10-28T10:05:00.000Z"
        }
        // ... autres déploiements
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 48,
        "itemsPerPage": 10,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
    ```
*   **Erreurs:** `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`.

**Logique Backend (Conceptuel):** Auth middleware (`req.user.id`) -> Requête DB (collection `deployments`) avec `userId` et filtres/pagination -> Formatage réponse.

---
### 4. Récupérer les Détails On-Chain d'un Contrat ERC-20 (Lot 3)

*   **Endpoint:** `GET /api/v1/contracts/:networkName/:contractAddress/erc20-details`
*   **Méthode:** `GET`
*   **Description:** Récupère des informations on-chain de base pour un contrat ERC-20.
*   **Authentification:** Optionnelle/Requise (Pour MVP: Requise).
*   **Paramètres d'URL (Path Parameters):**
    *   `networkName` (string, requis): ex: `sepolia`, `polygon_mumbai`.
    *   `contractAddress` (string, requis): Adresse du contrat ERC-20.
*   **Réponse Succès (`200 OK`):**
    ```json
    {
      "networkName": "sepolia",
      "contractAddress": "0x123...",
      "onChainData": {
        "name": "Mon Token",
        "symbol": "MTK",
        "decimals": 18,
        "totalSupply": "1000000000000000000000", // en wei
        "ownerBalance": "500000000000000000000"  // Balance du propriétaire du contrat, en wei
      },
      "fetchedAt": "2023-11-05T12:00:00.000Z"
    }
    ```
    *   `ownerBalance`: Balance de l'adresse propriétaire du contrat (ex: `deployerAddress` de `DeploymentDBSchema`).
*   **Erreurs:** `400 Bad Request`, `401 Unauthorized`, `404 Not Found` (réseau non supporté, contrat invalide), `500 Internal Server Error` (erreur RPC).

**Logique Backend (Conceptuel):**
1.  Validation params. Auth (si requise).
2.  `ProviderService` pour `networkName`.
3.  **`ContractReaderService` (ou logique similaire):**
    *   Instancie `ethers.Contract` avec ABI ERC-20 minimale.
    *   Appelle `name()`, `symbol()`, `decimals()`, `totalSupply()`.
    *   Récupère `ownerAddress` (ex: de `DeploymentDBSchema.deployerAddress`). Appelle `balanceOf(ownerAddress)`.
    *   Gère erreurs on-chain.
4.  Formate réponse. Cache optionnel (TTL court).
