"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Bitcoin, Zap, BarChart3, Activity } from "lucide-react"

interface ChartData {
  time: string
  price: number
  volume?: number
}

export default function CryptoCharts() {
  const [btcData, setBtcData] = useState<ChartData[]>([])
  const [ethData, setEthData] = useState<ChartData[]>([])
  const [tvlData, setTvlData] = useState<ChartData[]>([])

  useEffect(() => {
    // Generate realistic BTC price data
    const generateBTCData = () => {
      const data: ChartData[] = []
      let basePrice = 43500 // Starting BTC price
      const now = new Date()

      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        // More realistic BTC price movement
        const volatility = 0.03 // 3% daily volatility
        const change = (Math.random() - 0.5) * 2 * volatility
        basePrice = basePrice * (1 + change)

        data.push({
          time: time.toLocaleDateString(),
          price: Math.max(basePrice, 35000), // Floor at $35k
          volume: Math.random() * 2000000000 + 1000000000, // 1-3B volume
        })
      }
      return data
    }

    // Generate realistic ETH price data
    const generateETHData = () => {
      const data: ChartData[] = []
      let basePrice = 2650 // Starting ETH price
      const now = new Date()

      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        // ETH typically more volatile than BTC
        const volatility = 0.04 // 4% daily volatility
        const change = (Math.random() - 0.5) * 2 * volatility
        basePrice = basePrice * (1 + change)

        data.push({
          time: time.toLocaleDateString(),
          price: Math.max(basePrice, 2000), // Floor at $2k
          volume: Math.random() * 800000000 + 400000000, // 400M-1.2B volume
        })
      }
      return data
    }

    // Generate TVL data
    const generateTVLData = () => {
      const data: ChartData[] = []
      let baseTVL = 2500000000 // $2.5B starting TVL
      const now = new Date()

      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        // TVL grows more steadily with occasional dips
        const change = (Math.random() - 0.3) * 0.02 // Slight upward bias
        baseTVL = baseTVL * (1 + change)

        data.push({
          time: time.toLocaleDateString(),
          price: Math.max(baseTVL, 1500000000), // Floor at $1.5B
        })
      }
      return data
    }

    setBtcData(generateBTCData())
    setEthData(generateETHData())
    setTvlData(generateTVLData())

    // Update data every 10 seconds to simulate real-time
    const interval = setInterval(() => {
      setBtcData(generateBTCData())
      setEthData(generateETHData())
      setTvlData(generateTVLData())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const CryptoChartCard = ({
    title,
    symbol,
    price,
    change,
    data,
    icon: Icon,
    gradientFrom,
    gradientTo,
    accentColor,
  }: {
    title: string
    symbol: string
    price: string
    change: number
    data: ChartData[]
    icon: any
    gradientFrom: string
    gradientTo: string
    accentColor: string
  }) => (
    <motion.div
      className="bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 20px 40px ${accentColor}20`,
        borderColor: `${accentColor}50`,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-5`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl bg-gradient-to-r ${gradientFrom} ${gradientTo} shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400">{symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white mb-1">{price}</div>
            <div className={`text-sm font-medium flex items-center ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${change < 0 ? "rotate-180" : ""}`} />
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-24 flex items-end space-x-1 mb-4">
          {data.slice(-20).map((point, index) => {
            const maxPrice = Math.max(...data.map((d) => d.price))
            const minPrice = Math.min(...data.map((d) => d.price))
            const height = ((point.price - minPrice) / (maxPrice - minPrice)) * 100

            return (
              <motion.div
                key={index}
                className={`flex-1 bg-gradient-to-t ${gradientFrom} ${gradientTo} rounded-t opacity-80`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 5)}%` }}
                transition={{ duration: 0.5, delay: index * 0.02 }}
              />
            )
          })}
        </div>

        {/* Live indicator */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${accentColor} animate-pulse`} />
            <span>Live</span>
          </div>
          <span>
            24h Volume: $
            {data[data.length - 1]?.volume ? (data[data.length - 1].volume! / 1000000000).toFixed(2) + "B" : "N/A"}
          </span>
        </div>
      </div>
    </motion.div>
  )

  const TVLCard = ({ data }: { data: ChartData[] }) => (
    <motion.div
      className="bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)",
        borderColor: "rgba(168, 85, 247, 0.5)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Total Value Locked</h3>
              <p className="text-sm text-gray-400">Protocol TVL</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white mb-1">
              ${(data[data.length - 1]?.price / 1000000000 || 0).toFixed(2)}B
            </div>
            <div className="text-sm font-medium text-purple-400 flex items-center">
              <Activity className="w-3 h-3 mr-1" />
              Growing
            </div>
          </div>
        </div>

        <div className="h-24 flex items-end space-x-1 mb-4">
          {data.slice(-20).map((point, index) => {
            const maxTVL = Math.max(...data.map((d) => d.price))
            const minTVL = Math.min(...data.map((d) => d.price))
            const height = ((point.price - minTVL) / (maxTVL - minTVL)) * 100

            return (
              <motion.div
                key={index}
                className="flex-1 bg-gradient-to-t from-purple-500 to-pink-600 rounded-t opacity-80"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 5)}%` }}
                transition={{ duration: 0.5, delay: index * 0.02 }}
              />
            )
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
          <span>All-time High: $3.2B</span>
        </div>
      </div>
    </motion.div>
  )

  // Calculate price changes
  const btcChange =
    btcData.length > 1
      ? ((btcData[btcData.length - 1]?.price - btcData[btcData.length - 2]?.price) /
          btcData[btcData.length - 2]?.price) *
        100
      : 0

  const ethChange =
    ethData.length > 1
      ? ((ethData[ethData.length - 1]?.price - ethData[ethData.length - 2]?.price) /
          ethData[ethData.length - 2]?.price) *
        100
      : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      <CryptoChartCard
        title="Bitcoin"
        symbol="BTC/USD"
        price={`$${(btcData[btcData.length - 1]?.price || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        change={btcChange}
        data={btcData}
        icon={Bitcoin}
        gradientFrom="from-orange-500"
        gradientTo="to-yellow-500"
        accentColor="bg-orange-500"
      />

      <CryptoChartCard
        title="Ethereum"
        symbol="ETH/USD"
        price={`$${(ethData[ethData.length - 1]?.price || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        change={ethChange}
        data={ethData}
        icon={Zap}
        gradientFrom="from-blue-500"
        gradientTo="to-cyan-500"
        accentColor="bg-blue-500"
      />

      <TVLCard data={tvlData} />
    </div>
  )
}
