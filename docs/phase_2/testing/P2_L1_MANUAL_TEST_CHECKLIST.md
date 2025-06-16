# P2-L1: Checklist de Tests Manuels - Constructeur de dApp (Alpha MVP)

**Date:** $(date -I)
**Version du Builder Testée:** Alpha (fin de P2-L1)

## 1. Objectif

Cette checklist vise à guider les tests manuels des fonctionnalités de base du Constructeur de dApp pour valider son état MVP Alpha.

## 2. Environnement de Test

- Navigateur(s) : Chrome (dernière version), Firefox (dernière version)
- Wallet : MetaMask (ou autre wallet de test configuré)
- Réseau : Sepolia (ou le réseau configuré pour la démo et les tests)

## 3. Scénarios de Test

### 3.1. Initialisation et Interface de Base
| ID    | Scénario                                                                 | Étapes à Suivre                                                                                                                              | Résultat Attendu                                                                                                | Statut (OK/KO) | Notes |
|-------|--------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|----------------|-------|
| TC-01 | Accès à l'interface du dApp Builder                                      | - Naviguer vers l'URL du dApp builder (ex: `/dapp-builder/default`).                                                                         | - L'interface `MainEditorLayout` se charge correctement (Header, Palette, Canvas, Properties Panel).             |                |       |
| TC-02 | Chargement de la dApp d'exemple au démarrage (si aucune dApp chargée)    | - Accéder au builder sans dApp précédemment chargée (ex: vider localStorage si applicable et recharger).                                      | - La dApp "Demo dApp Showcase" est automatiquement chargée et affichée sur le canvas.                             |                |       |
| TC-03 | Sélection de composant sur le canvas                                     | - Cliquer sur un composant affiché sur le canvas (ex: le titre "Welcome to Your dApp!").<br>- Cliquer sur le fond du canvas.                   | - Le composant cliqué est visuellement marqué comme sélectionné (ex: bordure bleue).<br>- Le panneau de propriétés se met à jour avec les infos du composant.<br>- Cliquer sur le fond désélectionne le composant, le panneau de propriétés affiche un état par défaut. |                |       |

### 3.2. Fonctionnalité "Charger Exemple"
| ID    | Scénario                               | Étapes à Suivre                                                                                                                               | Résultat Attendu                                                                                                         | Statut (OK/KO) | Notes |
|-------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------------|-------|
| TC-04 | Chargement de la démo via bouton       | - Cliquer sur "Load Demo".<br>- Si une dApp est déjà chargée, confirmer l'écrasement.<br>- Si aucune dApp, vérifier le chargement direct.        | - La "Demo dApp Showcase" est chargée/rechargée sur le canvas.<br>- Un message de confirmation apparaît.                      |                |       |
| TC-05 | Annulation du chargement de démo       | - Avoir une dApp modifiée sur le canvas.<br>- Cliquer sur "Load Demo".<br>- Refuser la confirmation d'écrasement.                                 | - La dApp actuelle sur le canvas reste inchangée.                                                                          |                |       |

### 3.3. Fonctionnalité "Export JSON"
| ID    | Scénario                               | Étapes à Suivre                                                                                                 | Résultat Attendu                                                                                                   | Statut (OK/KO) | Notes |
|-------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|----------------|-------|
| TC-06 | Export d'une configuration dApp        | - Charger la dApp d'exemple ou créer une configuration simple.<br>- Cliquer sur "Export JSON".                     | - Un fichier JSON (ex: `Demo_dApp_Showcase_config.json`) est téléchargé.<br>- Le contenu du JSON correspond à la structure `DAppDefinition` attendue. |                |       |
| TC-07 | Export d'une dApp vide (si possible)   | - Si l'état du builder peut être "vide" (pas de `currentDApp`), vérifier que le bouton "Export JSON" est désactivé. | - Le bouton "Export JSON" est désactivé ou une alerte indique qu'il n'y a rien à exporter.                          |                |       |

### 3.4. Fonctionnalité "Import JSON"
| ID    | Scénario                               | Étapes à Suivre                                                                                                                                  | Résultat Attendu                                                                                                                               | Statut (OK/KO) | Notes |
|-------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-------|
| TC-08 | Import d'un JSON valide                | - Exporter une configuration (TC-06).<br>- Cliquer "Load Demo" pour changer l'état.<br>- Cliquer "Import JSON", sélectionner le fichier exporté. | - La dApp du fichier JSON est chargée sur le canvas.<br>- Un message de succès apparaît.                                                          |                |       |
| TC-09 | Import d'un JSON invalide (structure)  | - Créer un fichier JSON avec une structure ne correspondant pas à `DAppDefinition`.<br>- Essayer de l'importer.                                   | - Un message d'erreur clair indique que le fichier est invalide ou que la structure est incorrecte. L'état du canvas ne change pas.           |                |       |
| TC-10 | Import d'un fichier non-JSON           | - Essayer d'importer un fichier `.txt` ou `.png`.                                                                                                  | - Le sélecteur de fichier pourrait ne pas le permettre (si `accept=".json"` est bien géré). Si permis, une erreur de parsing doit être gérée. |                |       |

