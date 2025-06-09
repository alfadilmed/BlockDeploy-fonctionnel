## L3-M6.1: Concept de Tests pour Dashboard MVP & Onboarding Initial (Lot 3)

**Objectif:** Décrire les scénarios de test conceptuels pour valider les fonctionnalités du Dashboard MVP et de l'Onboarding Initial.

### 1. Prérequis Généraux (Conceptuels)
*   Utilisateur de test authentifié.
*   Plusieurs contrats ERC-20 MVP déployés (conceptuellement) par l'utilisateur (statuts variés, réseaux variés).
*   APIs Backend du Lot 3 fonctionnelles (conceptuellement).

### 2. Scénarios de Test pour le Dashboard MVP

**a. Page "Mes Contrats" (`/dashboard/my-contracts`) - L3-M2.1**
*   **TST-DASH-LC-001:** Affichage liste contrats (infos clés, pagination).
*   **TST-DASH-LC-002:** Filtre par Réseau.
*   **TST-DASH-LC-003:** Filtre par Statut.
*   **TST-DASH-LC-004:** Combinaison Filtres.
*   **TST-DASH-LC-005:** Recherche (nom projet/adresse).
*   **TST-DASH-LC-006:** Liens Explorateur de Blocs.
*   **TST-DASH-LC-007:** Navigation vers Page Détail.
*   **TST-DASH-LC-008:** État "Aucun Contrat".

**b. Page "Détail Contrat" (`/dashboard/deployment/:deploymentId`) - L3-M2.2**
*   **TST-DASH-DC-001:** Affichage Infos Générales Déploiement (pour statut `success`).
*   **TST-DASH-DC-002:** Affichage Configuration Initiale (ERC-20 MVP).
*   **TST-DASH-DC-003:** Affichage Données On-Chain (ERC-20 MVP, si `success`).
*   **TST-DASH-DC-004:** Comportement "Rafraîchir" Données On-Chain.
*   **TST-DASH-DC-005:** Affichage pour Déploiement `failed` (message erreur).
*   **TST-DASH-DC-006:** Affichage pour Déploiement `pending/processing`.

**c. Actions sur Contrat (Pause/Unpause - si L3-M5 implémenté)**
*   **TST-DASH-ACT-001:** Visibilité conditionnelle des boutons.
*   **TST-DASH-ACT-002:** Action "Mettre en Pause" (appel API, signature simulée, feedback UI, màj état).
*   **TST-DASH-ACT-003:** Action "Reprendre les Transferts".

### 3. Scénarios de Test pour l'Onboarding Initial

**a. Info-Bulles (Tooltips) sur Formulaire ERC-20 MVP (L3-M3.1)**
*   **TST-ONB-TT-001:** Présence et contenu correct des tooltips pour chaque champ cible.
*   **TST-ONB-TT-002:** Comportement responsif des tooltips.

**b. Page "Aide / Premiers Pas" (L3-M3.2)**
*   **TST-ONB-HP-001:** Accès et contenu de la page conforme à la doc.
*   **TST-ONB-HP-002:** Fonctionnalité des liens (vers guides, glossaire).

**c. Page Glossaire Web3 (L3-M4.1)**
*   **TST-ONB-GL-001:** Accès et contenu du glossaire conforme à la doc.
*   **TST-ONB-GL-002:** Lisibilité et structure.

Ces tests conceptuels visent à assurer l'intégration et l'UX des fonctionnalités du Lot 3.

---
## Extensions des Tests pour le Lot 5 (L5-M4.1)

### 4. Scénarios de Test pour les Actions de Contrat Enrichies (Dashboard - L5-M1)

**a. Action `mint` pour ERC-20 Advanced (L5-M1.2)**
*   **TST-DASH-ACT-ERC20-MINT-001:** Visibilité bouton/section "Minter des Tokens" (conditionnelle au rôle `MINTER_ROLE` et contrat Capped).
*   **TST-DASH-ACT-ERC20-MINT-002:** Action "Minter des Tokens" - Succès (appel API, Tx simulée, feedback UI, màj `totalSupply`).
*   **TST-DASH-ACT-ERC20-MINT-003:** Échec (Dépassement Cap).
*   **TST-DASH-ACT-ERC20-MINT-004:** Échec (Pas `MINTER_ROLE`).

**b. Affichage Détails On-Chain NFT & Galerie (L5-M1.3)**
*   **TST-DASH-NFTD-001:** Affichage `totalSupply` NFT et mise à jour post-mint.
*   **TST-DASH-NFTD-002:** Affichage Galerie Simple (si tokens mintés, `tokenURI` valides, images chargées depuis IPFS simulé). Infos au survol/clic.
*   **TST-DASH-NFTD-003:** Affichage Détails NFT Spécifique (`ownerOf`, `tokenURI`).

**c. Action `safeMint(to)` pour NFT ERC-721 (L5-M1.4)**
*   **TST-DASH-ACT-NFT-MINT-001:** Visibilité bouton/section "Minter un Nouveau NFT" (conditionnelle au propriétaire).
*   **TST-DASH-ACT-NFT-MINT-002:** Action "Minter un Nouveau NFT" - Succès (appel API, Tx simulée, feedback UI, màj `totalSupply`).
*   **TST-DASH-ACT-NFT-MINT-003:** Échec (Non Propriétaire).

### 5. Scénarios de Test pour la Checklist d'Onboarding (L5-M2)
*   **TST-ONB-CKL-001:** Affichage Initial Checklist pour nouvel utilisateur.
*   **TST-ONB-CKL-002:** Complétion Automatique item (ex: `exploredTemplates` via navigation). Vérif appel API.
*   **TST-ONB-CKL-003:** Persistance état checklist (déconnexion/reconnexion).
*   **TST-ONB-CKL-004:** Masquer/Réafficher checklist (persistance visibilité).
*   **TST-ONB-CKL-005:** Complétion tous items (message félicitations, masquage auto).

### 6. Scénarios de Test pour la Mini-Academy (Articles - L5-M3)
*   **TST-ACAD-NAV-001:** Accès Page Principale Academy (`/academy`), liste articles.
*   **TST-ACAD-NAV-002:** Accès Article Spécifique (contenu Markdown formaté).
*   **TST-ACAD-NAV-003:** Liens depuis "Aide / Premiers Pas" et "Glossaire" vers Academy fonctionnels.

Ces tests conceptuels couvrent les nouvelles fonctionnalités du Lot 5.
