'use client'
import dynamic from 'next/dynamic'
import { Label } from './ui'

const CarViewer = dynamic(() => import('./CarViewer').then((m) => m.CarViewer), {
  ssr: false,
  loading: () => <Label className="absolute inset-0 justify-center">Initializing scan…</Label>,
})

// The hero: 3D car on its turntable, smoke glow on both sides, scan line underneath.
export function Stage({ carId }: { carId: string }) {
  return (
    <div className="relative h-[46vh] min-h-72 w-full flex-1 lg:h-auto lg:min-h-80">
      <div aria-hidden className="absolute top-[28%] left-[2%] h-[40%] w-1/3 rounded-full bg-azure/14 blur-3xl" />
      <div aria-hidden className="absolute top-[28%] right-[2%] h-[40%] w-1/3 rounded-full bg-azure/14 blur-3xl" />
      <div className="absolute inset-y-0 -inset-x-5">
        <CarViewer id={carId} />
      </div>
      <Label className="absolute inset-x-0 bottom-1 justify-center">
        Scan mode: <span className="text-cyan">Active</span>
        <svg aria-hidden viewBox="0 0 60 12" className="h-3 w-16 text-cyan" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0 6h14l2-4 2 8 2-6 2 4 2-5 2 6 2-3h32" />
        </svg>
      </Label>
    </div>
  )
}
