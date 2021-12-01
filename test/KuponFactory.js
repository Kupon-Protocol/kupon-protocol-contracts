const { expect } = require("chai");

describe("KuponFactory contract", function () {
  let factoryContract;
  let issuer;

  beforeEach(async function () {
    [issuer] = await ethers.getSigners();

    const KuponFactory = await ethers.getContractFactory("KuponFactory");
    factoryContract = await KuponFactory.deploy();
  });

  it("creates a new ERC-721 NFT", async function () {
    const nftName = "30-min video chat";
    const nftSymbol = "30MIN";
    const nftSupply = 10;
    const nftPriceWei = ethers.utils.parseUnits("0.1", "ether"); // 0.1 ETH or MATIC

    await factoryContract.createKuponNft(
     nftName,
     nftSymbol,
     nftSupply,
     nftPriceWei 
    );

    const nftAddress = await factoryContract.getNftAddressByIndex(0);

    const nftInstance = await ethers.getContractAt("KuponNft", nftAddress);

    const name = await nftInstance.name();
    expect(name).to.equal(nftName);

    const symbol = await nftInstance.symbol();
    expect(symbol).to.equal(nftSymbol);
  });

});
