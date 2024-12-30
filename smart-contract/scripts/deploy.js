const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  console.log('Deploying contracts...');

  // Deploy Oracle first
  const [owner] = await ethers.getSigners();
  
  const DynamicPricingOracle = await ethers.getContractFactory(
    'DynamicPricingOracle'
  );
  const oracle = await DynamicPricingOracle.deploy(owner.address);
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log('Oracle deployed to:', oracleAddress);

  // Deploy TicketMarketplace
  const TicketMarketplace = await ethers.getContractFactory(
    'TicketMarketplace'
  );
  const marketplace = await TicketMarketplace.deploy(oracleAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log('Marketplace deployed to:', marketplaceAddress);

  // Save the deployed addresses
  const addresses = {
    oracle: oracleAddress,
    marketplace: marketplaceAddress,
    owner: owner.address,
  };

  // Save to a file
  fs.writeFileSync(
    'deployedAddresses.json',
    JSON.stringify(addresses, null, 2)
  );
  console.log('Deployment addresses saved to deployedAddresses.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
