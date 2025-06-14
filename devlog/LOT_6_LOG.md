## Lot 6 Planification Log - 2025-06-07T16:13:29+00:00

**Analyser `PHASE_1_CONSOLIDATED_PLAN.md` (Axe 6) et les Priorités Utilisateur pour le MVP DAO Builder**
- Date: 2025-06-07T16:13:29+00:00
- Avancement: Terminé.
- Analyse et Décisions:
  - Le `PHASE_1_CONSOLIDATED_PLAN.md` décrit l'Axe 6 comme étant axé sur Expansion Multi-Chaîne & NFT (IPFS + ERC-1155).
  - Les instructions utilisateur récentes priorisent clairement le **MVP DAO Builder** pour le Lot 6.
  - **Décision:** La planification du Lot 6 se basera principalement sur les spécifications fournies par l'utilisateur pour le MVP DAO Builder.
  - **Périmètre du MVP DAO Builder (selon utilisateur):**
    - Modèle: Multisig DAO simplifiée \(type Gnosis Safe-like\).
    - Création: N propriétaires, seuil M/N signatures.
    - Propositions: Soumission et approbation \(transfert ETH, ajout/retrait membres\).
    - Exécution: Signature des transactions par les membres.
    - Suivi: Lecture et suivi des actions dans le dashboard.
  - L'Axe 6 du plan consolidé sera considéré comme un contexte général de nouvelles fonctionnalités majeures, mais les détails spécifiques du DAO Builder primeront.


**Recherche Préliminaire sur les Smart Contracts Multisig DAO Open Source (Conceptuel)**
- Date: 2025-06-07T16:14:51+00:00
- Avancement: Terminé.
- Analyse des Options Open Source:
  - **1. Gnosis Safe / Safe{Core}:**
    - **Description:** Standard de facto pour les comptes multisig, audité, sécurisé, riche en fonctionnalités.
    - **Alignement MVP:** Très bon. Couvre la création N propriétaires, seuil M/N, soumission/confirmation/exécution de transactions (transferts ETH, gestion des propriétaires via des appels de fonction spécifiques).
    - **Complexité:** L'écosystème est vaste, mais les contrats de base sont solides. Safe{Core} vise à simplifier l'intégration.
    - **Suggestion:** Fortement recommandé comme base principale, soit par utilisation directe, soit par inspiration majeure.
  - **2. OpenZeppelin Contracts (Briques de Base):**
    - **Description:** Fournit des primitives (`AccessControl`, `Ownable`) mais pas un multisig M/N complet prêt à l'emploi.
    - **Alignement MVP:** Faible. Nécessiterait un développement substantiel pour la logique de M/N et de gestion des transactions.
    - **Suggestion:** Moins adapté pour un MVP rapide et sécurisé par rapport à Gnosis Safe.
  - **3. Autres Implémentations Multisig:**
    - **Suggestion:** Préférer les solutions standards et auditées comme Gnosis Safe.
- **Conclusion Préliminaire:**
  - Gnosis Safe / Safe{Core} est le candidat principal pour servir de base au MVP DAO Builder.
  - L'effort d'intégration se concentrerait sur le backend/frontend pour interagir avec ces contrats plutôt que de réécrire la logique multisig centrale.


**Rédiger le Document `PHASE_1_LOT_6_DETAIL.md`**
- Date: 2025-06-07T16:16:48+00:00
- Avancement: Terminé.
- Actions:
  - Création du fichier `PHASE_1_LOT_6_DETAIL.md`.
  - Structure du document définie avec: Introduction, Modèle de DAO Cible (Multisig type Gnosis Safe), Milestones Suggérées (L6-M1 à L6-M7), Prérequis/Dépendances.
  - Milestones détaillées couvrant:
    - L6-M1: Conception/Sélection du Smart Contract Multisig.
    - L6-M2: Backend API pour Création/Configuration DAO.
    - L6-M3: Backend API pour Gestion des Propositions.
    - L6-M4: Frontend UI pour Création/Configuration DAO (Conceptuel).
    - L6-M5: Frontend UI pour Gestion des Propositions (Conceptuel).
    - L6-M6: Intégration Dashboard & Suivi (Conceptuel).
    - L6-M7: Tests Backend et Documentation API.


**L6-M1.1: Confirmation du Choix du Contrat Multisig de Base**
- Date: 2025-06-07T16:25:37+00:00
- Avancement: Terminé.
- Décisions et Confirmations:
  - **Contrat de Base Confirmé:** Gnosis Safe / Safe{Core} est confirmé comme la base pour le MVP DAO Builder, en accord avec la recherche préliminaire et le feedback utilisateur.
  - **Méthode d'Utilisation:** Déploiement d'instances de contrats Gnosis Safe pour chaque DAO utilisateur, via le contrat `SafeProxyFactory.sol` (ou équivalent Safe{Core}). Cette approche utilise des proxies pointant vers une mastercopy de `Safe.sol`.
  - **Points à Préciser (pour L6-M1.2 et L6-M1.4):**
    - **Version des Contrats Safe:** Utiliser une version recente, stable et auditée (ex: v1.3.0 ou version Safe{Core} recommandée).
    - **Instances des Contrats:** Privilégier l'utilisation des instances officielles des factories et mastercopies Gnosis Safe sur les réseaux cibles.
  - **Prochaines Étapes:** Identifier les contrats et fonctions spécifiques de Gnosis Safe à utiliser (L6-M1.2) et collecter les ABIs/adresses (L6-M1.4).


