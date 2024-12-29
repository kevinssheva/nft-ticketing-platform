const ethers = require('ethers');
const DynamicPricingOracle = require('./DynamicPricingOracle.json');

// Configuration
const config = {
  nodeUrl: 'http://127.0.0.1:36879',
  privateKey:
    'c5114526e042343c6d1899cad05e1c00ba588314de9b96929914ee0df18d46b2',
  oracleAddress: '0xA791D59427B2b7063050187769AC871B497F4b3C',
  retryDelay: 5000, // 5 seconds
  maxRetries: 3,
};

class DynamicPricingOracleNode {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.nodeUrl);
    this.signer = new ethers.Wallet(config.privateKey, this.provider);
    this.oracle = new ethers.Contract(
      config.oracleAddress,
      DynamicPricingOracle.abi,
      this.signer
    );
    this.processedRequests = new Set();
  }

  async calculateDynamicPrice(ticketId) {
    try {
      // Example dynamic pricing logic
      // In a real implementation, you might:
      // 1. Query external APIs for event popularity
      // 2. Check current market conditions
      // 3. Apply time-based pricing rules
      // 4. Consider historical pricing data

      const basePrice = ethers.parseEther('0.2');
      const currentTime = Math.floor(Date.now() / 1000);

      // Example: Increase price by 20% if request is made within last hour
      const priceMultiplier = 1.2;
      const adjustedPrice = basePrice;

      console.log(
        `Calculated price for ticket ${ticketId}: ${ethers.formatEther(
          adjustedPrice
        )} ETH`
      );
      return adjustedPrice;
    } catch (error) {
      console.error('Error calculating dynamic price:', error);
      throw error;
    }
  }

  async providePrice(requestId, ticketId, requester, retryCount = 0) {
    try {
      // Check if we've already processed this request
      if (this.processedRequests.has(requestId.toString())) {
        console.log(`Request ${requestId} already processed, skipping`);
        return;
      }

      // Calculate the dynamic price
      const price = await this.calculateDynamicPrice(ticketId);

      // Send transaction
      console.log(`Providing price for request ${requestId}...`);
      const tx = await this.oracle.providePrice(requestId, price);
      console.log(`Transaction sent: ${tx.hash}`);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

      // Mark request as processed
      this.processedRequests.add(requestId.toString());
    } catch (error) {
      console.error(`Error providing price for request ${requestId}:`, error);

      // Retry logic
      if (retryCount < config.maxRetries) {
        console.log(`Retrying... (${retryCount + 1}/${config.maxRetries})`);
        setTimeout(() => {
          this.providePrice(requestId, ticketId, requester, retryCount + 1);
        }, config.retryDelay);
      } else {
        console.error(`Max retries reached for request ${requestId}`);
      }
    }
  }

  async start() {
    try {
      // Verify connection and contract
      const network = await this.provider.getNetwork();
      console.log(`Connected to network: ${network.name} (${network.chainId})`);

      console.log('Starting oracle node...');
      console.log(
        `Listening for RequestPrice events on ${config.oracleAddress}`
      );

      // Listen for price requests
      this.oracle.on('RequestPrice', async (requestId, ticketId, requester) => {
        console.log(`
          New price request received:
          - Request ID: ${requestId}
          - Ticket ID: ${ticketId}
          - Requester: ${requester}
        `);

        await this.providePrice(requestId, ticketId, requester);
      });

      // Listen for blockchain connection issues
      this.provider.on('error', (error) => {
        console.error('Provider error:', error);
        this.reconnect();
      });
    } catch (error) {
      console.error('Error starting oracle node:', error);
      process.exit(1);
    }
  }

  async reconnect() {
    console.log('Attempting to reconnect...');
    this.provider = new ethers.JsonRpcProvider(config.nodeUrl);
    this.signer = new ethers.Wallet(config.privateKey, this.provider);
    this.oracle = new ethers.Contract(
      config.oracleAddress,
      DynamicPricingOracle.abi,
      this.signer
    );
    await this.start();
  }
}

// Start the oracle node
const oracleNode = new DynamicPricingOracleNode();
oracleNode.start().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down oracle node...');
  process.exit(0);
});
