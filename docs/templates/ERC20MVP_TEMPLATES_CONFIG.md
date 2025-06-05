## Configuration des Templates ERC-20 MVP (Lot 2 - L2-M1.2)

**Objectif:** Définir la structure de configuration pour les tokens ERC-20 MVP et décrire les entrées correspondantes dans la collection `SmartContractTemplateDBSchema`.

### 1. Structure de Configuration (Payload API & `DeploymentDBSchema.configuration`)

```json
{
  // "networkName": "polygon_mumbai",
  // "userGivenName": "Mon ERC20 MVP",
  "tokenConfig": {
    "name": "Mon MVP Token",
    "symbol": "MMT",
    "supplyType": "fixed", // "fixed" ou "capped"
    "initialSupply": "1000000", // En unités token. Pour "capped", c'est initialMintAmount.
    "cap": "2000000", // Requis si supplyType "capped". En unités token.
    "features": {
      "burnable": true,
      "pausable": true
    }
  }
}
```

### 2. Traduction de la Configuration en Arguments de Constructeur

Le backend traduira `tokenConfig` en arguments pour les constructeurs Solidity (décimales fixées à 18).

*   **Pour `ERC20FixedPausableBurnable(string name_, string symbol_, address initialOwner_, uint256 initialSupply_)`:**
    *   `name_`: `tokenConfig.name`
    *   `symbol_`: `tokenConfig.symbol`
    *   `initialOwner_`: `userId`
    *   `initialSupply_`: `ethers.parseUnits(tokenConfig.initialSupply, 18)`
    *   *Choisi si `tokenConfig.features.pausable`, `burnable` sont `true` et `supplyType` est `fixed`.*

*   **Pour `ERC20CappedPausableBurnableMintable(string name_, string symbol_, address initialOwner_, uint256 initialMintAmount_, uint256 cap_)`:**
    *   `name_`: `tokenConfig.name`
    *   `symbol_`: `tokenConfig.symbol`
    *   `initialOwner_`: `userId`
    *   `initialMintAmount_`: `ethers.parseUnits(tokenConfig.initialSupply, 18)`
    *   `cap_`: `ethers.parseUnits(tokenConfig.cap, 18)`
    *   *Choisi si `tokenConfig.features.pausable`, `burnable` sont `true` et `supplyType` est `capped`.*

Le `DeploymentService` déterminera le template pré-compilé et préparera `constructorArgs`.

### 3. Entrées pour `SmartContractTemplateDBSchema`

**Template 1: ERC-20 Fixe, Pausable, Burnable**
```json
{
  "templateKey": "ERC20MVP_Fixed_PausBurn_v1",
  "displayName": "Token ERC-20 (Supply Fixe, Pausable, Burnable)",
  "description": "Token ERC-20 standard avec supply fixe. Permet pause et burn.",
  "contractType": "ERC20",
  "abi": [ /* ABI simplifiée pour exemple */
    {"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"address","name":"initialOwner_","type":"address"},{"internalType":"uint256","name":"initialSupply_","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"}
  ],
  "bytecode": "0xPLACEHOLDER_BYTECODE_ERC20_FIXED_PAUS_BURN_V1...",
  "configurableParameters": [
    { "name": "name", "label": "Nom du Token", "type": "string", "required": true },
    { "name": "symbol", "label": "Symbole du Token", "type": "string", "required": true },
    { "name": "initialSupply", "label": "Supply Initiale Totale", "type": "string", "required": true }
  ],
  "supportedFeatures": { "mintable": false, "burnable": true, "pausable": true, "cappedSupply": false },
  "version": "1.0.0", "isActive": true
}
```

**Template 2: ERC-20 Plafonné, Pausable, Burnable, Mintable par Owner**
```json
{
  "templateKey": "ERC20MVP_Capped_PausBurnMint_v1",
  "displayName": "Token ERC-20 (Supply Plafonnée, Pausable, Burnable, Mintable)",
  "description": "Token ERC-20 avec supply max (plafond). Propriétaire peut minter jusqu'au plafond. Permet pause et burn.",
  "contractType": "ERC20",
  "abi": [ /* ABI simplifiée pour exemple */
    {"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"address","name":"initialOwner_","type":"address"},{"internalType":"uint256","name":"initialMintAmount_","type":"uint256"},{"internalType":"uint256","name":"cap_","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"}
  ],
  "bytecode": "0xPLACEHOLDER_BYTECODE_ERC20_CAPPED_PAUS_BURN_MINT_V1...",
  "configurableParameters": [
    { "name": "name", "label": "Nom du Token", "type": "string", "required": true },
    { "name": "symbol", "label": "Symbole du Token", "type": "string", "required": true },
    { "name": "initialSupply", "label": "Supply Initiale à Émettre", "type": "string", "required": true },
    { "name": "cap", "label": "Plafond Maximum de Supply", "type": "string", "required": true }
  ],
  "supportedFeatures": { "mintable": true, "burnable": true, "pausable": true, "cappedSupply": true },
  "version": "1.0.0", "isActive": true
}
```
**Note:** `abi` et `bytecode` nécessiteront les données réelles post-compilation.
