const fs = require("fs");
const yaml = require("js-yaml");
const { Wallet } = require("ethers");

const yamlFilePath = "./network-params.yaml";
let yamlData;

try {
    yamlData = yaml.load(fs.readFileSync(yamlFilePath, "utf8"));
} catch (e) {
    console.error("Error reading YAML file:", e);
    process.exit(1);
}

const wallets = [];
for (let i = 0; i < 10; i++) {
    const wallet = Wallet.createRandom();
    wallets.push({
        address: wallet.address,
        privateKey: wallet.privateKey
    });
}

console.log("Generated Wallets:", wallets);

const walletsJsonPath = "./wallets.json";
try {
    fs.writeFileSync(walletsJsonPath, JSON.stringify(wallets, null, 2), "utf8");
    console.log("Wallets have been saved to wallets.json.");
} catch (e) {
    console.error("Error saving wallets to JSON file:", e);
}

let prefundedAccounts = {};
wallets.forEach((wallet, index) => {
    const balance = index === 0 ? "10ETH" : "1ETH";
    prefundedAccounts[wallet.address] = { balance };
});

yamlData.network_params.prefunded_accounts = JSON.stringify(prefundedAccounts, null, 2);

try {
    fs.writeFileSync(yamlFilePath, yaml.dump(yamlData), "utf8");
    console.log("network-params.yaml has been updated with wallet addresses and balances.");
} catch (e) {
    console.error("Error writing to YAML file:", e);
}

const privateKeys = wallets.map(wallet => wallet.privateKey);

const hardhatConfigPath = "./hardhat.config.js";
let hardhatConfig;

try {
    hardhatConfig = fs.readFileSync(hardhatConfigPath, "utf8");
} catch (e) {
    console.error("Error reading Hardhat config:", e);
    process.exit(1);
}

const accountsMatch = hardhatConfig.match(/accounts: \[(.*?)\]/s);
let existingAccounts = [];

if (accountsMatch && accountsMatch[1]) {
    existingAccounts = accountsMatch[1]
        .split(",")
        .map(account => account.trim().replace(/^'|'$/g, ""));
}

const updatedAccounts = [...existingAccounts, ...privateKeys];

const updatedHardhatConfig = hardhatConfig.replace(
    /accounts: \[.*?\]/s,
    `accounts: [\n    '${updatedAccounts.join("',\n    '")}'\n  ]`
);

try {
    fs.writeFileSync(hardhatConfigPath, updatedHardhatConfig, "utf8");
    console.log("hardhat.config.js has been updated with new private keys.");
} catch (e) {
    console.error("Error writing to Hardhat config:", e);
}
