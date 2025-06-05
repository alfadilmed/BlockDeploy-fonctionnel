## L3-M2.1: Page "Mes Contrats" (Dashboard) - Liste des Déploiements

**Objectif:** Décrire l'UI/UX de la page listant les contrats déployés par un utilisateur.

**Référence:** API `GET /api/v1/user/deployments` (L3-M1.1), Composants UI (Lot 1).

### 1. Structure Générale
*   **Route:** `/dashboard/my-contracts` (protégée).
*   **Titre:** "Mes Contrats Déployés".
*   **Layout:** Intégrée au `DashboardLayout`.

### 2. Composants Principaux

**a. Zone de Filtres et de Recherche (Optionnel MVP)**
*   **UI:** `Select` pour Réseau (`networkName`), `Select` pour Statut (`status`), `Input` pour Recherche (nom/adresse). Boutons Appliquer/Réinitialiser.
*   **Logique:** Déclenche rappel API avec query params.

**b. Liste des Contrats (Tableau ou Grille de `Card`s)**
*   **UI Tableau - Colonnes:** Nom Projet, Type Contrat, Réseau, Adresse Contrat (tronquée, lien explorateur, copie), Statut (badge), Date Création, Actions ("Voir Détails").
*   **UI Grille de Cartes - Contenu Carte:** Nom Projet, Type, Réseau, Statut, Adresse, Date, Bouton "Voir Détails".
*   **État "Aucun Contrat":** Message clair + CTA "Déployer votre premier contrat".

**c. Pagination**
*   **UI:** Composant de pagination.
*   **Logique:** Utilise infos `pagination` de l'API. Déclenche rappel API avec param `page`.

### 3. Logique d'Appel API et Affichage (React/TypeScript)
*   **État Page:** `deployments[]`, `pagination{}`, `filters{}`, `isLoading`, `error`.
*   **`useEffect`:** Déclenché par changement `filters` ou `pagination.currentPage`. Construit query params, appelle `GET /api/v1/user/deployments`, met à jour état.
*   **Gestion `isLoading`:** `Spinner` / skeleton loader.
*   **Gestion `error`:** `Alert` pour erreurs API.

### 4. Navigation
*   "Voir Détails" -> `/dashboard/deployment/:deploymentId`.

Cette page centralise le suivi des activités de déploiement de l'utilisateur.