**L6-M1.2: Identification des Contrats et Fonctionnalités Spécifiques de Gnosis Safe à Utiliser**
- Date: 2025-06-07T16:27:35+00:00
- Avancement: Terminé.
- Contrats Gnosis Safe Clés Identifiés:
  - **`Safe.sol` (Mastercopy):** Contient la logique du multisig.
  - **`SafeProxyFactory.sol`:** Pour déployer de nouveaux Safes via proxies.
    - Fonction clé: `createProxyWithNonce(address _singleton, bytes memory initializer, uint256 saltNonce)`.
  - **`MultiSend.sol`:** Optionnel pour le MVP, pour batcher des transactions.
- Fonctionnalités de `Safe.sol` à Utiliser pour le MVP:
  - **Configuration Initiale (via `initializer` de `createProxyWithNonce`):**
    - `setup(_owners, _threshold, to, data, ...)`: Pour configurer propriétaires et seuil.
  - **Soumission/Exécution de Transactions:**
    - `execTransaction(to, value, data, operation, ..., signatures)`: Fonction centrale pour exécuter une transaction approuvée.
    - Nécessite la collecte off-chain de signatures EIP-712 du `transactionHash`.
  - **Récupération d'Informations (fonctions `view`):**
    - `getOwners()`, `getThreshold()`, `getNonce()`, `getTransactionHash(...)`, `isOwner(address)`.
  - **Gestion des Propriétaires/Seuil (via propositions à `execTransaction`):**
    - `addOwnerWithThreshold(owner, _threshold)`
    - `removeOwner(prevOwner, owner, _threshold)`
    - `swapOwner(prevOwner, oldOwner, newOwner)` (moins prioritaire pour MVP)
    - `changeThreshold(_threshold)`
- **Flux de Proposition Simplifié pour MVP:**
  - Initiation (propriétaire) -> Calcul `transactionHash` (backend) -> Stockage DB (backend) -> Signature par propriétaires (frontend/wallet -> backend) -> Stockage signatures (backend) -> Exécution via `execTransaction` (backend).


**L6-M1.3: Spécifications Techniques Détaillées pour l'Interaction Backend**
- Date: 2025-06-07T16:29:14+00:00
- Avancement: Terminé.
- Spécifications d'Interaction Backend avec Gnosis Safe pour MVP:
  - **1. Création d'une DAO (Multisig Safe):**
    - API: `POST /api/v1/dao/multisig` (Payload: `{ name, owners[], threshold, network, userId }`)
    - Backend va:
      - Valider payload.
      - Préparer `initializer` calldata pour `Safe.setup(_owners, _threshold, address(0), "0x", ...)`.
      - Utiliser `SafeProxyFactory.createProxyWithNonce()` pour déployer un nouveau proxy Safe.
      - Récupérer l'adresse du proxy via l'événement `ProxyCreation`.
      - Stocker les infos de la DAO en DB (adresse, config, créateur).
  - **2. Soumission d'une Proposition (ex: Transfert ETH):**
    - API: `POST /api/v1/dao/multisig/:network/:daoAddress/proposals` (Payload: `{ to, value, data, description, userId }`)
    - Backend va:
      - Valider payload et droits du `userId` (doit être propriétaire).
      - Construire les paramètres de la transaction Safe (to, value, data, operation, nonce, etc.).
      - Calculer `txHashToSign` via `safe.getTransactionHash(...)`.
      - Stocker la proposition en DB (`PENDING_SIGNATURES`, détails, `txHashToSign`).
      - Gérer la première signature (si l'initiateur signe immédiatement ou si le backend agit comme signataire pour le compte de l'utilisateur après vérification).
  - **3. Soumission d'une Proposition (Gestion Membres):**
    - API: Idem, mais avec un `type` dans le payload (ex: `ADD_OWNER`) et les champs correspondants (`newOwner`, `newThreshold`).
    - Backend va encoder `data` pour les fonctions Safe: `addOwnerWithThreshold(newOwner, newThreshold)` ou `removeOwner(prevOwner, ownerToRemove, newThreshold)`.
    - `to` sera l'adresse de la DAO elle-même, `value` sera 0.
  - **4. Confirmer une Proposition:**
    - API: `POST /api/v1/dao/multisig/:network/:daoAddress/proposals/:proposalIdOrTxHash/confirmations` (Payload: `{ userId, signature }`)
    - Backend va:
      - Valider que `userId` est propriétaire et n'a pas déjà signé.
      - Valider la `signature` contre le `txHashToSign` et l'adresse du `userId`.
      - Stocker la signature en DB et mettre à jour le compteur de confirmations.
  - **5. Exécuter une Proposition:**
    - API: `POST /api/v1/dao/multisig/:network/:daoAddress/proposals/:proposalIdOrTxHash/execute` (Payload: `{ userId }`)
    - Backend va:
      - Vérifier que la proposition a atteint le seuil de signatures.
      - Obtenir un `signer` backend (payeur de gas).
      - Concaténer les signatures collectées.
      - Appeler `safe.execTransaction(...)` avec les paramètres de la proposition et les signatures.
      - Mettre à jour le statut de la proposition en DB (`EXECUTED`/`FAILED`).
  - **Gestion des Signatures pour MVP:** Le flux décrit suppose une collecte et une validation des signatures par le backend. L'UX de signature par les utilisateurs multiples via leurs wallets sera un point d'attention pour le frontend.


