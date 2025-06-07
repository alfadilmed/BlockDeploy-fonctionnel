# L6-M1: Spécifications Techniques du Contrat DAO Multisig (Basé sur Gnosis Safe / Safe{Core})

**Date:** $(date --iso-8601=seconds)
**Statut:** Initialisation

## 1. Décision Architecturale

Pour le MVP du DAO Builder de BlockDeploy, il a été décidé d'utiliser directement les contrats **Gnosis Safe / Safe{Core}** audités et éprouvés.
Cette approche maximise la sécurité et tire parti d'un écosystème robuste. Les DAOs créées par les utilisateurs seront des instances de proxy (via \`SafeProxyFactory\`) pointant vers une implémentation maîtresse (singleton) de \`Safe.sol\`.

L'interaction backend avec ces contrats sera facilitée par l'utilisation du **Safe{Core} SDK**.

## 2. Adresses des Contrats Officiels (Exemples - À VÉRIFIER ET COMPLÉTER PAR RÉSEAU)

Les adresses exactes des singletons \`Safe.sol\` (L1 ou L2) et des \`SafeProxyFactory\` doivent être récupérées depuis la documentation officielle de Safe{Global} ou leurs ressources pour chaque réseau cible.

*   **Sepolia (Testnet Ethereum):**
    *   \`SafeL2.sol\` (Singleton Mastercopy): \`0xPLACEHOLDER_SEPOLIA_SAFE_L2_SINGLETON_ADDRESS\`
    *   \`SafeProxyFactory.sol\` (Version 1.3.0+): \`0xPLACEHOLDER_SEPOLIA_SAFE_PROXY_FACTORY_ADDRESS\`
*   **Polygon (Mainnet):**
    *   \`SafeL2.sol\` (Singleton Mastercopy): \`0xPLACEHOLDER_POLYGON_SAFE_L2_SINGLETON_ADDRESS\`
    *   \`SafeProxyFactory.sol\`: \`0xPLACEHOLDER_POLYGON_SAFE_PROXY_FACTORY_ADDRESS\`
*   **Ethereum (Mainnet):**
    *   \`Safe.sol\` (Singleton Mastercopy L1): \`0xPLACEHOLDER_MAINNET_SAFE_L1_SINGLETON_ADDRESS\`
    *   \`SafeProxyFactory.sol\`: \`0xPLACEHOLDER_MAINNET_SAFE_PROXY_FACTORY_ADDRESS\`

*(Note: Ces adresses sont cruciales et doivent être les adresses officielles et auditées).*

## 3. Fragments d'ABI Pertinents pour le MVP

Les ABIs complets peuvent être trouvés dans les dépôts GitHub de Safe{Global}. Voici les fragments essentiels pour les interactions du MVP BlockDeploy.

### 3.1. SafeProxyFactory.sol

\`\`\`json
[
  {
    "inputs": [
      { "internalType": "address", "name": "_singleton", "type": "address" },
      { "internalType": "bytes", "name": "initializer", "type": "bytes" },
      { "internalType": "uint256", "name": "saltNonce", "type": "uint256" }
    ],
    "name": "createProxyWithNonce",
    "outputs": [
      { "internalType": "contract SafeProxy", "name": "proxy", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
  // Potentiellement d'autres versions de createProxy si utilisées
]
\`\`\`

### 3.2. Safe.sol (Implémentation Maîtresse)

#### Fonctions d'Initialisation (appelées via \`initializer\` de la factory)
\`\`\`json
[
  {
    "inputs": [
      { "internalType": "address[]", "name": "_owners", "type": "address[]" },
      { "internalType": "uint256", "name": "_threshold", "type": "uint256" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "bytes", "name": "data", "type": "bytes" },
      { "internalType": "address", "name": "fallbackHandler", "type": "address" },
      { "internalType": "address", "name": "paymentToken", "type": "address" },
      { "internalType": "uint256", "name": "payment", "type": "uint256" },
      { "internalType": "address payable", "name": "paymentReceiver", "type": "address" }
    ],
    "name": "setup",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
\`\`\`

#### Fonctions de Gestion des Propriétaires/Seuil (appelées via \`execTransaction\`)
\`\`\`json
[
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "uint256", "name": "_threshold", "type": "uint256" }
    ],
    "name": "addOwnerWithThreshold",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "prevOwner", "type": "address" },
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "uint256", "name": "_threshold", "type": "uint256" }
    ],
    "name": "removeOwner", // Note: removeOwner prend prevOwner pour la liste chainée d'owners
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_threshold", "type": "uint256" }],
    "name": "changeThreshold",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
\`\`\`

#### Fonctions de Gestion des Transactions
\`\`\`json
[
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" },
      { "internalType": "bytes", "name": "data", "type": "bytes" },
      { "internalType": "enum Enum.Operation", "name": "operation", "type": "uint8" },
      { "internalType": "uint256", "name": "safeTxGas", "type": "uint256" },
      { "internalType": "uint256", "name": "baseGas", "type": "uint256" },
      { "internalType": "uint256", "name": "gasPrice", "type": "uint256" },
      { "internalType": "address", "name": "gasToken", "type": "address" },
      { "internalType": "address payable", "name": "refundReceiver", "type": "address" },
      { "internalType": "uint256", "name": "_nonce", "type": "uint256" }
    ],
    "name": "getTransactionHash",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" },
      { "internalType": "bytes", "name": "data", "type": "bytes" },
      { "internalType": "enum Enum.Operation", "name": "operation", "type": "uint8" },
      { "internalType": "uint256", "name": "safeTxGas", "type": "uint256" },
      { "internalType": "uint256", "name": "baseGas", "type": "uint256" },
      { "internalType": "uint256", "name": "gasPrice", "type": "uint256" },
      { "internalType": "address", "name": "gasToken", "type": "address" },
      { "internalType": "address payable", "name": "refundReceiver", "type": "address" },
      { "internalType": "bytes", "name": "signatures", "type": "bytes" }
    ],
    "name": "execTransaction",
    "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "hashToApprove", "type": "bytes32" }
    ],
    "name": "approveHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
\`\`\`

#### Fonctions de Lecture (Views)
\`\`\`json
[
  {
    "inputs": [],
    "name": "getOwners",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getThreshold",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "isOwner",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nonce",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
]
\`\`\`

#### Événements Clés
\`\`\`json
[
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "AddedOwner",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "RemovedOwner",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "threshold", "type": "uint256" }
    ],
    "name": "ChangedThreshold",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
    ],
    "name": "ExecutionSuccess",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
    ],
    "name": "ExecutionFailure",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "approvedHash", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "ApproveHash",
    "type": "event"
  }
]
\`\`\`

## 4. Architecture de Déploiement

Les DAOs seront créées en déployant un **proxy minimaliste (EIP-1167)** via la \`SafeProxyFactory\`. Ce proxy délègue tous les appels à une instance maîtresse (singleton) de \`Safe.sol\` qui est déjà déployée et auditée sur le réseau cible. L'initialisation du proxy (définition des propriétaires initiaux et du seuil) se fait via le paramètre \`initializer\` de la fonction \`createProxyWithNonce\`.

Cette approche est standard, sécurisée et minimise les coûts de déploiement pour les utilisateurs.

*(Ce document sera mis à jour avec les adresses exactes et des détails supplémentaires au fur et à mesure de l'avancement de L6-M1).*
