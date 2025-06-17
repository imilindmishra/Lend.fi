"use client"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import toast from "react-hot-toast"
import { ethers } from "ethers"

interface HeaderProps {
  walletConnected: boolean
  walletAddress: string
  setWalletConnected: (connected: boolean) => void
  setWalletAddress: (address: string) => void
}

// Add TypeScript support for `window.ethereum`
declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Header({
  walletConnected,
  walletAddress,
  setWalletConnected,
  setWalletAddress,
}: HeaderProps) {

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts: string[] = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        const account = accounts[0]

        setWalletAddress(account)
        setWalletConnected(true)

        toast.success("Wallet connected successfully!")
        console.log("Connected account:", account)
      } catch (error: any) {
        console.error("Wallet connection failed:", error)
        if (error.code === 4001) {
          toast.error("Connection request rejected by user.")
        } else {
          toast.error("Failed to connect wallet.")
        }
      }
    } else {
      toast.error("MetaMask is not installed. Please install it to use this app.")
    }
  }

  const truncateAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="relative z-20 pt-8 pb-4">
      <div className="container mx-auto px-4">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between max-w-4xl mx-auto bg-gray-900/30 backdrop-blur-md border border-gray-700/50 rounded-2xl px-8 py-4 shadow-2xl"
        >
          {/* Logo */}
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            LendFi
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {["Home", "Lending", "About"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors duration-200 relative"
                whileHover={{ scale: 1.05 }}
              >
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleConnectWallet}
              className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              {walletConnected ? truncateAddress(walletAddress) : "Connect Wallet"}
            </motion.button>

            <motion.button
              className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-full flex items-center justify-center hover:bg-gray-700/50 transition-all duration-200 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
            </motion.button>
          </div>
        </motion.nav>
      </div>
    </header>
  )
}
