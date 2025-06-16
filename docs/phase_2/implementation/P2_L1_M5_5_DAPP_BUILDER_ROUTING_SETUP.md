# P2-L1-M5.5: Mise en Place du Routing pour le Constructeur de dApp

**Date:** $(date -I)

## 1. Objectif

Ce document décrit les étapes conceptuelles pour intégrer le module du constructeur de dApp (`dapp-builder`) dans le système de navigation de l'application principale BlockDeploy.

## 2. Identification du Fichier de Routing Principal

Il est supposé que l'application BlockDeploy utilise `react-router-dom` pour la gestion de ses routes. Le fichier principal de configuration des routes pourrait être l'un des suivants (ou un équivalent) :
- `src/App.tsx`
- `src/routes.tsx`
- `src/router/index.tsx`

## 3. Ajout de la Nouvelle Route

Pour rendre le constructeur de dApp accessible, une nouvelle route doit y être ajoutée.

### 3.1. Exemple de Route

Nous proposons d'ajouter une route qui pourrait potentiellement prendre un `projectId` comme paramètre, bien que pour le MVP initial, le `projectId` pourrait ne pas être immédiatement utilisé si nous travaillons sur un seul projet de dApp à la fois stocké dans le store Zustand.

```typescriptreact
// Exemple de code à ajouter dans le fichier de routing principal

import MainEditorLayout from './modules/dapp-builder/editor-ui/MainEditorLayout'; // Ajuster le chemin d'import

// ... autres imports de routes et composants

// À l'intérieur du composant <Routes> ou de la configuration des routes :

// Option 1: Route simple
// <Route path="/dapp-builder" element={<MainEditorLayout />} />

// Option 2: Route avec un projectId (plus flexible pour l'avenir)
// <Route path="/dapp-builder/:projectId" element={<MainEditorLayout />} />
// Dans ce cas, MainEditorLayout devrait être capable de récupérer projectId via useParams()
// et potentiellement charger les données du projet correspondant.
// Pour le MVP initial, on pourrait rediriger vers /dapp-builder/default ou gérer un état par défaut.

// Option 3: Route imbriquée si le dApp builder fait partie d'une section plus large
// <Route path="/dashboard" element={<DashboardLayout />}>
//   {/* ... autres routes du dashboard */}
//   <Route path="dapp-builder" element={<MainEditorLayout />} />
//   <Route path="dapp-builder/:projectId" element={<MainEditorLayout />} />
// </Route>
```

### 3.2. Considérations

- **Lazy Loading:** Pour optimiser le chargement initial de l'application, le composant `MainEditorLayout` et potentiellement tout le module `dapp-builder` pourraient être chargés en utilisant `React.lazy()` et `Suspense`.
  ```typescriptreact
  // const DAppBuilder = React.lazy(() => import('./modules/dapp-builder/editor-ui/MainEditorLayout'));
  // <Route path="/dapp-builder/:projectId" element={<React.Suspense fallback={<>Loading Builder...</>}><DAppBuilder /></React.Suspense>} />
  ```
- **Protection de Route:** Si l'accès au constructeur de dApp nécessite que l'utilisateur soit authentifié (ce qui est probable), la route devra être protégée par un composant `ProtectedRoute` ou une logique similaire, en s'assurant que l'utilisateur est redirigé vers la page de connexion s'il n'est pas authentifié.

## 4. Navigation vers le Constructeur de dApp

Des liens vers le constructeur de dApp devront être ajoutés dans l'interface utilisateur principale, par exemple :
- Dans la barre de navigation principale.
- Depuis une section "Mes Projets dApp" sur le tableau de bord utilisateur.

## 5. Prochaines Étapes d'Implémentation (Hors de ce document)

- Modifier effectivement le fichier de routing de l'application.
- Ajouter les liens de navigation.
- Tester l'accès à la nouvelle route et l'affichage du `MainEditorLayout`.

---
*Ce document décrit les modifications conceptuelles. L'implémentation réelle nécessitera une adaptation au code existant de l'application BlockDeploy.*
