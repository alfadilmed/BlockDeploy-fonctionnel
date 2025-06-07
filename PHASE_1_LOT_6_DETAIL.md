# Plan Détaillé – Phase 1 / Lot 6: MVP DAO Builder (Multisig Simplifié)

**Objectif du Lot 6:** Livrer un Produit Minimum Viable (MVP) d'un outil de création et de gestion de DAOs (Decentralized Autonomous Organizations) simples, basé sur un modèle de portefeuille multisignature (multisig). L'objectif est de permettre aux utilisateurs de créer une DAO, de définir ses propriétaires et ses règles de signature, et de gérer des propositions de transactions basiques de manière sécurisée et intuitive.

**Référence Principale:** Feedback utilisateur priorisant un "MVP DAO Builder" (type Gnosis Safe simplifié) pour le Lot 6, en complément de l'esprit de l'Axe 6 du Plan Consolidé Phase 1.

---

## Modèle de DAO Cible pour MVP

*   **Type:** Portefeuille Multisignature (Multisig DAO).
*   **Inspiration:** Gnosis Safe / Safe{Core} – Utiliser ou s'inspirer fortement de leurs contrats audités et éprouvés est privilégié pour la sécurité et la robustesse.
*   **Fonctionnalités Clés du Modèle:**
    *   Permet à un groupe de N propriétaires (adresses) de gérer collectivement des fonds et d'exécuter des transactions.
    *   Nécessite M signatures parmi N (seuil M/N) pour approuver et exécuter une transaction.

---

## Milestones Suggérées pour le Lot 6

### L6-M1: Conception et Sélection/Adaptation du Smart Contract Multisig DAO

