## L2-M4.3: Logique Frontend pour l'Affichage du Feedback Post-Déploiement ERC-20 MVP

**Objectif:** Décrire comment l'UI informe l'utilisateur du statut et du résultat de sa demande de déploiement.

### 1. Feedback Immédiat après Soumission API (`POST /api/v1/deploy/erc20-mvp`)

*   **Si API répond `202 Accepted` (mise en file d'attente OK):**
    *   **UI Action:**
        *   Notification (Toast) succès: "Déploiement en cours pour '{NOM_TOKEN}'. Mis en file d'attente (ID: {deploymentId})."
        *   État UI: "Traitement en cours..." (formulaire désactivé).
        *   Redirection (Option C pour MVP simple): Réinitialiser formulaire, informer l'utilisateur de suivre dans son dashboard.
*   **Si API répond avec Erreur (4xx, 5xx):**
    *   **UI Action:**
        *   Notification (Toast/Alert) erreur: Titre "Échec demande", Message de l'API (`responseData.message`, `responseData.details`).
        *   Formulaire reste modifiable. `isLoading` à `false`.

### 2. Suivi du Statut du Déploiement (Asynchrone)

*   **Approche MVP (Polling sur Dashboard - Axe 3):**
    *   Page "Mes Déploiements" du dashboard polle un endpoint API (ex: `GET /api/v1/deployments/:deploymentId/status`) pour rafraîchir le statut.
    *   L'UI du dashboard reflète les changements (`PENDING` -> `PROCESSING` -> `SUCCESS`/`FAILED`).
*   **Approche Améliorée (WebSockets - Post-MVP Lot 2):**
    *   Notifications temps réel via WebSockets sur changement de statut.

### 3. Affichage du Résultat Final du Déploiement

*   **Si Déploiement Réussi (`DeploymentStatus.SUCCESS`):**
    *   **Infos à Afficher (Dashboard/Toast persistant):**
        *   Message: "Token '{NOM_TOKEN}' déployé avec succès !"
        *   Adresse Contrat: `{contractAddress}` (avec bouton copie)
        *   Hash Transaction: `{transactionHash}`
        *   Réseau: `{networkName}`
        *   Lien Explorateur: Généré dynamiquement (ex: Etherscan, Polygonscan).
    *   **Actions:** "Voir sur l'explorateur", lien vers détail contrat dashboard.

*   **Si Déploiement Échoué (`DeploymentStatus.FAILED`):**
    *   **Infos à Afficher:**
        *   Message: "Déploiement du token '{NOM_TOKEN}' a échoué."
        *   Raison: `{errorMessage}` (de la DB).
    *   **Actions:** Suggestion réessayer, lien aide/support.

### 4. Intégration avec le Dashboard (Axe 3)
La page "Mes Déploiements" est centrale pour visualiser tous les déploiements et leurs statuts.

Cette gestion du feedback est cruciale pour l'expérience utilisateur durant ce processus asynchrone.
