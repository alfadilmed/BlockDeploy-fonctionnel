## Lot 5 Log - $(date --iso-8601=seconds)

**L5-M1.1: Identifier les Données à Afficher et les Contrats Cibles**
- Date: $(date --iso-8601=seconds)
- Avancement: Terminé.
- Décisions & Clarifications:
  - **ERC-20 (`ERC20MVP`, `ERC20Advanced`):**
    - Données confirmées: `name()`, `symbol()`, `decimals()`, `totalSupply()`, `paused()` (si applicable), `cap()` (si applicable).
    - Les fonctions sont disponibles dans les contrats types.
  - **ERC-721 (`ERC721MVP`):**
    - Données confirmées: `name()`, `symbol()`.
    - `totalSupply()`: Non disponible directement via une fonction `view` dans `ERC721MVP.sol` car il n'utilise pas `ERC721Enumerable`. Sera omis pour L5-M1 sauf si une source de données off-chain fiable (DB BlockDeploy) est disponible et simple à intégrer.
    - `royaltyInfo()`: Le contrat supporte EIP-2981. Pour afficher le destinataire et la fraction par défaut sur le dashboard, ces informations devront être récupérées depuis la base de données de BlockDeploy (paramètres de déploiement). L'alternative serait de se contenter d'afficher si l'EIP-2981 est supporté via `supportsInterface(0x2a55205a)`.
  - **ABIs:** Utilisation des ABIs standards d'OpenZeppelin pour les interfaces communes (`ERC20`, `ERC721`, `Pausable`, `Capped`, `EIP2981`) et les ABIs spécifiques de nos contrats pour les fonctions propres si nécessaire.

**L5-M1.2: Backend - Étendre le Service de Contrats pour la Lecture de Données On-Chain**
- Date: 2025-06-06T16:54:23+00:00
- Avancement: Terminé.
- Actions:
  - Création de `ContractQueryService` (`src/services/blockchain/contract-query.service.ts`) pour encapsuler la logique de lecture des données on-chain.
  - Implémentation des méthodes de base: `readContractFunction`, `getName`, `getSymbol`, `getDecimals`, `getTotalSupply`, `isPaused`, `getCap` pour ERC-20.
  - Implémentation des méthodes de base: `getNameERC721`, `getSymbolERC721`, `supportsEIP2981` pour ERC-721.
  - Création d'un placeholder pour `ProviderService` (`src/services/blockchain/provider.service.ts`) s'il n'existait pas, avec une logique de base pour fournir un provider ethers.js.
  - Ajout (provisoire) de `ContractQueryService` et `ProviderService` aux providers de `AppModule` pour permettre l'injection.


**L5-M1.3: Backend - Créer/Modifier un Endpoint API pour Récupérer les Données Enrichies d'un Contrat**
- Date: 2025-06-06T16:56:00+00:00
- Avancement: Terminé.
- Actions:
  - Création de `ContractDetailsController` (`src/modules/contracts/controllers/contract-details.controller.ts`) avec un endpoint GET `/api/v1/contracts/:network/:address/details`.
  - Création de `ContractDetailsResponseDto` pour structurer la réponse.
  - Création d'un placeholder pour `DeploymentDataService` (`src/modules/contracts/services/deployment-data.service.ts`) simulant l'accès à la base de données des déploiements.
  - Le contrôleur utilise `DeploymentDataService` pour les infos DB et `ContractQueryService` pour les données on-chain.
  - Création de `ContractsModule` (`src/modules/contracts/contracts.module.ts`) et import dans `AppModule`.
  - Logique pour déterminer l'URL de l'explorateur de blocs ajoutée.


