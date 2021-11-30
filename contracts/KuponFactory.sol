// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// A bare-minimum proof-of-concept
contract KuponFactory {

  // VARIABLES
  mapping (address => address) issuers; // NFT address => issuer address
  address[] nftAddresses; // an array of all NFTs created through this factory

  // READ METHODS

  // WRITE METHODS
  /*
    Create a new KuponNft token contract with params:
    - name and symbol
    - supply
    - price
  */
  function createKuponNft() public {}
}
