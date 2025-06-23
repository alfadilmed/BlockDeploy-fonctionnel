# Configuration d'un Token ERC-20 sur BlockDeploy

Pour déployer un token ERC-20 standard sur BlockDeploy, voici les éléments clés à considérer dans votre fichier de configuration `blockdeploy.yaml` :

## Section `smartContracts`

```yaml
smartContracts:
  myERC20Token:
    path: "./contracts/MyToken.sol" # Chemin vers votre contrat Solidity
    constructorArgs:
      name: "Mon Super Token"
      symbol: "MST"
      initialSupply: 1000000 # Exprimé en unités entières (pas de décimales ici)
    blockchain: "ethereum_sepolia" # Ou autre réseau supporté
    compiler:
      version: "0.8.20"
```

### Paramètres Importants :

- **`path`**: Chemin relatif vers votre fichier de contrat Solidity (ex: `MyToken.sol`).
- **`constructorArgs`**:
    - **`name`**: Le nom complet de votre token (ex: "My Super Token").
    - **`symbol`**: Le symbole de votre token (ex: "MST").
    - **`initialSupply`**: L'offre initiale de tokens. Notez que les décimales sont gérées par la fonction `decimals()` dans votre contrat ERC20, pas directement ici.
- **`blockchain`**: L'identifiant du réseau cible (ex: `ethereum_mainnet`, `ethereum_sepolia`, `polygon_mumbai`).
- **`compiler.version`**: La version du compilateur Solidity à utiliser, doit correspondre au pragma de votre contrat.

## Exemple de Contrat `MyToken.sol` (basique)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * (10**decimals())); // Assurez-vous que `decimals()` retourne la bonne valeur (ex: 18)
    }
}
```

**Conseils :**
- Utilisez les contrats OpenZeppelin pour une base ERC-20 robuste et sécurisée.
- Testez minutieusement votre contrat et sa configuration sur un testnet avant de déployer sur mainnet.
- Adaptez `initialSupply` en fonction des décimales de votre token.
