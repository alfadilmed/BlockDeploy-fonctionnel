// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ERC721MVP
 * @dev Contrat NFT ERC-721 de base pour BlockDeploy avec fonctionnalités essentielles.
 */
contract ERC721MVP is ERC721, ERC721Burnable, ERC721Pausable, EIP2981, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;

    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner_,
        string memory baseTokenURI_,
        address royaltyReceiver_,
        uint96 royaltyFractionBps_
    ) ERC721(name_, symbol_) Ownable(initialOwner_) {
        _baseTokenURI = baseTokenURI_;
        _nextTokenId = 1;
        _setDefaultRoyalty(royaltyReceiver_, royaltyFractionBps_);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseTokenURI_) public virtual onlyOwner {
        _baseTokenURI = baseTokenURI_;
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory base = _baseURI();
        return bytes(base).length > 0 ? string(abi.encodePacked(base, Strings.toString(tokenId))) : "";
    }

    function safeMint(address to) public virtual onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function safeMintWithId(address to, uint256 tokenId) public virtual onlyOwner {
        _safeMint(to, tokenId);
        // Gérer _nextTokenId si nécessaire pour éviter collision si on mixe les mints
        if (tokenId >= _nextTokenId) {
            _nextTokenId = tokenId + 1;
        }
    }

    function pause() public virtual onlyOwner {
        _pause();
    }

    function unpause() public virtual onlyOwner {
        _unpause();
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, EIP2981) // Ownable n'hérite pas d'AccessControl, et AccessControl pas nécessaire ici
        returns (bool)
    {
         return super.supportsInterface(interfaceId);
    }
}
