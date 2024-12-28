require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.28',
  networks: {
    localnet: {
      url: 'http://127.0.0.1:26802',
      chainId: 585858,
      accounts: [
        'c5114526e042343c6d1899cad05e1c00ba588314de9b96929914ee0df18d46b2',
        'a492823c3e193d6c595f37a18e3c06650cf4c74558cc818b16130b293716106f'
      ]
    }
  },
};
