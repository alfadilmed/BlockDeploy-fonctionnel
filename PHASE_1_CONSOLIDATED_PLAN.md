## Plan de Développement Consolidé – Phase 1: MVP+

**Objectif Général de la Phase 1:** Solidifier le socle no-code de BlockDeploy, améliorer l'expérience utilisateur (UX) notamment via l'onboarding et l'accès à l'information, et enrichir les fonctionnalités de base pour le déploiement de tokens ERC-20 et NFTs sur plusieurs réseaux.

### Prérequis Critiques Globaux pour la Phase 1 (Avant tout développement majeur)

1.  **P0.1: Standardisation des Composants UI de Base (Globaux):**
    *   **Description:** Finaliser et stabiliser un kit UI partagé (Boutons, Inputs, Modales, Tooltips, Selects, Notifications/Toasts, etc.) basé sur `INITIAL_SPECIFICATION.md`.
    *   **Pourquoi:** Assure la cohérence visuelle et fonctionnelle, accélère le développement des features.
    *   **Impacte:** Tous les axes.
2.  **P0.2: Architecture Backend pour Déploiement & Interaction Blockchain (Globale):**
    *   **Description:**
        *   Décision finale et implémentation de la stratégie de compilation/sélection des smart contracts.
        *   Mise en place d'un processus robuste et sécurisé pour la gestion des clés privées du wallet serveur.
        *   Conception d'un système de file d'attente (queue) pour les demandes de déploiement.
        *   Service d'interaction blockchain capable de gérer plusieurs réseaux.
    *   **Pourquoi:** Socle technique indispensable pour la fiabilité et la sécurité.
    *   **Impacte:** Axe 1 (ERC-20), Axe 2 (NFT), Axe 3 (Dashboard), Axe 6 (Multi-chaîne).
3.  **P0.3: Finalisation des Schémas de Base de Données (Globaux):**
    *   **Description:** Valider et implémenter les schémas pour `users`, `deployments`, et `smartContractTemplates`.
    *   **Pourquoi:** Nécessaire pour la persistance des données et la logique du dashboard.
    *   **Impacte:** Axe 1, 2, 3, 4.
4.  **P0.4: Service d'Authentification Utilisateur Robuste (Existant à Valider):**
    *   **Description:** S'assurer que le module existant est stable et sécurisé.
    *   **Pourquoi:** Fondamental pour toutes les fonctionnalités liées à un utilisateur.
    *   **Impacte:** Tous les axes.
5.  **P0.5: Infrastructure de Nœuds RPC (Globale):**
    *   **Description:** Sélectionner les fournisseurs de nœuds RPC et configurer l'accès pour les réseaux cibles initiaux.
    *   **Pourquoi:** Indispensable pour toute interaction blockchain.
    *   **Impacte:** Axe 1, 2, 3, 6.
6.  **P0.6: Stratégie de Contenu pour l'Academy et l'Onboarding (Globale):**
    *   **Description:** Définir les premiers sujets à traiter, le ton, et allouer des ressources pour la rédaction.
    *   **Pourquoi:** Le contenu est roi pour l'aide et l'éducation.
    *   **Impacte:** Axe 4 (Onboarding), Axe 5 (Mini-Academy).

---

### Ordre de Développement Priorisé pour la Phase 1 (Lots de Travail Suggérés)

**Lot 1: Fondations Techniques & UI Kit**
*   (Prérequis Critiques): P0.1-P0.5.
*   Objectif: Mettre en place le socle.
*   Tâches: UI Kit, Architecture Backend Déploiement, Schémas DB, Validation Auth.

**Lot 2: MVP ERC-20 & Support Multi-Chaîne Initial (Polygon)**
*   Dépend de: Lot 1.
*   Objectif: Première fonctionnalité de déploiement et introduction multi-chaînes.
*   Features: Axe 1 (ERC-20 MVP), Axe 6 (Polygon). Tests sur Sepolia & Polygon.

**Lot 3: MVP Dashboard & Onboarding Initial**
*   Dépend de: Lot 1. Parallèle Lot 2 pour UI.
*   Objectif: Première version dashboard et aide utilisateur.
*   Features: Axe 3 (Dashboard - affichage base), Axe 4 (Onboarding - Tooltips, Page Aide), Axe 5 (Mini-Academy - Glossaire base).

**Lot 4: Amélioration ERC-20 & NFT MVP (ERC-721)**
*   Dépend de: Lot 2.
*   Objectif: Étendre ERC-20, introduire NFTs.
*   Features: Axe 1 (ERC-20 - Mintable, AccessControl), Axe 2 (NFT - ERC-721 MVP, URL métadonnées). Tests sur Sepolia & Polygon.

**Lot 5: Enrichissement Dashboard & Onboarding**
*   Dépend de: Lot 3, Lot 4.
*   Objectif: Dashboard plus utile, onboarding plus interactif.
*   Features: Axe 3 (Dashboard - Données On-Chain simples, Actions basiques), Axe 4 (Onboarding - Checklist), Axe 5 (Mini-Academy - Articles fondamentaux).

**Lot 6: Expansion Multi-Chaîne & NFT (IPFS + ERC-1155)**
*   Dépend de: Lot 2, Lot 4.
*   Objectif: Finaliser support multi-chaîne base, améliorer module NFT.
*   Features: Axe 6 (Multi-Chaîne - BNB, Arbitrum, Optimism), Axe 2 (NFT - Intégration IPFS pour ERC-721, ERC-1155 MVP).

**Lot 7: Finalisation Fonctionnalités Phase 1 & Contenu**
*   Dépend de: Lots précédents.
*   Objectif: Compléter fonctionnalités et contenu d'aide.
*   Features: Axe 3 (Dashboard - Autres actions), Axe 4 (Onboarding - Tutoriel), Axe 5 (Mini-Academy - Plus de contenu), Axe 1/2 (Fonctionnalités complexes optionnelles).

---

### Opportunités de Livraison Progressive & Feedback Continu

*   Livraison Incrémentale par Axe/Lot.
*   Modules ERC-20/NFT: Fonctionnalités de base d'abord, puis avancées (Feature Flags).
*   Dashboard: Lecture seule d'abord, puis actions interactives.
*   Multi-Chaîne: Réseaux un par un.
*   Onboarding & Academy: Contenu enrichi continuellement.
*   Tests Bêta réguliers et collecte active de feedback.

---
Ce plan consolidé vise à structurer le développement de la Phase 1 de manière itérative et gérable.
