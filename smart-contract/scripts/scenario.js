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

  // Mint a ticket
  console.log('\nMinting ticket...');
  const ticketId = 3;
  const eventId = 3;
  const eventName = 'Concert XYZ';
  const dates = [
    Math.floor(Date.now() / 1000) + 86400 * 30, // Event date (30 days from now)
    Math.floor(Date.now() / 1000), // Sell date (now)
    Math.floor(Date.now() / 1000) + 86400 * 15, // Buy date (15 days from now)
  ];
  const zone = 'VIP';
  const seat = 'A1';
  const price = ethers.parseEther('0.1'); // 0.1 ETH
  const limit = 5; // Max tickets per user
  const metadata = 'ipfs://QmTicketMetadata2';

  // const mintTx = await marketplace.connect(seller).createTicket(
  //   ticketId,
  //   eventId,
  //   eventName,
  //   dates,
  //   zone,
  //   seat,
  //   price,
  //   limit,
  //   metadata,
  //   seller.address,
  //   true // isHold
  // );
  // await mintTx.wait();
  console.log('Ticket minted successfully');

  // List ticket in marketplace
  console.log('\nListing ticket in marketplace...');
  const listingPrice = ethers.parseEther('0.15'); // List for 0.15 ETH
  // const listTx = await marketplace
  //   .connect(seller)
  //   .addProduct(ticketId, listingPrice);
  // await listTx.wait();
  console.log('Ticket listed successfully');

  // Request dynamic price
  console.log('\nRequesting dynamic price...');

  // Set up event listener before making the request
  // const priceUpdatePromise = new Promise((resolve, reject) => {
  //   // Set a timeout to prevent hanging
  //   const timeout = setTimeout(() => {
  //     reject(new Error('Price update timeout after 30 seconds'));
  //   }, 30000);

  //   // Listen for the DynamicPriceRequested event
  //   marketplace.once('DynamicPriceRequested', async (tokenId) => {
  //     try {
  //       console.log(`Dynamic price requested for token ${tokenId}`);

  //       // Get the request ID from the oracle
  //       const requestId = (await oracle.requestCounter()) - 1n;
  //       console.log(`Oracle request ID: ${requestId}`);

  //       // Oracle provides price
  //       const dynamicPrice = ethers.parseEther('0.12');
  //       console.log(
  //         `Setting dynamic price to ${ethers.formatEther(dynamicPrice)} ETH`
  //       );

  //       const providePriceTx = await oracle
  //         .connect(owner)
  //         .providePrice(requestId, dynamicPrice);
  //       await providePriceTx.wait();
  //       console.log('Price provided by oracle');

  //       // Give the callback some time to process
  //       await new Promise((r) => setTimeout(r, 1000));

  //       // Check if price was updated
  //       const isPriceUpdated = await marketplace.priceUpdated(ticketId);
  //       const updatedPrice = await marketplace.dynamicPrices(ticketId);

  //       console.log('Price updated status:', isPriceUpdated);
  //       console.log('Updated price:', ethers.formatEther(updatedPrice), 'ETH');

  //       clearTimeout(timeout);
  //       resolve();
  //     } catch (error) {
  //       clearTimeout(timeout);
  //       reject(error);
  //     }
  //   });
  // });

  // Make the request
  // const requestTx = await marketplace
  //   .connect(buyer)
  //   .requestDynamicPrice(ticketId);
  // await requestTx.wait();

  // Wait for price update to complete
  // console.log('Waiting for price update...');
  // await priceUpdatePromise;

  // Buy ticket
  console.log('\nBuying ticket...');
  const buyTx = await marketplace.connect(buyer).buyProduct(ticketId, {
    value: ethers.parseEther('0.2'),
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