**L5-M1.4: Frontend - Mettre à Jour l'Interface du Dashboard**
- Date: 2025-06-06T16:57:11+00:00
- Avancement: Planification conceptuelle terminée.
- Actions Prévues (Conceptuelles pour le Frontend):
  - **Service API Frontend:**
    - Ajouter une fonction pour appeler `GET /api/v1/contracts/:network/:address/details`.
  - **Composant de Détail du Contrat (ex: `ContractDetailPage.tsx`):**
    - Gérer un état local pour `contractDetails` (incluant `databaseInfo` et `onChainData`), `isLoading`, et `error`.
    - Utiliser `useEffect` pour appeler l'API au montage/changement des props (`network`, `address`).
    - **Affichage des Données On-Chain (Exemples):**
      - Nom du contrat (lu depuis la blockchain) : `onChainData.name`.
      - Symbole (lu depuis la blockchain) : `onChainData.symbol`.
      - **Pour ERC-20:**
        - Décimales: `onChainData.decimals`.
        - Total Supply: `onChainData.totalSupply` (formatté avec les décimales).
        - En Pause ?: `onChainData.isPaused` (Oui/Non).
        - Plafond (Cap): `onChainData.cap` (formatté, ou 'Non plafonné' si null).
      - **Pour ERC-721:**
        - Supporte EIP2981 (Royalties): `onChainData.supportsEIP2981` (Oui/Non).
        - Destinataire Royalties par Défaut: `databaseInfo.defaultRoyaltyReceiver` (si disponible).
        - Fraction Royalties par Défaut: `databaseInfo.defaultRoyaltyFractionBps` (converti en %, si disponible).
        - (Total Supply ERC-721 est omis pour le moment comme discuté).
    - Afficher un indicateur de chargement pendant la récupération des données.
    - Gérer l'affichage des erreurs si l'appel API échoue.
    - Afficher 'N/A' ou un message approprié si une donnée spécifique n'est pas disponible.
    - Afficher le lien vers l'explorateur de blocs: `contractDetails.blockExplorerUrl`.
  - **Exemple de Code React (Conceptuel):**
    ```typescriptreact
    // Supposons ContractDetailsResponseDto défini côté frontend aussi
    // import { ContractDetailsResponseDto } from 'path/to/dtos';

    // interface ContractDetailPageProps {
    //   network: string;
    //   address: string;
    // }

    // const ContractDetailPage: React.FC<ContractDetailPageProps> = ({ network, address }) => {
    //   const [contractDetails, setContractDetails] = useState<ContractDetailsResponseDto | null>(null);
    //   const [isLoading, setIsLoading] = useState(true);
    //   const [error, setError] = useState<string | null>(null);

    //   useEffect(() => {
    //     const fetchDetails = async () => {
    //       setIsLoading(true);
    //       setError(null);
    //       try {
    //         // Supposons une fonction apiService.getContractDetails(network, address)
    //         // const data = await apiService.getContractDetails(network, address);
    //         // setContractDetails(data);
    //         // MOCK DATA pour l'exemple:
    //         setContractDetails({
    //           databaseInfo: { deploymentId: '1', userId: 'user-123', userGivenName: 'My Mock Token', contractType: 'ERC20Advanced', deployedAt: '2023-01-01', network, address, isPausable: true, isCapped: true },
    //           onChainData: { name: 'Mock Token', symbol: 'MCK', decimals: 18, totalSupply: '1000000', isPaused: false, cap: '2000000' },
    //           blockExplorerUrl: `https://sepolia.etherscan.io/address/${address}`
    //         });
    //       } catch (e: any) {
    //         setError(e.message || 'Failed to fetch contract details');
    //       }
    //       setIsLoading(false);
    //     };
    //     if (network && address) fetchDetails();
    //   }, [network, address]);

    //   if (isLoading) return <p>Loading contract details...</p>;
    //   if (error) return <p>Error: {error}</p>;
    //   if (!contractDetails) return <p>No contract details found.</p>;

    //   const { databaseInfo, onChainData, blockExplorerUrl } = contractDetails;

    //   return (
    //     <div>
    //       <h1>{databaseInfo.userGivenName} ({onChainData.symbol})</h1>
    //       <p>Type: {databaseInfo.contractType}</p>
    //       <p>Address: {databaseInfo.address} [<a href={blockExplorerUrl} target="_blank" rel="noopener noreferrer">View on Explorer</a>]</p>
    //       <p>Network: {databaseInfo.network}</p>
    //       <p>Deployed At: {new Date(databaseInfo.deployedAt).toLocaleString()}</p>
    //       <h2>On-Chain Data:</h2>
    //       <p>Name (from contract): {onChainData.name || 'N/A'}</p>
    //       {onChainData.decimals !== null && <p>Decimals: {onChainData.decimals}</p>}
    //       {onChainData.totalSupply !== null && <p>Total Supply: {/* Format this based on decimals */} {onChainData.totalSupply}</p>}
    //       {onChainData.isPaused !== null && <p>Is Paused?: {onChainData.isPaused ? 'Yes' : 'No'}</p>}
    //       {onChainData.cap !== null && <p>Cap: {/* Format this based on decimals */} {onChainData.cap}</p>}
    //       {onChainData.supportsEIP2981 !== null && <p>Supports Royalties (EIP-2981)?: {onChainData.supportsEIP2981 ? 'Yes' : 'No'}</p>}
    //       {/* Display default royalty info from databaseInfo if applicable */}
    //       {databaseInfo.contractType.includes('ERC721') && databaseInfo.defaultRoyaltyReceiver && (
    //         <p>Default Royalty Receiver: {databaseInfo.defaultRoyaltyReceiver}</p>
    //       )}
    //       {databaseInfo.contractType.includes('ERC721') && databaseInfo.defaultRoyaltyFractionBps !== undefined && (
    //         <p>Default Royalty Fraction: {(databaseInfo.defaultRoyaltyFractionBps / 100).toFixed(2)}%</p>
    //       )}
    //     </div>
    //   );
    // };
    ```


**L5-M1.5: Tests (Unitaires et d'Intégration pour le Backend)**
- Date: 2025-06-06T16:58:51+00:00
- Avancement: Terminé.
- Actions:
  - Création du fichier de test unitaire `contract-query.service.spec.ts` pour `ContractQueryService`.
    - Tests pour `readContractFunction` (succès, fonction inexistante, erreur RPC).
    - Tests pour les méthodes spécifiques ERC-20 et ERC-721 (vérification des appels).
  - Création du fichier de test unitaire `contract-details.controller.spec.ts` pour `ContractDetailsController`.
    - Tests pour l'endpoint `getContractDetails` (succès ERC20/ERC721, contrat non trouvé, erreurs partielles du service de query).
    - Moquage des dépendances (`ContractQueryService`, `DeploymentDataService`).


**L5-M1.6: Documentation et Log**
- Date: 2025-06-06T16:59:51+00:00
- Avancement: Terminé.
- Actions:
  - `docs/api/API_DOCUMENTATION.md` a été mis à jour pour inclure la documentation du nouvel endpoint `GET /api/v1/contracts/:network/:address/details`.
  - Le `devlog/LOT_5_LOG.md` a été maintenu à jour tout au long de L5-M1.
  - **FIN DE LA MILESTONE L5-M1.**


**L5-M2.1: Conception des Endpoints API Backend (ERC-20 Actions)**
- Date: 2025-06-06T17:00:56+00:00
- Avancement: Terminé.
- Actions de Conception:
  - **Routes API Définies:**
    - `POST /api/v1/contracts/:network/:address/erc20/pause` (Aucun payload)
    - `POST /api/v1/contracts/:network/:address/erc20/unpause` (Aucun payload)
    - `POST /api/v1/contracts/:network/:address/erc20/mint` (Payload: `MintRequestDto`)
  - **DTO Défini (`MintRequestDto.ts`):**
    - `recipient`: string (IsEthereumAddress, IsNotEmpty)
    - `amount`: string (IsString, IsNotEmpty, Matches /^[0-9]+$/) - Représente la plus petite unité du token.
  - **Réponse API en Cas de Succès (Exemple):**
    ```json
    {
      success: true,
      transactionHash: 0x...,
      message: Action initiated successfully. Transaction hash: 0x...
    }
    ```
  - Les erreurs utiliseront les codes HTTP standards (400, 401, 403, 500) avec des messages JSON.


**L5-M2.2: Backend - Implémentation du `ContractInteractionService` (ERC-20 Actions)**
- Date: 2025-06-06T17:02:50+00:00
- Avancement: Terminé.
- Actions:
  - Création de `ContractInteractionService` (`src/services/blockchain/contract-interaction.service.ts`).
  - Injection de `ProviderService` et `DeploymentDataService`.
  - Implémentation des méthodes `pause(network, contractAddress, userId)`, `unpause(...)`, et `mint(..., recipient, amount, userId)`.
  - Logique de base pour la vérification des droits via `DeploymentDataService` (comparaison `userId`).
  - Logique pour obtenir un `signer` via `ProviderService` et instancier le contrat ethers.js.
  - Envoi des transactions et gestion basique des erreurs.
  - Ajout d'une méthode placeholder `getSigner()` à `ProviderService` utilisant une variable d'environnement `BACKEND_SIGNER_PRIVATE_KEY` (pour développement/test uniquement).
  - Ajout de `ContractInteractionService` aux providers de `AppModule`.


**L5-M2.3.1: Créer `ContractActionsController.ts` et Définir les Méthodes de Base**
- Date: 2025-06-06T17:05:41+00:00
- Avancement: Terminé.
- Actions:
  - Création du fichier `ContractActionsController.ts` dans `src/modules/contracts/controllers/`.
  - Injection de `ContractInteractionService` (et `ContractQueryService` commenté pour l'instant).
  - Définition des squelettes de méthodes pour `pauseContract`, `unpauseContract`, et `mintTokens`.
  - Application des décorateurs NestJS: `@Controller`, `@Post`, `@Param`, `@Body`, `@Req`, `@HttpCode`.
  - Ajout d'un placeholder pour `@UseGuards(AuthGuard('jwt'))` au niveau du contrôleur.
  - Vérification de l'existence de `userId` dans la requête.
  - Création du fichier DTO `mint-request.dto.ts` dans `src/modules/contracts/dtos/` avec les validateurs `class-validator`.


**L5-M2.3.2: Implémenter la Logique des Méthodes du Contrôleur**
- Date: 2025-06-06T17:07:13+00:00
- Avancement: Terminé.
- Actions:
  - Modification de `ContractActionsController.ts` pour implémenter la logique métier.
  - Chaque méthode du contrôleur (`pauseContract`, `unpauseContract`, `mintTokens`) :
    - Récupère `userId` depuis la requête (simulé pour l'instant).
    - Appelle la méthode correspondante de `ContractInteractionService`.
    - Injecte et utilise `ContractQueryService` pour des vérifications d'état préalables (ex: vérifier si déjà en pause/unpaused, ou si en pause avant de minter).
    - Gère les exceptions des services et les transforme en réponses HTTP appropriées (`NotFoundException`, `BadRequestException`, etc.).
    - Retourne une réponse structurée `ActionResponse { success, transactionHash?, message }`.


**L5-M2.3.3: Mettre à Jour `ContractsModule`**
- Date: 2025-06-06T17:15:26+00:00
- Avancement: Terminé.
- Actions:
  - Ajout de `ContractActionsController` à la liste des `controllers` dans `src/modules/contracts/contracts.module.ts`.
  - Vérification (implicite) que `ContractInteractionService` et `ContractQueryService` (fournis via `AppModule`) sont accessibles pour injection dans `ContractActionsController`.
  - Noté pour plus tard : une meilleure modularité pourrait être obtenue en créant un `BlockchainCoreModule` pour les services blockchain au lieu de les mettre tous dans `AppModule`.


**L5-M2.5.1: Tests Unitaires pour `ContractActionsController`**
- Date: 2025-06-06T17:17:03+00:00
- Avancement: Terminé.
- Actions:
  - Création du fichier de test unitaire `contract-actions.controller.spec.ts`.
  - Moquage des dépendances: `ContractInteractionService` et `ContractQueryService`.
  - Tests pour chaque action (`pause`, `unpause`, `mint`):
    - Cas de succès avec vérification des appels aux services et de la réponse.
    - Cas d'échec dus à des vérifications préalables (ex: contrat déjà en pause/unpaused, ou en pause avant mint).
    - Cas d'échec dus à des exceptions relancées par les services (NotFound, Forbidden, etc.).
    - Cas d'échec dus à une erreur interne du service (transformée en InternalServerErrorException).
    - Cas où `userId` est manquant (simulant un échec de l'AuthGuard).


**L5-M2.6.1: Mettre à Jour `API_DOCUMENTATION.md` (ERC-20 Actions)**
- Date: 2025-06-06T17:18:03+00:00
- Avancement: Terminé.
- Actions:
  - Ajout de la documentation pour les endpoints d'actions ERC-20 à `docs/api/API_DOCUMENTATION.md`:
    - `POST /api/v1/contracts/:network/:address/erc20/pause`
    - `POST /api/v1/contracts/:network/:address/erc20/unpause`
    - `POST /api/v1/contracts/:network/:address/erc20/mint` (avec `MintRequestDto`).
  - Chaque section détaille la méthode, le chemin, la description, l'authentification, les paramètres, le corps de la requête (si applicable), la réponse en cas de succès et les codes d'erreur possibles.


**L5-M2.6.2: Mettre à Jour `devlog/LOT_5_LOG.md` (Finalisation L5-M2)**
- Date: 2025-06-06T17:18:55+00:00
- Avancement: Terminé.
- Actions:
  - Le `devlog/LOT_5_LOG.md` a été maintenu à jour tout au long de L5-M2.
  - **FIN DE LA MILESTONE L5-M2: Dashboard - Actions Interactives Basiques (ERC-20).**


**L5-M3.1: Conception des Endpoints API Backend (ERC-721 Actions)**
- Date: 2025-06-06T17:20:05+00:00
- Avancement: Terminé.
- Actions de Conception:
  - **Routes API Définies (ERC-721):**
    - `POST /api/v1/contracts/:network/:address/erc721/pause` (Aucun payload)
    - `POST /api/v1/contracts/:network/:address/erc721/unpause` (Aucun payload)
    - `POST /api/v1/contracts/:network/:address/erc721/mint` (Payload: `NftMintRequestDto`)
  - **DTO Défini (`NftMintRequestDto.ts` dans `src/modules/contracts/dtos/`):**
    - `recipient`: string (IsEthereumAddress, IsNotEmpty)
    - `tokenId`: string (IsString, IsNotEmpty, Matches /^[0-9]+$/)
    - `tokenURI`: string (IsString, IsNotEmpty)
  - **Structure de Réponse API en Cas de Succès:** Utilisation de la même structure `ActionResponse` que pour ERC-20.
    ```json
    {
      success: true,
      transactionHash: 0x...,
      message: Action initiated successfully. Transaction hash: 0x...
    }
    ```
  - Les erreurs utiliseront les codes HTTP standards.


**L5-M3.2: Backend - Étendre `ContractInteractionService` (ERC-721 Actions)**
- Date: 2025-06-06T17:22:15+00:00
- Avancement: Terminé.
- Actions:
  - Ajout des méthodes `pauseERC721`, `unpauseERC721`, et `mintNFT` à `ContractInteractionService.ts` en utilisant un script Python pour l'injection de code.
  - Logique similaire aux méthodes ERC-20 pour la gestion du signer et la vérification des droits via `DeploymentDataService`.
  - La méthode `mintNFT` appelle `safeMintWithId(recipient, tokenId)` sur le contrat.
  - Noté une clarification importante: le paramètre `tokenURI` du DTO `NftMintRequestDto` n'est pas utilisé par la fonction de mint du contrat `ERC721MVP.sol` actuel. Un avertissement est loggué dans le service.


**L5-M3.3.1: Étendre `ContractActionsController.ts` pour les Actions ERC-721**
- Date: 2025-06-06T17:25:26+00:00
- Avancement: Terminé.
- Actions:
  - Ajout des méthodes pour `/erc721/pause`, `/erc721/unpause`, et `/erc721/mint` à `ContractActionsController.ts`.
  - Logique similaire aux méthodes ERC-20 : récupération `userId`, appel à `ContractInteractionService` et `ContractQueryService` pour pré-vérifications.
  - Utilisation de `NftMintRequestDto` pour la validation du payload de mint NFT.
  - Assuré que le DTO `NftMintRequestDto.ts` est créé dans `src/modules/contracts/dtos/`.
  - Gestion des erreurs et retour de la structure `ActionResponse`.


**L5-M3.5.1: Tests Unitaires pour les Nouvelles Méthodes de `ContractActionsController` (ERC-721)**
- Date: 2025-06-06T17:27:38+00:00
- Avancement: Terminé.
- Actions:
  - Étendu le fichier de test unitaire `contract-actions.controller.spec.ts`.
  - Ajout de blocs `describe` pour `pauseContractERC721`, `unpauseContractERC721`, et `mintNFT`.
  - Tests incluent les cas de succès, les échecs de préconditions (contrat déjà dans l'état cible, en pause avant mint), les exceptions de service (NotFound, Forbidden, InternalServerError), et l'absence de `userId`.
  - Assuré l'import de `NftMintRequestDto` dans le fichier de test.


**L5-M3.5.1: Tests Unitaires pour les Nouvelles Méthodes de `ContractActionsController` (ERC-721)**
- Date: 2025-06-06T17:28:36+00:00
- Avancement: Terminé.
- Actions:
  - Étendu le fichier de test unitaire `contract-actions.controller.spec.ts`.
  - Ajout de blocs `describe` pour `pauseContractERC721`, `unpauseContractERC721`, et `mintNFT`.
  - Tests incluent les cas de succès, les échecs de préconditions (contrat déjà dans l'état cible, en pause avant mint), les exceptions de service (NotFound, Forbidden, InternalServerError), et l'absence de `userId`.
  - Assuré l'import de `NftMintRequestDto` dans le fichier de test.


**L5-M3.5.2: Tests Unitaires pour les Nouvelles Méthodes de `ContractInteractionService` (ERC-721)**
- Date: 2025-06-06T17:30:16+00:00
- Avancement: Terminé.
- Actions:
  - Création/Extension du fichier de test unitaire `contract-interaction.service.spec.ts`.
  - Ajout de blocs `describe` pour `pauseERC721`, `unpauseERC721`, et `mintNFT`.
  - Tests incluent les cas de succès, les échecs de validation (ex: adresse/tokenId invalide pour mint), les échecs de permission (contrat non pausable), et les erreurs de transaction blockchain.
  - Moquage des dépendances (`ProviderService`, `DeploymentDataService`, `ethers.Contract`).


**L5-M3.6.1: Mettre à Jour `API_DOCUMENTATION.md` (ERC-721 Actions)**
- Date: 2025-06-07T15:35:16+00:00
- Avancement: Terminé.
- Actions:
  - Ajout de la documentation pour les endpoints d'actions ERC-721 à `docs/api/API_DOCUMENTATION.md`:
    - `POST /api/v1/contracts/:network/:address/erc721/pause`
    - `POST /api/v1/contracts/:network/:address/erc721/unpause`
    - `POST /api/v1/contracts/:network/:address/erc721/mint` (avec `NftMintRequestDto`).
  - Clarification dans la documentation du mint ERC-721 concernant l'utilisation du paramètre `tokenURI` avec le contrat `ERC721MVP.sol` actuel.


**L5-M3.6.2: Mettre à Jour `devlog/LOT_5_LOG.md` (Finalisation L5-M3)**
- Date: 2025-06-07T15:36:23+00:00
- Avancement: Terminé.
- Actions:
  - Le `devlog/LOT_5_LOG.md` a été maintenu à jour tout au long de L5-M3.
  - Correction d'une scorie mineure (mot 'христианство') dans `API_DOCUMENTATION.md`.
  - **FIN DE LA MILESTONE L5-M3: Dashboard - Actions Interactives Basiques (ERC-721).**


**L5-M3.6.2: Mettre à Jour `devlog/LOT_5_LOG.md` (Finalisation L5-M3)**
- Date: 2025-06-07T15:38:21+00:00
- Avancement: Terminé.
- Actions:
  - Le `devlog/LOT_5_LOG.md` a été maintenu à jour tout au long de L5-M3.
  - Correction d'une scorie mineure (mot 'христианство') dans `API_DOCUMENTATION.md`.
  - **FIN DE LA MILESTONE L5-M3: Dashboard - Actions Interactives Basiques (ERC-721).**


**L5-M4.1: Conception Détaillée de la Checklist et de son Contenu**
- Date: 2025-06-07T15:39:49+00:00
- Avancement: Terminé.
- Actions de Conception:
  - Titre Provisoire de la Checklist: Vos Premiers Pas sur BlockDeploy ou Bien Démarrer avec BlockDeploy.
  - Liste des Items de la Checklist (6 items) finalisée avec textes exacts, actions utilisateur, et suggestions de liens pertinents:
    1.  **Connexion du Portefeuille:** Texte défini, action = connexion wallet, détection auto.
    2.  **Comprendre les Réseaux de Test:** Texte défini, action = lecture/clic lien, détection manuelle, lien vers `#/mini-academy/obtaining-testnet-tokens`.
    3.  **Premier Déploiement ERC-20:** Texte défini, action = déploiement ERC-20, détection auto (idéalement), lien vers `#/deploy/erc20`.
    4.  **Explorer votre Contrat:** Texte défini, action = visite explorateur via dashboard, détection manuelle (ou auto sur clic), lien vers `#/dashboard`.
    5.  **Découverte de la Mini-Academy:** Texte défini, action = visite Mini-Academy, détection manuelle (ou auto sur visite), lien vers `#/mini-academy`.
    6.  **Création d'un NFT (Optionnel):** Texte défini, action = création tokenURI via outil IPFS, détection auto (idéalement), lien vers `#/create-nft-ipfs`.
  - Discussion sur la logique de détection de complétion (automatique vs. manuelle) pour chaque item.


