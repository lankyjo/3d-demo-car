import type { Metadata, Viewport } from 'next'
import { Michroma, Oxanium } from 'next/font/google'
import { StoreProvider } from '@/store/StoreProvider'
import './globals.css'

const display = Michroma({ subsets: ['latin'], weight: '400', variable: '--font-michroma' })
const sans = Oxanium({ subsets: ['latin'], variable: '--font-oxanium' })

export const metadata: Metadata = {
  title: 'OGA Fleet',
  description: 'Next-gen rental fleet system. Pick a unit, lock your dates, deploy.',
}

export const viewport: Viewport = { themeColor: '#01030a' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <div aria-hidden className="scene-grid pointer-events-none fixed inset-x-0 top-[55%] -z-10 h-[90vh]" />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
