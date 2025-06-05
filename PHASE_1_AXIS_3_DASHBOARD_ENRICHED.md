## Axe 3: Dashboard Utilisateur Enrichi

Objectif : Fournir une interface centralisée et conviviale pour que les utilisateurs puissent suivre et gérer leurs contrats déployés, et obtenir des informations pertinentes sur leurs activités.

### 1. Features (Fonctionnalités Utilisateur)

*   **F3.1: Vue d'Ensemble des Contrats Déployés**
    *   Liste de tous les contrats déployés par l'utilisateur.
    *   Informations clés par contrat : Nom, Type (ERC-20, NFT-721, NFT-1155), Réseau, Date de déploiement, Adresse du contrat.
    *   Statut du contrat (si applicable, ex: Pausé).
    *   Liens rapides vers l'explorateur de blocs (Etherscan, Polygonscan, etc.) pour ce contrat.
*   **F3.2: Page de Détail du Contrat**
    *   Accessible en cliquant sur un contrat depuis la liste.
    *   Rappel de tous les paramètres de configuration choisis lors du déploiement.
    *   **Pour ERC-20:**
        *   Affichage de la supply totale.
        *   Affichage de la balance de tokens du propriétaire du contrat (ou d'une adresse spécifiée par l'utilisateur).
        *   (Optionnel) Graphique simple de l'évolution de la supply ou du nombre de détenteurs (via API externe type Covalent, Moralis, ou appels RPC directs).
    *   **Pour NFT (ERC-721 & ERC-1155):**
        *   Nombre total de NFTs mintés (pour ERC-721) ou nombre de types de tokens créés (pour ERC-1155).
        *   (Optionnel) Galerie miniature des NFTs mintés (si les métadonnées sont accessibles et les images stockées sur IPFS/URL publique).
        *   Pour ERC-1155: Supply par tokenID.
