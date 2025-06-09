## L6-M1: Étude et Intégration Initiale du SDK Safe{Core}

**Objectif:** Comprendre les SDKs Safe{Core} et définir une architecture pour un service adaptateur (`SafeService.ts`).

### 1. SDKs Safe{Core} Clés à Étudier (L6-M1.1)

*   **`@safe-global/safe-factory-sdk`:** Pour déploiement de Safes (proxies).
    *   Méthodes: Initialisation `SafeFactory`, `deploySafe(SafeAccountConfig, saltNonce?)`, `predictSafeAddress()`.
*   **`@safe-global/protocol-kit`:** Pour interagir avec un Safe existant (créer, signer, exécuter Tx multisig).
    *   Méthodes: Initialisation `Safe`, `createTransaction()`, `getTransactionHash()`, `signTransactionHash()`/`signTransaction()`, `executeTransaction()`, `getOwners()`, `getThreshold()`.
*   **`@safe-global/api-kit`:** Pour interagir avec le Safe Transaction Service (indexer Safes, Txs, confirmations).
    *   Méthodes: Init `SafeApiKit`, `getSafesByOwner()`, `getPendingTransactions()`, `getAllTransactions()`, `getTransaction()`, `proposeTransaction()`, `confirmTransaction()`.

### 2. Architecture du Service Adaptateur (`SafeService.ts`) (L6-M1.2)

Service backend pour centraliser et simplifier les interactions avec les SDKs Safe{Core}.

**Responsabilités Conceptuelles:**
*   **Initialisation:** Gérer `EthAdapter`s pour réseaux (via `ProviderService`), config URL Safe Transaction Service/réseau.
*   **Déploiement Safe:**
    *   `deployNewSafe(networkName, owners[], threshold, saltNonce?, deployerSigner)`: Utilise `safe-factory-sdk`. `deployerSigner` du backend BlockDeploy (via `SecretManagerService`) paie gas. Retourne `safeAddress`.
*   **Création/Proposition Transactions Multisig:**
    *   `createSafeTransaction(networkName, safeAddress, txData, proposerSigner)`: Crée `SafeTransaction`.
    *   `proposeSafeTransaction(networkName, safeAddress, safeTx, senderSignature, senderAddress, safeTxHash)`: Utilise `api-kit` pour soumettre Tx + 1ère signature au Safe Transaction Service.
*   **Lecture Infos Safes/Transactions:**
    *   `getSafeDetails(networkName, safeAddress)`: Owners, threshold, nonce (via `protocol-kit`/`api-kit`).
    *   `getSafeTransactions(networkName, safeAddress, options?)`: Liste Txs via `api-kit`.
    *   `getTransactionDetails(networkName, safeTxHash)`: Via `api-kit`.
*   **Gestion Confirmations & Exécution (MVP ou futur):**
    *   `addSignatureToTransaction(...)`: Soumet signature additionnelle via `api-kit`.
    *   `executeSafeTransaction(...)`: Exécute Tx via `protocol-kit` (nécessite `signer` pour gas).

**Interaction Autres Services BlockDeploy:**
*   API Endpoints (L6-M2, M3) -> `SafeService.ts`.
*   `ProviderService` -> `EthAdapter`s pour `SafeService.ts`.
*   `SecretManagerService` -> Clé privée wallet backend pour déploiement Safes.

**Exemple Structure Fichier (Conceptuel `SafeService.ts`):**
```typescript
// // src/services/blockchain/SafeService.ts
// import { ethers } from 'ethers';
// import EthAdapter from '@safe-global/safe-ethers-lib';
// import SafeFactory, { SafeAccountConfig } from '@safe-global/safe-factory-sdk';
// import Safe, { SafeTransaction } from '@safe-global/protocol-kit';
// import SafeApiKit from '@safe-global/api-kit';
// // ... import ProviderService, SecretManagerService

// const SAFE_TRANSACTION_SERVICE_URLS = { /* ... */ };

// class SafeService {
//   // private async getEthAdapter(...) { /* ... */ }
//   // private async getApiKit(...) { /* ... */ }
//   // public async deployNewSafe(...) { /* ... */ }
//   // ... autres méthodes
// }
// export default new SafeService();
```
Cette étude et structure serviront de base pour l'implémentation DAO du Lot 6.