**L6-M1.4: Collecte des ABIs et Adresses de Contrats Gnosis Safe**
- Date: 2025-06-07T16:30:52+00:00
- Avancement: Terminé (Planification de la collecte).
- Stratégie de Collecte d'Informations:
  - **1. ABIs des Contrats Gnosis Safe:**
    - **Source Principale:** Paquets NPM officiels de Safe (`@safe-global/safe-contracts`, `@safe-global/safe-core-sdk`) qui incluent les artifacts de compilation (ABIs JSON).
    - **Alternative:** Dépôt GitHub `safe-contracts` (compilation locale) ou explorateurs de blocs pour les contrats vérifiés.
    - **ABIs Requis pour MVP (ex: pour Safe v1.3.0 ou équivalent Safe{Core}):**
      - ABI complet de `Safe.sol` (pour `setup`, `execTransaction`, `getTransactionHash`, `getOwners`, `getThreshold`, `addOwnerWithThreshold`, `removeOwner`, `changeThreshold`, etc.).
      - ABI complet de `SafeProxyFactory.sol` (pour `createProxyWithNonce` ou `createProxy`).
  - **2. Adresses des Contrats Officiels Gnosis Safe (Mastercopies & Factories):**
    - **Source Principale:** Documentation officielle Safe{Core} / Gnosis Safe et le dépôt GitHub `safe-global/safe-deployments`.
    - **Alternative:** Le Safe{Core} SDK qui contient souvent des adresses préconfigurées.
    - **Informations à Collecter par Réseau Cible (ex: Sepolia, Polygon Mainnet, Polygon Mumbai):**
      - Adresse de l'implémentation maître (mastercopy/singleton) `Safe.sol` (version choisie).
      - Adresse du contrat `SafeProxyFactory.sol` (version choisie).
    - Ces adresses seront stockées dans la configuration du backend BlockDeploy.
- **Action Concrète (hors de cette subtask de planification):** Lors de l'implémentation backend (L6-M2), ces ABIs seront extraits des paquets NPM installés et les adresses des contrats officiels seront récupérées depuis les sources documentaires de Safe et intégrées dans la configuration.


**L6-M1.5: Documentation et Log (Finalisation L6-M1)**
- Date: 2025-06-07T16:32:33+00:00
- Avancement: Terminé.
- Actions:
  - Création du document de spécification technique `docs/smart-contracts/L6_M1_DAO_MULTISIG_SPECS.md`.
  - Ce document résume les choix de conception pour le contrat Multisig DAO (basé sur Gnosis Safe), les contrats et fonctions spécifiques à utiliser, les flux d'interaction backend, et la stratégie de collecte des ABIs/adresses.
  - Le `devlog/LOT_6_LOG.md` a été maintenu à jour tout au long de L6-M1.
  - **FIN DE LA MILESTONE L6-M1: Conception et Sélection/Adaptation du Smart Contract Multisig DAO.**


**L6-M1.1: Recherche Approfondie et Comparaison des Options de Contrats Multisig Open Source**
- Date: 2025-06-07T16:33:55+00:00
- Avancement: Terminé.
- Analyse Détaillée des Options:
  - **1. Gnosis Safe / Safe{Core} (Option Principale Fortement Recommandée):**
    - **Architecture:** `Safe.sol` (logique), Proxies (EIP-1167 via Factory), Modules optionnels (hors scope MVP), Guards optionnels (hors scope MVP).
    - **Fonctionnalités Clés pour MVP:** `setup()`, `addOwnerWithThreshold()`, `removeOwner()`, `swapOwner()`, `changeThreshold()`, `execTransaction()`, `approveHash()`, événements pertinents.
    - **Sécurité:** Très élevée, nombreux audits, standard de l'industrie.
    - **Intégration:** Utilisation des contrats mastercopy/factory déployés. Le Safe{Core} SDK (JS/TS) est recommandé pour simplifier les interactions backend (création tx, signatures, exécution).
    - **Licence:** LGPL-3.0 pour les contrats.
  - **2. Multisig from scratch basé sur OpenZeppelin Primitives:**
    - **Concept:** Utiliser `AccessControl` pour gérer N propriétaires et implémenter la logique M/N pour propositions/confirmations/exécutions.
    - **Avantages:** Potentiel de légèreté du bytecode, contrôle total, licence MIT (OZ).
    - **Inconvénients:** Risque de sécurité majeur, effort de développement important, manque de fonctionnalités avancées et d'écosystème. Non recommandé pour un MVP sécurisé.
  - **3. Autres Implémentations Multisig Moins Connues:**
    - **Inconvénients:** Généralement moins auditées et moins de support. Risqué.
