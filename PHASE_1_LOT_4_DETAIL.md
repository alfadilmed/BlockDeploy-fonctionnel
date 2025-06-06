## Plan Détaillé – Phase 1 / Lot 4: ERC-20 Amélioré & NFT ERC-721 MVP

**Objectif du Lot 4:** Introduire des fonctionnalités avancées pour ERC-20 (Mintable avec rôles) et lancer la création de NFTs ERC-721 (métadonnées via URL externe puis upload IPFS simplifié).

### Milestones Suggérées pour le Lot 4

*   **L4-M1: Améliorations Smart Contract ERC-20** (Contrat `ERC20Advanced.sol` avec `Mintable` via `MINTER_ROLE` via `AccessControl`, MàJ config DB).
*   **L4-M2: Intégration Backend ERC-20 Amélioré** (Adaptation API déploiement, API optionnelle gestion rôles).
*   **L4-M3: Frontend ERC-20 Amélioré** (MàJ formulaire création).
*   **L4-M4: Smart Contract NFT ERC-721 MVP & Config** (Contrat `ERC721MVP.sol` avec royalties EIP-2981, config DB pour URL métadonnées).
*   **L4-M5: Backend NFT ERC-721 MVP (Option 1 IPFS - URL Externe)** (API déploiement avec `baseTokenURI`).
*   **L4-M6: Frontend NFT ERC-721 MVP (Option 1 IPFS - URL Externe)** (Formulaire création NFT avec champ `baseTokenURI`).
*   **L4-M7 (Stretch Goal): Intégration IPFS Simplifiée (Option 2 NFT)** (Backend: Intégration service IPFS pour upload image/JSON unique. Frontend: UI pour upload simple).
*   **L4-M8: Tests & Documentation** (E2E, docs utilisateur).

---

### 1. ERC-20 Amélioré (Mintable & AccessControl)
*   **L4-M1.1: Smart Contract `ERC20Advanced.sol`:** Hérite `AccessControl.sol`. Rôle `MINTER_ROLE`. Constructeur accorde `DEFAULT_ADMIN_ROLE` & `MINTER_ROLE` à `initialOwner`. `mint()` requiert `onlyRole(MINTER_ROLE)`. `Pausable`/`Burnable` via `Ownable` (ou rôles dédiés plus tard).
*   **L4-M1.2: Config DB:** Nouveau template "ERC20Adv_Capped_MintPausBurn_v1" dans `SmartContractTemplateDBSchema`. `supportedFeatures.mintable = true`.
*   **L4-M2.1 & L4-M2.2: API Backend:** Endpoint déploiement ERC-20 gère option "Mintable". (Opt.) Endpoint `POST /api/v1/contracts/:network/:address/roles/minter` pour gérer `MINTER_ROLE`.
*   **L4-M3.1: Frontend:** Formulaire ERC-20 avec option "Permettre à d'autres adresses de minter ?" (si Capped).

### 2. NFT ERC-721 MVP
*   **L4-M4.1: Smart Contract `ERC721MVP.sol`:** Basé sur OpenZeppelin (`ERC721`, `ERC721Burnable`, `ERC721Pausable` (si feature MVP), `EIP2981`, `Ownable`). Constructeur: `name_`, `symbol_`, `initialOwner_`, `royaltyReceiver_`, `royaltyFraction_`. `safeMint(to, tokenId, tokenURI)` par `Ownable`.
*   **L4-M4.2: Config DB:** Template "ERC721MVP_Std_RoyaltyPausBurn_v1". `configurableParameters`: `name`, `symbol`, `royaltyReceiver`, `royaltyFractionBps`.
*   **L4-M5 (Backend - Option 1 IPFS):** API `POST /api/v1/deploy/nft-erc721-mvp`. Payload inclut `collectionConfig.baseTokenURI` (fourni par user). `constructorArgs` préparés. Ajout à queue.
*   **L4-M6 (Frontend - Option 1 IPFS):** Formulaire création NFT: config contrat + champ `baseTokenURI`.
*   **L4-M7 (Stretch Goal - Option 2 IPFS - Upload Simplifié):**
    *   **Backend:** API (ou extension) accepte `nftData: { name, description, imageFile, attributes }`. Uploade image sur IPFS -> `imageCID`. Génère JSON métadonnées (avec `image: "ipfs://{imageCID}"`), uploade JSON sur IPFS -> `metadataCID`. `tokenURI` pour `safeMint` sera `ipfs://{metadataCID}`.
    *   **Frontend:** UI pour upload image simple et saisie métadonnées pour le premier NFT.
*   **L4-M8: Tests & Documentation:**
    *   E2E ERC-20 Advanced (minting via rôle). E2E NFT ERC-721 (Option 1 & 2 si faite), vérifier `tokenURI` & OpenSea Testnet.
    *   MàJ Guide ERC-20 (option Mintable). Nouveau Guide "Créer Collection NFT ERC-721" (détailler options métadonnées IPFS).

---
Ce document guide le développement du Lot 4.
