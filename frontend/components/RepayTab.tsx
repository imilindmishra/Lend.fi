"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { ethers } from "ethers"
import { useWeb3 } from "@/context/Web3Context"

// Replace with actual address or use env variable
const LENDING_CONTRACT_ADDRESS = "0xYourLendingContractAddressHere";

export default function RepayTab() {
  const { walletAddress, isConnected, lendingContract, loanTokenContract } = useWeb3();

  const [isLoading, setIsLoading] = useState(false)
  const [principalDebt, setPrincipalDebt] = useState("0.0");
  const [accruedInterest, setAccruedInterest] = useState("0.0");
  const [totalRepayment, setTotalRepayment] = useState("0.0");
  const [hasActiveLoan, setHasActiveLoan] = useState(false);

  const fetchRepayData = useCallback(async () => {
    if (!isConnected || !walletAddress || !lendingContract) return;

    try {
      const loan = await lendingContract.loans(walletAddress);
      if (loan?.active) {
        const interest = await lendingContract.calculateInterest(loan.amount, loan.startTime);
        const total = loan.amount + interest;

        setPrincipalDebt(ethers.formatEther(loan.amount));
        setAccruedInterest(ethers.formatEther(interest));
        setTotalRepayment(ethers.formatEther(total));
        setHasActiveLoan(true);
      } else {
        setPrincipalDebt("0.0");
        setAccruedInterest("0.0");
        setTotalRepayment("0.0");
        setHasActiveLoan(false);
      }
    } catch (error) {
      console.error("Failed to fetch repay data:", error);
      toast.error("Unable to load repayment data.");
    }
  }, [isConnected, walletAddress, lendingContract]);

  useEffect(() => {
    fetchRepayData();
  }, [fetchRepayData]);

  const handleRepay = async () => {
    if (!hasActiveLoan) {
      toast.error("You have no active loan to repay.");
      return;
    }

    if (!isConnected || !lendingContract || !loanTokenContract) {
      toast.error("Please connect your wallet.");
      return;
    }

    setIsLoading(true);

    const repayPromise = new Promise(async (resolve, reject) => {
      try {
        const maxUint256 = ethers.MaxUint256;

        console.log("Approving token for repayment...");
        const approveTx = await loanTokenContract.approve(LENDING_CONTRACT_ADDRESS, maxUint256);
        await approveTx.wait();

        toast.success("Approval successful! Repaying loan...");

        const repayTx = await lendingContract.repay();
        await repayTx.wait();

        await fetchRepayData();
        resolve("Loan repaid successfully!");
      } catch (error: any) {
        console.error("Repay failed:", error);
        reject(error.code === "ACTION_REJECTED"
          ? "Transaction rejected by user."
          : "Repayment failed. Check console for details.");
      } finally {
        setIsLoading(false);
      }
    });

    toast.promise(repayPromise, {
      loading: "Processing repayment...",
      success: (msg: any) => String(msg),
      error: (err) => err,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Repay Your Loan</h2>
        <p className="text-gray-400">Pay back your borrowed amount plus interest</p>
      </div>

      <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
          <span className="text-gray-300">Principal Debt:</span>
          <span className="text-white font-semibold">{parseFloat(principalDebt).toFixed(4)} LOAN</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
          <span className="text-gray-300">Accrued Interest:</span>
          <span className="text-yellow-400 font-semibold">{parseFloat(accruedInterest).toFixed(4)} LOAN</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-300 text-lg font-medium">Total Repayment:</span>
          <span className="text-red-400 font-bold text-lg">{parseFloat(totalRepayment).toFixed(4)} LOAN</span>
        </div>
      </div>

      <motion.button
        onClick={handleRepay}
        disabled={isLoading || !hasActiveLoan || !isConnected}
        className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold text-lg transition-all duration-200"
        whileHover={{ scale: (isLoading || !hasActiveLoan || !isConnected) ? 1 : 1.02 }}
        whileTap={{ scale: (isLoading || !hasActiveLoan || !isConnected) ? 1 : 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Repaying...</span>
          </div>
        ) : (
          "Repay Full Amount"
        )}
      </motion.button>
    </div>
  )
}