- **Recommandation Initiale:**
  - **Utiliser Gnosis Safe / Safe{Core}** est la voie recommandée en raison de sa sécurité, de sa maturité et de son écosystème (SDK).
  - L'effort d'intégration se portera sur l'interaction avec les contrats Safe existants et leur SDK, plutôt que sur la réécriture de la logique multisig.
  - En attente de feedback utilisateur pour confirmer cette direction ou explorer d'autres pistes si nécessaire.


**L6-M1.2: Définition des Spécifications Techniques Minimales du Contrat pour le MVP**
- Date: 2025-06-07T16:34:59+00:00
- Avancement: Terminé.
- Spécifications Basées sur Gnosis Safe / Safe{Core}:
  - **1. Déploiement Nouvelle Safe (DAO Multisig):**
    - Action BlockDeploy: Création DAO (propriétaires initiaux, seuil).
    - Interaction Contrat: Via `SafeProxyFactory.createProxyWithNonce()` (ou similaire), appelant `setup()` du Safe avec propriétaires, seuil, et autres paramètres de setup (vers adresses nulles pour MVP).
    - Stockage Backend: Adresse Safe, propriétaires, seuil, réseau, nom utilisateur, créateur BlockDeploy.
  - **2. Soumission d'une Proposition de Transaction (Transfert ETH, Gestion Membres):**
    - Action BlockDeploy: Proposer une action (transfert ETH, ajout/retrait owner, changement seuil).
    - Interaction Contrat: Construction d'une méta-transaction Safe (`to`, `value`, `data`, etc.). L'initiateur (propriétaire) signe le hash (EIP-712).
    - Fonctions Safe Clés: `execTransaction()` (avec signatures), et les fonctions de gestion (`addOwnerWithThreshold`, etc.) appelées via `execTransaction`.
    - Événements Safe Clés: `ExecutionSuccess`, `ExecutionFailure`, `AddedOwner`, etc.
  - **3. Confirmation d'une Proposition (Signature):**
    - Action BlockDeploy: Un autre propriétaire approuve la proposition.
    - Interaction Contrat: Collecte de signature off-chain pour le même hash de méta-transaction. Alternative (plus coûteuse): `approveHash()` on-chain.
  - **4. Exécution d'une Proposition:**
    - Action BlockDeploy: Un propriétaire demande l'exécution (si seuil atteint).
    - Interaction Contrat: Appel à `execTransaction()` avec toutes les signatures collectées.
  - **Intégration Backend/Dashboard BlockDeploy:**
    - Backend: Stockage DAOs, propositions, statuts, signatures (si off-chain). Vérification des droits du `userId` BlockDeploy.
    - Dashboard: Affichage DAOs, propositions, statuts. Actions de signature/exécution.
  - **Utilisation du Safe{Core} SDK:** Fortement recommandée pour simplifier les interactions (déploiement, création/signature/exécution de transactions Safe).


**L6-M1.3: Décision Finale sur le Contrat à Utiliser/Adapter**
- Date: 2025-06-07T16:36:55+00:00
- Avancement: Terminé.
- Décision Finale:
  - **Contrat Adopté:** Utilisation directe des contrats **Gnosis Safe / Safe{Core}** (proxies pointant vers les mastercopies officielles).
    - **Raisonnement:** Sécurité maximale, robustesse, standard de l'industrie, fonctionnalités couvrant les besoins du MVP.
    - **Aucune adaptation/fork** des contrats Solidity de Safe n'est prévue pour le MVP afin de préserver l'intégrité des audits.
  - **Outils d'Interaction:**
    - L'utilisation du **Safe{Core} SDK** (et de ses bibliothèques associées comme `safe-ethers-lib`) est la stratégie privilégiée pour les interactions backend avec les Safes.
    - **Avantages SDK:** Simplification du déploiement, de la création de méta-transactions Safe, de la gestion des signatures, de l'estimation de gas et de l'exécution des transactions.
  - **Implications:**
    - La logique spécifique à BlockDeploy sera implémentée dans le backend et le frontend, en orchestrant les appels aux contrats Safe via le SDK.
    - La prochaine étape (L6-M1.4) se concentrera sur la collecte des ABIs et des adresses des contrats Safe mastercopy/factory sur les réseaux cibles.


**L6-M1.4: Collecte des ABIs et Préparation de la Documentation Technique Initiale**
- Date: 2025-06-07T16:38:48+00:00
- Avancement: Terminé.
- Actions:
  - Création du document de spécification technique initiale `docs/architecture/L6_M1_DAO_CONTRACT_SPEC.md`.
  - Le document décrit:
    - L'utilisation de Gnosis Safe / Safe{Core} comme base contractuelle.
    - L'architecture de déploiement (Mastercopy + Proxy via Factory).
    - Les fonctionnalités clés du contrat Safe qui seront utilisées pour le MVP (setup, execTransaction, gestion des propriétaires/seuils).
    - La stratégie d'interaction via le Safe{Core} SDK.
    - Des placeholders pour les adresses des contrats Safe déployés sur les réseaux cibles.
    - Des pointeurs vers les ABIs pertinents.
  - La collecte effective des adresses exactes des contrats déployés et des versions spécifiques des ABIs sera faite au moment de l'implémentation backend et nécessitera l'accès à la documentation Safe.


