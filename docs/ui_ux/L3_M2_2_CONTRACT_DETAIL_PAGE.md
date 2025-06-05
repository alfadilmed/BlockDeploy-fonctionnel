## L3-M2.2: Page "Détail Contrat" (Dashboard)

**Objectif:** Décrire l'UI/UX de la page affichant les détails d'un déploiement de contrat.

**Référence:** APIs `GET /api/v1/user/deployments/:deploymentId` & `GET /api/v1/contracts/:networkName/:contractAddress/erc20-details`.

### 1. Structure Générale
*   **Route:** `/dashboard/deployment/:deploymentId` (protégée).
*   **Titre:** Dynamique (ex: "Détails : {userGivenName}").
*   **Layout:** `DashboardLayout`.

### 2. Sections et Contenu

**Section 1: Informations Générales du Déploiement**
*   **Source:** API `/user/deployments/:deploymentId`.
*   **Champs:** Nom Projet, ID Déploiement, Type Contrat, Réseau (logo+nom), Statut (badge), Dates (création, déploiement), Adresse Contrat (copie, lien explorateur), Hash Transaction (copie, lien explorateur), Adresse Déployeur, Message Erreur (si échec).

**Section 2: Configuration Initiale du Contrat**
*   **Source:** Champ `configuration` de l'API `/user/deployments/:deploymentId`.
*   **Affichage (ERC-20 MVP):** Nom Token, Symbole, Type Supply, Supply Initiale/à Émettre, Plafond Max, Features (Burnable Oui/Non, Pausable Oui/Non).
*   *Note: Pourrait être dynamique selon `contractType` à l'avenir.*

**Section 3: Données On-Chain Actuelles (Spécifique ERC-20 pour MVP)**
*   **Source:** API `/contracts/:networkName/:contractAddress/erc20-details`. Appel si déploiement `success`.
*   **Affichage (ERC-20):** Nom (On-Chain), Symbole (On-Chain), Décimales (On-Chain), Supply Totale Actuelle (formatée), Balance Propriétaire Contrat (formatée). `Dernière MàJ` + Bouton "Rafraîchir".
*   **État Chargement/Erreur:** `Spinner` / `Alert`.

**Section 4: Actions sur le Contrat (Optionnel pour L3-M5)**
*   **Affichage Conditionnel:** Si actions possibles et droits OK.
*   **Pour ERC-20 MVP Pausable:** État actuel (Actif/Pausé). Bouton "Mettre en Pause" / "Reprendre". Logique: appel API backend pour tx non signée -> signature wallet user.

### 3. Logique d'Appel API et Affichage (React/TypeScript)
*   **`useEffect` au Montage:**
    1.  Récupérer `deploymentId` URL.
    2.  Appel API `/user/deployments/:deploymentId`.
    3.  Si succès & ERC-20: Appel API `/contracts/:networkName/:contractAddress/erc20-details`.
*   **Gestion `isLoading`:** États de chargement séparés.
*   **Gestion `error`:** Affichage erreurs.

### 4. Expérience Utilisateur
*   Clarté entre config initiale et données on-chain.
*   Réactivité (bouton "Rafraîchir").
*   Feedback clair pour actions.
