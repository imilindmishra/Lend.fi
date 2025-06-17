const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  const [deployer] = await hre.ethers.getSigners();

  // 1. Deploy CollateralToken
  const CollateralToken = await hre.ethers.getContractFactory(
    "CollateralToken"
  );
  const collateralToken = await CollateralToken.deploy();
  await collateralToken.waitForDeployment();
  const collateralTokenAddress = await collateralToken.getAddress();
  console.log(`CollateralToken deployed to: ${collateralTokenAddress}`);

  // 2. Deploy LoanToken
  const LoanToken = await hre.ethers.getContractFactory("LoanToken");
  const loanToken = await LoanToken.deploy();
  await loanToken.waitForDeployment();
  const loanTokenAddress = await loanToken.getAddress();
  console.log(`LoanToken deployed to: ${loanTokenAddress}`);

  // 3. Deploy Lending Contract
  const collateralFactor = 75; // 75%
  const interestRate = 5; // 5%
  const Lending = await hre.ethers.getContractFactory("Lending");
  const lending = await Lending.deploy(
    collateralTokenAddress,
    loanTokenAddress,
    collateralFactor,
    interestRate
  );
  await lending.waitForDeployment();
  const lendingAddress = await lending.getAddress();
  console.log(`Lending contract deployed to: ${lendingAddress}`);

  // 4. Mint tokens
  console.log(
    `\nMinting tokens for liquidity and for deployer (${deployer.address})...`
  );

  // Mint liquidity to the Lending contract
  await loanToken.mint(lendingAddress, hre.ethers.parseEther("10000"));
  console.log(`Minted 10,000 LOAN to Lending contract.`);

  // Mint tokens to the user for testing
  await collateralToken.mint(deployer.address, hre.ethers.parseEther("1000"));
  console.log(`Minted 1,000 COL to deployer.`);

  // *** THE FIX IS HERE ***
  // Mint some LOAN tokens to the user so they can pay back interest
  await loanToken.mint(deployer.address, hre.ethers.parseEther("500"));
  console.log(`Minted 500 LOAN to deployer.`);

  console.log("\nDeployment and setup complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
