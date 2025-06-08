# Documentation des APIs BlockDeploy

Ce document fournit des exemples d'appels API et de réponses pour les endpoints de la plateforme BlockDeploy.

---
## Endpoints de Déploiement (Lot 1 & 2)

### 1. Déployer un contrat ERC-20 Simple (Pré-compilé - Test Initial Lot 1)
*   **Endpoint:** `POST /api/v1/test-deploy/simple-erc20`
    *(Détails comme précédemment)*

### 2. Déployer un contrat ERC-20 MVP (Lot 2)
*   **Endpoint:** `POST /api/v1/deploy/erc20-mvp`
    *(Détails comme précédemment, à renommer/fusionner avec `/deploy/erc20` si `templateKey` est adopté)*

---
## Endpoints du Dashboard Utilisateur (Lot 3+)

### 3. Lister les Déploiements d'un Utilisateur
*   **Endpoint:** `GET /api/v1/user/deployments`
    *(Détails comme précédemment)*

### 4. Récupérer les Détails On-Chain d'un Contrat ERC-20 (Lot 3 - Mis à jour Lot 5 L5-M1.1)
*   **Endpoint:** `GET /api/v1/contracts/:networkName/:contractAddress/erc20-details`
*   **Réponse Succès (`200 OK`):**
    ```json
    {
      "networkName": "sepolia",
      "contractAddress": "0x123...",
      "onChainData": {
        "name": "Mon Token",
        "symbol": "MTK",
        "decimals": 18,
        "totalSupply": "...",
        "ownerBalance": "...",
        "isPaused": false // Ajout L5-M1.1
      },
      "fetchedAt": "..."
    }
    ```
    *(Autres détails comme précédemment)*

---
### 5. Gérer les Rôles d'un Contrat ERC-20 Advanced (Ex: `MINTER_ROLE`) (Lot 4 - Optionnel L4-M2.2)
*   **Endpoint:** `POST /api/v1/contracts/:networkName/:contractAddress/erc20/roles`
    *(Détails comme précédemment)*

---
### 6. Déployer un contrat NFT ERC-721 MVP (Option 1: URL Métadonnées Externe) (Lot 4 - L4-M5.1)
*   **Endpoint:** `POST /api/v1/deploy/nft-erc721-mvp`
    *(Détails comme précédemment)*

---
### 7. Exécuter des Actions sur un Contrat ERC-20 (Lot 5 - L5-M1.1, L5-M1.2)

*   **Endpoint:** `POST /api/v1/contracts/:networkName/:contractAddress/erc20-action`
    *(Détails comme précédemment)*

---
### 8. Récupérer les Détails On-Chain d'une Collection NFT ERC-721 (Lot 5 - L5-M1.3)

*   **Endpoint:** `GET /api/v1/contracts/:networkName/:contractAddress/nft-erc721-details`
*   **Méthode:** `GET`
*   **Description:** Récupère infos on-chain pour une collection NFT ERC-721 + détails pour un sous-ensemble de tokens.
*   **Authentification:** Optionnelle/Requise (MVP: Requise).
*   **Paramètres d'URL:** `networkName`, `contractAddress`.
*   **Paramètres de Requête (Query):**
    *   `page` (number, opt., défaut: 1): Pour pagination tokens.
    *   `limit` (number, opt., défaut: 5): Nb tokens par page.
    *   `includeTokenDetails` (boolean, opt., défaut: `true`): Si `false`, ne retourne pas `tokenDetailsList`.
*   **Réponse Succès (`200 OK`):**
    ```json
    {
      "networkName": "polygon_mumbai",
      "contractAddress": "0xNftContract...",
      "onChainData": {
        "name": "Ma Collection",
        "symbol": "MSC",
        "totalSupply": "150" // string
      },
      "tokenDetailsList": { // Si includeTokenDetails=true & totalSupply > 0
        "tokens": [
          { "tokenId": "1", "ownerOf": "0x...", "tokenURI": "ipfs://..." },
          { "tokenId": "2", "ownerOf": "0x...", "tokenURI": "ipfs://..." }
        ],
        "pagination": { "currentPage": 1, "totalPages": 15, "totalItems": 150, "itemsPerPage": 5 }
      },
      "fetchedAt": "2023-11-16T10:00:00.000Z"
    }
    ```
*   **Erreurs:** `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`.

