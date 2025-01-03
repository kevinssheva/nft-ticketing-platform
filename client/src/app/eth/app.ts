import Web3 from 'web3';
import NFTMarketplace from '../abi/TicketMarketplace.json';

const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export function getMarketplaceContract(web3: Web3) {
  return new web3.eth.Contract(NFTMarketplace.abi, CONTRACT_ADDRESS);
}

export async function mintTickets(
  web3: Web3,
  ticketData: {
    ticketId: number;
    eventId: number;
    eventName: string;
    dates: never[];
    zone: string;
    seat: string;
    priceInWei: number;
    limit: any;
    sellerAddress: any;
    isHold: boolean;
  }
) {
  const contract = getMarketplaceContract(web3);

  try {

    // Create the ticket
    await contract.methods
      .createTicket(
        ticketData.ticketId,
        ticketData.eventId,
        ticketData.eventName,
        ticketData.dates,
        ticketData.zone,
        ticketData.seat,
        ticketData.priceInWei,
        ticketData.limit,
        ticketData.sellerAddress,
        ticketData.isHold
      )
      .send({
        from: ticketData.sellerAddress,
      });

    // Add the product
    await contract.methods.addProduct(ticketData.ticketId).send({
      from: ticketData.sellerAddress,
    });
  } catch (error) {
    console.error(`Error processing ticket ${ticketData.ticketId}:`, error);
    throw error; // Re-throw the error if you want to stop the entire process
  }
}

// export async function bid(web3: Web3, account: string, value: number) {
//   const contract = getContract(web3);

//   return contract.methods.newBid().send({
//     from: account,
//     value: web3.utils.toWei(value.toString(), 'ether'),
//   });
// }

// export async function withdraw(web3: Web3, account: string) {
//   const contract = getContract(web3);

//   return contract.methods.withdraw().send({
//     from: account,
//   });
// }

// export async function endAuction(web3: Web3, account: string) {
//   const contract = getContract(web3);

//   return contract.methods.endAuction().send({
//     from: account,
//   });
// }

// export async function getWinner(web3: Web3) {
//   const contract = getContract(web3);

//   return contract.methods.getWinner().call() as Promise<string>;
// }

// export async function getMaxBidAmount(web3: Web3) {
//   const contract = getContract(web3);

//   const result =
//     Number(await contract.methods.getMaxBidAmount().call()) / 10 ** 18;

//   return result;
// }

// export async function getGasPrice(web3: Web3) {
//   return web3.eth.getGasPrice();
// }
