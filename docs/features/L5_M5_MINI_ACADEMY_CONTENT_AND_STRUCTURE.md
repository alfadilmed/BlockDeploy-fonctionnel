# L5-M5: Conception de la Mini-Academy (Contenu Initial et Structure)

**Date:** $(date --iso-8601=seconds)
**Statut:** Conception Terminée

## 1. Objectif de la Mini-Academy

La Mini-Academy vise à fournir aux utilisateurs de BlockDeploy des guides clairs, concis et pratiques pour les aider à comprendre les concepts clés du Web3, à maîtriser les fonctionnalités de la plateforme, et à utiliser leurs contrats intelligents de manière efficace.

## 2. Premiers Contenus Définis (L5-M5.1)

Les cinq premiers articles suivants ont été identifiés comme fondamentaux pour le lancement de la Mini-Academy :

1.  **Titre:** "Guide : Déployer votre premier Token ERC-20 avec BlockDeploy."
    *   **Fichier:** \`docs/mini-academy/01_deploy_erc20_guide.md\`
    *   **Public:** Nouveaux utilisateurs, créateurs de tokens fongibles.
    *   **Objectifs:** Comprendre le déploiement ERC-20 via BlockDeploy, retrouver son contrat.
2.  **Titre:** "Guide : Créer les Métadonnées de votre NFT et Obtenir un \`tokenURI\` avec BlockDeploy."
    *   **Fichier:** \`docs/mini-academy/02_create_nft_metadata_guide.md\`
    *   **Public:** Créateurs de NFTs (utilisant l'outil IPFS simplifié L4-M7).
    *   **Objectifs:** Utiliser l'outil d'upload IPFS, comprendre \`tokenURI\`, \`imageCID\`, \`metadataCID\`.
3.  **Titre:** "Comprendre et Utiliser les Explorateurs de Blocs (Etherscan, Polygonscan)."
    *   **Fichier:** \`docs/mini-academy/03_block_explorers_guide.md\`
    *   **Public:** Tous les utilisateurs.
    *   **Objectifs:** Savoir utiliser un explorateur pour vérifier contrats et transactions.
4.  **Titre:** "Actions sur vos Contrats ERC-20 : Gérer la Pause et le Mint."
    *   **Fichier:** \`docs/mini-academy/04_erc20_actions_guide.md\`
    *   **Public:** Utilisateurs de contrats ERC-20 Pausable/Mintable (L5-M2).
    *   **Objectifs:** Comprendre et utiliser les actions \`pause\`, \`unpause\`, \`mint\` ERC-20 depuis le Dashboard.
5.  **Titre:** "Actions sur vos NFTs ERC-721 : Gérer la Pause et le Mint."
    *   **Fichier:** \`docs/mini-academy/05_erc721_actions_guide.md\`
    *   **Public:** Utilisateurs de contrats ERC-721 Pausable/Mintable (L5-M3).
    *   **Objectifs:** Comprendre et utiliser les actions \`pause\`, \`unpause\`, \`safeMint\` ERC-721 depuis le Dashboard.

*(Les points clés détaillés pour chaque article sont consignés dans le devlog pour L5-M5.1).*

## 3. Structure de Rendu UI (Conceptuel - L5-M5.2)

*   **Emplacement Principal:** Onglet "Academy" dans la navigation principale.
*   **Page d'Accueil de l'Academy (\`#/mini-academy\`):**
    *   Liste des articles (titre cliquable, optionnellement courte description).
*   **Page de Lecture d'un Article (\`#/mini-academy/:article-slug\`):**
    *   Contenu principal formaté à partir de Markdown (via \`react-markdown\` ou similaire).
    *   Styling pour lisibilité.
*   **Approche Technique MVP:** Articles en fichiers Markdown, rendu côté client.

*(Les détails de la conception UI/UX sont consignés dans le devlog pour L5-M5.2).*

## 4. Liens Contextuels Identifiés (Conceptuel - L5-M5.3)

Des liens vers ces articles (ou des sections spécifiques) seront intégrés contextuellement dans l'application :

*   **Checklist d'Onboarding:** Pour les étapes correspondantes.
*   **Dashboard (Vue Détaillée Contrat):** Près des informations du contrat et des boutons d'action.
*   **Formulaires de Déploiement:** À côté des options de configuration des contrats.
*   **Messages de Succès Post-Action:** Pour guider l'utilisateur vers les étapes suivantes ou plus d'informations.

*(La liste détaillée des emplacements de liens contextuels est consignée dans le devlog pour L5-M5.3).*

## 5. Prochaines Étapes pour la Mini-Academy

*   Rédaction effective du contenu des articles listés.
*   Implémentation frontend de la section Mini-Academy (liste et affichage des articles).
*   Intégration des liens contextuels dans l'interface utilisateur.
