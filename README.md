# LendFi - A Decentralized Lending & Borrowing Protocol

![LendFi Hero Section] <!-- Replace with a screenshot of your dApp -->

**LendFi** is a full-stack, decentralized finance (DeFi) application built on the Ethereum blockchain. It allows users to deposit crypto assets as collateral, borrow other assets against that collateral, and repay their loans with interest. This project demonstrates a deep understanding of smart contract development, professional testing methodologies, and modern frontend architecture.

---

## ✨ Key Features & Architectural Highlights

This project goes beyond a simple tutorial by incorporating professional-grade tools and architectural patterns.

* **Dual-Framework Testing:** Utilizes a robust, dual-testing strategy for the smart contracts:
    * **Hardhat:** For JavaScript-based integration testing of the end-to-end user flows.
    * **Foundry:** For high-speed, Solidity-native unit testing and advanced checks.
* **Scalable Frontend Architecture:** Built with Next.js and architected with a custom **React Context Provider (`Web3Context`)**. This centralizes web3 state (wallet connection, contract instances), making the code cleaner, more modular, and easier to maintain.
* **End-to-End DeFi Logic:** The core lending protocol was written from scratch in Solidity, implementing all fundamental mechanics including:
    * Collateral Deposit & Withdrawal
    * Loan Issuance based on a Collateral Factor (LTV)
    * Time-based Interest Accrual
    * Loan Repayment
    * Liquidation logic for undercollateralized loans.

---

## 🛠️ Tech Stack

#### **Backend & Smart Contracts**
* **Solidity:** Language for smart contracts.
* **Hardhat:** Core development environment for compiling, deploying, and scripting.
* **OpenZeppelin:** For secure, standard contract implementations (ERC20, Ownable).

#### **Frontend**
* **Next.js:** React framework for a fast, modern UI.
* **TypeScript:** For robust, type-safe code.
* **Ethers.js:** For seamless communication with the Ethereum blockchain.
* **Tailwind CSS:** For styling the user interface.
* **Framer Motion:** For sophisticated animations and a fluid user experience.

#### **Testing & Local Environment**
* **Foundry:** For high-speed, Solidity-native unit testing.
* **Ganache:** For running a personal, local Ethereum blockchain.
* **Chai:** Assertion library for Hardhat tests.

---

## 🚀 Getting Started: Local Setup

Follow these steps to set up and run the project on your local machine.

### Prerequisites

* **Node.js** (v18 or later): [Download here](https://nodejs.org/)
* **Git:** [Download here](https://git-scm.com/)
* **Foundry:** [Installation guide](https://book.getfoundry.sh/getting-started/installation)
* **PNPM:** `npm install -g pnpm`

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd defi-lending-project
```

### 2. Install Dependencies

This project has two separate sets of dependencies: one for the Hardhat backend and one for the Next.js frontend.

* **Backend Dependencies (in root folder):**
    ```bash
    npm install
    ```

* **Frontend Dependencies (in `/frontend` folder):**
    ```bash
    cd frontend
    pnpm install
    cd .. 
    ```

### 3. Run the Local Blockchain

* Open the **Ganache** desktop application and click on **"QUICKSTART"**.
* This will start a local Ethereum node, typically at `http://127.0.0.1:7545`.

### 4. Deploy the Smart Contracts

* In your terminal, from the root directory of the project, run the deployment script. This will deploy all contracts to your local Ganache network.
    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```
* The script will output the addresses of the deployed contracts. **Copy the addresses** for `Lending`, `CollateralToken`, and `LoanToken`.

### 5. Configure the Frontend

* Open the file: `frontend/lib/config.ts`.
* Paste the new contract addresses you just copied into the corresponding variables.

### 6. Run the Frontend Application

* Navigate to the frontend directory and start the development server.
    ```bash
    cd frontend
    pnpm dev
    ```
* Open your browser and go to **`http://localhost:3000`**.

### 7. Configure MetaMask

* Add the Ganache network to your MetaMask wallet.
* Import an account from Ganache using its private key to ensure you have test ETH and tokens.
* Connect your wallet on the website. You're all set!

---

## ✅ Running Tests

You can run the comprehensive test suites for the smart contracts using both Hardhat and Foundry.

### Hardhat Tests (JavaScript)
From the project root directory:
```bash
npx hardhat test
```

### Foundry Tests (Solidity)
From the project root directory (in a WSL/Linux/macOS terminal):
```bash
forge test
```

---

## 🔮 Future Improvements

* **Deploy to a Public Testnet:** Deploy the contracts to a network like Sepolia to make the dApp publicly accessible.
* **Implement Liquidation UI:** Add a dedicated section in the UI for any user to liquidate undercollateralized loans.
* **Integrate a Price Oracle:** Replace the 1:1 price assumption with a real-time **Chainlink Price Feed** to handle volatile assets.
* **Add a Chatbot Interface:** Implement the planned AI chatbot for executing swaps, transfers, and other actions via text prompts.
