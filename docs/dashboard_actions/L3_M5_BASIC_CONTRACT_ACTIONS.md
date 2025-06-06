## L3-M5 (Optionnel): Actions de Base sur Contrat depuis le Dashboard (ERC-20 MVP Pause/Unpause)

**Objectif:** Décrire l'intégration conceptuelle des actions `pause` et `unpause` sur un ERC-20 MVP depuis la page "Détail Contrat".

### 1. Conditions d'Affichage
*   Actions visibles si: contrat est ERC-20 MVP, `features.pausable` est `true`, utilisateur connecté est propriétaire, déploiement `success`.

### 2. UI dans "Détail Contrat"
*   **Section:** "Actions Administratives" / "Contrôle du Contrat".
*   **État Actuel:** Affichage "Statut des transferts : Actif / En Pause" (nécessite lecture on-chain de `paused()`). L'API `/erc20-details` pourrait être étendue.
*   **Boutons (conditionnels):** "Mettre en Pause" (si actif) / "Reprendre les Transferts" (si en pause).

### 3. Logique Backend (API pour Préparer Tx)
*   **Endpoint:** `POST /api/v1/contracts/:networkName/:contractAddress/erc20-action`
*   **Payload:** `{ "action": "pause" }` ou `{ "action": "unpause" }`
*   **Handler API:**
    1.  Validation params & droits propriétaire.
    2.  Vérifie que contrat supporte l'action.
    3.  Prépare Transaction Non Signée: `to` (adresse contrat), `data` (appel encodé `pause()`/`unpause()`), estimation `gasLimit`.
    4.  Retourne `unsignedTx` (JSON) au frontend. **Ne signe/n'envoie pas.**
*   **Réponse API Succès (`200 OK`):**
    ```json
    {
      "message": "Transaction préparée pour l'action 'pause'. Veuillez signer.",
      "unsignedTx": { "to": "0x...", "data": "0x...", "gasLimit": "50000" },
      "networkName": "sepolia", "chainId": 11155111
    }
    ```

### 4. Logique Frontend
1.  **Appel API Préparer Action:** Sur clic bouton, appelle endpoint ci-dessus.
2.  **Demande Signature Wallet:** Si API succès, utilise provider wallet (MetaMask) pour `signer.sendTransaction(unsignedTxData)`.
3.  **Gestion Feedback Transaction:**
    *   Toast "Transaction soumise (Hash: ...). En attente..."
    *   `await txResponse.wait()` pour confirmation.
    *   Si succès (`receipt.status === 1`): Toast "Action '{action}' réussie !". Rafraîchir état `paused()` UI.
    *   Si échec (`receipt.status === 0`): Toast erreur "Action '{action}' échouée."

### 5. Considérations Sécurité et UX
*   Modale de confirmation avant signature wallet.
*   Vérification stricte des droits du propriétaire.
*   Gestion claire des erreurs (API, signature, tx blockchain).

Cette fonctionnalité permet une gestion administrative simple des contrats depuis le Dashboard.
