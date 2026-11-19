'use client'
import { clock, telemetry } from '@/lib/telemetry'
import { selectCar, useAppSelector } from '@/store/store'
import { Dot, Label, Panel, Pin, Row } from '@/components/ui'

function Meter({ label, value, ratio }: { label: string; value: string; ratio: number }) {
  return (
    <div className="grid grid-cols-[1fr_auto_3.5rem] items-center gap-3 py-1 text-xs tracking-[0.1em] uppercase">
      <span>{label}</span>
      <span className="text-ink/80 tabular-nums">{value}</span>
      <span className="h-1.5 bg-line">
        <span className="block h-full bg-linear-to-r from-azure to-cyan shadow-[0_0_8px_var(--color-cyan)]" style={{ width: `${ratio * 100}%` }} />
      </span>
    </div>
  )
}

export function UnitPanel() {
  const car = useAppSelector(selectCar)
  const t = telemetry(car)
  const open = t.week.some(Boolean)

  return (
    <Panel>
      <Label><Dot /> Unit ID</Label>
      <h2 className="mt-3 border-b border-line pb-4 font-display text-lg tracking-[0.08em] uppercase">
        Unit {t.unit} / {car.brand === 'Mercedes-Benz' ? 'Mercedes' : car.brand} {car.model}
      </h2>
      <Row label="Status">
        <span className={open ? 'text-cyan' : 'text-alert'}>{open ? 'Online' : 'Booked out'}</span>
        <Dot tone={open ? 'cyan' : 'alert'} />
      </Row>
      <Row label="GPS lock">
        <span className="text-cyan">{t.gps}</span>
        <Pin />
      </Row>
      <div className="my-2 border border-line bg-abyss/50 p-3">
        <Label className="mb-2">Telemetry feed</Label>
        <Meter label="Speed" value={`${t.speed} mph`} ratio={0.55} />
        <Meter label="Battery" value={`${t.battery.toFixed(1)} V`} ratio={(t.battery - 11.5) / 1.5} />
        <Meter label={t.energyLabel} value={`${t.energy}%`} ratio={t.energy / 100} />
      </div>
      <Row label="Last sync">
        <span className="font-display tabular-nums">{clock(t.lastSync)} ago</span>
      </Row>
    </Panel>
  )
}
