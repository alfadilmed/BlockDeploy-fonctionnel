## Axe 1: Module ERC-20 Avancé

Objectif : Permettre aux utilisateurs de créer des tokens ERC-20 hautement configurables sans écrire de code.

### 1. Features (Fonctionnalités Utilisateur)

*   **F1.1: Configuration de Base du Token**
    *   Nom du Token (ex: "My Token")
    *   Symbole du Token (ex: "MTK")
    *   Décimales (par défaut 18, non modifiable pour la V1 pour simplifier, ou sélection parmi une liste restreinte comme 6, 8, 18)
*   **F1.2: Gestion de la Supply**
    *   Supply Fixe : Définir une supply totale initiale qui ne changera pas.
    *   Supply Variable (Plafond) : Définir une supply maximale (`cap`), avec une supply initiale mintée au créateur.
*   **F1.3: Fonctionnalités Optionnelles (Cases à cocher)**
    *   **Mintable (par le propriétaire) :**
        *   Si Supply Fixe : Non applicable (ou grisé).
        *   Si Supply Variable : Permet au propriétaire du contrat de minter de nouveaux tokens jusqu'au plafond (`cap`).
    *   **Burnable (par les détenteurs) :**
        *   Permet aux détenteurs de tokens de brûler (détruire) leurs propres tokens.
    *   **Burnable (par le propriétaire) :**
        *   Permet au propriétaire du contrat de brûler des tokens d'une adresse spécifique (avec son consentement via `approve`) ou ses propres tokens. (Moins courant, à évaluer pour MVP+)
    *   **Pausable (par le propriétaire) :**
        *   Permet au propriétaire d'arrêter temporairement tous les transferts de tokens (utile en cas d'urgence).
*   **F1.4: Rôles et Permissions (Basé sur OpenZeppelin AccessControl)**
    *   **Owner/Admin :** Rôle par défaut pour le déployeur du contrat. A les droits pour minter (si mintable), pauser (si pausable), gérer les rôles.
    *   **(Optionnel pour V1) Rôle `MINTER_ROLE` :** Si "Mintable" est coché, permettre d'assigner ce rôle à d'autres adresses.
*   **F1.5: Taxes sur Transaction (Optionnel, complexe - peut-être post MVP+ ou version simple)**
    *   Pourcentage de taxe sur chaque transfert.
    *   Adresse du portefeuille pour recevoir les taxes.
    *   Option : Exclure certaines adresses de la taxe (ex: le propriétaire).
    *   *Note : Cela complexifie significativement le contrat. Une version simple pourrait être une taxe fixe allant à une seule adresse.*
*   **F1.6: Vesting (Optionnel, très complexe - Probablement pour une phase ultérieure)**
    *   Création de calendriers de vesting pour distribuer des tokens sur une période donnée à des adresses spécifiques.
    *   *Suggestion : Hors périmètre MVP+ Phase 1, à réévaluer.*

### 2. Sous-Tâches Techniques (Backend & Smart Contract)

*   **ST2.1: Développement du Smart Contract ERC-20 Modulaire (Solidity)**
    *   Utiliser les contrats OpenZeppelin comme base (`ERC20.sol`, `ERC20Burnable.sol`, `ERC20Pausable.sol`, `ERC20Capped.sol`, `AccessControl.sol`).
    *   Créer un contrat "factory" ou un contrat de base ERC-20 qui importe et hérite conditionnellement de ces modules en fonction des options choisies par l'utilisateur.
    *   Implémenter la logique pour la supply fixe vs. variable (capped).
    *   Implémenter la fonction de mint conditionnelle (si `cap` et rôle `MINTER_ROLE`).
    *   Implémenter les rôles (Admin, Minter).
    *   (Si taxes) Ajouter la logique de taxe dans `_transfer`. Attention à la complexité et aux audits.
*   **ST2.2: API Backend pour la Configuration et Déploiement**
    *   Endpoint `POST /api/v1/erc20/configure` : Reçoit les paramètres du token, valide les données, sauvegarde la configuration.
    *   Endpoint `POST /api/v1/erc20/deploy` :
        *   Récupère la configuration.
        *   Compile dynamiquement le contrat Solidity avec les bons modules (ou sélectionne un bytecode pré-compilé paramétrable si possible, mais la modularité rend cela difficile). *Alternative : Avoir plusieurs contrats pré-compilés et le backend choisit le bon.*
        *   Déploie le contrat sur la chaîne sélectionnée en utilisant ethers.js/viem et un wallet serveur sécurisé.
        *   Sauvegarde l'adresse du contrat déployé et le hash de la transaction.
*   **ST2.3: Service de Compilation (si compilation dynamique)**
    *   Mettre en place un service sécurisé pour compiler le code Solidity généré. Peut utiliser `solc-js`.
*   **ST2.4: Gestion des Clés du Wallet Serveur**
    *   Utiliser un service de gestion de secrets (AWS Secrets Manager, HashiCorp Vault) pour stocker et accéder à la clé privée du wallet utilisé par le backend pour le déploiement.
*   **ST2.5: Tests Unitaires et d'Intégration**
    *   Tests pour le contrat Solidity (Hardhat/Foundry).
    *   Tests pour les endpoints API.

### 3. UI/UX (Frontend)

*   **UI3.1: Formulaire de Création ERC-20**
    *   Interface claire divisée en sections (Configuration de base, Supply, Fonctionnalités, Rôles, Taxes si incluses).
    *   Utilisation de composants réutilisables (Input, Checkbox, Select, Tooltip pour explications).
    *   Validation en temps réel et messages d'erreur clairs.
    *   Prévisualisation des coûts de gas estimés.
    *   Explication de chaque option (info-bulles, liens vers glossaire/docs).
