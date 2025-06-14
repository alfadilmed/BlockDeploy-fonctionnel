# Intégration Safe{Core} SDK - Points Clés

Ce document résume les aspects essentiels du Safe{Core} SDK pour l'intégration dans BlockDeploy, en se concentrant sur la création de DAOs (Safes) et la gestion basique des transactions.

## 1. Packages Principaux du SDK

Le Safe{Core} SDK est modulaire. Pour nos besoins MVP, les packages suivants sont centraux :

*   **`@safe-global/protocol-kit` (anciennement `safe-ethers-lib` ou `safe-web3-lib`)**:
    *   **Rôle :** Fournit les classes et méthodes pour interagir avec un Safe existant.
    *   **Fonctionnalités Clés :**
        *   Connexion à une instance de Safe.
        *   Création et signature de transactions (méta-transactions Safe).
        *   Proposition de transactions au Safe (via le Safe Transaction Service ou directement).
        *   Exécution de transactions.
        *   Récupération d'informations sur le Safe (propriétaires, seuil, nonce, etc.).
    *   **Dépendances :** `ethers.js` (v5 ou v6 selon la version du kit).

*   **`@safe-global/safe-factory-sdk`**:
    *   **Rôle :** Dédié au déploiement de nouveaux contrats Safe (instances de proxy).
    *   **Fonctionnalités Clés :**
        *   Configuration du déploiement (version du Safe, `saltNonce` pour adresses déterministes).
        *   Déploiement de `SafeProxy` via une `SafeProxyFactory`.
        *   Utilise typiquement la fonction `createProxyWithNonce` ou `deploySafe` du SDK.
    *   **Événements Importants :** L'événement `ProxyCreation` sur le contrat factory est crucial pour récupérer l'adresse du Safe nouvellement déployé.

*   **`@safe-global/api-kit`**:
    *   **Rôle :** Facilite l'interaction avec le Safe Transaction Service API.
    *   **Fonctionnalités Clés :**
        *   Proposer une nouvelle transaction au service pour que les autres signataires la voient.
        *   Soumettre des confirmations (signatures) au service.
        *   Obtenir la liste des transactions en attente, exécutées.
        *   Récupérer les détails d'une transaction spécifique.
    *   **Utilité :** Essentiel pour une expérience multisig où les signatures sont collectées off-chain avant l'exécution on-chain.

## 2. Flux de Création d'un Safe (DAO)

Le processus typique de création d'un nouveau Safe avec le SDK implique :

1.  **Initialisation du `EthersAdapter`**: Wrapper autour d'un `signer` ethers.js (qui paiera le gas pour le déploiement).
2.  **Initialisation du `SafeFactory`**:
    *   `SafeFactory.create({ ethAdapter })`
3.  **Configuration du Déploiement**:
    *   `owners`: Array d'adresses des propriétaires initiaux.
    *   `threshold`: Nombre de signatures requises.
    *   `safeAccountConfig`: `{ owners, threshold }`.
    *   `saltNonce`: Optionnel, pour un déploiement déterministe.
4.  **Déploiement**:
    *   `safeFactory.deploySafe({ safeAccountConfig, saltNonce, callback? })`.
    *   Le SDK gère l'appel à `SafeProxyFactory.createProxyWithNonce(...)` et l'encodage de l'initializer `setup(...)`.
5.  **Récupération de l'Adresse**:
    *   L'instance de `protocol-kit` (Safe) retournée par `deploySafe` contient l'adresse du nouveau Safe.
    *   Alternativement, si l'on interagit directement avec le contrat factory, il faut écouter l'événement `ProxyCreation` émis par la factory pour obtenir l'adresse du proxy.

## 3. Flux de Proposition et Lecture de Transactions

Pour le MVP, nous nous concentrons sur les transactions initiées par BlockDeploy et signées par les utilisateurs.

*   **Création d'une Proposition (Backend)**:
    1.  Un utilisateur (propriétaire du Safe) initie une action via l'UI BlockDeploy (ex: transfert ETH).
    2.  Le backend BlockDeploy utilise le `protocol-kit` pour :
        *   Se connecter au Safe concerné : `Safe.create({ ethAdapter, safeAddress })`.
        *   Préparer la transaction : `safeSdk.createTransaction({ safeTransactionData })` où `safeTransactionData` contient `to`, `value`, `data`, `operation`, etc.
        *   Obtenir le hash de la transaction à signer : `safeSdk.getTransactionHash(safeTransaction)`.
    3.  Le backend stocke cette proposition (avec son hash) et la présente aux autres propriétaires.

*   **Signature d'une Proposition (Frontend -> Backend)**:
    1.  Les propriétaires voient la proposition dans l'UI BlockDeploy.
    2.  Ils la signent via leur wallet (ex: MetaMask). La signature porte sur le `transactionHash` (généralement via EIP-712).
    3.  La signature est envoyée au backend BlockDeploy.

*   **Collecte et Exécution (Backend)**:
    1.  Le backend collecte les signatures.
    2.  Une fois le seuil atteint, le backend utilise `protocol-kit` pour :
        *   Ajouter les signatures à la transaction : `safeSdk.signTransaction(safeTransaction, signature)` (peut être fait itérativement ou `MultiSend`).
        *   Exécuter la transaction : `safeSdk.executeTransaction(signedSafeTransaction)`.

*   **Utilisation de `api-kit` (Safe Transaction Service)**:
    *   Pour une expérience utilisateur plus riche et décentralisée (hors MVP strict BlockDeploy), `api-kit` serait utilisé pour :
        *   Proposer la transaction au service : `apiKit.proposeTransaction({ safeAddress, safeTransactionData, senderAddress, ... })`.
        *   Permettre aux autres de voir et de confirmer la transaction via le service : `apiKit.confirmTransaction(safeTxHash, signature)`.
        *   Lire l'état des transactions : `apiKit.getTransaction(safeTxHash)`, `apiKit.getPendingTransactions(safeAddress)`.

## 4. Dépendances Réseau

*   **Adresses des Contrats Safe**:
    *   Les contrats `Safe (mastercopy)`, `SafeProxyFactory`, et `MultiSend` ont des adresses spécifiques par réseau.
    *   Le SDK (`@safe-global/protocol-kit` et `@safe-global/safe-factory-sdk`) gère souvent ces adresses en interne pour les réseaux supportés, mais elles peuvent être surchargées si nécessaire (ex: pour des réseaux de test locaux ou des versions spécifiques).
    *   Les adresses officielles sont disponibles dans le dépôt `safe-global/safe-deployments`.
*   **Réseaux Cibles pour BlockDeploy (MVP)**:
    *   **Sepolia (Testnet Ethereum)**: Pour les tests et la validation.
    *   **Polygon (Mainnet)**: Pour les déploiements en production.
    *   Le backend BlockDeploy (`ProviderService`, `ConfigService`) doit être configuré avec les RPC URLs et les adresses des contrats Safe pour ces réseaux.
*   **Safe Transaction Service**:
    *   Le service a des endpoints API différents par réseau. `api-kit` doit être configuré avec le bon endpoint.

## Conclusion

L'intégration du Safe{Core} SDK, bien que nécessitant une configuration initiale et une compréhension des flux, fournit une base robuste et sécurisée pour les fonctionnalités DAO de BlockDeploy. L'utilisation des packages `protocol-kit`, `safe-factory-sdk`, et potentiellement `api-kit` permettra de gérer le cycle de vie des Safes et de leurs transactions.
