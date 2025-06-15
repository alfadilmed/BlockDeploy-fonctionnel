# Phase 2 - Lot 1: Constructeur de dApp Front-End - Fondations

**Objectif du Lot (P2-L1):** Définir l'architecture, les fonctionnalités clés MVP, et l'expérience utilisateur pour un constructeur de dApp frontend "Drag & Drop". Mettre en place les bases techniques et la documentation initiale pour son développement.

## 1. Contexte et Justification

La Phase 1 de BlockDeploy a établi une plateforme robuste pour le déploiement de smart contracts (ERC-20, NFT, DAOs). Cependant, pour de nombreux utilisateurs, en particulier ceux moins techniques, la création d'une interface utilisateur (frontend) pour interagir avec ces contrats reste un obstacle majeur. Un constructeur de dApp frontend "Drag & Drop" vise à combler ce fossé.

**Importance pour BlockDeploy:**
- **Démocratisation de la création de dApps:** Abaisser la barrière à l'entrée pour la création d'applications Web3 complètes.
- **Valeur ajoutée à l'écosystème:** Permettre aux utilisateurs de BlockDeploy de passer du déploiement de contrat à une dApp fonctionnelle sans quitter la plateforme.
- **Différenciation concurrentielle:** Offrir un outil intégré qui simplifie un aspect complexe du développement Web3.

**Public Cible:**
- Utilisateurs non-développeurs ou peu techniques souhaitant créer des interfaces simples pour leurs contrats.
- Développeurs cherchant à prototyper rapidement des frontends pour leurs smart contracts.
- Projets communautaires ou petites entreprises voulant une présence Web3 interactive sans investir massivement dans du développement frontend custom.

**Valeur Ajoutée:**
- Réduction du temps et des coûts de développement frontend pour des cas d'usage courants.
- Autonomisation des utilisateurs pour la création de leurs propres outils et vitrines Web3.
- Augmentation de l'engagement et de l'utilisation des contrats déployés via BlockDeploy.

## 2. Objectifs Spécifiques du Lot

- Réaliser une étude de marché et une analyse comparative pour informer la conception et le positionnement du constructeur de dApp.
- Définir un périmètre MVP clair et réalisable pour la première version du constructeur, en se concentrant sur les cas d'usage clés et les fonctionnalités essentielles.
- Établir une conception architecturale solide pour le constructeur et les dApps générées, en choisissant les technologies et librairies appropriées.
- Produire une conception UI/UX détaillée et intuitive pour l'interface du constructeur de dApp.
- Décrire conceptuellement les étapes d'initialisation technique du projet frontend, préparant le terrain pour la phase de développement.
- Produire toute la documentation conceptuelle nécessaire (spécifications, architecture, design) pour guider l'implémentation future.

## 3. Milestones Suggérées (Jalons)

- **P2-L1-M1 : Étude de Marché et Analyse Comparative (Conceptuel)**
    - **Description:** Analyser le marché des constructeurs d'applications (en particulier les dApps et les applications web "no-code/low-code") pour identifier les tendances, les acteurs clés, les fonctionnalités standards, les modèles économiques, et les opportunités pour le constructeur de dApp de BlockDeploy.
    - **Activités:**
        - Recherche et documentation sur les outils no-code/low-code généralistes (ex: Webflow, Bubble) et leur pertinence/lacunes pour le Web3.
        - Recherche et documentation sur les outils de développement/prototypage Web3 existants (ex: Scaffold-ETH, plateformes dApp builder émergentes).
        - Identification des fonctionnalités "must-have" et "nice-to-have" pour un constructeur de dApp MVP.
        - Analyse des modèles UX/UI courants et des approches de "Drag & Drop".
    - **Livrable:** Document de synthèse de l'étude: `docs/phase_2/research/P2_L1_M1_DAPP_BUILDER_MARKET_ANALYSIS.md`.
- **P2-L1-M2 : Définition du Périmètre MVP pour le Constructeur de dApp (Conceptuel)**
    - **Description:** Définir clairement les fonctionnalités minimales mais valorisantes pour la première version du constructeur de dApp. Cela inclut les types de dApps/pages réalisables, les composants "Drag & Drop" disponibles, la gestion des contrats, et les options de publication.
    - **Activités:**
        - Identifier les 2-3 cas d'usage Web3 les plus courants et simples à adresser pour un MVP (ex: page de présentation ERC-20, page de mint NFT, interface DAO basique).
        - Lister les composants UI Web3 essentiels (connexion wallet, lecture/écriture contrat, affichage soldes/NFTs) et standards (texte, image, bouton, conteneur) pour le MVP.
        - Spécifier comment les utilisateurs importeront/connecteront leurs smart contracts (ceux de BlockDeploy et externes).
        - Définir les options de prévisualisation et de publication pour les dApps créées (ex: export statique, hébergement IPFS optionnel).
        - Lister explicitement les fonctionnalités qui seront exclues du MVP pour maintenir un périmètre réalisable.
    - **Livrable:** Document de spécification du périmètre MVP: `docs/phase_2/specs/P2_L1_M2_DAPP_BUILDER_MVP_SCOPE.md`.
