# Guide: Créer votre NFT avec l'Upload IPFS Simplifié

Bienvenue dans le guide de création de Tokens Non Fongibles (NFTs) avec la fonctionnalité d'upload simplifié vers IPFS de BlockDeploy !

## Introduction

Un **NFT (Non-Fungible Token)** est un type de token cryptographique qui représente un actif numérique unique. Contrairement aux cryptomonnaies comme le Bitcoin ou l'Ether qui sont fongibles (interchangeables), chaque NFT a des propriétés distinctes et ne peut être remplacé par un autre à l'identique. Ils sont souvent utilisés pour des œuvres d'art numériques, des objets de collection, des billets virtuels, des certificats de propriété, etc.

La création d'un NFT implique généralement deux étapes principales :
1.  **La préparation des métadonnées:** Ce sont les informations qui décrivent votre NFT (son nom, sa description, une image ou un média associé, et des attributs spécifiques). Ces métadonnées, y compris le média, sont souvent stockées sur IPFS (InterPlanetary File System), un système de stockage décentralisé.
2.  **Le minting (ou frappe):** C'est l'acte d'enregistrer le NFT sur une blockchain. Cette opération utilise un lien vers les métadonnées (souvent appelé `tokenURI`).

BlockDeploy simplifie grandement la première étape en vous permettant d'uploader votre image et de définir vos métadonnées facilement, puis de les enregistrer sur IPFS pour vous. Ce guide se concentre sur cette première étape : obtenir votre `tokenURI` via notre service d'upload simplifié.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants :

