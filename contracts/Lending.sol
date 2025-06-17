    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;

    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
    import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

    contract Lending is Ownable {
        using SafeERC20 for IERC20;

        struct Loan {
            uint256 amount;
            uint256 collateral;
            uint256 startTime;
            bool active;
        }

        IERC20 public collateralToken;
        IERC20 public loanToken;
        uint256 public collateralFactor;
        uint256 public interestRate;
        uint256 private constant SECONDS_PER_YEAR = 365 days;

        mapping(address => uint256) public collateralBalances;
        mapping(address => Loan) public loans;

        event CollateralDeposited(address indexed user, uint256 amount);
        event CollateralWithdrawn(address indexed user, uint256 amount);
        event LoanTaken(address indexed user, uint256 amount, uint256 collateralAmount);
        event LoanRepaid(address indexed user, uint256 principal, uint256 interest);
        event Liquidated(address indexed borrower, address indexed liquidator, uint256 collateralPaid, uint256 collateralReceived);

        function getAssetPrice() private pure returns (uint256) {
            return 1e18;
        }

        constructor(
            address _collateralTokenAddress,
            address _loanTokenAddress,
            uint256 _collateralFactor,
            uint256 _interestRate
        ) Ownable(msg.sender) {
            collateralToken = IERC20(_collateralTokenAddress);
            loanToken = IERC20(_loanTokenAddress);
            collateralFactor = _collateralFactor;
            interestRate = _interestRate;
        }

        function depositCollateral(uint256 _amount) public {
            require(_amount > 0, "Amount must be > 0");
            collateralBalances[msg.sender] += _amount;
            collateralToken.safeTransferFrom(msg.sender, address(this), _amount);
            emit CollateralDeposited(msg.sender, _amount);
        }

        function withdrawCollateral(uint256 _amount) public {
            require(_amount > 0, "Amount must be > 0");
            require(collateralBalances[msg.sender] >= _amount, "Insufficient collateral");
            require(!loans[msg.sender].active, "Cannot withdraw with active loan");
            collateralBalances[msg.sender] -= _amount;
            collateralToken.safeTransfer(msg.sender, _amount);
            emit CollateralWithdrawn(msg.sender, _amount);
        }

        function borrow(uint256 _amount) public {
            require(_amount > 0, "Amount must be > 0");
            require(!loans[msg.sender].active, "Loan already active");
            uint256 maxBorrow = getMaximumBorrowAmount(msg.sender);
            require(_amount <= maxBorrow, "Borrow amount exceeds maximum");
            require(loanToken.balanceOf(address(this)) >= _amount, "Not enough liquidity");
            uint256 requiredCollateral = calculateRequiredCollateral(_amount);
            require(collateralBalances[msg.sender] >= requiredCollateral, "Not enough collateral");
            collateralBalances[msg.sender] -= requiredCollateral;
            loans[msg.sender] = Loan(_amount, requiredCollateral, block.timestamp, true);
            loanToken.safeTransfer(msg.sender, _amount);
            emit LoanTaken(msg.sender, _amount, requiredCollateral);
        }

        function repay() public {
            Loan storage loan = loans[msg.sender];
            require(loan.active, "No active loan");
            uint256 interest = calculateInterest(loan.amount, loan.startTime);
            uint256 totalRepayment = loan.amount + interest;
            loanToken.safeTransferFrom(msg.sender, address(this), totalRepayment);
            collateralBalances[msg.sender] += loan.collateral;
            delete loans[msg.sender];
            emit LoanRepaid(msg.sender, loan.amount, interest);
        }

        function liquidate(address _borrower) public {
            Loan storage loan = loans[_borrower];
            require(loan.active, "No active loan");
            require(isUndercollateralized(_borrower), "Loan not undercollateralized");
            uint256 interest = calculateInterest(loan.amount, loan.startTime);
            uint256 totalDebt = loan.amount + interest;
            loanToken.safeTransferFrom(msg.sender, address(this), totalDebt);
            collateralToken.safeTransfer(msg.sender, loan.collateral);
            delete loans[_borrower];
            emit Liquidated(_borrower, msg.sender, totalDebt, loan.collateral);
        }

        function calculateInterest(uint256 _principal, uint256 _startTime) public view returns (uint256) {
            uint256 loanDuration = block.timestamp - _startTime;
            return (_principal * interestRate * loanDuration) / SECONDS_PER_YEAR / 100;
        }

        function getMaximumBorrowAmount(address _user) public view returns (uint256) {
            uint256 userCollateralValue = (collateralBalances[_user] * getAssetPrice()) / 1e18;
            return (userCollateralValue * collateralFactor) / 100;
        }

        function calculateRequiredCollateral(uint256 _borrowAmount) public view returns (uint256) {
            uint256 borrowValue = (_borrowAmount * getAssetPrice()) / 1e18;
            return (borrowValue * 100) / collateralFactor;
        }

        function isUndercollateralized(address _user) public view returns (bool) {
            Loan memory loan = loans[_user];
            if (!loan.active) return false;
            uint256 interest = calculateInterest(loan.amount, loan.startTime);
            uint256 totalDebtValue = ((loan.amount + interest) * getAssetPrice()) / 1e18;
            uint256 collateralValue = (loan.collateral * getAssetPrice()) / 1e18;
            return collateralValue < totalDebtValue;
        }
    }
    