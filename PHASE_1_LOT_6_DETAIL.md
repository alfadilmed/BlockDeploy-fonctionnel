## Plan Détaillé – Phase 1 / Lot 6: DAO Builder MVP (Basé sur Safe/Gnosis)

**Objectif du Lot 6:** Permettre la création et gestion de DAOs simples (multisigs Safe) via BlockDeploy.

### Milestones Suggérées pour le Lot 6

*   **L6-M1: Recherche & Architecture Safe{Core} SDK** (Étude SDKs Safe, Archi d'intégration backend).
*   **L6-M2: Backend - Création de DAO/Safe** (API `POST /api/v1/dao/create-safe`, logique déploiement Safe via SDK, stockage infos en DB).
*   **L6-M3: Backend - Gestion des Propositions de Transactions** (API `POST /api/v1/dao/:safeAddress/propose-transaction`, API `GET /api/v1/dao/:safeAddress/transactions`, logique interaction Safe Transaction Service).
*   **L6-M4: Frontend - Création de DAO/Safe** (Formulaire UI création Safe, appel API).
*   **L6-M5: Frontend - Visualisation DAO et Propositions (MVP)** (Liste DAOs, Détail DAO (owners, seuil, solde, txs), MVP pour signature/exécution via redirection UI Safe).
*   **L6-M6: Tests & Documentation** (Tests conceptuels, docs utilisateur, devlog).

---

### 1. Recherche & Architecture Safe{Core} SDK (L6-M1)
*   **L6-M1.1 (Étude SDKs):** Comprendre `@safe-global/protocol-kit`, `@safe-global/safe-factory-sdk`, `@safe-global/api-kit`. Fonctions clés pour déploiement, proposition, signature (conceptuelle), lecture.
*   **L6-M1.2 (Archi Intégration):** Backend BlockDeploy orchestre SDKs. Déploiement Safe via `safe-factory-sdk` (gas payé par backend). Interaction Safe Transaction Service (via `api-kit`) pour propositions et lecture. DB BlockDeploy stocke métadonnées Safes créés. Frontend pour création & visualisation. Signature MVP via redirection UI Safe.

### 2. Backend - Création de DAO/Safe (L6-M2)
*   **L6-M2.1 (API Création):** `POST /api/v1/dao/create-safe`. Payload: `{ networkName, owners[], threshold, userGivenName?, saltNonce? }`. Validation.
*   **L6-M2.2 (Logique Création):** User Auth. Signer backend. Init `EthAdapter`, `SafeFactory`. Déployer Safe (proxy). Stocker `safeAddress`, réseau, owners, seuil, nom, version mastercopy en DB. Répondre `safeAddress`.

### 3. Backend - Gestion Propositions de Transactions (L6-M3)
*   **L6-M3.1 (API Proposition):** `POST /api/v1/dao/:safeAddress/propose-transaction`. Payload: `{ to, value, data, operation? }`. User doit être owner.
    *   Logique: Init `Safe{Protocol Kit}`. Créer `MetaTransactionData`, puis `SafeTransaction`. User signe hash (via frontend). Backend reçoit signature, soumet à Safe Transaction Service via `apiKit.proposeTransaction()`.
*   **L3-M3.3 (API Lecture Txs):** `GET /api/v1/dao/:safeAddress/transactions`. Query params: `status`, `page`, `limit`.
    *   Logique: Utilise `apiKit` pour `getPendingTransactions()` ou `getAllTransactions()`.

### 4. Frontend - Création de DAO/Safe (L6-M4)
*   **L6-M4.1 (Formulaire UI):** Champs: Nom DAO (dashboard), Réseau, Liste `Input`s pour adresses `owners` (ajout/suppression), `Input` numérique `threshold` (validation `1 <= threshold <= owners.length`). Tooltips explicatifs.
*   **L6-M4.2 (Logique Appel API):** Soumission à `/dao/create-safe`. Feedback (Toast "Création...", "DAO créée à 0x...").

### 5. Frontend - Visualisation DAO & Propositions (MVP - L6-M5)
*   **L6-M5.1 (Liste DAOs):** Section Dashboard. Affiche: Nom, Adresse Safe (lien explorateur), Réseau, Owners/Seuil. Lien vers détail.
*   **L6-M5.2 (Détail DAO):** Infos (Nom, Adresse, Réseau, Owners, Seuil). Solde Safe (via `apiKit` ou on-chain). Liste Transactions (via API `/dao/:safeAddress/transactions`) avec statut, confirmations/seuil.
*   **L6-M5.3 (Signature/Exécution MVP):** Pour Tx en attente, si user est signataire: afficher détails Tx. **Rediriger vers UI Safe (app.safe.global)** pour signature/exécution.

### 6. Tests & Documentation (L6-M6)
*   **Tests (Conceptuels):** Créer Safe (2/2 signataires) sur testnet. Proposer Tx (transfert Test ETH). Simuler confirmations via UI Safe. Exécuter. Vérifier états (Dashboard BlockDeploy, explorateur, UI Safe).
*   **Doc Utilisateur:** Guide "Créer/Gérer DAO Multisig". Concepts (multisig, Safe, seuil). Flux création, proposition, confirmation (via UI Safe pour MVP).
*   `devlog/LOT_6_LOG.md`.

---
Ce document guide le développement du Lot 6 de la Phase 1.
