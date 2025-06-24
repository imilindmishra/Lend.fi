import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers' // Hamara naya provider component import karein

export const metadata: Metadata = {
  title: 'LendFi dApp',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers> {/* Web3Provider ki jagah isko use karein */}
          {children}
        </Providers>
      </body>
    </html>
  )
}
