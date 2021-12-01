// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract KuponNft is ERC721, Ownable, ERC721Enumerable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdTracker;
  uint256 public maxSupply;
  uint256 public price;

  mapping (uint256 => address) public used; // token ID => address that burned the token (the last holder)
  uint256[] usedIds; // an array of token IDs that have been used/burned

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

  // READ METHODS

  // get the last owner of a "used"/burned NFT
  function getUsedNftLastOwner(uint256 _tokenId) public view returns (address) {
    return used[_tokenId];
  }

  function totalMinted() public view returns (uint256) {
    return _tokenIdTracker.current();
  }

  // WRITE METHODS

  // mint
  function mint(address _to) public payable {
    uint256 idTracker = _tokenIdTracker.current();

    require(idTracker < maxSupply, "Mint limit");
    require(msg.value >= price, "Value below price");

    _tokenIdTracker.increment();
    _safeMint(_to, idTracker);
  }

  // burn
    // store the ID into array of burned tokens
    // store the last holder address into the "used" mapping

  // OWNER METHODS
  function withdraw() public payable onlyOwner {
    withdrawTo(msg.sender);
  }

  function withdrawTo(address _address) public payable onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0);

    (bool success, ) = _address.call{value: balance}("");
    require(success, "Transfer failed.");
  }

  // OTHER
  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
