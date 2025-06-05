## L2-M3.1: Configuration du `ProviderService` pour Polygon

**Objectif:** Mettre à jour le `ProviderService` pour ajouter le support des réseaux Polygon Mainnet et Polygon Mumbai Testnet.

### 1. Modifications du Fichier `src/services/blockchain/ProviderService.ts`

**a. Mise à jour de l'objet `SUPPORTED_NETWORKS`:**
Ajouter les configurations pour Polygon Mainnet et Mumbai Testnet:
```typescript
// Dans src/services/blockchain/ProviderService.ts
// ...
const SUPPORTED_NETWORKS: { [key: string]: NetworkConfig } = {
  sepolia: { /* ... existant ... */ },
  polygon_mumbai: {
    rpcUrl: process.env.POLYGON_MUMBAI_RPC_URL || '',
    chainId: 80001,
    name: 'Polygon Mumbai Testnet',
  },
  polygon_mainnet: {
    rpcUrl: process.env.POLYGON_MAINNET_RPC_URL || '',
    chainId: 137,
    name: 'Polygon Mainnet',
  },
  // ...
};
// ...
```

**b. Variables d'Environnement Requises:**
Définir dans les fichiers `.env`:
*   `POLYGON_MUMBAI_RPC_URL`
*   `POLYGON_MAINNET_RPC_URL`

**c. Impact sur la Logique du `ProviderService`:**
*   Les méthodes `getProvider()` et `checkConnection()` fonctionneront avec les nouvelles configurations sans modification de leur logique interne.

### 2. Vérifications et Tests
*   Vérifier logs au démarrage pour erreurs de config RPC Polygon.
*   Utiliser `providerService.checkConnection('polygon_mumbai')` et `providerService.checkConnection('polygon_mainnet')` pour valider la connexion.
*   La tâche L2-M3.2 effectuera des tests de déploiement.

### 3. Mise à Jour de la Documentation Interne
Documenter les nouveaux réseaux supportés et les variables d'env requises.
