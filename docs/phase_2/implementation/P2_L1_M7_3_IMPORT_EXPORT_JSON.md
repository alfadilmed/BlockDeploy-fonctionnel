# P2-L1 Implémentation: Import et Export JSON de `DAppDefinition`

**Date:** $(date -I)
**Concerne les milestones (Impl):** P2-L1-M7.1, P2-L1-M7.2

## 1. Introduction

Ce document décrit les fonctionnalités d'import et d'export de la configuration d'une dApp (l'objet `DAppDefinition`) au format JSON dans le Constructeur de dApp de BlockDeploy. Ces fonctionnalités permettent aux utilisateurs de sauvegarder manuellement leur travail, de le partager, ou de le versionner en dehors de la plateforme.

## 2. Export JSON

### 2.1. Fonctionnement
- Un bouton "Export JSON" est disponible dans l'en-tête de l'éditeur (`MainEditorLayout.tsx`).
- Au clic, si une dApp (`currentDApp`) est chargée dans le store `builderStore` :
    1. L'objet `currentDApp` (qui est une instance de `DAppDefinition`) est récupéré du store.
    2. Il est sérialisé en une chaîne JSON formatée (pretty-printed avec une indentation de 2 espaces).
    3. Un objet `Blob` de type `application/json` est créé à partir de cette chaîne.
    4. Une URL d'objet est générée pour ce `Blob` (`URL.createObjectURL()`).
    5. Un élément `<a>` temporaire est créé dynamiquement, son `href` est défini sur l'URL de l'objet, et son attribut `download` est défini sur un nom de fichier (ex: `nom_de_la_dapp_config.json`).
    6. Un clic est simulé sur cet élément `<a>`, ce qui déclenche le téléchargement du fichier par le navigateur.
    7. L'élément `<a>` et l'URL d'objet sont nettoyés (`removeChild`, `URL.revokeObjectURL()`).
- Si aucune dApp n'est chargée, le bouton est désactivé ou un message d'alerte informe l'utilisateur.

### 2.2. Format du Fichier Exporté
- Le fichier exporté est un fichier texte avec l'extension `.json`.
- Son contenu est la représentation JSON de l'objet `DAppDefinition` complet, tel que défini dans `src/modules/dapp-builder/types/index.ts`. Cela inclut :
    - `id`: Identifiant unique du projet de dApp.
    - `name`: Nom du projet de dApp.
    - `globalSettings`: Paramètres globaux de la dApp (ex: réseau cible).
    - `pages`: Un tableau d'objets `DAppPage`, chacun contenant :
        - `id`: Identifiant unique de la page.
        - `name`: Nom de la page.
        - `path`: Chemin URL de la page.
        - `components`: Un tableau d'objets `DndComponent` (y compris leurs `properties` et potentiellement leurs `children` de manière récursive).
    - `importedContracts`: Un enregistrement des contrats importés avec leur adresse et ABI.

## 3. Import JSON

### 3.1. Fonctionnement
- Un bouton "Import JSON" est disponible dans l'en-tête de l'éditeur (`MainEditorLayout.tsx`).
- Au clic :
    1. Un élément `<input type="file" accept=".json,application/json" />` caché est cliqué programmatiquement.
    2. Lorsque l'utilisateur sélectionne un fichier, l'événement `onChange` de l'input est déclenché.
    3. La fonction `handleFileChange` lit le fichier sélectionné en utilisant `FileReader.readAsText()`.
    4. Une fois le fichier lu, le contenu textuel est parsé avec `JSON.parse()`.
    5. Une validation basique est effectuée sur l'objet résultant pour vérifier la présence des champs attendus d'une `DAppDefinition` (ex: `id`, `name`, `pages` doit être un tableau).
    6. Si la validation de base réussit, l'action `setCurrentDApp(importedDApp)` du `builderStore` est appelée, remplaçant la configuration de la dApp actuellement en édition par celle importée.
    7. Un message de succès ou d'erreur est affiché à l'utilisateur.
    8. Le champ de l'input fichier est réinitialisé pour permettre de réimporter le même fichier si besoin.

