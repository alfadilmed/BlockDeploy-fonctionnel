# Plan Détaillé – Phase 1 / Lot 5: Enrichissement Dashboard & Onboarding

**Objectif du Lot 5:** Améliorer significativement l'utilité du Dashboard en y intégrant l'affichage de données on-chain et des actions interactives basiques sur les contrats. Parallèlement, enrichir l'expérience d'onboarding avec une checklist de démarrage et fournir les premiers contenus fondamentaux pour la Mini-Academy. Ce lot s'appuie sur les Axes 3, 4 et 5 du Plan Consolidé de la Phase 1.

---

## Milestones Suggérées pour le Lot 5

### L5-M1: Dashboard - Affichage Données Contrat On-Chain (Lecture Seule)

*   **Description:** Permettre aux utilisateurs de voir des informations clés directement depuis leur Dashboard pour les contrats qu'ils ont déployés, sans avoir à systématiquement consulter un explorateur de blocs externe pour les données de base.
*   **Fonctionnalités:**
    *   **Pour les contrats ERC-20 (déployés via BlockDeploy):**
        *   Afficher le `name()` (Nom du token).
        *   Afficher le `symbol()` (Symbole du token).
        *   Afficher le `decimals()` (Nombre de décimales).
        *   Afficher le `totalSupply()`.
        *   Si le contrat supporte `ERC20Capped` (comme `ERC20Advanced.sol` s'il est configuré avec un cap): Afficher `cap()`.
    *   **Pour les contrats ERC-721 (déployés via BlockDeploy, ex: `ERC721MVP.sol`):**
        *   Afficher le `name()` (Nom de la collection).
        *   Afficher le `symbol()` (Symbole de la collection).
        *   (Optionnel - à investiguer pour l'efficacité) Afficher le `totalSupply()` (nombre total de NFTs mintés). Pour les ERC-721 standards, cela peut nécessiter de parcourir les événements `Transfer` ou d'utiliser `ERC721Enumerable` (que `ERC721MVP.sol` n'utilise pas par défaut pour des raisons de gas). Une alternative pourrait être de compter les NFTs mintés via la base de données interne si les mints via BlockDeploy sont tracés.
*   **Implémentation Technique:**
    *   Utiliser le `ProviderService` existant pour effectuer des appels `read` (statiques) aux contrats intelligents sur le réseau approprié.
    *   Adapter l'interface utilisateur du Dashboard (probablement la vue détaillée d'un contrat) pour présenter ces informations de manière claire et lisible.
    *   Gérer les cas où l'information n'est pas disponible ou le contrat ne supporte pas une interface spécifique (ex: `cap()` pour un ERC-20 non cappé).

### L5-M2: Dashboard - Actions Interactives Basiques (ERC-20)

*   **Description:** Fournir aux utilisateurs la capacité d'exécuter des actions administratives courantes sur leurs contrats ERC-20 directement depuis le Dashboard.
*   **Fonctionnalités (pour les contrats ERC-20 déployés par l'utilisateur via BlockDeploy):**
    *   **Pause/Unpause:** Si le contrat hérite de `Pausable.sol` (ex: `ERC20Advanced.sol`) et que l'utilisateur est `owner`:
        *   Action `pause()`: Met le contrat en pause (les transferts sont généralement bloqués).
        *   Action `unpause()`: Lève la pause du contrat.
    *   **Mint:** Si le contrat hérite de `Mintable` (ex: `ERC20Advanced.sol` avec `MINTER_ROLE`) et que l'utilisateur connecté a le `MINTER_ROLE` (typiquement l'owner initial):
        *   Action `mint(recipient_address, amount)`: Permet de créer de nouveaux tokens et de les assigner à une adresse.
        *   Le `amount` devra être ajusté en fonction des `decimals` du token.
*   **Implémentation Technique:**
    *   Backend: Nouvel(s) endpoint(s) API pour initier ces actions. L'API doit vérifier la propriété du contrat et les permissions (`Ownable`, `AccessControl`).
    *   Backend: Interaction avec le `ProviderService` pour envoyer des transactions signées (write calls).
    *   Frontend: Ajouter des boutons/formulaires dans la vue détaillée du contrat sur le Dashboard.
    *   Frontend: Modales de confirmation avant d'exécuter une action state-changing.
    *   Frontend: Feedback à l'utilisateur sur l'état de la transaction (soumise, en attente, confirmée, échouée) et mise à jour des données on-chain (ex: `totalSupply` après un mint) si L5-M1 est complétée.

### L5-M3: Dashboard - Actions Interactives Basiques (ERC-721)

*   **Description:** Similaire à L5-M2, mais pour les contrats NFT ERC-721.
*   **Fonctionnalités (pour les contrats ERC-721 déployés par l'utilisateur via BlockDeploy):**
    *   **Pause/Unpause:** Si le contrat hérite de `Pausable.sol` (ex: `ERC721MVP.sol`) et que l'utilisateur est `owner`:
        *   Action `pause()` et `unpause()`.
    *   **Mint:** Si le contrat permet au propriétaire de minter (ex: `ERC721MVP.sol` via la fonction `safeMint(to, tokenId, tokenURI)` appelée par `owner`):
        *   Action `safeMint(recipient_address, tokenId, tokenURI)`.
        *   Le `tokenId` doit être unique. Il pourrait être suggéré (auto-incrémenté basé sur un compteur interne ou le `totalSupply` si disponible et fiable) ou demandé à l'utilisateur.
        *   Le `tokenURI` sera soit celui généré via le flux L4-M7 (upload IPFS simplifié), soit fourni manuellement par l'utilisateur s'il gère ses métadonnées autrement.
*   **Implémentation Technique:**
    *   Similaire à L5-M2 (endpoints API, vérifications de propriété, interface utilisateur, feedback transaction).
    *   Une attention particulière sera portée à la gestion du `tokenId` et à l'obtention/validation du `tokenURI`.

### L5-M4: Onboarding - Checklist de Démarrage Intégrée

*   **Description:** Guider les nouveaux utilisateurs à travers les premières étapes clés de l'utilisation de BlockDeploy pour améliorer leur compréhension et leur engagement initial.
*   **Fonctionnalités:**
    *   **Conception de la Checklist:**
        1.  Connecter son portefeuille Web3.
        2.  (Optionnel) Obtenir des tokens de test pour un Testnet.
        3.  Déployer son premier contrat (suggestion: ERC-20 MVP).
        4.  Explorer son contrat sur un explorateur de blocs.
        5.  Visiter la Mini-Academy pour en apprendre plus (lien vers la page principale de l'Academy).
        6.  (Optionnel) Créer un NFT en utilisant l'upload simplifié IPFS.
    *   **Intégration UI:**
        *   Afficher la checklist de manière proéminente pour les nouveaux utilisateurs (ex: sur le Dashboard principal, ou via un pop-up/tooltip guide).
        *   Permettre à l'utilisateur de cocher/décocher les étapes.
    *   **Persistance de l'État:**
        *   Stocker l'état d'avancement de la checklist (les étapes cochées) pour chaque utilisateur. Peut être fait côté client (localStorage) pour une MVP, ou côté backend pour une synchronisation entre appareils.
*   **Implémentation Technique:**
    *   Frontend: Développement des composants UI pour la checklist.
    *   Frontend/Backend: Logique pour la persistance de l'état.

### L5-M5: Mini-Academy - Premiers Articles de Fond

*   **Description:** Commencer à peupler la Mini-Academy avec des articles pratiques et éducatifs qui aident les utilisateurs à mieux comprendre et utiliser la plateforme et les concepts Web3.
*   **Contenus à Rédiger:**
    *   **Article 1: "Comment Minter des Tokens ERC-20 (après déploiement) ?"**
        *   Expliquer le concept de minting pour les tokens ERC-20.
        *   Guider l'utilisateur sur comment utiliser la fonctionnalité de mint du Dashboard (développée en L5-M2).
        *   Inclure des cas d'usage (ex: augmenter la supply pour une distribution, etc.).
    *   **Article 2: "Comment Minter un NFT ERC-721 (après avoir obtenu un tokenURI) ?"**
        *   Rappeler comment obtenir un `tokenURI` (via L4-M7 ou manuellement).
        *   Guider l'utilisateur sur comment utiliser la fonctionnalité de mint NFT du Dashboard (développée en L5-M3).
        *   Expliquer l'importance du `tokenId` unique.
    *   **Article 3: "Comment Vérifier votre Contrat sur un Explorateur de Blocs ?"**
        *   Expliquer ce qu'est un explorateur de blocs (Etherscan, Polygonscan, etc.).
        *   Montrer comment trouver son contrat (via l'adresse du contrat fournie par BlockDeploy).
        *   Identifier les informations clés : code source (si vérifié), transactions, balance d'un token pour une adresse, etc.
*   **Implémentation Technique:**
    *   Créer les fichiers Markdown pour chaque article dans le répertoire `docs/mini-academy/`.
    *   Assurer une structure claire et une rédaction pédagogique, avec des captures d'écran (mockups si l'UI n'est pas encore prête).
    *   (Hors Scope Lot 5, pour plus tard) Mettre en place un système simple pour afficher ces articles Markdown dans la section "Mini-Academy" du frontend. Pour l'instant, la livraison concerne les fichiers bruts.

### L5-M6 (Optionnel Stretch Goal): Dashboard - Améliorations UI/UX Mineures

*   **Description:** Adresser des petites améliorations d'ergonomie du Dashboard basées sur les retours ou les observations faites durant le développement des autres milestones de ce lot.
*   **Exemples Potentiels (à définir en fonction des besoins):**
    *   Amélioration du tri ou du filtrage de la liste des contrats déployés.
    *   Affichage plus clair des statuts de transaction.
    *   Liens plus visibles vers les explorateurs de blocs pour chaque contrat.
*   **Implémentation:** Modifications ciblées du frontend du Dashboard.

---

## Dépendances

*   **Lot 3 (MVP Dashboard & Onboarding Initial):** La structure de base du Dashboard et les premiers éléments d'onboarding (tooltips, page d'aide) sont des prérequis.
*   **Lot 4 (Amélioration ERC-20 & NFT MVP):** Les contrats `ERC20Advanced.sol` et `ERC721MVP.sol` avec leurs fonctionnalités spécifiques (Pausable, Mintable, etc.) sont nécessaires pour les actions interactives du Dashboard. La fonctionnalité d'upload IPFS (L4-M7) est directement liée à l'un des articles de la Mini-Academy et à l'action de mint NFT.

---

## Considérations Techniques Clés

*   **Interactions Blockchain:** Utilisation intensive du `ProviderService` pour lire les données des contrats et pour envoyer des transactions signées.
*   **Gestion des Transactions:** Pour les actions interactives (mint, pause), il faudra gérer le cycle de vie complet d'une transaction : préparation, signature par l'utilisateur (via son wallet connecté), envoi, attente de la confirmation (mining), et gestion des erreurs.
*   **Sécurité:** Une attention particulière doit être portée à la vérification des droits de l'utilisateur avant d'autoriser des actions modificatrices sur les contrats (ex: seul le propriétaire peut pauser ou minter s'il a le rôle).
*   **État de l'UI:** Le Dashboard devra refléter l'état on-chain des contrats et mettre à jour son affichage après des actions réussies. La gestion des états (loading, error, success) pour les actions interactives est cruciale pour l'UX.

---
Ce document servira de guide pour le développement du Lot 5.
