// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./DynamicPricingOracleClientInterface.sol";
import "./DynamicPricingOracleInterface.sol";

contract DynamicPricingOracle is Ownable, DynamicPricingOracleInterface {
    uint256 public requestCounter;

    event RequestPrice(uint256 requestId, uint256 eventId, address requester);

    mapping(uint256 => address) public requests;

    constructor(address owner) Ownable(owner) {}

    function requestDynamicPrice(uint256 eventId, address requester) external {
        requests[requestCounter] = requester;
        emit RequestPrice(requestCounter, eventId, requester);
        requestCounter++;
    }

    function providePrice(uint256 requestId, uint256 price) external onlyOwner {
        address requester = requests[requestId];
        require(requester != address(0), "Invalid requestId");

        DynamicPricingOracleClientInterface(requester).dynamicPricingCallback(
            requestId,
            price
        );
    }
}