### 3.2. Format du Fichier Attendu à l'Import
- Le fichier doit être un fichier JSON valide.
- Sa structure doit correspondre à celle de l'interface `DAppDefinition`.
- **Validation Actuelle:** La validation est basique et se contente de vérifier la présence de quelques champs clés. Une non-conformité stricte au type `DAppDefinition` peut entraîner des erreurs de rendu ou de comportement dans l'éditeur.
- **Recommandation:** Utiliser un fichier JSON qui a été précédemment exporté par le constructeur de dApp pour assurer la compatibilité maximale.

## 4. Considérations et Limitations Actuelles

- **Validation à l'Import:** La validation de la structure du JSON importé est minimale. Une validation plus robuste (ex: avec des schémas Zod ou io-ts) serait une amélioration importante pour la fiabilité.
- **Gestion des Conflits d'ID:** L'import remplace actuellement la dApp entière. Il n'y a pas de fusion ou de gestion de conflits d'ID de composants/pages si l'utilisateur essaie d'importer des éléments dans une dApp existante de manière sélective (fonctionnalité non prévue pour le MVP).
- **Taille des Fichiers:** Pour des dApps très volumineuses (beaucoup de pages, de composants, ou des ABIs de contrat volumineux stockés dans `importedContracts`), la taille du JSON pourrait devenir importante, impactant potentiellement les performances de parsing ou de manipulation dans le store.
- **Sécurité:** L'import de JSON provenant de sources non fiables pourrait théoriquement introduire des configurations inattendues si la validation n'est pas suffisamment stricte ou si les composants rendus ont des vulnérabilités (ex: XSS dans les propriétés de texte si non correctement sanitizées au rendu - bien que cela relève de la sécurité des composants eux-mêmes).

---
*Ce document décrit les fonctionnalités d'import/export JSON à l'issue des premières étapes de développement de P2-L1.*

---

## 4. Charger une dApp d'Exemple ("Load Demo")

### 4.1. Fonctionnement
- Un bouton "Load Demo" est disponible dans l'en-tête de l'éditeur (`MainEditorLayout.tsx`).
- Au clic sur ce bouton :
    1.  Si une dApp est actuellement chargée (`currentDApp` dans le store), une boîte de dialogue de confirmation (`window.confirm`) demande à l'utilisateur s'il souhaite remplacer la configuration actuelle. Si l'utilisateur annule, l'opération est stoppée.
    2.  La fonction `initializeDemoDApp()` (exportée depuis `src/modules/dapp-builder/state/builderStore.ts`) est appelée.
    3.  Cette fonction `initializeDemoDApp()` construit un objet `DAppDefinition` prédéfini et appelle `setCurrentDApp()` du `builderStore` pour charger ces données d'exemple.
    4.  Une alerte (`alert()`) informe l'utilisateur que la dApp d'exemple a été chargée.

### 4.2. Contenu de la dApp d'Exemple
- La dApp d'exemple (`Demo dApp Showcase`) est définie dans la fonction `initializeDemoDApp()` dans `builderStore.ts`.
- Elle contient une page unique ("Homepage") avec une sélection de composants de base :
    - Un `HeadingComponent` avec des propriétés de style spécifiques.
    - Un `TextComponent` descriptif.
    - Un `ConnectWalletButtonComponent`.
    - Un `ContainerComponent` avec des propriétés de style (couleur de fond, padding, etc.) et contenant lui-même des composants enfants (un autre `TextComponent` et un `DndComponentType.Button` générique).
- L'objectif de cette démo est de présenter quelques composants de base, une structure imbriquée simple, et de fournir un point de départ pour les tests et l'exploration du builder.

### 4.3. Utilité
- **Test Rapide:** Permet de peupler rapidement le canvas avec une structure fonctionnelle pour tester le rendu, la sélection, et l'édition des propriétés.
- **Démonstration:** Utile pour montrer les capacités de base du constructeur.
- **Onboarding Utilisateur:** Peut servir de point de départ pour les nouveaux utilisateurs afin qu'ils découvrent comment une dApp simple est structurée.
