"use client"

import { motion } from "framer-motion"
import {
  Shield,
  Zap,
  TrendingUp,
  Users,
  Lock,
  Globe,
  CheckCircle,
  Clock,
  Award,
  Target,
  Layers,
  Coins,
} from "lucide-react"

export default function AboutSection() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Audited",
      description:
        "Our smart contracts are thoroughly audited by leading security firms to ensure your funds are safe.",
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-500/10 to-green-600/10",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Execute transactions in seconds with our optimized protocol built on cutting-edge blockchain technology.",
      color: "from-yellow-500 to-orange-600",
      bgColor: "from-yellow-500/10 to-orange-600/10",
    },
    {
      icon: TrendingUp,
      title: "Competitive Rates",
      description: "Enjoy some of the best lending and borrowing rates in the DeFi ecosystem.",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-500/10 to-cyan-600/10",
    },
    {
      icon: Users,
      title: "Community Governed",
      description: "Participate in protocol governance and help shape the future of decentralized lending.",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-500/10 to-pink-600/10",
    },
    {
      icon: Lock,
      title: "Non-Custodial",
      description: "You maintain full control of your assets. We never hold or have access to your funds.",
      color: "from-red-500 to-rose-600",
      bgColor: "from-red-500/10 to-rose-600/10",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access our protocol from anywhere in the world, 24/7, without restrictions.",
      color: "from-indigo-500 to-blue-600",
      bgColor: "from-indigo-500/10 to-blue-600/10",
    },
  ]

  const processSteps = [
    {
      icon: Coins,
      title: "Deposit Collateral",
      description: "Deposit your crypto assets as collateral to secure your position in the protocol.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Target,
      title: "Borrow or Lend",
      description: "Choose to borrow against your collateral or lend your assets to earn yield.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Award,
      title: "Earn & Manage",
      description: "Monitor your positions, earn yield, and manage your portfolio through our intuitive interface.",
      color: "from-emerald-500 to-green-600",
    },
  ]

  const stats = [
    {
      icon: TrendingUp,
      value: "$2.5B+",
      label: "Total Value Locked",
      color: "text-emerald-400",
    },
    {
      icon: Users,
      value: "150K+",
      label: "Active Users",
      color: "text-blue-400",
    },
    {
      icon: CheckCircle,
      value: "99.9%",
      label: "Uptime",
      color: "text-purple-400",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Availability",
      color: "text-cyan-400",
    },
  ]

  return (
    <section id="about" className="relative z-10 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Why Choose LendFi?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            LendFi is a next-generation DeFi lending protocol that combines security, efficiency, and user experience to
            provide the best lending and borrowing experience in decentralized finance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                borderColor: "rgba(147, 197, 253, 0.3)",
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor}`} />
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 md:p-12 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Layers className="w-8 h-8 mr-3 text-blue-400" />
                How It Works
              </h3>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                      <p className="text-gray-300 leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
