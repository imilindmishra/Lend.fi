const { expect } = require("chai");
const { ethers } = require("hardhat");

// BigNumber helper function for ERC20 token amounts
const toWei = (value) => ethers.parseEther(value.toString());

describe("Lending", function () {
  let owner, user1;
  let collateralToken, loanToken, lending;

  // Constants for our tests
  const COLLATERAL_FACTOR = 75; // 75% LTV
  const INTEREST_RATE = 5; // 5% APY
  const DEPOSIT_AMOUNT = toWei(10); // User deposits 10 COL tokens
  const BORROW_AMOUNT = toWei(5); // User borrows 5 LOAN tokens

  // Deploy contracts before each test
  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    const CollateralToken = await ethers.getContractFactory("CollateralToken");
    collateralToken = await CollateralToken.deploy();

    const LoanToken = await ethers.getContractFactory("LoanToken");
    loanToken = await LoanToken.deploy();

    const Lending = await ethers.getContractFactory("Lending");
    lending = await Lending.deploy(
      await collateralToken.getAddress(),
      await loanToken.getAddress(),
      COLLATERAL_FACTOR,
      INTEREST_RATE
    );

    // Mint tokens for the user and the lending contract
    await collateralToken.mint(user1.address, toWei(1000));
    // FIX: Mint some LOAN tokens to user1 so they can pay interest later
    await loanToken.mint(user1.address, toWei(100));
    await loanToken.mint(await lending.getAddress(), toWei(10000)); // Provide liquidity
  });

  it("Should allow a user to deposit collateral", async function () {
    await collateralToken
      .connect(user1)
      .approve(await lending.getAddress(), DEPOSIT_AMOUNT);
    await expect(lending.connect(user1).depositCollateral(DEPOSIT_AMOUNT))
      .to.emit(lending, "CollateralDeposited")
      .withArgs(user1.address, DEPOSIT_AMOUNT);
    const balance = await lending.collateralBalances(user1.address);
    expect(balance).to.equal(DEPOSIT_AMOUNT);
  });

  it("Should allow a user to borrow tokens", async function () {
    await collateralToken
      .connect(user1)
      .approve(await lending.getAddress(), DEPOSIT_AMOUNT);
    await lending.connect(user1).depositCollateral(DEPOSIT_AMOUNT);

    // FIX: Calculate the expected required collateral
    const requiredCollateral = await lending.calculateRequiredCollateral(
      BORROW_AMOUNT
    );

    await expect(lending.connect(user1).borrow(BORROW_AMOUNT))
      .to.emit(lending, "LoanTaken")
      .withArgs(user1.address, BORROW_AMOUNT, requiredCollateral); // Check against the correct value

    const loanTokenBalance = await loanToken.balanceOf(user1.address);
    // User started with 100, borrowed 5, so should have 105
    expect(loanTokenBalance).to.equal(toWei(105));

    const loan = await lending.loans(user1.address);
    expect(loan.active).to.be.true;
    expect(loan.amount).to.equal(BORROW_AMOUNT);
  });

  it("Should prevent borrowing more than the collateral factor allows", async function () {
    await collateralToken
      .connect(user1)
      .approve(await lending.getAddress(), DEPOSIT_AMOUNT);
    await lending.connect(user1).depositCollateral(DEPOSIT_AMOUNT);

    const excessiveBorrowAmount = toWei(8);
    await expect(
      lending.connect(user1).borrow(excessiveBorrowAmount)
    ).to.be.revertedWith("Borrow amount exceeds maximum");
  });

  it("Should allow a user to repay a loan", async function () {
    await collateralToken
      .connect(user1)
      .approve(await lending.getAddress(), DEPOSIT_AMOUNT);
    await lending.connect(user1).depositCollateral(DEPOSIT_AMOUNT);
    await lending.connect(user1).borrow(BORROW_AMOUNT);

    await loanToken
      .connect(user1)
      .approve(await lending.getAddress(), toWei(100));

    await expect(lending.connect(user1).repay()).to.emit(lending, "LoanRepaid");

    const loan = await lending.loans(user1.address);
    expect(loan.active).to.be.false;

    const collateralBalance = await lending.collateralBalances(user1.address);
    const totalCollateral =
      (await lending.calculateRequiredCollateral(BORROW_AMOUNT)) +
      (DEPOSIT_AMOUNT -
        (await lending.calculateRequiredCollateral(BORROW_AMOUNT)));
    expect(collateralBalance).to.equal(totalCollateral);
  });
});
