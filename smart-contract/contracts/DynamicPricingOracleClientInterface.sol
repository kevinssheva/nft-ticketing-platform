// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface DynamicPricingOracleClientInterface {
    function dynamicPricingCallback(uint256 eventId, uint256 price) external;
}
