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
    *(Détails comme précédemment)*
---
### 9. Exécuter des Actions sur un Contrat NFT ERC-721 (Lot 5 - L5-M1.4)

*   **Endpoint:** `POST /api/v1/contracts/:networkName/:contractAddress/nft-erc721-action`
    *(Détails comme précédemment)*
---
## Endpoints pour l'Onboarding Utilisateur (Lot 5 - L5-M2.1)

### 10. Mettre à Jour un Item de la Checklist d'Onboarding

*   **Endpoint:** `POST /api/v1/user/onboarding/checklist-item`
    *(Détails comme précédemment)*

### 11. Récupérer l'État d'Onboarding de l'Utilisateur

*   **Endpoint:** `GET /api/v1/user/onboarding-status`
    *(Détails comme précédemment)*
---
### 12. Proposer une Nouvelle Transaction pour un Safe (DAO) (Lot 6 - L6-M3.1)

*   **Endpoint:** `POST /api/v1/dao/:networkName/:safeAddress/propose-transaction`
    *(Détails comme précédemment)*
---
### 13. Soumettre une Transaction Safe Signée (DAO) (Lot 6 - L6-M3.2)

*   **Endpoint:** `POST /api/v1/dao/:networkName/:safeAddress/submit-signed-transaction`
*   **Méthode:** `POST`
*   **Description:** Soumet une transaction Safe, préalablement préparée et signée par un propriétaire, au Safe Transaction Service.
*   **Authentification:** Requise.
*   **Paramètres d'URL:** `networkName`, `safeAddress`.
*   **Corps de la Requête:**
    ```json
    {
      "safeTransactionData": {
        "to": "0x...", "value": "0", "data": "0x...", "operation": 0,
        "safeTxGas": "0", "baseGas": "0", "gasPrice": "0",
        "gasToken": "0x0...", "refundReceiver": "0x0...", "nonce": 123
      },
      "senderAddress": "0xSignerAddress...",
      "signature": "0xSignatureString...",
      "safeTxHash": "0xTransactionHashThatWasSigned..." // Optionnel pour vérification backend
    }
    ```
*   **Réponse Succès (`200 OK` ou `201 Created`):**
    ```json
    {
      "message": "Transaction signée soumise avec succès au Safe Transaction Service.",
      "safeTxHash": "0xTransactionHashThatWasSigned...",
      "status": "PENDING_CONFIRMATIONS" // Ou statut similaire du Transaction Service
    }
    ```
*   **Erreurs:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`.

---
### 14. Lister les Transactions d'un Safe (DAO) (Lot 6 - L6-M3.3)

*   **Endpoint:** `GET /api/v1/dao/:networkName/:safeAddress/transactions`
*   **Méthode:** `GET`
*   **Description:** Récupère la liste des transactions (propositions) d'un Safe via le Safe Transaction Service.
*   **Authentification:** Requise (pour visualiser via BlockDeploy).
*   **Paramètres d'URL:** `networkName`, `safeAddress`.
*   **Paramètres de Requête (Query):**
    *   `executed` (boolean, opt.): Filtre transactions exécutées.
    *   `queued` (boolean, opt., défaut: `true`): Inclut tx en attente de signatures / prêtes à être exécutées.
    *   `limit` (number, opt., défaut: 10).
    *   `offset` (number, opt., défaut: 0).
    *   *(Note: Paramètres exacts dépendent du support de `@safe-global/api-kit`)*
*   **Réponse Succès (`200 OK`):** Structure basée sur la réponse du Safe Transaction Service.
    ```json
    {
      "data": [
        {
          "safeTxHash": "0x...", "to": "0x...", "value": "0", "data": "0x...",
          "operation": 0, "nonce": 123, "submissionDate": "...", "isExecuted": false,
          "confirmationsRequired": 2, "confirmations": [ { "owner": "0x...", "signature": "0x..." } ]
          // ... autres champs du Safe Transaction Service ...
        }
      ],
      "pagination": { "offset": 0, "limit": 10, "count": 1 /* ... */ }
    }
    ```
*   **Erreurs:** `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`.

**Logique Backend (Conceptuel):**
1.  Validation, Auth.
2.  Init `EthAdapter` & `SafeApiKit` (avec URL Safe Transaction Service du réseau).
3.  Utiliser `apiKit.getPendingTransactions(safeAddress)` ou `apiKit.getAllTransactions(safeAddress, { options })`.
4.  Formater si besoin et retourner réponse.
