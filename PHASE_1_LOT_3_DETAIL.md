## Plan Détaillé – Phase 1 / Lot 3: Dashboard MVP & Onboarding Initial

**Objectif du Lot 3:** Mettre en place une première version fonctionnelle du tableau de bord utilisateur (Dashboard) pour le suivi des contrats déployés, implémenter les premiers mécanismes d'onboarding, et intégrer une version de base du glossaire Web3.

### Milestones Suggérées pour le Lot 3

*   **L3-M1: Backend pour Dashboard MVP**
    *   L3-M1.1: API Endpoints: lister contrats utilisateur, détail contrat (config DB).
    *   L3-M1.2: API Endpoint: récupérer données on-chain simples ERC-20 (`totalSupply`, `balanceOf`).
*   **L3-M2: Frontend pour Dashboard MVP - Affichage**
    *   L3-M2.1: Page "Mes Contrats" (liste, infos base, lien explorateur).
    *   L3-M2.2: Page "Détail Contrat" (config initiale, données on-chain simples ERC-20).
*   **L3-M3: Onboarding Initial - Tooltips & Page d'Aide**
    *   L3-M3.1: Info-bulles (Tooltips) sur formulaire création ERC-20 MVP.
    *   L3-M3.2: Page "Aide / Premiers Pas" statique simple.
*   **L3-M4: Glossaire Web3 - Version Initiale**
    *   L3-M4.1: Page Glossaire simple (Markdown) avec termes essentiels, liée à Page Aide.
*   **L3-M5 (Optionnel): Actions de Base sur Contrat depuis Dashboard**
    *   L3-M5.1: (Si confirmé) Backend API pour préparer transaction `pause`/`unpause` (ERC-20 MVP).
    *   L3-M5.2: (Si confirmé) Frontend UI pour initier `pause`/`unpause`.
*   **L3-M6: Tests & Documentation**
    *   L3-M6.1: Tests (conceptuels) Dashboard & Onboarding.
    *   L3-M6.2: MàJ docs utilisateur, `devlog/LOT_3_LOG.md`.

---

### 1. Fonctionnalités du Dashboard MVP
*   **L3-M1.1 & L3-M2.1: Liste des Contrats Déployés (`/dashboard/my-contracts`)**
    *   **API (`GET /api/v1/user/deployments`):** Authentifié, retourne liste paginée `DeploymentDBSchema` (ID, nom, type, réseau, adresse, statut, date).
    *   **UI:** Tableau/Liste de `Card`s (Nom, Type, Réseau, Adresse+Lien Scan, Statut, Date). Lien vers détail. Filtres (réseau, statut).
*   **L3-M1.2 & L3-M2.2: Page de Détail Contrat (`/dashboard/deployment/:deploymentId`)**
    *   **API (`GET /api/v1/user/deployments/:deploymentId`):** Retourne `DeploymentDBSchema` complet.
    *   **API (`GET /api/v1/contracts/:networkName/:contractAddress/erc20-details`):** Retourne données on-chain ERC-20 (`name`, `symbol`, `decimals`, `totalSupply`, `balanceOf(owner)`).
    *   **UI:** Sections "Infos Déploiement" (données DB), "Config Initiale" (`tokenConfig`), "Données On-Chain (ERC-20)".
*   **L3-M5 (Optionnel): Actions de Base sur Contrat (Pause/Unpause ERC-20 MVP)**
    *   **Condition:** Si contrat supporte `pausable`.
    *   **API (`POST /api/v1/contracts/:networkName/:contractAddress/erc20-action`):** Payload `{ "action": "pause" / "unpause" }`. Retourne transaction non signée.
    *   **UI:** Bouton "Pause"/"Reprendre". Appelle API, demande signature wallet, affiche feedback.

### 2. Fonctionnalités d'Onboarding Initial
*   **L3-M3.1: Info-Bulles Contextuelles (Tooltips)**
    *   **Implémentation:** Utiliser composant `Tooltip` (Lot 1) sur formulaire ERC-20 MVP (champs: Choix Réseau, Type Supply, `initialSupply`, `cap`, `burnable`, `pausable`).
    *   **Contenu:** Textes courts, clairs.
*   **L3-M3.2: Page "Aide / Premiers Pas" Centralisée (`/docs/getting-started` ou `/help`)**
    *   **Contenu Initial (Statique):** Bienvenue, lien "Connecter wallet", lien guide "Déployer ERC-20", lien Glossaire, FAQ base.
*   **Checklist de Démarrage:** Reportée (pour se concentrer sur dashboard, tooltips, glossaire).

### 3. Intégration du Glossaire Web3 (Version Initiale)
*   **L3-M4.1: Page Glossaire Simple (`/docs/glossary`)**
    *   **Implémentation:** Page statique, contenu via fichier Markdown.
    *   **Structure:** Liste alphabétique. Terme (Titre) + Définition concise.
    *   **Contenu Initial:** 20-30 termes Web3 essentiels.
    *   **Accès:** Lien depuis Page "Aide / Premiers Pas", footer.

### 4. Aspects Techniques Transverses
*   **API Backend Dashboard:** RESTful, Auth JWT, Pagination, Validation entrées, Gestion erreurs.
*   **Lecture On-Chain:** Via `ContractReaderService` (Lot 1) et `ProviderService`. Gestion erreurs RPC. Cache optionnel pour données peu fréquentes.
*   **Composants UI Dashboard:** Nouveaux composants spécifiques ou adaptation de ceux du Lot 1.

---
Ce document guide le développement du Lot 3.
