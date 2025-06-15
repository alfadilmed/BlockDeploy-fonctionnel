# P2-L1-M2: Définition du Périmètre MVP - Constructeur de dApp Front-End

**Date:** $(date -I)

## 1. Introduction

Ce document définit le périmètre du Produit Minimum Viable (MVP) pour le constructeur de dApp frontend de BlockDeploy. L'objectif est de livrer un ensemble de fonctionnalités de base qui apportent une valeur immédiate aux utilisateurs, tout en établissant une fondation solide pour des itérations futures.

## 2. Objectifs du MVP

- Permettre aux utilisateurs de créer des interfaces frontend simples pour interagir avec leurs smart contracts (déployés via BlockDeploy ou importés).
- Offrir une expérience utilisateur "Drag & Drop" de base.
- Se concentrer sur des cas d'usage Web3 courants et à forte demande.
- Valider les concepts techniques clés de l'architecture du constructeur.

## 3. Cas d'Usage Cibles pour le MVP

Le MVP se concentrera sur la capacité à construire les types de dApps/pages suivants :

1.  **Page de Présentation de Token ERC-20:**
    - Afficher le nom, symbole, totalSupply.
    - Permettre à l'utilisateur de vérifier son propre solde (`balanceOf`).
    - *Optionnel MVP:* Un bouton simple pour transférer des tokens (si l'utilisateur a des tokens et est connecté).
2.  **Page de Mint Simple pour NFT ERC-721 (Collection Existante):**
    - Afficher le nom et le symbole de la collection.
    - Permettre à un utilisateur de minter un NFT de la collection (en appelant une fonction `mint` ou `safeMint` du contrat). L'utilisateur pourrait avoir à fournir un `tokenId` ou un `tokenURI` si le contrat l'exige et si ce n'est pas géré automatiquement.
    - Afficher les NFTs possédés par l'utilisateur connecté pour cette collection.
3.  **Interface de Base pour DAO Simple:**
    - Afficher des informations clés de la DAO (ex: nom, trésorerie si lisible).
    - Lister les propositions en cours (lecture seule).
    - *Optionnel MVP:* Bouton pour créer une proposition simple (ex: transfert de fonds depuis la trésorerie).

## 4. Composants "Drag & Drop" Disponibles dans le MVP

La palette de composants disponibles pour le "Drag & Drop" sera limitée mais fonctionnelle :

### 4.1. Composants Web3 Essentiels:
    - **Connexion Wallet:** Bouton permettant de connecter/déconnecter un wallet (compatible avec les standards courants, ex: RainbowKit ou équivalent intégré).
    - **Affichage d'Adresse Connectée:** Affiche l'adresse du portefeuille connecté.
    - **Sélecteur de Réseau:** Permet de s'assurer que l'utilisateur est sur le bon réseau pour la dApp.
    - **Lecteur de Données Contrat (Générique):**
        - Permet de configurer l'appel à une fonction `view` d'un contrat spécifié (adresse + ABI partiel) et d'afficher le résultat.
        - L'utilisateur devra spécifier la fonction et potentiellement ses arguments (simples).
    - **Bouton d'Interaction Contrat (Générique):**
        - Permet de configurer l'appel à une fonction `write` d'un contrat.
        - L'utilisateur spécifie la fonction et fournit les arguments via des champs de formulaire simples générés ou liés.
        - Gère la signature de la transaction et le feedback (loading, success, error).
    - **Affichage de Solde ETH/Token ERC-20:** Affiche le solde d'un token ERC-20 spécifique ou le solde ETH pour l'adresse connectée ou une adresse spécifiée.
    - **Liste/Affichage de NFTs ERC-721:**
        - Affiche les NFTs d'une collection donnée possédés par une adresse.
        - Affiche les métadonnées de base (image, nom) si le `tokenURI` est accessible.

### 4.2. Composants UI Standards:
    - **Texte/Paragraphe:** Pour afficher du texte statique ou dynamique (lié à des données de contrat).
    - **Titre (Heading).**
    - **Image:** Pour afficher des images statiques (uploadées ou via URL).
    - **Bouton Standard:** Bouton simple pour des actions non-blockchain ou pour déclencher des logiques UI.
    - **Conteneur/Boîte (Div):** Pour structurer la mise en page.
    - **Champ de Saisie (Input):** Pour permettre à l'utilisateur de saisir des données (ex: arguments pour une fonction de contrat).

## 5. Gestion des Smart Contracts

- **Import de Contrats Déployés via BlockDeploy:** Accès facile aux contrats déjà déployés par l'utilisateur via BlockDeploy. Leurs adresses et ABIs partiels seraient pré-chargés.
- **Import de Contrats Externes (MVP Simplifié):**
    - L'utilisateur fournit l'adresse du contrat et son ABI (format JSON).
    - Pas de vérification d'ABI complexe pour le MVP, l'utilisateur est responsable de la validité.
- **Sélection du Contrat Actif:** L'utilisateur doit pouvoir spécifier avec quel contrat les composants Web3 interagissent sur une page donnée ou une section.

## 6. Fonctionnalités de Publication et d'Hébergement (MVP)

- **Prévisualisation en Direct:** L'utilisateur doit pouvoir voir un aperçu de sa dApp en cours de construction.
- **Publication Simplifiée:**
    - Option 1: Télécharger les fichiers statiques de la dApp (HTML, JS, CSS) pour hébergement manuel par l'utilisateur.
    - *Optionnel MVP (si faisable rapidement):* Publication en un clic sur un service d'hébergement statique type IPFS (via un service tiers comme Pinata/NFT.storage si BlockDeploy a déjà une intégration) ou Netlify/Vercel (via un compte utilisateur).

## 7. Fonctionnalités Exclues du MVP

- Logique conditionnelle complexe ("if this, then that") dans l'interface.
- Workflows multi-étapes complexes.
- Gestion avancée des utilisateurs et des rôles au sein de la dApp générée (au-delà de la connexion wallet).
- Base de données backend personnalisée pour la dApp générée.
- Thèmes graphiques multiples ou personnalisation CSS très avancée (se concentrer sur une base propre et fonctionnelle).
- Collaboration en temps réel sur la construction de la dApp.
- Place de marché de templates de dApp.

## 8. Conclusion

Le périmètre MVP vise à fournir un outil fonctionnel pour des cas d'usage Web3 simples, en validant l'approche "Drag & Drop" et l'intégration avec les smart contracts. Les retours utilisateurs sur ce MVP seront cruciaux pour prioriser les fonctionnalités des versions futures.

---
*Ce document est une première définition du périmètre et pourra être ajusté en fonction des découvertes des phases de conception architecturale et UI/UX.*
