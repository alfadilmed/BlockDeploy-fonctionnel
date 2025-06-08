## Plan Détaillé – Phase 2 / Lot 5: Constructeur de dApp Front-End (Alpha) - Fondations

**Objectif du Lot 5:** Définir et planifier les fondations pour une version Alpha du constructeur de dApp "no-code", permettant de générer une page web simple pour interagir avec un contrat ERC-20 ou NFT (ERC-721) déployé via BlockDeploy.

### Milestones Suggérées pour le Lot 5

*   **L5-M1: Spécifications & Architecture Générale** (Fonctionnalités MVP dApp Alpha, Archi haut niveau, Choix technos).
*   **L5-M2: Composants Réutilisables pour dApps Générées** (`ContractDataReader`, `ContractActionButton`, `DAppWalletConnector`).
*   **L5-M3: Interface de Configuration de la dApp (Builder Alpha)** (UI Sélection contrat, sélection infos/actions, perso basique, preview).
*   **L5-M4: Génération et Déploiement de la dApp Alpha** (Backend sauvegarde config, mécanisme génération/service, URL unique).
*   **L5-M5: Tests & Documentation** (E2E, docs utilisateur, devlog).

---

### 1. Spécifications & Architecture Générale (L5-M1)
*   **Fonctionnalités MVP dApp Alpha Générée:**
    *   ERC-20: Afficher nom, symbole, totalSupply. Opt: balance user, action "Transférer", action "Minter" (si mintable publiquement).
    *   ERC-721: Afficher nom collection, symbole. Opt: afficher NFT spécifique (par ID), action "Minter" (si mintable publiquement).
    *   Interaction: Connexion wallet visiteur pour actions.
*   **Architecture Haut Niveau:**
    *   Stockage: Collection DB `dAppConfigurations` (liée à `userId`, `deploymentId`).
    *   Génération/Service: Option B (Service Dynamique) pour Alpha - route `/dapps/:dappConfigId` rend template React avec config.
    *   Interaction Contrats: dApps générées via wallet visiteur + RPC.
*   **Choix Technos Rendu/Génération:** Composants React (L5-M2) + moteur de rendu simple côté serveur BlockDeploy.

### 2. Composants Réutilisables pour dApps (L5-M2)
*   **`ContractDataReader.tsx`:** Props: `contractAddress`, `networkName`, `abiFragment`, `functionName`, `args`. Logique: appel `view` on-chain, affiche résultat.
*   **`ContractActionButton.tsx`:** Props: `contractAddress`, `networkName`, `abiFragment`, `functionName`, `buttonLabel`, `inputArgsConfig`. Logique: affiche bouton, modale pour inputs, construit Tx, demande signature/envoi wallet visiteur.
*   **`DAppWalletConnector.tsx`:** Connexion/déconnexion wallet pour visiteurs dApp.

### 3. Interface de Configuration dApp (Builder Alpha - L5-M3)
*   Accessible depuis dashboard (détail contrat).
*   **UI Sélection Contrat Source:** Choisir un ERC-20/ERC-721 déployé.
*   **UI Sélection Éléments/Actions:** Checkboxes basées sur capacités contrat & composants L5-M2 (ex: "Afficher TotalSupply", "Permettre Mint").
*   **UI Personnalisation Basique:** Titre page dApp. Opt: thème couleur simple.
*   **UI Prévisualisation:** Aperçu temps réel dApp.

### 4. Génération et Déploiement dApp Alpha (L5-M4)
*   **Backend Service `dAppConfigurations`:** CRUD pour configs dApp.
*   **Mécanisme Génération/Service & URL (Option B - Dynamique):**
    *   Route `/dapps/:dappConfigId` récupère config.
    *   Handler utilise template page React, injecte config en props pour composants L5-M2 conditionnels.
    *   URL publique: `votredomaine.com/dapps/:dappConfigId`.

### 5. Tests & Documentation (L5-M5)
*   **Tests E2E:** Configurer dApp Alpha (ERC-20/NFT), accéder URL publique, connecter wallet visiteur, vérifier affichage données, tester action (ex: mint).
*   **Doc Utilisateur:** Guide "Créer Première dApp avec BlockDeploy". Limitations Alpha.
*   **Devlog:** `devlog/LOT_5_LOG.md`.

---
Ce document sert de guide pour le développement du Lot 5.
