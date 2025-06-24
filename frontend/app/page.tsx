"use client"

import { Toaster } from "react-hot-toast"
import dynamic from 'next/dynamic' // Dynamic ko import karein

import Header from "@/components/Header"
import FloatingIconsBackground from "@/components/FloatingIconsBackground"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import Footer from "@/components/Footer"

// --- YEH HAI IMPORTANT CHANGE ---
// Hum LendingCard ko dynamically import kar rahe hain aur bata rahe hain
// ki isko Server-Side Rendering (SSR) ke liye use na karein.
const LendingCard = dynamic(() => import('@/components/LendingCard'), {
  ssr: false, 
})

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden">
      <FloatingIconsBackground />
      <Header />
      <HeroSection />
      <div className="relative z-10 py-20">
        <LendingCard /> {/* Yeh ab dynamically load hoga */}
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
