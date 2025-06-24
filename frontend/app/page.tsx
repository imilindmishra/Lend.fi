'use client'

import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

import Header from '@/components/Header'
import FloatingIconsBackground from '@/components/FloatingIconsBackground'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import Footer from '@/components/Footer'

// Only client-side
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
        <LendingCard />
      </div>
      <AboutSection />
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        }}
      />
    </div>
  )
}
