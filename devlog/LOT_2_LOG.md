# Changelog Développement - Lot 2: ERC-20 MVP & Support Polygon

## 2023-10-30 (Date Simulé)

### Fait ✅
*   **L2-M1.1:** Développement du smart contract `ERC20MVP.sol` (TERMINÉ)
*   **L2-M1.2:** Schéma de configuration & setup DB pour le template `ERC20MVP` (TERMINÉ)

---
## 2023-10-31 (Date Simulé)

### Fait ✅
*   **L2-M2.1:** Adaptation du `DeploymentService` (Lot 2) (TERMINÉ)
*   **L2-M2.2:** Création/Mise à jour des endpoints API (Lot 2) (TERMINÉ)
*   **L2-M2.3:** Intégration avec la file d'attente (Lot 2) (TERMINÉ)

---
## 2023-11-01 (Date Simulé)
*(Ajustement de la date précédente pour la clarté, les tâches M2.3 et M3.1 peuvent être sur des jours différents ou le même jour si petites)*

### Fait ✅
*   *(Les tâches de M2.3 étaient ici, déplacées au 2023-10-31 pour cet exemple de log)*

---
## 2023-11-02 (Date Simulé - Cette journée)

### Fait ✅
*   **L2-M3.1: Configuration du `ProviderService` pour Polygon (Lot 2) (TERMINÉ)**
    *   Documentation des modifications à apporter au `ProviderService` pour inclure les configurations RPC de Polygon Mainnet et Mumbai Testnet.
    *   Référence aux variables d'environnement `POLYGON_MUMBAI_RPC_URL` et `POLYGON_MAINNET_RPC_URL`.
    *   Fichier `docs/architecture/L2_M3_1_POLYGON_PROVIDER_CONFIG.md` créé.

### En Cours ⏳
*   Aucun.

### Prochaines Étapes 🚀
*   **L2-M3.2:** Tests de connectivité et de déploiement de base sur Polygon (Conceptuel).
*   **L2-M4.1:** Création du formulaire de configuration UI/UX pour ERC-20 MVP.
*   **L2-M4.2:** Logique frontend pour l'appel API de déploiement ERC-20 MVP.

### Blocages  блокировка
*   Nécessité d'un environnement de compilation Solidity (Hardhat/Foundry) pour ABI/bytecodes finaux des templates ERC-20 MVP.
*   Nécessité d'URLs RPC valides pour Polygon (Mumbai et Mainnet) dans les variables d'environnement pour des tests réels.
EOF

echo "devlog/LOT_2_LOG.md mis à jour pour L2-M3.1."
