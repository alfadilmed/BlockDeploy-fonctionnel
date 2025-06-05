## Axe 2: Créateur NFT Avancé (ERC-721 & ERC-1155)

Objectif : Offrir une solution flexible pour créer et gérer des collections NFT, supportant les standards courants et des fonctionnalités clés comme les royalties et le stockage décentralisé.

### 1. Features (Fonctionnalités Utilisateur)

*   **F2.1: Choix du Standard de Contrat NFT**
    *   ERC-721: Pour les NFTs uniques (art, collectibles uniques).
    *   ERC-1155: Pour les NFTs multi-tokens (items de jeu, éditions multiples d'une œuvre).
*   **F2.2: Configuration de Base de la Collection**
    *   Nom de la Collection (ex: "CryptoPunks Remastered")
    *   Symbole (ex: "CPR")
    *   (Pour ERC-1155) URI de base du contrat (peut être modifié ultérieurement par le propriétaire).
*   **F2.3: Gestion des Métadonnées et Stockage (IPFS)**
    *   **Option 1 (Simple - MVP):** L'utilisateur fournit une URL de base pour les métadonnées (ex: un répertoire IPFS déjà uploadé, ou une API centralisée). Le tokenID sera ajouté à cette URL.
    *   **Option 2 (Avancée - Post-MVP ou si faisable):** Interface d'upload direct des images et des attributs des NFTs.
        *   Pour chaque NFT (ou type de NFT pour ERC-1155) : Nom, Description, Image, Attributs (traits).
        *   Le système génère le JSON de métadonnées et l'uploade sur un service IPFS (Pinata, NFT.storage, Infura IPFS) via l'API du service.
        *   Le `tokenURI` (ERC-721) ou l'URI du `setTokenURI` (ERC-1155) pointe vers le CID IPFS du JSON.
    *   **Batch Upload (pour Option 2):** Permettre l'upload d'un fichier CSV/JSON avec les métadonnées et les liens vers les images pour plusieurs NFTs en une fois.
*   **F2.4: Configuration du Minting**
    *   **Minting par le Propriétaire (Owner Mint):** Seul le propriétaire du contrat peut minter de nouveaux NFTs.
        *   Pour ERC-721: minter un tokenID spécifique.
        *   Pour ERC-1155: minter une quantité d'un tokenID spécifique.
    *   **(Optionnel - Post MVP) Minting Public/Payant (Lazy Minting):**
        *   Définir un prix de mint, une supply maximale pour la collection (ou par tokenID pour ERC-1155).
        *   Les utilisateurs peuvent payer pour minter un NFT.
        *   *Lazy Minting: les métadonnées sont prêtes, le NFT n'est réellement minté (et les frais payés) que lors du premier achat/transfert.*
*   **F2.5: Royalties (EIP-2981)**
    *   Permettre à l'utilisateur de définir un pourcentage de royalties (ex: 5%).
    *   Définir l'adresse du destinataire des royalties.
    *   Le contrat implémentera l'interface EIP-2981 pour que les marketplaces compatibles puissent verser les royalties.
*   **F2.6: Fonctionnalités Optionnelles du Contrat (Similaires à ERC-20)**
    *   **Burnable (par les détenteurs ou propriétaire):** Permettre la destruction de NFTs.
    *   **Pausable (transferts):** Mettre en pause les transferts de NFTs.
    *   **Supply Maximale (pour la collection ERC-721 ou par ID pour ERC-1155 si minting public).**
*   **F2.7: Rôles et Permissions (AccessControl)**
    *   **Owner/Admin:** Droits complets (mint, configuration des royalties, pause, etc.).
    *   **(Optionnel) `MINTER_ROLE`:** Pour déléguer le droit de mint.

### 2. Sous-Tâches Techniques (Backend & Smart Contract)

*   **ST2.1: Développement des Smart Contracts NFT (Solidity)**
    *   Contrat ERC-721 de base: Basé sur OpenZeppelin `ERC721.sol`, `ERC721URIStorage.sol` (si les métadonnées sont gérées par token), `ERC721Burnable.sol`, `Pausable.sol`, `AccessControl.sol`.
    *   Contrat ERC-1155 de base: Basé sur OpenZeppelin `ERC1155.sol`, `ERC1155Burnable.sol`, `ERC1155Pausable.sol`, `AccessControl.sol`.
    *   Implémenter l'interface `IERC2981.sol` (Royalties) pour les deux types de contrats.
    *   Logique de minting (owner mint, capped supply).
    *   Gestion des URI (setter pour l'URI de base ou par token).
*   **ST2.2: API Backend pour Configuration et Déploiement NFT**
    *   Endpoint `POST /api/v1/nft/configure` : Sauvegarde la configuration (type de contrat, nom, symbole, options).
    *   Endpoint `POST /api/v1/nft/deploy` : Déploie le contrat NFT configuré.
*   **ST2.3: Intégration Service IPFS (si Option 2 pour métadonnées)**
    *   Backend: API pour recevoir les fichiers/données de métadonnées.
    *   Backend: Utiliser le SDK/API d'un service IPFS (Pinata, NFT.storage) pour uploader les fichiers et les JSON de métadonnées.
    *   Stocker les CIDs IPFS retournés.
*   **ST2.4: Gestion des Métadonnées**
    *   Backend: Générer les fichiers JSON de métadonnées conformément aux standards OpenSea/LooksRare.
*   **ST2.5: Tests Unitaires et d'Intégration**
    *   Tests Solidity pour ERC-721 et ERC-1155 avec toutes les fonctionnalités.
    *   Tests API pour la configuration, le déploiement, et l'upload sur IPFS.

### 3. UI/UX (Frontend)

*   **UI3.1: Formulaire de Création de Collection NFT**
    *   Choix clair entre ERC-721 et ERC-1155 avec explications.
    *   Champs pour nom, symbole.
    *   Interface pour la configuration des métadonnées (simple URL de base ou uploadeur de fichiers).
    *   Options pour royalties (pourcentage, adresse).
    *   Cases à cocher pour fonctionnalités optionnelles (burnable, pausable, supply max).
*   **UI3.2: Gestionnaire de Métadonnées (si Option 2)**
    *   Interface pour ajouter des items NFT (image, nom, description, attributs).
    *   Prévisualisation du NFT.
    *   Pour ERC-1155, gestion des différents token IDs et leurs métadonnées/supply.
    *   Option de batch upload (glisser-déposer un CSV/JSON).
*   **UI3.3: Configuration du Minting**
    *   Options claires pour le type de minting (owner mint pour MVP).
*   **UI3.4: Récapitulatif et Déploiement**
    *   Affichage clair de toutes les options, y compris l'URI des métadonnées et les infos de royalties.
*   **UI3.5: Feedback Post-Déploiement**
    *   Similaire à ERC-20, avec lien vers le contrat sur explorateur.

### 4. Dépendances

*   **D4.1 - D4.6:** Mêmes dépendances que pour le module ERC-20 (Auth, Wallet Connect, Sélection Réseau, Backend, RPC, UI Base).
*   **D4.7: Service de Stockage IPFS Externe (Pinata, NFT.storage):** Nécessite un compte et des clés API pour le backend si l'upload est géré par la plateforme.
*   **D4.8: Bibliothèques Frontend pour l'Upload (si Option 2):** Ex: `react-dropzone`.

### 5. Ordre de Développement Priorisé (Suggestion)

1.  **Priorité 1 (MVP ERC-721):**
    *   Smart Contract: ERC-721 simple (nom, symbole), owner mint, burnable, pausable, royalties EIP-2981. Métadonnées via URL de base fournie par l'utilisateur (F2.3 Option 1).
    *   Backend: API pour config/déploiement de cette version.
    *   Frontend: Formulaire pour ERC-721 avec les options ci-dessus.
2.  **Priorité 2 (Intégration IPFS pour ERC-721):**
    *   Backend: Intégration service IPFS pour upload image + génération/upload JSON métadonnées (F2.3 Option 2 pour un seul item à la fois).
    *   Frontend: Interface d'upload simple pour un NFT (nom, desc, image, attributs).
3.  **Priorité 3 (Support ERC-1155 MVP):**
    *   Smart Contract: ERC-1155 simple (similaire à ERC-721 MVP mais adapté pour 1155). Métadonnées via URL de base.
    *   Backend/Frontend: Adapter les API et formulaires pour ERC-1155.
4.  **Priorité 4 (Améliorations NFT):**
    *   Batch upload de métadonnées.
    *   Fonctionnalités plus avancées (supply max, rôles plus fins).
    *   Lazy minting (probablement Phase 2 de la roadmap globale).

### 6. Progressive Delivery

*   **ERC-721 d'abord:** Lancer le module NFT uniquement avec le support ERC-721.
*   **Métadonnées URL externe d'abord:** Commencer par l'option où l'utilisateur gère lui-même l'upload IPFS et fournit l'URL.
*   **Feature Flag pour l'upload IPFS intégré:** Activer l'upload direct via la plateforme pour un groupe de testeurs.
*   **Feature Flag pour ERC-1155:** Introduire ERC-1155 après stabilisation de ERC-721.

### 7. Prérequis Critiques

*   **P7.1 - P7.5 (Identiques à ERC-20):** Standardisation UI, Architecture backend déploiement, BD, Auth, Sélection Réseau.
*   **P7.6: Décision et Configuration du Service IPFS:** Choisir un fournisseur (Pinata, NFT.storage), obtenir les clés API, comprendre leurs limites et coûts.
*   **P7.7: Compréhension Claire des Standards de Métadonnées NFT:** Pour assurer la compatibilité avec les marketplaces.

### 8. Exemples de Code / Structure (Suggestion)

#### a. Smart Contract ERC-721 avec Royalties (Pseudo-code Solidity)

```solidity
// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20; // Real file needs this uncommented

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/cryptography/draft-EIP2981.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";

// contract AdvancedNFT { // Simplified for Markdown
//     // ... (content as previously detailed)
// }
```

#### b. Structure API pour Upload Métadonnées sur IPFS (Backend - Pseudo-code Express.js)

```javascript
// // nftController.js
// const pinataSDK = require('@pinata/sdk');
// // const pinata = pinataSDK('YOUR_PINATA_API_KEY', 'YOUR_PINATA_SECRET_API_KEY');

// // app.post('/api/v1/nft/upload-metadata', async (req, res) => {
// //   // ... (content as previously detailed)
// // });
```
