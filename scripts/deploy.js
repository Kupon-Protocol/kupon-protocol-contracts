const contractName1 = "KuponNft";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract1
  const contract1 = await ethers.getContractFactory(contractName1);
  const instance1 = await contract1.deploy();

  console.log("Token address:", instance1.address);

  // verify contract1 on etherscan
  /*
  await sleep(2000);
  await hre.run('verify:verify', {
    address: instance1.address,
    constructorArguments: [],
  })*/

  console.log("Wait a minute and then run this command:");
  console.log("npx hardhat verify --network " + network.name + " " + instance1.address);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });