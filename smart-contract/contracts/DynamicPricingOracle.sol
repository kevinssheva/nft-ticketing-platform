// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./DynamicPricingOracleClientInterface.sol";
import "./DynamicPricingOracleInterface.sol";

contract DynamicPricingOracle is Ownable, DynamicPricingOracleInterface {
    uint256 public requestCounter;

    event RequestPrice(uint256 requestId, uint256 ticketId, address requester);

    mapping(uint256 => address) public requests;

    mapping(uint256 => uint256) public requestToTicketId;

    constructor(address owner) Ownable(owner) {}

    function requestDynamicPrice(uint256 ticketId, address requester) external {
        requests[requestCounter] = requester;
        requestToTicketId[requestCounter] = ticketId;
        emit RequestPrice(requestCounter, ticketId, requester);
        requestCounter++;
    }

    function providePrice(uint256 requestId, uint256 price) external onlyOwner {
        address requester = requests[requestId];
        require(requester != address(0), "Invalid requestId");

        DynamicPricingOracleClientInterface(requester).dynamicPricingCallback(
            requestToTicketId[requestId],
            price
        );
    }
}
