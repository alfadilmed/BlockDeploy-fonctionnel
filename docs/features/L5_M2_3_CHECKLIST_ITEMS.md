## L5-M2.3: Définition des Items de la Checklist d'Onboarding MVP

**Objectif:** Définir les étapes clés de la checklist d'onboarding, leur validation et actions.

### Items de la Checklist MVP

1.  **Item 1: Connexion du Portefeuille**
    *   **`key`:** `connectedWallet`
    *   **Titre:** "Connectez votre portefeuille Web3"
    *   **Description:** "Connectez votre portefeuille (ex: MetaMask) pour commencer."
    *   **Validation:** Automatique (détection connexion wallet frontend -> API).
    *   **Action/Lien:** Bouton principal "Connecter Wallet". Pré-coché si déjà connecté.

2.  **Item 2: Explorer les Templates**
    *   **`key`:** `exploredTemplates`
    *   **Titre:** "Découvrez les types de contrats"
    *   **Description:** "Parcourez notre bibliothèque de templates (ERC-20, NFT, etc.)."
    *   **Validation:** Automatique (visite page templates frontend -> API).
    *   **Action/Lien:** Bouton/lien "Explorer les Templates" (vers page templates).

3.  **Item 3: Premier Déploiement Testnet**
    *   **`key`:** `deployedTestContract`
    *   **Titre:** "Déployez votre premier contrat (sur Testnet)"
    *   **Description:** "Essayez de déployer un token sur un réseau de test gratuit (Sepolia, Mumbai)."
    *   **Validation:** Automatique (déploiement réussi sur Testnet backend -> API, ou frontend -> API).
    *   **Action/Lien:** Bouton/lien "Créer un Token ERC-20" ou "Créer une Collection NFT".

4.  **Item 4: Apprendre les Termes Clés**
    *   **`key`:** `consultedGlossaryOrHelp`
    *   **Titre:** "Apprenez les termes clés du Web3"
    *   **Description:** "Consultez notre page d'Aide ou le Glossaire."
    *   **Validation:** Automatique (visite page `/docs/getting-started` OU `/docs/glossary` frontend -> API).
    *   **Action/Lien:** Bouton/lien "Consulter la Page d'Aide".

5.  **Item 5: Visualiser sur Explorateur**
    *   **`key`:** `viewedContractOnExplorer`
    *   **Titre:** "Visualisez votre contrat sur un Explorateur"
    *   **Description:** "Après un déploiement réussi, cliquez sur le lien pour voir votre contrat sur la blockchain."
    *   **Validation:** Manuelle (MVP) ou Automatique (détection clic lien sortant depuis détail contrat - Post-MVP).
    *   **Action/Lien:** Instruction (lien est sur page détail contrat). Tooltip pour guider.

6.  **Item 6 (Optionnel - si actions dashboard prêtes): Interagir avec Contrat**
    *   **`key`:** `interactedWithContract`
    *   **Titre:** "Interagissez avec votre contrat"
    *   **Description:** "Essayez une action (Pause, Mint) depuis le Dashboard."
    *   **Validation:** Automatique (action réussie via Dashboard backend -> API, ou frontend -> API).
    *   **Action/Lien:** Lien vers "Mes Contrats".

### Logique de Complétion
*   Frontend appelle `POST /api/v1/user/onboarding/checklist-item` ({itemKey, isCompleted: true}) lors de la complétion.
*   Composant `Checklist` récupère états via `GET /api/v1/user/onboarding-status`.
*   État persisté en DB (`UserDBSchema.onboardingState.checklist`).
