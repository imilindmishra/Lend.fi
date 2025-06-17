"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react"
import { ethers, Contract, BrowserProvider } from "ethers"
import toast from "react-hot-toast"

import { LENDING_CONTRACT_ADDRESS, COLLATERAL_TOKEN_ADDRESS, LOAN_TOKEN_ADDRESS } from "@/lib/config"
import LendingABI from "@/lib/Lending.json"

const erc20Abi = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
]

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: ethers.Signer | null;
  walletAddress: string;
  lendingContract: Contract | null;
  collateralTokenContract: Contract | null;
  loanTokenContract: Contract | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [lendingContract, setLendingContract] = useState<Contract | null>(null)
  const [collateralTokenContract, setCollateralTokenContract] = useState<Contract | null>(null)
  const [loanTokenContract, setLoanTokenContract] = useState<Contract | null>(null)

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.error("MetaMask is not installed!")
      return
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await browserProvider.send("eth_requestAccounts", [])
      
      if (accounts.length > 0) {
        const signerInstance = await browserProvider.getSigner()
        const address = await signerInstance.getAddress()

        setProvider(browserProvider)
        setSigner(signerInstance)
        setWalletAddress(address)

        const lending = new ethers.Contract(LENDING_CONTRACT_ADDRESS, LendingABI.abi, signerInstance)
        const collateral = new ethers.Contract(COLLATERAL_TOKEN_ADDRESS, erc20Abi, signerInstance)
        const loan = new ethers.Contract(LOAN_TOKEN_ADDRESS, erc20Abi, signerInstance)

        setLendingContract(lending)
        setCollateralTokenContract(collateral)
        setLoanTokenContract(loan)

        toast.success("Wallet connected successfully!")
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
      toast.error("Failed to connect wallet.")
    }
  }

  // Auto reload on account or network change
  useEffect(() => {
    const handleAccountsChanged = () => window.location.reload()
    const handleNetworkChanged = () => window.location.reload()

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleNetworkChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleNetworkChanged)
      }
    }
  }, [])

  const value: Web3ContextType = {
    provider,
    signer,
    walletAddress,
    lendingContract,
    collateralTokenContract,
    loanTokenContract,
    connectWallet,
    isConnected: !!walletAddress
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
