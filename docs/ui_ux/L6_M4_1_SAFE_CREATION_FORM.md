# UI/UX Formulaire de Création DAO/Safe - L6-M4.1

Ce document décrit l'interface utilisateur (UI) et l'expérience utilisateur (UX) pour le formulaire de création d'une nouvelle DAO (basée sur un Safe multisig) dans BlockDeploy.

## 1. Objectif Utilisateur

Permettre à un utilisateur authentifié de configurer et de déployer facilement une nouvelle DAO/Safe en spécifiant ses propriétaires initiaux, le seuil de signature requis, et le réseau de déploiement.

## 2. Positionnement dans l'Application

*   **Accès Principal :** Depuis le Dashboard utilisateur, via un bouton "Créer une DAO" ou une section dédiée "Mes DAOs" -> "Nouvelle DAO".
*   **Alternative :** Pourrait être intégré dans un flux de création de projet plus global si pertinent.
*   **Page dédiée :** Le formulaire occupera probablement une page ou une modale plein écran dédiée pour éviter les distractions.

    ```
    ASCII Wireframe - Positionnement :

    +-----------------------------------------------------+
    | Header (Logo BlockDeploy, Menu Utilisateur)         |
    +-----------------------------------------------------+
    | Sidebar (Navigation Dashboard) | Contenu Principal  |
    |                                |                    |
    | - Projets                      | +------------------+
    | - Mes Contrats                 | | Titre: Créer DAO |
    | - Mes DAOs                     | +------------------+
    |   - Liste des DAOs             | | [Formulaire ici] |
    |   - Créer nouvelle DAO  <---   | |                  |
    | - Templates                    | +------------------+
    | - ...                          |                    |
    +-----------------------------------------------------+
    | Footer                                              |
    +-----------------------------------------------------+
    ```

## 3. Champs du Formulaire et Validations

Le formulaire comprendra les champs suivants :

*   **Nom de la DAO (Optionnel, pour affichage BlockDeploy)**:
    *   **Label :** "Nom de la DAO (optionnel)"
    *   **Type :** Champ texte simple.
    *   **Placeholder :** "Ex: Trésorerie Projet Alpha"
    *   **Validation :** Aucune validation stricte, mais peut être limité en longueur.
    *   **Note :** Ce nom est pour l'identification dans l'interface BlockDeploy uniquement, il n'est pas stocké on-chain dans le Safe lui-même.

*   **Propriétaires (`owners`)**:
    *   **Label :** "Adresses des Propriétaires"
    *   **Type :** Champ de saisie multiple dynamique. L'utilisateur peut ajouter ou supprimer des champs pour les adresses.
        *   Au moins un champ d'adresse visible initialement.
        *   Bouton "Ajouter un propriétaire" (+)
        *   Bouton "Supprimer" (X) à côté de chaque champ d'adresse (sauf le premier s'il est unique).
    *   **Placeholder par champ :** "0x..."
    *   **Validation (par adresse) :**
        *   Requis.
        *   Doit être une adresse Ethereum valide (format `0x` suivi de 40 caractères hexadécimaux).
        *   Pas de doublons d'adresses.
    *   **Minimum :** Au moins 1 propriétaire.

*   **Seuil de Signature (`threshold`)**:
    *   **Label :** "Seuil de Signatures Requis"
    *   **Type :** Champ numérique (entier positif) ou Select.
    *   **Description :** "Nombre de propriétaires devant approuver une transaction pour qu'elle soit exécutée."
    *   **Placeholder/Exemple :** "Ex: 2 (si 3 propriétaires, nécessite 2 sur 3 signatures)"
    *   **Validation :**
        *   Requis.
        *   Doit être un entier positif.
        *   Doit être inférieur ou égal au nombre total de propriétaires (`owners.length`).
        *   Doit être supérieur à 0.
    *   **Logique dynamique :** Le champ pourrait être un `select` dont les options se mettent à jour en fonction du nombre de propriétaires saisis (de 1 à `owners.length`).

*   **Réseau de Déploiement (`network`)**:
    *   **Label :** "Réseau de Déploiement"
    *   **Type :** Select (liste déroulante).
    *   **Options (MVP) :**
        *   Sepolia (Testnet)
        *   Polygon (Mainnet)
        *   *(La liste peut être étendue en fonction des réseaux supportés par BlockDeploy)*
    *   **Validation :** Requis. Une option doit être sélectionnée.
    *   **Défaut :** Peut-être le dernier réseau utilisé par l'utilisateur ou un réseau par défaut configuré globalement.

## 4. Actions et Boutons

*   **Bouton Principal :** "Créer la DAO" / "Déployer le Safe"
    *   **État :** Désactivé si le formulaire n'est pas valide. Activé sinon.
    *   **Action :** Soumet le formulaire au backend (`POST /api/v1/dao/multisig`).

