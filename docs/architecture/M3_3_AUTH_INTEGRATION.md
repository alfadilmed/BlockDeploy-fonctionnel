## M3.3: Validation et Intégration du Module d'Authentification Existant

**Objectif:** S'assurer que l'identité de l'utilisateur authentifié peut être récupérée de manière fiable et passée aux services backends pour lier les actions (comme le déploiement de contrats) à un utilisateur spécifique.

### 1. Scénario d'Intégration Typique

Un module d'authentification est supposé existant (JWT, NextAuth.js, Firebase Auth, Auth0, etc.).

**Flux de Récupération et d'Utilisation de l'`userId`:**

1.  **Requête API Protégée:** Le client inclut un token d'authentification.
2.  **Middleware d'Authentification (Backend):**
    *   Valide le token.
    *   Extrait l'identifiant unique de l'utilisateur (`authId` du fournisseur).
    *   Récupère l'utilisateur interne BlockDeploy correspondant (via `authId`) pour obtenir son `_id` interne.
    *   Attache les informations utilisateur (notamment l'`_id` interne comme `userId`) à l'objet `request` (ex: `req.user`).
3.  **Handler de Route API:**
    *   Accède à `req.user.id` (qui est notre `_id` interne).
    *   Utilise cet `userId` pour la création d'enregistrements en DB (ex: `deployments.userId`) et pour peupler `DeploymentJobData.userId`.

    ```typescript
    // Exemple conceptuel de handler Express.js
    // app.post('/api/v1/test-deploy/simple-erc20', authenticateRequest, async (req, res) => {
    //   const userId = req.user.id; // Notre _id interne de UserDBSchema
    //   // ...
    //   const jobData: DeploymentJobData = {
    //     deploymentId: "...",
    //     userId: userId, // Utilisation de notre _id interne
    //     // ...
    //   };
    //   await deploymentQueue.add('deployContractJob', jobData);
    //   // ...
    // });
    ```

### 2. Vérification du `UserDBSchema`

Le `UserDBSchema` (`src/types/database/schemas.ts`) contient :
*   `_id: string;` (ID interne BlockDeploy)
*   `authId?: string;` (ID du fournisseur d'authentification externe)

**Conclusion de la Validation:**
*   Le module d'authentification doit fournir l'`authId` externe.
*   Le backend (via middleware) doit mapper cet `authId` à l'`_id` interne de `UserDBSchema`.
*   C'est l'`_id` interne qui doit être utilisé comme `userId` dans les autres collections (`deployments`) et dans les jobs de la file d'attente pour l'intégrité référentielle interne.
*   Le `UserDBSchema` est adéquat.

### 3. Implications pour les Services

*   Les services comme `DeploymentService` et `deploymentWorker` opèrent avec l'`userId` interne.
*   La robustesse du middleware d'authentification est primordiale.

Cette approche assure un découplage entre l'authentification externe et la gestion interne des utilisateurs.
