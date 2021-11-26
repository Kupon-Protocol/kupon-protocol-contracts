# Kupon Protocol contracts

## Quickstart

Create a `.env` file with the following keys:

```bash
ALCHEMY_API_KEY=enter-key-here
DEPLOYER_PRIVATE_KEY=enter-key-here
ETHERSCAN_API_KEY=enter-key-here
```

> Note that you can use an API key from PolygonScan as the value for ETHERSCAN_API_KEY in case you're deploying to Polygon or Mumbai.

Compile:

```bash
npx hardhat compile
```

Test:

```bash
npx hardhat test
```

Run on localhost:

```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

Deploy to Mumbai testnet

```bash
npx hardhat run scripts/deploy.js --network mumbai
```

Verify contract on Etherscan/Polygonscan:

```bash
npx hardhat verify --network mumbai <contract-address>
```