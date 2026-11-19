'use client'
import { telemetry } from '@/lib/telemetry'
import { useAppSelector } from '@/store/hooks'
import { selectCar } from '../slice/fleetSelectors'
import { Stage } from '@/features/scene/components/Stage'
import { Stagger } from '@/features/scene/components/Stagger'
import { TravelLink } from '@/features/scene/components/TravelLink'
import { Cta, Label } from '@/components/ui'
import { FleetStrip } from './FleetStrip'
import { MobileDrawer } from './MobileDrawer'
import { PricingPanel } from './PricingPanel'
import { UnitPanel } from './UnitPanel'

// Desktop: the whole console fits one screen, side panels and the stage sharing the space above the fleet strip.
// Phone: car, deploy button and car picker stay on the page; telemetry and pricing move into MobileDrawer.
// The car itself is drawn behind all of this by SceneBackdrop; <Stage> just keeps its space open.
export function FleetConsole() {
  const car = useAppSelector(selectCar)
  const t = telemetry(car)

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4 px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-8 lg:gap-5 lg:pt-5 lg:pb-3">
      <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-6 lg:grid-cols-[16.5rem_1fr_16.5rem] xl:grid-cols-[17.5rem_1fr_17.5rem]">
        <Stagger i={1} from="left" className="hidden pb-20 lg:block"><UnitPanel /></Stagger>
        <div className="flex min-h-0 min-w-0 flex-col items-center gap-3 lg:gap-4">
          <Stagger i={3} className="flex w-full flex-1 flex-col"><Stage /></Stagger>
          <Stagger i={3} className="w-full lg:hidden"><MobileDrawer /></Stagger>
          <Stagger i={4} className="w-full max-w-md">
            <TravelLink href="/checkout" className="group block">
              <Cta>Deploy this car</Cta>
            </TravelLink>
          </Stagger>
          <Stagger i={5} className="hidden lg:block">
            <Label className="flex-wrap justify-center">
              Est. deploy time: <span className="text-ink tabular-nums">00:{t.deploySecs}</span>
              <span className="size-1.5 rounded-full bg-cyan" />
              Vehicle ID: <span className="text-ink">{t.vehicleId}</span>
            </Label>
          </Stagger>
        </div>
        <Stagger i={2} from="right" className="hidden pb-20 lg:block"><PricingPanel /></Stagger>
      </div>
      <Stagger i={6}><div id="fleet" className="scroll-mt-6"><FleetStrip /></div></Stagger>
      <Stagger i={7} className="hidden self-end lg:block">
        <a href="/credits" className="hud text-[9px] text-mute/50 transition hover:text-cyan">Photo credits</a>
      </Stagger>
    </main>
  )
}
