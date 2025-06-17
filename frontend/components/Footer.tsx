"use client"

import { motion } from "framer-motion"
import { Github, Twitter, DiscIcon as Discord, Mail } from "lucide-react"

export default function Footer() {
  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Discord, href: "#", label: "Discord" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Mail, href: "#", label: "Email" },
  ]

  const footerLinks = {
    Protocol: ["Documentation", "Whitepaper", "Audits", "Bug Bounty"],
    Community: ["Discord", "Twitter", "Governance", "Blog"],
    Developers: ["GitHub", "API Docs", "SDK", "Grants"],
    Legal: ["Terms of Service", "Privacy Policy", "Risk Disclosure", "Compliance"],
  }

  return (
    <footer className="relative z-10 bg-gray-900/50 backdrop-blur-md border-t border-gray-700/50 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              LendFi
            </motion.div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              The future of decentralized lending. Secure, efficient, and accessible DeFi lending protocol for everyone.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-full flex items-center justify-center hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-200" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-700/50 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-gray-400 text-sm">© 2024 LendFi Protocol. All rights reserved.</div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Built with ❤️ for DeFi</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Protocol Status: Active</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
