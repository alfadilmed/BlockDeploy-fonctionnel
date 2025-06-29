# Devlog - Phase 2 / Lot 1: Constructeur de dApp Front-End - Fondations

**Période:** À partir du 2024-07-28 (Date de début simulée pour P2-L1)

## Objectifs du Lot:
- Définir l'architecture, les fonctionnalités clés MVP, et l'expérience utilisateur pour un constructeur de dApp frontend "Drag & Drop".
- Mettre en place les bases techniques et la documentation initiale pour son développement.
- Implémenter les premières fonctionnalités de base (rendu dynamique, D&D, import/export, chargement d'exemple).

---
## Planification Conceptuelle P2-L1

**(Template d'entrée pour cette section)**
```
**Milestone P2-L1-MX: [Nom de la Milestone Conceptuelle]**
- Date: YYYY-MM-DD
- Avancement: Terminé
- Description des Actions: ...
- Livrables / Fichiers Créés ou Modifiés: ...
- Notes / Décisions: ...
```

---

**Milestone P2-L1-M1: Étude de Marché et Analyse Comparative (Conceptuel)**
- Date: 2024-07-28
- Avancement: Terminé
- Description des Actions:
    - Création du document de synthèse de l'étude de marché et d'analyse comparative.
    - Structuration du document avec les sections clés : introduction, acteurs du marché (traditionnels et Web3), fonctionnalités attendues, modèles économiques, opportunités pour BlockDeploy, et conclusion.
    - Remplissage simulé du contenu pour illustrer le type d'informations à collecter.
    - Mise à jour du document de planification `P2_L1_DAPP_BUILDER_FOUNDATIONS.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - `docs/phase_2/research/P2_L1_M1_DAPP_BUILDER_MARKET_ANALYSIS.md` (créé)
    - `docs/phase_2/P2_L1_DAPP_BUILDER_FOUNDATIONS.md` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - L'étude est conceptuelle. Une recherche approfondie réelle serait nécessaire.

---

**Milestone P2-L1-M2: Définition du Périmètre MVP pour le Constructeur de dApp (Conceptuel)**
- Date: 2024-07-28
- Avancement: Terminé
- Description des Actions:
    - Création du document de définition du périmètre MVP.
    - Identification des objectifs MVP, cas d'usage, composants D&D, gestion des contrats, publication, et exclusions.
    - Mise à jour du document de planification `P2_L1_DAPP_BUILDER_FOUNDATIONS.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - `docs/phase_2/specs/P2_L1_M2_DAPP_BUILDER_MVP_SCOPE.md` (créé)
    - `docs/phase_2/P2_L1_DAPP_BUILDER_FOUNDATIONS.md` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Périmètre MVP conçu pour être une base fonctionnelle et itérable.

---

**Milestone P2-L1-M3: Conception Architecturale (Conceptuel)**
- Date: 2024-07-28
- Avancement: Terminé
- Description des Actions:
    - Création du document de conception architecturale.
    - Proposition d'architecture frontend (React, @dnd-kit, Zustand), dApps générées (SPA), backend optionnel.
    - Mise à jour du document de planification `P2_L1_DAPP_BUILDER_FOUNDATIONS.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - `docs/phase_2/architecture/P2_L1_M3_DAPP_BUILDER_ARCHITECTURE.md` (créé)
    - `docs/phase_2/P2_L1_DAPP_BUILDER_FOUNDATIONS.md` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Architecture visant simplicité MVP et évolutivité. PoC utiles pour valider choix.

---

**Milestone P2-L1-M4: Conception UI/UX Détaillée du Constructeur (Conceptuel)**
- Date: 2024-07-28
- Avancement: Terminé
- Description des Actions:
    - Création du document de conception UI/UX détaillé.
    - Définition principes UX, structure interface (header, palette, canvas, propriétés), parcours utilisateurs, wireframes ASCII.
    - Mise à jour du document de planification `P2_L1_DAPP_BUILDER_FOUNDATIONS.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - `docs/phase_2/ui_ux/P2_L1_M4_DAPP_BUILDER_UI_UX.md` (créé)
    - `docs/phase_2/P2_L1_DAPP_BUILDER_FOUNDATIONS.md` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Conception UI/UX vise une base intuitive pour MVP.

---

**Milestone P2-L1-M5: Initialisation Technique du Projet Frontend (Conceptuel)**
- Date: 2024-07-28
- Avancement: Terminé
- Description des Actions:
    - Description des étapes conceptuelles d'initialisation technique du module frontend.
    - Choix d'intégration dans frontend existant, structure de dossiers, dépendances, config initiale, placeholders composants.
    - Mise à jour du document de planification `P2_L1_DAPP_BUILDER_FOUNDATIONS.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - `docs/phase_2/P2_L1_DAPP_BUILDER_FOUNDATIONS.md` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Milestone purement conceptuelle pour la planification de P2-L1.

---

**Milestone P2-L1-M6: Documentation Initiale et Planification P2-L2 (Conceptuel)**
- Date: 2024-07-28
- Avancement: Terminé
- Description des Actions:
    - Description des étapes pour finaliser la documentation P2-L1 et préparer P2-L2.
    - Planification de la complétion des sections générales du document de planification P2-L1.
    - Mise à jour du document de planification `P2_L1_DAPP_BUILDER_FOUNDATIONS.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - `docs/phase_2/P2_L1_DAPP_BUILDER_FOUNDATIONS.md` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Fin de la phase de conception et planification détaillée pour P2-L1.

---
## Implémentation Technique P2-L1 (Alpha) - Entrées Corrigées

**(Template d'entrée pour cette section)**
```
**Milestone P2-L1-IX: [Nom de la Milestone d'Implémentation]**
- Date: YYYY-MM-DD
- Avancement: Terminé
- Description des Actions: ...
- Livrables / Fichiers Créés ou Modifiés: ...
- Notes / Décisions: ...
```
---

**Milestone P2-L1-I1: Création de la Structure de Dossiers de Base**
- Date: 2024-07-29
- Avancement: Terminé
- Description des Actions:
    - Simulation de la création de la structure de dossiers pour `src/modules/dapp-builder/` et ses sous-répertoires (`core`, `components`, `editor-ui`, `state`, `types`) via fichiers `README.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/README.md` (créé) et READMEs dans les sous-dossiers (créés)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Structure conforme à P2-L1-M5.

---

**Milestone P2-L1-I2: Définition des Interfaces TypeScript de Base**
- Date: 2024-07-29
- Avancement: Terminé
- Description des Actions:
    - Création de `src/modules/dapp-builder/types/index.ts` avec interfaces `DndComponentType`, `DndComponent`, `DAppPage`, `DAppDefinition`, `BuilderState`, et exemples de props.
    - Suppression de `src/modules/dapp-builder/types/README.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/types/index.ts` (créé)
    - `src/modules/dapp-builder/types/README.md` (supprimé)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Interfaces de base pour la structure de données du builder.

---

**Milestone P2-L1-I3: Initialisation du Store d'État (Zustand)**
- Date: 2024-07-29
- Avancement: Terminé
- Description des Actions:
    - Création de `src/modules/dapp-builder/state/builderStore.ts` avec un store Zustand (`useBuilderStore`) gérant `currentDApp`, `activePageId`, `selectedComponentId`, `isSaving`.
    - Actions initiales: `setCurrentDApp`, `setActivePage`, `addComponent`, `updateComponentProperties`, `setSelectedComponent`.
    - Ajout de `initializeDemoDApp`.
    - Suppression de `src/modules/dapp-builder/state/README.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/state/builderStore.ts` (créé)
    - `src/modules/dapp-builder/state/README.md` (supprimé)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Store comme source de vérité pour l'éditeur.

---

**Milestone P2-L1-I4: Création des Composants "Placeholder" pour l'UI du Builder**
- Date: 2024-07-29
- Avancement: Terminé
- Description des Actions:
    - Création des squelettes pour `MainEditorLayout.tsx`, `ComponentPalette.tsx`, `CanvasArea.tsx`, `PropertiesPanel.tsx` dans `src/modules/dapp-builder/editor-ui/`.
    - Suppression de `src/modules/dapp-builder/editor-ui/README.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - Fichiers `.tsx` des composants listés (créés)
    - `src/modules/dapp-builder/editor-ui/README.md` (supprimé)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Placeholders fonctionnels basiques. Style minimal.

---

**Milestone P2-L1-I5: Description de la Mise en Place du Routing de Base (Conceptuel)**
- Date: 2024-07-29
- Avancement: Terminé
- Description des Actions:
    - Création de `docs/phase_2/implementation/P2_L1_M5_5_DAPP_BUILDER_ROUTING_SETUP.md` décrivant l'intégration du routing pour le builder.
- Livrables / Fichiers Créés ou Modifiés:
    - `docs/phase_2/implementation/P2_L1_M5_5_DAPP_BUILDER_ROUTING_SETUP.md` (créé)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Implémentation effective du routing différée.

---

**Milestone P2-L1-I6: Amélioration de `CanvasArea.tsx` pour Rendu Dynamique**
- Date: 2024-07-30
- Avancement: Terminé
- Description des Actions:
    - Modification de `CanvasArea.tsx` : ajout d'un `componentRegistry`, `RenderDndComponent` utilise ce registry, gestion récursive des enfants (pour `ContainerComponent`), initialisation avec `initializeDemoDApp`.
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/editor-ui/CanvasArea.tsx` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Canvas affiche une structure de dApp simple depuis le store.

---

**Milestone P2-L1-I7: Création des Composants "Drag & Drop" de Base**
- Date: 2024-07-30
- Avancement: Terminé
- Description des Actions:
    - Création de `HeadingComponent.tsx`, `TextComponent.tsx`, `ConnectWalletButtonComponent.tsx`, `ContainerComponent.tsx` dans `src/modules/dapp-builder/components/`.
    - Mise à jour de `componentRegistry` dans `CanvasArea.tsx` pour les utiliser.
    - Suppression de `src/modules/dapp-builder/components/README.md`.
- Livrables / Fichiers Créés ou Modifiés:
    - Fichiers `.tsx` des composants listés (créés)
    - `src/modules/dapp-builder/editor-ui/CanvasArea.tsx` (mis à jour)
    - `src/modules/dapp-builder/components/README.md` (supprimé)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Premiers composants réels, basiques.

---

**Milestone P2-L1-I8: Affinement de `PropertiesPanel.tsx` et Interaction Store**
- Date: 2024-07-30
- Avancement: Terminé
- Description des Actions:
    - Modification de `PropertiesPanel.tsx` pour éditeurs de propriétés spécifiques (Heading, Text, ConnectWalletButton, Container).
    - Modification appelle `updateComponentProperties` du store, reflété dans `CanvasArea`.
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/editor-ui/PropertiesPanel.tsx` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Panneau de propriétés plus interactif.

---

**Milestone P2-L1-I9: Documentation des Choix d'Implémentation (Rendu et État)**
- Date: 2024-07-30
- Avancement: Terminé
- Description des Actions:
    - Création de `docs/phase_2/implementation/P2_L1_M6_1_CANVAS_RENDERING_AND_STATE.md` résumant les choix pour le rendu dynamique du canvas et la gestion de l'état.
- Livrables / Fichiers Créés ou Modifiés:
    - `docs/phase_2/implementation/P2_L1_M6_1_CANVAS_RENDERING_AND_STATE.md` (créé)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Documentation pour capitaliser sur les implémentations initiales.

---

**Milestone P2-L1-I10: Intégration Drag & Drop de Base avec @dnd-kit**
- Date: 2024-07-31
- Avancement: Terminé
- Description des Actions:
    - Intégration de `@dnd-kit/core` dans `ComponentPalette.tsx` (items draggables) et `CanvasArea.tsx` (`DndContext`, `useDroppable`, `handleDragEnd` pour ajout depuis palette).
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/editor-ui/ComponentPalette.tsx` (mis à jour)
    - `src/modules/dapp-builder/editor-ui/CanvasArea.tsx` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Glisser-déposer de nouveaux composants fonctionnel.

---

**Milestone P2-L1-I11: Réagencement des Composants sur le Canvas via Drag & Drop**
- Date: 2024-07-31
- Avancement: Terminé
- Description des Actions:
    - `builderStore.ts`: Ajout de l'action `reorderComponents`.
    - `CanvasArea.tsx`: `RenderDndComponent` rendu draggable, `handleDragEnd` étendu pour réagencement.
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/state/builderStore.ts` (mis à jour)
    - `src/modules/dapp-builder/editor-ui/CanvasArea.tsx` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Réagencement de base au premier niveau fonctionnel. Imbrication D&D pour plus tard.

---

**Milestone P2-L1-I12: Documentation de l'Intégration Drag & Drop**
- Date: 2024-07-31
- Avancement: Terminé
- Description des Actions:
    - Création de `docs/phase_2/implementation/P2_L1_M6_2_DRAG_AND_DROP_INTEGRATION.md` détaillant l'implémentation D&D avec `@dnd-kit`.
- Livrables / Fichiers Créés ou Modifiés:
    - `docs/phase_2/implementation/P2_L1_M6_2_DRAG_AND_DROP_INTEGRATION.md` (créé)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Référence technique pour D&D.

---

**Milestone P2-L1-I13: Implémentation de la Sauvegarde/Export JSON de `DAppDefinition`**
- Date: 2024-08-01
- Avancement: Terminé
- Description des Actions:
    - Modification de `MainEditorLayout.tsx` pour ajouter bouton "Export JSON" et logique `handleExportJson` (sérialisation `currentDApp` et téléchargement).
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/editor-ui/MainEditorLayout.tsx` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Permet sauvegarde manuelle et partage.

---

**Milestone P2-L1-I14: Implémentation du Chargement/Import JSON de `DAppDefinition`**
- Date: 2024-08-01
- Avancement: Terminé
- Description des Actions:
    - Modification de `MainEditorLayout.tsx` pour ajouter bouton "Import JSON", input fichier caché, et logique `handleFileChange` (lecture, parsing, validation basique, `setCurrentDApp`).
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/editor-ui/MainEditorLayout.tsx` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Validation du JSON importé est basique.

---

**Milestone P2-L1-I15: Documentation des Fonctionnalités d'Import/Export JSON**
- Date: 2024-08-01
- Avancement: Terminé
- Description des Actions:
    - Mise à jour de `docs/phase_2/implementation/P2_L1_M7_3_IMPORT_EXPORT_JSON.md` (créé précédemment mais peut-être sous un autre nom, ou à créer si manquant) pour documenter l'import/export.
- Livrables / Fichiers Créés ou Modifiés:
    - `docs/phase_2/implementation/P2_L1_M7_3_IMPORT_EXPORT_JSON.md` (mis à jour/créé)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Documentation centralisée pour import/export.

---

**Milestone P2-L1-I16: Ajout du Bouton "Charger Exemple"**
- Date: 2024-08-01
- Avancement: Terminé
- Description des Actions:
    - Modification de `MainEditorLayout.tsx` pour ajouter bouton "Load Demo" et logique `handleLoadDemo` appelant `initializeDemoDApp`.
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/editor-ui/MainEditorLayout.tsx` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Facilite tests et démos.

---

**Milestone P2-L1-I17: Affinement de la `DAppDefinition` d'Exemple**
- Date: 2024-08-01
- Avancement: Terminé
- Description des Actions:
    - Modification de `initializeDemoDApp` dans `builderStore.ts` pour une démo plus riche (container, composants imbriqués, propriétés spécifiques).
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/state/builderStore.ts` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Démo plus représentative.

---
**Milestone P2-L1-I18: Correction et Finalisation du Devlog pour P2-L1**
- Date: $(date --iso-8601=seconds)
- Avancement: Terminé
- Description des Actions:
    - Relecture complète du `devlog/LOT_P2_L1_LOG.md`.
    - Correction des numérotations de milestones pour les étapes d'implémentation (passage à P2-L1-IX).
    - Suppression des entrées dupliquées.
    - Harmonisation des dates pour les entrées passées (simulation).
    - Vérification de la cohérence des descriptions et des livrables listés.
- Livrables / Fichiers Créés ou Modifiés:
    - `devlog/LOT_P2_L1_LOG.md` (mis à jour)
- Notes / Décisions:
    - Le devlog est maintenant nettoyé et reflète plus fidèlement la progression des étapes de planification et d'implémentation de base pour P2-L1.

**Milestone P2-L1-M7.5 (Impl): Ajout du Bouton "Charger Exemple"**
- Date: $(date --iso-8601=seconds)
- Avancement: Terminé
- Description des Actions:
    - Modification de `src/modules/dapp-builder/editor-ui/MainEditorLayout.tsx`.
    - Ajout d'un bouton "Load Demo" dans la section `EditorHeader`.
    - Implémentation de la fonction `handleLoadDemo` :
        - Demande une confirmation à l'utilisateur si une dApp est déjà chargée, pour éviter un écrasement accidentel.
        - Appelle la fonction `initializeDemoDApp` (importée depuis `builderStore.ts`) qui utilise `setCurrentDApp` pour charger les données de la dApp d'exemple dans le store.
        - Affiche une alerte pour confirmer le chargement de la démo.
- Livrables / Fichiers Créés ou Modifiés:
    - `src/modules/dapp-builder/editor-ui/MainEditorLayout.tsx` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Les utilisateurs peuvent maintenant facilement charger une configuration de dApp d'exemple.
    - Cela est utile pour les tests, les démonstrations et pour que les nouveaux utilisateurs découvrent rapidement les capacités du builder.
    - La dApp d'exemple elle-même (`initializeDemoDApp` dans le store) sera revue à la prochaine étape pour s'assurer qu'elle est pertinente.

---

**Milestone P2-L1-I19: Migration vers Next.js App Router et Nettoyage**
- Date: 2024-08-02
- Avancement: Terminé
- Description des Actions:
    - Suppression de l'ancienne structure de routage basées sur Vite et `react-router-dom` (fichiers `pages/`, `App.tsx`, `index.tsx`, `vite.config.ts`, `index.html`). Les fichiers obsolètes ont été déplacés vers `legacy/`.
    - Mise en place de la structure App Router de Next.js :
        - Création de `app/layout.tsx` et `app/globals.css`.
        - Création de `app/page.tsx` (page d'accueil).
        - Création de `app/dapp-builder/[slug]/page.tsx` pour le constructeur de dApp.
    - Intégration de `MainEditorLayout.tsx` dans `app/dapp-builder/[slug]/page.tsx`:
        - Ajout de la directive `"use client"` à `MainEditorLayout.tsx` et à ses composants enfants si nécessaire (implicite pour les placeholders).
        - Passage de `initialSlug` comme prop.
        - Ajout de `data-testid="builder-canvas"` au composant `CanvasArea` dans `MainEditorLayout.tsx` pour les tests E2E.
    - Mise à jour de `package.json`:
        - Suppression de `vite` et `react-router-dom`.
        - Ajout de `next`, `eslint`, `eslint-config-next`.
        - Mise à jour des scripts (`dev`, `build`, `start`, `lint`).
        - Ajout de `zustand` comme dépendance (utilisé par `builderStore`).
        - Ajustement des versions de React (passage à la v18, compatible avec Next.js 14) et des dépendances `@types/*`.
- Livrables / Fichiers Créés ou Modifiés:
    - `app/layout.tsx` (créé)
    - `app/globals.css` (créé)
    - `app/page.tsx` (créé)
    - `app/dapp-builder/[slug]/page.tsx` (créé)
    - `src/modules/dapp-builder/editor-ui/MainEditorLayout.tsx` (mis à jour)
    - `package.json` (mis à jour)
    - `legacy/` (dossier créé avec fichiers App.tsx, index.tsx, vite.config.ts, index.html)
    - `pages/` (supprimé)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Le frontend est maintenant structuré selon les conventions de Next.js App Router.
    - Nécessite `npm install` pour mettre à jour les dépendances.

---

**Milestone P2-L1-I20: Ajout Test E2E Cypress pour le dApp Builder**
- Date: 2024-08-02
- Avancement: Terminé
- Description des Actions:
    - Création du fichier de test `cypress/e2e/dappBuilder.cy.ts` vérifiant que la page `/dapp-builder/default` charge et affiche l'élément avec `data-testid="builder-canvas"`.
    - Création d'un fichier de configuration Cypress de base `cypress.config.ts` avec `baseUrl: 'http://localhost:3000'`.
    - Ajout de `cypress` aux `devDependencies` dans `package.json`.
    - Ajout du script npm `cy:test` (`cypress run --browser chrome`) dans `package.json`.
- Livrables / Fichiers Créés ou Modifiés:
    - `cypress/e2e/dappBuilder.cy.ts` (créé)
    - `cypress.config.ts` (créé)
    - `package.json` (mis à jour)
    - `devlog/LOT_P2_L1_LOG.md` (mise à jour)
- Notes / Décisions:
    - Le test E2E de base valide le rendu initial du canvas du builder.
    - Nécessite `npm install` pour installer Cypress.

*(Les entrées de log seront ajoutées ici au fur et à mesure de l'avancement)*