*   **Description:** Définir précisément les fonctionnalités requises du smart contract et choisir ou adapter une base de code open source existante (Gnosis Safe / Safe{Core} étant le candidat principal).
*   **Actions:**
    1.  **Spécifications Techniques du Contrat:**
        *   Fonction de création/déploiement du multisig avec une liste initiale de propriétaires et un seuil de signature.
        *   Fonctions pour soumettre une nouvelle transaction (proposition) au multisig (destinataire, valeur ETH, données calldata).
        *   Fonction pour qu'un propriétaire confirme une transaction en attente.
        *   Fonction pour exécuter une transaction ayant atteint le seuil de confirmations.
        *   Fonctions pour gérer les propriétaires (ajouter, retirer, remplacer un propriétaire) – ces actions seront elles-mêmes des transactions soumises au processus M/N.
        *   Fonction pour changer le seuil de signature – également une transaction M/N.
        *   Événements émis par le contrat pour les actions clés (création, soumission, confirmation, exécution de proposition, changements de configuration).
    2.  **Évaluation et Sélection/Adaptation Contrat Open Source:**
        *   Confirmer le choix de Gnosis Safe / Safe{Core} ou d'une alternative viable avec l'équipe/utilisateur.
        *   Si Gnosis Safe est utilisé, identifier les contrats principaux (\`Safe.sol\`, \`SafeProxyFactory.sol\`, etc.) et les mécanismes d'interaction (ex: via leur SDK ou directement avec les ABIs).
        *   Si une adaptation est nécessaire (pour simplifier ou ajouter une fonctionnalité mineure), la planifier (forte préférence pour l'utilisation directe des contrats audités).
    3.  **Préparation des ABIs:** Collecter et stocker les ABIs nécessaires pour l'interaction backend/frontend.
*   **Livrables:** Document de spécification du contrat, choix final du contrat de base, ABIs des contrats.

### L6-M2: Backend - API de Création et de Configuration Initiale de DAO

*   **Description:** Développer les endpoints API nécessaires pour que les utilisateurs puissent créer et configurer leur DAO multisig.
*   **Fonctionnalités Backend:**
    1.  **Endpoint \`POST /api/v1/dao/multisig\`:**
        *   **Payload:** \`{ name: string (nom donné par l'utilisateur pour la DAO), owners: string[], threshold: number, network: string }\`
        *   **Logique Service:**
            *   Valider les entrées (adresses valides, seuil cohérent avec le nombre de propriétaires).
            *   Déployer une instance du contrat Multisig DAO (ex: un proxy pointant vers une implémentation Gnosis Safe) via \`ProviderService\` ou un service de déploiement adapté. Le \`userId\` de l'appelant sera enregistré comme le créateur/initiateur.
            *   Enregistrer les informations de la DAO (adresse du contrat déployé, réseau, nom, propriétaires initiaux, seuil, créateur \`userId\`) dans une nouvelle table de la base de données (ex: \`Daos\`).
        *   **Réponse:** Informations sur la DAO créée, y compris son adresse.
*   **Livrables:** Endpoint API fonctionnel pour la création de DAO, logique de déploiement de contrat, persistance en base de données.

### L6-M3: Backend - API de Gestion des Propositions de Transaction

*   **Description:** Développer les endpoints API pour la soumission, la confirmation et l'exécution des propositions de transactions au sein d'une DAO.
*   **Fonctionnalités Backend (pour une DAO à \`:daoAddress\` sur \`:network\`):**
    1.  **Endpoint \`POST /api/v1/dao/multisig/:network/:daoAddress/proposals\`:**
        *   **Payload:** \`{ to: string (adresse destinataire), value: string (montant ETH en wei), data: string (hex, calldata pour interactions contractuelles, ex: \`0x\` pour simple transfert ETH), description: string (optionnel) }\`
        *   **Logique Service:**
            *   Vérifier que l'appelant est un propriétaire de la DAO (lecture DB ou on-chain).
            *   Interagir avec le contrat DAO pour soumettre la proposition (ex: \`submitTransaction\` sur Gnosis Safe). Cela peut impliquer une première signature de l'initiateur.
            *   Enregistrer la proposition dans la base de données (avec son ID on-chain si fourni, état "en attente", initiateur, détails de la transaction).
        *   **Réponse:** Détails de la proposition soumise.
    2.  **Endpoint \`POST /api/v1/dao/multisig/:network/:daoAddress/proposals/:proposalIdOrTxHash/confirmations\`:**
        *   **Logique Service:**
            *   Vérifier que l'appelant est un propriétaire de la DAO et n'a pas déjà confirmé.
            *   Interagir avec le contrat DAO pour ajouter une confirmation à la proposition (ex: \`confirmTransaction\` sur Gnosis Safe, qui nécessite une signature).
            *   Mettre à jour l'état de la proposition en DB (nombre de confirmations).
        *   **Réponse:** Statut de la proposition mis à jour.
    3.  **Endpoint \`POST /api/v1/dao/multisig/:network/:daoAddress/proposals/:proposalIdOrTxHash/execute\`:**
        *   **Logique Service:**
            *   Vérifier que l'appelant est un propriétaire.
            *   Vérifier que la proposition a atteint le seuil de confirmations (lecture contrat ou DB).
            *   Interagir avec le contrat DAO pour exécuter la transaction (ex: \`execTransaction\` sur Gnosis Safe).
            *   Mettre à jour l'état de la proposition en DB (exécutée, échouée).
        *   **Réponse:** Résultat de l'exécution.
    4.  **Endpoint \`GET /api/v1/dao/multisig/:network/:daoAddress/proposals\`:**
        *   **Logique Service:** Lister les propositions pour une DAO (depuis la DB, potentiellement enrichies d'infos on-chain comme le nombre actuel de confirmations).
        *   **Réponse:** Liste des propositions.
*   **Livrables:** Endpoints API fonctionnels pour la gestion des propositions, logique d'interaction avec le contrat DAO pour soumission/confirmation/exécution.

### L6-M4: Frontend - Interface de Création et Configuration de DAO (Conceptuel)

*   **Description:** Concevoir l'interface utilisateur pour la création d'une DAO multisig.
*   **Fonctionnalités Frontend (Conceptuel):**
    *   Formulaire de création :
        *   Champ pour le nom de la DAO (pour identification dans BlockDeploy).
        *   Champs pour ajouter/supprimer des adresses de propriétaires initiaux (avec validation de format d'adresse).
        *   Champ pour définir le seuil de signatures requis (M parmi N).
        *   Sélection du réseau de déploiement.
    *   Affichage clair des coûts estimés (gas) et bouton de confirmation.
    *   Redirection vers la page de la DAO nouvellement créée ou mise à jour du dashboard.
*   **Livrables:** Maquettes ou descriptions détaillées de l'interface utilisateur.

### L6-M5: Frontend - Interface de Gestion des Propositions (Conceptuel)

*   **Description:** Concevoir l'interface utilisateur pour la soumission et la gestion des propositions au sein d'une DAO.
*   **Fonctionnalités Frontend (Conceptuel):**
    *   **Affichage des Propositions:**
        *   Liste des propositions en cours, exécutées, échouées.
        *   Pour chaque proposition : description, destinataire, valeur, données, statut, nombre de confirmations / seuil.
    *   **Soumission d'une Nouvelle Proposition:**
        *   Formulaire pour :
            *   Transfert ETH simple : champs \`destinataire\`, \`montant\`.
            *   Gestion des membres (propositions plus complexes) :
                *   Ajout de propriétaire : champ \`nouvel_propriétaire\`, \`nouveau_seuil\`.
                *   Retrait de propriétaire : champ \`propriétaire_a_retirer\`, \`nouveau_seuil\`.
                *   Changement de seuil : champ \`nouveau_seuil\`.
                *   *(L'UI devra aider à construire le \`data\` pour ces appels au contrat Safe).*
            *   Champ \`description\` pour la proposition.
    *   **Interaction avec les Propositions:**
        *   Bouton "Confirmer" pour les propriétaires éligibles sur les propositions en attente.
        *   Bouton "Exécuter" pour les propriétaires sur les propositions confirmées.
        *   Feedback visuel sur l'état des transactions (envoi, confirmation).
*   **Livrables:** Maquettes ou descriptions détaillées de l'interface utilisateur.

### L6-M6: Intégration Dashboard & Suivi (Conceptuel)

*   **Description:** Intégrer la fonctionnalité DAO dans le dashboard existant.
*   **Fonctionnalités Frontend (Conceptuel):**
    *   Nouvelle section "Mes DAOs" dans le dashboard listant les DAOs créées ou dont l'utilisateur est membre.
    *   Pour chaque DAO listée, un résumé (nom, réseau, nombre de propriétaires, seuil) et un lien vers sa page de gestion détaillée (où les propositions sont gérées).
    *   Notifications (optionnel MVP) pour les nouvelles propositions ou celles nécessitant une action de l'utilisateur.
*   **Livrables:** Maquettes ou descriptions détaillées de l'intégration au dashboard.

### L6-M7: Tests (Backend Principalement) et Documentation API

*   **Description:** Assurer la qualité du backend et documenter les nouvelles APIs.
*   **Actions:**
    1.  **Tests Unitaires Backend:**
        *   Pour les nouveaux services (ex: \`DaoCreationService\`, \`DaoProposalService\` ou méthodes étendues dans des services existants).
        *   Pour les nouveaux contrôleurs API.
    2.  **Tests d'Intégration Backend (si possible):** Tester le flux de création de DAO et de gestion de propositions en moquant uniquement les appels blockchain externes.
    3.  **Documentation API:** Mettre à jour \`docs/api/API_DOCUMENTATION.md\` avec tous les nouveaux endpoints DAO, leurs payloads et réponses.
    4.  **Mise à Jour du Devlog:** Maintenir \`devlog/LOT_6_LOG.md\`.
*   **Livrables:** Suite de tests pour le backend, documentation API à jour, devlog complet.

---

## Prérequis et Dépendances

*   **Contrat(s) Multisig DAO:** Sélection ou développement finalisé en L6-M1.
*   **Services Backend Existant:**
    *   \`ProviderService\` pour l'interaction blockchain (déploiement, envoi de transactions).
    *   \`DeploymentDataService\` (ou un nouveau \`DaoDataService\`) pour la persistance des informations des DAOs et de leurs propositions.
    *   Service d'authentification pour identifier les utilisateurs.
*   **Composants UI Frontend:** Nécessité de développer de nouvelles vues et composants pour la création et la gestion des DAOs.
*   **Lot 5:** Les améliorations du Dashboard (L5-M1) pourraient servir de base pour l'affichage des infos DAO.

---
Ce document servira de guide pour le développement du Lot 6.