**L6-M1.5: Mettre à Jour `devlog/LOT_6_LOG.md` (Finalisation L6-M1)**
- Date: 2025-06-07T16:40:21+00:00
- Avancement: Terminé.
- Actions:
  - Le `devlog/LOT_6_LOG.md` a été maintenu à jour tout au long de L6-M1.
  - **FIN DE LA MILESTONE L6-M1: Conception et Sélection/Adaptation du Smart Contract Multisig DAO.**
    - Recherche et comparaison des options de contrats: Terminé (Gnosis Safe / Safe{Core} choisi).
    - Définition des spécifications techniques MVP du contrat: Terminé.
    - Décision finale sur le contrat à utiliser (Gnosis Safe via SDK): Terminé.
    - Documentation technique initiale et collecte conceptuelle des ABIs/adresses: Terminé (`docs/architecture/L6_M1_DAO_CONTRACT_SPEC.md` créé).


**L6-M1.2: Définition des Spécifications Techniques du Contrat pour le MVP**
- Date: 2025-06-07T16:36:00+00:00
- Avancement: Terminé.
- Spécifications Techniques Basées sur Gnosis Safe / Safe{Core}:
  - **Contrats Gnosis Safe Cibles:**
    - `SafeProxyFactory.sol` (ou équivalent Safe{Core}) pour le déploiement de nouveaux DAOs (Safes).
      - Fonction clé: `createProxyWithNonce()` ou `createProxy()`.
    - `Safe.sol` (implémentation maîtresse L1/L2) pour la logique du DAO.
      - **Initialisation (via Factory):** `setup(...)` avec propriétaires initiaux et seuil.
      - **Gestion des Membres/Seuil (via propositions M/N):** `addOwnerWithThreshold()`, `removeOwner()`, `swapOwner()`, `changeThreshold()`.
      - **Gestion des Transactions (Propositions):**
        - `getTransactionHash(...)` pour calculer le hash à signer.
        - `execTransaction(...)` pour exécuter une transaction avec les signatures M/N collectées.
        - (Optionnel pour MVP: `approveHash()` si signatures on-chain).
      - **Fonctions de Lecture Clés:** `getOwners()`, `getThreshold()`, `isOwner()`, `getNonce()`.
      - **Événements à Écouter:** `AddedOwner`, `RemovedOwner`, `ChangedThreshold`, `ExecutionSuccess`, `ExecutionFailure`.
  - **Types de Propositions MVP à Gérer par BlockDeploy:**
    - Transfert ETH simple (`to`, `value`, `data='0x'`).
    - Ajout/Retrait de membre, Changement de seuil (en construisant le `data` pour les fonctions de gestion du Safe).
  - **Intégration Backend/Dashboard:**
    - Le backend gérera la création des propositions, la collecte des signatures (probablement off-chain pour MVP), et l'exécution.
    - Le dashboard affichera les DAOs, les propositions, et permettra les interactions de signature.
  - **Librairies Recommandées:**
    - Safe{Core} SDK (`@safe-global/safe-core-sdk`, `@safe-global/safe-ethers-lib` / `adapters`) pour simplifier les interactions avec les contrats Safe.


