## L4-M8.2: Mises à Jour de la Documentation Utilisateur (Lot 4: ERC-20 Amélioré & NFT ERC-721 MVP)

**Objectif:** Identifier le contenu à ajouter/mettre à jour dans la doc utilisateur.

### 1. Mises à Jour Guide "Déployer votre Token ERC-20 Personnalisé"
*   **Ajouter Section/Option "Choisir Type de Token ERC-20":**
    *   Différence "Standard" (MVP) vs "Avancé".
    *   **Token ERC-20 Avancé:** Expliquer `Mintable` (par rôles si Capped via `MINTER_ROLE` pour `initialAdmin`), `initialAdmin` et ses rôles (`DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, `PAUSER_ROLE`).
*   **MàJ Captures d'Écran Formulaire:** Inclure options "Avancé".
*   **FAQ ERC-20 Avancé:** "Comment autoriser autres à minter ?", "Différence owner/minter ?".

### 2. Nouveau Guide: "Créer votre Collection NFT ERC-721 avec BlockDeploy"
*   **Contenu:**
    *   Intro NFT ERC-721, cas d'usage. Prérequis (wallet, fonds test, métadonnées).
    *   **Partie 1: Préparation Métadonnées (Option 1 - `baseTokenURI`)**:
        *   Standard JSON ERC-721 Metadata. Hébergement IPFS (Pinata/NFT.storage guide simplifié), création JSONs (ex: `1.json`), obtention CID dossier, formatage `baseTokenURI` (avec `/` final).
    *   **Étapes Création Collection (Formulaire L4-M6.1):**
        1.  Accès formulaire.
        2.  Infos Générales Projet (Nom projet, Réseau).
        3.  Config Collection NFT: Identité (Nom, Symbole), Métadonnées (Option 1: champ `baseTokenURI`), Royalties (Receveur, % -> BPS), Fonctionnalités (Pausable), Propriétaire Initial.
        4.  Récapitulatif & Déploiement.
    *   **Après Déploiement:** Retrouver collection sur Dashboard. **Comment Minter NFTs** (MVP: via Etherscan/Polygonscan `safeMint` ou `safeMintWithId`, expliquant lien `tokenId` et `baseTokenURI`). Visualiser sur OpenSea Testnet.
    *   **FAQ NFT ERC-721:** Changer `baseTokenURI`? Fonctionnement royalties? Problèmes affichage image NFT?
    *   **(Si L4-M7 implémenté) Partie 2: Upload Premier NFT via BlockDeploy (Option 2 IPFS Simplifié)**: Expliquer UI upload image/métadonnées, clarifier que c'est pour 1er NFT/unique.

### 3. Mise à Jour Glossaire (`GLOSSARY.md`)
*   **Termes:** AccessControl, MINTER_ROLE, PAUSER_ROLE, DEFAULT_ADMIN_ROLE, EIP-2981, baseTokenURI, Metadata (NFT JSON), Pinata, NFT.storage.

### 4. Mise à Jour Page "Aide / Premiers Pas" (`GETTING_STARTED.md`)
*   Ajouter lien vers nouveau guide "Créer votre Collection NFT ERC-721".

Ces MàJ sont cruciales pour les fonctionnalités du Lot 4.
