const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  // Load deployed addresses
  const deployedAddresses = JSON.parse(
    fs.readFileSync('deployedAddresses.json', 'utf8')
  );

  // Get contract factories and signers
  const [owner, seller, buyer] = await ethers.getSigners();

  // Connect to deployed contracts
  const oracle = await ethers.getContractAt(
    'DynamicPricingOracle',
    deployedAddresses.oracle
  );
  const marketplace = await ethers.getContractAt(
    'TicketMarketplace',
    deployedAddresses.marketplace
  );

  console.log('Connected to contracts:');
  console.log('Oracle:', deployedAddresses.oracle);
  console.log('Marketplace:', deployedAddresses.marketplace);
  console.log('\nAccount addresses:');
  console.log('Owner:', owner.address);
  console.log('Seller:', seller.address);
  console.log('Buyer:', buyer.address);

  const products = await marketplace.getListedProducts();
  console.log('Listed products:', products);
  const totalTickets = await marketplace.getTotalTickets();
  console.log('Total Tickets:', totalTickets);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
