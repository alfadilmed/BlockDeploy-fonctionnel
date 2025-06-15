# P2-L1-M4: Conception UI/UX Détaillée - Constructeur de dApp Front-End

**Date:** $(date -I)

## 1. Introduction

Ce document détaille la conception de l'interface utilisateur (UI) et de l'expérience utilisateur (UX) pour le constructeur de dApp frontend de BlockDeploy. Il s'appuie sur le périmètre MVP défini en P2-L1-M2 et l'architecture technique esquissée en P2-L1-M3.

## 2. Principes Directeurs de l'UX

- **Intuitivité:** L'interface doit être facile à comprendre et à utiliser, même pour des utilisateurs n'ayant pas une grande expérience technique en développement Web3.
- **Simplicité (pour le MVP):** Se concentrer sur les fonctionnalités essentielles et éviter la surcharge cognitive.
- **Feedback Clair:** L'utilisateur doit toujours comprendre ce qui se passe, notamment lors des interactions avec la blockchain ou la configuration des composants.
- **Flexibilité de Base:** Permettre une personnalisation suffisante pour les cas d'usage MVP.
- **Cohérence:** Maintenir une cohérence avec le design system global de BlockDeploy.

## 3. Structure Générale de l'Interface du Constructeur

L'interface du constructeur sera organisée autour de plusieurs zones principales :

### 3.1. Barre de Navigation Supérieure (Header)
    - **Logo BlockDeploy / Nom du Projet dApp:** Identification du contexte.
    - **Nom du Projet Actuel:** Affiché et éditable.
    - **Indicateur de Statut de Sauvegarde:** (Ex: "Sauvegardé", "Sauvegarde en cours...", "Non sauvegardé").
    - **Boutons d'Actions Globales:**
        - `Prévisualiser`: Ouvre la dApp dans un nouvel onglet ou une modale en mode "live".
        - `Publier` (MVP: Exporter / Optionnel: Publier sur IPFS).
        - `Aide`: Lien vers la documentation du constructeur de dApp.
        - `Mon Compte / Quitter`.

