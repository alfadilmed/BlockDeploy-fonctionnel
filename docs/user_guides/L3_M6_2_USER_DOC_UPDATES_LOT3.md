## L3-M6.2: Mises à Jour de la Documentation Utilisateur (Lot 3: Dashboard & Onboarding)

**Objectif:** Identifier le contenu à ajouter/mettre à jour dans la doc utilisateur.

### 1. Nouveau Guide: "Naviguer et Utiliser votre Dashboard BlockDeploy"
*   **Cible:** Tous les utilisateurs.
*   **Contenu:**
    *   Intro Dashboard. Accès.
    *   Section "Mes Contrats" (L3-M2.1): Vue liste/grille, infos (Nom Projet, Type, Réseau, Adresse, Statut, Date), filtres, recherche, pagination, accès détail.
    *   Section "Détail Contrat" (L3-M2.2):
        *   "Infos Générales Déploiement": Champs DB (ID, Hash Tx, Adresse Déployeur), liens explorateur.
        *   "Configuration Initiale": Rappel `tokenConfig` (lecture seule).
        *   "Données On-Chain Actuelles (ERC-20)": `name`, `symbol`, `decimals`, `totalSupply`, `balanceOf(owner)`, `fetchedAt`, bouton "Rafraîchir".
        *   (Si L3-M5) "Actions sur Contrat": Utilisation `pause`/`unpause` (signature wallet).
    *   FAQ Dashboard: Statut `pending`/`processing`? Pas de données on-chain? Copier adresse?

### 2. Mise à Jour Page "Aide / Premiers Pas" (`GETTING_STARTED.md`)
*   Ajouter lien vers nouveau guide "Naviguer et Utiliser votre Dashboard BlockDeploy".
*   Mentionner info-bulles: "Cherchez les icônes ❓ pour des explications rapides !"
*   Vérifier lien "Glossaire Web3".

### 3. Mise à Jour Guide "Déployer votre Token ERC-20 Personnalisé"
*   Mentionner explicitement les info-bulles d'aide du formulaire.
*   Ajouter sous-section "Suivre votre déploiement dans le Dashboard" avec lien guide Dashboard.

### 4. Contenu Info-Bulles (Tooltips - L3-M3.1)
*   Contenu défini dans `docs/ui_ux/L3_M3_1_TOOLTIP_IMPLEMENTATION.md`. Assurer accessibilité pour équipe rédaction.

### 5. Contenu Glossaire (`GLOSSARY.md` - L3-M4.1)
*   Vérifier termes pour Dashboard/actions (ex: "Transaction Hash", "Block Explorer", "Owner").

### Style et Ton
*   Clair, accessible, visuels (captures d'écran Dashboard).
