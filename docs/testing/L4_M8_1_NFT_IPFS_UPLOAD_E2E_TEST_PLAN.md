# L4-M8.1: Plan de Test End-to-End (E2E) - Upload IPFS Simplifié NFT

**Objectif du Test:** Valider de bout en bout le flux de création de NFT via l'API `/api/v1/nft/upload-ipfs`, y compris la génération correcte du `tokenURI` et l'accessibilité (conceptuelle) des données sur IPFS.

**Prérequis Généraux:**

*   Le service backend (`backend/`) doit être en cours d'exécution et accessible.
*   Disposer d'un client HTTP capable d'envoyer des requêtes `multipart/form-data` (ex: Postman, cURL, ou un framework de test E2E comme Cypress, Playwright).
*   (Pour les tests d'accessibilité IPFS) Accès à une gateway IPFS publique (ex: `https://ipfs.io/ipfs/`, `https://gateway.pinata.cloud/ipfs/`, ou `https://cloudflare-ipfs.com/ipfs/`).
*   (Pour les tests d'échec Pinata) Une méthode pour simuler une défaillance de Pinata. Cela pourrait impliquer:
    *   Utiliser temporairement des clés API Pinata invalides (stockées de manière sécurisée et isolée pour l'environnement de test).
    *   Si l'outil E2E le permet, intercepter et modifier la requête sortante vers Pinata pour simuler un échec, ou moquer la réponse de Pinata.

---

## Scénarios de Test Détaillés

### Scénario 1: Upload Réussi (Cas Nominal)

*   **Description:** Teste le flux complet avec des données valides pour s'assurer que l'image et les métadonnées sont correctement uploadées sur IPFS et qu'un `tokenURI` valide est retourné.
*   **Étapes:**
    1.  **Préparation:**
        *   Choisir une image de test (ex: `test-nft.png`, format PNG/JPEG, taille < 1MB).
        *   Définir les données NFT:
            *   `name`: "Mon Super NFT E2E"
            *   `description`: "Une description détaillée pour ce test NFT E2E."
            *   `attributes` (chaîne JSON): `[{"trait_type": "Couleur", "value": "Bleu Ciel"}, {"trait_type": "Test ID", "value": "E2E-Success-001"}]`
    2.  **Exécution:** Envoyer une requête `POST` à l'endpoint `/api/v1/nft/upload-ipfs` avec:
        *   Header `Content-Type: multipart/form-data`.
        *   Corps de la requête contenant `imageFile` (le fichier image) et les champs `name`, `description`, `attributes` (en tant que champs de formulaire).
    3.  **Vérifications (Assertions):**
        *   Le code de statut HTTP de la réponse est `201 CREATED`.
        *   Le corps de la réponse est un JSON contenant les champs: `tokenURI` (string), `imageCID` (string), `metadataCID` (string), et `nftDetails` (object).
        *   `tokenURI` commence par `ipfs://` et est suivi par la valeur de `metadataCID`. (Ex: `ipfs://<metadataCID_valeur>`).
        *   `imageCID` et `metadataCID` sont des chaînes non vides et ont un format valide de CID IPFS (généralement commençant par `Qm` pour v0 ou `bafy...` pour v1).
        *   `nftDetails.name` correspond au nom envoyé.
        *   `nftDetails.description` correspond à la description envoyée.
        *   `nftDetails.image` est égal à `ipfs://{imageCID_de_la_reponse}`.
        *   `nftDetails.attributes` est un tableau correspondant aux attributs envoyés (après parsing de la chaîne JSON).
    4.  **(Optionnel - Validation IPFS Manuelle/Semi-Automatisée):**
        *   Construire l'URL d'accès à la métadonnée via une gateway: `https://<gateway_ipfs_choisie>/ipfs/{metadataCID_de_la_reponse}`.
        *   Accéder à cette URL (via navigateur ou client HTTP).
        *   **Assertion:** Le JSON retourné par la gateway correspond à `nftDetails`. Le champ `image` dans ce JSON doit être `ipfs://{imageCID_de_la_reponse}`.
        *   Construire l'URL d'accès à l'image via une gateway: `https://<gateway_ipfs_choisie>/ipfs/{imageCID_de_la_reponse}`.
        *   Accéder à cette URL.
        *   **Assertion:** L'image récupérée est identique à l'image envoyée (vérification visuelle ou par checksum si possible).

---

### Scénario 2: Échec - Données d'Entrée Invalides

*   **Description:** Teste la robustesse de l'API face à des données d'entrée incorrectes ou manquantes.
*   **Sous-Scénario 2.1: Image Manquante**
    1.  **Préparation:** Données NFT valides (nom, description), mais pas de fichier `imageFile`.
    2.  **Exécution:** Envoyer la requête `POST` à `/api/v1/nft/upload-ipfs`.
    3.  **Vérifications:**
        *   Le code de statut HTTP est `400 BAD REQUEST`.
        *   (Optionnel) Le corps de la réponse JSON contient un message d'erreur clair indiquant que l'image est requise (ex: `"Image file is required."` ou message de `ParseFilePipe`).
*   **Sous-Scénario 2.2: Nom (Champ `name`) Manquant**
    1.  **Préparation:** Image de test valide, description, mais le champ `name` est omis.
    2.  **Exécution:** Envoyer la requête `POST`.
    3.  **Vérifications:**
        *   Le code de statut HTTP est `400 BAD REQUEST`.
        *   (Optionnel) Le corps de la réponse JSON indique une erreur de validation pour le champ `name` (généralement un message de `class-validator`).
*   **Sous-Scénario 2.3: Description (Champ `description`) Manquante**
    1.  **Préparation:** Image de test valide, nom, mais le champ `description` est omis.
    2.  **Exécution:** Envoyer la requête `POST`.
    3.  **Vérifications:**
        *   Le code de statut HTTP est `400 BAD REQUEST`.
        *   (Optionnel) Le corps de la réponse JSON indique une erreur de validation pour le champ `description`.
*   **Sous-Scénario 2.4: Attributs (Champ `attributes`) Mal Formés**
    1.  **Préparation:** Image, nom, description valides. `attributes` est une chaîne JSON invalide (ex: `[{trait_type: "Yeux", value: "Vert"}]` - clés non quotées).
    2.  **Exécution:** Envoyer la requête `POST`.
    3.  **Vérifications:**
        *   Le code de statut HTTP est `400 BAD REQUEST`.
        *   (Optionnel) Le corps de la réponse JSON indique une erreur de validation pour `attributes` ou une erreur de parsing. *(Note: La validation actuelle des attributs dans le DTO suppose une chaîne JSON valide qui est ensuite parsée. Si la chaîne elle-même n'est pas un JSON valide, le parsing peut échouer avant la validation des champs internes des attributs. Le test doit refléter la logique d'implémentation du parsing de ce champ dans le controller si elle est spécifique, sinon c'est la validation du DTO qui prime).*

---

### Scénario 3: Échec - Erreur du Service IPFS (Simulation)

*   **Description:** Teste la gestion des erreurs lorsque le service de pinning IPFS externe (Pinata) rencontre un problème.
*   **Prérequis Spécifique:** Configurer un moyen de simuler un échec de Pinata (voir Prérequis Généraux).
*   **Étapes:**
    1.  **Préparation:** Image de test et données NFT valides.
    2.  **Configuration:** Activer la simulation d'échec de Pinata.
    3.  **Exécution:** Envoyer une requête `POST` à `/api/v1/nft/upload-ipfs`.
    4.  **Vérifications:**
        *   Le code de statut HTTP est `500 INTERNAL SERVER ERROR` (ou le statut spécifique configuré dans `IpfsStorageService` pour les erreurs Pinata, qui est actuellement `INTERNAL_SERVER_ERROR`).
        *   (Optionnel) Le corps de la réponse JSON contient un message d'erreur indiquant l'échec de l'interaction avec le service IPFS (ex: `"Failed to upload file to IPFS: Pinata Error"`).
    5.  **Nettoyage:** Désactiver la simulation d'échec de Pinata pour ne pas impacter d'autres tests.

---

### (Optionnel) Scénario 4: Vérification sur OpenSea Testnet (Conceptuel)

*   **Description:** Décrit les étapes manuelles ou semi-automatisées pour vérifier si un NFT, utilisant le `tokenURI` généré par l'API, s'affiche correctement sur une plateforme comme OpenSea Testnet. Ce scénario est généralement hors de la portée des tests E2E automatisés standards sans outils ou intégrations spécifiques.
*   **Étapes:**
    1.  **Obtention du `tokenURI`:** Exécuter le Scénario 1 pour obtenir un `tokenURI` valide pour une image et des métadonnées.
    2.  **Déploiement et Minting:**
        *   Disposer d'un contrat intelligent ERC-721 (ou ERC-1155) déployé sur un réseau de test compatible avec OpenSea Testnet (ex: Sepolia, Goerli, Mumbai pour Polygon).
        *   Minter un nouveau token sur ce contrat en utilisant le `tokenURI` obtenu à l'étape précédente.
    3.  **Vérification sur OpenSea Testnet:**
        *   Attendre que OpenSea Testnet indexe le nouveau token (cela peut prendre quelques minutes).
        *   Accéder à la page du NFT sur OpenSea Testnet en utilisant l'adresse du contrat et l'ID du token.
    4.  **Assertions Visuelles/Manuelles:**
        *   L'image du NFT s'affiche correctement.
        *   Le nom, la description et les attributs du NFT correspondent aux métadonnées fournies.
        *   Aucune erreur d'affichage des métadonnées n'est visible.

---
