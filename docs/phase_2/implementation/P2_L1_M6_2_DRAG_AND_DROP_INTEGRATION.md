# P2-L1 Implémentation: Intégration Drag & Drop avec @dnd-kit

**Date:** $(date -I)
**Concerne les milestones (Impl):** P2-L1-M6.5, P2-L1-M6.6

## 1. Introduction

Ce document détaille l'implémentation des fonctionnalités de glisser-déposer (Drag & Drop - D&D) dans le Constructeur de dApp de BlockDeploy, en utilisant la librairie `@dnd-kit`. Il couvre à la fois l'ajout de nouveaux composants depuis une palette et le réagencement des composants existants sur le canvas.

## 2. Choix de la Librairie: `@dnd-kit`

- **Justification:** `@dnd-kit` a été choisi (comme envisagé dans la phase d'architecture P2-L1-M3) pour sa modernité, sa légèreté, son accessibilité, sa bonne intégration avec React, et ses performances. Il offre un ensemble complet de hooks et de composants pour construire des expériences D&D complexes.
- **Packages Utilisés:**
    - `@dnd-kit/core`: Pour le contexte D&D (`DndContext`), les capteurs (pointers, keyboard), et la logique de base.
    - `@dnd-kit/utilities`: Pour des utilitaires (non utilisé directement dans cette phase initiale mais souvent utile).
    - *(Note: `@dnd-kit/sortable` pourrait être utilisé plus tard pour des listes réorganisables plus avancées, mais n'est pas strictement nécessaire pour le D&D de base implémenté).*

## 3. Implémentation du Drag & Drop

### 3.1. Contexte Principal D&D (`DndContext`)
- Le composant `CanvasArea.tsx` englobe maintenant la `CanvasDropArea` (la zone de dépôt principale) avec un `<DndContext>`.
- Ce contexte est responsable de la gestion des événements D&D et de la coordination entre les éléments `Draggable` et `Droppable`.
- L'handler principal `onDragEnd` est fourni à `DndContext` pour traiter la fin d'une opération de D&D.

### 3.2. Glisser depuis la Palette (`ComponentPalette.tsx`)
- Chaque item dans la `ComponentPalette` (représenté par `DraggableComponentItem`) utilise le hook `useDraggable` de `@dnd-kit/core`.
- **`id` Draggable:** Un ID unique est généré pour chaque item de la palette (ex: `draggable-palette-item-HEADING`).
- **`data` Associé:** Des informations cruciales sont passées via la propriété `data` de `useDraggable`:
    - `componentType`: Le `DndComponentType` de l'item.
    - `componentName`: Le nom lisible de l'item.
    - `isPaletteItem: true`: Un booléen pour identifier que l'élément glissé provient de la palette.
- **Retour Visuel:** Le style de `DraggableComponentItem` est mis à jour pendant le glissement (via `transform`) pour donner un retour visuel à l'utilisateur.

### 3.3. Déposer sur le Canvas (`CanvasArea.tsx` - `CanvasDropArea`)
- Le composant interne `CanvasDropArea` utilise le hook `useDroppable`.
- **`id` Droppable:** Un ID unique `canvas-drop-area` est assigné à la zone principale du canvas.
- **Retour Visuel:** La bordure de `CanvasDropArea` change lorsque'un élément draggable est survolé (`isOver` de `useDroppable`), avec une distinction visuelle si l'élément provient de la palette ou du canvas lui-même.

### 3.4. Rendre les Composants du Canvas Draggables (`CanvasArea.tsx` - `RenderDndComponent`)
- Chaque composant rendu sur le canvas via `RenderDndComponent` est lui-même rendu draggable en utilisant `useDraggable`.
- **`id` Draggable:** L'ID unique du `DndComponent` lui-même (`component.id`).
- **`data` Associé:**
    - `componentId`: L'ID du composant.
    - `isCanvasItem: true`: Un booléen pour identifier que l'élément glissé est un composant existant du canvas.
    - `componentData`: L'objet `DndComponent` complet, utile pour les overlays de glissement ou des logiques plus avancées.
- **Retour Visuel:** Opacité réduite et transformation appliquée pendant le glissement.

### 3.5. Logique `handleDragEnd` dans `CanvasArea.tsx`
Cette fonction centrale gère les deux cas principaux :

1.  **Ajout d'un Nouveau Composant (depuis la Palette):**
    - Condition: `over.id === 'canvas-drop-area' && active.data.current?.isPaletteItem`.
    - Actions:
        - Extrait `componentType` et `componentName` depuis `active.data.current`.
        - Génère un nouvel objet `DndComponent` avec un ID unique (via `generateId()`), le type, un nom dérivé, et des propriétés par défaut basées sur le type. Les conteneurs (`DndComponentType.Container`) sont initialisés avec un tableau `children` vide.
        - Appelle l'action `addComponent(activePageId, newComponent)` du `builderStore` pour ajouter le composant à la page active (actuellement à la racine/fin de la liste des composants de la page).

2.  **Réagencement d'un Composant Existant sur le Canvas:**
    - Condition: `active.data.current?.isCanvasItem && over`.
    - Actions:
        - Extrait `activeId` (ID du composant glissé) et `overId` (ID de la zone/composant de destination).
        - Si `over.id` est `canvas-drop-area` (fond du canvas), `overId` est traité comme `null` pour l'action du store, signifiant un déplacement à la fin de la liste.
        - Appelle l'action `reorderComponents(activePageId, activeId, overId)` du `builderStore`.
        - La logique actuelle de `reorderComponents` dans le store gère un réagencement simple au niveau racine de la page.

## 4. État Actuel et Limitations

- **Fonctionnel pour le MVP de base:**
    - Ajout de nouveaux composants depuis la palette vers la fin de la liste sur le canvas.
    - Réagencement simple des composants existants au niveau racine du canvas (déplacement avant un autre composant ou à la fin).
- **Limitations / Prochaines Étapes pour D&D:**
    - **Pas de "Drag Overlay" personnalisé:** Actuellement, c'est l'élément source lui-même qui est visuellement déplacé. `@dnd-kit` permet de rendre un "overlay" personnalisé pendant le glissement pour une meilleure UX.
    - **Réagencement Fin / Insertion Précise:** Pour insérer un composant *entre* deux autres existants, ou au début de la liste de manière précise, il faudrait que chaque `RenderDndComponent` (ou des zones spécifiques entre eux) soit aussi une `Droppable`. La logique de `handleDragEnd` et de `reorderComponents` devrait alors calculer des index d'insertion plus précis.
    - **Glisser-Déposer dans des Conteneurs (Nesting):** Pour déposer un composant *à l'intérieur* d'un `ContainerComponent`, le `ContainerComponent` lui-même (ou une zone interne) devrait être `Droppable`. La logique de `addComponent` et `reorderComponents` dans le store devrait être étendue pour gérer les hiérarchies de composants (cibler le tableau `children` du parent correct).
    - **Capteurs (Sensors):** Utilisation basique des capteurs par défaut. Des capteurs plus fins (ex: `KeyboardSensor` pour l'accessibilité) peuvent être ajoutés.
    - **Stratégies de Collision:** `@dnd-kit` offre différentes stratégies de détection de collision qui pourraient être explorées pour affiner la détection du `overId`.

## 5. Conclusion

L'intégration de `@dnd-kit` fournit une fondation solide pour les interactions de glisser-déposer. Les fonctionnalités actuelles couvrent les besoins de base pour l'ajout et le réagencement simple. Les limitations identifiées ouvrent la voie à des améliorations futures pour une expérience utilisateur plus riche et plus précise.

---
*Ce document reflète l'état de l'implémentation du Drag & Drop à l'issue des premières étapes de développement de P2-L1.*