*   **F3.3: Actions Basiques sur Contrat (Initiées depuis le Dashboard)**
    *   Les actions nécessiteront une confirmation/signature via le wallet connecté de l'utilisateur.
    *   **Pour ERC-20 (si applicable selon la configuration du contrat):**
        *   `mint`: Si le contrat est `Mintable` et l'utilisateur a le rôle `MINTER_ROLE`. Interface pour spécifier l'adresse destinataire et le montant.
        *   `burn`: Si le contrat est `Burnable` et l'utilisateur veut brûler ses propres tokens. Interface pour spécifier le montant.
        *   `pause`/`unpause`: Si le contrat est `Pausable` et l'utilisateur a le rôle `PAUSER_ROLE`.
        *   Gestion des Rôles: Si `AccessControl` est utilisé (ex: `grantRole`, `revokeRole` pour `MINTER_ROLE`).
    *   **Pour NFT (si applicable):**
        *   `mint` (Owner Mint): Interface pour minter un nouveau NFT (spécifier `to`, `tokenId`, et `tokenURI` pour ERC-721 ; `to`, `id`, `amount`, `data` pour ERC-1155).
        *   `setBaseURI` / `setTokenURI` (si applicable et l'utilisateur est propriétaire).
        *   `pause`/`unpause`.
        *   Gestion des Rôles.
*   **F3.4: Historique des Déploiements**
    *   Journal de toutes les tentatives de déploiement (succès et échecs).
    *   Date, type de contrat, réseau, statut, hash de transaction (si succès).
*   **F3.5: (Optionnel - MVP+) Section Statistiques Utilisateur**
    *   Nombre total de contrats déployés.
    *   Répartition par type de contrat / par réseau.
    *   Activité récente.

### 2. Sous-Tâches Techniques (Backend & Frontend)

*   **ST2.1: API Backend pour le Dashboard**
    *   Endpoint `GET /api/v1/dashboard/contracts`: Retourne la liste des contrats déployés par l'utilisateur authentifié (depuis la collection `deployments` en base de données).
    *   Endpoint `GET /api/v1/dashboard/contracts/:contractId`: Retourne les détails d'un contrat spécifique, y compris ses paramètres de configuration initiaux.
    *   Endpoint `GET /api/v1/dashboard/contracts/:contractAddress/onchain-data?network=NETWORK`:
        *   Récupère des données on-chain pour un contrat donné (ex: `totalSupply` pour ERC-20, `ownerOf` pour NFT).
        *   Le backend interagit avec le nœud RPC de la blockchain correspondante.
        *   Mise en cache pour éviter de surcharger les nœuds RPC.
    *   Endpoints `POST /api/v1/dashboard/contracts/:contractAddress/invoke-action`:
        *   Endpoint générique ou spécifique par action (ex: `/mint`, `/pause`).
        *   Reçoit l'action à effectuer et les paramètres.
        *   **Important:** Cette API ne signe PAS de transaction. Elle prépare la transaction non signée que le frontend devra ensuite faire signer par le wallet de l'utilisateur.
*   **ST2.2: Service d'Interaction Blockchain (Backend)**
    *   Logique pour appeler les fonctions `view` des smart contracts.
    *   Logique pour construire des objets de transaction non signée pour les actions.
*   **ST2.3: Persistance des Données (Backend)**
    *   Assurer que la collection `deployments` stocke toutes les informations nécessaires.
*   **ST2.4: Développement Frontend du Dashboard (React/Next.js)**
    *   Créer les pages et composants du dashboard.
    *   Appeler les APIs backend pour afficher les données.
    *   Intégrer la logique pour que l'utilisateur signe et envoie les transactions.
*   **ST2.5: Gestion des Erreurs et Notifications (Frontend)**
    *   Afficher clairement les erreurs.

### 3. UI/UX (Frontend)

*   **UI3.1: Navigation du Dashboard**
    *   Menu latéral ou onglets clairs.
*   **UI3.2: Liste des Contrats (`ContractListPage`)**
    *   Tableau ou grille de cartes.
    *   Filtres et barre de recherche.
    *   Indicateurs visuels.
*   **UI3.3: Page de Détail du Contrat (`ContractDetailPage`)**
    *   Présentation structurée de l'information.
    *   Affichage conditionnel des actions.
    *   Modales de confirmation pour les actions.
*   **UI3.4: Interface d'Interaction avec les Contrats**
    *   Formulaires simples pour les paramètres des actions.
    *   Feedback clair pendant et après la soumission de la transaction.

### 4. Dépendances

*   **D4.1 - D4.6 (Communes):** Auth, Wallet Connect, Sélection Réseau, Backend, RPC, UI Base.
*   **D4.7: Base de Données Structurée:** Collection `deployments` bien définie.
*   **D4.8: (Optionnel) Services d'indexation de données Blockchain:** (Moralis, Covalent, TheGraph).
*   **D4.9: Bibliothèques d'affichage de graphiques:** (Recharts, Chart.js).

### 5. Ordre de Développement Priorisé (Suggestion)

1.  **Priorité 1 (Affichage de Base):**
    *   Backend: API pour lister les contrats et voir le détail de la configuration.
    *   Frontend: Pages pour lister les contrats et afficher les détails de config. Liens explorateurs.
2.  **Priorité 2 (Données On-Chain Simples):**
    *   Backend: API pour récupérer `totalSupply` (ERC-20), etc.
    *   Frontend: Afficher ces données.
3.  **Priorité 3 (Actions Basiques - ex: Pause/Unpause):**
    *   Backend: API pour préparer la transaction `pause`/`unpause`.
    *   Frontend: Boutons pour actions, signature et envoi.
4.  **Priorité 4 (Autres Actions et Améliorations):**
    *   Actions plus complexes (mint, burn, rôles).
    *   Historique des déploiements.
    *   Données on-chain plus riches.
    *   (Optionnel) Section statistiques.

### 6. Progressive Delivery

*   **Lecture Seule d'Abord:** Lancer dashboard en visualisation seule.
*   **Actions une par une:** Introduire les actions progressivement.
*   **Feature Flags pour sections optionnelles.**
*   **Beta test pour les interactions.**

### 7. Prérequis Critiques

*   **P7.1: Finalisation des Schémas BD (`deployments`).**
*   **P7.2: API Auth Robuste.** (EXISTANT)
*   **P7.3: Service Backend Fiable pour Appels RPC.**
*   **P7.4: Stratégie Claire pour Préparation/Signature des Transactions.**
*   **P7.5: Composants UI Standardisés pour Dashboard.**
