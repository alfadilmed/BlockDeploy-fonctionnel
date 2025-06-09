## L5-M4.2: Mises à Jour de la Documentation Utilisateur (Lot 5: Dashboard Enrichi, Checklist, Academy)

**Objectif:** Identifier le contenu à ajouter/mettre à jour dans la doc utilisateur.

### 1. Mises à Jour Guide "Naviguer et Utiliser votre Dashboard BlockDeploy"
*   **Section "Détail Contrat":**
    *   **ERC-20:** Expliquer nouvelle info `isPaused`. Nouvelle sous-section "Actions sur votre contrat ERC-20":
        *   Utilisation boutons "Mettre en Pause" / "Reprendre" (si Pausable & propriétaire/rôle).
        *   Utilisation bouton "Minter des Tokens" (si `ERC20Advanced` Capped & `MINTER_ROLE`).
    *   **NFT ERC-721:** Expliquer nouvelles "Données On-Chain" (`totalSupply`). Nouvelle sous-section "Galerie de vos NFTs Mintés" (si L5-M1.3). Nouvelle sous-section "Minter un nouveau NFT" (si L5-M1.4, `safeMint(to)` par propriétaire).
    *   **MàJ FAQ Dashboard:** "Comment pauser mon token ?", "Comment minter plus de tokens (ERC-20 Capped) ?", "Comment minter un NFT de ma collection ?".

### 2. Nouveau Guide: "Votre Checklist de Démarrage BlockDeploy"
*   **Contenu:** Intro checklist (utilité, accès). Description chaque item (L5-M2.3): `connectedWallet`, `exploredTemplates`, `deployedTestContract`, `consultedGlossaryOrHelp`, `viewedContractOnExplorer`, `interactedWithContract` (opt.). Comment la checklist se met à jour. Comment masquer.

### 3. Page Principale Mini-Academy (`/academy`)
*   **Contenu:** S'assurer que la page liste les articles de L5-M3.1 ("Smart Contract", "ERC-20", "NFTs", et optionnels "Choisir Réseau", "Gas Fees"). Titre cliquable + brève description par article.

### 4. Mises à Jour Articles Existants
*   **Guide ERC-20:** Mentionner actions "Pause"/"Mint" depuis dashboard. Lien guide Dashboard.
*   **Guide NFT ERC-721:** Mentionner mint depuis dashboard. Lien guide Dashboard.
*   **Page "Aide / Premiers Pas":** Ajouter lien guide "Votre Checklist de Démarrage". Vérifier lien vers `/academy`.

Ces MàJ aideront les utilisateurs avec les nouvelles fonctionnalités du Lot 5.