### 3.2. Volet Gauche - Palette de Composants & Structure de Page
    - **Onglet "Ajouter Composants":**
        - Liste des composants "Drag & Drop" disponibles, groupés par catégorie (ex: "Layout", "UI Standard", "Web3").
        - Chaque composant est représenté par une icône et un nom.
        - Fonction de recherche de composants.
    - **Onglet "Structure / Calques":**
        - Représentation hiérarchique (arbre) des composants actuellement sur le canvas.
        - Permet de sélectionner, réorganiser (drag & drop dans l'arbre), masquer/afficher, et supprimer des composants.
        - Utile pour les mises en page complexes et la sélection d'éléments imbriqués.

### 3.3. Zone Centrale - Canvas de Construction
    - **Surface Principale:** Où l'utilisateur dépose et arrange les composants.
    - **Représentation Visuelle de la dApp:** Le canvas affiche un aperçu "WYSIWYG" (What You See Is What You Get) autant que possible.
    - **Grille et Magnétisme (Optionnel MVP):** Pour aider à l'alignement.
    - **Barre d'outils contextuelle au canvas (Optionnel MVP):** Zooms, règles, sélection de breakpoints (Desktop, Tablette, Mobile) pour le responsive design.

### 3.4. Volet Droit - Panneau de Propriétés / Configuration
    - **Contextuel:** Affiche les options de configuration du composant sélectionné sur le canvas ou dans l'arbre de structure.
    - **Sections de Propriétés:**
        - **Contenu:** (Ex: texte d'un bouton, URL d'une image, variable à afficher).
        - **Style/Apparence:** (Ex: couleurs, typographie, marges, padding, bordures). Pour le MVP, options limitées, peut-être via des classes de style prédéfinies ou des contrôles simples.
        - **Configuration Spécifique au Composant Web3:**
            - Sélection du contrat (depuis une liste de contrats importés dans le projet dApp).
            - Sélection de la fonction du contrat (pour lecture ou écriture).
            - Mapping des arguments de la fonction à des champs de saisie ou des valeurs statiques.
            - Configuration du rendu des résultats (pour les lecteurs de données).
        - **Actions/Événements (Simplifié pour MVP):** (Ex: "Au clic", lier à une action de contrat).

## 4. Parcours Utilisateur Typiques (UX Flows)

### 4.1. Création d'un Nouveau Projet de dApp
    1. Dashboard BlockDeploy -> Section "Mes dApps" (à créer) -> Bouton "Créer une nouvelle dApp".
    2. Modale: Nommer le projet, choisir un template de base (optionnel, ex: "Page Vierge", "Page de Mint NFT simple").
    3. Redirection vers l'interface du constructeur avec le nouveau projet.

### 4.2. Ajout et Configuration d'un Composant
    1. Glisser un composant depuis la "Palette de Composants" vers le "Canvas".
    2. Sélectionner le composant sur le canvas (ou dans l'arbre de structure).
    3. Le "Panneau de Propriétés" se met à jour avec les options du composant.
    4. Modifier les propriétés (ex: changer le texte d'un titre, lier un "Lecteur de Données Contrat" à une fonction `view`).
    5. Les modifications sont reflétées en temps réel sur le canvas.

### 4.3. Liaison d'un Contrat à un Composant Web3
    1. (Prérequis) Importer un contrat dans le projet dApp (via une section "Gestion des Contrats" dans le constructeur, permettant d'ajouter des adresses/ABIs).
    2. Sélectionner un composant Web3 (ex: "Bouton d'Interaction Contrat") sur le canvas.
    3. Dans le "Panneau de Propriétés":
        - Section "Contrat": Choisir le contrat parmi ceux importés.
        - Section "Fonction": Choisir la fonction à appeler (liste basée sur l'ABI du contrat).
        - Section "Arguments": Configurer les champs pour chaque argument de la fonction.
        - Section "Feedback": Configurer les messages de succès/erreur (optionnel MVP).

### 4.4. Prévisualisation et Publication
    1. Cliquer sur "Prévisualiser" dans la barre de navigation supérieure. La dApp s'ouvre en mode interactif.
    2. Retourner à l'éditeur.
    3. Cliquer sur "Publier".
    4. MVP: Option "Exporter les fichiers". L'utilisateur télécharge un ZIP.
    5. *Optionnel MVP:* Option "Publier sur IPFS". Processus en arrière-plan, l'utilisateur reçoit une URL IPFS.

## 5. Wireframes / Maquettes ASCII Détaillés

*(Cette section pourrait inclure des représentations ASCII plus détaillées de chaque zone du constructeur et des modales clés, s'appuyant sur les descriptions ci-dessus.)*

```
+---------------------------------------------------------------------------------------------------+
| [Logo] NomProjetDApp  (Sauvegardé)                      [Prévisualiser] [Exporter/Publier] [Aide] |
|---------------------------------------------------------------------------------------------------|
| Volet Gauche (Palette/Structure) | Zone Centrale (Canvas de Construction) | Volet Droit (Propriétés) |
|                                  |                                        |                          |
| [Onglet: Ajouter] [Onglet: Struc]|  +-----------------------------------+ | Si composant sélectionné:  |
| - Layout                         |  |                                   | | Nom du Composant         |
|   - Conteneur                    |  |   [Composant Déposé 1]            | | - Propriété A: [Input]   |
| - UI Standard                    |  |     Texte: "Mon Titre"            | | - Propriété B: [Select]  |
|   - Titre                        |  |                                   | | - Config Contrat:        |
|   - Texte                        |  +-----------------------------------+ |   - Contrat: [Dropdown]  |
|   - Bouton                       |  |                                   | |   - Fonction: [Dropdown] |
| - Web3                           |  |   [Composant Déposé 2]            | |   - Args: ...            |
|   - Connexion Wallet             |  |     Bouton: "Minter NFT"          | |                          |
|   - Lecteur Données Contrat      |  |                                   | | Si rien sélectionné:     |
|   - Bouton Interaction Contrat   |  +-----------------------------------+ | Instructions / Props Page|
|                                  |                                        |                          |
|                                  |                                        |                          |
|                                  | [Barre d'outils Canvas: Zoom, Breakpoints] |                          |
+---------------------------------------------------------------------------------------------------+
```

## 6. Conclusion

Cette conception UI/UX vise à fournir une base solide et intuitive pour le MVP du constructeur de dApp. L'accent est mis sur la simplicité des parcours utilisateurs clés et la clarté des options de configuration. Des tests utilisateurs seront essentiels pour affiner l'ergonomie.

---
*Ce document est une conception UI/UX initiale et est sujet à évolution basée sur les retours et les tests.*
