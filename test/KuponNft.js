const { expect } = require("chai");

describe("KuponNft contract", function () {
  let contract;
  let issuer;

  beforeEach(async function () {
    [issuer] = await ethers.getSigners();

    const KuponNft = await ethers.getContractFactory("KuponNft");

    contract = await KuponNft.deploy(
      "30-min video chat",
      "30MIN",
      10
    );
  });

  it("checks the NFT name", async function () {
    const name = await contract.name();

    expect(name).to.equal("30-min video chat");
  });

  it("checks the NFT symbol", async function () {
    const symbol = await contract.symbol();

    expect(symbol).to.equal("30MIN");
  });

  it("checks the NFT max supply", async function () {
    const maxSupply = await contract.maxSupply();

    expect(maxSupply).to.equal(10);
  });

});
