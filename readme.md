# Kupon Protocol contracts

## Quickstart

Create a `.env` file with the following keys:

```bash
ALCHEMY_API_KEY_MUMBAI=enter-key-here
ALCHEMY_API_KEY_ROPSTEN=enter-key-here
DEPLOYER_PRIVATE_KEY=enter-key-here
ETHERSCAN_API_KEY=enter-key-here
POLYGONSCAN_API_KEY=enter-key-here
```

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