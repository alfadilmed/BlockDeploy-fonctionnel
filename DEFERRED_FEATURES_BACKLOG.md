## Registre des Fonctionnalités en Attente (Backlog Différé)

**Objectif:** Maintenir une liste des fonctionnalités et améliorations potentielles pour BlockDeploy qui ont été identifiées mais ne sont pas incluses dans la Phase 1 (MVP+).

### Catégories
*   Modules de Contrats Intelligents (Extensions)
*   Fonctionnalités de la Plateforme & UX/UI
*   Écosystème & Intégrations Avancées

---

### 1. Modules de Contrats Intelligents (Extensions)

| Feature ID | Fonctionnalité                     | Description Sommaire                                                                                                | Module Principal | Complexité Estimée | Notes / Raison du Report                                                                 |
| :--------- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :--------------- | :-------------------: | :--------------------------------------------------------------------------------------- |
| **DF-SC-001** | Taxes sur Transactions ERC-20    | Configurer taxe en % sur transferts ERC-20.                                                                         | ERC-20           |      Moyen à Élevé      | Complexifie contrat, impact gas, audit rigoureux.                                        |
| **DF-SC-002** | Vesting de Tokens ERC-20         | Créer calendriers de libération de tokens.                                                                           | ERC-20           |         Élevé         | Implémentation complexe, UI dédiée.                                                       |
| **DF-SC-003** | Minting Public/Payant NFT        | Permettre mint public payant pour NFTs.                                                                             | NFT              |      Moyen à Élevé      | Gestion paiements, whitelist, limites.                                                  |
| **DF-SC-004** | Lazy Minting pour NFT            | NFTs "préparés", mintés lors du premier achat/transfert.                                                            | NFT              |         Élevé         | Réduit coûts initiaux créateur. Complexité technique (EIP-712).                           |
| **DF-SC-005** | Module DAO Avancé                | Gouvernance plus fine, trésorerie avancée, intégration Snapshot.                                                    | DAO              |         Élevé         | Fonctionnalités avancées post-DAO de base.                                               |
| **DF-SC-006** | Contrats de Staking/Farming      | Déployer contrats simples de staking/farming.                                                                       | Nouveaux         |         Élevé         | Demande importante, hors scope MVP no-code initial.                                    |
| **DF-SC-007** | Splitters de Paiement            | Contrat distribuant fonds entrants à plusieurs adresses.                                                            | Utilitaires      |         Moyen         | Cas d'usage plus spécifique.                                                            |

### 2. Fonctionnalités de la Plateforme & UX/UI

| Feature ID | Fonctionnalité                     | Description Sommaire                                                                                               | Impact Potentiel | Complexité Estimée | Notes / Raison du Report                                                                   |
| :--------- | :--------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :---------------: | :-------------------: | :----------------------------------------------------------------------------------------- |
| **DF-PLT-001** | Messages Guidage Proactifs       | Conseils contextuels basés sur activité utilisateur.                                                                |       Moyen       |         Moyen         | Peut être intrusif. Nécessite analyse comportement.                                      |
| **DF-PLT-002** | Quiz / Auto-évaluations Academy  | Quiz pour articles académie.                                                                                       |      Faible       |      Faible à Moyen      | Ajout itératif au contenu.                                                               |
| **DF-PLT-003** | Stats Utilisateur Dashboard      | Graphiques/chiffres avancés sur activité déploiement.                                                               |       Moyen       |         Moyen         | Nécessite potentiellement services indexation (Moralis, Covalent).                       |
| **DF-PLT-004** | Personnalisation Thème UI        | Choix thème sombre/clair, etc.                                                                                     |      Faible       |         Moyen         | Amélioration confort, non critique MVP.                                                  |
| **DF-PLT-005** | Notifications Avancées           | Notifications temps réel in-app/email.                                                                             |       Moyen       |         Moyen         | Nécessite infra notifications.                                                           |
| **DF-PLT-006** | Support Multilingue              | Traduire interface et contenu académie.                                                                            |       Élevé       |      Moyen à Élevé      | Effort traduction/maintenance. À considérer avec croissance.                             |

### 3. Écosystème & Intégrations Avancées

| Feature ID | Fonctionnalité                     | Description Sommaire                                                                                                  | Impact Potentiel | Complexité Estimée | Notes / Raison du Report                                                                                             |
| :--------- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :---------------: | :-------------------: | :----------------------------------------------------------------------------------------------------------------- |
| **DF-ECO-001** | Constructeur dApp Front-End      | Créer interface web simple pour contrats.                                                                             |       Élevé       |         Élevé         | Feature majeure, Phase 2+.                                                                        |
| **DF-ECO-002** | AI Assistant (aide config)       | IA pour aide configuration contrat, explications.                                                                     |       Élevé       |      Très Élevé       | Nécessite expertise IA, LLM. Prévu bien plus tard.                                                                 |
| **DF-ECO-003** | Intégration Audit Smart Contracts| Partenariat ou outils analyse statique (Slither).                                                                     |       Moyen       |      Moyen à Élevé      | Prévu pour Phase 2.                                                                                                |
| **DF-ECO-004** | Marketplace de Templates         | Développeurs tiers soumettent templates (après audit).                                                                |       Élevé       |         Élevé         | Modèle économique/gouvernance à définir. Phase 3.                                                                |
| **DF-ECO-005** | Extension VS Code / Plugin Nav.  | Outils pour développeurs ou accès rapide.                                                                             |       Moyen       |         Moyen         | Prévu pour Phase 3.                                                                                                |

---
Ce registre sera revu périodiquement.
