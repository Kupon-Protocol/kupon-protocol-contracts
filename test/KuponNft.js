const { expect } = require("chai");

describe("KuponNft contract", function () {
  let contract;
  let issuer;

  const nftName = "30-min video chat";
  const nftSymbol = "30MIN";
  const nftSupply = 3;
  const nftPriceWei = ethers.utils.parseUnits("0.1", "ether"); // 0.1 ETH or MATIC

  beforeEach(async function () {
    [issuer] = await ethers.getSigners();

    const KuponNft = await ethers.getContractFactory("KuponNft");

    contract = await KuponNft.deploy(
      nftName, // name
      nftSymbol, // symbol
      nftSupply, // supply
      nftPriceWei, // price in wei
      issuer.address
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

  it("mints three tokens and fails at minting the fourth", async function () {
    // mint token 1
    await contract.mint(issuer.address, {
      value: nftPriceWei
    });

    const minted1 = await contract.totalMinted();
    expect(minted1).to.equal(1);

    // mint token 2
    await contract.mint(issuer.address, {
      value: nftPriceWei
    });

    const minted2 = await contract.totalMinted();
    expect(minted2).to.equal(2);

    // mint token 3
    await contract.mint(issuer.address, {
      value: nftPriceWei
    });

    const minted3 = await contract.totalMinted();
    expect(minted3).to.equal(3);

    // fail at minting token 4
    await expect(contract.mint(issuer.address, {
      value: nftPriceWei
    })).to.be.revertedWith('Mint limit');

    const totalSupply = await contract.totalSupply();
    expect(totalSupply).to.equal(minted3);

    // owner balance before withdraw
    const ownerBalanceBefore = await ethers.provider.getBalance(issuer.address);

    // contract balance before withdraw
    const contractBalanceBefore = await contract.provider.getBalance(contract.address);

    // withdraw
    await contract.withdraw();

    // owner balance after withdraw
    const contractBalanceAfter = await contract.provider.getBalance(contract.address);
    expect(contractBalanceBefore).to.be.gt(contractBalanceAfter);

    // contract balance after withdraw
    const ownerBalanceAfter = await ethers.provider.getBalance(issuer.address);
    expect(ownerBalanceBefore).to.be.lt(ownerBalanceAfter); // lt instead of lessThan for BigNumber
  });

  it("holder claims a token and issuer marks it complete", async function () {
    // mint token
    await contract.mint(issuer.address, {
      value: nftPriceWei
    });

    const minted = await contract.totalMinted();
    expect(minted).to.equal(1);

    // holder makes a claim for the service/product
    await expect(contract.claim(0)).to.emit(contract, "Claim").withArgs(issuer.address, 0); // token with ID 0

    // check claimed NFT last owner
    const lastOwner = await contract.getClaimedNftLastOwner(0); // token ID 0
    expect(lastOwner).to.equal(issuer.address);

    const lastOwner2 = await contract.getClaimedNftLastOwner(1); // token ID 1 (hasn't been minted nor claimed yet)
    expect(lastOwner2).to.equal(ethers.constants.AddressZero);

    // TODO: the issuer marks the claim as complete
    await expect(contract.markCompleted(0)).to.emit(contract, "Completed").withArgs(0); // token with ID 0

    // token ID 0 has been marked completed, so the CLAIMS address should be 0x0 now
    const lastOwner3 = await contract.getClaimedNftLastOwner(0);
    expect(lastOwner3).to.equal(ethers.constants.AddressZero);

    // token ID 0 has been marked completed, so the COMPLETED address should be the last holder's address now
    const lastOwner4 = await contract.getCompletedNftLastOwner(0);
    expect(lastOwner4).to.equal(issuer.address);
  });

});
