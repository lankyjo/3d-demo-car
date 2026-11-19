'use client'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Cta, Dot, Label, Panel } from '@/components/ui'
import { clearExtras } from '@/features/trip/slice/tripSlice'
import { selectDays, selectQuote, selectTrip } from '@/features/trip/slice/tripSelectors'
import { selectDriver } from '../slice/checkoutSelectors'
import { reset } from '../slice/checkoutSlice'
import { Summary } from './Summary'

export function Confirmation({ bookingRef }: { bookingRef: string }) {
  const dispatch = useAppDispatch()
  const driver = useAppSelector(selectDriver)
  const trip = useAppSelector(selectTrip)
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