- **P2-L1-M3 : Conception Architecturale (Conceptuel)**
    - **Description:** Définir l'architecture technique globale du constructeur de dApp et des dApps qu'il génère. Cela inclut les choix de framework/librairies frontend, la gestion de l'état, la structure des composants "Drag & Drop", et l'interaction avec les smart contracts.
    - **Activités:**
        - Choix du framework frontend principal (React confirmé) et des librairies clés (ex: pour le Drag & Drop, gestion d'état).
        - Définition de la structure d'un composant "Drag & Drop" (configuration, rendu, propriétés).
        - Conception de la manière dont les dApps générées interagiront avec les wallets et les smart contracts (utilisation d'ethers.js/viem, gestion des ABIs).
        - Spécification d'une architecture backend simple (si jugée nécessaire pour le MVP) pour la sauvegarde et le chargement des projets de dApp des utilisateurs.
        - Réflexion sur les options de publication/hébergement des dApps générées.
    - **Livrable:** Document d'architecture technique: `docs/phase_2/architecture/P2_L1_M3_DAPP_BUILDER_ARCHITECTURE.md`.
- **P2-L1-M4 : Conception UI/UX Détaillée du Constructeur (Conceptuel)**
    - **Description:** Élaborer les maquettes détaillées (wireframes ou maquettes basse fidélité) de l'interface du constructeur de dApp, ainsi que les principaux parcours utilisateurs.
    - **Activités:**
        - Conception de la structure globale de l'interface du constructeur: zone de canvas, palette de composants, panneau de propriétés, barre d'outils principale.
        - Définition de l'apparence et du comportement des composants "Drag & Drop" dans la palette et sur le canvas.
        - Conception du panneau de propriétés pour la configuration des composants (UI standard et composants Web3 spécifiques).
        - Élaboration des parcours utilisateurs clés : création d'un projet, ajout/configuration de composants, liaison de données de contrat, prévisualisation, publication.
        - Production de wireframes ou maquettes ASCII pour illustrer les écrans principaux.
    - **Livrable:** Document de design UI/UX: `docs/phase_2/ui_ux/P2_L1_M4_DAPP_BUILDER_UI_UX.md`.
- **P2-L1-M5 : Initialisation Technique du Projet Frontend (Implémentation de Base)**
    - **Description:** Mettre en place la structure de base du projet ou module frontend pour le constructeur de dApp. Installer et configurer les dépendances techniques majeures identifiées lors de la conception architecturale.
    - **Activités (Conceptuelles pour cette phase de planification):**
        - **Choix de l'emplacement du code:**
            - Option A: Nouveau projet/repository dédié spécifiquement au constructeur de dApp.
            - Option B: Nouveau module au sein de l'application frontend BlockDeploy existante (si l'architecture le permet et si cela facilite la réutilisation des composants UI et services existants).
            - *Décision Prise (Simulée):* Intégration comme nouveau module dans le frontend BlockDeploy existant pour bénéficier des composants UI, du routing et des services d'authentification.
        - **Initialisation du Module/Projet:**
            - Création de la structure de dossiers de base pour le module du constructeur (ex: `src/modules/dapp-builder/`, contenant `core/` pour la logique du canvas, `components/` pour les éléments Drag & Drop, `editor-ui/` pour l'interface du builder, `state/` pour la gestion d'état).
        - **Installation des Dépendances Clés (via `npm` ou `yarn`):**
            - React, Vite (si applicable, ou configuration existante).
            - Librairie Drag & Drop: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
            - Gestion d'état: `zustand` (ou Redux Toolkit si préféré).
            - Librairie d'interaction Web3: `ethers` (version 5 ou 6, selon standard projet) ou `viem`.
            - Autres utilitaires (ex: `clsx` pour classes conditionnelles, `lucide-react` pour icônes).
        - **Configuration Initiale:**
            - Configuration de base pour TypeScript (`tsconfig.json` adapté si besoin).
            - Configuration de base pour ESLint/Prettier.
            - Mise en place du routing de base pour accéder à l'interface du constructeur (ex: `/dapp-builder/:projectId`).
        - **Création de Composants "Placeholder" pour les Zones Principales:**
            - Un composant squelette pour le `CanvasArea`.
            - Un composant squelette pour la `ComponentPalette`.
            - Un composant squelette pour le `PropertiesPanel`.
            - Un composant squelette pour la `MainEditorLayout` qui agence ces zones.
    - **Livrable (Conceptuel):** Description des étapes d'initialisation. Aucun code n'est produit à ce stade de planification du Lot 1. Le livrable réel (code) sera produit lors de l'implémentation effective de P2-L1.
- **P2-L1-M6 : Documentation Initiale et Planification P2-L2**
    - **Description:** Finaliser la documentation conceptuelle pour P2-L1 et esquisser les grandes lignes pour le lot suivant (P2-L2), qui se concentrera sur le développement des premiers composants et fonctionnalités du constructeur de dApp.
    - **Activités:**
        - S'assurer que tous les documents de P2-L1 (étude de marché, périmètre MVP, architecture, UI/UX, initialisation technique) sont complets et cohérents.
        - Remplir les sections restantes du présent document de planification P2-L1 (`Contexte et Justification`, `Objectifs Spécifiques`, `Fonctionnalités Clés MVP`, `Critères de Succès`, `Risques`).
        - Créer une ébauche du document de planification pour P2-L2 (`docs/phase_2/P2_L2_DAPP_BUILDER_CORE_DEV.md` - nom à confirmer), en listant les objectifs principaux (ex: développement du canvas, de la palette, des premiers composants Drag & Drop Web3 et UI, panneau de propriétés de base).
        - Mettre à jour le `devlog/LOT_P2_L1_LOG.md` pour refléter la complétion de toutes les milestones de planification de P2-L1.
    - **Livrable (Conceptuel):**
        - Ce document (`P2_L1_DAPP_BUILDER_FOUNDATIONS.md`) complété.
        - Ébauche du document de planification pour P2-L2.
        - `devlog/LOT_P2_L1_LOG.md` finalisé pour P2-L1.

## 4. Fonctionnalités Clés du MVP du Constructeur de dApp

Les fonctionnalités clés du MVP sont détaillées dans le document `docs/phase_2/specs/P2_L1_M2_DAPP_BUILDER_MVP_SCOPE.md`. En résumé, elles incluent :

- **Cas d'Usage Cibles:**
    - Création de pages de présentation pour tokens ERC-20 (affichage d'infos, solde utilisateur).
    - Création de pages de mint simples pour collections NFT ERC-721 existantes.
    - Création d'interfaces de base pour des DAOs simples (affichage d'infos, liste de propositions en lecture seule).
- **Composants "Drag & Drop" Web3 Essentiels:**
    - Connexion/Déconnexion Wallet.
    - Affichage d'Adresse Connectée, Sélecteur de Réseau.
    - Lecteur de Données Contrat (pour fonctions `view`).
    - Bouton d'Interaction Contrat (pour fonctions `write`).
    - Affichage de Solde (ETH/ERC-20).
    - Liste/Affichage de NFTs ERC-721.
- **Composants UI Standards:**
    - Texte, Titre, Image, Bouton, Conteneur, Champ de Saisie.
- **Gestion des Smart Contracts:**
    - Import simplifié des contrats déployés via BlockDeploy.
    - Import de contrats externes via adresse et ABI (JSON).
- **Publication et Hébergement:**
    - Prévisualisation en direct.
    - Export des fichiers statiques de la dApp.
    - *Optionnel MVP:* Publication sur IPFS.

## 5. Dépendances

- Accès aux informations des contrats déployés via BlockDeploy (APIs existantes ou à étendre).
- Potentiellement, une infrastructure backend pour sauvegarder les configurations des dApps.

## 6. Critères de Succès du Lot

- Tous les documents de conception (étude de marché, périmètre MVP, architecture, UI/UX) sont produits, revus et considérés comme complets et suffisamment détaillés pour entamer une phase d'implémentation.
- Le périmètre du MVP est clairement défini, validé, et jugé réalisable tout en apportant une valeur utilisateur significative.
- Les choix technologiques clés pour l'architecture sont justifiés et documentés.
- Les étapes pour l'initialisation technique du projet frontend sont clairement décrites.
- Le présent document de planification (`P2_L1_DAPP_BUILDER_FOUNDATIONS.md`) est complété et validé.
- Le devlog (`devlog/LOT_P2_L1_LOG.md`) est à jour et reflète toutes les activités de planification de ce lot.

## 7. Risques et Atténuations

- **Risque 1: Complexité technique sous-estimée pour le Drag & Drop et la gestion de l'état du canvas.**
    - *Atténuation:* Choix de librairies robustes et éprouvées (@dnd-kit, Zustand). Prévoir des Proofs of Concept (PoC) techniques sur les aspects les plus complexes avant une implémentation à grande échelle (sera partie de P2-L2 ou d'un lot d'implémentation).
- **Risque 2: Difficulté à maintenir une UX simple et intuitive face à la flexibilité requise.**
    - *Atténuation:* Se concentrer sur les cas d'usage MVP. Itérer sur l'UX avec des maquettes et prototypes, et prévoir des tests utilisateurs tôt dans la phase de développement.
- **Risque 3: Le périmètre du MVP est trop ambitieux ou pas assez pertinent pour les utilisateurs.**
    - *Atténuation:* Baser le périmètre sur l'étude de marché (P2-L1-M1) et les retours utilisateurs potentiels. Commencer petit et itérer.
- **Risque 4: Difficulté d'intégration avec différents types de wallets ou de contrats (ABI variés).**
    - *Atténuation:* S'appuyer sur des standards (ethers.js, EIP-1193). Pour le MVP, limiter la complexité des interactions contractuelles supportées nativement par les composants. Fournir des mécanismes clairs pour la fourniture d'ABI.
- **Risque 5: Performances du constructeur ou des dApps générées.**
    - *Atténuation:* Choix de technologies performantes. Optimisations à prévoir lors de la phase de développement. Pour le MVP, la complexité des dApps générées sera limitée.

---
*Ce document servira de guide pour le développement du Lot 1 de la Phase 2.*