**L5-M4.2: Conception de l'Intégration UI/UX de la Checklist (Conceptuel)**
- Date: 2025-06-07T15:40:56+00:00
- Avancement: Terminé.
- Concepts UI/UX Définis:
  - **Emplacement et Visibilité:**
    - Suggéré: Widget sur le Dashboard avec un 'Callout' lors de la première visite.
    - Accès permanent via menu de navigation ou page de la Mini-Academy.
  - **Interaction Utilisateur:**
    - Cases à cocher (automatiques pour actions détectées, manuelles sinon).
    - Liens cliquables dans les items.
    - Feedback visuel pour la complétion d'items (animation, couleur, texte barré).
  - **Aspect Visuel et Présentation:**
    - Liste verticale claire et lisible.
    - Icônes thématiques optionnelles par item.
    - Barre de progression fortement recommandée pour suivre l'avancement.
    - Design cohérent avec l'application.
  - **Comportement une Fois Complétée:**
    - Message de félicitations.
    - Options pour masquer ou minimiser la checklist.
    - Possibilité de retrouver la checklist ultérieurement.


**L5-M4.3: Spécification de la Persistance de l'État de la Checklist**
- Date: 2025-06-07T15:42:15+00:00
- Avancement: Terminé.
- Décisions et Spécifications:
  - **Option de Persistance Choisie (pour MVP):** Côté Client via `localStorage`.
    - **Avantages:** Simplicité d'implémentation rapide, pas de modification backend immédiate.
    - **Inconvénients:** Non synchronisé entre appareils/navigateurs, moins robuste.
    - **Structure de Données (Exemple pour localStorage):**
      - Clé: `blockdeploy_onboarding_checklist_v1` (ou avec userId si facilement accessible au chargement initial).
      - Valeur (JSON stringifié): `{ ITEM_1_WALLET_CONNECT: true, ITEM_2_TESTNET: false, ... , checklist_fully_completed: false }` ou un tableau d'IDs d'items complétés: `[ITEM_1_WALLET_CONNECT, ITEM_6_CREATE_NFT]`.
  - **Planification pour Future Amélioration (Persistance Backend):**
    - **Avantages:** Robuste, synchronisé, permet l'analyse.
    - **Schéma/Table Suggéré (`UserOnboardingProgress`):**
      - `id` (PK)
      - `userId` (FK vers Users, unique)
      - `completed_step_ids` (TEXT[] ou JSONB, stockant un tableau d'IDs d'étapes)
      - `is_fully_completed` (BOOLEAN)
      - `created_at`, `updated_at` (TIMESTAMPS)
    - **Endpoints API Suggérés (pour version backend):**
      - `GET /api/v1/onboarding/checklist/status`
      - `POST /api/v1/onboarding/checklist/step` (Payload: `{ stepId: string, isCompleted: boolean }`)
  - **Conclusion pour L5-M4:** L'implémentation se basera sur localStorage pour la gestion de l'état de la checklist.


