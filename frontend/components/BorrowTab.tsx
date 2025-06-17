"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { ethers } from "ethers"
import { useWeb3 } from "@/context/Web3Context"

export default function BorrowTab() {
  const { walletAddress, isConnected, lendingContract } = useWeb3();

  const [borrowAmount, setBorrowAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [maxBorrow, setMaxBorrow] = useState("0.0")
  const [currentDebt, setCurrentDebt] = useState("0.0")

  const fetchBorrowData = useCallback(async () => {
    if (!isConnected || !walletAddress || !lendingContract) return;

    try {
      const maxBorrowable = await lendingContract.getMaximumBorrowAmount(walletAddress);
      setMaxBorrow(ethers.formatEther(maxBorrowable));

      const loan = await lendingContract.loans(walletAddress);
      const debtAmount = loan?.active ? loan.amount : 0;
      setCurrentDebt(ethers.formatEther(debtAmount));
    } catch (error) {
      console.error("Failed to fetch borrow data:", error);
      toast.error("Failed to fetch borrow info.");
    }
  }, [isConnected, walletAddress, lendingContract]);

  useEffect(() => {
    fetchBorrowData();
  }, [fetchBorrowData]);

  const handleMaxClick = () => {
    setBorrowAmount(maxBorrow);
  }

  const handleBorrow = async () => {
    if (!borrowAmount || Number.parseFloat(borrowAmount) <= 0) {
      toast.error("Please enter a valid borrow amount");
      return;
    }

    if (Number.parseFloat(borrowAmount) > Number.parseFloat(maxBorrow)) {
      toast.error("Amount exceeds max borrow limit");
      return;
    }

    if (!isConnected || !lendingContract) {
      toast.error("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);

    const borrowPromise = new Promise(async (resolve, reject) => {
      try {
        const amountToBorrow = ethers.parseEther(borrowAmount);
        const borrowTx = await lendingContract.borrow(amountToBorrow);
        await borrowTx.wait();

        setBorrowAmount("");
        await fetchBorrowData();
        resolve("Borrow successful!");
      } catch (error: any) {
        console.error("Borrow failed:", error);
        reject(error.code === 'ACTION_REJECTED'
          ? "Transaction rejected by user."
          : "Borrow failed. See console for details.");
      } finally {
        setIsLoading(false);
      }
    });

    toast.promise(borrowPromise, {
      loading: 'Processing borrow transaction...',
      success: (msg: any) => String(msg),
      error: (err) => err,
    });
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Borrow Assets</h2>
        <p className="text-gray-400">Borrow against your deposited collateral</p>
      </div>

      <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">Maximum you can borrow:</span>
          <span className="text-blue-400 font-semibold">{parseFloat(maxBorrow).toFixed(2)} LOAN</span>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
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
            onClick={handleBorrow}
            disabled={isLoading || !isConnected}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold text-lg transition-all duration-200"
            whileHover={{ scale: (isLoading || !isConnected) ? 1 : 1.02 }}
            whileTap={{ scale: (isLoading || !isConnected) ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Borrowing...</span>
              </div>
            ) : (
              "Borrow"
            )}
          </motion.button>
        </div>
      </div>

      <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/20">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Your Current Debt:</span>
          <span className="text-orange-400 font-semibold">{parseFloat(currentDebt).toFixed(2)} LOAN</span>
        </div>
      </div>
    </div>
  );
}
