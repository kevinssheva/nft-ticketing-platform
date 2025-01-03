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
    '0xdf30f130565e7ee7f5dedac2eaf39af2c1a88ba753eb645b61c842e8070fd5e5',
    '0x8b780178bef5c57f8d050fdda1c5c181f9ae52aed1a4f2ab421a8b314910b99b',
    '0xe08eaf87c51968174ad97086ea1ed625f46a253768337c13482306e8606363fc',
    '0xbab5d165dfa07c820ee2f6858f9fc66f659eae19c466ab388524870b045a7064',
    '0x9f61f658e22e890988a08ee8af35f21789eef345f22c506b7a0d5ee454c9513b',
    '0xa71616491de221bbb351ec2b5d03a6652599fe19fcfbebc8591d5427504eb633',
    '0xa3701a5b9fbf4fe5772f44f3ae1b5797b123a3c0130d52919ebe5f188c7c68ca',
    '0x9282100bc8662aa1c33e7eb842f1715af253e246db6efb95e67765cc503c6b6a',
    '0x796bfdb55afe0879442384564436d28e298bd92761314f285d5d883716ef375c',
    '0x2a5b14a86a5a56e8b4a846d95ab3f33fb7231ead1eda146c2ae86f72fbeabd44'
  ],
    }
  },
};
