const { expect } = require("chai");

describe("KuponNft contract", function () {
  let contract;
  let issuer;

  const nftName = "30-min video chat";
  const nftSymbol = "30MIN";
  const nftSupply = 10;
  const nftPriceWei = ethers.utils.parseUnits("0.1", "ether"); // 0.1 ETH or MATIC

  beforeEach(async function () {
    [issuer] = await ethers.getSigners();

    const KuponNft = await ethers.getContractFactory("KuponNft");

    contract = await KuponNft.deploy(
      nftName, // name
      nftSymbol, // symbol
      nftSupply, // supply
      nftPriceWei // price in wei
    );
  });

  it("checks the NFT name", async function () {
    const name = await contract.name();

    expect(name).to.equal(nftName);
  });

  it("checks the NFT symbol", async function () {
    const symbol = await contract.symbol();

    expect(symbol).to.equal(nftSymbol);
  });

  it("checks the NFT max supply", async function () {
    const maxSupply = await contract.maxSupply();

    expect(maxSupply).to.equal(nftSupply);
  });

  it("checks the NFT price", async function () {
    const price = await contract.price();

    expect(price).to.equal(nftPriceWei);
  });

});
