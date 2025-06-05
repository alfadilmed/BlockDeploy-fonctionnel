// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // Maintenir Ownable pour les droits de pause/mint (si capped)

/**
 * @title ERC20MVP
 * @dev Un contrat ERC20 de base avec des fonctionnalités optionnelles (Pausable, Burnable, Capped)
 *      pour le Produit Minimum Viable de BlockDeploy.
 *      Les décimales sont fixées à 18.
 */
contract ERC20MVP is ERC20, Ownable {
    // Utiliser des sous-contrats pour la modularité conditionnelle est complexe sans génération de code dynamique.
    // Pour un MVP où le bytecode est pré-compilé pour quelques variantes,
    // il est plus simple d'avoir des contrats distincts ou un contrat avec toutes les options
    // et des booléens pour les activer (ce qui augmente la taille du contrat).
    //
    // Ici, nous allons créer un contrat qui pourrait être la base si on utilisait la génération de code
    // ou si on acceptait une taille de contrat un peu plus grande pour inclure toutes les options conditionnellement.
    // Pour un MVP strict avec des templates pré-compilés, on aurait plusieurs fichiers .sol
    // ou un script qui génère le .sol avant compilation.
    //
    // Alternative pour MVP strict avec bytecode unique par set de features:
    // On pourrait avoir ERC20MVP_Fixed.sol, ERC20MVP_Fixed_Burn.sol, ERC20MVP_Fixed_Paus.sol, ERC20MVP_Fixed_BurnPaus.sol
    // ERC20MVP_Capped.sol, ERC20MVP_Capped_Burn.sol, etc.
    //
    // Pour cet exemple, je vais faire un contrat qui INCLUT les extensions Burnable et Pausable
    // et utilise Capped de manière conditionnelle. Ownable gère les droits.

    bool private _isPausable;
    bool private _isBurnable; // ERC20Burnable est hérité, mais ce flag pourrait contrôler l'accès si besoin
    bool private _isCapped;   // Indique si le contrat est plafonné

    // Pour ERC20Capped
    uint256 private _cap;

    /**
     * @param name_ Le nom du token.
     * @param symbol_ Le symbole du token.
     * @param initialOwner L'adresse qui recevra la supply initiale et deviendra propriétaire.
     * @param supplyParams Un struct contenant les paramètres de supply.
     *                     - initialSupply: La quantité de tokens à minter initialement. Pour un contrat Capped,
     *                                      ceci est la quantité mintée au déploiement, doit être <= cap.
     *                                      Pour un contrat Fixed, ceci est la totalSupply.
     *                     - cap (optionnel): Le plafond maximum pour un contrat Capped. Ignoré si supplyType est Fixed.
     * @param pausable_ True si le token doit être pausable.
     * @param burnable_ True si le token doit être burnable par ses détenteurs.
     * @param capped_ True si la supply du token doit être plafonnée.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner,
        uint256 initialSupply,
        uint256 cap_, // Mettre à 0 si non-capped, ou égal à initialSupply si fixed
        bool pausable_,
        bool burnable_, // Ce flag est pour info, ERC20Burnable est hérité
        bool capped_
    ) ERC20(name_, symbol_) Ownable(initialOwner) {
        _isPausable = pausable_;
        _isBurnable = burnable_; // Le contrat hérite de ERC20Burnable, donc il EST burnable.
                               // Ce flag est plus pour la configuration/métadonnées.
        _isCapped = capped_;

        if (capped_) {
            require(cap_ > 0, "ERC20MVP: cap must be > 0 for capped supply");
            require(initialSupply <= cap_, "ERC20MVP: initial supply cannot exceed cap");
            _cap = cap_;
        } else {
            // Si ce n'est pas capped, initialSupply est la totalSupply fixe.
            // cap_ devrait être égal à initialSupply dans ce cas ou ignoré.
             _cap = initialSupply; // Pour la logique de _mint (qui pourrait vérifier _cap)
        }

        if (initialSupply > 0) {
            _mint(initialOwner, initialSupply);
        }
    }

    /**
     * @dev Retourne le plafond maximum de tokens. Retourne 0 si non plafonné (ou totalSupply si fixe).
     *      Pour être conforme à l'interface ERC20Capped (si on l'héritait directement et conditionnellement).
     */
    function cap() public view virtual returns (uint256) {
        return _cap;
    }

    /**
     * @dev Met en pause tous les transferts de tokens.
     *      Nécessite que le contrat ait été configuré comme pausable.
     *      Seul le propriétaire peut appeler cette fonction.
     */
    function pause() public virtual onlyOwner {
        require(_isPausable, "ERC20MVP: token not pausable");
        // _pause(); // Fonction de OpenZeppelin ERC20Pausable.sol
        // Pour une version qui n'hérite pas directement mais implémente :
        _setPaused(true);
    }

    /**
     * @dev Reprend les transferts de tokens après une pause.
     *      Nécessite que le contrat ait été configuré comme pausable.
     *      Seul le propriétaire peut appeler cette fonction.
     */
    function unpause() public virtual onlyOwner {
        require(_isPausable, "ERC20MVP: token not pausable");
        // _unpause(); // Fonction de OpenZeppelin ERC20Pausable.sol
        _setPaused(false);
    }

    /**
     * @dev Permet au propriétaire de minter de nouveaux tokens, uniquement si le contrat est Capped
     *      et que le cap n'est pas atteint.
     * @param account L'adresse qui recevra les nouveaux tokens.
     * @param amount La quantité de tokens à minter.
     */
    function mint(address account, uint256 amount) public virtual onlyOwner {
        require(_isCapped, "ERC20MVP: token not capped or minting not allowed for fixed supply");
        require(ERC20.totalSupply() + amount <= _cap, "ERC20MVP: cap exceeded");
        _mint(account, amount);
    }

    // --- Logique interne Pausable (si on n'hérite pas de ERC20Pausable directement) ---
    bool private _paused;

    modifier whenNotPaused() {
        require(!paused(), "Pausable: token transfer while paused");
        _;
    }

    modifier whenPaused() {
        require(paused(), "Pausable: token transfer not paused");
        _;
    }

    function paused() public view virtual returns (bool) {
        return _isPausable && _paused; // Le contrat doit être configurable ET effectivement en pause
    }

    function _setPaused(bool status) internal virtual {
        _paused = status;
    }
    // --- Fin Logique interne Pausable ---


    // --- Logique interne Burnable (si on n'hérite pas de ERC20Burnable directement) ---
    // ERC20Burnable.sol d'OpenZeppelin est généralement hérité directement.
    // Si on voulait le faire manuellement (non recommandé pour un MVP) :
    /*
    function burn(uint256 amount) public virtual {
        require(_isBurnable, "ERC20MVP: token not burnable");
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) public virtual {
        require(_isBurnable, "ERC20MVP: token not burnable");
        // Logique d'allowance de ERC20._spendAllowance(account, _msgSender(), amount);
        _burn(account, amount);
    }
    */
    // --- Fin Logique interne Burnable ---


    /**
     * @dev Hook qui est appelé avant tout transfert de tokens, y compris mint et burn.
     *      Modifié pour intégrer la logique de pause.
     *      Si ERC20Pausable et ERC20Burnable sont hérités, leurs propres _beforeTokenTransfer / _update
     *      seraient appelés via super().
     */
    function _update(address from, address to, uint256 value) internal virtual override {
        if (_isPausable) { // Seulement si le contrat est configuré comme pausable
             require(!paused(), "ERC20MVP: token transfer while paused");
        }
        super._update(from, to, value);
    }

    // Pour hériter directement de ERC20Burnable et ERC20Pausable, la structure serait :
    // contract ERC20MVP is ERC20, ERC20Burnable, ERC20Pausable, Ownable { ... }
    // Et on appellerait _pause() et _unpause() directement.
    // La fonction _beforeTokenTransfer (ou _update dans les versions récentes d'OZ)
    // est automatiquement gérée par l'ordre d'héritage.
    // La fonction burn(uint256) et burnFrom(address, uint256) viennent de ERC20Burnable.
    //
    // Si on utilise ERC20Capped, il faut aussi hériter de ERC20Capped et appeler son constructeur.
    // Et la fonction _mint doit être override pour appeler super._mint() qui contient la logique de cap.
    //
    // Pour un MVP avec des templates pré-compilés, il est plus sûr de générer des contrats distincts
    // pour chaque combinaison de features (ex: ERC20Fixed.sol, ERC20FixedPausable.sol, ERC20CappedBurnable.sol, etc.)
    // et le backend choisit le bon bytecode à déployer.
    // Ce fichier ERC20MVP.sol sert alors plus de référence des fonctionnalités maximales.
}

// Contrat exemple pour un ERC20 Fixed, Pausable, Burnable
contract ERC20FixedPausableBurnable is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner_,
        uint256 initialSupply_
    ) ERC20(name_, symbol_) Ownable(initialOwner_) {
        _mint(initialOwner_, initialSupply_);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}

// Contrat exemple pour un ERC20 Capped, Pausable, Burnable, Mintable par Owner
contract ERC20CappedPausableBurnableMintable is ERC20, ERC20Burnable, ERC20Pausable, ERC20Capped, Ownable {
    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner_,
        uint256 initialMintAmount_, // Quantité à minter au déploiement
        uint256 cap_
    ) ERC20(name_, symbol_) ERC20Capped(cap_) Ownable(initialOwner_) {
        require(initialMintAmount_ <= cap_, "Initial mint exceeds cap");
        if (initialMintAmount_ > 0) {
            _mint(initialOwner_, initialMintAmount_);
        }
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount); // ERC20Capped s'occupe de la vérification du cap
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable, ERC20Capped) {
        super._update(from, to, value);
    }
     function _mint(address account, uint256 amount) internal override(ERC20, ERC20Capped) {
        super._mint(account, amount);
    }
}
