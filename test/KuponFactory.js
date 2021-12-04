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

    // create a new NFT contract
    await factoryContract.createKuponNft(
     nftName,
     nftSymbol,
     nftSupply,
     nftPriceWei
    );

    // get the NFT contract instance
    const nftAddress = await factoryContract.getNftAddressByIndex(0);
    const nftInstance = await ethers.getContractAt("KuponNft", nftAddress);

    // check if name, symbol and owner are correct
    const name = await nftInstance.name();
    expect(name).to.equal(nftName);

    const symbol = await nftInstance.symbol();
    expect(symbol).to.equal(nftSymbol);

    const owner = await nftInstance.owner();
    expect(owner).to.equal(issuer.address);

    // check if the NFT address is correctly assigned to the issuer in the issuers mapping
    const nftAddressOfIssuer = await factoryContract.nftOfIssuerByIndex(issuer.address, 0);
    expect(nftAddressOfIssuer).to.equal(nftAddress);

    // get an array of NFT addresses by a single issuer
    const nftsOfIssuer = await factoryContract.getNftsByIssuer(issuer.address);
    expect(nftsOfIssuer).to.have.members([nftAddress]);
  });

  it("creates multiple ERC-721 token instances", async function () {
    const instances = [
      {
        "name": "Name1",
        "symbol": "Symbol1",
        "supply": 10,
        "price": ethers.utils.parseUnits("0.1", "ether")
      },
      {
        "name": "Name2",
        "symbol": "Symbol2",
        "supply": 50,
        "price": ethers.utils.parseUnits("0.1", "ether")
      },
      {
        "name": "Name3",
        "symbol": "Symbol3",
        "supply": 100,
        "price": ethers.utils.parseUnits("0.1", "ether")
      },
      {
        "name": "Name4",
        "symbol": "Symbol4",
        "supply": 150,
        "price": ethers.utils.parseUnits("0.1", "ether")
      }
    ];

    instances.forEach(async instance => {
      await factoryContract.createKuponNft(
        instance.name,
        instance.symbol,
        instance.supply,
        instance.price
      )}); 

    // verify instances and ERC-721 count
    const issuerNfts = await factoryContract.getNftsByIssuer(issuer.address);
    expect(issuerNfts).to.have.lengthOf(instances.length);

  });

  it("does not allow a token with no supply", async function () {
    const nftName = "Invalid NFT";
    const nftSymbol = "INV";
    const nftSupply = 0;
    const nftPriceWei = ethers.utils.parseUnits("0.1", "ether");

    // attempt to create NFT contract
    expect(factoryContract.createKuponNft(
      nftName,
      nftSymbol,
      nftSupply,
      nftPriceWei
    )).to.be.revertedWith("Owner cannot deploy zero supply tokens");
    
  });

});