*   **Bouton Secondaire (Optionnel) :** "Annuler" / "Retour"
    *   **Action :** Annule la création et redirige l'utilisateur (ex: vers la liste des DAOs ou le dashboard).

## 5. États et Feedback Utilisateur

*   **État Initial / Par Défaut**:
    *   Formulaire vide ou avec des valeurs par défaut minimales.
    *   Bouton "Créer" désactivé si des champs requis sont manquants.

*   **Validation en Temps Réel (Inline)**:
    *   Afficher des messages d'erreur sous les champs invalides dès que l'utilisateur interagit ou quitte un champ (onBlur).
    *   Exemples : "Adresse invalide", "Le seuil doit être inférieur ou égal au nombre de propriétaires".

*   **État de Chargement (`loading`)**:
    *   **Déclencheur :** Après clic sur "Créer la DAO" et pendant l'appel API et le déploiement du contrat.
    *   **Indication Visuelle :**
        *   Désactiver le bouton "Créer" et afficher un spinner/indicateur de chargement à l'intérieur ou à côté.
        *   Optionnel : Superposer un overlay léger sur le formulaire.
        *   Message textuel : "Déploiement de votre DAO en cours..."

*   **État de Succès (`success`)**:
    *   **Déclencheur :** L'API retourne un succès (201 Created) avec `safeAddress`, `txHash`, `daoId`.
    *   **Indication Visuelle :**
        *   Afficher un message de succès clair et visible. Ex: "Félicitations ! Votre DAO [Nom DAO] a été créée avec succès."
        *   Afficher l'adresse du Safe déployé (`safeAddress`) et un lien vers l'explorateur de blocs pour la transaction de déploiement (`txHash`).
    *   **Actions Post-Succès (à définir) :**
        *   **Option 1 (Préférée) :** Rediriger vers une page de détails/gestion de la DAO nouvellement créée.
        *   **Option 2 :** Afficher un bouton "Voir ma DAO" ou "Retour au Dashboard".
        *   **Option 3 :** Réinitialiser le formulaire pour une nouvelle création (moins probable).

*   **État d'Erreur (`error`)**:
    *   **Déclencheur :** L'API retourne une erreur (4xx, 5xx) ou une erreur réseau se produit.
    *   **Indication Visuelle :**
        *   Afficher un message d'erreur clair et concis. Ex: "Échec de la création de la DAO. Erreur : [Message d'erreur de l'API]".
        *   Si l'erreur est due à des problèmes de gas, conseiller à l'utilisateur de vérifier son solde et de réessayer.
    *   **Actions Post-Erreur :**
        *   Permettre à l'utilisateur de corriger les erreurs de saisie si applicable.
        *   Garder le bouton "Créer" actif pour une nouvelle tentative (éventuellement avec un cooldown pour éviter le spam).

## 6. Wireframe Sommaire du Formulaire

```
ASCII Wireframe - Formulaire :

+----------------------------------------------------------+
| Titre: Créer une Nouvelle DAO / Configurer votre Safe    |
+----------------------------------------------------------+
|                                                          |
| Nom de la DAO (optionnel)                                |
| [______________________________________________________] |
|                                                          |
| --- Section Propriétaires ---                            |
| Adresse du Propriétaire 1*                               |
| [0x123...abc___________________________________________] |
|                                                          |
| Adresse du Propriétaire 2*                               |
| [0x456...def___________________________________________] |
|                                            [X Supprimer] |
|                                                          |
|                        [ + Ajouter un Propriétaire ]     |
|                                                          |
| --- Configuration des Signatures ---                     |
| Seuil de Signatures Requis* (M sur N propriétaires)      |
| [ 2 ] sur 2 propriétaires                               |
|   (Info: Doit être > 0 et <= nombre de propriétaires)    |
|                                                          |
| --- Réseau ---                                           |
| Réseau de Déploiement*                                   |
| [ Sepolia (Testnet) v]  (Dropdown: Sepolia, Polygon)     |
|                                                          |
| --- Actions ---                                          |
| [ (Spinner) Création en cours... ] (Bouton désactivé)    |
| OU                                                       |
| [ Créer la DAO ] (Bouton activé/désactivé) [ Annuler ]   |
|                                                          |
| --- Feedback ---                                         |
| (Message de succès: Votre DAO est créée! Adresse: 0x...) |
| (Message d'erreur: Le déploiement a échoué. Raison: ...) |
|                                                          |
+----------------------------------------------------------+
```

## 7. Accessibilité et Responsive Design

*   Le formulaire doit suivre les bonnes pratiques d'accessibilité (labels clairs, navigation clavier, contrastes).
*   Il doit être responsive pour s'adapter aux différentes tailles d'écran.

Ce document sert de base pour le développement frontend du formulaire de création de DAO.
