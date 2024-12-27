const ethers = require('ethers');

// JSON of the compiled RewardsOracle contract
const DynamicPricingOracle = require('./DynamicPricingOracle.json');

// Address of the deployed RewardsOracle contract
const DynamicPricingOracleAddress = '0x';

const BLOCKCHAIN_NODE_URL = '';
const PRIVATE_KEY = '';

function calculateDynamicPrice(ticketId) {
  // Example logic: pricing could be based on ticketId or other external data
  const basePrice = ethers.parseUnits('0.1', 'ether');
  return basePrice;
}

async function main() {
  // Get instances of provider and signer to be able to interact with the blockchain
  const provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_NODE_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // Create an instance of deployed oracle contract
  const dynamicPricingOracle = new ethers.Contract(
    DynamicPricingOracleAddress,
    DynamicPricingOracle.abi,
    signer
  );

  console.log('Listening for price requests...');

  dynamicPricingOracle.on(
    'RequestPrice',
    async (requestId, ticketId, requester) => {
      console.log(
        `Received price request: requestId=${requestId}, ticketId=${ticketId}, requester=${requester}`
      );

      // Request dApp business logic to calculate reward
      const price = calculateDynamicPrice(ticketId);
      console.log(
        `Calculated price for ticketId ${ticketId}: ${ethers.utils.formatEther(
          price
        )} ETH`
      );

      try {
        const tx = await dynamicPricingOracle.providePrice(requestId, price);
        console.log(`Sent providePrice transaction: ${tx.hash}`);
        await tx.wait();
        console.log(`Transaction confirmed: ${tx.hash}`);
      } catch (error) {
        console.error('Error sending providePrice transaction:', error);
      }
    }
  );
}

main().catch((error) => {
  console.error(error);
});
