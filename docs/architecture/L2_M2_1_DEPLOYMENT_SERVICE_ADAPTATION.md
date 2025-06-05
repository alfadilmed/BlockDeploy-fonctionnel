## L2-M2.1: Adaptation du `DeploymentService` pour ERC-20 MVP

**Objectif:** Détailler les modifications pour que `DeploymentService` supporte les templates ERC-20 MVP.

### 1. Contexte

Le `DeploymentService` déploie à partir d'ABI, Bytecode, réseau, et `constructorArgs`.
`DeploymentJobData` contient `networkName`, `contractNameForPrecompiled`, et `constructorArgs`.
La `tokenConfig` utilisateur pour ERC-20 MVP doit être transformée en `constructorArgs` spécifiques.

### 2. Modifications Proposées (Logique de Transformation en Amont)

La transformation de `tokenConfig` en `constructorArgs` spécifiques au contrat Solidity choisi (`ERC20FixedPausableBurnable` ou `ERC20CappedPausableBurnableMintable`) doit se faire **avant** l'appel à `DeploymentService.deployPrecompiledContract`. Cette logique peut être dans le service API (qui crée le job) ou dans le `deploymentWorker`.

**Flux dans le Worker (ou Service API):**
1.  Recevoir/Récupérer la `tokenConfig` complète.
2.  **Logique de Sélection & Préparation Args:**
    *   Basé sur `tokenConfig.supplyType` et `tokenConfig.features`, déterminer `contractNameForPrecompiled` (ex: "ERC20MVP_Fixed_PausBurn_v1").
    *   Construire le tableau `constructorArgs` à partir de `tokenConfig` (ex: `ethers.parseUnits` pour supply/cap, `ownerAddress`).
3.  Le `DeploymentJobData` soumis à la queue contiendra la `contractNameForPrecompiled` spécifique et les `constructorArgs` formatés.

**Conclusion pour `DeploymentService`:**
*   **Pas de modification majeure de `DeploymentService.deployPrecompiledContract` nécessaire.**
*   Il continue de prendre ABI, bytecode (via `getPrecompiledContract(contractNameForPrecompiled)`), et `constructorArgs` déjà préparés.

### 3. Mise à Jour du `PRECOMPILED_CONTRACTS_STORE` (Simulation)

Ajouter les entrées pour les templates ERC-20 MVP dans le store utilisé par `getPrecompiledContract`:
```typescript
// Dans DeploymentService.ts ou un fichier de config des templates
// ...
"ERC20MVP_Fixed_PausBurn_v1": {
  abi: [/* ABI ERC20FixedPausableBurnable */],
  bytecode: "0xBYTECODE_ERC20_FIXED_PAUS_BURN_V1..."
},
"ERC20MVP_Capped_PausBurnMint_v1": {
  abi: [/* ABI ERC20CappedPausableBurnableMintable */],
  bytecode: "0xBYTECODE_ERC20_CAPPED_PAUS_BURN_MINT_V1..."
}
// ...
```
Les ABI/bytecodes doivent être issus de la compilation réelle.

### 4. Impact sur `DeploymentJobData`
La structure reste inchangée, mais le contenu de `contractNameForPrecompiled` et `constructorArgs` sera spécifique aux nouveaux templates ERC-20 MVP.

Cette approche maintient un `DeploymentService` générique et reporte la logique de configuration spécifique aux templates en amont.
