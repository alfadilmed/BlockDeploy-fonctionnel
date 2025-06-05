## Axe 6: Support Multi-Chaînes

Objectif : Permettre aux utilisateurs de choisir parmi une sélection de réseaux blockchain populaires (L1s et L2s) pour le déploiement de leurs smart contracts.

### 1. Features (Fonctionnalités Utilisateur)

*   **F6.1: Sélection du Réseau Avant Déploiement**
    *   Choix parmi: Ethereum (Mainnet & Testnets), Polygon (Mainnet & Testnet), BNB Smart Chain (Mainnet & Testnet), Arbitrum One (Mainnet & Testnet), Optimism (Mainnet & Testnet).
*   **F6.2: Affichage Clair du Réseau Sélectionné**
    *   Visible durant la configuration et dans le dashboard.
*   **F6.3: Adaptation Automatique des Informations Contextuelles**
    *   Liens vers explorateurs de blocs corrects.
    *   Estimation de gas adaptée (si existe).
    *   Icônes/logos des réseaux.
*   **F6.4: (Optionnel) Recommandations de Réseau Basiques**
    *   Info-bulles sur avantages/cas d'usage de chaque réseau.

### 2. Sous-Tâches Techniques (Backend & Frontend)

*   **ST2.1: Configuration des Providers RPC pour Chaque Réseau (Backend)**
    *   Obtenir et stocker URLs de nœuds RPC pour chaque réseau.
    *   Logique pour sélectionner le bon provider.
*   **ST2.2: Gestion des Chain IDs (Backend & Frontend)**
    *   Mapper réseaux à Chain IDs. Utilisation correcte lors de la construction/signature des transactions.
    *   Frontend vérifie réseau du wallet.
*   **ST2.3: Adaptation du Service de Déploiement (Backend)**
    *   Utiliser provider RPC et Chain ID du réseau sélectionné.
*   **ST2.4: Adaptation du Service d'Interaction Blockchain (Backend - pour Dashboard)**
    *   Cibler le bon réseau pour lecture de données on-chain.
*   **ST2.5: Mise à Jour du Frontend pour la Sélection de Réseau**
    *   Étendre `NetworkSelector` avec nouveaux réseaux.
    *   Stocker réseau sélectionné. Afficher logo/nom. Mettre à jour liens explorateurs.
*   **ST2.6: Tests de Déploiement sur Chaque Réseau Supporté.**

### 3. UI/UX (Frontend)

*   **UI3.1: Composant de Sélection de Réseau Clair et Intuitif**
    *   Nom, logo, description/tags (L2, Faibles Frais), Mainnet/Testnet.
*   **UI3.2: Feedback à l'Utilisateur sur le Changement de Réseau**
    *   Inviter à changer de réseau dans le wallet si nécessaire.
*   **UI3.3: Cohérence de l'Affichage Multi-Chaînes.**

### 4. Dépendances

*   **D4.1: Accès aux Nœuds RPC pour Chaque Réseau.**
*   **D4.2: Modules de Contrats Intelligents Compatibles EVM.** (Normalement OK)
*   **D4.3: Service de Déploiement Backend Flexible.**
*   **D4.4: Wallet Utilisateur Compatible Multi-Chaînes.**

### 5. Ordre de Développement Priorisé (Suggestion)

1.  **Priorité 1 (Ajout d'UN Nouveau Réseau Populaire - ex: Polygon):**
    *   Backend: Config RPC Polygon. Adapter services déploiement/interaction.
    *   Frontend: Ajouter Polygon au `NetworkSelector`. MàJ liens Polygonscan.
    *   Tests sur Polygon.
2.  **Priorité 2 (Ajout des Autres Réseaux Listés):**
    *   Répéter pour BNB Chain, Arbitrum, Optimism (itérativement).
3.  **Priorité 3 (Améliorations UI/UX):**
    *   Améliorer `NetworkSelector` (infos, logos).
    *   Détection/suggestion changement réseau wallet.
    *   (Optionnel) Recommandations réseau.

### 6. Progressive Delivery

*   **Un Réseau à la Fois.**
*   **Testnets d'Abord pour chaque nouveau réseau.**
*   **Feature Flags par Réseau (si nécessaire).**

### 7. Prérequis Critiques

*   **P7.1: Infrastructure de Nœuds RPC Stable et Fiable.**
*   **P7.2: Tests Approfondis de Compatibilité des Contrats sur chaque chaîne.**
*   **P7.3: Mise à Jour de la Documentation Utilisateur.**
