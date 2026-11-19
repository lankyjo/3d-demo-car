'use client'
import Link from 'next/link'
import { telemetry } from '@/lib/telemetry'
import { useAppSelector } from '@/store/hooks'
import { selectCar } from '../slice/fleetSelectors'
import { Stage } from '@/components/Stage'
import { Cta, Label } from '@/components/ui'
import { FleetStrip } from './FleetStrip'
import { PricingPanel } from './PricingPanel'
import { UnitPanel } from './UnitPanel'

// The whole console fits one desktop screen: side panels and the stage share the space above the fleet strip.
export function FleetConsole() {
  const car = useAppSelector(selectCar)
  const t = telemetry(car)

  return (
    <main className="flex flex-1 flex-col gap-5 px-4 pt-5 pb-3 sm:px-8">
      <div className="grid flex-1 items-stretch gap-6 lg:grid-cols-[16.5rem_1fr_16.5rem] xl:grid-cols-[17.5rem_1fr_17.5rem]">
        <div className="relative z-10 order-2 lg:order-1 lg:pb-20"><UnitPanel /></div>
        <div className="order-1 flex flex-col items-center gap-4 lg:order-2">
          <Stage carId={car.id} />
          <Link href="/checkout" className="group relative z-10 block w-full max-w-md">
            <Cta>Deploy this car</Cta>
          </Link>
          <Label className="relative z-10 flex-wrap justify-center">
            Est. deploy time: <span className="text-ink tabular-nums">00:{t.deploySecs}</span>
            <span className="size-1.5 rounded-full bg-cyan" />
            Vehicle ID: <span className="text-ink">{t.vehicleId}</span>
          </Label>
        </div>
        <div className="relative z-10 order-3 lg:pb-20"><PricingPanel /></div>
      </div>
      <FleetStrip />
      <Link href="/credits" className="hud self-end text-[9px] text-mute/50 transition hover:text-cyan">Photo credits</Link>
    </main>
  )
}
