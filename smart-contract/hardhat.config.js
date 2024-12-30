require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.28',
  networks: {
    mainnet: {
      url: process.env.RPC_URL,
      chainId: 585858,
      accounts: [
    '0x285b702eddf2aa34e8bd80ee14d5546bd5b3a963e730892c59df10868d7b64c7',
    '0x03d6f60bb5129ec4beab9ddf9a4c7431de140003cf2ae0e41549fcfdc6199bbb',
    '0xf41d48b9d2d33d6db2d9bba58db7ee19ff45cd28176a90b925dd38030bba1636',
    '0xdf801a3c0ac8108429f1667cc15002a2492436b948244d2ff50405df58e8092e',
    '0x4f16902da531dbb66053ceda31994ddc150db7cc7d6e2fee5278e9d91988f091',
    '0xaa1e975c9d636d28416df64918c5779034326b3c6b93bc0b2f96a58483b89017',
    '0x3496f6a11bb9e5488abc2f0b3cf0fda584f3bc5aaec5f66c86227cea005304bd',
    '0x40cc3755ab43f12f5f1427fa079527f0a348b8ffc64672acb80cd0a165302b68',
    '0xe6858950f1e09d55ed1d94d730afa735dda3aa16dd8aec2ab19db3d5fdb6a20d',
    '0x6fdd5c338da83ab3792287762e0d8619a040e68f1f2c446b3374e063b564fed3'
  ],
    }
  },
};
