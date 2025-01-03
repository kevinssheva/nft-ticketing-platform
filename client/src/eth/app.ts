import Web3 from "web3";
import TicketMarketplace from "@/app/abi/TicketMarketplace.json";

// TODO: implement blockchain code
const HARDHAT_NETWORK_URL = "http://localhost:8545";

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export function getContract(web3: Web3) {
  return new web3.eth.Contract(TicketMarketplace.abi, CONTRACT_ADDRESS);
}

export async function mintTickets(
  web3: Web3,
  ticketData: {
    ticketId: string;
    eventId: string;
    eventName: any;
    dates: Date[];
    zone: string;
    seat: string;
    priceInWei: string;
    limit: any;
    sellerAddress: any;
    isHold: boolean;
  }[]
) {
  const marketplace = getContract(web3);

  for (const ticketDatum of ticketData) {
    try {
      console.log("1");
      const createTicketTx = await marketplace.methods
        .createTicket(
          web3.utils.soliditySha3(ticketDatum.ticketId),
          web3.utils.soliditySha3(ticketDatum.eventId),
          ticketDatum.eventName,
          [
            web3.utils.soliditySha3(ticketDatum.dates[0]),
            web3.utils.soliditySha3(ticketDatum.dates[1]),
            web3.utils.soliditySha3(ticketDatum.dates[2]),
          ],
          ticketDatum.zone,
          ticketDatum.seat,
          ticketDatum.priceInWei,
          ticketDatum.limit,
          ticketDatum.sellerAddress,
          ticketDatum.isHold
        )
        .send({ from: ticketDatum.sellerAddress });

      console.log("2");
      const addProductTx = await marketplace.methods
        .addProduct(ticketDatum.ticketId)
        .send({
          from: ticketDatum.sellerAddress,
        });
      console.log("3");
    } catch (error) {
      console.error(`Failed to mint ticket:`, error);
    }
  }
}

export async function requestDynamicPricing(web3: Web3, ticketId: string) {
  const marketplace = getContract(web3);

  try {
    await marketplace.methods.requestDynamicPrice(ticketId).send();

    // TODO: implement time checking whether it's already changed

    const dynamicPrice = await marketplace.methods.dynamicPrices(ticketId);

    const buyTx = await marketplace.methods
      .buyProduct(ticketId, {
        value: dynamicPrice,
      })
      .send({ from: web3.eth.defaultAccount });
  } catch (error) {
    console.error(`Failed to mint ticket:`, error);
  }
}

export async function buyTicket(web3: Web3, ticketId: string, price: string) {
  const marketplace = getContract(web3);

  try {
    await marketplace.methods
      .buyProduct(ticketId, {
        value: price,
      })
      .send({ from: web3.eth.defaultAccount });
  } catch (error) {
    console.error(`Failed to mint ticket:`, error);
  }
}
