## L3-M3.1: Implémentation des Info-Bulles (Tooltips) sur Formulaire ERC-20 MVP

**Objectif:** Décrire l'ajout de `Tooltip` aux champs clés du formulaire ERC-20 MVP.

**Référence:** Formulaire ERC-20 MVP (L2-M4.1), Composant `Tooltip` (Lot 1).

### 1. Principe d'Implémentation
*   Utiliser le composant `Tooltip` du UI Kit.
*   Icône d'information (❓ ou `HelpCircle`) à côté des labels/champs.
*   Au survol/clic, le `Tooltip` affiche un texte explicatif concis.
*   Peut contenir des liens vers glossaire/guides.

### 2. Champs Ciblés et Contenu des Tooltips (Formulaire ERC-20 MVP)

**Section 1: Informations Générales du Projet**
*   **`userGivenName`:** "Nom pour votre référence dans le dashboard BlockDeploy. Non stocké sur la blockchain."
*   **`networkName`:** "Blockchain cible. 'Testnets' pour essais (gratuits). 'Mainnets' pour projets live (vrais fonds)." (Note sur Polygon si sélectionné).

**Section 2: Configuration du Token ERC-20**
*   **`tokenConfig.name`:** "Nom complet public de votre token (ex: 'My Token')."
*   **`tokenConfig.symbol`:** "Ticker public de votre token (ex: 'MTK', 3-5 majuscules alphanumériques)."
*   **Décimales (Info):** "Divisibilité du token. 18 est standard (comme Ether), fixé pour ce MVP."
*   **`tokenConfig.supplyType`:**
    *   "Supply Fixe": "Quantité totale créée une fois, non modifiable."
    *   "Supply Plafonnée (Capped)": "Quantité initiale + possibilité pour le propriétaire de minter plus, jusqu'à un 'Plafond Maximum'."
*   **`tokenConfig.initialSupply`:**
    *   (Si Fixe): "Quantité totale de tokens qui existera, envoyée à votre adresse."
    *   (Si Capped): "Quantité à créer immédiatement (<= Plafond), envoyée à votre adresse."
*   **`tokenConfig.cap` (si `supplyType` "capped"):** "Quantité maximale absolue de tokens. Propriétaire peut minter jusqu'à cette limite."
*   **`tokenConfig.features.burnable`:** "Si activé, tout détenteur peut détruire (burn) ses tokens, réduisant la supply en circulation."
*   **`tokenConfig.features.pausable`:** "Si activé, vous (propriétaire) pourrez geler/dégeler temporairement tous les transferts de tokens."

### 3. Implémentation Conceptuelle (Exemple)
```typescript jsx
// // Pour le champ Nom du Token
// <div className="flex items-center space-x-1">
//   <label htmlFor="tokenName">Nom officiel de votre token</label>
//   <Tooltip content="Le nom complet de votre token..."><Icon as={HelpCircle} /></Tooltip>
// </div>
// <Input id="tokenName" name="tokenConfig.name" />
```

### 4. Révision et Itération
*   Contenu des tooltips à revoir pour clarté, concision, exactitude.
*   Tests utilisateurs pour valider l'utilité.
