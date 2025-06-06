// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ERC20Advanced
 * @dev Contrat ERC20 amélioré intégrant:
 *      - Fonctionnalités optionnelles: Pausable, Burnable (par détenteur).
 *      - Supply optionnelle: Fixe ou Plafonnée (Capped).
 *      - Rôles (AccessControl): MINTER_ROLE pour la fonction de mint (si Capped).
 *                               PAUSER_ROLE pour les fonctions pause/unpause.
 *                               DEFAULT_ADMIN_ROLE pour la gestion des rôles.
 *      Les décimales sont fixées à 18.
 */
contract ERC20Advanced is ERC20, ERC20Burnable, ERC20Pausable, ERC20Capped, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    // DEFAULT_ADMIN_ROLE est déjà défini dans AccessControl.sol

    bool private _isCapped; // Flag pour indiquer si le contrat est plafonné

    /**
     * @param name_ Nom du token.
     * @param symbol_ Symbole du token.
     * @param initialAdmin L'adresse qui recevra les droits d'administration (DEFAULT_ADMIN_ROLE)
     *                     et les rôles initiaux de MINTER et PAUSER. Elle recevra aussi la supply initiale.
     * @param initialSupply_ La quantité de tokens à minter initialement.
     *                       Si capped, doit être <= cap. Si fixed, c'est la totalSupply.
     * @param cap_ Le plafond maximum pour un contrat Capped. Mettre à initialSupply_ si fixed.
     * @param featuresPausable_ True si le token doit être pausable.
     * @param featuresBurnable_ True si le token doit être burnable (note: ERC20Burnable est hérité).
     * @param featuresCapped_ True si la supply du token doit être plafonnée.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address initialAdmin,
        uint256 initialSupply_,
        uint256 cap_,
        bool featuresPausable_, // Ce flag contrôle l'usage de _pause/_unpause de ERC20Pausable
        bool featuresBurnable_, // Ce flag est informatif, ERC20Burnable est toujours inclus
        bool featuresCapped_
    )
        ERC20(name_, symbol_)
        ERC20Capped(featuresCapped_ ? cap_ : initialSupply_) // Le cap est soit la valeur de cap_, soit initialSupply_ si non-capped
                                                          // pour que _mint ne réverte pas pour un contrat non explicitement capped.
        // ERC20Pausable et ERC20Burnable n'ont pas de constructeur à appeler ici.
    {
        _isCapped = featuresCapped_;

        if (featuresCapped_) {
            require(cap_ > 0, "ERC20Advanced: cap must be > 0 for capped supply");
            require(initialSupply_ <= cap_, "ERC20Advanced: initial supply cannot exceed cap");
        } else {
            // Si ce n'est pas capped, initialSupply_ est la totalSupply fixe.
            // Le cap dans ERC20Capped a été mis à initialSupply_ pour permettre ce mint initial.
            require(cap_ == initialSupply_, "ERC20Advanced: cap must equal initialSupply for fixed supply type");
        }

        // Setup des rôles
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin); // L'admin est minter par défaut
        if (featuresPausable_) {
            _grantRole(PAUSER_ROLE, initialAdmin); // L'admin est pauser par défaut si pausable
        }
        // Le rôle de "burner" est implicite pour tout détenteur via ERC20Burnable.
        // Si un rôle spécifique de burner était nécessaire (pour brûler les tokens d'autrui),
        // il faudrait l'ajouter à AccessControl et modifier burnFrom.

        if (initialSupply_ > 0) {
            _mint(initialAdmin, initialSupply_); // _mint est interne et ne vérifie pas les rôles.
                                                // ERC20Capped.sol s'assure que le cap n'est pas dépassé.
        }

        // Si le contrat n'est pas pausable, on "pause" initialement et on ne donne jamais le rôle PAUSER.
        // Cependant, ERC20Pausable hérité rend les fonctions _pause/_unpause disponibles.
        // Une meilleure approche serait de ne pas hériter de ERC20Pausable si featuresPausable_ est false,
        // ce qui nécessite une génération de code dynamique ou des contrats distincts.
        // Pour ce contrat unique, on contrôle l'accès via le rôle PAUSER.
        if (!featuresPausable_) {
            // Si non pausable, on s'assure qu'il ne peut pas être mis en pause par erreur
            // en ne grantant pas PAUSER_ROLE ou en révoquant si hérité.
            // Ici, on ne le grante pas si featuresPausable_ est false.
        }
    }

    /**
     * @dev Crée `amount` tokens et les assigne à `to`, augmentant la supply totale.
     *      Nécessite que l'appelant ait le `MINTER_ROLE`.
     *      Si le contrat est plafonné (`_isCapped == true`), ne peut pas dépasser le `cap`.
     */
    function mint(address to, uint256 amount) public virtual onlyRole(MINTER_ROLE) {
        require(_isCapped, "ERC20Advanced: token not capped, minting not allowed");
        // La vérification du cap est gérée par ERC20Capped._mint que nous héritons.
        _mint(to, amount);
    }

    /**
     * @dev Met en pause tous les transferts de tokens.
     *      Nécessite que l'appelant ait le `PAUSER_ROLE`.
     *      Ne fait rien si le contrat n'a pas été configuré comme pausable à la création.
     */
    function pause() public virtual override onlyRole(PAUSER_ROLE) {
        // La vérification si le contrat EST pausable (via un flag interne si on n'hérite pas conditionnellement)
        // n'est pas nécessaire si le PAUSER_ROLE n'est accordé qu'aux contrats pausable.
        // Si on voulait un flag interne `_isPausableFeatureEnabled` initialisé au constructeur :
        // require(_isPausableFeatureEnabled, "ERC20Advanced: not pausable");
        _pause(); // Fonction de OpenZeppelin ERC20Pausable.sol
    }

    /**
     * @dev Reprend les transferts de tokens après une pause.
     *      Nécessite que l'appelant ait le `PAUSER_ROLE`.
     */
    function unpause() public virtual override onlyRole(PAUSER_ROLE) {
        // require(_isPausableFeatureEnabled, "ERC20Advanced: not pausable");
        _unpause(); // Fonction de OpenZeppelin ERC20Pausable.sol
    }

    // Les fonctions burn(uint256) et burnFrom(address, uint256) sont héritées de ERC20Burnable.

    // _update hook est utilisé par ERC20, ERC20Pausable, et ERC20Capped.
    // L'ordre d'héritage et les appels `super._update()` gèrent la combinaison des logiques.
    function _update(address from, address to, uint256 value)
        internal
        virtual
        override(ERC20, ERC20Pausable, ERC20Capped)
    {
        super._update(from, to, value);
    }

    // _mint hook est utilisé par ERC20 et ERC20Capped.
    function _mint(address account, uint256 amount)
        internal
        virtual
        override(ERC20, ERC20Capped)
    {
        super._mint(account, amount);
    }

    // On expose la fonction cap() de ERC20Capped
    function cap() public view virtual override(ERC20Capped) returns (uint256) {
        return super.cap();
    }
}