### 3.5. Drag & Drop de Nouveaux Composants
| ID    | Scénario                                        | Étapes à Suivre                                                                                                | Résultat Attendu                                                                                                                                   | Statut (OK/KO) | Notes |
|-------|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-------|
| TC-11 | Glisser un `Heading` depuis la palette au canvas | - Glisser le composant "Heading" de la palette vers une zone vide du canvas.                                   | - Un nouveau composant "Heading" apparaît sur le canvas avec des propriétés par défaut.<br>- Le store est mis à jour avec le nouveau composant.          |                |       |
| TC-12 | Glisser un `Text` depuis la palette au canvas    | - Glisser le composant "Text" de la palette vers le canvas.                                                    | - Un nouveau composant "Text" apparaît sur le canvas avec des propriétés par défaut.                                                                 |                |       |
| TC-13 | Glisser un `Container` depuis la palette         | - Glisser le composant "Container" de la palette vers le canvas.                                               | - Un nouveau "Container" apparaît, visuellement distinct, avec un placeholder indiquant qu'il est vide ou peut recevoir des enfants.                |                |       |
| TC-14 | Glisser un `ConnectWalletButton` palette         | - Glisser le composant "Connect Wallet Btn" de la palette vers le canvas.                                        | - Un nouveau bouton "Connect Wallet" apparaît. (L'action de connexion réelle n'est pas testée ici, juste le rendu).                                |                |       |

### 3.6. Réagencement des Composants sur le Canvas
| ID    | Scénario                                      | Étapes à Suivre                                                                                                                               | Résultat Attendu                                                                                                                                  | Statut (OK/KO) | Notes |
|-------|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-------|
| TC-15 | Réorganiser deux composants au niveau racine  | - Charger la démo (ou ajouter au moins 2 composants).<br>- Glisser le premier composant et le déposer après le second.                         | - L'ordre visuel des composants sur le canvas change.<br>- L'ordre des composants dans le store (`currentDApp.pages[...].components`) est mis à jour. |                |       |
| TC-16 | Déplacer un composant à la fin de la liste    | - Glisser un composant du milieu de la liste et le déposer sur une zone vide du canvas (simulant un drop "à la fin").                         | - Le composant est déplacé à la fin de la liste sur le canvas et dans le store.                                                                   |                |       |

### 3.7. Édition des Propriétés via `PropertiesPanel`
| ID    | Scénario                                         | Étapes à Suivre                                                                                                                                                              | Résultat Attendu                                                                                                                                                           | Statut (OK/KO) | Notes |
|-------|--------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-------|
| TC-17 | Modifier le contenu d'un `Heading`                 | - Sélectionner un `Heading` sur le canvas.<br>- Dans le `PropertiesPanel`, modifier le champ "Content".<br>- Modifier le "Level".                                            | - Le texte et le niveau du titre sur le canvas se mettent à jour en temps réel.<br>- Les modifications sont reflétées dans le store.                                    |                |       |
| TC-18 | Modifier les styles d'un `Text` (fontSize, color) | - Sélectionner un `Text` sur le canvas.<br>- Dans le `PropertiesPanel`, modifier "Font Size" (ex: "20px") et "Color" (ex: "blue").                                      | - La taille et la couleur du texte sur le canvas se mettent à jour.<br>- Les modifications sont reflétées dans le store.                                                |                |       |
| TC-19 | Modifier les propriétés d'un `Container`         | - Sélectionner un `Container` sur le canvas.<br>- Modifier "Background Color" (ex: "lightblue") et "Padding" (ex: "25px").                                               | - La couleur de fond et le padding du conteneur sur le canvas se mettent à jour.<br>- Les modifications sont reflétées dans le store.                                |                |       |

## 4. Tests Exploratoires

- Essayer différentes combinaisons de D&D.
- Tester les limites des champs de propriétés (valeurs incorrectes, etc.).
- Redimensionner la fenêtre du navigateur pour vérifier la réactivité de base de l'éditeur.

## 5. Problèmes Rencontrés / Bugs

*(Section à remplir pendant les tests)*

---
*Cette checklist est un point de départ et pourra être enrichie.*
