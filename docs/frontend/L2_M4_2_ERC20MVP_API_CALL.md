## L2-M4.2: Logique Frontend pour l'Appel API de Déploiement ERC-20 MVP

**Objectif:** Décrire la logique client (React/TypeScript) pour collecter, formater, et envoyer les données du formulaire ERC-20 MVP à l'API backend, et gérer la réponse.

### 1. État du Composant Formulaire (React State)
Le composant maintiendra un état pour tous les champs configurables (`userGivenName`, `networkName`, `tokenConfig` et ses sous-champs), ainsi que des états pour `isLoading`, `formError`, `fieldErrors`.
```typescript
// interface ERC20MVPFormState {
//   userGivenName: string;
//   networkName: string;
//   tokenConfig: {
//     name: string;
//     symbol: string;
//     supplyType: "fixed" | "capped";
//     initialSupply: string;
//     cap: string;
//     features: { burnable: boolean; pausable: boolean; };
//   };
//   isLoading: boolean;
//   formError: string | null;
//   fieldErrors: Record<string, string | undefined>;
// }
```

### 2. Collecte et Formatage des Données
*   `onChange` des inputs met à jour l'état.
*   Validation frontend avant soumission (champs requis, formats, logique métier comme `cap >= initialSupply`). Met à jour `fieldErrors`.

### 3. Soumission du Formulaire (`handleSubmit`)
```typescript
// const handleSubmit = async (event: React.FormEvent) => {
//   event.preventDefault();
//   // Mettre isLoading à true, réinitialiser les erreurs

//   // 1. Validation frontend
//   // Si erreurs, mettre à jour fieldErrors, isLoading à false, return

//   // 2. Construire le payload API (correspond à POST /api/v1/deploy/erc20-mvp)
//   // const apiPayload = { networkName, userGivenName, tokenConfig: { ... } };
//   // S'assurer que initialSupply et cap sont des strings. `cap` est optionnel si supplyType != 'capped'.

//   try {
//     // 3. Appel API (fetch ou axios)
//     // const response = await fetch('/api/v1/deploy/erc20-mvp', { method: 'POST', ...body: JSON.stringify(apiPayload) });
//     // const responseData = await response.json();

//     // if (!response.ok) {
//     //   // Gérer erreurs API (4xx, 5xx), mettre à jour formError/fieldErrors
//     //   return;
//     // }

//     // 4. Gestion Réponse Succès (202 Accepted)
//     // isLoading à false
//     // Afficher Toast de succès (ex: "Déploiement mis en file d'attente ! ID: X")
//     // Rediriger ou mettre à jour UI pour indiquer le suivi.
//   } catch (error) {
//     // Gérer erreurs réseau, mettre à jour formError
//   }
// };
```

### 4. Gestion de l'État et Feedback Utilisateur
*   `isLoading`: Désactive bouton soumission, affiche `Spinner`.
*   `formError`: Affiche erreurs générales (via `Alert`).
*   `fieldErrors`: Affiche erreurs par champ.
*   Notifications (Toast) pour succès/erreurs non bloquantes.
*   Preview du Token (Section Récapitulative): Mise à jour dynamique pendant la saisie.

### 5. Considérations
*   **Authentification:** L'appel API doit être authentifié (ex: interceptor Axios).
*   **Variables d'Environnement Frontend:** Pour URL de base API si nécessaire.
*   **Validation Backend:** Reste la source de vérité.

Cette logique fournit une base pour l'interaction frontend avec l'API de déploiement ERC-20 MVP.
