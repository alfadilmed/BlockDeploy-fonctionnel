## L5-M1.4: Action de Mint NFT ERC-721 (`safeMint`) depuis le Dashboard

**Objectif:** Décrire l'intégration de la fonctionnalité de mint d'un nouveau NFT (`safeMint(toAddress)`) pour une collection ERC-721 MVP depuis la page "Détail Contrat".

### 1. Conditions d'Affichage
*   Visible si contrat est ERC-721 MVP, utilisateur connecté est propriétaire, déploiement `success`.

### 2. UI dans "Détail Contrat"
*   **Section:** "Gestion des Tokens NFT" / "Minter un Nouveau NFT".
*   **Composants:**
    *   `Input` pour "Adresse Destinataire du NFT" (`to`). Validation adresse Ethereum.
    *   `Button` "Minter ce NFT".
    *   (Opt.) Info: "Prochain Token ID sera auto-assigné."
*   **Tooltip:** "Un nouveau NFT sera créé et envoyé à l'adresse. Métadonnées via `baseTokenURI` de la collection."

### 3. Logique Backend (API Préparation Tx)
*   **Endpoint:** `POST /api/v1/contracts/:networkName/:contractAddress/nft-erc721-action`
*   **Payload `safeMint`:** `{ "action": "safeMint", "to": "0xRecipientAddress..." }`
*   **Handler API:** Valide droits propriétaire. Prépare `unsignedTx` pour `safeMint(to)` du contrat `ERC721MVP.sol`. Retourne au frontend.

### 4. Logique Frontend
1.  Saisie & Validation adresse `to`.
2.  Appel API `/nft-erc721-action` avec payload.
3.  Si API succès (`unsignedTx` reçue), demande signature wallet & envoi.
4.  Feedback Tx (Toast "soumise...", "confirmée!"). Si succès, suggérer vérif explorateur/marketplace. Rafraîchir `totalSupply` collection.
