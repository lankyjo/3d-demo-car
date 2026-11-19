'use client'
import { money, weeklyRate } from '@/lib/cars'
import { days, telemetry } from '@/lib/telemetry'
import { selectCar, useAppSelector } from '@/store/store'
import { Check, Dot, Label, Panel, Row } from '@/components/ui'

// This week's open days for the selected unit, in place of a utilization chart: it answers "can I get it?".
function Availability({ week }: { week: boolean[] }) {
  return (
    <div className="border-b border-line py-3.5">
      <div className="flex justify-between">
        <Label>Availability (this week)</Label>
        <span className="hud text-ink">{week.filter(Boolean).length}/7 open</span>
      </div>
      <ul className="mt-3 grid grid-cols-7 gap-1.5">
        {week.map((open, i) => (
          <li key={i} className="flex flex-col items-center gap-1.5">
            <span
              className={`h-12 w-full ${open ? 'bg-linear-to-t from-azure/70 to-cyan/80 shadow-[0_0_10px_rgb(39_225_255/0.35)]' : 'border border-line bg-[repeating-linear-gradient(135deg,var(--color-line)_0_3px,transparent_3px_7px)]'}`}
              title={open ? 'Open' : 'Booked'}
            />
            <span className={`hud text-[10px] ${open ? 'text-ink' : 'text-mute/60'}`}>{days[i]}</span>
          </li>
        ))}
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
    <Panel>
      <Label><Dot /> Rental pricing</Label>
      <div className="mt-4 border-b border-line pb-4">
        <Label className="text-ink/80">Weekly rate</Label>
        <p className="mt-2 flex items-baseline gap-3">
          <span className="font-display text-5xl font-semibold tabular-nums drop-shadow-[0_0_12px_rgb(230_238_255/0.3)]">{money(weeklyRate(car))}</span>
          <span className="hud text-sm text-cyan">/ week</span>
        </p>
        <p className="hud mt-1 text-[10px] text-mute">or {money(car.dailyRate)} / day</p>
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
    </Panel>
  )
}
