const { expect } = require("chai");

describe("KuponNft contract", function () {
  let contract;
  let issuer;
  let holder;

  const nftName = "30-min video chat";
  const nftSymbol = "30MIN";
  const nftDescription = "This NFT gives you the right to claim a 30 minute video call with the issuer.";
  const nftImage = "https://i.insider.com/602ee9ced3ad27001837f2ac";
  const nftSupply = 3;
  const nftPriceWei = ethers.utils.parseUnits("0.1", "ether"); // 0.1 ETH or MATIC

  beforeEach(async function () {
    [issuer, holder, notHolder] = await ethers.getSigners();

    const KuponNft = await ethers.getContractFactory("KuponNft");

    contract = await KuponNft.deploy(
      nftName, // name
      nftSymbol, // symbol
      nftDescription, // description
      nftImage, // image URI
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

  it("checks the NFT description", async function () {
    const description = await contract.description();

    expect(description).to.equal(nftDescription);
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
    // holder mints a token
    await contract.connect(holder).mint(holder.address, {
      value: nftPriceWei
    });

    const minted = await contract.totalMinted();
    expect(minted).to.equal(1);

    // claimsCounter should be 0
    const claimsCounter1 = await contract.claimsCounter();
    expect(claimsCounter1).to.equal(0);

    // a user that is not the NFT holder cannot claim it
    await expect(contract.connect(notHolder).claim(0)).to.be.revertedWith('ERC721Burnable: caller is not owner nor approved');
    
    // neither can the issuer claim the NFT they do not hold
    await expect(contract.connect(issuer).claim(0)).to.be.revertedWith('ERC721Burnable: caller is not owner nor approved');
    
    // only holder can make a claim for the service/product
    await expect(contract.connect(holder).claim(0)).to.emit(contract, "Claim").withArgs(holder.address, 0); // token with ID 0

    // claimsCounter should be increased by 1
    const claimsCounter2 = await contract.claimsCounter();
    expect(claimsCounter2).to.equal(1);

    // check claimed NFT last owner
    const lastOwner = await contract.getClaimedNftLastOwner(0); // token ID 0
    expect(lastOwner).to.equal(holder.address);

    const lastOwner2 = await contract.getClaimedNftLastOwner(1); // token ID 1 (hasn't been minted nor claimed yet)
    expect(lastOwner2).to.equal(ethers.constants.AddressZero);

    // completedCounter should be 0
    const completedCounter1 = await contract.completedCounter();
    expect(completedCounter1).to.equal(0);

    // the nonHolder cannot mark the claim as complete
    await expect(contract.connect(notHolder).markCompleted(0)).to.be.revertedWith("Ownable: caller is not the owner"); // token with ID 0
    
    // the holder also cannot mark the claim as complete
    await expect(contract.connect(holder).markCompleted(0)).to.be.revertedWith("Ownable: caller is not the owner"); // token with ID 0
    
    // only the issuer can mark the claim as complete
    await expect(contract.connect(issuer).markCompleted(0)).to.emit(contract, "Completed").withArgs(0); // token with ID 0
    
    // trying to mark the same token as completed again should fail
    await expect(contract.connect(issuer).markCompleted(0)).to.be.revertedWith("The NFT has either been completed already or has not been minted yet."); // token with ID 0
    
    // trying to mark a non-existing token (with ID 1) as completed should also fail
    await expect(contract.connect(issuer).markCompleted(1)).to.be.revertedWith("The NFT has either been completed already or has not been minted yet."); // token with ID 1

    // completedCounter should now be increased to 1
    const completedCounter2 = await contract.completedCounter();
    expect(completedCounter2).to.equal(1);

    // holder mints another token (with ID 1)
    await contract.connect(holder).mint(holder.address, {
      value: nftPriceWei
    });

    // trying to mark an existing token (with ID 1) that has not been claimed yet as completed should fail
    await expect(contract.connect(issuer).markCompleted(1)).to.be.revertedWith("The NFT has not been claimed/burned yet."); // token with ID 1

    // token ID 0 has been marked completed, so the CLAIMS address should be 0x0 now
    const lastOwner3 = await contract.getClaimedNftLastOwner(0);
    expect(lastOwner3).to.equal(ethers.constants.AddressZero);

    // token ID 0 has been marked completed, so the COMPLETED address should be the last holder's address now
    const lastOwner4 = await contract.getCompletedNftLastOwner(0);
    expect(lastOwner4).to.equal(holder.address);

  });

});
