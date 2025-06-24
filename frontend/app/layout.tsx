import type { Metadata } from 'next'
import './globals.css'
import { Web3Provider } from '../context/Web3Context'

export const metadata: Metadata = {
  title: 'Lend.fi',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
      
    </html>
  )
}
