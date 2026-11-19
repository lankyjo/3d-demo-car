'use client'
import Link from 'next/link'
import { extras, locations, localDate, money, type Quote } from '@/lib/cars'
import { telemetry } from '@/lib/telemetry'
import { confirm, reset, setDriverField, type Driver } from '@/store/checkoutSlice'
import { clearExtras, setDropoff, setLocation, setPickup, toggleExtra } from '@/store/tripSlice'
import { selectCar, selectDays, selectQuote, useAppDispatch, useAppSelector } from '@/store/store'
import { Stage } from '@/components/Stage'
import { Chevrons, Cta, Dot, Label, Panel } from '@/components/ui'

const driverFields: [field: keyof Driver, label: string, type: string, autoComplete: string][] = [
  ['name', 'Full name', 'text', 'name'],
  ['email', 'Email', 'email', 'email'],
  ['phone', 'Phone', 'tel', 'tel'],
  ['licence', 'Driver’s licence no.', 'text', 'off'],
]

function Summary({ days, price }: { days: number; price: Quote }) {
  return (
    <dl className="space-y-2 border-t border-line pt-4 text-sm">
      <div className="flex justify-between"><dt className="text-mute">Rental × {days} day{days === 1 ? '' : 's'}</dt><dd className="tabular-nums">{money(price.base)}</dd></div>
      {price.extras > 0 && <div className="flex justify-between"><dt className="text-mute">Extras</dt><dd className="tabular-nums">{money(price.extras)}</dd></div>}
      <div className="flex items-baseline justify-between pt-1">
        <dt className="hud text-ink">Total</dt>
        <dd className="font-display text-3xl tabular-nums drop-shadow-[0_0_10px_rgb(230_238_255/0.3)]">{money(price.total)}</dd>
      </div>
    </dl>
  )
}

function TripPanel() {
  const dispatch = useAppDispatch()
  const trip = useAppSelector((s) => s.trip)
  const days = useAppSelector(selectDays)
  // Dates default to "tomorrow" on the server and the browser; they can differ around midnight, so skip that warning.
  return (
    <Panel>
      <Label><Dot /> Mission parameters</Label>
      <div className="mt-5 space-y-4">
        <label className="block space-y-1.5">
          <Label>Pick-up hub</Label>
          <select value={trip.location} onChange={(e) => dispatch(setLocation(e.target.value))}>
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1.5">
            <Label>Pick-up</Label>
            <input type="date" suppressHydrationWarning value={trip.pickup} min={localDate()} onChange={(e) => dispatch(setPickup(e.target.value))} />
          </label>
          <label className="block space-y-1.5">
            <Label>Return</Label>
            <input type="date" suppressHydrationWarning value={trip.dropoff} min={trip.pickup} onChange={(e) => dispatch(setDropoff(e.target.value))} />
          </label>
        </div>
        {days === 0 && <p role="alert" className="hud text-alert">Return must be after pick-up</p>}
        <fieldset className="space-y-2 border-t border-line pt-4">
          <legend className="sr-only">Extras</legend>
          <Label className="mb-3">Extras</Label>
          {extras.map((x) => (
            <label key={x.id} className="flex cursor-pointer items-center gap-3 border border-line px-3 py-2.5 text-sm transition has-checked:border-cyan/60 has-checked:bg-cyan/5">
              <input type="checkbox" checked={trip.extraIds.includes(x.id)} onChange={() => dispatch(toggleExtra(x.id))} />
              <span className="flex-1">{x.name}</span>
              <span className="text-mute tabular-nums">{money(x.perDay)}/day</span>
            </label>
          ))}
        </fieldset>
      </div>
    </Panel>
  )
}

function DriverPanel() {
  const dispatch = useAppDispatch()
  const driver = useAppSelector((s) => s.checkout.driver)
  const days = useAppSelector(selectDays)
  const price = useAppSelector(selectQuote)

  return (
    <Panel>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); dispatch(confirm()) }}>
        <Label><Dot /> Driver details</Label>
        {driverFields.map(([field, label, type, autoComplete]) => (
          <label key={field} className="block space-y-1.5">
            <Label>{label}</Label>
            <input name={field} type={type} required autoComplete={autoComplete} value={driver[field]} onChange={(e) => dispatch(setDriverField({ field, value: e.target.value }))} />
          </label>
        ))}
        <Summary days={days} price={price} />
        <button className="group block w-full" disabled={days === 0}>
          <Cta>Confirm</Cta>
        </button>
      </form>
    </Panel>
  )
}

function Confirmation({ bookingRef }: { bookingRef: string }) {
  const dispatch = useAppDispatch()
  const driver = useAppSelector((s) => s.checkout.driver)
  const trip = useAppSelector((s) => s.trip)
  const days = useAppSelector(selectDays)
  const price = useAppSelector(selectQuote)

  return (
    <Panel>
      <div className="space-y-4">
        <Label><Dot /> Deployment confirmed</Label>
        <h1 className="font-display text-2xl uppercase">You’re set, {driver.name.split(' ')[0]}.</h1>
        <p className="text-sm text-mute">Confirmation sent to {driver.email}.</p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {[['Reference', bookingRef], ['Hub', trip.location], ['From', trip.pickup], ['To', trip.dropoff]].map(([k, v]) => (
            <div key={k} className="border border-line p-3"><dt><Label>{k}</Label></dt><dd className="mt-1">{v}</dd></div>
          ))}
        </dl>
        <Summary days={days} price={price} />
        <Link href="/" className="group block" onClick={() => { dispatch(reset()); dispatch(clearExtras()) }}>
          <Cta>Deploy another</Cta>
        </Link>
      </div>
    </Panel>
  )
}

export function Checkout() {
  const car = useAppSelector(selectCar)
  const booking = useAppSelector((s) => s.checkout.booking)
  const t = telemetry(car)

  return (
    <main className="grid gap-6 px-4 pt-6 pb-10 sm:px-8 lg:grid-cols-[20rem_1fr_22rem]">
      <div className="order-2 lg:order-1">{!booking && <TripPanel />}</div>
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
        <Stage carId={car.id} />
      </div>
      <div className="order-3">{booking ? <Confirmation bookingRef={booking.ref} /> : <DriverPanel />}</div>
    </main>
  )
}