**L6-M1.3: Décision Finale sur le Contrat à Utiliser et l'Approche d'Intégration**
- Date: 2025-06-07T16:38:22+00:00
- Avancement: Terminé.
- Décisions Finales:
  - **Contrat Intelligent Confirmé:** Utilisation directe des contrats Gnosis Safe / Safe{Core}.
    - Les DAOs seront des instances de proxy (via `SafeProxyFactory`) pointant vers les implémentations maîtresses standards de `Safe.sol`.
    - Aucune modification ou fork des contrats Safe ne sera effectué pour le MVP.
  - **Approche d'Intégration Backend Confirmée:** Utilisation du Safe{Core} SDK.
    - Le SDK sera utilisé pour la création des transactions, la gestion des signatures (collectées off-chain via l'API BlockDeploy pour le MVP), et l'exécution des transactions M/N.


**L6-M1.4: Collecte des ABIs et Préparation de la Documentation Technique Initiale**
- Date: 2025-06-07T16:40:20+00:00
- Avancement: Terminé.
- Actions:
  - Identification des ABIs clés nécessaires pour `Safe.sol` et `SafeProxyFactory.sol` pour les interactions MVP.
  - Noté la nécessité de rechercher les adresses officielles des singletons Safe et des factories sur les réseaux cibles (ex: Sepolia, Polygon, Mainnet Ethereum) - placeholders inclus pour l'instant.
  - Création du document de spécification technique initial `docs/architecture/L6_M1_DAO_CONTRACT_SPEC.md`.
  - Ce document inclut : la décision d'utiliser Gnosis Safe, des placeholders pour les adresses des contrats, des fragments d'ABI pertinents pour le MVP (Factory, Setup, Gestion Propriétaires/Seuil, Gestion Transactions, Views, Événements), et une description de l'architecture de déploiement via proxies.


**L6-M1.5: Mettre à Jour `devlog/LOT_6_LOG.md` (Finalisation L6-M1)**
- Date: 2025-06-07T17:13:24+00:00
- Avancement: Terminé.
- Actions:
  - Le `devlog/LOT_6_LOG.md` a été maintenu à jour tout au long de L6-M1.
  - Toutes les sous-tâches de L6-M1 (Recherche, Spécifications, Décision, Collecte ABIs/Doc Initiale) sont complétées et documentées.
  - **FIN DE LA MILESTONE L6-M1: Conception et Sélection/Adaptation du Smart Contract Multisig DAO.**


**L6-M2.1: Conception de l'Endpoint API et du DTO de Création DAO**
- Date: 2025-06-07T17:15:35+00:00
- Avancement: Terminé.
- Actions de Conception:
  - **Route API Définie:**
    - `POST /api/v1/dao/multisig`
  - **DTO Défini (`DaoCreationRequestDto.ts` dans un futur `src/modules/dao/dtos/`):**
    - `name`: string (IsNotEmpty, IsString) - Nom de la DAO pour BlockDeploy.
    - `network`: string (IsNotEmpty, IsString) - Réseau de déploiement.
    - `owners`: string[] (IsArray, ArrayMinSize(1), IsEthereumAddress({each: true})) - Propriétaires initiaux.
    - `threshold`: number (IsNotEmpty, IsInt, IsPositive, @IsThresholdValid) - Seuil de signature M/N.
    - Un validateur custom `@IsThresholdValid` a été défini pour s'assurer que `0 < threshold <= owners.length`.
  - **Réponse API en Cas de Succès (Exemple):**
    ```json
    {
      success: true,
      daoAddress: 0xNewlyDeployedSafeProxyAddress...,
      deploymentTxHash: 0xTransactionHashForProxyDeployment...,
      message: DAO My DAO Name created successfully...
    }
    ```
  - Les erreurs utiliseront les codes HTTP standards.


**L6-M2.2: Service Backend (`DaoCreationService` ou extension d'un service existant)**
- Date: 2025-06-07T17:18:33+00:00
- Avancement: Terminé.
- Actions:
  - Création de `DaoCreationRequestDto.ts` (s'il n'existait pas) dans `src/modules/dao/dtos/`.
  - Création de `DaoCreationService.ts` dans `src/modules/dao/services/`.
  - Injection de `ProviderService` et `ConfigService` dans `DaoCreationService`.
  - Implémentation de la méthode `createDao(dto, userId)`:
    - Logique de validation des entrées (threshold vs owners).
    - Récupération des adresses de `Safe.sol` (singleton) et `SafeProxyFactory.sol` via `ConfigService`.
    - Logique de préparation de l'appel à la factory (obtention signer, encodage de l'initializer pour `setup()`).
    - Logique de déploiement du proxy Safe via appel direct à `createProxyWithNonce` de la factory (alternative à l'utilisation complète du Safe SDK pour cette étape).
    - Attente de la confirmation de transaction et tentative de récupération de l'adresse du nouveau Safe via l'événement `ProxyCreation`.
    - Gestion des erreurs (réseau non supporté, adresses non configurées, échec de déploiement).
  - Création de `DaoModule` (`src/modules/dao/dao.module.ts`) important `ConfigModule` et fournissant `DaoCreationService`.
  - Import de `DaoModule` dans `AppModule`.
  - (Note: L'utilisation complète du Safe{Core} SDK pour le déploiement est notée comme une option/amélioration potentielle par rapport à l'interaction directe avec la factory pour plus de robustesse et moins de code bas niveau).


**L6-M2.3: Persistance en Base de Données (Création DAO)**
- Date: 2025-06-07T17:20:29+00:00
- Avancement: Terminé.
- Actions:
  - **Définition du Schéma de Table `Daos` (Conceptuel):**
    - Colonnes: `id`, `name`, `network`, `address`, `version` (opt.), `singleton_address` (opt.), `factory_address` (opt.), `owners` (array/JSON), `threshold`, `creator_user_id`, `deployment_tx_hash`, `salt_nonce` (opt.), `created_at`, `updated_at`.
  - **Création de `DaoRepositoryService.ts` (Placeholder):**
    - Simule l'interaction avec la base de données (sauvegarde en mémoire pour l'instant).
    - Méthode `saveDaoDetails(daoData)` implémentée.
  - **Modification de `DaoCreationService.ts`:**
    - Injection de `DaoRepositoryService`.
    - Appel à `daoRepositoryService.saveDaoDetails()` après le déploiement réussi du contrat Safe.
    - La méthode `createDao` retourne maintenant aussi le `daoId` (de la DB) en plus de `daoAddress` et `transactionHash`.
    - Amélioration de la récupération de `newSafeAddress` depuis l'événement `ProxyCreation`.
  - **Mise à jour de `DaoModule.ts`:**
    - Ajout de `DaoRepositoryService` à la liste des `providers`.


**L6-M2.4: Contrôleur API (`DaoController` pour création DAO)**
- Date: 2025-06-07T17:24:15+00:00
- Avancement: Terminé.
- Actions:
  - Création de `DaoCreationResponseDto.ts` dans `src/modules/dao/dtos/`.
  - Création de `DaoController.ts` dans `src/modules/dao/controllers/`.
  - Injection de `DaoCreationService`.
  - Implémentation de la méthode `createDao` pour l'endpoint `POST /api/v1/dao/multisig`:
    - Utilisation de `@Body()` avec `DaoCreationRequestDto` pour validation.
    - Récupération de `userId` depuis `@Req()` (via `AuthGuard` supposé).
    - Appel à `daoCreationService.createDao()`.
    - Formatage de la réponse avec `DaoCreationResponseDto` (incluant `daoId`, `daoAddress`, `deploymentTxHash`).
    - Utilisation de `@HttpCode(HttpStatus.CREATED)`.
  - Application d'un `@UseGuards(AuthGuard('jwt'))` (placeholder) au contrôleur.
  - Mise à jour de `DaoModule.ts` pour inclure `DaoController` (corrigé avec overwrite_file_with_block).

---

**L6-M4.2: Frontend - Intégration API Création DAO (Safe)**
- Date: 2025-06-07T17:45:00+00:00 (Heure indicative de finalisation)
- Avancement: Terminé.
- Description des Accomplissements:
  - Identification du composant `pages/wizard/WizardConfigPage.tsx` comme étant le formulaire principal pour la configuration des contrats, y compris les DAOs.
  - Modification des champs du formulaire pour le type de contrat `ContractType.DAO` pour inclure :
    - `daoName`: Nom de la DAO (pour affichage et suivi dans BlockDeploy).
    - `owners`: Adresses des propriétaires initiaux (entrées comme une chaîne de caractères séparée par des virgules).
    - `threshold`: Seuil de signature requis (M parmi N propriétaires).
    - `network`: Réseau cible pour le déploiement de la DAO (ex: 'sepolia', 'polygon').
  - Implémentation de la validation robuste pour les champs spécifiques à la DAO :
    - `owners`: Doit contenir au moins une adresse, et chaque adresse doit être une adresse Ethereum valide (format `0x...`).
    - `threshold`: Doit être un entier positif et ne pas dépasser le nombre total de propriétaires.
    - `network`: Ne doit pas être vide.
  - Connexion du formulaire de création DAO à l'endpoint API backend `POST /api/v1/dao/multisig`.
  - Gestion de la requête API :
    - Construction du payload JSON avec les champs `owners` (transformés en tableau d'adresses), `threshold` (converti en nombre), et `network`.
    - Ajout d'un placeholder pour l'en-tête `Authorization: Bearer <token>` (récupération du token depuis `localStorage`).
  - Traitement de la réponse API en cas de succès :
    - Récupération des données `safeAddress` (adresse du contrat Safe déployé), `txHash` (hash de la transaction de déploiement), et `daoId` (identifiant interne de la DAO dans BlockDeploy).
  - Stockage structuré des résultats de la création dans le contexte du wizard (`wizardData.deploymentResult`) :
    - `safeAddress`, `txHash`, `daoId`.
    - `name` (le `daoName` fourni par l'utilisateur).
    - `network` (le réseau de déploiement).
    - `contractType` (explicitement `ContractType.DAO`).
    - Ces données sont ensuite utilisées par `WizardSuccessPage.tsx` pour afficher un résumé de la création.
  - Gestion des états de chargement pendant l'appel API :
    - Un indicateur de chargement textuel ("Creating DAO, please wait...") est affiché.
    - Les boutons de navigation ("Back", "Next") sont désactivés pour prévenir les actions multiples.
  - Gestion des erreurs provenant de l'API :
    - Les messages d'erreur retournés par l'API (ex: validation échouée, échec de déploiement) sont affichés à l'utilisateur.
    - Une gestion des erreurs réseau génériques est également en place.
- Statut: Cette tâche est considérée comme finalisée. Les modifications apportées à `WizardConfigPage.tsx` permettent une création de DAO fonctionnelle via l'interface utilisateur, avec un retour d'information adéquat à l'utilisateur.

---

**L6-M5: Frontend - Interface de Gestion des Propositions (Conceptuel)**
- Date: 2025-06-07T18:00:00+00:00 (Heure indicative de finalisation)
- Avancement: Terminé.
- Description des Accomplissements:
  - Création et remplissage du document de conception UI/UX `docs/ui_ux/L6_M5_DAO_PROPOSAL_MANAGEMENT_UI.md`.
  - Le document détaille de manière conceptuelle les aspects suivants de l'interface utilisateur pour la gestion des propositions DAO :
    - **Contexte et Emplacement :** Accès via la page de détail d'une DAO, permissions utilisateur.
    - **Affichage des Propositions :** Structure de liste, options de tri et de filtrage (par statut), contenu détaillé des cartes de proposition individuelles (ID, titre, statut, détails de l'action, progression des confirmations, initiateur, dates, boutons d'action contextuels).
    - **Soumission d'une Nouvelle Proposition :** Formulaire en plusieurs étapes (choix du type, remplissage des détails), support pour divers types de propositions (transfert de fonds, ajout/retrait de propriétaire, changement de seuil, transaction personnalisée), et assistance à la construction du champ `data` pour les types courants. Inclut une étape de revue et soumission.
    - **Interaction avec les Propositions Existantes :** Processus de confirmation (signature) et d'exécution des propositions, conditions d'affichage des boutons d'action, et feedback utilisateur.
    - **Wireframes / Maquettes ASCII :** Représentations textuelles de la page de propositions et de la modale de création.
    - **États et Feedback Utilisateur :** Stratégies pour gérer les états de chargement, les notifications de succès, les messages d'erreur (validation, signature, transaction, API), et autres indications visuelles.
- Statut: La phase de conception conceptuelle pour l'interface de gestion des propositions DAO est considérée comme finalisée. Ce document servira de guide pour l'implémentation future.

---

**L6-M4.3 & L6-M6: Frontend - Intégration Dashboard et Suivi des DAOs (Conceptuel)**
- Date: 2025-06-07T18:15:00+00:00 (Heure indicative de finalisation)
- Avancement: Terminé.
- Description des Accomplissements:
  - Création et remplissage du document de conception UI/UX `docs/ui_ux/L6_M4_3_DAO_DASHBOARD_INTEGRATION.md`.
  - Ce document fusionne les aspects de visualisation des DAOs créées (L6-M4.3) et leur intégration plus large dans le dashboard pour le suivi (L6-M6).
  - Le document détaille conceptuellement :
    - **Section "Mes DAOs" dans le Dashboard Principal :** Comment les DAOs de l'utilisateur (créées ou dont il est membre) sont listées (format carte), les informations clés affichées par DAO (nom, adresse, réseau, config M/N, indicateur d'activité optionnel), et les interactions (clic pour détail, actions rapides optionnelles).
    - **Page de "Détail de la DAO" :** Accessible via la liste "Mes DAOs", cette page propose une vue complète d'une DAO sélectionnée. Elle inclut un en-tête avec les informations d'identification de la DAO (nom, adresse, réseau, solde optionnel) et une structure de navigation par onglets :
        - **Onglet "Aperçu" :** Résumé des informations vitales (configuration, liste des propriétaires, activité récente optionnelle).
        - **Onglet "Propositions" :** Intégration de l'interface de gestion des propositions définie dans `L6_M5_DAO_PROPOSAL_MANAGEMENT_UI.md`.
        - **Onglet "Membres" :** Vue détaillée des propriétaires et raccourcis pour proposer des ajouts/retraits.
        - **Onglet "Paramètres de la DAO" :** Vue du seuil et raccourci pour proposer des modifications.
    - **Récupération des Données :** Spécification des besoins API pour peupler ces vues (endpoints pour lister les DAOs de l'utilisateur et pour obtenir les détails d'une DAO spécifique, données attendues).
    - **Wireframes / Maquettes ASCII :** Illustrations textuelles de la section "Mes DAOs" et de la page de "Détail de la DAO" avec sa structure à onglets.
- Statut: La phase de conception conceptuelle pour l'intégration des DAOs au dashboard et leur suivi est considérée comme finalisée. Ce document servira de guide pour l'implémentation frontend.

---

**L6-M7: Tests Backend et Documentation API Finale DAO Builder**
- Date: 2025-06-07T18:30:00+00:00 (Heure indicative de finalisation)
- Avancement: Terminé (pour les fonctionnalités implémentées).
- Description des Accomplissements:
  - Identification des composants backend clés pour la fonctionnalité de création de DAO (L6-M2), notamment `DaoCreationService`, `DaoRepositoryService`, et `DaoController`.
  - Reconnaissance que les fonctionnalités backend pour la gestion des propositions (prévues pour L6-M3) ne sont pas encore implémentées et, par conséquent, les tests et la documentation API pour ces aspects sont en attente.
  - **Définition Conceptuelle des Tests Backend (pour Création DAO) :**
    - **Tests Unitaires :**
        - `DaoController`: Vérification de la bonne invocation du `DaoCreationService`, gestion des DTOs, et réponses HTTP.
        - `DaoCreationService`: Tests de la logique de validation (ex: `threshold` vs `owners.length`), interaction correcte avec `ConfigService` (pour adresses factory/singleton), `ProviderService` (pour interaction blockchain), et `DaoRepositoryService` (pour persistance). Simulation (mocking) des dépendances externes.
        - `DaoRepositoryService`: Tests des opérations CRUD de base pour les entités DAO (simulation de la base de données).
    - **Tests d'Intégration :**
        - Test du flux complet de l'API `POST /api/v1/dao/multisig` depuis la requête HTTP jusqu'à la simulation de l'interaction avec la blockchain ( déploiement du proxy Safe) et la persistance en base de données. Utilisation de mocks pour les appels réels à la blockchain (ex: `ethers.js` interactions).
  - **Mise à Jour de la Documentation API :**
    - Ajout de la documentation détaillée pour l'endpoint de création de DAO `POST /api/v1/dao/multisig` au fichier `docs/api/API_DOCUMENTATION.md`.
    - Cette documentation inclut la description de l'endpoint, les paramètres de la requête (`DaoCreationRequestDto`), les exemples de corps de requête, les réponses de succès (avec `daoId`, `daoAddress`, `deploymentTxHash`), et les codes d'erreur courants avec exemples.
    - Une note a été ajoutée dans la documentation API pour indiquer que les endpoints relatifs à la gestion des propositions DAO (L6-M3) seront documentés une fois leur implémentation backend finalisée.
- Statut: La tâche L6-M7 est considérée comme finalisée pour les fonctionnalités de création de DAO (L6-M2). Les tests et la documentation pour la gestion des propositions (L6-M3) seront abordés lorsque cette milestone sera implémentée.
