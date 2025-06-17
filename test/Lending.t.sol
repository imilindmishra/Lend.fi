pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Lending} from "../contracts/Lending.sol";
import {CollateralToken} from "../contracts/CollateralToken.sol";
import {LoanToken} from "../contracts/LoanToken.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingTest is Test {
    Lending public lending;
    CollateralToken public collateralToken;
    LoanToken public loanToken;

    address public constant USER = address(1); // A sample user address provided by Foundry
    uint256 public constant DEPOSIT_AMOUNT = 10 * 1e18; // 10 COL
    uint256 public constant BORROW_AMOUNT = 5 * 1e18; // 5 LOAN

    function setUp() public {
        // Deploy the contracts
        collateralToken = new CollateralToken();
        loanToken = new LoanToken();
        lending = new Lending(
            address(collateralToken),
            address(loanToken),
            75, // 75% Collateral Factor
            5   // 5% Interest Rate
        );

        // Mint tokens for the user and provide liquidity to the lending contract
        collateralToken.mint(USER, 1000 * 1e18);
        loanToken.mint(address(lending), 10000 * 1e18);
    }

    function testDepositCollateral() public {
        // The USER needs to approve the lending contract first
        // 'vm.prank' makes the next call come from the USER address
        vm.prank(USER);
        collateralToken.approve(address(lending), DEPOSIT_AMOUNT);

        // USER deposits collateral
        vm.prank(USER);
        lending.depositCollateral(DEPOSIT_AMOUNT);

        // Assert that the lending contract now holds the collateral balance for the user
        assertEq(lending.collateralBalances(USER), DEPOSIT_AMOUNT);
        // Assert that the tokens were actually transferred to the contract
        assertEq(collateralToken.balanceOf(address(lending)), DEPOSIT_AMOUNT);
    }

    // FIX: Renamed the function to follow modern Foundry conventions
    function test_RevertIfBorrowTooMuch() public {
        // Deposit collateral first
        vm.prank(USER);
        collateralToken.approve(address(lending), DEPOSIT_AMOUNT);
        vm.prank(USER);
        lending.depositCollateral(DEPOSIT_AMOUNT);

        // We expect the next call to fail (revert) with a specific message
        // Max borrow is 7.5 tokens (10 * 75%)
        uint256 excessiveAmount = 8 * 1e18;
        vm.expectRevert("Borrow amount exceeds maximum");

        // Attempt to borrow more than allowed
        vm.prank(USER);
        lending.borrow(excessiveAmount);
    }
}