*   **(Hypothétique) Un compte sur la plateforme BlockDeploy:** Connectez-vous à votre tableau de bord.
*   **Une image (ou autre média) pour votre NFT:**
    *   Formats courants : `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`.
    *   Taille recommandée : Moins de 5MB pour un upload rapide et des coûts de stockage IPFS optimisés (bien que l'API puisse techniquement accepter plus, des limites peuvent être configurées).
*   **Les informations descriptives de votre NFT:**
    *   **Nom:** Un nom accrocheur pour votre NFT.
    *   **Description:** Une description détaillée de ce que représente votre NFT.
    *   **Attributs (Optionnel):** Des caractéristiques spécifiques ou des "traits" qui peuvent ajouter de la valeur ou de l'unicité à votre NFT (par exemple, Couleur: Rouge, Rareté: Légendaire).

## Étapes de Création des Métadonnées et Upload sur IPFS

Actuellement, cette fonctionnalité est accessible via une API backend. Une interface utilisateur intuitive sera bientôt disponible. Voici comment cela fonctionne "sous le capot" :

### Étape 1: Comprendre l'Endpoint API

La magie opère grâce à notre endpoint API : `POST /api/v1/nft/upload-ipfs`.
Cet endpoint est conçu pour recevoir votre image et les détails de votre NFT, les uploader sur IPFS, et vous retourner les identifiants IPFS nécessaires, y compris le fameux `tokenURI`.

### Étape 2: Préparer vos Données

Que vous utilisiez directement l'API (pour les utilisateurs avancés) ou une future interface utilisateur, les informations requises seront :

*   `name` (texte): Le nom de votre NFT.
    *   *Exemple:* `"Mon Chat Cosmique"`
*   `description` (texte): Une description pour votre NFT.
    *   *Exemple:* `"Un chat unique explorant les confins de la galaxie."`
*   `imageFile` (fichier): Votre fichier image (ex: `mon_chat_cosmique.png`).
*   `attributes` (texte - format chaîne JSON, optionnel): Une liste des traits ou attributs de votre NFT. Chaque attribut est un objet avec `trait_type` (le nom du trait) et `value` (la valeur du trait).
    *   *Exemple de chaîne JSON pour le champ `attributes`:* `[{"trait_type": "Couleur des Yeux", "value": "Ambre"}, {"trait_type": "Accessoire", "value": "Casque Spatial"}, {"trait_type": "Humeur", "value": "Aventureux"}]`
    *   Si vous n'avez pas d'attributs, vous pouvez omettre ce champ.

### Étape 3: Envoyer les Données (Exemple avec cURL pour l'API)

Si vous interagissiez directement avec l'API, vous utiliseriez un outil comme cURL. Une interface utilisateur simplifierait cela avec des formulaires et des boutons d'upload.

Voici un exemple de commande cURL (remplacez les valeurs d'exemple par les vôtres) :

```bash
curl -X POST \
  http://VOTRE_DOMAINE_BACKEND/api/v1/nft/upload-ipfs \
  -H "Content-Type: multipart/form-data" \
  -F "imageFile=@/chemin/vers/votre/image.png" \
  -F "name=Nom de votre NFT" \
  -F "description=Description de votre NFT" \
  -F "attributes=[{\"trait_type\": \"Type\", \"value\": \"Exemple\"}]"
```
*(Assurez-vous que le chemin vers votre image est correct et que les guillemets dans la chaîne JSON des attributs sont correctement échappés pour le terminal que vous utilisez.)*

### Étape 4: Comprendre la Réponse (Votre `tokenURI` !)

Après un traitement réussi, l'API (ou l'interface utilisateur) vous retournera les informations suivantes :

*   **`tokenURI` (string):** C'est l'URL la plus importante ! Elle pointe vers votre fichier de métadonnées JSON stocké sur IPFS. Ce `tokenURI` est celui que vous utiliserez pour minter votre NFT sur la blockchain.
    *   *Exemple:* `ipfs://QmZfpD8NfK9vQjYJ6XmS2zG9P7xR5nK3wA2bC1dE0F4gH5`
*   **`imageCID` (string):** L'identifiant de contenu (CID) de votre image sur IPFS.
    *   *Exemple:* `ipfs://QmXyZ12A3B4C5D6E7F8G9H0J1K2L3M4N5P6Q7R8S9T0` (le format exact peut varier, ici présenté avec `ipfs://` pour clarté, mais le CID brut est aussi retourné)
*   **`metadataCID` (string):** Le CID de votre fichier de métadonnées JSON sur IPFS. C'est ce CID qui est utilisé dans le `tokenURI`.
*   **`nftDetails` (object):** Un objet JSON contenant toutes les métadonnées qui ont été sauvegardées pour votre NFT (nom, description, lien vers l'image IPFS, attributs).

**Conservez précieusement votre `tokenURI` !**

## Étape 5: Prochaines Étapes - Minter votre NFT

Félicitations ! Vous avez maintenant un `tokenURI` qui pointe vers les métadonnées de votre NFT hébergées de manière décentralisée sur IPFS.

L'étape suivante est le **minting** : la création effective de votre NFT sur la blockchain. Pour cela, vous utiliserez ce `tokenURI`.

BlockDeploy vous proposera des options pour :
*   Minter ce NFT sur un de vos contrats de collection ERC-721 existants (si vous en avez déployé via BlockDeploy).
*   Déployer un nouveau contrat de collection ERC-721 et y minter ce NFT.
*   (Autres options futures...)

➡️ **Consultez notre guide : [Minter votre NFT en utilisant un `tokenURI` (Lien vers un futur guide)]**

## Dépannage Courant

Lors de l'utilisation de l'API (ou de la future interface utilisateur) :

*   **Erreur "Image file is required" / "imageFile is required":** Assurez-vous d'avoir bien sélectionné et inclus un fichier image dans votre requête.
*   **Erreurs de validation (ex: "name should not be empty", "description must be a string"):** Vérifiez que tous les champs requis sont remplis correctement selon les formats attendus. Si vous fournissez des attributs, assurez-vous que la chaîne JSON est valide.
*   **Erreur "Failed to upload file to IPFS" ou "Failed to upload JSON to IPFS":** Cela peut indiquer un problème temporaire avec le service IPFS (Pinata dans notre cas) ou une configuration incorrecte des clés API côté serveur (ce qui est de notre ressort). Réessayez après quelques instants. Si le problème persiste, cela pourrait nécessiter une vérification de notre côté.

## Conclusion

L'outil d'upload IPFS simplifié de BlockDeploy vise à rendre la création de NFT plus accessible. En prenant en charge la complexité du stockage IPFS, nous vous permettons de vous concentrer sur la créativité et la valeur de vos NFTs.

Nous espérons que ce guide vous a été utile. Bonne création !
