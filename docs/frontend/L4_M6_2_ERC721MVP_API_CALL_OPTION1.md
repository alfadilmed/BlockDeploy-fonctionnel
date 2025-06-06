## L4-M6.2: Logique Frontend pour Appel API Déploiement NFT ERC-721 (Option 1)

**Objectif:** Décrire la logique client (React/TypeScript) pour collecter, formater, envoyer les données du formulaire NFT ERC-721 (Option 1: URL Métadonnées Externe) à l'API, et gérer la réponse.

### 1. État du Composant Formulaire (React State)
```typescript
// interface ERC721MVPFormState {
//   userGivenName: string;
//   networkName: string;
//   collectionConfig: {
//     name: string;
//     symbol: string;
//     baseTokenURI: string;
//     royalties: { receiver: string; fractionBps: string; /* ou percentage: string */ };
//     features: { pausable: boolean; };
//     initialOwner?: string;
//   };
//   isLoading: boolean; formError: string | null; fieldErrors: Record<string, string | undefined>;
// }
```

### 2. Collecte et Formatage des Données
*   `onChange` met à jour l'état.
*   Validation Frontend: Champs requis, format `baseTokenURI` (finir par `/`), adresses Ethereum, `fractionBps` (ou % royalties) valide.

### 3. Soumission du Formulaire (`handleSubmit`)
```typescript
// const handleSubmit = async (event: React.FormEvent) => {
//   // event.preventDefault(); setIsLoading true, reset errors;

//   // 1. Validation frontend

//   // 2. Construire payload API pour POST /api/v1/deploy/nft-erc721-mvp
//   // const royaltyFractionBpsNumber = parseInt(formState.collectionConfig.royalties.fractionBps, 10);
//   // const apiPayload = { networkName, userGivenName, collectionConfig: { ..., royalties: { receiver, fractionBps: royaltyFractionBpsNumber }, ... } };

//   try {
//     // 3. Appel API (fetch / axios)
//     // const response = await fetch('/api/v1/deploy/nft-erc721-mvp', { method: 'POST', ..., body: JSON.stringify(apiPayload) });
//     // if (!response.ok) { /* Gérer erreurs API */ return; }

//     // 4. Gestion Réponse Succès (202 Accepted)
//     // toast.success("Déploiement NFT en file d'attente ! ID: ...");
//     // Gérer redirection/màj UI.
//   } catch (error) { /* Gérer erreurs réseau */ }
// };
```

### 4. Gestion de l'État et Feedback Utilisateur
*   `isLoading`, `formError`, `fieldErrors` pour feedback direct.
*   Notifications (Toast) pour succès/erreurs.
*   Section Récapitulatif/Preview dans le formulaire.
*   Feedback Post-Soumission: Message "en cours", suivi statut (polling/WebSockets), affichage résultat final (adresse contrat, lien explorateur).

### 5. Points Particuliers pour NFT ERC-721 (Option 1)
*   **`baseTokenURI`:** UI doit insister sur format correct (finissant par `/`) et lier vers guide préparation métadonnées IPFS.
*   **Royalties:** UI doit être claire sur % vs BPS.
