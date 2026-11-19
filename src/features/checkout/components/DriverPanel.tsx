'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Cta, Dot, Label, Panel } from '@/components/ui'
import { selectDays, selectQuote } from '@/features/trip/tripSelectors'
import { selectDriver } from '../checkoutSelectors'
import { confirm, setDriverField, type Driver } from '../checkoutSlice'
import { Summary } from './Summary'

const driverFields: [field: keyof Driver, label: string, type: string, autoComplete: string][] = [
  ['name', 'Full name', 'text', 'name'],
  ['email', 'Email', 'email', 'email'],
  ['phone', 'Phone', 'tel', 'tel'],
  ['licence', 'Driver’s licence no.', 'text', 'off'],
]

export function DriverPanel() {
  const dispatch = useAppDispatch()
  const driver = useAppSelector(selectDriver)
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
