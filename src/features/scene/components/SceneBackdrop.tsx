'use client'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { selectCar, selectPreviousId } from '@/features/fleet/slice/fleetSelectors'
import { selectView } from '../slice/sceneSelectors'

const CarViewer = dynamic(() => import('./CarViewer').then((m) => m.CarViewer), { ssr: false })

// One full-screen 3D scene behind every page. It lives in the root layout so it survives navigation: the car can
// spin and zoom from the fleet framing into the checkout framing without a reload, and the grid runs edge to edge.
export function SceneBackdrop() {
  const pathname = usePathname()
  const car = useAppSelector(selectCar)
  const previousId = useAppSelector(selectPreviousId)
  const view = useAppSelector((s) => selectView(s, pathname))
  if (!view) return null
  return (
    <div className="fixed inset-0 z-0">
      <CarViewer id={car.id} previousId={previousId} view={view} />
    </div>
  )
}
