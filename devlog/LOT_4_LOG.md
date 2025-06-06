# Changelog Développement - Lot 4: ERC-20 Amélioré & NFT ERC-721 MVP

## 2023-11-08 (Date Simulé)

### Fait ✅
*   **L4-M1.1:** Développement du smart contract `ERC20Advanced.sol` (TERMINÉ)
*   **L4-M1.2:** Mise à jour de la configuration DB pour le template `ERC20Advanced` (TERMINÉ)

---
## 2023-11-09 (Date Simulé)

### Fait ✅
*   **L4-M2.1:** Adaptation de l'API de déploiement ERC-20 (Lot 4) (TERMINÉ)
*   **L4-M2.2 (Opt.):** API pour la gestion post-déploiement du `MINTER_ROLE` (Lot 4) (TERMINÉ - Documentation)

---
## 2023-11-10 (Date Simulé)

### Fait ✅
*   **L4-M3.1:** Mise à jour du formulaire de création ERC-20 (Lot 4) (TERMINÉ - Documentation UI/UX)

---
## 2023-11-11 (Date Simulé - Cette journée)

### Fait ✅
*   **L4-M4.1: Développement du smart contract `ERC721MVP.sol` (TERMINÉ)**
    *   Création du fichier `contracts/ERC721MVP.sol`.
    *   Contrat basé sur OpenZeppelin: `ERC721`, `ERC721Burnable`, `ERC721Pausable`, `EIP2981` (royalties), `Ownable`.
    *   Fonctionnalités:
        *   Constructeur avec `name_`, `symbol_`, `initialOwner_`, `baseTokenURI_`, `royaltyReceiver_`, `royaltyFractionBps_`.
        *   `_baseURI()` et `setBaseURI()` pour gérer l'URI de base des métadonnées.
        *   `tokenURI()` pour concaténer `baseURI` et `tokenId`.
        *   `safeMint(address to)` (auto-incrémente `_nextTokenId`) et `safeMintWithId(address to, uint256 tokenId)`. Protégées par `Ownable`.
        *   `pause()` et `unpause()` protégées par `Ownable`.
    *   *Note: Nécessite compilation et tests unitaires dans un environnement Hardhat/Foundry pour validation complète.*

### En Cours ⏳
*   Aucun.

### Prochaines Étapes 🚀
*   **L4-M4.2:** Définition de la structure de configuration & setup DB pour le template `ERC721MVP`.
*   **L4-M5.1:** Endpoint API pour NFT ERC-721 MVP (Option 1 IPFS - URL Externe).
*   **L4-M6.1:** Formulaire de création NFT ERC-721 (Frontend - Option 1).

### Blocages  блокировка
*   Nécessité d'un environnement de compilation Solidity (Hardhat/Foundry) pour ABI/bytecodes finaux.
EOF

echo "devlog/LOT_4_LOG.md mis à jour pour L4-M4.1."
