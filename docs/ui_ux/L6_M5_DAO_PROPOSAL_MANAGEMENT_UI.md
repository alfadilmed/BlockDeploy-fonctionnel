# L6-M5: Frontend - Interface de Gestion des Propositions DAO (Conceptuel)

**Objectif:** Décrire l'interface utilisateur (UI) et l'expérience utilisateur (UX) pour la soumission, l'affichage et la gestion des propositions au sein d'une DAO multisig (inspirée de Gnosis Safe) dans l'application BlockDeploy.

## 1. Contexte et Emplacement

L'interface de gestion des propositions est une partie centrale de l'interaction avec une DAO spécifique.

- **Accès Principal :**
    - Depuis le tableau de bord principal de l'utilisateur, une section "Mes DAOs" (décrite dans L6-M6) listera toutes les DAOs auxquelles l'utilisateur est lié (créateur ou propriétaire).
    - En cliquant sur une DAO dans cette liste, l'utilisateur accédera à une page de "Détail de la DAO".
    - Cette page de "Détail de la DAO" contiendra plusieurs onglets ou sections, dont l'un sera proéminemment intitulé "**Propositions**". C'est ici que l'interface de gestion des propositions sera implémentée.
- **Alternative d'Accès (Optionnel) :**
    - Des notifications pourraient également mener directement à une proposition spécifique nécessitant l'attention de l'utilisateur.
- **Permissions :**
    - La visualisation des propositions est publique pour toute personne ayant accès à la page de la DAO.
    - Les actions de création, confirmation, et exécution de propositions sont restreintes aux adresses propriétaires de la DAO et nécessiteront une connexion wallet. L'interface doit clairement indiquer si l'utilisateur connecté a les droits pour interagir ou s'il est en mode "lecture seule".

## 2. Affichage des Propositions

L'affichage des propositions se fera sous forme d'une liste. Chaque proposition sera représentée par une carte individuelle pour une lecture claire et concise.

### 2.1. Structure de la Liste des Propositions

