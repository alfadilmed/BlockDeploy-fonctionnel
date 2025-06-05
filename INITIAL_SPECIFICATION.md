# BlockDeploy - Spécification Fonctionnelle Initiale & Plan de Développement

Ce document décrit les spécifications fonctionnelles initiales et le plan de développement pour la plateforme BlockDeploy, en se concentrant sur un Produit Minimum Viable (MVP) robuste et évolutif.

---

## 1. Composants React Réutilisables (Basés sur l'existant et à créer)

L'analyse du code existant (`components/` et `components/ui/`) révèle une bonne base de composants. Nous allons les lister et identifier ceux à affiner ou à créer.

### a. Composants UI de Base (À vérifier/consolider depuis `components/ui/` et `components/`)

*   **`Button` / `ButtonPrimary` / `ButtonSecondary` / `GlowButton`:** Standardiser en un composant `Button` unique avec des props pour `variant` (primary, secondary, ghost, link, glow), `size`, `iconLeft`, `iconRight`, `isLoading`, `disabled`.
*   **`Input` / `InputText` / `InputWithIcon`:** Un composant `Input` unique avec support pour type, placeholder, icônes, validation, messages d'erreur.
*   **`Card`:** Composant générique pour encapsuler du contenu. À utiliser pour les templates, les stats, etc. (déjà bien utilisé).
*   **`Modal` (ex: `QuickViewModal`, `DemoOnlyModal`):** Standardiser un composant `Modal` pour les pop-ups et les dialogues.
*   **`Select` / `SelectDropdown`:** Composant de sélection déroulante.
*   **`Tooltip` (`CustomTooltip`):** Pour afficher des informations contextuelles.
*   **`Spinner`:** Indicateur de chargement.
*   **`AlertBox`:** Pour les messages d'information, d'avertissement ou d'erreur.
*   **`ProgressBar` / `AnimatedProgressBar`:** Pour indiquer la progression.
*   **`Badge` / `Chip` / `TokenBadge` / `TxStatusBadge`:** Pour afficher des statuts, des tags, etc.
*   **`Typography` (Heading, Paragraph):** Standardiser les composants typographiques pour la cohérence.

### b. Composants Fonctionnels (À créer ou affiner)

*   **`ConnectWalletButton` (`components/ui/WalletConnectButton.jsx`):**
    *   **Logique:** Gérer la connexion/déconnexion avec plusieurs types de wallets (MetaMask, WalletConnect).
    *   **État:** Afficher l'état de connexion, l'adresse de l'utilisateur, le réseau.
    *   **Props:** `onConnect`, `onDisconnect`.
*   **`NetworkSelector`:**
    *   **Logique:** Permettre à l'utilisateur de choisir le réseau blockchain cible.
    *   **Props:** `availableNetworks`, `selectedNetwork`, `onChangeNetwork`. (Vu dans `Header.tsx`, pourrait être extrait).
*   **`TemplateCard` (`components/TemplateCard.tsx` et `components/ui/ContractCard.jsx`):**
    *   **Affichage:** Nom du template, description, icône, tags.
    *   **Action:** Bouton pour démarrer le processus de configuration.
*   **`DeploymentForm` (Nouveau - par template):**
    *   **Logique:** Formulaire dynamique basé sur les paramètres requis par le template de contrat intelligent (ex: nom du token, symbole, supply pour ERC-20).
    *   **Validation:** Validation en temps réel des entrées.
    *   **Props:** `templateType`, `onSubmit`.
*   **`TransactionStatusNotifier` (Nouveau):**
    *   **Logique:** Suivre et afficher l'état d'une transaction blockchain (en attente, succès, échec) via des toasts ou une section dédiée.
*   **`GasEstimator` (`components/ui/GasFeeEstimator.jsx`):** Afficher une estimation des frais de gas avant déploiement.

---

## 2. Structure des Routes/Pages Next.js (Cible)

En s'inspirant de la structure existante (`pages/`) et en visant Next.js.

*   **`/` (Landing Page):** `pages/index.tsx` (similaire à `pages/public/HomePage.tsx` analysée).
*   **`/auth/`:**
    *   `pages/auth/login.tsx`
    *   `pages/auth/register.tsx`
    *   `pages/auth/forgot-password.tsx`
*   **`/dashboard/` (Protégé par authentification):**
    *   `pages/dashboard/overview.tsx` (Résumé, stats utilisateur)
    *   `pages/dashboard/deployments.tsx` (Liste des contrats déployés)
    *   `pages/dashboard/templates.tsx` (Galerie des templates de contrats)
    *   `pages/dashboard/settings.tsx` (Paramètres du compte)
