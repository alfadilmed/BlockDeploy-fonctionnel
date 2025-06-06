## Configuration du Template ERC-721 MVP (Lot 4 - L4-M4.2)

**Objectif:** Définir la structure de configuration pour `ERC721MVP.sol` et l'entrée `SmartContractTemplateDBSchema`.

**Référence:** Contrat `contracts/ERC721MVP.sol` (L4-M4.1).

### 1. Structure de Configuration Utilisateur (Payload API `collectionConfig`)
```json
{
  // "networkName": "polygon_mumbai",
  // "userGivenName": "Ma Collection NFT MVP",
  "collectionConfig": {
    "name": "Ma Super Collection",
    "symbol": "MSC",
    "baseTokenURI": "ipfs://CID_METADATA_FOLDER/", // Doit finir par '/' si JSONs nommés par tokenId
    "royalties": {
      "receiver": "0xRoyaltyReceiverAddress...",
      "fractionBps": 500 // 500 = 5.00%
    },
    "features": {
      "pausable": true
    }
    // "initialOwner": "0xUSER_WALLET_ADDRESS" // Opt., défaut: user connecté
  }
}
```

### 2. Traduction en Arguments de Constructeur `ERC721MVP.sol`
Constructeur: `(name_, symbol_, initialOwner_, baseTokenURI_, royaltyReceiver_, royaltyFractionBps_)`
1.  `name_`: `collectionConfig.name`
2.  `symbol_`: `collectionConfig.symbol`
3.  `initialOwner_`: `collectionConfig.initialOwner` ou `userId`
4.  `baseTokenURI_`: `collectionConfig.baseTokenURI`
5.  `royaltyReceiver_`: `collectionConfig.royalties.receiver`
6.  `royaltyFractionBps_`: `collectionConfig.royalties.fractionBps` (uint96)

Le flag `collectionConfig.features.pausable` est informatif (contrat hérite `ERC721Pausable`).

### 3. Entrée pour `SmartContractTemplateDBSchema` (Exemple)
```json
{
  "templateKey": "ERC721MVP_Std_RoyaltyPausBurn_v1",
  "displayName": "Collection NFT Standard (ERC-721)",
  "description": "ERC-721 de base avec royalties EIP-2981, pause, burn. Métadonnées via URL de base externe.",
  "contractType": "NFT_ERC721",
  "abi": [ /* ABI complète de ERC721MVP.sol - exemple simplifié */
    {"inputs": [{"internalType":"string","name":"name_","type":"string"}, /* ... autres args ... */ {"internalType":"uint96","name":"royaltyFractionBps_","type":"uint96"}],"stateMutability":"nonpayable","type":"constructor"},
    {"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"safeMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}
    // ...
  ],
  "bytecode": "0xPLACEHOLDER_BYTECODE_ERC721MVP_V1...",
  "configurableParameters": [
    { "name": "name", "label": "Nom Collection", "type": "string", "required": true },
    { "name": "symbol", "label": "Symbole Collection", "type": "string", "required": true },
    { "name": "baseTokenURI", "label": "URL Base Métadonnées (doit finir par /)", "type": "string", "required": true, "placeholder": "ipfs://CID_FOLDER/" },
    { "name": "royalties.receiver", "label": "Adresse Receveur Royalties", "type": "address", "required": true },
    { "name": "royalties.fractionBps", "label": "% Royalties (BPS, ex: 500 pour 5%)", "type": "number", "required": true, "min":0, "max":10000 },
    { "name": "features.pausable", "label": "Rendre collection pausable", "type": "boolean", "defaultValue": true }
  ],
  "supportedFeatures": { "burnable": true, "pausable": true, "royaltiesEIP2981": true, "metadataManagement": "baseURI" },
  "version": "1.0.0", "isActive": true
}
```
**Note:** ABI/Bytecode réels requis. `royaltyFractionBps` UI devrait demander % et convertir.

Cette configuration est pour l'Option 1 (URL externe).
