'use client'
import { money, weeklyRate } from '@/lib/cars'
import { days, telemetry } from '@/lib/telemetry'
import { useAppSelector } from '@/store/hooks'
import { selectCar } from '../slice/fleetSelectors'
import { Check, Dot, Label, Panel, Row } from '@/components/ui'

// This week's open days for the selected unit, in place of a utilization chart: it answers "can I get it?".
// Bars shift cyan → violet across the week, like the reference chart.
function Availability({ week }: { week: boolean[] }) {
  return (
    <div className="border-b border-line py-3.5">
      <div className="flex justify-between">
        <Label>Availability (7D)</Label>
        <span className="hud text-ink">{week.filter(Boolean).length}/7 open</span>
      </div>
      <ul className="mt-3 grid grid-cols-7 items-end gap-2 border-b border-mute/40 px-1">
        {week.map((open, i) => {
          const tint = `color-mix(in oklab, var(--color-cyan), var(--color-violet) ${(i / 6) * 100}%)`
          return (
            <li
              key={i}
              title={open ? 'Open' : 'Booked'}
              className={open ? 'h-16' : 'h-16 border border-b-0 border-line bg-[repeating-linear-gradient(135deg,var(--color-line)_0_3px,transparent_3px_7px)]'}
              style={open ? { background: `linear-gradient(to top, color-mix(in oklab, ${tint} 55%, transparent), ${tint})`, boxShadow: `0 0 10px color-mix(in oklab, ${tint} 45%, transparent)` } : undefined}
            />
          )
        })}
      </ul>
      <ul className="hud mt-1.5 grid grid-cols-7 gap-2 px-1 text-center text-[10px]">
        {week.map((open, i) => <li key={i} className={open ? 'text-ink' : 'text-mute/50'}>{days[i]}</li>)}
      </ul>
      <p className="hud mt-2 flex gap-4 text-[10px] text-mute">
        <span className="flex items-center gap-1.5"><i className="size-2 bg-cyan" />Open</span>
        <span className="flex items-center gap-1.5"><i className="size-2 border border-mute" />Booked</span>
      </p>
    </div>
  )
}

export function PricingPanel() {
  const car = useAppSelector(selectCar)
  const t = telemetry(car)

  return (
    <Panel className="h-full" tilt="right">
      <div className="flex h-full flex-col justify-between">
        <Label><Dot /> Rental pricing</Label>
        <div className="mt-4 border-b border-line pb-4">
          <Label className="text-ink">Weekly rate</Label>
          <p className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-[40px] leading-none tabular-nums [-webkit-text-stroke:1.2px_currentColor] [text-shadow:0_0_16px_rgb(230_238_255/0.55)]">{money(weeklyRate(car))}</span>
            <span className="hud text-sm text-cyan">/ week</span>
          </p>
          <p className="hud mt-2 text-[10px] text-mute">or {money(car.dailyRate)} / day</p>
        </div>
        <Row label="Rideshare compatibility">
          <span className="text-cyan">{t.rideshare}</span>
          <Check />
        </Row>
        <Availability week={t.week} />
        <p className="hud flex justify-between pt-3 text-[10px] text-mute">
          <span>Rate lock: 48H</span>
          <span>Updated: <span className="text-cyan">just now</span></span>
        </p>
      </div>
    </Panel>
  )
}