*   **`/wizard/` (Processus de déploiement):**
    *   `pages/wizard/select-template.tsx` (Alternative à `/dashboard/templates` comme point d'entrée)
    *   `pages/wizard/configure/[templateId].tsx` (Formulaire de configuration dynamique)
    *   `pages/wizard/review.tsx` (Récapitulatif avant déploiement)
    *   `pages/wizard/deploying.tsx` (Affichage de l'état du déploiement)
    *   `pages/wizard/success.tsx` (Confirmation et prochaines étapes)
*   **`/public/` (Pages statiques):**
    *   `pages/public/features.tsx`
    *   `pages/public/pricing.tsx`
    *   `pages/public/docs/[...slug].tsx` (Pour la documentation/Academy)
    *   `pages/public/contact.tsx`
    *   `pages/public/about.tsx`

---

## 3. Contrats Solidity Minimum pour MVP

Templates de base, sécurisés et audités (par la communauté ou en interne au début).

*   **`ERC20Minimal.sol`:**
    *   Fonctionnalités: `name`, `symbol`, `decimals`, `totalSupply`, `balanceOf`, `transfer`, `approve`, `allowance`, `transferFrom`.
    *   Paramètres configurables: Nom, Symbole, Décimales (optionnel, défaut 18), Supply initiale.
    *   Optionnel: `Ownable` pour la fonction de mint (si supply non fixe).
*   **`ERC721Minimal.sol` (pour NFT):**
    *   Fonctionnalités: `name`, `symbol`, `tokenURI`, `ownerOf`, `safeTransferFrom`, `approve`.
    *   Paramètres configurables: Nom, Symbole, URI de base pour les métadonnées.
    *   Fonction `mint(to, tokenId)` protégée (par `Ownable`).
*   **`SimpleDAO.sol` (optionnel pour MVP, plus complexe):**
    *   Fonctionnalités: Gestion des membres (basée sur ERC20 ou NFT), création de propositions, vote.
    *   Paramètres: Token de vote, quorum, durée de vote.
    *   *Ce contrat pourrait être repoussé post-MVP pour se concentrer sur ERC20/NFT.*

---

## 4. Backend (Node.js/Express ou NestJS)

*   **API Endpoints:**
    *   Authentification (register, login, refresh token).
    *   Gestion des utilisateurs (profil, settings).
    *   Sauvegarde des configurations de déploiement (avant envoi à la blockchain).
    *   Interaction avec la blockchain (via des services sécurisés pour ne pas exposer les clés privées du serveur si nécessaire pour des opérations de type "gas station").
    *   Webhook pour les mises à jour de statut de transaction (si utilisation d'un service tiers).
*   **Services:**
    *   `AuthService`: Gérer la logique d'authentification.
    *   `UserService`: Gérer les données utilisateur.
    *   `ContractService`: Gérer la compilation (si faite dynamiquement, sinon pré-compilés), l'interaction avec les contrats (déploiement, lecture de données).
    *   `BlockchainService`: Abstraire les interactions avec ethers.js/viem, gestion des providers RPC, gestion des nonces.

---

## 5. Base de Données (MongoDB Suggéré)

*   **Collections:**
    *   `users`: Informations utilisateur (email, mot de passe hashé, profil, etc.).
    *   `smartContracts`: Informations sur les templates de contrats disponibles (nom, description, ABI pré-compilée, bytecode).
    *   `deployments`: Enregistrements des déploiements effectués par les utilisateurs (userId, contractType, network, address, transactionHash, parameters, status).
    *   `userSettings`: Préférences utilisateur.

MongoDB est adapté pour sa flexibilité, particulièrement pour stocker les paramètres de déploiement qui peuvent varier grandement entre les types de contrats.

---

## 6. Sécurité et Intégration Web3

*   **Sécurité Backend:**
    *   Validation des entrées (côté client et serveur).
    *   Protection contre les attaques courantes (XSS, CSRF, Injection SQL/NoSQL).
    *   Gestion sécurisée des secrets (clés API, clés privées du serveur si utilisées). Variables d'environnement et services de gestion de secrets (Vault, AWS KMS).
    *   HTTPS pour toutes les communications.
*   **Interaction Web3 (Frontend):**
    *   **Wallet Connection:** Utiliser des bibliothèques éprouvées comme `Web3Modal`, `RainbowKit`, ou `wagmi` (qui intègre ethers.js/viem) pour gérer la connexion aux wallets.
    *   **Signature des Transactions:** Toutes les transactions qui modifient l'état de la blockchain doivent être signées par l'utilisateur via son wallet. Le backend ne doit jamais demander la clé privée de l'utilisateur.
    *   **Gestion des Erreurs:** Gérer correctement les erreurs de transaction (rejet par l'utilisateur, fonds insuffisants, échec de la transaction).
*   **RPC Nodes:**
    *   Utiliser des fournisseurs RPC fiables (Alchemy, Infura, QuickNode) pour la communication avec les réseaux blockchain. Prévoir des fallbacks.
    *   Ne pas exposer les clés API RPC côté client si elles ont des restrictions de sécurité importantes. Le backend peut relayer certaines appels si nécessaire, mais privilégier les appels directs depuis le client pour la lecture de données.
*   **Audit des Contrats Templates:** Les templates de contrats intelligents fournis par BlockDeploy doivent être audités pour garantir leur sécurité.
*   **Protection des Données Utilisateur:** Conformité RGPD si applicable, chiffrement des données sensibles.

---

Ce plan initial servira de base pour le développement du MVP de BlockDeploy. Il devra être affiné et détaillé au fur et à mesure de l'avancement du projet.
