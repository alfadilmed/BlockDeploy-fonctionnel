## Estimation d'Effort pour l'Expansion Multi-Chaînes (Lot 6)

**Objectif:** Fournir une estimation relative de l'effort requis pour ajouter le support de nouveaux réseaux blockchain (BNB Chain, Arbitrum, Optimism) à BlockDeploy.

**Échelle d'Effort Relatif:**
*   **TFS (Très Faible):** < 0.5 jour-homme
*   **FS (Faible):** 0.5 - 1 jour-homme
*   **M (Moyen):** 1 - 3 jours-hommes
*   **E (Élevé):** > 3 jours-hommes

**Hypothèses:** Architecture multi-chaînes de base en place (via Ethereum/Polygon). Contrats Solidity compatibles EVM.

### Matrice d'Estimation d'Effort par Réseau et par Aspect

| Aspect d'Intégration                     | BNB Smart Chain (BSC) | Arbitrum One          | Optimism              | Notes Générales                                                                 |
| :--------------------------------------- | :--------------------: | :--------------------: | :--------------------: | :------------------------------------------------------------------------------ |
| **1. Configuration Backend**             |                        |                        |                        |                                                                                 |
|   - Obtention/Gestion Provider RPC       |           FS           |           FS           |           FS           | Accès aux endpoints RPC.                                                        |
|   - Variables d'environnement/Config     |          TFS           |          TFS           |          TFS           | Ajout Chain ID, URL RPC, nom.                                                 |
| **2. Adaptation Frontend**               |                        |                        |                        |                                                                                 |
|   - Ajout au Sélecteur de Réseau         |          TFS           |          TFS           |          TFS           | Logo, nom, Chain ID.                                                          |
|   - Liens Explorateur de Blocs           |          TFS           |          TFS           |          TFS           | BscScan, Arbiscan, Optimistic Etherscan.                                      |
|   - Gestion Changement Réseau Wallet     |          TFS           |          TFS           |          TFS           | Logique générique.                                                            |
| **3. Tests de Déploiement Contrats**     |                        |                        |                        | ERC-20 & NFT sur Testnet & Mainnet.                                             |
|   - ERC-20 (base)                        |           FS           |           FS           |           FS           |                                                                                 |
|   - NFT (ERC-721, base)                  |           FS           |           FS           |           FS           |                                                                                 |
| **4. Tests d'Interaction (Dashboard)**   |                        |                        |                        | Lecture on-chain, actions basiques.                                             |
|   - Lecture Données Contrat              |           FS           |           FS           |           FS           | `totalSupply`, `balanceOf`, etc.                                                |
|   - Actions Basiques                     |           FS           |           M            |           M            | L2s peuvent avoir particularités de gas/finalité affectant UX.                |
| **5. Documentation & Contenu**           |                        |                        |                        |                                                                                 |
|   - Mise à jour Docs Utilisateur         |          TFS           |          TFS           |          TFS           |                                                                                 |
|   - (Opt.) Contenu Academy/Guides        |           FS           |           FS           |           FS           |                                                                                 |
| **6. Investigation Spécificités Réseau** |           FS           |           M            |           M            | Gas, temps de bloc, finalité. 'M' pour L2s.                                   |
| **Effort Total Relatif Estimé / Réseau** |        **Faible**        |  **Faible à Moyen**  |  **Faible à Moyen**  |                                                                                 |

### Analyse et Recommandations de Priorisation (Lot 6)

*   **BNB Smart Chain (BSC):** Impact Élevé, Effort Faible. **Priorité Haute.**
*   **Arbitrum One:** Impact Élevé, Effort Faible à Moyen. **Priorité Haute.**
*   **Optimism:** Impact Moyen à Élevé, Effort Faible à Moyen. **Priorité Moyenne à Haute.**

**Séquencement Suggéré (après Polygon):** 1. BNB Smart Chain, 2. Arbitrum One, 3. Optimism.

**Facteurs Pouvant Influencer l'Effort:** Qualité RPC, complexité contrats BlockDeploy, abstraction interaction blockchain, différences EVMs/L2s.
