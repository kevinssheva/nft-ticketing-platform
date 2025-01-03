import Web3 from "web3";
import DynamicPricingOracle from "@/app/abi/DynamicPricingOracle.json";
import TicketMarketplace from "@/app/abi/TicketMarketplace.json";

// TODO: implement blockchain code
const CONTRACT_ADDRESS = "";

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
    dates: never[];
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

  await marketplace.methods.requestDynamicPrice(ticketId);

  // TODO: implement time checking whether it's already changed

  const dynamicPrice = await marketplace.methods.dynamicPrices(ticketId);

  await marketplace.methods.buyProduct(ticketId, {
    value: dynamicPrice
  });
}

export async function buyTicket(web3: Web3, ticketId: string, price: string) {
  const marketplace = getContract(web3);

  await marketplace.methods.buyProduct(ticketId, {
    value: price
  });
}
