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
## 2023-11-11 (Date Simulé)

### Fait ✅
*   **L4-M4.1: Développement du smart contract `ERC721MVP.sol` (TERMINÉ)**
*   **L4-M4.2: Définition de la structure de configuration & setup DB pour le template `ERC721MVP` (TERMINÉ)**

---
## 2023-11-12 (Date Simulé)

### Fait ✅
*   **L4-M5.1: Endpoint API pour NFT ERC-721 MVP (Option 1 IPFS - URL Externe) (Lot 4) (TERMINÉ - Documentation)**
*   **L4-M5.2: Intégration avec la file d'attente pour NFT ERC-721 MVP (Lot 4) (TERMINÉ - Documentation)**

---
## 2023-11-13 (Date Simulé - Cette journée)

### Fait ✅
*   **L4-M6.1: Formulaire de création NFT ERC-721 (Frontend - Option 1 IPFS) (Lot 4) (TERMINÉ - Documentation UI/UX)**
*   **L4-M6.2: Logique frontend pour appel API et feedback (NFT ERC-721 Option 1) (Lot 4) (TERMINÉ - Documentation)**
*   **L4-M7 (Stretch Goal): Intégration IPFS Simplifiée (Option 2 pour NFT) (Lot 4) - Documentation conceptuelle (TERMINÉ)**
    *   Description des modifications du formulaire frontend pour permettre l'upload d'image et la saisie de métadonnées pour un NFT.
    *   Description de la logique backend pour uploader image et JSON de métadonnées sur un service IPFS (Pinata/NFT.storage) et utiliser le CID du JSON comme `tokenURI`.
    *   Fichier `docs/features/L4_M7_NFT_IPFS_UPLOAD_OPTION2.md` créé.

### En Cours ⏳
*   Aucun.

### Prochaines Étapes 🚀
*   **L4-M8.1:** Tests E2E pour ERC-20 amélioré et NFT ERC-721 (Conceptuel).
*   **L4-M8.2:** Mise à jour de la documentation utilisateur.
*   Présenter le Lot 4 comme complété (conceptuellement) et attendre le feedback.

### Blocages  блокировка
*   Nécessité d'un environnement de compilation Solidity pour ABI/bytecodes finaux.
*   Configuration et clés API pour service IPFS (Pinata/NFT.storage) si L4-M7 doit être implémenté réellement.
EOF

echo "devlog/LOT_4_LOG.md mis à jour pour L4-M7."