**Logique Backend (Conceptuel):**
1.  Validation params, Auth.
2.  `ProviderService`.
3.  **`ContractReaderService`:**
    *   Instancie `ethers.Contract` (ABI ERC-721 min).
    *   Appelle `name()`, `symbol()`, `totalSupply()`.
    *   Si `includeTokenDetails`:
        *   Récupère IDs de tokens (ex: séquentiels de `(page-1)*limit + 1` à `page*limit`, jusqu'à `totalSupply`).
        *   Pour chaque `tokenId`: appelle `ownerOf(tokenId)`, `tokenURI(tokenId)`.
4.  Formate réponse. Cache optionnel.
---
### 9. Exécuter des Actions sur un Contrat NFT ERC-721 (Lot 5 - L5-M1.4)

*   **Endpoint:** `POST /api/v1/contracts/:networkName/:contractAddress/nft-erc721-action`
*   **Méthode:** `POST`
*   **Description:** Permet au propriétaire d'un contrat NFT ERC-721 d'exécuter des actions (ex: `safeMint`). Retourne une Tx non signée.
*   **Authentification:** Requise (utilisateur doit être propriétaire).
*   **Paramètres d'URL:** `networkName`, `contractAddress`.
*   **Corps de la Requête:**
    *   **Pour `safeMint` (auto-incrémente tokenId défini dans `ERC721MVP.sol`):**
        ```json
        {
          "action": "safeMint",
          "to": "0xRecipientAddress..."
        }
        ```
    *   *(Autres actions comme `pause`, `unpause` pourraient être ajoutées ici si le contrat NFT les supporte).*
*   **Réponse Succès (`200 OK` - car retourne Tx à signer):**
    ```json
    {
      "message": "Transaction préparée pour l'action '{action}'. Veuillez signer.",
      "unsignedTx": { "to": "0xNftContractAddress...", "data": "0xEncodedFunctionCall...", "gasLimit": "..." },
      "networkName": "...", "chainId": 0
    }
    ```
*   **Erreurs:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`.

**Logique Backend (Conceptuel pour `safeMint`):**
1.  Validation & Autorisation (propriétaire).
2.  Préparation Tx non signée pour `safeMint(address to)` du contrat.
3.  Retourner `unsignedTx`.
---
## Endpoints pour l'Onboarding Utilisateur (Lot 5 - L5-M2.1)

### 10. Mettre à Jour un Item de la Checklist d'Onboarding

*   **Endpoint:** `POST /api/v1/user/onboarding/checklist-item`
*   **Méthode:** `POST`
*   **Description:** Notifie le backend qu'un item de la checklist d'onboarding est complété.
*   **Authentification:** Requise.
*   **Corps de la Requête:**
    ```json
    {
      "itemKey": "connectedWallet",
      "isCompleted": true
    }
    ```
    *   `itemKey` (string, requis): Clé de l'item (ex: "connectedWallet", "exploredTemplates").
    *   `isCompleted` (boolean, requis).
*   **Réponse Succès (`200 OK` ou `204 No Content`):**
    ```json
    // Optionnel: Réponse 200 OK avec le nouvel état
    // {
    //   "message": "Statut item checklist mis à jour.",
    //   "updatedChecklist": { "connectedWallet": true, ... }
    // }
    ```
*   **Erreurs:** `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`.
*   **Logique Backend:** Auth user, valide payload, récupère `UserDBSchema`, màj `onboardingState.checklist.{itemKey}`, sauvegarde.

### 11. Récupérer l'État d'Onboarding de l'Utilisateur

*   **Endpoint:** `GET /api/v1/user/onboarding-status`
*   **Méthode:** `GET`
*   **Description:** Récupère l'état actuel de l'onboarding (checklist, tutoriel complété).
*   **Authentification:** Requise.
*   **Réponse Succès (`200 OK`):**
    ```json
    {
      "tutorialCompleted": true,
      "checklist": {
        "connectedWallet": true,
        "exploredTemplates": false
        // ... autres items
      }
    }
    ```
    *   Retourne valeurs par défaut (false) si `onboardingState` non défini en DB.
*   **Erreurs:** `401 Unauthorized`, `500 Internal Server Error`.
*   **Logique Backend:** Auth user, récupère `UserDBSchema`, retourne `onboardingState` ou valeurs par défaut.
