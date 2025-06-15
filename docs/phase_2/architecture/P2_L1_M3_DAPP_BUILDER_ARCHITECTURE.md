# P2-L1-M3: Conception Architecturale - Constructeur de dApp Front-End

**Date:** $(date -I)

## 1. Introduction

Ce document présente la conception architecturale préliminaire pour le constructeur de dApp frontend de BlockDeploy. Il couvre les aspects clés de l'architecture frontend, les interactions avec le backend (si nécessaire pour la sauvegarde des projets), et la manière dont les dApps générées interagiront avec les smart contracts.

## 2. Vue d'Ensemble de l'Architecture

L'architecture comprendra principalement :

- **Le Constructeur de dApp (Frontend):** L'interface où les utilisateurs construisent leurs dApps.
    - Un "Canvas" ou une zone de prévisualisation.
    - Une "Palette" de composants Drag & Drop.
    - Un "Panneau de Propriétés" pour configurer les composants sélectionnés.
- **Les dApps Générées (Frontend):** Les applications web statiques ou dynamiques produites par le constructeur.
- **Un Backend BlockDeploy (Optionnel pour MVP de base, mais recommandé pour la persistance):** Pour sauvegarder les projets de dApp des utilisateurs, gérer les templates, etc.

## 3. Architecture Frontend du Constructeur

### 3.1. Framework Principal
    - **Choix Proposé:** Continuer avec **React (utilisant Vite)** comme pour le reste de l'application BlockDeploy, pour la cohérence et la réutilisation des composants UI existants.
    - **Alternative:** Next.js si des fonctionnalités SSR/SSG avancées sont nécessaires pour les dApps générées, mais cela pourrait complexifier le constructeur lui-même. Pour un MVP, Vite/React semble suffisant.

### 3.2. Librairie de Drag & Drop
    - **Options Évaluées (Conceptuellement):**
        - **React DnD:** Populaire, bien intégré avec React, puissant mais peut être verbeux.
        - **Dnd Kit (@dnd-kit):** Moderne, léger, accessible, conçu pour React, bonne performance. Semble un bon candidat.
        - **Interact.js / Draggable (SortableJS/Shopify):** Plus bas niveau, offre beaucoup de contrôle mais nécessite plus d'intégration manuelle avec React.
    - **Choix Proposé (MVP):** **@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities**. Offre un bon équilibre entre fonctionnalités, facilité d'utilisation avec React, et performance.

### 3.3. Gestion de l'État du Constructeur
    - **État du Canvas:** La structure de la page en cours de construction (arbre de composants, leurs propriétés, leur agencement).
        - **Choix Proposé:** Utiliser un store d'état global comme **Zustand** ou **Redux Toolkit**. Zustand est plus simple pour commencer.
    - **État des Composants Sélectionnés:** Pour le panneau de propriétés.
    - **Configuration Globale de la dApp:** Réseau cible, contrat(s) lié(s).

### 3.4. Structure des Composants Drag & Drop
    - Chaque composant disponible dans la palette sera un composant React.
    - Chaque composant aura :
        - Une représentation pour la palette.
        - Une logique de rendu pour le canvas/la dApp générée.
        - Un schéma de configuration pour ses propriétés (utilisé par le panneau de propriétés).
        - Une fonction de sérialisation/désérialisation pour sauvegarder/charger sa configuration.

### 3.5. Rendu et Prévisualisation
    - Le "Canvas" rendra les composants de la dApp en cours de construction directement dans le DOM.
    - Une option de "Prévisualisation" dédiée pourrait afficher la dApp dans un iframe ou un mode plein écran, sans les outils du constructeur.

## 4. Architecture des dApps Générées

### 4.1. Nature des dApps Générées
    - **MVP:** Principalement des applications **Single Page Applications (SPA)** statiques ou quasi-statiques.
    - Le code généré sera du HTML, CSS, et JavaScript (React hydraté si les composants le nécessitent, ou du JS vanilla pour des interactions simples).

### 4.2. Interaction avec les Smart Contracts
    - **Librairies Frontend:** Utilisation de **ethers.js** (ou viem) pour toutes les interactions blockchain.
    - **Gestion des Fournisseurs (Providers):** Intégration avec des solutions de connexion wallet type RainbowKit, Web3Modal, ou une solution custom légère pour injecter le provider du wallet de l'utilisateur.
    - **ABIs des Contrats:**
        - Pour les contrats déployés via BlockDeploy, l'ABI pourrait être récupéré depuis le backend BlockDeploy.
        - Pour les contrats externes, l'utilisateur devra fournir l'ABI. L'ABI sera stocké dans la configuration de la dApp générée.
    - **Appels aux Contrats:**
        - Les composants (ex: "Lecteur de Données Contrat", "Bouton d'Interaction Contrat") encapsuleront la logique d'appel ethers.js.

## 5. Architecture Backend (Pour la Sauvegarde des Projets de dApp)

Bien qu'un export statique soit l'objectif MVP pour la publication, la sauvegarde des projets en cours de construction est essentielle.

### 5.1. Modèle de Données (`UserDAppProject`)
    - `id` (PK)
    - `userId` (FK vers Users)
    - `projectName` (string)
    - `dappDefinition` (JSONB): Stocke la structure de la dApp (arbre de composants, propriétés, configuration globale).
    - `createdAt`, `updatedAt`

### 5.2. API Endpoints
    - `POST /api/v1/dapp-builder/projects` (Créer/Sauvegarder projet)
    - `GET /api/v1/dapp-builder/projects` (Lister les projets de l'utilisateur)
    - `GET /api/v1/dapp-builder/projects/{projectId}` (Charger un projet)
    - `PUT /api/v1/dapp-builder/projects/{projectId}` (Mettre à jour un projet)
    - `DELETE /api/v1/dapp-builder/projects/{projectId}` (Supprimer un projet)

## 6. Publication et Hébergement (MVP)

- **Export Statique:** Le constructeur générera un ensemble de fichiers (HTML, CSS, JS, assets) que l'utilisateur pourra télécharger.
- **Hébergement IPFS (Optionnel MVP):**
    - Intégration avec un service de pinning (Pinata, NFT.storage) via l'API backend de BlockDeploy (qui posséderait les clés API du service de pinning).
    - L'utilisateur clique sur "Publier sur IPFS", le backend BlockDeploy reçoit la définition de la dApp, la compile en fichiers statiques (si nécessaire, ou le frontend envoie directement les fichiers buildés), et les uploade.

## 7. Considérations de Sécurité

- **Interactions Contractuelles dans les dApps Générées:** Les transactions seront toujours signées par le wallet de l'utilisateur final de la dApp. Le constructeur ne gère pas de clés privées pour les interactions des dApps.
- **ABIs Fournis par l'Utilisateur:** Risque si un ABI malveillant est fourni pour un contrat externe. Des avertissements clairs seront nécessaires.
- **Sanitization des Données Affichées:** Les données lues depuis les contrats et affichées dans les dApps devront être correctement échappées pour éviter les attaques XSS, bien que cela relève plus de la conception des composants eux-mêmes.

## 8. Conclusion

Cette architecture préliminaire vise la simplicité et l'extensibilité pour le MVP. Le choix de `@dnd-kit` pour le frontend et une API backend simple pour la persistance des projets semblent être de bons points de départ. Des prototypes et des PoC seront nécessaires pour valider certains choix techniques, notamment la gestion de l'état du canvas et la génération/hydratation des dApps.

---
*Ce document est une conception architecturale initiale et est sujet à évolution.*
