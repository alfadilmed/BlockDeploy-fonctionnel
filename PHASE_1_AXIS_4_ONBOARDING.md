## Axe 4: Onboarding Guidé

Objectif : Accompagner les nouveaux utilisateurs dans la découverte et l'utilisation de BlockDeploy pour assurer une première expérience positive et réussie.

### 1. Features (Fonctionnalités Utilisateur)

*   **F4.1: Tutoriel Interactif de Bienvenue (Première Connexion)**
    *   Apparaît automatiquement après la première connexion/inscription.
    *   Présente les 3-4 étapes clés pour utiliser BlockDeploy.
    *   Peut inclure des "hotspots" ou des mises en évidence.
    *   Option de "Passer le tutoriel".
*   **F4.2: Info-Bulles Contextuelles (Tooltips)**
    *   Icônes d'information (❓) à côté des champs complexes.
    *   Au survol/clic, affiche une courte explication.
    *   Liens optionnels vers la documentation/glossaire.
*   **F4.3: Checklists de Démarrage / Premiers Pas**
    *   Section listant les actions recommandées pour bien démarrer.
    *   Items se cochent automatiquement.
    *   Peut être masquée/réduite.
*   **F4.4: Messages de Guidage Proactifs (Optionnel - MVP+)**
    *   Basé sur l'activité de l'utilisateur, afficher des conseils.
    *   Utiliser avec parcimonie.
*   **F4.5: Page "Aide" ou "Premiers Pas" Centralisée**
    *   Page dédiée regroupant tutoriels, FAQs, glossaire.

### 2. Sous-Tâches Techniques (Backend & Frontend)

*   **ST2.1: Système de Suivi de l'État d'Onboarding (Backend/Frontend)**
    *   Backend: Champs utilisateur pour suivi (tutoriel vu, checklist).
    *   API pour mettre à jour cet état.
    *   Frontend: Stockage local (localStorage) pour certains états.
*   **ST2.2: Développement des Composants d'Onboarding (Frontend)**
    *   Composant `Tour` ou `TutorialStepper`.
    *   Composant `Tooltip` amélioré.
    *   Composant `Checklist`.
    *   Logique d'affichage conditionnel.
*   **ST2.3: Contenu de l'Onboarding (Rédactionnel)**
    *   Rédiger les textes pour tutoriel, info-bulles, checklist.
*   **ST2.4: (Optionnel) Système de Déclencheurs pour Messages Proactifs (Frontend/Backend)**

### 3. UI/UX (Frontend)

*   **UI3.1: Design du Tutoriel Interactif**
    *   Visuellement engageant, progression claire.
    *   Boutons "Suivant", "Précédent", "Terminer/Passer".
*   **UI3.2: Intégration des Info-Bulles**
    *   Discret mais identifiable, contenu lisible.
*   **UI3.3: Affichage de la Checklist**
    *   Non intrusive, satisfaction visuelle.
*   **UI3.4: Cohérence Globale du Style.**

### 4. Dépendances

*   **D4.1: Module d'Authentification Utilisateur.** (EXISTANT)
*   **D4.2: Composants UI de Base.** (EXISTANTS)
*   **D4.3: (Optionnel) Bibliothèque de Tutoriel Interactif (Frontend).**
*   **D4.4: Structure BD Utilisateur pour état onboarding.**

### 5. Ordre de Développement Priorisé (Suggestion)

1.  **Priorité 1 (Info-Bulles Essentielles & Page d'Aide):**
    *   Développer/standardiser `Tooltip`.
    *   Implémenter 10-15 info-bulles clés.
    *   Créer page "Aide / Premiers Pas" statique.
2.  **Priorité 2 (Checklist de Démarrage):**
    *   Développer composant `Checklist`.
    *   Logique de suivi simple (localStorage au début).
3.  **Priorité 3 (Tutoriel Interactif de Bienvenue):**
    *   Choisir/développer composant `Tour`.
    *   Définir étapes et contenu.
    *   Intégrer suivi état "tutoriel vu".
4.  **Priorité 4 (Messages Proactifs - Optionnel).**

### 6. Progressive Delivery

*   **Info-bulles en premier.**
*   **Checklist simple (localStorage).**
*   **Tutoriel optionnel au début.**
*   **A/B Test pour messages proactifs.**

### 7. Prérequis Critiques

*   **P7.1: Identification Claire des Points de Friction Utilisateur.**
*   **P7.2: Contenu Rédigé et Validé.**
*   **P7.3: (Si backend) API et BD prêtes pour état onboarding.**
