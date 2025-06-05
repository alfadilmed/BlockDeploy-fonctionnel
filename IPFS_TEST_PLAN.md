## Plan de Test pour l'Intégration IPFS (Module NFT - Lot 4)

**Objectif:** Valider la fonctionnalité de liaison des métadonnées NFT à IPFS, couvrant à la fois l'option de fourniture manuelle d'URL IPFS par l'utilisateur et l'option d'upload direct de fichiers via la plateforme BlockDeploy vers un service IPFS.

### 1. Prérequis aux Tests

*   P1.1: Module de création NFT (ERC-721 MVP) fonctionnel.
*   P1.2: Accès à un service IPFS (ex: Pinata) avec identifiants API valides pour le backend.
*   P1.3: Exemples d'images et de fichiers de métadonnées JSON.
*   P1.4: Contrat NFT déployé sur un réseau de test.
*   P1.5: Accès à un explorateur de blocs et marketplace de test (ex: OpenSea Testnet).

### 2. Scénarios de Test - Option 1: URL de Métadonnées Manuelle

*   **TST-IPFS-MAN-001: Configuration avec une URL de base IPFS valide**
    *   **Étapes:** Créer collection NFT ERC-721, choisir "URL de base manuelle", entrer URL IPFS valide (ex: `ipfs://CID_BASE/`), déployer, minter NFT (ID 1).
    *   **Attendu:** `tokenURI(1)` retourne `ipfs://CID_BASE/1.json` (ou `/1`). NFT s'affiche sur plateformes compatibles.
*   **TST-IPFS-MAN-002: Configuration avec une URL de base HTTP/HTTPS valide**
    *   **Étapes:** Idem, avec URL `https://api.example.com/metadata/`.
    *   **Attendu:** `tokenURI(1)` retourne `https://api.example.com/metadata/1.json` (ou `/1`).
*   **TST-IPFS-MAN-003: URL de base incorrecte ou malformée**
    *   **Étapes:** Entrer URL invalide.
    *   **Attendu:** Validation formulaire avec erreur, déploiement bloqué.
*   **TST-IPFS-MAN-004: URL de base sans slash final**
    *   **Étapes:** Entrer `ipfs://CID_BASE` (sans `/`).
    *   **Attendu:** Concaténation correcte ou ajout auto du slash. Comportement documenté.

### 3. Scénarios de Test - Option 2: Upload Direct sur IPFS via BlockDeploy

*   **TST-IPFS-UP-001: Upload image et métadonnées pour un NFT unique (ERC-721)**
    *   **Étapes:** Créer collection ERC-721, choisir "Upload direct", uploader image, remplir métadonnées (Nom, Description, Attributs), système génère JSON et uploade tout sur IPFS, déployer, minter.
    *   **Attendu:** Image et JSON sur IPFS. `tokenURI(1)` pointe vers CID du JSON. JSON contient CID de l'image. NFT s'affiche.
*   **TST-IPFS-UP-002: Types de fichiers image supportés et non supportés**
    *   **Étapes:** Tenter upload JPG, PNG, GIF, SVG, WEBP vs TXT, PDF.
    *   **Attendu:** Types supportés OK. Erreur claire pour non supportés.
*   **TST-IPFS-UP-003: Limites de taille de fichier image**
    *   **Étapes:** Uploader image > limite configurée (ex: 10MB).
    *   **Attendu:** Erreur claire, upload bloqué.
*   **TST-IPFS-UP-004: Échec de l'upload vers le service IPFS (simulé ou réel)**
    *   **Étapes:** Simuler erreur API IPFS (timeout, clé invalide).
    *   **Attendu:** Erreur claire. Processus bloqué ou permet de réessayer. Pas de contrat déployé avec métadonnées invalides.
*   **TST-IPFS-UP-005: Batch Upload (CSV/JSON) (Post-MVP)**
    *   **Étapes:** Préparer CSV/JSON pour plusieurs NFTs, utiliser batch upload.
    *   **Attendu:** Tous NFTs configurés avec métadonnées sur IPFS. `tokenURI` corrects.
*   **TST-IPFS-UP-006: Validation des données d'attributs NFT**
    *   **Étapes:** Entrer attributs valides, vides, caractères spéciaux.
    *   **Attendu:** Attributs valides bien formatés. Cas invalides gérés.

### 4. Tests de Non-Régression

*   **TNR-IPFS-001:** Après MàJ modules NFT/IPFS, ré-exécuter sélection de tests (TST-IPFS-MAN-001, TST-IPFS-UP-001).
*   **TNR-IPFS-002:** Vérifier NFTs existants.

### 5. Considérations Additionnelles

*   **Performance:** Mesurer temps upload/génération métadonnées.
*   **Coûts:** Surveiller utilisation service IPFS.
*   **Sécurité:** Gestion sécurisée clés API IPFS (backend).
*   **Expérience Utilisateur:** Clarté erreurs, feedback uploads.
