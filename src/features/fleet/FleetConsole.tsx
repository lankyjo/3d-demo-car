'use client'
import Link from 'next/link'
import { telemetry } from '@/lib/telemetry'
import { selectCar, useAppSelector } from '@/store/store'
import { Stage } from '@/components/Stage'
import { Cta, Label } from '@/components/ui'
import { FleetStrip } from './FleetStrip'
import { PricingPanel } from './PricingPanel'
import { UnitPanel } from './UnitPanel'

export function FleetConsole() {
  const car = useAppSelector(selectCar)
  const t = telemetry(car)

  return (
    <main className="flex flex-col gap-6 px-4 pt-6 pb-8 sm:px-8">
      <div className="grid items-stretch gap-6 lg:grid-cols-[18rem_1fr_18rem] xl:grid-cols-[19rem_1fr_19rem]">
        <div className="order-2 lg:order-1"><UnitPanel /></div>
        <div className="order-1 flex flex-col items-center gap-5 lg:order-2">
          <Stage carId={car.id} />
          <Link href="/checkout" className="group block">
            <Cta>Deploy this car</Cta>
          </Link>
          <Label className="flex-wrap justify-center">
            Est. deploy time: <span className="text-ink tabular-nums">00:{t.deploySecs}</span>
            <span className="size-1.5 rounded-full bg-cyan" />
            Vehicle ID: <span className="text-ink">{t.vehicleId}</span>
          </Label>
        </div>
        <div className="order-3"><PricingPanel /></div>
      </div>
      <FleetStrip />
    </main>
  )
}
