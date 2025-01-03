#!/bin/bash

# Enable strict mode for error handling
set -euo pipefail

kurtosis run github.com/ethpandaops/ethereum-package --args-file ./network-params.yaml --image-download always --enclave nft-ticket

# Extract the RPC port dynamically
PORT=$(kurtosis enclave inspect nft-ticket | grep "rpc: 8545/tcp" | grep -oh "127.0.0.1:[0-9]*" | head -n 1 | cut -d':' -f2)

# Construct the RPC URL
RPC_URL="http://127.0.0.1:$PORT"

# Export the RPC_URL as an environment variable
export RPC_URL

# Write the RPC_URL to a .env file for persistence
echo "RPC_URL=$RPC_URL" > .env

# Log the RPC URL
echo "RPC URL set to: $RPC_URL"

# Copy the .env file to the oracle folder
cp .env ../oracle/.env

# Log the success of copying the .env file
echo ".env file copied to the oracle folder"

# Deploy contracts
npx hardhat run scripts/deploy.js --network mainnet

# Copy deployedAddresses.json to the oracle folder
cp ./deployedAddresses.json ../oracle/deployedAddresses.json

# Log the success of copying the deployedAddresses.json file
echo "deployedAddresses.json file copied to the oracle folder"

# Copy wallets.json to the oracle folder
cp ./wallets.json ../oracle/wallets.json

# Log the success of copying the wallets.json file
echo "wallets.json file copied to the oracle folder"