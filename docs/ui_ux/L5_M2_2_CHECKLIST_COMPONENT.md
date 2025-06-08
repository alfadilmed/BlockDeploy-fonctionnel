## L5-M2.2: Composant Frontend `Checklist` d'Onboarding (UI/UX)

**Objectif:** Décrire le composant React `Checklist` affichant les items d'onboarding.

**Référence:** API Onboarding (L5-M2.1), Items Checklist (L5-M2.3).

### 1. Structure et Affichage
*   **Emplacement:** Widget discret sur Dashboard ou pop-up non modal. Masquable.
*   **UI:**
    *   Titre: "Vos Premiers Pas".
    *   Liste d'items: Icône checkbox (cochée/non), libellé, lien optionnel, tooltip optionnel.
    *   (Opt.) Barre de progression.
    *   Bouton "Masquer".

### 2. Logique du Composant React (Conceptuel)
```typescript jsx
// interface ChecklistItem { key: string; label: string; isCompleted: boolean; link?: string; isAutodetected?: boolean; }
// const OnboardingChecklist: React.FC = () => {
//   const [items, setItems] = useState<ChecklistItem[]>([]);
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     // fetchOnboardingStatus(); // GET /api/v1/user/onboarding-status -> setItems
//   }, []);

//   const handleItemUpdate = async (itemKey: string, completedStatus: boolean) => {
//     // POST /api/v1/user/onboarding/checklist-item { itemKey, isCompleted }
//     // -> Met à jour état local `items`.
//   };

//   // Logique pour complétion automatique (ex: via events pour navigation)
//   // useEffect(() => { if (walletConnected && !getItemStatus('connectedWallet')) handleItemUpdate('connectedWallet', true); }, [walletConnected]);

//   if (!isVisible || items.length === 0) return null;

//   return (
//     <Card className="onboarding-checklist-widget">
//       <Heading as="h5">Vos Premiers Pas</Heading>
//       <ul>
//         {/* {items.map(item => ( <li key={item.key}> <Checkbox checked={item.isCompleted} disabled={item.isAutodetected && item.isCompleted} /> {item.link ? <a href={item.link}>{item.label}</a> : <span>{item.label}</span>} </li> ))} */}
//       </ul>
//       <Button onClick={() => setIsVisible(false)}>Masquer</Button>
//     </Card>
//   );
// };
```
*   Les items (key, label, link, isAutodetected) sont définis (localement ou config).
*   `isAutodetected`: `true` si la complétion est gérée par événements, `false` si l'utilisateur peut cocher (moins courant pour ce type de checklist). Checkboxes pour items auto-détectés sont souvent juste des indicateurs visuels.

### 3. Interaction avec le Backend
*   **Chargement Initial:** `GET /api/v1/user/onboarding-status` pour initialiser l'état des items.
*   **Mise à Jour Statut:** Si un item est complété (détection auto ou action manuelle si permise), appel `POST /api/v1/user/onboarding/checklist-item`.

### 4. Expérience Utilisateur
*   Non intrusif, masquable, disparaît si 100% complété.
*   Motivation via progression.
*   Items pertinents et clairs.

Ce composant guidera les utilisateurs dans l'adoption de BlockDeploy.
