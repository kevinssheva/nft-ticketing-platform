const { ethers } = require('hardhat');
const fs = require('fs');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  // Mint a ticket
  console.log('\nMinting ticket...');
  const ticketId = 3;
  const eventId = 3;
  const eventName = 'Concert XYZ';
  const dates = [
    Math.floor(Date.now() / 1000) + 86400 * 30,
    Math.floor(Date.now() / 1000),
    Math.floor(Date.now() / 1000) + 86400 * 15,
  ];
  const zone = 'VIP';
  const seat = 'A1';
  const price = ethers.parseEther('0.1');
  const limit = 5;
  const metadata = 'ipfs://QmTicketMetadata';

  const mintTx = await marketplace
    .connect(seller)
    .createTicket(
      ticketId,
      eventId,
      eventName,
      dates,
      zone,
      seat,
      price,
      limit,
      metadata,
      seller.address,
      true
    );
  await mintTx.wait();
  console.log('Ticket minted successfully');

  // List ticket in marketplace
  console.log('\nListing ticket in marketplace...');
  const listingPrice = ethers.parseEther('0.15');
  const listTx = await marketplace
    .connect(seller)
    .addProduct(ticketId, listingPrice);
  await listTx.wait();
  console.log('Ticket listed successfully');

  // Request dynamic price
  console.log('\nRequesting dynamic price...');
  const requestTx = await marketplace
    .connect(buyer)
    .requestDynamicPrice(ticketId);
  await requestTx.wait();
  console.log('Dynamic price request sent');

  // Wait for price update
  console.log('Waiting for price update...');
  let isPriceUpdated = false;
  let attempts = 0;
  const maxAttempts = 30;

  while (!isPriceUpdated && attempts < maxAttempts) {
    isPriceUpdated = await marketplace.priceUpdated(ticketId);
    if (!isPriceUpdated) {
      await sleep(1000); // Wait 1 second before checking again
      attempts++;
      process.stdout.write('.');
    }
  }
  console.log(''); // New line after dots

  if (!isPriceUpdated) {
    throw new Error('Timeout waiting for price update');
  }

  console.log('Price updated successfully');
  const dynamicPrice = await marketplace.dynamicPrices(ticketId);
  console.log('Dynamic price set to:', ethers.formatEther(dynamicPrice), 'ETH');

  // Buy ticket
  console.log('\nBuying ticket...');
  const buyTx = await marketplace.connect(buyer).buyProduct(ticketId, {
    value: dynamicPrice,
  });
  await buyTx.wait();
  console.log('Ticket bought successfully');

  // Verify new owner
  const ticketDetails = await marketplace.getTicket(ticketId);
  console.log('\nFinal ticket owner:', ticketDetails.owner);
  console.log('Original seller:', seller.address);
  console.log('Buyer:', buyer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
