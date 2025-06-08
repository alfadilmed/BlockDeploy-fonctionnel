## Plan Détaillé – Phase 1 / Lot 5: Enrichissement Dashboard & Onboarding

**Objectif du Lot 5:** Améliorer le Dashboard avec plus de données on-chain et actions interactives. Introduire une checklist d'onboarding et les premiers articles de la Mini-Academy.

### Milestones Suggérées pour le Lot 5

*   **L5-M1: Dashboard - Données On-Chain Enrichies & Actions Basiques (Suite)**
    *   L5-M1.1: (ERC-20) Finaliser actions `pause`/`unpause` (API & UI). Étendre API `/erc20-details` pour infos rôles (opt.).
    *   L5-M1.2: (ERC-20 Advanced) UI & API (préparer Tx non signée) pour action `mint` par propriétaire/`MINTER_ROLE`.
    *   L5-M1.3: (NFT ERC-721) API & UI pour détails on-chain NFT (`ownerOf`, `tokenURI`), galerie simple (si `tokenURI` lisible).
    *   L5-M1.4: (NFT ERC-721) UI & API (préparer Tx non signée) pour action `safeMint(toAddress)` par propriétaire.
*   **L5-M2: Onboarding - Checklist Utilisateur**
    *   L5-M2.1: Backend: MàJ `UserDBSchema` & API pour état checklist.
    *   L5-M2.2: Frontend: Composant UI `Checklist` interactif.
    *   L5-M2.3: Définition items checklist MVP & logique complétion.
*   **L5-M3: Mini-Academy - Premiers Articles**
    *   L5-M3.1: Intégration (Markdown) 3-5 articles fondamentaux (ex: Smart Contract, ERC-20, NFT).
    *   L5-M3.2: Navigation vers articles (depuis Aide, Glossaire).
*   **L5-M4: Tests & Documentation** (Tests conceptuels, MàJ docs utilisateur, `devlog/LOT_5_LOG.md`).

---

### 1. Dashboard - Données On-Chain Enrichies & Actions (L5-M1)
*   **L5-M1.1 (ERC-20 Pause/Unpause):** Finaliser API (préparer Tx non signée) & UI (boutons, signature wallet, feedback). État `paused` via API `/erc20-details`.
*   **L5-M1.2 (ERC-20 Advanced Mint):** Pour contrats Capped & user avec `MINTER_ROLE`. UI (Page Détail): inputs "Destinataire", "Montant". Bouton "Minter". API (`.../erc20-action` type `mint`) prépare Tx non signée.
*   **L5-M1.3 (NFT ERC-721 Détails):** API (`.../nft-erc721-details`) retourne `totalSupply`, et pour une liste de tokens (paginée, ex: appartenant au owner): `tokenURI(tokenId)`. UI (Page Détail NFT): Affiche `totalSupply`. Galerie simple (récupère JSON via `tokenURI` côté client, affiche image).
*   **L5-M1.4 (NFT ERC-721 Mint):** Pour user propriétaire. UI (Page Détail NFT): input "Destinataire". Bouton "Minter Prochain NFT" (utilise `safeMint(to)` du contrat). API (`.../nft-erc721-action` type `safeMint`) prépare Tx non signée.

### 2. Onboarding - Checklist Utilisateur (L5-M2)
*   **L5-M2.1 (Backend):** `UserDBSchema.onboardingState.checklist` (booléens par item). API `POST /api/v1/user/onboarding/checklist-item` ({itemKey, isCompleted}).
*   **L5-M2.2 (Frontend):** Widget `Checklist` (Dashboard). Récupère état via `GET /api/v1/user/onboarding-status`.
*   **L5-M2.3 (Items MVP):** `connectedWallet` (auto), `exploredTemplates` (visite page), `deployedTestContract` (event backend/vérif frontend), `consultedHelpPage`, `consultedGlossary` (visites pages).

### 3. Mini-Academy - Premiers Articles (L5-M3)
*   **L5-M3.1 (Contenu):** Créer fichiers Markdown (`docs/user_guides/articles/`) pour: "Qu'est-ce qu'un Smart Contract?", "Comprendre les ERC-20", "Les NFTs Expliqués". (Contenu à rédiger).
*   **L5-M3.2 (Navigation):** Page `/academy` ou `/guides` listant articles. Liens depuis "Aide / Premiers Pas" & Glossaire.

### 4. Tests & Documentation (L5-M4)
*   Tests conceptuels: Dashboard (données ERC20/NFT, actions mint/pause). Checklist (affichage, complétion). Academy (accès articles).
*   Doc Utilisateur: Guide "Gérer Contrats via Dashboard", "Checklist Démarrage". Annoncer articles Academy.
*   `devlog/LOT_5_LOG.md`.

---
Ce document guide le développement du Lot 5 de la Phase 1.
