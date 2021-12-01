// SPDX-License-Identifier: MIT

import "./KuponNft.sol";

pragma solidity ^0.8.4;

// A bare-minimum proof-of-concept
contract KuponFactory {

  // VARIABLES
  mapping (address => address) public issuers; // NFT address => issuer address
  address[] public nftAddresses; // an array of all NFTs created through this factory

  // READ METHODS
  function getNftAddressByIndex(uint256 _index) public view returns (address) {
    return nftAddresses[_index];
  }

  // TODO: consider if this issuers mapping is really needed
  function getNftIssuer(address _nftAddress) public view returns (address) {
    return issuers[_nftAddress];
  }

  // WRITE METHODS
  function createKuponNft(
    string memory _name, 
    string memory _symbol, 
    uint256 _maxSupply,
    uint256 _price
  ) public returns (address) {

    // create a new ERC-721 contract
    KuponNft nft = new KuponNft(_name, _symbol, _maxSupply, _price);

    // store the address into the NFT addresses array
    nftAddresses.push(address(nft));

    // map the NFT address with the issuer's address
    issuers[address(nft)] = msg.sender;

    return address(nft);
  }
}
