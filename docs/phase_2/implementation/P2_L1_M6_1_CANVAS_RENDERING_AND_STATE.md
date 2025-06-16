# P2-L1 Implémentation: Rendu du Canvas et Gestion de l'État Initial

**Date:** $(date -I)
**Concerne les milestones (Impl):** P2-L1-M6.1, P2-L1-M6.2, P2-L1-M6.3

## 1. Introduction

Ce document résume les principaux choix d'implémentation et la logique mise en place pour le rendu dynamique des composants dans la `CanvasArea` et l'interaction initiale avec le store d'état (`builderStore.ts`) durant les premières étapes de développement du Constructeur de dApp (P2-L1 Alpha).

## 2. Rendu Dynamique dans `CanvasArea.tsx`

### 2.1. `componentRegistry`
- Un `componentRegistry` (objet JavaScript) a été introduit dans `CanvasArea.tsx`.
- Il mappe les `DndComponentType` (types de composants définis dans `../types`) à des composants React réels.
- Pour cette phase initiale, les composants réels sont des versions basiques créées dans `src/modules/dapp-builder/components/` (ex: `HeadingComponent`, `TextComponent`, `ConnectWalletButtonComponent`, `ContainerComponent`). Les autres types de composants du `DndComponentType` sont mappés à des placeholders génériques.
- **Avantage:** Permet une extensibilité facile. Pour ajouter le support d'un nouveau type de composant dans le canvas, il suffit de l'ajouter au `DndComponentType`, de créer son composant React, et de l'enregistrer dans le `componentRegistry`.

### 2.2. `RenderDndComponent`
- Ce composant React interne à `CanvasArea.tsx` est responsable du rendu d'un `DndComponent` individuel.
- Il utilise le `componentRegistry` pour déterminer quel composant React afficher en fonction de `component.type`.
- Il passe les `component.properties` au composant React instancié.
- **Gestion des Enfants:** `RenderDndComponent` gère la récursivité pour afficher les enfants d'un composant. Actuellement, cela est géré explicitement pour `DndComponentType.Container` qui passe ses `children` au `ContainerComponent` réel. Pour les autres types, les enfants sont également itérés et rendus, ce qui pourrait être affiné pour s'assurer que seuls les "conteneurs" désignés peuvent avoir des enfants rendus de cette manière.
- **Sélection de Composant:** Un clic sur un `RenderDndComponent` met à jour le `selectedComponentId` dans le `builderStore` via `setSelectedComponent(component.id)`. `e.stopPropagation()` est utilisé pour éviter que le clic ne se propage au conteneur parent (le canvas lui-même), ce qui désélectionnerait le composant.

### 2.3. Initialisation avec Données de Démo
- `CanvasArea.tsx` utilise `useEffect` pour appeler `initializeDemoDApp()` (défini dans `builderStore.ts`) au premier montage si `currentDApp` est indéfini dans le store.
- Cela charge une structure de `DAppDefinition` d'exemple, permettant de visualiser immédiatement le fonctionnement du rendu dynamique sans interaction utilisateur préalable.

## 3. Gestion de l'État avec `builderStore.ts` (Zustand)

### 3.1. Structure du Store
- Le store (`useBuilderStore`) est initialisé avec des états clés : `currentDApp`, `activePageId`, `selectedComponentId`, `isSaving`.
- Il expose des actions pour manipuler cet état.

### 3.2. Actions Clés Utilisées
- `setCurrentDApp(dapp)`: Utilisé par `initializeDemoDApp` pour charger la structure de la dApp.
- `setActivePage(pageId)`: Initialement non utilisé activement dans cette phase, mais prêt pour la gestion multi-pages.
- `setSelectedComponent(componentId)`: Utilisé par `CanvasArea` pour marquer un composant comme sélectionné.
- `updateComponentProperties(componentId, properties)`: Utilisé par `PropertiesPanel` pour mettre à jour les propriétés d'un composant. Cette action recherche le composant par son ID (de manière récursive dans la structure de pages et de composants enfants) et fusionne les nouvelles propriétés avec les anciennes.

### 3.3. Réactivité
- Les composants (`CanvasArea`, `PropertiesPanel`) s'abonnent aux changements du `builderStore`.
- Lorsque `updateComponentProperties` modifie l'état de `currentDApp`, `CanvasArea` se re-rend automatiquement, affichant les propriétés mises à jour.
- De même, lorsque `setSelectedComponent` est appelé, `PropertiesPanel` se met à jour pour afficher les propriétés du nouveau composant sélectionné, et `CanvasArea` met à jour le style du composant sélectionné.

## 4. Interaction `PropertiesPanel.tsx`

- Le `PropertiesPanel` affiche dynamiquement des champs de saisie en fonction du `type` du `selectedComponent` (récupéré du store).
- Pour cette phase, des éditeurs spécifiques ont été implémentés pour `Heading`, `Text`, `ConnectWalletButton`, et `Container`.
- La modification d'une propriété dans ces champs déclenche l'action `updateComponentProperties` du store, assurant la synchronisation de l'état.

## 5. Points d'Amélioration Futurs et Prochaines Étapes

- **Composants Réels:** Remplacer tous les placeholders dans `componentRegistry` par des composants fonctionnels et stylisés.
- **Logique Drag & Drop:** Intégrer `@dnd-kit` pour permettre l'ajout, la suppression et la réorganisation des composants sur le canvas et dans la `ComponentPalette`.
- **Validation des Propriétés:** Mettre en place une validation plus stricte pour les propriétés des composants.
- **Gestion des Enfants Plus Fine:** Affiner la logique de `RenderDndComponent` pour la gestion des enfants, en s'assurant que seuls les composants de type conteneur peuvent accepter des enfants via Drag & Drop.
- **Persistance des dApps:** Implémenter la sauvegarde et le chargement des `DAppDefinition` via l'API backend (définie conceptuellement en P2-L1-M3).

---
*Ce document reflète l'état de l'implémentation de base du canvas et de la gestion d'état à l'issue des premières étapes de développement de P2-L1.*
