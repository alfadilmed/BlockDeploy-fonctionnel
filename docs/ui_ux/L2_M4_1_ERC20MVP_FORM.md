## L2-M4.1: Formulaire de Configuration UI/UX pour ERC-20 MVP

**Objectif:** Décrire l'interface et l'expérience utilisateur pour le formulaire de création d'un token ERC-20 MVP.

### 1. Structure Générale
Formulaire multi-sections utilisant les composants UI du Lot 1 (`Card`, `Input`, `Select`, `Checkbox`, `Button`, `Tooltip`, `Alert`, `Typography`).

### 2. Sections et Champs du Formulaire

**Section 1: Informations Générales du Projet**
*   **Nom du Projet/Déploiement (`userGivenName`):** `Input` text. Tooltip explicatif.
*   **Choix du Réseau (`networkName`):** `Select` (Ethereum Sepolia/Mainnet, Polygon Mumbai/Mainnet). Logos réseaux. Tooltip sur Testnet/Mainnet.

**Section 2: Configuration du Token ERC-20**
*   **Sous-section: Identité du Token**
    *   **Nom du Token (`tokenConfig.name`):** `Input` text. Validation (requis, longueur). Tooltip.
    *   **Symbole du Token (`tokenConfig.symbol`):** `Input` text. Validation (requis, 3-5 alphanum maj). Tooltip.
    *   **Décimales:** `Text` (informatif, fixé à 18 pour MVP). Tooltip.
*   **Sous-section: Gestion de la Supply**
    *   **Type de Supply (`tokenConfig.supplyType`):** `Select` ou Radios ("Fixe", "Plafonnée/Capped").
    *   **Supply Initiale (`tokenConfig.initialSupply`):** `Input` numérique (string). Label conditionnel. Validation (requis, positif, `<=` cap si capped). Tooltip.
    *   **Plafond Maximum (`tokenConfig.cap`):** `Input` numérique (string). Visible si `supplyType` "capped". Validation (requis si capped, positif, `>=` initialSupply). Tooltip.
*   **Sous-section: Fonctionnalités Optionnelles (`tokenConfig.features`)**
    *   **Burnable (`tokenConfig.features.burnable`):** `Checkbox`/`Switch`. Label: "Permettre aux détenteurs de détruire (burn) leurs tokens ?". Défaut: `true`. Tooltip.
    *   **Pausable (`tokenConfig.features.pausable`):** `Checkbox`/`Switch`. Label: "Permettre au propriétaire de pauser les transferts ?". Défaut: `true`. Tooltip.

**Section 3: Récapitulatif & Déploiement (Preview)**
*   **Affichage Dynamique:** Nom, Symbole, Réseau, Type Supply, Supply Initiale/Totale, Plafond (si applicable), Fonctionnalités (Pausable Oui/Non, Burnable Oui/Non).
*   **Estimation Frais de Gas (Optionnel MVP):** Estimation pour réseau choisi.
*   **Avertissements:** Irréversibilité, frais de réseau.
*   **Bouton d'Action:** "Déployer Mon Token ERC-20". État `disabled` si formulaire invalide / mauvais réseau wallet.

### 3. Expérience Utilisateur (UX)
*   Guidage clair (labels, tooltips).
*   Validation progressive et à la soumission. Erreurs claires.
*   Feedback immédiat (champs conditionnels).
*   Prévention erreurs (ex: validation `cap >= initialSupply` frontend).
*   Simplicité et accessibilité.
*   Transparence (récapitulatif).

Ce formulaire sera la base pour la création des ERC-20 MVP.
