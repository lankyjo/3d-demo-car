'use client'
import { telemetry } from '@/lib/telemetry'
import { useAppSelector } from '@/store/hooks'
import { Chevrons, Label } from '@/components/ui'
import { selectCar } from '@/features/fleet/slice/fleetSelectors'
import { Stage } from '@/features/scene/components/Stage'
import { Stagger } from '@/features/scene/components/Stagger'
import { TravelLink } from '@/features/scene/components/TravelLink'
import { TripPanel } from '@/features/trip/components/TripPanel'
import { selectBooking } from '../slice/checkoutSelectors'
import { Confirmation } from './Confirmation'
import { DriverPanel } from './DriverPanel'

// The car is drawn behind the page by SceneBackdrop, closer in than on the fleet page and standing still.
export function Checkout() {
  const car = useAppSelector(selectCar)
  const booking = useAppSelector(selectBooking)
  const t = telemetry(car)

  return (
    <main className="grid grid-cols-1 gap-6 px-4 pt-6 pb-10 sm:px-8 lg:grid-cols-[20rem_1fr_22rem]">
      <Stagger i={2} from="left" className="order-2 lg:order-1">{!booking && <TripPanel />}</Stagger>
      <div className="order-1 flex min-w-0 flex-col items-center gap-4 lg:order-2">
        {!booking && (
          <Stagger i={1} from="up" className="self-start">
            <TravelLink href="/" className="hud flex items-center gap-2 text-mute transition hover:text-cyan">
              <Chevrons className="size-4 rotate-180" /> Back to fleet
            </TravelLink>
          </Stagger>
        )}
        <Stagger i={1} from="up" className="text-center">
          <Label className="justify-center">Unit {t.unit} · {t.vehicleId}</Label>
          <h1 className="mt-2 font-display text-2xl tracking-[0.08em] uppercase">{car.brand} {car.model}</h1>
        </Stagger>
        <Stagger i={4} className="flex w-full flex-col lg:flex-1"><Stage className="h-[38vh] lg:h-auto lg:flex-1" /></Stagger>
      </div>
      <Stagger i={3} from="right" className="order-3">{booking ? <Confirmation bookingRef={booking.ref} /> : <DriverPanel />}</Stagger>
    </main>
  )
}
