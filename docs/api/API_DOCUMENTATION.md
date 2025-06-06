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
---
### 5. Gérer les Rôles d'un Contrat ERC-20 Advanced (Ex: `MINTER_ROLE`) (Lot 4 - Optionnel L4-M2.2)

*   **Endpoint:** `POST /api/v1/contracts/:networkName/:contractAddress/erc20/roles`
*   **Méthode:** `POST`
*   **Description:** Permet à l'admin (`DEFAULT_ADMIN_ROLE`) d'un `ERC20Advanced` d'accorder/révoquer des rôles (ex: `MINTER_ROLE`). Actions traitées via file d'attente ou retour de Tx non signées.
*   **Authentification:** Requise (utilisateur doit être admin du contrat).
*   **Paramètres d'URL:** `networkName`, `contractAddress`.
*   **Corps de la Requête:**
    ```json
    {
      "role": "minter", // "minter", "pauser" (si géré par rôle)
      "grant": ["0xADDRESS_TO_GRANT_1"],
      "revoke": ["0xADDRESS_TO_REVOKE_1"]
    }
    ```
    *   `role` (string, requis): Rôle à gérer.
    *   `grant` (array de strings, optionnel): Adresses à qui accorder le rôle.
    *   `revoke` (array de strings, optionnel): Adresses de qui révoquer le rôle.
*   **Réponse Succès (`202 Accepted` si via queue, ou `200 OK` si Tx non signée retournée):**
    ```json
    // Si via queue:
    {
      "message": "Demande de modification de rôle(s) acceptée et mise en file d'attente.",
      "roleManagementId": "role-modif-id-abc-123",
      "jobId": "131415"
    }
    // Si Tx non signée retournée (pour chaque action grant/revoke):
    // {
    //   "message": "Transaction(s) préparée(s) pour modification de rôle. Veuillez signer.",
    //   "unsignedTransactions": [
    //     { "type": "grant", "account": "0x...", "role": "minter", "unsignedTx": { "to": "0x...", "data": "0x..." } }
    //   ]
    // }
    ```
*   **Erreurs:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`.

**Logique Backend (Conceptuel):**
1.  Validation & Autorisation.
2.  Pour chaque action grant/revoke:
    *   **Option A (Queue):** Préparer `RoleManagementJobData`, ajouter à une queue. Worker exécute.
    *   **Option B (Tx Non Signée - Préférable pour actions admin):** Préparer la transaction non signée pour `grantRole()` ou `revokeRole()`. Retourner au client pour signature.
---
### 6. Déployer un contrat NFT ERC-721 MVP (Option 1: URL Métadonnées Externe) (Lot 4 - L4-M5.1)

*   **Endpoint:** `POST /api/v1/deploy/nft-erc721-mvp`
*   **Méthode:** `POST`
*   **Description:** Initie le déploiement d'un contrat NFT ERC-721 MVP. L'utilisateur fournit une `baseTokenURI` pour les métadonnées.
*   **Authentification:** Requise.
*   **Corps de la Requête:**
    ```json
    {
      "networkName": "polygon_mumbai",
      "userGivenName": "Ma Première Collection NFT",
      "collectionConfig": {
        "name": "Les Aventuriers du Web3",
        "symbol": "ADW3",
        "baseTokenURI": "ipfs://QmZz...aBcD/metadata/",
        "royalties": {
          "receiver": "0xRoyaltyCollectorAddress...",
          "fractionBps": 750
        },
        "features": {
          "pausable": true
        },
        "initialOwner": "0xUserWalletAddress..."
      }
    }
    ```
    *   `networkName` (string, requis).
    *   `userGivenName` (string, optionnel).
    *   `collectionConfig` (object, requis):
        *   `name`, `symbol` (string, requis).
        *   `baseTokenURI` (string, requis).
        *   `royalties.receiver` (address, requis).
        *   `royalties.fractionBps` (number, requis, 0-10000).
        *   `features.pausable` (boolean, optionnel, défaut `true`).
        *   `initialOwner` (address, optionnel, défaut `userId`).
*   **Réponse Succès (`202 Accepted`):**
    ```json
    {
      "message": "Demande de déploiement pour la collection NFT ERC-721 MVP acceptée et mise en file d'attente.",
      "deploymentId": "nft-deployment-id-123-abc",
      "jobId": "202122"
    }
    ```
*   **Erreurs:** `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`.

**Logique Backend (Conceptuel):**
1.  Validation requête & `collectionConfig`.
2.  Récupération `userId` (pour `initialOwner` si non fourni).
3.  Création entrée `DeploymentDBSchema` (`status: PENDING`, `contractType: "NFT_ERC721"`).
4.  Sélection Template: "ERC721MVP_Std_RoyaltyPausBurn_v1".
5.  Préparation `constructorArgs` pour `ERC721MVP.sol`.
6.  Préparation `DeploymentJobData`.
7.  Ajout job à `deploymentQueue`.
8.  Réponse `202 Accepted`.

## NFT Simplified IPFS Upload

### `POST /api/v1/nft/upload-ipfs`

Uploads an NFT's image and metadata to IPFS, returning the `tokenURI`.

**Request Type:** `multipart/form-data`

**Form Fields:**

*   `imageFile` (file, required): The image file for the NFT.
    *   *Constraints*: Recommended max size 5MB. Supported types: common image formats (JPEG, PNG, GIF, SVG). (Actual validation for size/type can be configured in `NftIpfsController`'s `ParseFilePipe`).
*   `name` (string, required): The name of the NFT.
*   `description` (string, required): A description for the NFT.
*   `attributes` (string, optional): A JSON string representing an array of attribute objects. Each object should have `trait_type` (string) and `value` (string).
    *   *Example*: `[{"trait_type": "Color", "value": "Red"}, {"trait_type": "Power", "value": "Flight"}]`
    *   *Note*: This field needs to be sent as a string when using `multipart/form-data`. The backend will parse it.

**Example cURL Request:**

```bash
curl -X POST \
  http://localhost:3000/api/v1/nft/upload-ipfs \
  -H "Content-Type: multipart/form-data" \
  -F "imageFile=@/path/to/your/nft_image.png" \
  -F "name=My Awesome NFT" \
  -F "description=This is a very special NFT." \
  -F "attributes=[{\"trait_type\": \"Rarity\", \"value\": \"Legendary\"}]"
