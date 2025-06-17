"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DepositTab from "./DepositTab"
import BorrowTab from "./BorrowTab"
import RepayTab from "./RepayTab"

type TabType = "deposit" | "borrow" | "repay"

export default function LendingCard() {
  const [activeTab, setActiveTab] = useState<TabType>("deposit")

  const tabs = [
    { id: "deposit", label: "Deposit", component: DepositTab },
    { id: "borrow", label: "Borrow", component: BorrowTab },
    { id: "repay", label: "Repay", component: RepayTab },
  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 shadow-2xl">

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800/50 rounded-2xl p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 relative ${
                activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content with Animation */}
        <AnimatePresence mode="wait">
          {ActiveComponent && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
