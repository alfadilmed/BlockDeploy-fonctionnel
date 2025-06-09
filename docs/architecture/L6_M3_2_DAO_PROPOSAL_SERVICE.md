## L6-M3.2: Service Backend pour Soumission de Propositions Signées au Safe Transaction Service

**Objectif:** Décrire la logique backend pour recevoir une proposition Safe signée et la soumettre au Safe Transaction Service.

**Référence:** API Préparation Proposition (L6-M3.1), Safe{Core} SDKs.

### 1. Contexte
Après L6-M3.1, le frontend a `safeTxHash`, `safeTransactionData`, et une `signature` d'un propriétaire.

### 2. Endpoint API pour Soumettre Transaction Signée
*   **Endpoint:** `POST /api/v1/dao/:networkName/:safeAddress/submit-signed-transaction`
*   **Authentification:** Requise (user = signataire ou owner).
*   **Payload:**
    ```json
    {
      "safeTransactionData": { /* ... (to, value, data, operation, nonce, etc.) ... */ },
      "senderAddress": "0xSignerAddress...",
      "signature": "0xSignatureString...",
      "safeTxHash": "0xTransactionHashThatWasSigned..." // Optionnel pour vérif
    }
    ```

### 3. Logique Service Backend (`DaoProposalService`)
1.  **Validation:** Auth user, payload.
2.  **Init SDKs Safe:** `EthersAdapter` (provider seul), `SafeApiKit` (avec URL Safe Transaction Service du réseau).
3.  **Vérification (Opt.):** Reconstruire `SafeTransaction` depuis `safeTransactionData`, recalculer `safeTxHash`, comparer avec `safeTxHash` fourni.
4.  **Soumission au Safe Transaction Service:**
    *   Appel `apiKit.proposeTransaction({ safeAddress, safeTransactionData, senderAddress, senderSignature, safeTxHash })`.
5.  **Réponse API:**
    *   Succès (`200 OK`/`201 Created`): `{ message: "Soumise avec succès", safeTxHash, status }`.
    *   Erreurs: Validation, comm. Safe Transaction Service, signature invalide.

### 4. Considérations
*   **URLs Safe Transaction Service:** Maintenir liste par réseau.
*   **Signatures Multiples:** Ce flux est pour une signature. Chaque owner signe même `safeTxHash`. Frontend gère récupération Tx en attente pour autres signataires.
*   **Exécution Tx:** Appel séparé (futur) pour exécuter Tx avec assez de signatures.

Ce service est clé pour la gouvernance multisig.