```

**Success Response (201 CREATED):**

*   **Content-Type:** `application/json`

**Response Body Fields:**

*   `message` (string): Confirmation message (e.g., "NFT data and image uploaded successfully to IPFS!").
*   `tokenURI` (string): The IPFS URI for the NFT's metadata JSON (e.g., `ipfs://QmMetadataHash...`). This is the URI that should be used when minting the NFT.
*   `imageCID` (string): The Content Identifier (CID) of the uploaded image on IPFS (e.g., `QmImageHash...`).
*   `metadataCID` (string): The Content Identifier (CID) of the uploaded metadata JSON on IPFS (e.g., `QmMetadataHash...`).
*   `nftDetails` (object): The complete metadata object that was generated and pinned to IPFS.
    *   `name` (string): Name of the NFT.
    *   `description` (string): Description of the NFT.
    *   `image` (string): IPFS URI for the image (e.g., `ipfs://QmImageHash...`).
    *   `attributes` (array): Array of attribute objects.

**Example Success Response Body:**

```json
{
  "message": "NFT data and image uploaded successfully to IPFS!",
  "tokenURI": "ipfs://QmMetadataHashForNft",
  "imageCID": "QmImageHashForNft",
  "metadataCID": "QmMetadataHashForNft",
  "nftDetails": {
    "name": "My Awesome NFT",
    "description": "This is a very special NFT.",
    "image": "ipfs://QmImageHashForNft",
    "attributes": [
      { "trait_type": "Rarity", "value": "Legendary" }
    ]
  }
}
```

**Error Responses:**

*   `400 Bad Request`:
    *   If required fields are missing (e.g., `imageFile`, `name`, `description`).
    *   If validation fails for any field (e.g., `name` is not a string, `attributes` is malformed JSON).
    *   If the `imageFile` fails validation (e.g., too large, wrong file type - if validators are active).
    *   *Example Body:*
        ```json
        {
          "statusCode": 400,
          "message": [
            "name should not be empty",
            "description should not be empty"
          ],
          "error": "Bad Request"
        }
        ```
        ```json
        {
          "message": "Image file is required."
        }
        ```
*   `500 Internal Server Error`:
    *   If there's an issue with the IPFS pinning service (e.g., Pinata API error).
    *   Any other unexpected server-side error.
    *   *Example Body:*
        ```json
        {
          "message": "Failed to upload file to IPFS: Pinata Error",
          "error": "Internal Server Error"
        }
        ```
        ```json
        {
          "message": "An unexpected error occurred during NFT upload."
        }
        ```
