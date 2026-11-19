import type { Metadata, Viewport } from 'next'
import { Michroma, Oxanium } from 'next/font/google'
import { preload } from 'react-dom'
import { SceneBackdrop } from '@/features/scene/components/SceneBackdrop'
import { fleetSlice } from '@/features/fleet/slice/fleetSlice'
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
  // Start downloading the opening car's model with the page, instead of after the 3D code has loaded.
  preload(`/models/${fleetSlice.getInitialState().selectedId}.glb`, { as: 'fetch', crossOrigin: 'anonymous' })
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <StoreProvider>
          <SceneBackdrop />
          <div className="hud-layer relative z-10">{children}</div>
        </StoreProvider>
      </body>
    </html>
  )
}
