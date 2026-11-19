'use client'
import { extras, locations, localDate, money } from '@/lib/cars'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Dot, Label, Panel } from '@/components/ui'
import { selectDays, selectTrip } from '../tripSelectors'
import { setDropoff, setLocation, setPickup, toggleExtra } from '../tripSlice'

export function TripPanel() {
  const dispatch = useAppDispatch()
  const trip = useAppSelector(selectTrip)
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
