// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KuponNft is ERC721, Ownable, ERC721Enumerable {
  uint256 public maxSupply;
  uint256 public price;

  mapping (uint256 => address) public used; // token ID => address that burned the token (the last holder)

  constructor(
    string memory _name, 
    string memory _symbol, 
    uint256 _maxSupply,
    uint256 _price,
    address _issuer
  ) ERC721(_name, _symbol) {
    maxSupply = _maxSupply;
    price = _price;
    transferOwnership(_issuer);
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
