import Web3 from "web3";
import DynamicPricingOracle from "@/app/abi/DynamicPricingOracle.json";
import TicketMarketplace from "@/app/abi/TicketMarketplace.json";

// TODO: implement blockchain code
const CONTRACT_ADDRESS = ""

export function getContract(web3: Web3) {
    return new web3.eth.Contract(DynamicPricingOracle.abi, CONTRACT_ADDRESS);
}
