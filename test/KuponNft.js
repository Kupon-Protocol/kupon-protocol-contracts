const { expect } = require("chai");

describe("KuponNft contract", function () {
  let contract;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const KuponNft = await ethers.getContractFactory("KuponNft");

    contract = await KuponNft.deploy();
  });

  it("checks the initial counter value after constructor is run", async function () {
    const counter = await contract.getCounter();

    expect(counter).to.equal(1);
  });

  it("calls increase() and increases the counter to 2", async function () {
    await contract.increase();

    const counter = await contract.getCounter();

    expect(counter).to.equal(2);
  });

});
