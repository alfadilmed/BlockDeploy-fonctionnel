## L5-M1: Actions ERC-20 depuis le Dashboard (Pause/Unpause, Mint)

**Objectif:** Détailler l'implémentation des actions `pause`/`unpause` et `mint` pour les contrats ERC-20 depuis le dashboard.

### 1. Actions `pause` et `unpause` (Finalisation L5-M1.1)

*   **Contexte:** Pour ERC-20 (MVP/Advanced) avec feature "Pausable", utilisateur connecté est propriétaire/`PAUSER_ROLE`.
*   **Endpoint API Préparation Tx:** `POST /api/v1/contracts/:networkName/:contractAddress/erc20-action`
    *   Payload: `{ "action": "pause" }` ou `{ "action": "unpause" }`
    *   **Backend:** Valide droits, état actuel `paused()`, prépare `unsignedTx` pour `pause()`/`unpause()`.
*   **Endpoint API État `paused`:** `GET /api/v1/contracts/:networkName/:contractAddress/erc20-details`
    *   **Réponse `/erc20-details` étendue:**
        ```json
        // "onChainData": { ..., "isPaused": true/false }
        ```
    *   **Backend:** `ContractReaderService` appelle `paused()` du contrat.
*   **Frontend (Détail Contrat):** Récupère `isPaused`. Affiche état "Transferts: Actif/En Pause". Bouton action approprié. Appel API `/erc20-action`, modale confirm, signature wallet, envoi Tx, feedback Toast. Rafraîchit état `isPaused`.

### 2. Action `mint` pour ERC-20 Advanced (L5-M1.2)
*   **(Détaillé dans la section suivante de ce document ou dans un doc L5-M1.2 dédié si besoin d'isolation)**
