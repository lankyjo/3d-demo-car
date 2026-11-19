'use client'
import dynamic from 'next/dynamic'
import { Label } from './ui'

const CarViewer = dynamic(() => import('./CarViewer').then((m) => m.CarViewer), {
  ssr: false,
  loading: () => <Label className="absolute inset-0 justify-center">Initializing scan…</Label>,
})

// The hero: 3D car on its turntable with the scan line underneath.
export function Stage({ carId, className = 'flex-1' }: { carId: string; className?: string }) {
  return (
    <div className={`relative min-h-48 w-full lg:min-h-80 ${className}`}>
      <div className="absolute -inset-x-6 top-0 -bottom-28 [mask-image:linear-gradient(to_bottom,black_78%,transparent)]">
        <CarViewer id={carId} />
      </div>
      <Label className="pointer-events-none absolute inset-x-0 bottom-1 justify-center">
        Scan mode: <span className="text-cyan">Active</span>
        <svg aria-hidden viewBox="0 0 60 12" className="h-3 w-16 text-cyan" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0 6h14l2-4 2 8 2-6 2 4 2-5 2 6 2-3h32" />
        </svg>
      </Label>
    </div>
  )
}
