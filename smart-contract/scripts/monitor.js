const { ethers } = require('hardhat');
const fs = require('fs');

async function monitorOracleRequests(oracleAddress) {
  // Get the Contract Factory to ensure we have the ABI
  const OracleFactory = await ethers.getContractFactory('DynamicPricingOracle');

  // Connect to the deployed contract using the factory's ABI
  const oracle = OracleFactory.attach(oracleAddress);

  try {
    // Get current request count
    const requestCount = await oracle.requestCounter();
    console.log(`Total requests made: ${requestCount.toString()}\n`);

    // Get details for each request
    for (let i = 0; i < requestCount; i++) {
      const requester = await oracle.requests(i);

      console.log(`Request ID: ${i}`);
      console.log(`Requester Address: ${requester}`);

      // Check if requester is a valid address (not zero address)
      const isActive = requester !== ethers.ZeroAddress;
      console.log(`Status: ${isActive ? 'Active' : 'Fulfilled/Cancelled'}\n`);
    }

    // Set up event listener for new requests
    console.log('Monitoring for new requests...');
    oracle.on('RequestPrice', (requestId, eventId, requester) => {
      console.log('\nNew price request detected!');
      console.log(`Request ID: ${requestId}`);
      console.log(`Event ID: ${eventId}`);
      console.log(`Requester: ${requester}`);
    });
  } catch (error) {
    console.error('Error accessing contract:', error);
    throw error;
  }
}

async function main() {
  try {
    // First check if deployment file exists
    if (!fs.existsSync('deployedAddresses.json')) {
      throw new Error(
        'deployedAddresses.json not found. Please deploy contracts first.'
      );
    }

    // Load deployed addresses
    const deployedAddresses = JSON.parse(
      fs.readFileSync('deployedAddresses.json', 'utf8')
    );

    if (!deployedAddresses.oracle) {
      throw new Error('Oracle address not found in deployedAddresses.json');
    }

    console.log('Starting Oracle Request Monitor...');
    console.log('Oracle Address:', deployedAddresses.oracle);

    await monitorOracleRequests(deployedAddresses.oracle);

    // Keep the script running
    process.stdin.resume();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\nStopping monitor...');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

main().catch(console.error);
