## L4-M2.1: Adaptation de l'API de Déploiement ERC-20 pour `ERC20Advanced`

**Objectif:** Détailler les modifications API backend pour déployer `ERC20Advanced.sol`.

### 1. Stratégie d'Endpoint API
Recommandation: Étendre `POST /api/v1/deploy/erc20-mvp` (ou le renommer `POST /api/v1/deploy/erc20`) en ajoutant un champ `templateKey` dans le payload pour spécifier le type de contrat ERC-20.

### 2. Modifications du Payload de l'API (Exemple)
```json
// POST /api/v1/deploy/erc20
{
  "networkName": "sepolia",
  "userGivenName": "Mon Token Avancé avec Rôles",
  "templateKey": "ERC20Advanced_v1", // Clé du template à utiliser
  "tokenConfig": {
    "name": "Token Avancé",
    "symbol": "ADVT",
    "initialAdmin": "0x...", // Opt., défaut: userId. Reçoit rôles admin/minter/pauser.
    "supplyType": "capped",
    "initialSupply": "1000000", // initialMintAmount pour capped
    "cap": "5000000",
    "features": {
      "pausable": true,
      "burnable": true
      // "mintableByRoles": true // Pourrait être un flag explicite pour choisir ce template
    }
  }
}
```
*   `templateKey`: Permet au backend de charger la bonne ABI/bytecode et de valider `tokenConfig`.
*   `initialAdmin`: Adresse pour les rôles `AccessControl`.

### 3. Logique du Handler API Backend
1.  Auth & Validation de base.
2.  Récupérer définition du template via `templateKey` (depuis `SmartContractTemplateDBSchema`).
3.  Valider `tokenConfig` contre `configurableParameters` du template.
4.  Préparer `constructorArgs` pour `ERC20Advanced.sol` à partir de `tokenConfig` (name, symbol, admin, initialSupplyWei, capWei, features flags).
5.  Créer enregistrement `DeploymentDBSchema` (`status: PENDING`, `templateKey` stocké).
6.  Préparer `DeploymentJobData` (`contractNameForPrecompiled = templateKey`, `constructorArgs` formatés).
7.  Ajout à `deploymentQueue`, Réponse `202 Accepted`.

### 4. Impact sur `DeploymentService`
*   `PRECOMPILED_CONTRACTS_STORE` (ou DB) doit inclure ABI/Bytecode pour "ERC20Advanced_v1".
*   Pas de modif majeure de `deployPrecompiledContract` si `constructorArgs` bien préparés.

### 5. Sécurité et Permissions
*   Rôles `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, `PAUSER_ROLE` assignés à `initialAdmin` dans constructeur. Gestion ultérieure via L4-M2.2 (API rôles).
