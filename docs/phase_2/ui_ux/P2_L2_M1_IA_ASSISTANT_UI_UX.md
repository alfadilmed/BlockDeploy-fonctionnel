# P2-L2 M1: AI Config Assistant - UI/UX Design

Ce document détaille la conception de l'interface utilisateur (UI) et de l'expérience utilisateur (UX) pour l'assistant IA de configuration BlockDeploy, dans le cadre de la Milestone 1 (M1) du Lot P2-L2.

## 1. Objectifs UX

- **Guidage Intuitif:** Permettre aux utilisateurs de configurer leurs déploiements avec l'aide de l'IA de manière fluide et naturelle.
- **Confiance et Contrôle:** Assurer que l'utilisateur comprend les suggestions de l'IA et garde le contrôle final sur les configurations.
- **Efficacité:** Réduire le temps et l'effort nécessaires pour configurer un déploiement, en particulier pour les tâches complexes ou répétitives.
- **Accessibilité:** Concevoir une interface utilisable par des profils techniques variés, du débutant à l'expert.

## 2. Parcours Utilisateurs (User Flows)

### 2.1. Parcours 1: Premier Déploiement Guidé (Nouvel Utilisateur)

- **Utilisateur:** Persona "Développeur Junior" ou "Entrepreneur Tech (non expert DevOps)".
- **Objectif:** Déployer une application simple (ex: site statique, blog Node.js) avec l'aide de l'assistant.
- **Étapes:**
    1.  L'utilisateur initie un nouveau déploiement.
    2.  L'assistant IA se présente et propose son aide.
        - *Interface:* Pop-up ou section dédiée "Assistant IA".
        - *Interaction IA:* "Bonjour ! Je suis là pour vous aider à configurer votre déploiement. Quel type d'application souhaitez-vous déployer ?"
    3.  L'utilisateur décrit son besoin (ex: "un blog Ghost", "un site statique pour ma documentation").
    4.  L'IA pose des questions pour affiner le besoin (type de base de données, nom de domaine, région, etc.).
        - *Interface:* Chat ou formulaire interactif.
        - *Interaction IA:* "Parfait. Avez-vous déjà un nom de domaine ? Souhaitez-vous une base de données PostgreSQL ou MySQL ?"
    5.  L'IA suggère une configuration de base et explique les choix principaux.
        - *Interface:* Affichage structuré de la configuration proposée avec des explications pour chaque item.
        - *Interaction IA:* "Voici une configuration de base pour votre blog Ghost. J'ai inclus un service web, une base de données et configuré les variables d'environnement essentielles. Vous pouvez modifier chaque élément."
    6.  L'utilisateur examine, modifie si besoin, et valide la configuration.
        - *Interface:* Champs éditables, options pour demander plus de détails à l'IA sur un point spécifique.
    7.  L'IA confirme la configuration et le déploiement est lancé.
        - *Interaction IA:* "Excellent ! Votre configuration est prête. Le déploiement est en cours."

### 2.2. Parcours 2: Optimisation de Configuration Existante (Utilisateur Expérimenté)

- **Utilisateur:** Persona "Développeur Senior" ou "Responsable DevOps".
- **Objectif:** Analyser une configuration existante pour identifier des optimisations (coût, performance, sécurité).
- **Étapes:**
    1.  L'utilisateur sélectionne un déploiement existant.
    2.  L'utilisateur active l'assistant IA pour cette configuration.
        - *Interface:* Bouton "Analyser avec l'IA" ou onglet "Assistant IA" dans la page de configuration.
    3.  L'utilisateur demande une analyse (ex: "Optimise les coûts", "Vérifie la sécurité", "Améliore la performance pour une charge élevée").
        - *Interaction IA:* "Je vais analyser votre configuration actuelle. Quels sont vos objectifs principaux pour cette optimisation (coût, performance, sécurité) ?"
    4.  L'IA analyse la configuration et présente ses recommandations.
        - *Interface:* Liste de suggestions, avec impact estimé (ex: "-15% coût mensuel", "+20% performance CPU") et niveau de criticité.
        - *Interaction IA:* "J'ai identifié 3 points d'amélioration : 1. Passer à un type d'instance plus petit pour le service X (économie estimée : Y€/mois). 2. Activer le CDN pour vos assets statiques (amélioration de la vitesse de chargement). 3. Mettre à jour la version de la base de données Z pour des correctifs de sécurité."
    5.  L'utilisateur discute des recommandations avec l'IA, demande des précisions.
        - *Interaction IA:* L'utilisateur peut cliquer sur une suggestion pour obtenir plus de détails ou poser des questions comme "Quels sont les risques de passer à une instance plus petite ?"
    6.  L'utilisateur choisit d'appliquer certaines recommandations.
        - *Interface:* Cases à cocher ou boutons pour appliquer les changements.
    7.  L'IA confirme les modifications et met à jour la configuration.

