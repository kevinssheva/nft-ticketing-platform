const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const { ethers } = require('hardhat');

module.exports = buildModule('DynamicPricingOracleModule', (m) => {
  const adminAddress = ethers.getAddress(
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  );

  // Deploy Oracle contracts
  const dynamicPricingOracle = m.contract('DynamicPricingOracle', [
    adminAddress,
  ]);

  // Return deployed contracts
  return {
    dynamicPricingOracle,
  };
});
