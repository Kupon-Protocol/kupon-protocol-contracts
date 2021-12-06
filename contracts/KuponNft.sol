// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "base64-sol/base64.sol";

contract KuponNft is ERC721, Ownable, ERC721Enumerable, ERC721Burnable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdTracker;
  uint256 public maxSupply;
  uint256 public price;
  string public description;
  string public image;

  // claims are initiated by NFT holders
  mapping (uint256 => address) public claims; // token ID => address that burned the token (the last holder)

  // completions are made by the NFT issuer (values move from "claims" to "completed" when service is completed)
  mapping (uint256 => address) public completed; // token ID => address that burned the token (the last holder)

  // EVENTS
  event Claim(address indexed owner, uint256 indexed tokenId); // token owner & token ID
  event Completed(uint256 indexed tokenId);

  // CONSTRUCTOR
  constructor(
    string memory _name, 
    string memory _symbol, 
    string memory _description, 
    string memory _image, 
    uint256 _maxSupply,
    uint256 _price,
    address _issuer
  ) ERC721(_name, _symbol) {
<<<<<<< HEAD
    require(_maxSupply > 0, "Supply cannot be zero");
=======
    description = _description;
    image = _image;
>>>>>>> 0ff9db5b2e26a06cc664988917e89d4fd6a8a381
    maxSupply = _maxSupply;
    price = _price;
    transferOwnership(_issuer);
  }

  // READ METHODS

  // get the last owner of a claimed NFT
  function getClaimedNftLastOwner(uint256 _tokenId) public view returns (address) {
    return claims[_tokenId];
  }

  function getCompletedNftLastOwner(uint256 _tokenId) public view returns (address) {
    return completed[_tokenId];
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return string(
      abi.encodePacked(
        "data:application/json;base64,",
        Base64.encode(
          bytes(
            abi.encodePacked(
              '{"name":"', name(), '", ',
              '"description": "', description, '", ',
              '"image": "', image, '"}'
            )
          )
        )
      )
    );
  }

  function totalMinted() public view returns (uint256) {
    return _tokenIdTracker.current();
  }

  // WRITE METHODS

  function mint(address _to) public payable {
    uint256 idTracker = _tokenIdTracker.current();

    require(idTracker < maxSupply, "Mint limit");
    require(msg.value >= price, "Value below price");

    _tokenIdTracker.increment();
    _safeMint(_to, idTracker);
  }

  // Claim means that the NFT holder requests a service/product from the issuer by burning the NFT
  function claim(uint256 _tokenId) public {
    address tokenOwner = ownerOf(_tokenId);

    burn(_tokenId); // this function checks if msg.sender has rights to burn this token

    claims[_tokenId] = tokenOwner;

    emit Claim(tokenOwner, _tokenId);
  }

  // OWNER METHODS

  // After the service/product has been provided, issuer can mark the claim as completed
  function markCompleted(uint256 _tokenId) public onlyOwner {
    require(!_exists(_tokenId), "The NFT has not been claimed/burned yet.");
    require(getClaimedNftLastOwner(_tokenId) != address(0), "The NFT has either been completed already or has not been minted yet.");

    address lastOwner = getClaimedNftLastOwner(_tokenId);

    // move the last owner address from claims to completed mapping
    claims[_tokenId] = address(0);
    completed[_tokenId] = lastOwner;

    emit Completed(_tokenId);
  }

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