- **Conteneur Principal :** Une section dédiée sur la page de détail de la DAO.
- **Tri et Filtres :**
    - **Filtres par Statut :** Des boutons ou un menu déroulant permettront de filtrer les propositions par :
        - "Toutes"
        - "En attente de confirmations" (transactions soumises mais n'ayant pas atteint le seuil)
        - "Prêtes à exécuter" (transactions ayant atteint le seuil mais pas encore exécutées)
        - "Exécutées avec succès"
        - "Échouées" (transactions exécutées mais qui ont échoué on-chain)
        - "Annulées/Rejetées" (si ce statut est géré explicitement)
    - **Tri :** Un menu déroulant permettra de trier les propositions par :
        - "Date de création (plus récentes en premier)" (défaut)
        - "Date de création (plus anciennes en premier)"
        - "Statut"
        - "Nombre de confirmations"
- **État Vide :** Si aucune proposition n'existe pour la DAO (ou ne correspond aux filtres), un message clair sera affiché (par exemple : "Aucune proposition à afficher pour cette DAO." ou "Aucune proposition ne correspond à vos filtres.").

### 2.2. Carte de Proposition Individuelle

Chaque carte de proposition affichera les informations suivantes :

- **ID de la Proposition :** Un identifiant unique (ex: `Prop #123` ou un hash tronqué).
- **Titre/Description :** La description fournie par l'utilisateur lors de la création de la proposition. Si absente, une description générée automatiquement basée sur l'action (ex: "Transfert de 0.5 ETH à 0x123...").
- **Statut Actuel :** Clairement visible avec une icône et/ou un badge de couleur :
    - 🔵 **En attente de confirmations**
    -🟡 **Prête à exécuter**
    - ✅ **Exécutée avec succès**
    - ❌ **Échouée**
    - ⚫ **Annulée/Rejetée** (si applicable)
- **Détails de l'Action Proposée :**
    - **Type d'Action :** (ex: "Transfert ETH", "Ajout de Propriétaire", "Changement de Seuil")
    - **Transfert ETH :**
        - `Destinataire : 0xAbCd...EfGh`
        - `Montant : 1.23 ETH`
    - **Ajout de Propriétaire :**
        - `Nouveau Propriétaire : 0xIjKl...MnOp`
        - `Nouveau Seuil (si modifié) : 3`
    - **Retrait de Propriétaire :**
        - `Propriétaire à Retirer : 0xQrSt...UvWx`
        - `Nouveau Seuil (si modifié) : 2`
    - **Changement de Seuil :**
        - `Nouveau Seuil : 2`
    - **Données Brutes (`data`) :** Un lien ou un bouton "Voir détails techniques" pourra afficher le champ `data` complet dans une modale ou une section extensible, pour les utilisateurs avancés.
- **Progression des Confirmations :**
    - Texte : `Signatures : 2 / 3`
    - Visuel (optionnel) : Une petite barre de progression.
    - Une liste des adresses ayant confirmé (peut-être dans un tooltip ou une section extensible).
- **Initiateur (Proposé par) :** Adresse de l'utilisateur ayant soumis la proposition (ex: `Proposé par : 0xYzAb...CdEf`).
- **Date de Soumission :** Date et heure de création de la proposition.
- **Date d'Exécution/Échec :** Si applicable.
- **Boutons d'Action Contextuels :** (Détaillés dans la section 4)
    - "Confirmer" (si l'utilisateur est propriétaire et n'a pas confirmé)
    - "Exécuter" (si l'utilisateur est propriétaire et la proposition est prête)
    - "Annuler/Rejeter" (si cette fonctionnalité est implémentée et que l'utilisateur a les droits)

Un clic sur la carte pourrait afficher une vue plus détaillée de la proposition, potentiellement dans une modale ou une page dédiée si les informations sont nombreuses.

## 3. Soumission d'une Nouvelle Proposition

Un bouton proéminent (par exemple, "➕ Créer une Proposition") sera toujours visible sur la page de gestion des propositions de la DAO (si l'utilisateur connecté est un propriétaire). Cliquer sur ce bouton ouvrira une modale ou une nouvelle vue dédiée au formulaire de création.

Le formulaire sera structuré en plusieurs étapes ou sections dynamiques.

### 3.1. Étape 1 : Choix du Type de Proposition

L'utilisateur doit d'abord sélectionner le type d'action qu'il souhaite proposer. Cela déterminera les champs de formulaire suivants.

- **Options disponibles (pour le MVP) :**
    - **Transférer des fonds (ETH/ERC20 tokens)**
    - **Ajouter un propriétaire**
    - **Retirer un propriétaire**
    - **Changer le seuil de signature**
    - **Transaction personnalisée** (pour utilisateurs avancés, permettant de spécifier `to`, `value`, `data` manuellement)

### 3.2. Étape 2 : Remplir les Détails de la Proposition

En fonction du type choisi à l'étape 1, les champs suivants seront présentés :

#### A. Transférer des Fonds

- **Champ `Destinataire` (Requis) :**
    - Input type `text` pour l'adresse Ethereum du destinataire.
    - Validation du format de l'adresse.
- **Champ `Montant` (Requis) :**
    - Input type `number`.
    - Sélecteur pour l'unité (ETH, ou un token ERC20 si la DAO en possède et que cette fonctionnalité est supportée). Pour le MVP, se concentrer sur ETH.
- **Champ `Description` (Requis) :**
    - Input type `textarea` pour une description lisible de la proposition.
    - Exemple : "Paiement pour services de design à [Nom/Entité]".
- **Construction du `data` :**
    - Pour un transfert ETH simple, le champ `data` sera `0x`.
    - Si des transferts ERC20 sont supportés dans le futur, l'UI aidera à construire le `data` pour `transfer(address, uint256)`.

#### B. Ajouter un Propriétaire

- **Champ `Nouveau Propriétaire` (Requis) :**
    - Input type `text` pour l'adresse Ethereum du nouveau propriétaire.
    - Validation du format de l'adresse.
    - Vérification que l'adresse n'est pas déjà propriétaire.
- **Champ `Nouveau Seuil` (Optionnel) :**
    - Input type `number`.
    - Si laissé vide, le seuil actuel de la DAO est conservé.
    - Si rempli, ce sera le nouveau seuil après l'ajout du propriétaire.
    - Validation : `0 < nouveau_seuil <= nombre_actuel_de_propriétaires + 1`.
- **Champ `Description` (Requis) :**
    - Exemple : "Ajouter [Nom/Adresse] comme nouveau signataire".
- **Construction Assistée du Champ `data` :**
    - L'UI sélectionnera la fonction `addOwnerWithThreshold(address owner, uint256 _threshold)` du contrat Safe.
    - `owner` sera l'adresse du nouveau propriétaire.
    - `_threshold` sera le nouveau seuil (ou le seuil actuel si non modifié).
    - L'interface générera le `calldata` encodé pour cet appel.

#### C. Retirer un Propriétaire

- **Champ `Propriétaire à Retirer` (Requis) :**
    - Menu déroulant listant les propriétaires actuels de la DAO.
    - L'utilisateur sélectionne l'adresse à retirer.
- **Champ `Nouveau Seuil` (Optionnel) :**
    - Input type `number`.
    - Si laissé vide, le seuil actuel de la DAO est conservé (ou ajusté si nécessaire pour ne pas être supérieur au nombre de propriétaires restants).
    - Si rempli, ce sera le nouveau seuil après le retrait.
    - Validation : `0 < nouveau_seuil <= nombre_actuel_de_propriétaires - 1`.
    - L'UI doit s'assurer que le retrait ne rend pas le seuil invalide (par exemple, seuil de 3 avec seulement 2 propriétaires restants). Une logique de validation/suggestion intelligente est nécessaire ici.
- **Champ `Description` (Requis) :**
    - Exemple : "Retirer [Nom/Adresse] des signataires".
- **Construction Assistée du Champ `data` :**
    - L'UI sélectionnera la fonction `removeOwner(address prevOwner, address owner, uint256 _threshold)` du contrat Safe.
    - `owner` sera l'adresse du propriétaire à retirer.
    - `prevOwner` sera l'adresse d'un propriétaire précédent dans la liste chaînée des propriétaires du Safe (nécessite une logique pour le déterminer, souvent l'adresse qui précède `owner` ou une adresse sentinelle si `owner` est le premier). Le Safe{Core} SDK devrait simplifier cette détermination.
    - `_threshold` sera le nouveau seuil.
    - L'interface générera le `calldata` encodé.

#### D. Changer le Seuil de Signature

- **Champ `Nouveau Seuil` (Requis) :**
    - Input type `number`.
    - Validation : `0 < nouveau_seuil <= nombre_actuel_de_propriétaires`.
- **Champ `Description` (Requis) :**
    - Exemple : "Modifier le seuil de signature de M à N".
- **Construction Assistée du Champ `data` :**
    - L'UI sélectionnera la fonction `changeThreshold(uint256 _threshold)` du contrat Safe.
    - `_threshold` sera le nouveau seuil.
    - L'interface générera le `calldata` encodé.

#### E. Transaction Personnalisée (Avancé)

- **Champ `Adresse Destinataire (to)` (Requis) :**
    - Input type `text`. Validation format Ethereum.
- **Champ `Valeur (value)` (Optionnel, défaut à 0) :**
    - Input type `number` (pour ETH).
- **Champ `Données (data)` (Optionnel, défaut à `0x`) :**
    - Input type `textarea` pour le `calldata` hexadécimal.
- **Champ `Description` (Requis) :**
    - Input type `textarea`.

### 3.3. Étape 3 : Revue et Soumission

- Un résumé de la proposition est affiché, y compris :
    - Le type d'action.
    - Les paramètres clés.
    - Une estimation du gas (si possible, via simulation).
    - La description.
- Bouton "Soumettre la Proposition".
    - Cliquer dessus initiera la transaction de soumission via le wallet de l'utilisateur (appel à `submitTransaction` du Safe, qui peut nécessiter une signature de l'initiateur).
    - Gestion des états de chargement et de feedback (succès/échec de la soumission).

L'objectif principal de l'UI pour la construction du `data` est de masquer la complexité des appels de fonction du contrat Safe à l'utilisateur final pour les opérations courantes, tout en offrant une option "Transaction Personnalisée" pour les cas d'usage avancés.

## 4. Interaction avec les Propositions Existantes

Les interactions principales avec les propositions existantes sont la confirmation (signature) et l'exécution. Ces actions sont typiquement réservées aux propriétaires de la DAO.

### 4.1. Confirmation d'une Proposition (Signature)

- **Condition d'Affichage du Bouton "Confirmer" :**
    - La proposition est dans un état "En attente de confirmations".
    - L'utilisateur connecté est un propriétaire de la DAO.
    - L'utilisateur connecté n'a pas encore confirmé cette proposition.
- **Interface du Bouton :**
    - Libellé : "Confirmer" ou "Signer pour Approuver".
    - Style : Clair et distinct des autres actions.
- **Processus de Confirmation :**
    1.  L'utilisateur clique sur "Confirmer".
    2.  Une modale de confirmation peut apparaître, résumant l'action qu'il s'apprête à signer.
    3.  L'utilisateur est invité à signer un message ou une transaction via son wallet connecté (correspondant à l'appel `approveHash` ou à la fourniture d'une signature pour `execTransaction` off-chain, selon l'implémentation backend/SDK).
    4.  **Feedback :**
        - Pendant la signature/l'envoi : Indicateur de chargement sur le bouton ou la carte de la proposition.
        - En cas de succès : Notification de succès ("Proposition confirmée !"). La carte de la proposition est mise à jour (nombre de confirmations, statut si celui-ci change en "Prête à exécuter").
        - En cas d'échec : Message d'erreur clair (par exemple, "Signature refusée", "Erreur réseau").

### 4.2. Exécution d'une Proposition

- **Condition d'Affichage du Bouton "Exécuter" :**
    - La proposition est dans un état "Prête à exécuter" (c'est-à-dire que le seuil de confirmations M/N est atteint).
    - L'utilisateur connecté est un propriétaire de la DAO. (Certaines implémentations de Safe permettent à quiconque d'exécuter une transaction signée, mais il est courant de restreindre cela aux propriétaires dans l'UI pour des raisons de clarté).
- **Interface du Bouton :**
    - Libellé : "Exécuter".
    - Style : Souvent un bouton d'action primaire, potentiellement avec une couleur distinctive (par exemple, vert).
- **Processus d'Exécution :**
    1.  L'utilisateur clique sur "Exécuter".
    2.  Une modale de confirmation finale apparaît, résumant l'action et avertissant des implications (par exemple, "Cette action va maintenant transférer les fonds / modifier la configuration de la DAO.").
    3.  L'utilisateur est invité à envoyer une transaction via son wallet connecté (correspondant à l'appel `execTransaction` du contrat Safe, qui paiera le gas).
    4.  **Feedback :**
        - Pendant l'envoi de la transaction : Indicateur de chargement.
        - En cas de succès de la transaction on-chain : Notification de succès ("Proposition exécutée !"). La carte de la proposition est mise à jour (statut "Exécutée avec succès", date d'exécution).
        - En cas d'échec de la transaction on-chain : Message d'erreur clair (par exemple, "L'exécution a échoué sur la blockchain. Raison : [Message d'erreur de la transaction si disponible]"). La carte de la proposition est mise à jour (statut "Échouée").

### 4.3. Autres Interactions (Optionnel pour MVP)

- **Annuler/Rejeter une Proposition :**
    - Si une proposition n'est plus souhaitée, il pourrait y avoir un mécanisme pour l'annuler. Cela nécessiterait une action M/N elle-même (une proposition pour annuler une autre proposition) ou une logique spécifique si le contrat Safe le permet directement. Pour un MVP, cela peut être hors scope.
- **File d'Attente et Nonce :**
    - Pour les utilisateurs avancés, afficher le nonce de la proposition Safe peut être utile. Gnosis Safe gère une file d'attente de transactions basées sur les nonces. L'UI pourrait refléter cela si plusieurs propositions sont prêtes à être exécutées.

L'objectif est de rendre ces interactions aussi intuitives que possible, en guidant l'utilisateur à travers les étapes de signature et d'exécution qui sont fondamentales au fonctionnement d'un multisig.

## 5. Wireframes / Maquettes ASCII (Optionnel)

Ces wireframes ASCII donnent une idée générale de l'agencement. Les composants réels utiliseront le style du design system de BlockDeploy.

**A. Page de Détail de la DAO - Onglet Propositions :**

```
+--------------------------------------------------------------------------+
| BlockDeploy - Ma DAO Incroyable (0x123...)                               |
|--------------------------------------------------------------------------|
| [Onglet: Infos Générales] [Onglet: Propositions] [Onglet: Membres] [Onglet: Paramètres] |
|--------------------------------------------------------------------------|
|                                                                          |
|   [ Section: Propositions ]                                              |
|                                                                          |
|   +--------------------------------------------------+  +--------------+ |
|   | [Filtres: Tous/En Attente/Exécutées] [Tri: Date] |  | ➕ Créer Prop.| |
|   +--------------------------------------------------+  +--------------+ |
|                                                                          |
|   +--------------------------------------------------------------------+ |
|   | ID: Prop #124  Titre: Transfert de 0.5 ETH à Bob                    | |
|   | Statut: 🔵 En attente   Confirmations: 1/2   Proposé par: 0xAlice   | |
|   | Destinataire: 0xBob       Montant: 0.5 ETH                         | |
|   |                                                 [Btn: Confirmer]   | |
|   +--------------------------------------------------------------------+ |
|                                                                          |
|   +--------------------------------------------------------------------+ |
|   | ID: Prop #123  Titre: Ajouter Carol comme propriétaire              | |
|   | Statut: 🟡 Prête à exécuter Confirmations: 2/2 Proposé par: 0xDave | |
|   | Nouveau Propriétaire: 0xCarol   Seuil: 2/3                       | |
|   |                                                 [Btn: Exécuter]    | |
|   +--------------------------------------------------------------------+ |
|                                                                          |
|   +--------------------------------------------------------------------+ |
|   | ID: Prop #122  Titre: Paiement fournisseur X                       | |
|   | Statut: ✅ Exécutée    Confirmations: 3/3    Proposé par: 0xEve     | |
|   | Exécutée le: 2024-05-15                                            | |
|   +--------------------------------------------------------------------+ |
|                                                                          |
|   [Pagination si nécessaire]                                             |
|                                                                          |
+--------------------------------------------------------------------------+
```

**B. Modale/Vue de Création de Proposition :**

```
+------------------------------------------------------+
| Créer une Nouvelle Proposition                       |
|------------------------------------------------------|
| Type de Proposition: [Sélecteur: Transfert/Ajout...] |
|------------------------------------------------------|
|                                                      |
|   [Champs spécifiques au type sélectionné]           |
|   Destinataire: [Input 0x123...]                     |
|   Montant (ETH): [Input 0.5]                         |
|   Description: [Textarea: Paiement à Bob...]         |
|                                                      |
|------------------------------------------------------|
| [Btn: Annuler]                       [Btn: Soumettre] |
+------------------------------------------------------+
```

## 6. États et Feedback Utilisateur

Une gestion claire des états et un feedback utilisateur opportun sont essentiels pour une bonne UX, surtout lors d'interactions avec la blockchain.

- **États de Chargement :**
    - Lors de la soumission d'une proposition, confirmation, ou exécution :
        - Les boutons d'action afficheront un indicateur de chargement (spinner).
        - Les boutons pourront être désactivés pour éviter les clics multiples.
        - Un message global type "Traitement en cours..." peut s'afficher.
    - Lors du chargement initial des propositions : Un squelette d'interface (skeleton loader) pour les cartes de propositions.

- **Feedback de Succès :**
    - Notifications (toast) claires et concises pour :
        - "Proposition soumise avec succès !"
        - "Proposition confirmée !"
        - "Proposition exécutée avec succès !"
    - Mise à jour dynamique de l'interface :
        - La liste des propositions se rafraîchit ou la proposition concernée met à jour son statut, ses confirmations, etc.

- **Feedback d'Erreur :**
    - Notifications (toast) ou messages d'erreur inline expliquant le problème :
        - Erreurs de validation de formulaire (ex: "Adresse invalide", "Le seuil doit être positif").
        - Erreurs de signature du wallet (ex: "Signature refusée par l'utilisateur").
        - Erreurs de transaction blockchain (ex: "Transaction échouée : [raison si disponible]", "Pas assez de fonds pour le gas").
        - Erreurs API (ex: "Impossible de récupérer les propositions, veuillez réessayer").
    - Les erreurs doivent être aussi spécifiques que possible.

- **Indications Visuelles :**
    - Utilisation de couleurs et d'icônes pour renforcer le statut des propositions et le résultat des actions.
    - Tooltips pour expliquer des éléments complexes ou des icônes.
