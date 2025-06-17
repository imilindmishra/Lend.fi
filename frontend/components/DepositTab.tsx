"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { ethers } from "ethers"
import { useWeb3 } from "@/context/Web3Context"
import { LENDING_CONTRACT_ADDRESS } from "@/lib/config"

export default function DepositTab() {
  const { walletAddress, isConnected, lendingContract, collateralTokenContract } = useWeb3()

  const [depositAmount, setDepositAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [colBalance, setColBalance] = useState("0.0")
  const [totalDeposited, setTotalDeposited] = useState("0.0")

  const fetchBlockchainData = useCallback(async () => {
    if (!isConnected || !walletAddress || !collateralTokenContract || !lendingContract) return;

    try {
      const balance = await collateralTokenContract.balanceOf(walletAddress)
      setColBalance(ethers.formatEther(balance))

      const deposited = await lendingContract.collateralBalances(walletAddress)
      setTotalDeposited(ethers.formatEther(deposited))
    } catch (error) {
      console.error("Failed to fetch deposit data:", error)
      toast.error("Could not fetch deposit data.")
    }
  }, [isConnected, walletAddress, collateralTokenContract, lendingContract])

  useEffect(() => {
    fetchBlockchainData()
  }, [fetchBlockchainData])

  const handleMaxClick = () => {
    setDepositAmount(colBalance)
  }

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid deposit amount")
      return
    }

    if (!isConnected || !collateralTokenContract || !lendingContract) {
      toast.error("Please connect your wallet first.")
      return
    }

    setIsLoading(true)

    const depositPromise = new Promise(async (resolve, reject) => {
      try {
        const amountToDeposit = ethers.parseEther(depositAmount)

        const approveTx = await collateralTokenContract.approve(LENDING_CONTRACT_ADDRESS, amountToDeposit)
        await approveTx.wait()
        toast.success("Approval successful! Now depositing...")

        const depositTx = await lendingContract.depositCollateral(amountToDeposit)
        await depositTx.wait()

        setDepositAmount("")
        await fetchBlockchainData()
        resolve("Deposit successful!")
      } catch (error: any) {
        console.error("Deposit failed:", error)
        if (error.code === "ACTION_REJECTED") {
          reject("Transaction rejected by user.")
        } else {
          reject("Deposit failed. Check console for details.")
        }
      } finally {
        setIsLoading(false)
      }
    })

    toast.promise(depositPromise, {
      loading: "Processing transaction...",
      success: (message) => `${message}`,
      error: (err) => `${err}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Deposit Collateral</h2>
        <p className="text-gray-400">Deposit your COL tokens to get started</p>
      </div>

      <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">Your COL Balance:</span>
          <span className="text-white font-semibold">{parseFloat(colBalance).toFixed(2)} COL</span>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
            />
            <motion.button
              onClick={handleMaxClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Max
            </motion.button>
          </div>

          <motion.button
            onClick={handleDeposit}
            disabled={isLoading || !isConnected}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold text-lg transition-all duration-200"
            whileHover={{ scale: isLoading || !isConnected ? 1 : 1.02 }}
            whileTap={{ scale: isLoading || !isConnected ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Deposit"
            )}
          </motion.button>
        </div>
      </div>

      <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/20">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Total Collateral Deposited:</span>
          <span className="text-green-400 font-semibold">{parseFloat(totalDeposited).toFixed(2)} COL</span>
        </div>
      </div>
    </div>
  )
}
