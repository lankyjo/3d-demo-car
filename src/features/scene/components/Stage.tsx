import { Label } from '@/components/ui'

// The space a page leaves open for the 3D car (drawn behind the page by SceneBackdrop), with the scan line under it.
export function Stage({ className = 'flex-1' }: { className?: string }) {
  return (
    <div className={`relative min-h-48 w-full lg:min-h-80 ${className}`}>
      <Label className="absolute inset-x-0 bottom-1 justify-center">
        Scan mode: <span className="text-cyan">Active</span>
        <svg aria-hidden viewBox="0 0 60 12" className="h-3 w-16 text-cyan" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M0 6h14l2-4 2 8 2-6 2 4 2-5 2 6 2-3h32" />
        </svg>
      </Label>
    </div>
  )
}
