const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const { ethers } = require('hardhat');

module.exports = buildModule('TicketModule', (m) => {
  const adminAddress = ethers.getAddress(
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  );
  // Parameters
  const ticketPrice = m.getParameter('ticketPrice', ethers.parseEther('0.1')); // Default 0.1 ETH
  // const gasPrice = m.getParameter('gasPrice', ethers.parseEther('0.001'));
  const eventName = m.getParameter('eventName', 'Concert Event'); // Default event name
  const metadataURI = m.getParameter('metadataURI', 'ipfs://metadata_hash'); // Default IPFS URI

  // Deploy TicketNFT contract
  const ticketNFT = m.contract('TicketNFT');

  // Deploy TicketMarketplace contract
  const ticketMarketplace = m.contract('TicketMarketplace');

  // Define initial setup logic
  m.call(ticketNFT, 'createTicket', [
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
  ], {
    value: ticketPrice
  });

  // Return deployed contracts
  return { ticketNFT, ticketMarketplace };
});
