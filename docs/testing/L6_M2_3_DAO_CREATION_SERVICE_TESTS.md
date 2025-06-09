## L6-M2.3: Tests Unitaires (Conceptuels) pour `DaoCreationService`

**Objectif:** Définir les cas de test unitaires pour `DaoCreationService`.

### 1. Environnement de Test et Mocks
*   **Framework:** Jest (ou similaire).
*   **Mocks:** `ProviderService`, `SecretManagerService`, `@safe-global/safe-factory-sdk` (`SafeFactory.create`, `safeFactory.deploySafe`), `@safe-global/safe-ethers-lib` (`EthersAdapter`), `ethers.Wallet`, `DaoRepository`.

### 2. Cas de Test Principaux

**Groupe: Validation des Paramètres d'Entrée**
*   **TST-DCS-VAL-001:** Succès avec params valides minimaux (vérif `saltNonce` auto-généré).
*   **TST-DCS-VAL-002:** Échec - `networkName` non supporté.
*   **TST-DCS-VAL-003:** Échec - `owners` vide.
*   **TST-DCS-VAL-004:** Échec - `owners` adresses invalides.
*   **TST-DCS-VAL-005:** Échec - `threshold` invalide (0 ou <0).
*   **TST-DCS-VAL-006:** Échec - `threshold` > nb `owners`.
*   **TST-DCS-VAL-007:** Succès - `threshold` == nb `owners`.

**Groupe: Interaction Services Dépendants**
*   **TST-DCS-DEP-001:** `ProviderService.getProvider` appelé avec bon `networkName`.
*   **TST-DCS-DEP-002:** `SecretManagerService.getServerWalletPrivateKey` appelé.
*   **TST-DCS-DEP-003:** Échec si `getServerWalletPrivateKey` retourne `null`.
*   **TST-DCS-DEP-004:** `EthersAdapter` initialisé avec `signer` backend.
*   **TST-DCS-DEP-005:** `SafeFactory.create` appelé avec bon `ethAdapter`.
*   **TST-DCS-DEP-006:** `safeFactory.deploySafe` appelé avec `SafeAccountConfig` (owners, threshold) et `saltNonce` (fourni ou auto-généré).
*   **TST-DCS-DEP-007:** `DaoRepository.save` appelé avec données correctes du Safe (adresse, réseau, owners, seuil, version, txHash, etc.).

**Groupe: Gestion Erreurs Déploiement**
*   **TST-DCS-ERR-001:** Échec si `safeFactory.deploySafe` lève exception.
*   **TST-DCS-ERR-002:** Échec si `safeProxy.getAddress` lève exception.
*   **TST-DCS-ERR-003:** Échec si `safeProxy.getContractVersion` lève exception.

### 3. Considérations
*   Test de la logique `saltNonce`.
*   Passage des options de gas à `deploySafe`.
*   Adaptation des tests à la version SDK Safe utilisée.

Ces tests couvrent les chemins logiques et interactions du `DaoCreationService`.
