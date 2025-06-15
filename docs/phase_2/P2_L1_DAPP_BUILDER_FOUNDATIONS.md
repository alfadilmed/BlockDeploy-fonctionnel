# Phase 2 - Lot 1: Constructeur de dApp Front-End - Fondations

**Objectif du Lot (P2-L1):** Définir l'architecture, les fonctionnalités clés MVP, et l'expérience utilisateur pour un constructeur de dApp frontend "Drag & Drop". Mettre en place les bases techniques et la documentation initiale pour son développement.

## 1. Contexte et Justification

*(À compléter : Importance de cette fonctionnalité pour BlockDeploy, public cible, valeur ajoutée.)*

## 2. Objectifs Spécifiques du Lot

- *(À compléter)*

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
    - *(Détails à compléter)*
- **P2-L1-M6 : Documentation Initiale et Planification P2-L2**
    - *(Détails à compléter)*

## 4. Fonctionnalités Clés du MVP du Constructeur de dApp

*(À compléter sur la base de P2-L1-M2)*

## 5. Dépendances

- Accès aux informations des contrats déployés via BlockDeploy (APIs existantes ou à étendre).
- Potentiellement, une infrastructure backend pour sauvegarder les configurations des dApps.

## 6. Critères de Succès du Lot

- *(À compléter : Ex: Documents de conception validés, périmètre MVP clair, initialisation technique fonctionnelle.)*

## 7. Risques et Atténuations

- *(À compléter)*

---
*Ce document servira de guide pour le développement du Lot 1 de la Phase 2.*