**L5-M5.1: Définition des Premiers Contenus de la Mini-Academy**
- Date: 2025-06-07T15:45:02+00:00
- Avancement: Terminé.
- Actions de Conception:
  - Liste des 5 premiers articles pour la Mini-Academy définie :
    1.  **Titre:** Guide : Déployer votre premier Token ERC-20 avec BlockDeploy.
        - **Public:** Nouveaux utilisateurs, créateurs de tokens fongibles.
        - **Objectifs:** Comprendre le déploiement ERC-20 via BlockDeploy, retrouver son contrat.
        - **Points Clés:** Processus de A à Z, formulaires, options, réseaux, frais, accès post-déploiement.

    2.  **Titre:** Guide : Créer les Métadonnées de votre NFT et Obtenir un `tokenURI` avec BlockDeploy.
        - **Public:** Créateurs de NFTs (utilisant l'outil IPFS simplifié L4-M7).
        - **Objectifs:** Utiliser l'outil d'upload IPFS, comprendre `tokenURI`, `imageCID`, `metadataCID`.
        - **Points Clés:** Métadonnées NFT, IPFS, processus d'upload, signification des résultats, préparation au mint.


**L5-M5.1: Définition des Premiers Contenus de la Mini-Academy**
- Date: 2025-06-07T15:46:03+00:00
- Avancement: Terminé.
- Actions de Conception:
  - Liste des 5 premiers articles pour la Mini-Academy définie :
    1.  **Titre:** Guide : Déployer votre premier Token ERC-20 avec BlockDeploy.
        - **Public:** Nouveaux utilisateurs, créateurs de tokens fongibles.
        - **Objectifs:** Comprendre le déploiement ERC-20 via BlockDeploy, retrouver son contrat.
        - **Points Clés:** Processus de A à Z, formulaires, options, réseaux, frais, accès post-déploiement.

    2.  **Titre:** Guide : Créer les Métadonnées de votre NFT et Obtenir un `tokenURI` avec BlockDeploy.
        - **Public:** Créateurs de NFTs (utilisant l'outil IPFS simplifié L4-M7).
        - **Objectifs:** Utiliser l'outil d'upload IPFS, comprendre `tokenURI`, `imageCID`, `metadataCID`.
        - **Points Clés:** Métadonnées NFT, IPFS, processus d'upload, signification des résultats, préparation au mint.

    3.  **Titre:** Comprendre et Utiliser les Explorateurs de Blocs (Etherscan, Polygonscan).
        - **Public:** Tous les utilisateurs.
        - **Objectifs:** Savoir utiliser un explorateur pour vérifier contrats et transactions.
        - **Points Clés:** Navigation explorateur, sections clés \(code, tx, events\), suivi de transaction, vérification de contrat.

    4.  **Titre:** Actions sur vos Contrats ERC-20 : Gérer la Pause et le Mint.
        - **Public:** Utilisateurs de contrats ERC-20 Pausable/Mintable \(L5-M2\).
        - **Objectifs:** Comprendre et utiliser les actions `pause`, `unpause`, `mint` ERC-20 depuis le Dashboard.
        - **Points Clés:** Cas d'usage, utilisation des fonctionnalités du Dashboard, importance des droits.

    5.  **Titre:** Actions sur vos NFTs ERC-721 : Gérer la Pause et le Mint.
        - **Public:** Utilisateurs de contrats ERC-721 Pausable/Mintable \(L5-M3\).
        - **Objectifs:** Comprendre et utiliser les actions `pause`, `unpause`, `safeMint` ERC-721 depuis le Dashboard.
        - **Points Clés:** Similaire à ERC-20 pour pause/unpause. Processus de mint NFT \(recipient, tokenId, tokenURI\), clarification sur l'usage du `tokenURI` avec `ERC721MVP.sol`, droits.


**L5-M5.2: Conception de la Structure de Rendu UI pour la Mini-Academy (Conceptuel)**
- Date: 2025-06-07T15:47:17+00:00
- Avancement: Terminé.
- Concepts UI/UX et Structure de Rendu Définis:
  - **Emplacement Principal:** Onglet Academy dans la navigation principale de l'application.
  - **Page d'Accueil de l'Academy (`#/mini-academy`):**
    - Titre clair.
    - Liste des articles disponibles (titre cliquable, optionnellement courte description).
    - Pour MVP: Pas de tri/filtre avancé, simple liste ordonnée.
  - **Page de Lecture d'un Article (`#/mini-academy/:article-slug`):**
    - Contenu principal formaté à partir de Markdown (via `react-markdown` ou similaire).
    - Styling pour lisibilité (texte, blocs de code avec coloration syntaxique).
    - Pour MVP: Pas de table des matières auto, ni de navigation précédent/suivant complexe.
  - **Approche Technique MVP:**
    - Articles stockés en fichiers Markdown dans `docs/mini-academy/`.
    - Rendu côté client: Récupération du contenu Markdown (import direct ou fetch d'assets statiques) et parsing/rendu avec une librairie React.


**L5-M5.3: Identification des Liens Contextuels (Conceptuel)**
- Date: 2025-06-07T15:48:39+00:00
- Avancement: Terminé.
- Identification des Emplacements pour Liens Contextuels vers la Mini-Academy:
  - **1. Checklist d'Onboarding (L5-M4):**
    - Item 'Comprendre les Réseaux de Test' -> Article sur l'obtention de tokens de test (ou section d'un autre guide).
    - Item 'Premier Déploiement ERC-20' -> Article 'Guide : Déployer votre premier Token ERC-20'.
    - Item 'Explorer votre Contrat' -> Article 'Comprendre et Utiliser les Explorateurs de Blocs'.
    - Item 'Découverte de la Mini-Academy' -> Page d'accueil de la Mini-Academy.
    - Item 'Création d'un NFT' -> Article 'Guide : Créer les Métadonnées de votre NFT et Obtenir un `tokenURI`'.
  - **2. Dashboard - Vue Détaillée d'un Contrat:**
    - Près des infos du contrat (adresse) -> Article sur les explorateurs de blocs.
    - Près des boutons d'actions ERC-20 (pause/mint) -> Article 'Actions sur vos Contrats ERC-20'.
    - Près des boutons d'actions ERC-721 (pause/mint) -> Article 'Actions sur vos NFTs ERC-721'.
    - Spécifique au mint NFT (champ `tokenURI`) -> Article 'Guide : Créer les Métadonnées de votre NFT'.
  - **3. Formulaires de Déploiement (ERC-20, ERC-721):**
    - À côté des options (Pausable, Mintable, etc.) -> Liens vers les articles respectifs sur les actions ERC-20/ERC-721.
    - Pour ERC-721 (champ `baseURI`) -> Explication du rôle du `baseURI` (section d'un guide NFT).
  - **4. Messages de Succès Post-Action (Déploiement, Mint):**
    - Lien vers l'article sur les explorateurs (après déploiement).
    - Lien vers l'article sur les actions de token (après mint ERC-20).


**L5-M5.4: Création des Fichiers Squelettes pour les Articles et Documentation**
- Date: 2025-06-07T15:50:02+00:00
- Avancement: Terminé.
- Actions:
  - Création des 5 fichiers Markdown squelettes pour les premiers articles de la Mini-Academy dans `docs/mini-academy/` (ex: `01_deploy_erc20_guide.md`, etc.).
  - Chaque fichier squelette contient le titre de l'article, le public cible et les objectifs d'apprentissage.
  - Création du document de conception `docs/features/L5_M5_MINI_ACADEMY_CONTENT_AND_STRUCTURE.md`.
  - Ce document de conception synthétise les décisions des étapes L5-M5.1 (contenu), L5-M5.2 (structure UI), et L5-M5.3 (liens contextuels).


**L5-M5.5: Mettre à Jour `devlog/LOT_5_LOG.md` (Finalisation L5-M5)**
- Date: 2025-06-07T15:51:20+00:00
- Avancement: Terminé.
- Actions:
  - Le `devlog/LOT_5_LOG.md` a été maintenu à jour tout au long de L5-M5.
  - **FIN DE LA MILESTONE L5-M5: Mini-Academy - Premiers Articles de Fond (Phase de Conception et Structuration).**
