const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const { ethers } = require('hardhat');

module.exports = buildModule('TicketModule', (m) => {
  const adminAddress = ethers.getAddress(
    '0xD9211042f35968820A3407ac3d80C725f8F75c14'
  );
  // Parameters
  const ticketPrice = m.getParameter('ticketPrice', ethers.parseEther('0.1')); // Default 0.1 ETH
  // const gasPrice = m.getParameter('gasPrice', ethers.parseEther('0.001'));
  const eventName = m.getParameter('eventName', 'Concert Event'); // Default event name
  const metadataURI = m.getParameter('metadataURI', 'ipfs://metadata_hash'); // Default IPFS URI

  // Deploy TicketMarketplace contract
  const ticketMarketplace = m.contract('TicketMarketplace', [
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  ]);

  // Define initial setup logic
  m.call(
    ticketMarketplace,
    'createTicket',
    [
      1, // TicketID
      101, // EventID
      eventName, // Event Name
      [1893456000, 1893256000, 1893356000], // Event Date, Sell Date, Buy Date (example timestamps)
      'Zone A', // Zone
      'Seat 1', // Seat
      ticketPrice, // Ticket Price
      2, // Limit
      metadataURI, // Metadata URI
      adminAddress, // Owner
      false, // isHold
    ],
    {
      value: ticketPrice,
    }
  );

  // Return deployed contracts
  return { ticketMarketplace };
});
