## L4-M3.1: Mise à Jour du Formulaire de Création ERC-20 pour `ERC20Advanced`

**Objectif:** Décrire les modifications UI/UX du formulaire ERC-20 pour intégrer les options `ERC20Advanced.sol` (Mintable via AccessControl).

### 1. Sélecteur de Type de Template (ERC-20 Standard vs. Avancé)
*   **UI:** `Select` ou `Card`s cliquables en début de formulaire.
    *   "Token ERC-20 Standard": Pour `ERC20MVP` (supply fixe/plafonnée, pausable, burnable).
    *   "Token ERC-20 Avancé": Pour `ERC20Advanced` (idem + mintable via rôles si plafonnée).
*   **Logique:** Conditionne les champs suivants et le `templateKey` API.

### 2. Modifications si "Token ERC-20 Avancé" Sélectionné

**Section 2: Configuration du Token ERC-20**
*   **Sous-section: Identité du Token**
    *   **Champ `tokenConfig.initialAdmin`:**
        *   **UI:** `Input` type adresse Ethereum.
        *   **Label:** "Adresse de l'Administrateur Initial".
        *   **Placeholder/Défaut:** Adresse wallet connecté.
        *   **Tooltip:** "Cette adresse sera admin, minter (si supply plafonnée), et pauser (si option activée)."
*   **Sous-section: Gestion de la Supply**
    *   Champs `supplyType`, `initialSupply`, `cap` similaires.
    *   **Clarification "Mintable":** Si `supplyType` "capped", implicitement mintable par `initialAdmin`.
    *   **Tooltip sur `supplyType="capped"`:** "Avec supply plafonnée, l'Admin Initial (et autres adresses avec rôle 'Minter') pourra créer des tokens jusqu'au Plafond."
*   **Sous-section: Fonctionnalités Optionnelles (`tokenConfig.features`)**
    *   **`features.pausable`:** Tooltip mis à jour pour mentionner rôle 'Pauser'.
    *   **`features.burnable`:** Inchangé.
    *   *Note: La gestion d'autres minters initiaux via ce formulaire est hors scope L4-M3.1.*

### 3. Section Récapitulatif & Déploiement
*   Indiquer clairement si "Mintable (par rôles)" et l'adresse de `initialAdmin`.

### 4. Expérience Utilisateur (UX)
*   Choix de template clair.
*   Formulaire "Avancé" reste simple pour MVP (rôles par défaut à `initialAdmin`).
*   Cohérence avec formulaire ERC-20 MVP.

Ces modifications permettent de configurer le déploiement du `ERC20Advanced`.
