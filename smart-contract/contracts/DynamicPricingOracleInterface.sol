// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface DynamicPricingOracleInterface {
    event Request(uint256 requestId, uint256 eventId, address requester);

    function requestDynamicPrice(uint256 eventId, address requester) external;

    function providePrice(uint256 requestId, uint256 price) external;
}
