## L6-M4.1: Formulaire UI/UX pour la Création de DAO/Safe

**Objectif:** Décrire l'UI/UX du formulaire de création de DAO (Safe multisig).

**Référence:** API `POST /api/v1/dao/create-safe` (L6-M2.1).

### 1. Structure Générale
*   Accessible via menu "Créer DAO". Titre "Créer votre DAO Multisignature". Sections via `Card`s.

### 2. Sections et Champs du Formulaire

**Section 1: Informations Générales de la DAO**
*   **Nom DAO (`userGivenName`):** `Input` text. Label "Nom de votre DAO (pour dashboard)". Tooltip.
*   **Choix Réseau (`networkName`):** `Select`. Label "Réseau de déploiement DAO?". Options (Ethereum, Polygon, etc.). Tooltip.

**Section 2: Configuration des Signataires et Seuil**
*   **Titre:** "Configuration Gouvernance Multisignature".
*   **Liste Adresses Signataires (`owners`):** Liste dynamique d'`Input`s type adresse. Au moins 1 champ (pré-rempli avec wallet user?). Boutons "Ajouter Signataire", "Supprimer". Validation adresse, pas de doublons. Min 1 (ou 2?) signataires. Tooltip général.
*   **Seuil de Signature (`threshold`):** `Input` type nombre. Label "Nombre de Signatures Requises (Seuil)". Placeholder. Validation (entier > 0 et <= nb signataires). Tooltip.

**Section 3: Options Avancées (Optionnel MVP)**
*   **`saltNonce`:** `Input` text. Caché par défaut. Label "Salt Nonce (Optionnel - adresse prédictible)". Tooltip.

**Section 4: Récapitulatif & Déploiement**
*   **Affichage Dynamique:** Nom DAO, Réseau, Liste Signataires, Seuil (ex: "2 sur 3").
*   **Avertissements:** Déploiement on-chain, frais couverts par BlockDeploy. Importance paramètres (difficiles à changer).
*   **Bouton Action:** "Créer Ma DAO". `disabled` si invalide.

### 3. Expérience Utilisateur (UX)
*   Clarté sur multisig (signataire, seuil).
*   Gestion adresses facile.
*   Validation robuste (adresses, seuil vs nb owners).
*   Feedback (erreurs, chargement, succès avec adresse Safe).
