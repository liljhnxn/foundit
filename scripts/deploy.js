const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

function updateEnvFile(filePath, address, chainId, rpcUrl, explorerUrl) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    
    // Update contract address
    if (content.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      content = content.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`
      );
    } else {
      content += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
    }

    // Update chain ID if provided
    if (chainId) {
      if (content.includes("NEXT_PUBLIC_CHAIN_ID=")) {
        content = content.replace(
          /NEXT_PUBLIC_CHAIN_ID=.*/,
          `NEXT_PUBLIC_CHAIN_ID=${chainId}`
        );
      }
    }

    // Update RPC URL if provided
    if (rpcUrl) {
      if (content.includes("NEXT_PUBLIC_RPC_URL=")) {
        content = content.replace(
          /NEXT_PUBLIC_RPC_URL=.*/,
          `NEXT_PUBLIC_RPC_URL=${rpcUrl}`
        );
      }
    }

    // Update explorer if provided
    if (explorerUrl) {
      if (content.includes("NEXT_PUBLIC_BLOCK_EXPLORER=")) {
        content = content.replace(
          /NEXT_PUBLIC_BLOCK_EXPLORER=.*/,
          `NEXT_PUBLIC_BLOCK_EXPLORER=${explorerUrl}`
        );
      }
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${path.basename(filePath)} with contract address: ${address}`);
  }
}

async function main() {
  console.log("==========================================");
  console.log("Starting deployment of FoundIt...");
  console.log("==========================================");

  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No deployer signer found. Please check PRIVATE_KEY in .env");
  }
  const deployer = signers[0];
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const isMainnet = chainId === 677;
  const tokenSymbol = isMainnet ? "BOT" : "BOHR";
  const explorerBase = isMainnet ? "https://scan.botchain.ai" : "https://scan.bohr.life";
  const rpcUrl = isMainnet ? "https://rpc.botchain.ai" : "https://rpc.bohr.life";

  console.log(`Network: ${hre.network.name} (Chain ID: ${chainId})`);
  console.log(`Deploying from account: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} ${tokenSymbol}`);

  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || hre.ethers.parseUnits("20", "gwei");
  console.log(`Current Gas Price: ${hre.ethers.formatUnits(gasPrice, "gwei")} gwei`);

  const FoundIt = await hre.ethers.getContractFactory("FoundIt");
  
  // Estimate gas for deployment
  const deployTx = await FoundIt.getDeployTransaction();
  const estimatedGas = await hre.ethers.provider.estimateGas(deployTx);
  const estimatedCost = estimatedGas * gasPrice;
  console.log(`Estimated deployment gas: ${estimatedGas.toString()} units`);
  console.log(`Estimated deployment fee: ${hre.ethers.formatEther(estimatedCost)} ${tokenSymbol} (~very minimal!)`);

  console.log("\nBroadcasting deployment transaction with optimal gas settings...");
  // Deploy without inflated gas tip
  const foundIt = await FoundIt.deploy({
    gasPrice: gasPrice,
  });

  await foundIt.waitForDeployment();
  const contractAddress = await foundIt.getAddress();

  console.log(`\n🎉 FoundIt deployed successfully!`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Explorer Link: ${explorerBase}/address/${contractAddress}`);

  // Write contract address and ABI to src/contracts for frontend
  const artifactPath = path.join(__dirname, "../artifacts/contracts/FoundIt.sol/FoundIt.json");
  let abi = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = artifact.abi;
  }

  const outputDir = path.join(__dirname, "../src/contracts");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const contractData = {
    address: contractAddress,
    chainId: chainId,
    network: isMainnet ? "Botchain Mainnet" : "Botchain Testnet",
    deployedAt: new Date().toISOString(),
    abi: abi,
  };

  fs.writeFileSync(
    path.join(outputDir, "contractData.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log(`Frontend contract configuration written to src/contracts/contractData.json`);

  updateEnvFile(path.join(__dirname, "../.env"), contractAddress, chainId, rpcUrl, explorerBase);
  updateEnvFile(path.join(__dirname, "../.env.local"), contractAddress, chainId, rpcUrl, explorerBase);

  console.log("\n==========================================");
  console.log("Deployment Complete!");
  console.log("==========================================");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
