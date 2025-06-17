"use client"

import { useState } from "react"
import { Toaster } from "react-hot-toast"
import Header from "@/components/Header"
import FloatingIconsBackground from "@/components/FloatingIconsBackground"
import HeroSection from "@/components/HeroSection"
import LendingCard from "@/components/LendingCard"
import AboutSection from "@/components/AboutSection"
import Footer from "@/components/Footer"

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden">
      <FloatingIconsBackground />

      <Header
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        setWalletConnected={setWalletConnected}
        setWalletAddress={setWalletAddress}
      />

      <HeroSection />

      <div className="relative z-10 py-20">
      <LendingCard  />
      </div>

      <AboutSection />

      <Footer />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />
    </div>
  )
}