### 2.3. Parcours 3: Dépannage de Configuration (Tout Utilisateur)

- **Utilisateur:** Tout utilisateur rencontrant un problème de déploiement.
- **Objectif:** Identifier la cause d'un échec de déploiement ou d'un comportement inattendu lié à la configuration.
- **Étapes:**
    1.  Un déploiement échoue ou l'application ne fonctionne pas comme prévu.
    2.  L'utilisateur accède à l'assistant IA.
        - *Interface:* Message d'erreur proposant l'aide de l'IA, ou accès manuel.
    3.  L'utilisateur décrit le problème (ex: "Mon application Node.js ne démarre pas, les logs indiquent une erreur de connexion à la base de données"). L'IA peut aussi avoir accès aux logs d'erreurs.
        - *Interaction IA:* "Je vois que votre déploiement a échoué. Pouvez-vous me donner plus de détails sur l'erreur ou me permettre d'accéder aux logs ?"
    4.  L'IA analyse la configuration en lien avec le problème décrit et les logs.
    5.  L'IA propose des pistes de solution ou des vérifications à effectuer.
        - *Interface:* Suggestions de points à vérifier dans la configuration, commandes de diagnostic à lancer.
        - *Interaction IA:* "Il semble y avoir un problème avec les identifiants de votre base de données. Veuillez vérifier les variables d'environnement `DB_USER` et `DB_PASSWORD`. Vous pouvez aussi tester la connexion manuellement avec [commande]."
    6.  L'utilisateur effectue les vérifications/modifications suggérées.
    7.  L'IA peut assister l'utilisateur dans l'application des correctifs.

## 3. Wireframes Conceptuels et Maquettes

Cette section sera développée avec des représentations visuelles.

### 3.1. Intégration de l'Assistant

- **Option 1: Panneau Latéral Flottant/Dédié**
    - Un panneau qui peut être ouvert/fermé, affichant l'interface de chat avec l'IA.
    - *Avantages:* Toujours accessible, n'interrompt pas le flux principal de configuration.
    - *Inconvénients:* Peut prendre de la place sur l'écran.
    - `[Wireframe conceptuel: Schéma d'une page BlockDeploy avec un panneau IA à droite]`

- **Option 2: Modale d'Interaction**
    - L'assistant s'ouvre dans une fenêtre modale pour des interactions spécifiques.
    - *Avantages:* Focus l'attention de l'utilisateur sur l'interaction avec l'IA.
    - *Inconvénients:* Peut interrompre le flux si l'utilisateur a besoin de voir la configuration en même temps.
    - `[Wireframe conceptuel: Schéma d'une modale IA superposée à la page de configuration]`

- **Option 3: Intégration Contextuelle**
    - Des points d'aide IA apparaissent à côté des champs de configuration complexes.
    - L'IA peut être invoquée pour des sections spécifiques.
    - *Avantages:* Aide ciblée et contextuelle.
    - *Inconvénients:* Peut être moins visible pour une aide générale.
    - `[Wireframe conceptuel: Champ de formulaire avec une icône "Aide IA" à côté]`

### 3.2. Interface de Chat IA

- **Éléments Clés:**
    - Zone de saisie utilisateur.
    - Historique de la conversation.
    - Boutons pour actions rapides (ex: "Suggérer une configuration", "Analyser ma config", "Effacer la conversation").
    - Affichage des réponses de l'IA (texte, blocs de code, listes de suggestions).
    - Possibilité de copier/coller facilement du code ou des configurations.
    - Indicateur de "frappe" de l'IA.
