## M3.4: Concept de Test d'Intégration du Flux Complet (Lot 1)

**Objectif:** Décrire un scénario de test de bout en bout (E2E) pour valider l'intégration des différents services et composants développés ou conceptualisés dans le Lot 1.

### Prérequis pour le Test (État Attendu)
*   API (M3.2) fonctionnelle (conceptuellement).
*   Authentification (M3.3) pour `userId` (conceptuellement).
*   File d'Attente (M2.2 & M3.1) opérationnelle, API y ajoute les jobs.
*   Worker (M2.2) écoute et traite les jobs.
*   Services Backend (`DeploymentService` M2.1, `ProviderService` M1.3, `SecretManagerService` M1.4) prêts.
*   Base de Données (M2.3) avec schémas définis et mécanisme de mise à jour (simulé).
*   Contrat "SimpleERC20" défini dans `DeploymentService` (bytecode placeholder OK pour ce test conceptuel).

### Scénario de Test E2E: Déploiement d'un "SimpleERC20"

1.  **Étape 1: Requête API (Client -> Backend API)**
    *   **Action:** Simuler `POST /api/v1/test-deploy/simple-erc20` avec payload valide (cf. `docs/api/LOT1_API_EXAMPLES.md`).
    *   **Vérifications (Logs):** Auth (simulée) attribue `userId`. Handler API reçoit requête. Validation entrées.

2.  **Étape 2: Création Enregistrement DB & Ajout à la Queue (Backend API -> DB & Queue)**
    *   **Action:** Handler API crée enregistrement `DeploymentDBSchema` (`status: PENDING`, `deploymentId` unique).
    *   **Vérifications:** Log création DB. `DeploymentJobData` correcte (avec `deploymentId`, `userId`). Log ajout job à `deploymentQueue` (BullMQ) avec `jobId`. API répond `202 Accepted` (`deploymentId`, `jobId`).

3.  **Étape 3: Prise en Charge par le Worker (Queue -> Worker)**
    *   **Action:** `deploymentWorker` prend le job.
    *   **Vérifications:** Log BullMQ: job `active`. Log Worker: début traitement (avec `job.id`, `job.data.deploymentId`). (Simulé) MàJ statut DB à `PROCESSING`.

4.  **Étape 4: Exécution par `DeploymentService` (Worker -> Services Backend)**
    *   **Action:** `jobProcessor` appelle `deploymentService.deployPrecompiledContract()`.
    *   **Vérifications (Logs `DeploymentService`):** Appel `ProviderService` (Sepolia). Appel `SecretManagerService` (clé simulée). Récupération template "SimpleERC20". Tentative déploiement `ethers.ContractFactory`.
    *   *Avec bytecode placeholder, `factory.deploy()` échouera ; test valide l'enchaînement.*

5.  **Étape 5: Résultat du Déploiement & Mise à Jour DB (Worker -> DB)**
    *   **Cas A: Succès Simulé (pour tester flux complet si bytecode était valide):**
        *   **Action (Simulée):** `DeploymentService` retourne adresse/hash fictifs.
        *   **Vérifications:** Log Worker: succès job. Log BullMQ: job `completed`. (Simulé) MàJ statut DB à `SUCCESS`, `contractAddress`/`transactionHash` fictifs.
    *   **Cas B: Échec (attendu avec bytecode placeholder):**
        *   **Action:** `factory.deploy()` ou `deploymentTransaction.wait()` échoue.
        *   **Vérifications:** Log `DeploymentService`: erreur capturée. Log Worker: échec job. Log BullMQ: job `failed`. (Simulé) MàJ statut DB à `FAILED`, `errorMessage`.

### Points de Vérification Clés
*   Logs API, BullMQ, `deploymentWorker`, `DeploymentService`, `ProviderService`, `SecretManagerService`.
*   État (simulé) de la DB: transitions de statut de `deployments`, champs remplis.

Ce test conceptuel valide l'architecture et le flux de données du Lot 1.
