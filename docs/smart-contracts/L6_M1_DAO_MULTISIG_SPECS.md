# L6-M1: Spécifications Techniques du Smart Contract Multisig DAO pour MVP

**Date:** $(date --iso-8601=seconds)
**Statut:** Conception Terminée

## 1. Objectif

Ce document résume les spécifications techniques et les choix de conception pour le smart contract qui servira de base au MVP DAO Builder de BlockDeploy (Lot 6). L'objectif est de permettre la création de DAOs multisignatures simples et sécurisées.

## 2. Choix du Contrat de Base et Méthode d'Utilisation (L6-M1.1)

*   **Contrat de Base Confirmé:** **Gnosis Safe / Safe{Core}**. Ce choix est motivé par sa robustesse, sa sécurité (audits multiples), sa large adoption et sa richesse fonctionnelle alignée avec les besoins du MVP.
*   **Méthode d'Utilisation:** Chaque DAO créée par un utilisateur de BlockDeploy sera une **instance d'un proxy** pointant vers une implémentation maître (mastercopy) de \`Safe.sol\`.
*   **Déploiement des Proxies:** Utilisation du contrat \`SafeProxyFactory.sol\` (ou équivalent Safe{Core}) fourni par Gnosis Safe. Cela permet des déploiements de nouvelles DAOs économes en gas.
*   **Versions et Instances Officielles:**
    *   Il est prévu d'utiliser une version récente, stable et auditée des contrats Gnosis Safe (ex: v1.3.0 ou une version Safe{Core} équivalente recommandée au moment de l'implémentation).
    *   L'utilisation des instances officielles des factories et mastercopies Gnosis Safe sur les réseaux cibles est privilégiée.

## 3. Contrats et Fonctionnalités Spécifiques de Gnosis Safe à Utiliser (L6-M1.2)

*   **Contrats Gnosis Safe Clés:**
    *   \`Safe.sol\` (Mastercopy): Logique du multisig.
    *   \`SafeProxyFactory.sol\`: Pour le déploiement des proxies.
        *   Fonction clé: \`createProxyWithNonce(address _singleton, bytes memory initializer, uint256 saltNonce)\`.
*   **Fonctionnalités de \`Safe.sol\` pour MVP:**
    *   **Configuration Initiale (via \`initializer\`):**
        *   \`setup(address[] _owners, uint256 _threshold, address to, bytes data, ...)\`: Pour la configuration initiale des propriétaires et du seuil.
    *   **Soumission et Exécution de Transactions:**
        *   \`execTransaction(address to, uint256 value, bytes data, Enum.Operation operation, ..., bytes signatures)\`: Pour exécuter une transaction approuvée.
    *   **Récupération d'Informations (fonctions \`view\`):**
        *   \`getOwners()\`, \`getThreshold()\`, \`getNonce()\`, \`getTransactionHash(...)\`, \`isOwner(address)\`.
    *   **Gestion des Propriétaires/Seuil (via propositions à \`execTransaction\`):**
        *   \`addOwnerWithThreshold(address owner, uint256 _threshold)\`
        *   \`removeOwner(address prevOwner, address owner, uint256 _threshold)\`
        *   \`changeThreshold(uint256 _threshold)\`

## 4. Spécifications d'Interaction Backend (Résumé - L6-M1.3)

Le backend interagira avec les contrats Gnosis Safe pour les opérations suivantes :

*   **Création DAO:** Appel à \`SafeProxyFactory.createProxyWithNonce()\` avec un \`initializer\` encodant l'appel à \`Safe.setup()\`.
*   **Soumission de Proposition:** Calcul du \`transactionHash\` via \`safe.getTransactionHash()\`, stockage en DB.
*   **Confirmation de Proposition:** Collecte et validation des signatures (EIP-712) pour le \`transactionHash\`.
*   **Exécution de Proposition:** Appel à \`safe.execTransaction()\` avec les paramètres de la transaction et les signatures agrégées.
*   **Gestion des Membres/Seuil:** Encodage des appels à \`addOwnerWithThreshold\`, \`removeOwner\`, \`changeThreshold\` dans le champ \`data\` d'une proposition soumise via \`execTransaction\`.

*(Les détails complets du flux d'interaction sont dans le devlog pour L6-M1.3).*

## 5. Collecte des ABIs et Adresses de Contrats (L6-M1.4)

*   **ABIs:** Seront obtenus depuis les paquets NPM officiels de Safe (ex: \`@safe-global/safe-contracts\`) pour les versions exactes des contrats utilisés.
    *   ABIs requis : \`Safe.sol\`, \`SafeProxyFactory.sol\`.
*   **Adresses des Contrats Officiels:** Seront récupérées depuis la documentation officielle de Safe ou le dépôt \`safe-global/safe-deployments\` pour les réseaux cibles. Ces adresses (mastercopies, factories) seront stockées dans la configuration backend de BlockDeploy.

## 6. Conclusion pour L6-M1

La conception et la sélection du smart contract pour le MVP DAO Builder sont basées sur l'utilisation des contrats Gnosis Safe / Safe{Core}, en tirant parti de leur sécurité et de leurs fonctionnalités éprouvées. Les prochaines étapes impliqueront l'implémentation backend pour interagir avec ces contrats.
