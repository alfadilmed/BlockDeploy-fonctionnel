# BlockDeploy 🚀

## 📖 Description Fonctionnelle

BlockDeploy est une plateforme innovante conçue pour démocratiser l'accès à la technologie blockchain. Elle permet aux entrepreneurs, développeurs et créateurs de déployer des contrats intelligents (Smart Contracts) tels que des tokens ERC-20, des collections NFT (ERC-721), des organisations autonomes décentralisées (DAO), et plus encore, via une interface utilisateur no-code intuitive et conviviale. Notre objectif est de simplifier radicalement le processus de création et de gestion d'actifs numériques et de systèmes décentralisés sur diverses blockchains.

## 🎯 Objectifs

*   **Simplifier le Déploiement de Smart Contracts :** Offrir une expérience utilisateur fluide qui abstrait la complexité du code Solidity et des environnements de développement blockchain.
*   **Accélérer l'Innovation Web3 :** Permettre aux porteurs de projets de concrétiser rapidement leurs idées sans nécessiter une expertise technique approfondie en blockchain.
*   **Sécurité et Fiabilité :** Fournir des templates de contrats intelligents pré-audités et testés pour garantir la sécurité des fonds et des opérations des utilisateurs.
*   **Flexibilité Multi-Chaînes :** Supporter le déploiement sur plusieurs réseaux blockchain majeurs (Ethereum, Polygon, BNB Chain, etc.).
*   **Écosystème Complet :** Évoluer vers une suite d'outils Web3 intégrée, de la conception à la gestion post-déploiement.

## 🚀 Démarrage Rapide

### Prérequis

*   Node.js (version 18.x ou supérieure recommandée)
*   npm / yarn / pnpm

### Installation

1.  Clonez le dépôt :
    ```bash
    git clone [URL_DU_REPO]
    cd blockdeploy
    ```
2.  Installez les dépendances (à la racine du projet pour le frontend Next.js) :
    ```bash
    npm install
    # ou
    # yarn install
    # ou
    # pnpm install
    ```
    Si vous travaillez également sur le backend (dans le dossier `backend/`), n'oubliez pas d'installer aussi ses dépendances.

### Lancement de l'application Frontend (Next.js)

Pour démarrer l'application en mode développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.
La page principale du constructeur de dApp est accessible via [http://localhost:3000/dapp-builder/default](http://localhost:3000/dapp-builder/default).

### Scripts Disponibles

*   `npm run dev`: Lance l'application Next.js en mode développement.
*   `npm run build`: Construit l'application Next.js pour la production.
*   `npm run start`: Démarre un serveur Next.js de production (après un `build`).
*   `npm run lint`: Lance ESLint pour analyser le code.
*   `npm run cy:test`: Exécute les tests End-to-End avec Cypress en mode headless avec Chrome. (Assurez-vous que l'application est lancée sur `http://localhost:3000` dans un autre terminal).

### Exécuter les Tests End-to-End (Cypress)

1.  Assurez-vous que votre application de développement est en cours d'exécution :
    ```bash
    npm run dev
    ```
2.  Dans un autre terminal, exécutez les tests Cypress :
    ```bash
    npm run cy:test
    ```
    Pour ouvrir l'interface graphique de Cypress et exécuter les tests interactivement :
    ```bash
    npx cypress open
    ```
    (Nécessite que Cypress soit installé, ce qui est fait avec `npm install`).

## 🛠 Tech Stack (Actuel Frontend & Cible Générale)

*   **Frontend:** Next.js (App Router), React 18, TypeScript, Zustand, Tailwind CSS (à intégrer/confirmer), Lucide Icons, Framer Motion, Recharts.
*   **Tests E2E:** Cypress
*   **Backend (Cible):** Node.js (Express.js) / NestJS (envisagé pour la robustesse)
*   **Smart Contracts (Cible):** Solidity
*   **Base de Données (Cible):** MongoDB (ou PostgreSQL pour des relations plus complexes à terme)
*   **Interaction Blockchain (Cible):** Ethers.js / Viem
*   **Authentification (Cible):** NextAuth.js / JWT
*   **Hébergement (Cible):** Vercel (Frontend), AWS/Google Cloud (Backend & DB)

## ✨ Fonctionnalités Principales (MVP et Vision)

*   **Déploiement No-Code :**
    *   Sélection de templates de contrats intelligents (ERC-20, NFT ERC-721, DAO basique).
    *   Configuration des paramètres du contrat via des formulaires intuitifs.
    *   Déploiement en un clic sur les réseaux de test et principaux.
*   **Tableau de Bord Utilisateur :**
    *   Gestion des contrats déployés.
    *   Visualisation des informations de base des contrats.
*   **Connexion de Wallet :** Intégration transparente avec les portefeuilles Web3 populaires (MetaMask, WalletConnect).
*   **Templates Pré-Audités :** Bibliothèque de contrats standards sécurisés.
*   **Support Multi-Chaînes (initial) :** Déploiement sur au moins un réseau de test (e.g., Sepolia) et un mainnet (e.g., Ethereum/Polygon).

## ✍️ Auteur

Ce projet est développé et maintenu par **Primex Software**.

Primex Software est une entreprise de services numériques spécialisée en développement sur mesure, conception d'interfaces (UI/UX), et conseil en technologies de l'information, avec une expertise pointue dans le domaine de la blockchain. Nous accompagnons nos clients dans la transformation digitale et l'adoption des technologies Web3.

Pour en savoir plus : [https://primex.software](https://primex.software)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
