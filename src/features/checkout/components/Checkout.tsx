'use client'
import Link from 'next/link'
import { telemetry } from '@/lib/telemetry'
import { useAppSelector } from '@/store/hooks'
import { Stage } from '@/components/Stage'
import { Chevrons, Label } from '@/components/ui'
import { selectCar } from '@/features/fleet/slice/fleetSelectors'
import { TripPanel } from '@/features/trip/components/TripPanel'
import { selectBooking } from '../slice/checkoutSelectors'
import { Confirmation } from './Confirmation'
import { DriverPanel } from './DriverPanel'

export function Checkout() {
  const car = useAppSelector(selectCar)
  const booking = useAppSelector(selectBooking)
  const t = telemetry(car)

  return (
    <main className="grid gap-6 overflow-x-clip px-4 pt-6 pb-10 sm:px-8 lg:grid-cols-[20rem_1fr_22rem]">
      <div className="relative z-10 order-2 lg:order-1">{!booking && <TripPanel />}</div>
      <div className="order-1 flex flex-col items-center gap-4 lg:order-2">
        {!booking && (
          <Link href="/" className="hud flex items-center gap-2 self-start text-mute transition hover:text-cyan">
            <Chevrons className="size-4 rotate-180" /> Back to fleet
          </Link>
        )}
        <div className="text-center">
          <Label className="justify-center">Unit {t.unit} · {t.vehicleId}</Label>
          <h1 className="mt-2 font-display text-2xl tracking-[0.08em] uppercase">{car.brand} {car.model}</h1>
        </div>
        <Stage carId={car.id} className="h-[38vh] lg:h-auto lg:flex-1" />
      </div>
      <div className="relative z-10 order-3">{booking ? <Confirmation bookingRef={booking.ref} /> : <DriverPanel />}</div>
    </main>
  )
}