- `[Wireframe conceptuel: Design d'une interface de chat IA typique]`

### 3.3. Affichage des Suggestions de Configuration

- Les suggestions de l'IA (ex: une configuration complète, des optimisations) doivent être présentées de manière claire et structurée.
- **Éléments Clés:**
    - Distinction claire entre la configuration actuelle et les suggestions de l'IA.
    - Explication pour chaque suggestion.
    - Impact estimé (si applicable).
    - Boutons pour "Accepter la suggestion", "Modifier", "Ignorer".
- `[Wireframe conceptuel: Section montrant une config actuelle vs. une config suggérée par l'IA, avec des annotations]`

## 4. Flux Conversationnel IA (Exemples)

### 4.1. Création d'un nouveau service

- **User:** "Je veux créer un nouveau service web."
- **IA:** "Super ! Quel type d'application souhaitez-vous héberger ? (ex: Node.js, Python, Ruby, PHP, Go, Docker image...)"
- **User:** "Node.js"
- **IA:** "Parfait. Avez-vous une version spécifique de Node.js en tête (ex: 18.x, 20.x) ou préférez-vous la dernière version stable ?"
- **User:** "La dernière stable."
- **IA:** "Entendu. Quel est le nom que vous souhaitez donner à ce service ? Et quelle commande faut-il lancer pour démarrer votre application (ex: `npm start`, `node app.js`) ?"
- **User:** "Nom: `webapp-prod`, Commande: `npm run start:prod`"
- **IA:** "Noté. Avez-vous besoin de variables d'environnement spécifiques pour `webapp-prod` ? Si oui, vous pouvez me les lister (ex: `NODE_ENV=production`, `API_KEY=votre_clé`)."
- **User:** "`NODE_ENV=production`, `DATABASE_URL=...`"
- **IA:** "Excellent. Souhaitez-vous configurer un nom de domaine personnalisé pour ce service maintenant ?"
- ... et ainsi de suite.

### 4.2. Demande d'optimisation

- **User:** "Analyse ma configuration `api-gateway` pour des optimisations de coût."
- **IA:** "Je regarde ça. (analyse...) Votre service `api-gateway` utilise une instance de type `t3.large`. D'après l'utilisation moyenne des dernières semaines, une instance `t3.medium` pourrait suffire et vous ferait économiser environ X% par mois. Souhaitez-vous que je vous montre l'impact sur les performances ou que je prépare ce changement ?"
- **User:** "Montre-moi l'impact."
- **IA:** "Passer à `t3.medium` réduirait la capacité CPU de Y% et la mémoire de Z Go. D'après vos métriques, vous utilisez en moyenne A% de CPU et B Go de mémoire. Le risque de dégradation des performances semble faible. Voulez-vous plus de détails sur les pics d'utilisation ?"

## 5. Principes d'Interaction

- **Proactivité Discrète:** L'IA peut proposer son aide mais ne doit pas être intrusive.
- **Feedback Clair:** L'utilisateur doit toujours savoir ce que l'IA est en train de faire (ex: "Analyse en cours...", "Recherche dans la documentation...").
- **Gestion des Limites:** L'IA doit être capable de dire quand elle ne sait pas ou ne peut pas aider, et éventuellement diriger vers la documentation ou le support.
- **Personnalisation (Optionnelle/Future):** L'IA pourrait apprendre des préférences de l'utilisateur au fil du temps.

## 6. Maquettes Conceptuelles (À venir)

Cette section sera remplie avec des maquettes visuelles plus détaillées (ex: Figma, Sketch) une fois les wireframes validés.
- Maquette 1: Interface principale de BlockDeploy avec point d'entrée de l'Assistant IA.
- Maquette 2: Interface de chat de l'Assistant IA.
- Maquette 3: Affichage d'une suggestion de configuration complète.
- Maquette 4: Affichage d'une liste de recommandations d'optimisation.

Ce document sera mis à jour au fur et à mesure de l'avancement de la conception et des retours utilisateurs.
