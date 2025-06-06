## Configuration du Template ERC-20 Advanced (Lot 4 - L4-M1.2)

**Objectif:** Définir la structure de configuration pour `ERC20Advanced.sol` et l'entrée `SmartContractTemplateDBSchema`.

### 1. Structure de Configuration Utilisateur (Payload API `tokenConfig`)
```json
{
  "name": "Mon Token Avancé",
  "symbol": "MTA",
  "initialAdmin": "0xUSER_WALLET_ADDRESS", // Opt., défaut: user connecté
  "supplyType": "capped", // "fixed" ou "capped"
  "initialSupply": "1000000", // Unités token. Si "capped", c'est initialMintAmount.
  "cap": "5000000",         // Requis si "capped". Unités token.
  "features": {
    "pausable": true,
    "burnable": true
  }
  // "minterConfig": { "additionalMinters": ["0x..."] } // Optionnel avancé, post L4-M1.2
}
```

### 2. Traduction en Arguments de Constructeur `ERC20Advanced.sol`
Constructeur: `(name_, symbol_, initialAdmin_, initialSupply_, cap_, featuresPausable_, featuresBurnable_, featuresCapped_)`
1.  `name_`: `tokenConfig.name`
2.  `symbol_`: `tokenConfig.symbol`
3.  `initialAdmin_`: `tokenConfig.initialAdmin` ou `userId`
4.  `initialSupply_`: `ethers.parseUnits(tokenConfig.initialSupply, 18)`
5.  `cap_`: Si `capped`: `ethers.parseUnits(tokenConfig.cap, 18)`. Si `fixed`: `ethers.parseUnits(tokenConfig.initialSupply, 18)`.
6.  `featuresPausable_`: `tokenConfig.features.pausable`
7.  `featuresBurnable_`: `tokenConfig.features.burnable`
8.  `featuresCapped_`: `tokenConfig.supplyType === "capped"`

### 3. Entrée pour `SmartContractTemplateDBSchema` (Exemple)
```json
{
  "templateKey": "ERC20Advanced_v1",
  "displayName": "Token ERC-20 Avancé (Configurable)",
  "description": "ERC-20 avec supply fixe/plafonnée, pause, burn, et mint via rôles.",
  "contractType": "ERC20",
  "abi": [ /* ABI complète de ERC20Advanced.sol - exemple simplifié */
    {"inputs": [{"internalType":"string","name":"name_","type":"string"}, /* ... autres args ... */ {"internalType":"bool","name":"featuresCapped_","type":"bool"}],"stateMutability":"nonpayable","type":"constructor"},
    {"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}
    // ...
  ],
  "bytecode": "0xPLACEHOLDER_BYTECODE_ERC20ADVANCED_V1...",
  "configurableParameters": [
    { "name": "name", "label": "Nom Token", "type": "string", "required": true },
    { "name": "symbol", "label": "Symbole Token", "type": "string", "required": true },
    { "name": "initialAdmin", "label": "Admin Initial", "type": "address", "required": false },
    { "name": "supplyType", "label": "Type Supply", "type": "select", "options": [{"label": "Fixe", "value": "fixed"}, {"label": "Plafonnée", "value": "capped"}], "defaultValue": "fixed" },
    { "name": "initialSupply", "label": "Supply Initiale/à Émettre", "type": "string", "required": true },
    { "name": "cap", "label": "Plafond Max (si Plafonnée)", "type": "string", "condition": {"field": "supplyType", "value": "capped"} },
    { "name": "features.pausable", "label": "Activer Pausable", "type": "boolean", "defaultValue": true },
    { "name": "features.burnable", "label": "Activer Burnable", "type": "boolean", "defaultValue": true }
  ],
  "supportedFeatures": { "mintable": true, "burnable": true, "pausable": true, "cappedSupply": true, "accessControl": true },
  "version": "1.0.0", "isActive": true
}
```
**Note:** ABI/Bytecode réels requis post-compilation. `configurableParameters` aide à la validation/génération de formulaire.

Cette configuration permettra au backend de gérer le template `ERC20Advanced`.
