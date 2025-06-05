## M3.5 (Optionnel): Concept de Service de Compilation Dynamique de Base (Lot 1)

**Objectif:** Décrire l'architecture conceptuelle d'un service de compilation dynamique de code Solidity pour les cas où un template pré-compilé ne suffit pas.

**Contexte:** Partie de la stratégie "Hybride" de compilation (P0.2). Implémentation réelle potentiellement reportée ou sous feature flag.

### 1. Architecture Proposée

*   **Microservice Dédié ou Fonction Serverless (ex: AWS Lambda):** Isoler la logique et les dépendances (`solc-js` ou binaire `solc`). Lambda est bien adaptée pour une tâche non constante.
*   **Interface du Service:**
    *   **Entrée:** Code source Solidity (string), version du compilateur (string), options de compilation (optionnel).
    *   **Sortie (Succès):** ABI (JSON), Bytecode (hex string).
    *   **Sortie (Erreur):** Erreurs de compilation détaillées.

### 2. Flux d'Intégration

1.  **Demande Déploiement (API Backend):** L'utilisateur soumet une configuration.
2.  **Si Pas de Template Pré-compilé:**
    *   **Assemblage Code Source:** Le backend assemble le code Solidity basé sur les options utilisateur.
    *   **Appel Service Compilation:** Le backend appelle le service de compilation avec le code source et la version du compilateur.
3.  **Service de Compilation:**
    *   Récupère/utilise la version de `solc-js` ou `solc` demandée.
    *   Compile.
    *   Retourne ABI/Bytecode ou erreurs.
4.  **Suite Flux Déploiement (API Backend):**
    *   Si succès compilation: Utilise ABI/Bytecode pour la `deploymentQueue`.
    *   Si échec: Retourne erreur à l'utilisateur.

### 3. Considérations Techniques

*   **`solc-js` vs Binaire `solc`:** `solc-js` plus simple à packager pour Lambda ; binaire `solc` potentiellement plus performant (nécessite environnement Linux).
*   **Gestion Versions Compilateur:** Le service doit supporter plusieurs versions.
*   **Sécurité:** Isolation, validation entrées, limitation ressources.
*   **Performance/Coût:** Optimiser cold starts (Lambda), surveiller coûts.
*   **Caching (Optionnel):** Pour résultats de compilation fréquents (clé de cache = hash(code) + version compilateur).

### 4. Activation via Feature Flag

*   La décision d'utiliser ce service peut être contrôlée par un feature flag pour un déploiement et des tests progressifs.

Ce service est clé pour la personnalisation avancée future de BlockDeploy.
