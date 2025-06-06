## L4-M6.1: Formulaire de Création NFT ERC-721 MVP (Option 1: URL Métadonnées Externe)

**Objectif:** Décrire l'UI/UX du formulaire de création NFT ERC-721 (métadonnées via URL de base externe).

### 1. Structure Générale
*   Accessible via menu "Créer Collection NFT". Structuré en sections (`Card`s).

### 2. Sections et Champs du Formulaire

**Section 1: Informations Générales du Projet**
*   **Nom Projet (`userGivenName`):** `Input` text. Tooltip.
*   **Choix Réseau (`networkName`):** `Select` (Ethereum, Polygon etc.). Tooltip.

**Section 2: Configuration de la Collection NFT ERC-721**
*   **Sous-section: Identité Collection**
    *   **Nom Collection (`collectionConfig.name`):** `Input` text. Validation. Tooltip.
    *   **Symbole Collection (`collectionConfig.symbol`):** `Input` text. Validation. Tooltip.
*   **Sous-section: Métadonnées (Option 1: URL Base Externe)**
    *   **Titre Explicatif & Texte d'Aide:** Expliquer que l'utilisateur héberge ses JSON (nommés par Token ID, ex: `1.json`) et fournit l'URL du dossier.
    *   **URL Base Métadonnées (`collectionConfig.baseTokenURI`):** `Input` type URL. Label. Placeholder "ipfs://CID_FOLDER/". Validation (requis, URL valide, finir par `/`). Tooltip crucial. Lien vers guide IPFS.
*   **Sous-section: Royalties (EIP-2981)**
    *   **Adresse Receveur (`collectionConfig.royalties.receiver`):** `Input` adresse. Validation. Tooltip.
    *   **% Royalties (`collectionConfig.royalties.fractionBps`):** `Input` numérique. Label "Pourcentage Royalties (ex: 2.5 pour 2.5%)". Validation (0-100). Tooltip (conversion en BPS par backend).
*   **Sous-section: Fonctionnalités Optionnelles**
    *   **Pausable (`collectionConfig.features.pausable`):** `Checkbox`/`Switch`. Label "Permettre pause transferts?". Défaut `true`. Tooltip.
    *   *(Burnable est activé par défaut dans le contrat ERC721MVP.sol)*
*   **Sous-section: Propriétaire Contrat (Optionnel)**
    *   **`collectionConfig.initialOwner`:** `Input` adresse. Placeholder/Défaut: wallet connecté. Tooltip.

**Section 3: Récapitulatif & Déploiement**
*   Affichage dynamique: Nom Collection, Symbole, Réseau, URL Base Métadonnées, Royalties, Pausable.
*   Avertissements: Irréversibilité, gas, importance URL base.
*   Bouton "Déployer Collection NFT".

### 3. Expérience Utilisateur (UX)
*   Guidage clair pour `baseTokenURI` (exemples, liens guides).
*   Explication claire royalties (% vs BPS).
*   Validation robuste.
