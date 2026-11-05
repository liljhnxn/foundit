require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");
const path = require("path");

// Function to safely load env files
function loadEnv(filename) {
  try {
    const envPath = path.resolve(__dirname, filename);
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const parts = trimmed.split("=");
          const key = parts[0]?.trim();
          const value = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, "");
          if (key && value && !process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    }
  } catch (e) {}
}

loadEnv(".env.local");
loadEnv(".env");

let privateKey = process.env.PRIVATE_KEY?.trim();
if (privateKey && !privateKey.startsWith("0x") && privateKey.length === 64) {
  privateKey = `0x${privateKey}`;
}

const accounts = privateKey ? [privateKey] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    botchainMainnet: {
      url: "https://rpc.botchain.ai",
      chainId: 677,
      accounts: accounts,
    },
    botchain: {
      url: "https://rpc.botchain.ai",
      chainId: 677,
      accounts: accounts,
    },
  },
  etherscan: {
    apiKey: {
      botchainMainnet: "empty",
      botchain: "empty",
    },
    customChains: [
      {
        network: "botchainMainnet",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
      {
        network: "botchain",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
