## L4-M7 (Stretch Goal): Intégration IPFS Simplifiée (Option 2 pour NFT)

**Objectif:** Décrire l'upload simplifié vers IPFS des métadonnées d'un NFT (typiquement le premier) via BlockDeploy.

**Contexte:** Stretch Goal Lot 4. Alternative à la fourniture manuelle d'une `baseTokenURI`.

### 1. Modifications Formulaire Création NFT ERC-721 (Frontend - L4-M7.2)
*   Dans section "Métadonnées", choix :
    *   **Option 1:** "Utiliser URL de Base Externe" (existant).
    *   **Option 2 (Nouvelle):** "Configurer et Uploader Métadonnées via BlockDeploy".
*   **Si Option 2 sélectionnée (pour un seul NFT initial):**
    *   **Nom NFT (`nftData.name`):** `Input` text.
    *   **Description NFT (`nftData.description`):** `Textarea`.
    *   **Fichier Image NFT (`nftData.imageFile`):** Upload de fichier (JPG, PNG, GIF). Preview image.
    *   **Attributs (Traits) NFT (`nftData.attributes`):** UI simple pour paires clé/valeur.

### 2. Logique Backend (API et Services - L4-M7.1)
*   **API (`POST /api/v1/deploy/nft-erc721-mvp`):** Payload `collectionConfig` ou section accepte `nftData` et `imageFile` (multipart/form-data). Flag `metadataOption: "upload"`.
*   **Service Upload IPFS (Nouveau ou Extension `DeploymentService`):**
    1.  Réception image.
    2.  **Upload Image sur IPFS** (via SDK Pinata/NFT.storage). Récupère `imageCID`.
    3.  **Génération JSON Métadonnées:**
        ```json
        // {
        //   "name": "nftData.name",
        //   "description": "nftData.description",
        //   "image": "ipfs://{imageCID}",
        //   "attributes": [ { "trait_type": "...", "value": "..." } ]
        // }
        ```
    4.  **Upload JSON Métadonnées sur IPFS.** Récupère `metadataCID`.
    5.  **Préparation `constructorArgs` pour `ERC721MVP.sol`:**
        *   Stratégie pour `baseTokenURI_` et `tokenURI` initial (pour `tokenId` 1):
            *   `baseTokenURI_` peut être vide.
            *   Le mint initial (dans le worker, après déploiement contrat) se fera avec `tokenURI = "ipfs://{metadataCID}"` pour le premier token.
    6.  **Ajout à `deploymentQueue`:** `DeploymentJobData` inclut infos pour mint initial avec URI spécifique.

### 3. Expérience Utilisateur (UX)
*   Simplicité pour créer un premier NFT sans comprendre IPFS en détail.
*   Feedback d'upload.
*   Limitations : Clairement indiquer que c'est pour UN NFT initial. Pour une collection, Option 1 (URL base) ou outils externes.
*   Transparence sur coûts IPFS potentiels (via service BlockDeploy).

### 4. Considérations
*   Dépendance service IPFS tiers (clés API, limites).
*   Gestion erreurs upload IPFS.
*   Focus sur NFT unique / premier item pour cette option simplifiée.

Cette Option 2 réduirait la barrière à l'entrée pour la création de NFTs.
