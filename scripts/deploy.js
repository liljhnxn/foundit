const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

function updateEnvFile(filePath, address) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    if (content.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      content = content.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`
      );
    } else {
      content += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
    }
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${path.basename(filePath)} with contract address`);
  }
}

async function main() {
  console.log("Starting deployment of FoundIt...");

  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No deployer signer found. Please check PRIVATE_KEY in .env");
  }
  const deployer = signers[0];
  console.log(`Deploying from account: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} BOHR`);

  const FoundIt = await hre.ethers.getContractFactory("FoundIt");
  const foundIt = await FoundIt.deploy();

  await foundIt.waitForDeployment();
  const contractAddress = await foundIt.getAddress();

  console.log(`\n🎉 FoundIt deployed successfully to: ${contractAddress}`);
  const network = await hre.ethers.provider.getNetwork();
  console.log(`Network: ${hre.network.name} (Chain ID: ${network.chainId})`);
  console.log(`View on Explorer: https://scan.bohr.life/address/${contractAddress}`);

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
    chainId: Number(network.chainId),
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
    abi: abi,
  };

  fs.writeFileSync(
    path.join(outputDir, "contractData.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log(`Frontend contract configuration written to src/contracts/contractData.json`);

  updateEnvFile(path.join(__dirname, "../.env"), contractAddress);
  updateEnvFile(path.join(__dirname, "../.env.local"), contractAddress);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
