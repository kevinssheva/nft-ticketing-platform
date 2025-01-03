import Web3 from "web3";
import TicketMarketplace from "@/app/abi/TicketMarketplace.json";

// TODO: implement blockchain code
const HARDHAT_NETWORK_URL = "http://localhost:8545";

export function getOracle(web3: Web3) {
  return new web3.eth.Contract(DynamicPricingOracle.abi, "0x4939F8b88743C72c7eceA682F1A23CeA481be450");
}

export function getContract(web3: Web3) {
  return new web3.eth.Contract(TicketMarketplace.abi, "0xE75454865977313C05545D7188146fEC33eca217");
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

  ticketData.forEach(async (ticketDatum) => {
    await marketplace.methods.createTicket(
      ticketDatum.ticketId,
      ticketDatum.eventId,
      ticketDatum.eventName,
      ticketDatum.dates,
      ticketDatum.zone,
      ticketDatum.seat,
      ticketDatum.priceInWei,
      ticketDatum.limit,
      ticketDatum.sellerAddress,
      ticketDatum.isHold
    );
 
    await marketplace.methods.addProduct(ticketDatum.ticketId);
  });
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
