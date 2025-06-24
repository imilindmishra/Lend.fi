// app/layout.tsx
import './globals.css'
import dynamic from 'next/dynamic'

const Providers = dynamic(() => import('./providers'), {
  ssr: false,
  loading: () => null,  // you can swap in a spinner if you like
})

export const metadata = {
  title: 'LendFi',
  description: 'Decentralized lending built on Ethereum',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