*   **UI3.2: Section "Fonctionnalités Optionnelles"**
    *   Logique d'affichage conditionnelle : ex, si "Supply Fixe", l'option "Mintable" est grisée ou masquée.
*   **UI3.3: Gestion des Rôles (si MINTER_ROLE est exposé en V1)**
    *   Interface pour ajouter/révoquer des adresses pour le `MINTER_ROLE`.
*   **UI3.4: Récapitulatif Avant Déploiement**
    *   Afficher tous les paramètres choisis avant que l'utilisateur ne confirme le déploiement.
*   **UI3.5: Feedback Post-Déploiement**
    *   Afficher le statut de la transaction, lien vers l'explorateur de blocs, adresse du contrat.

### 4. Dépendances

*   **D4.1: Module d'Authentification Utilisateur :** Pour savoir qui déploie et lier le contrat à un utilisateur. (EXISTANT)
*   **D4.2: Module de Connexion Wallet (Frontend) :** Pour que l'utilisateur signe la demande de déploiement (si on opte pour un déploiement initié/payé par l'utilisateur) ou simplement pour récupérer son adresse comme propriétaire initial. (EXISTANT)
*   **D4.3: Module de Sélection de Réseau :** Pour choisir sur quelle blockchain déployer. (EXISTANT - à affiner)
*   **D4.4: Infrastructure Backend Robuste :** Capable de gérer des tâches asynchrones comme le déploiement.
*   **D4.5: Service RPC Node :** Accès à des nœuds fiables pour les chaînes supportées.
*   **D4.6: Composants UI de Base :** (Input, Button, Card, Modal, etc. - EXISTANTS, à standardiser cf. `INITIAL_SPECIFICATION.md`)

### 5. Ordre de Développement Priorisé (Suggestion)

1.  **Priorité 1 (MVP de l'ERC-20 Avancé):**
    *   Smart Contract: Configuration de base (Nom, Symbole, Décimales fixes), Supply Fixe, Supply Variable (Capped), Burnable (par détenteur), Pausable. Rôle Owner par défaut. (ST2.1 partiel)
    *   Backend: API pour configuration et déploiement de cette version MVP. (ST2.2 partiel)
    *   Frontend: Formulaire simple pour ces options MVP. (UI3.1, UI3.2, UI3.4, UI3.5 partiels)
    *   Prérequis : Assurer la robustesse des dépendances D4.1, D4.2, D4.3, D4.6.
2.  **Priorité 2 (Améliorations Fonctionnalités):**
    *   Smart Contract: Ajouter Mintable (par Owner et `MINTER_ROLE`), AccessControl plus fin. (ST2.1 suite)
    *   Backend: Adapter l'API. (ST2.2 suite)
    *   Frontend: Ajouter les options correspondantes dans le formulaire, interface de gestion de rôle simple. (UI3.1, UI3.3 suites)
3.  **Priorité 3 (Fonctionnalités Complexes - à évaluer si Phase 1 ou 2):**
    *   Taxes sur transaction (version simple).
    *   *Le vesting est probablement hors Phase 1.*

### 6. Progressive Delivery

*   **Feature Flags:**
    *   Activer/désactiver la section "Taxes" ou "Rôles avancés" via des feature flags pour des tests internes ou bêta.
    *   Déployer initialement avec seulement Supply Fixe, puis activer Supply Variable.
*   **Beta Test:**
    *   Inviter des utilisateurs techniques à tester les fonctionnalités avancées (Mintable, Pausable, Rôles) avant un lancement public.
*   **Déploiement Progressif:**
    *   Lancer d'abord sur un réseau de test (Sepolia, Goerli), puis étendre aux mainnets après stabilisation.

### 7. Prérequis Critiques (Avant de commencer cet axe)

*   **P7.1: Standardisation des Composants UI de Base :** Avoir un kit UI fiable (boutons, inputs, modals) comme défini dans `INITIAL_SPECIFICATION.md`.
*   **P7.2: Architecture Backend Claire pour le Déploiement :**
    *   Décision sur la compilation (dynamique vs. pré-compilés).
    *   Processus sécurisé de gestion des clés du wallet serveur.
    *   Files d'attente pour les déploiements (pour gérer la charge).
*   **P7.3: Base de Données :** Schéma pour `users`, `deployments` (avec un champ flexible pour les `parameters` du contrat) et `smartContractTemplates` (pour stocker ABI, bytecode de base si approche mixte). (Défini dans `INITIAL_SPECIFICATION.md`)
*   **P7.4: Service d'Authentification Solide.** (EXISTANT)
*   **P7.5: Workflow de Sélection de Réseau fonctionnel.** (EXISTANT)

### 8. Exemples de Code / Structure (Suggestion)

#### a. Smart Contract (Approche Modulaire - Pseudo-code Solidity)

```solidity
// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20; // Real file needs this uncommented

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
// import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
// import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";

// contract ERC20Advanced { // Simplified for Markdown, actual contract is more complex
//     // bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
//     // bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
//     // constructor(...) { ... }
//     // function mint(...) { ... }
//     // ... other functions
// }
```
*Note: Le pseudo-code Solidity ci-dessus est simplifié pour ce document. La génération dynamique ou la sélection de contrats pré-compilés est un défi technique. L'assemblage de code source par le backend avant compilation offre de la flexibilité mais complexifie la mise en œuvre.*

#### b. Structure du Formulaire Frontend (Pseudo-code React/JSX)

```jsx
// WizardStepERC20Config.tsx
// const ERC20ConfigForm = ({ onSubmit }) => {
//   // state for config options (name, symbol, supplyType, etc.)
//   // handler functions for inputs and checkboxes
//   return (
//     // form structure with Sections, Inputs, Checkboxes, Selects
//     // Button to submit
//   );
// };
```
