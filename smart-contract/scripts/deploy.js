const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log('\nMinting ticket...');
  const ticketId = 1;
  const eventId = 1;
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
  const metadata = 'ipfs://QmTicketMetadata';

  const marketplace = await ethers.getContractAt(
    'TicketMarketplace',
    '0x925dC187fC57022d9F3edD86D7DA02D79982b59A'
  );

  const sellerPrivateKey = "c5114526e042343c6d1899cad05e1c00ba588314de9b96929914ee0df18d46b2";

  // Blockchain node URL (Hardhat/Ganache/Infura, etc.)
  const providerUrl = "http://localhost:26802"; // Example: Hardhat or Ganache
  const provider = new ethers.JsonRpcProvider(providerUrl);

  const seller = new ethers.Wallet(sellerPrivateKey, provider);

  const mintTx = await marketplace.connect(seller).createTicket(
    ticketId,
    eventId,
    eventName,
    dates,
    zone,
    seat,
    price,
    limit,
    metadata,
    '0xD8F3183DEF51A987222D845be228e0Bbb932C222',
    true // isHold
  );
  await mintTx.wait();
  console.log('Ticket minted successfully');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error deploying contracts:", error);
    process.exit(1);
  });
