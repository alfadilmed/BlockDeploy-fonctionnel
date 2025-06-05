## Exemples d'API pour le Lot 1 et Lot 2

Ce document fournit des exemples d'appels API et de réponses pour les endpoints développés ou testés conceptuellement.

### Endpoints de Déploiement de Test (Lot 1)

#### 1. Déployer un contrat ERC-20 Simple (Pré-compilé - Test Initial Lot 1)

*   **Endpoint:** `POST /api/v1/test-deploy/simple-erc20`
*   **Méthode:** `POST`
*   **Description:** Initie le déploiement d'un contrat ERC-20 très simple pré-compilé (ex: "SimpleERC20") sur un réseau de test comme Sepolia. Principalement pour tester le flux de base du Lot 1.
*   **Authentification:** Requise.

*   **Corps de la Requête (Request Body):**
    ```json
    {
      "networkName": "sepolia",
      "userGivenName": "MonTokenDeTestAPI_Lot1",
      "constructorArgs": {
        "name": "Mon Token de Test Lot1",
        "symbol": "MTSTL1",
        "initialSupply": "1000000000000000000000"
      }
    }
    ```

*   **Réponse en Cas de Succès (Code `202 Accepted`):**
    ```json
    {
      "message": "Demande de déploiement acceptée et mise en file d'attente.",
      "deploymentId": "abcdef-12345-ghijkl-67890",
      "jobId": "789"
    }
    ```

---
### Endpoints de Déploiement Spécifiques (Lot 2+)

#### 2. Déployer un contrat ERC-20 MVP (Lot 2)

*   **Endpoint:** `POST /api/v1/deploy/erc20-mvp`
*   **Méthode:** `POST`
*   **Description:** Initie le déploiement d'un contrat ERC-20 MVP configurable (Supply Fixe ou Plafonnée, options Pausable et Burnable). Traitement asynchrone via file d'attente.
*   **Authentification:** Requise.

*   **Corps de la Requête (Request Body):**
    ```json
    {
      "networkName": "sepolia",
      "userGivenName": "MonTokenERC20MVP",
      "tokenConfig": {
        "name": "Mon Token MVP",
        "symbol": "MMVP",
        "supplyType": "capped",
        "initialSupply": "500000",
        "cap": "1000000",
        "features": {
          "burnable": true,
          "pausable": true
        }
      }
    }
    ```
    *   `networkName` (string, requis): Nom du réseau.
    *   `userGivenName` (string, optionnel): Nom pour le dashboard.
    *   `tokenConfig` (object, requis): Configuration ERC-20 MVP.
        *   `name`, `symbol` (string, requis).
        *   `supplyType` (string, requis): "fixed" ou "capped".
        *   `initialSupply` (string, requis): Nombre en string (unités token).
        *   `cap` (string, optionnel): Requis si `supplyType` "capped". Nombre en string (unités token). >= `initialSupply`.
        *   `features.burnable`, `features.pausable` (boolean, requis).

*   **Réponse en Cas de Succès (Code `202 Accepted`):**
    ```json
    {
      "message": "Demande de déploiement pour ERC-20 MVP acceptée et mise en file d'attente.",
      "deploymentId": "new-deployment-id-xyz-789",
      "jobId": "101112"
    }
    ```

*   **Réponses en Cas d'Erreur Possibles:**
    *   **Code `400 Bad Request`:** Validation échouée (ex: `cap` < `initialSupply`).
        ```json
        {
          "error": "ValidationFailed",
          "message": "La configuration du token est invalide.",
          "details": [
            { "field": "tokenConfig.cap", "issue": "Le plafond doit être supérieur ou égal à la supply initiale." }
          ]
        }
        ```
    *   **Code `401 Unauthorized`**.
    *   **Code `500 Internal Server Error`**.

**Flux de Traitement API (Conceptuel pour ERC-20 MVP):**
1.  Validation requête & `tokenConfig`.
2.  Récupération `userId`.
3.  Création entrée `DeploymentDBSchema` (`status: PENDING`, `deploymentId`, `userId`, `networkName`, `userGivenName`, `tokenConfig`).
4.  Logique de Sélection Template & Préparation Args (basé sur `tokenConfig` -> `contractNameForPrecompiled`, `constructorArgs` formatés).
5.  Préparation `DeploymentJobData`.
6.  Ajout job à `deploymentQueue`.
7.  Réponse `202 Accepted`.
