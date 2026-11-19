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
    <div className="relative h-[46vh] min-h-72 w-full lg:h-full">
      <div aria-hidden className="absolute inset-y-[20%] left-[8%] w-1/3 rounded-full bg-cyan/10 blur-3xl" />
      <div aria-hidden className="absolute inset-y-[20%] right-[8%] w-1/3 rounded-full bg-violet/12 blur-3xl" />
      <CarViewer id={carId} />
      <Label className="absolute inset-x-0 bottom-1 justify-center">
        Scan mode: <span className="text-cyan">Active</span>
        <svg aria-hidden viewBox="0 0 60 12" className="h-3 w-16 text-cyan" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0 6h14l2-4 2 8 2-6 2 4 2-5 2 6 2-3h32" />
        </svg>
      </Label>
    </div>
  )
}
