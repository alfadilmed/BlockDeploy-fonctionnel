## L6-M1: Étude & Architecture d'Intégration Safe{Core} SDK

**Objectif:** Définir l'approche pour utiliser les SDKs Safe{Core} afin de permettre la création et la gestion de DAOs (multisigs Safe) via BlockDeploy.

### 1. SDKs Safe{Core} Pertinents

*   **`@safe-global/safe-factory-sdk`:**
    *   **Usage:** Pour le déploiement de nouveaux contrats Safe (proxies pointant vers un mastercopy Safe).
    *   **Intégration BlockDeploy:** Le backend utilisera ce SDK pour permettre aux utilisateurs de créer leur DAO/Safe. Le backend (via son wallet serveur) initiera et paiera les frais de transaction pour le déploiement du proxy Safe.
*   **`@safe-global/protocol-kit`:**
    *   **Usage:** Pour construire et signer des transactions Safe (multisig transactions). Permet de créer des `SafeTransaction` qui peuvent ensuite être proposées.
    *   **Intégration BlockDeploy:** Le backend utilisera ce kit pour préparer les transactions que les utilisateurs souhaitent proposer à leur DAO/Safe (ex: un transfert de fonds depuis la trésorerie du Safe).
*   **`@safe-global/api-kit`:**
    *   **Usage:** Pour interagir avec le Safe Transaction Service. Ce service indexe les Safes, leurs transactions, les confirmations, etc. Il est crucial pour obtenir l'état d'un Safe et de ses propositions sans devoir tout lire on-chain.
    *   **Intégration BlockDeploy:**
        *   Le backend utilisera cet `api-kit` pour :
            *   Soumettre une `SafeTransaction` (créée avec `protocol-kit` et signée par le premier owner/proposeur) au Transaction Service.
            *   Récupérer la liste des transactions en attente, exécutées, ou échouées pour un Safe donné (pour affichage dans le dashboard).
            *   Récupérer le statut des confirmations pour une transaction en attente.
        *   Pour le MVP, BlockDeploy utilisera l'instance hébergée et maintenue par Safe Global du Transaction Service.

### 2. Architecture d'Intégration Globale

1.  **Création d'un Safe (DAO):**
    *   L'utilisateur configure les propriétaires (`owners`) et le seuil (`threshold`) via l'UI BlockDeploy.
    *   Le backend BlockDeploy reçoit cette configuration.
    *   Le backend utilise son wallet serveur (avec des fonds sur le réseau choisi) et le `safe-factory-sdk` pour déployer un nouveau contrat Safe (proxy).
    *   L'adresse du Safe déployé, ses `owners`, `threshold`, `networkName`, `chainId`, `version` du mastercopy, et un nom convivial sont stockés dans la base de données de BlockDeploy (`Deployments` ou une nouvelle collection `DAOs`).
2.  **Proposition d'une Transaction pour le Safe:**
    *   Un propriétaire du Safe (utilisateur authentifié sur BlockDeploy) initie une proposition via l'UI BlockDeploy (ex: "transférer X tokens à Y adresse").
    *   Le frontend envoie les détails de la transaction souhaitée à l'API backend BlockDeploy.
    *   Le backend utilise `protocol-kit` pour construire la `MetaTransactionData` et ensuite la `SafeTransaction`.
    *   Le backend calcule le `safeTxHash`.
    *   **Signature de la Proposition (MVP):** Le backend retourne les détails de la `SafeTransaction` (ou son hash) au frontend. Le frontend instruit l'utilisateur de se rendre sur l'interface Safe (app.safe.global) avec son wallet connecté pour proposer cette transaction ou pour la signer si un autre owner l'a déjà proposée via l'UI Safe.
    *   *(Alternative Post-MVP): L'utilisateur signe le `safeTxHash` via son wallet directement sur BlockDeploy (EIP-712). BlockDeploy soumet la transaction signée au Safe Transaction Service via `api-kit`.*
3.  **Visualisation des Transactions du Safe:**
    *   Le frontend (Dashboard BlockDeploy, page de détail de la DAO) appelle une API backend de BlockDeploy.
    *   Cette API backend utilise `api-kit` pour interroger le Safe Transaction Service et récupérer la liste des transactions (en attente, à confirmer par l'utilisateur actuel, exécutées, etc.).
4.  **Confirmation/Signature d'une Transaction (MVP):**
    *   Si une transaction nécessite la signature de l'utilisateur connecté (il est owner et n'a pas encore signé), le dashboard BlockDeploy l'indique.
    *   L'utilisateur est redirigé vers l'interface Safe (app.safe.global) pour apposer sa signature à la transaction en attente.
    *   *(Alternative Post-MVP): L'utilisateur signe la transaction via son wallet sur BlockDeploy. BlockDeploy soumet la signature au Transaction Service via `api-kit`.)*
5.  **Exécution d'une Transaction (MVP):**
    *   Si une transaction a atteint le seuil de signatures requis, le dashboard BlockDeploy l'indique.
    *   L'utilisateur (n'importe quel owner, ou même un tiers si le gas est couvert) est redirigé vers l'interface Safe pour déclencher l'exécution de la transaction.
    *   *(Alternative Post-MVP): BlockDeploy pourrait offrir un bouton "Exécuter" qui prépare la transaction d'exécution, que l'utilisateur signe et envoie via son wallet, ou un service de relai de gas pourrait l'exécuter).*

### 3. Rôle du Wallet Serveur de BlockDeploy
*   Le wallet serveur de BlockDeploy est utilisé **uniquement** pour payer les frais de déploiement du contrat Safe (le proxy).
*   Il n'est **PAS** un signataire des Safes des utilisateurs (sauf si explicitement ajouté par l'utilisateur, ce qui n'est pas le flux par défaut).
*   Toutes les opérations sur le Safe (propositions, confirmations, exécutions) sont initiées et signées par les wallets des propriétaires du Safe.

Cette architecture vise un MVP fonctionnel en s'appuyant sur l'écosystème Safe et son Transaction Service, tout en préparant le terrain pour des intégrations plus poussées des fonctionnalités de signature et d'exécution directement dans l'UI BlockDeploy à l'avenir.
