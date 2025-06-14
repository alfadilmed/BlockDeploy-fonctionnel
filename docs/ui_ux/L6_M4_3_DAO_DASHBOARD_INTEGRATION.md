# L6-M4.3 & L6-M6: Frontend - Intégration Dashboard et Suivi des DAOs (Conceptuel)

**Objectif:** Décrire comment les DAOs créées et gérées par l'utilisateur sont intégrées dans le tableau de bord principal de BlockDeploy, permettant une visualisation claire et un accès facile à la gestion.

## 1. Contexte Général

- Cette fonctionnalité combine les exigences de L6-M4.3 (Visualisation des DAOs créées) et L6-M6 (Intégration Dashboard & Suivi).
- L'objectif est de fournir un point d'entrée centralisé pour toutes les DAOs associées à un utilisateur (celles qu'il a créées ou dont il est propriétaire/membre).

## 2. Section "Mes DAOs" dans le Dashboard Principal

Cette section sera un nouvel ajout au tableau de bord principal de l'utilisateur, potentiellement sous un onglet "DAOs" ou comme une section dédiée sur la page d'aperçu du dashboard.

### 2.1. Présentation de la Liste

- **Format :** Une grille de cartes (Cards) est privilégiée pour une présentation visuelle et adaptable. Une vue tabulaire pourrait être une alternative si le nombre de DAOs par utilisateur devient très important.
- **Accès :** Facilement identifiable depuis la navigation principale du dashboard.
- **Bouton d'Action Principal :** Un bouton "Créer une DAO" (ou similaire) sera présent dans cette section, menant à l'assistant de création de DAO (L6-M4.1 / L6-M4.2).

### 2.2. Informations Affichées par Carte DAO

Chaque carte représentant une DAO dans la liste affichera de manière concise :

- **Nom de la DAO :** Le nom donné par l'utilisateur lors de la création (ex: "Trésorerie Projet Alpha").
- **Adresse du Contrat Safe :** L'adresse du multisig, tronquée pour la lisibilité (ex: `0x1234...abcd`). Une icône "copier" à côté permettra de copier l'adresse complète.
- **Réseau :** Le nom ou le logo du réseau sur lequel la DAO est déployée (ex: "Sepolia", "Polygon").
- **Configuration M/N :** Le seuil de signature et le nombre total de propriétaires (ex: "2 sur 3 signataires").
- **Indicateur d'Activité (Optionnel MVP) :** Un badge ou une icône pourrait indiquer s'il y a des propositions en attente de signature par l'utilisateur connecté (ex: "Action requise : 2").
- **Date de Création (Optionnel) :** Pourrait être utile pour le tri ou l'information.

### 2.3. Interactions

- **Clic sur la Carte :** Un clic sur n'importe quelle partie de la carte de la DAO redirigera l'utilisateur vers la "Page de Détail de la DAO" correspondante (décrite section 3).
- **Actions Rapides (Optionnel) :** Une icône "menu" (trois points) sur chaque carte pourrait révéler des actions rapides comme "Voir sur Etherscan" (lien direct vers l'explorateur pour l'adresse du Safe).

### 2.4. État Vide

- Si l'utilisateur n'est associé à aucune DAO (ni en tant que créateur, ni en tant que propriétaire) :
    - Un message clair sera affiché : "Vous n'avez pas encore de DAOs."
    - Un appel à l'action proéminent pour "Créer votre première DAO" sera visible.

Cette section vise à donner un aperçu rapide des DAOs de l'utilisateur et à faciliter l'accès à leurs fonctionnalités de gestion détaillées.

## 3. Page de "Détail de la DAO"

La page de "Détail de la DAO" est accessible en cliquant sur une DAO spécifique depuis la section "Mes DAOs" du dashboard. Elle sert de hub central pour visualiser toutes les informations relatives à une DAO et interagir avec elle.

### 3.1. En-tête de la Page

- **Nom de la DAO :** Affiché de manière proéminente.
- **Adresse du Contrat Safe :** Complète, avec un bouton "Copier" et un lien direct vers l'explorateur de blockchain correspondant au réseau de la DAO (par exemple, Etherscan, Polygonscan).
- **Réseau :** Nom et/ou logo du réseau.
- **Solde Principal (Optionnel MVP) :** Affichage du solde en ETH de la DAO et potentiellement des principaux tokens ERC20 qu'elle détient. Cela nécessiterait des appels supplémentaires pour récupérer ces informations.

### 3.2. Structure de Navigation par Onglets

Pour organiser clairement les informations et fonctionnalités, une navigation par onglets sera utilisée :

#### A. Onglet "Aperçu" (Onglet par défaut)

Cet onglet affichera un résumé des informations vitales de la DAO :

- **Nom de la DAO.**
- **Adresse du Contrat Safe** (avec lien explorateur et copie).
- **Réseau.**
- **Configuration Actuelle :**
    - `Seuil de Signature : M`
    - `Nombre Total de Propriétaires : N`
- **Liste des Propriétaires (Adresses) :**
    - Chaque adresse sera affichée, potentiellement avec un lien vers un explorateur d'adresse ou un profil utilisateur interne si disponible.
    - Un bouton "Copier" pour chaque adresse.
- **Solde de la DAO (si implémenté) :**
    - `ETH : X.XXXX`
    - `Tokens : [Liste des tokens et leurs soldes]`
- **Activité Récente (Optionnel MVP) :**
    - Les 2-3 dernières propositions soumises ou exécutées.

#### B. Onglet "Propositions"

- **Contenu :** Cette section intégrera l'ensemble de l'interface de gestion des propositions telle que définie dans le document `L6_M5_DAO_PROPOSAL_MANAGEMENT_UI.md`.
    - Liste des propositions avec filtres et tri.
    - Cartes de détail pour chaque proposition.
    - Bouton pour créer une nouvelle proposition.
    - Modales/vues pour la soumission, la confirmation et l'exécution des propositions.
- **Objectif :** Fournir une expérience utilisateur fluide pour toutes les opérations liées aux propositions sans quitter le contexte de la DAO sélectionnée.

#### C. Onglet "Membres" (Gestion des Propriétaires)

- **Visualisation :**
    - Liste détaillée des adresses des propriétaires actuels.
    - Pour chaque propriétaire :
        - Adresse complète (avec copie/lien explorateur).
        - Date d'ajout (si disponible).
        - Potentiellement, un alias ou nom d'utilisateur si mappé dans BlockDeploy.
- **Actions (via Propositions) :**
    - Un bouton "Proposer l'Ajout d'un Membre" qui pré-remplira le formulaire de création de proposition (de l'onglet "Propositions") pour l'action "Ajouter un propriétaire".
    - Un bouton "Proposer le Retrait d'un Membre" (à côté de chaque membre listé, ou via un formulaire dédié) qui pré-remplira le formulaire de création de proposition pour l'action "Retirer un propriétaire".
- **Note :** Toutes les modifications de membres doivent passer par le système de propositions M/N. Cet onglet sert de vue et de raccourci pour initier ces propositions.

#### D. Onglet "Paramètres de la DAO"

- **Visualisation :**
    - Affichage clair du seuil de signature actuel.
    - Affichage du nombre total de propriétaires.
- **Actions (via Propositions) :**
    - Un bouton "Proposer un Changement de Seuil" qui pré-remplira le formulaire de création de proposition (de l'onglet "Propositions") pour l'action "Changer le seuil de signature".
- **Autres Paramètres (Avancé/Futur) :**
    - Si d'autres configurations du Safe sont exposées (ex: modules, guards), elles pourraient être visualisées ou gérées ici, toujours via le système de propositions. Pour le MVP, se concentrer sur le seuil.

Cette structure à onglets permet d'étendre facilement les fonctionnalités à l'avenir tout en gardant une interface utilisateur organisée.

## 4. Récupération des Données

Pour alimenter la section "Mes DAOs" et les pages de "Détail de la DAO", le frontend aura besoin d'interagir avec des endpoints API spécifiques du backend.

### 4.1. Liste des DAOs de l'Utilisateur (pour la section "Mes DAOs")

- **Endpoint (Exemple) :** `GET /api/v1/user/daos` ou `GET /api/v1/daos?userId={userId}` ou `GET /api/v1/daos?ownerAddress={userWalletAddress}`.
    - Le backend devra déterminer les DAOs associées à l'utilisateur authentifié (soit parce qu'il en est le créateur enregistré dans la DB BlockDeploy, soit parce que son adresse connectée est listée comme propriétaire dans la configuration on-chain/off-chain d'une DAO).
- **Données attendues par DAO dans la réponse :**
    - `id` (ID interne de la DAO dans la base de données BlockDeploy)
    - `name` (Nom de la DAO)
    - `safeAddress` (Adresse du contrat Safe)
    - `network` (Identifiant du réseau, ex: "sepolia", "polygon")
    - `threshold` (Seuil de signature actuel)
    - `totalOwners` (Nombre total de propriétaires actuels)
    - `userRole` (Optionnel : "creator", "owner", "unknown" - pour adapter l'UI)
    - `pendingActionsForUser` (Optionnel MVP : Nombre de propositions en attente de signature par l'utilisateur connecté)

### 4.2. Détails d'une DAO Spécifique (pour la page "Détail de la DAO")

- **Endpoint (Exemple) :** `GET /api/v1/daos/{daoId}` ou `GET /api/v1/networks/{network}/daos/{safeAddress}`.
    - Si les données de la liste initiale ne sont pas suffisantes, un appel dédié sera nécessaire.
- **Données attendues en plus ou avec plus de détails que la liste :**
    - `name`
    - `safeAddress`
    - `network`
    - `threshold`
    - `owners`: `string[]` (Liste complète des adresses des propriétaires)
    - `version` (Version du contrat Safe, si pertinent)
    - `singletonAddress` (Adresse du mastercopy Safe, si pertinent)
    - `deploymentTxHash` (Hash de la transaction de déploiement)
    - `createdAt` (Date de création dans BlockDeploy)
    - **Solde (Optionnel MVP, pourrait nécessiter des appels séparés ou une agrégation backend) :**
        - `balanceEth`: `string` (Solde en ETH)
        - `tokens`: `Array<{ address: string, symbol: string, name: string, balance: string, decimals: number }>` (Liste des tokens ERC20)
    - **Propositions :** L'onglet "Propositions" utilisera l'endpoint `GET /api/v1/dao/multisig/:network/:daoAddress/proposals` (défini dans L6-M3) pour charger et afficher les propositions de manière paginée.

### 4.3. Considérations

- **Pagination :** Pour la liste des DAOs et la liste des propositions, la pagination sera nécessaire si le nombre d'éléments peut devenir important.
- **Mise en Cache :** Certaines informations (comme la liste des DAOs de l'utilisateur) pourraient être mises en cache côté client pour améliorer les performances et réduire le nombre d'appels API.
- **Mises à Jour en Temps Réel (Hors MVP) :** Pour un produit plus avancé, des solutions de mise à jour en temps réel (WebSockets, Server-Sent Events) pourraient être envisagées pour refléter les changements d'état des propositions ou les nouveaux soldes sans nécessiter un rafraîchissement manuel. Pour le MVP, un bouton "Rafraîchir" ou un rafraîchissement lors de la navigation suffira.

Le backend devra donc exposer des endpoints capables de fournir ces informations, en agrégeant potentiellement des données de la base de données BlockDeploy et des informations on-chain récupérées via le `ProviderService`.

## 5. Wireframes / Maquettes ASCII (Optionnel)

Ces wireframes textuels illustrent l'agencement général des nouvelles sections et pages. Les composants réels suivront le design system de BlockDeploy.

### 5.1. Section "Mes DAOs" dans le Dashboard

```
+-----------------------------------------------------------------------------+
| Dashboard Principal                                                         |
|-----------------------------------------------------------------------------|
| [Onglet: Aperçu] [Onglet: Déploiements] [Onglet: DAOs] [Onglet: Paramètres] |
|-----------------------------------------------------------------------------|
|                                                                             |
|   [ Section: Mes DAOs ]                                                     |
|                                                                             |
|   +---------------------------------------------+      +-----------------+  |
|   | [Filtre: Tous/Mes Créations/Mes Participations] |      | + Créer DAO   |  |
|   +---------------------------------------------+      +-----------------+  |
|                                                                             |
|   +----------------------------------+  +----------------------------------+  |
|   | DAO: Trésorerie Alpha            |  | DAO: Guilde des Développeurs     |  |
|   | Addr: 0x1234...abcd (Copier)     |  | Addr: 0x5678...efgh (Copier)     |  |
|   | Réseau: Sepolia                  |  | Réseau: Polygon                  |  |
|   | Signataires: 2 sur 3             |  | Signataires: 5 sur 7             |  |
|   | Action requise: 1 proposition    |  |                                  |  |
|   |               [Voir Détails ->]  |  |               [Voir Détails ->]  |  |
|   +----------------------------------+  +----------------------------------+  |
|                                                                             |
|   +----------------------------------+                                        |
|   | DAO: Fonds Communautaire         |                                        |
|   | Addr: 0x9abc...6789 (Copier)     |                                        |
|   | Réseau: Mainnet                  |                                        |
|   | Signataires: 1 sur 1             |                                        |
|   |                                  |                                        |
|   |               [Voir Détails ->]  |                                        |
|   +----------------------------------+                                        |
|                                                                             |
|   Si vide: "Vous n'avez pas encore de DAOs. [Créer votre première DAO]"      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 5.2. Page de "Détail de la DAO"

```
+-----------------------------------------------------------------------------+
| BlockDeploy / Mes DAOs / Trésorerie Alpha (0x1234...abcd)                   |
|-----------------------------------------------------------------------------|
|                                                                             |
|   Nom: Trésorerie Alpha                                                     |
|   Adresse: 0x123456789012345678901234567890123456abcd [Copier] [Etherscan]  |
|   Réseau: Sepolia                         Solde ETH: 10.5 ETH (est.)        |
|                                                                             |
|   ------------------------------------------------------------------------  |
|   | [Onglet: Aperçu] | [Onglet: Propositions] | [Onglet: Membres] | [Paramètres] |
|   ------------------------------------------------------------------------  |
|                                                                             |
|   [ Contenu de l'onglet "Aperçu" (par défaut) ]                           |
|                                                                             |
|   Configuration:                                                            |
|     Seuil de Signature: 2                                                   |
|     Nombre de Propriétaires: 3                                              |
|                                                                             |
|   Propriétaires:                                                            |
|     - 0xAlice... (Copier)                                                   |
|     - 0xBob...   (Copier)                                                   |
|     - 0xCarol... (Copier)                                                   |
|                                                                             |
|   Activité Récente:                                                         |
|     - Prop #10: Paiement X (Exécutée)                                       |
|     - Prop #11: Ajout de 0xDavid (En attente)                               |
|                                                                             |
|   ------------------------------------------------------------------------  |
|   (Contenu de l'onglet "Propositions" - cf. L6_M5_DAO_PROPOSAL_MANAGEMENT_UI.md) |
|   ------------------------------------------------------------------------  |
|   (Contenu de l'onglet "Membres")                                           |
|     - Liste détaillée des membres                                           |
|     - [Btn: Proposer Ajout Membre] [Btn: Proposer Retrait Membre (contextuel)]|
|   ------------------------------------------------------------------------  |
|   (Contenu de l'onglet "Paramètres")                                        |
|     - Seuil actuel: 2                                                       |
|     - [Btn: Proposer Changement Seuil]                                      |
+-----------------------------------------------------------------------------+
```

Ces maquettes sont simplifiées et ne représentent pas tous les états ou détails, mais visent à donner une structure visuelle de base.
