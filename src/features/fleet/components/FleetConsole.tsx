'use client'
import Link from 'next/link'
import { telemetry } from '@/lib/telemetry'
import { useAppSelector } from '@/store/hooks'
import { selectCar } from '../slice/fleetSelectors'
import { Stage } from '@/components/Stage'
import { Cta, Label } from '@/components/ui'
import { FleetStrip } from './FleetStrip'
import { MobileDrawer } from './MobileDrawer'
import { PricingPanel } from './PricingPanel'
import { UnitPanel } from './UnitPanel'

// Desktop: the whole console fits one screen, side panels and the stage sharing the space above the fleet strip.
// Phone: car, deploy button and car picker stay on the page; telemetry and pricing move into MobileDrawer.
export function FleetConsole() {
  const car = useAppSelector(selectCar)
  const t = telemetry(car)

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4 px-4 pt-3 pb-28 sm:px-8 lg:gap-5 lg:pt-5 lg:pb-3">
      <div className="grid min-h-0 flex-1 items-stretch gap-6 lg:grid-cols-[16.5rem_1fr_16.5rem] xl:grid-cols-[17.5rem_1fr_17.5rem]">
        <div className="relative z-10 hidden pb-20 lg:block"><UnitPanel /></div>
        <div className="flex min-h-0 flex-col items-center gap-4">
          <Stage carId={car.id} />
          <Link href="/checkout" className="group relative z-10 block w-full max-w-md">
            <Cta>Deploy this car</Cta>
          </Link>
          <div className="relative z-10 hidden lg:block">
            <Label className="flex-wrap justify-center">
              Est. deploy time: <span className="text-ink tabular-nums">00:{t.deploySecs}</span>
              <span className="size-1.5 rounded-full bg-cyan" />
              Vehicle ID: <span className="text-ink">{t.vehicleId}</span>
            </Label>
          </div>
        </div>
        <div className="relative z-10 hidden pb-20 lg:block"><PricingPanel /></div>
      </div>
      <div id="fleet" className="relative z-10 scroll-mt-6"><FleetStrip /></div>
      <Link href="/credits" className="hud hidden self-end text-[9px] text-mute/50 transition hover:text-cyan lg:block">Photo credits</Link>
      <MobileDrawer />
    </main>
  )
}
