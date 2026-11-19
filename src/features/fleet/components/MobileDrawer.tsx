'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { money, weeklyRate } from '@/lib/cars'
import { telemetry } from '@/lib/telemetry'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Dot, Label } from '@/components/ui'
import { selectCar, selectDrawerOpen } from '../slice/fleetSelectors'
import { setDrawerOpen } from '../slice/fleetSlice'
import { PricingPanel } from './PricingPanel'
import { UnitPanel } from './UnitPanel'

// Phone layout: the information cards live in a bottom sheet. Closed, it peeks with the unit and weekly price;
// swipe up or tap the handle for telemetry and pricing. The deploy button and car picker stay on the page.
// ponytail: swipe is detected on release (no finger-following drag); add pointer tracking if it needs to feel springier.
export function MobileDrawer() {
  const dispatch = useAppDispatch()
  const open = useAppSelector(selectDrawerOpen)
  const car = useAppSelector(selectCar)
  const t = telemetry(car)
  const startY = useRef(0)

  return (
    <>
      <div
        aria-hidden
        onClick={() => dispatch(setDrawerOpen(false))}
        className={`fixed inset-0 z-20 bg-void/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <section
        aria-label="Unit details"
        className={`fixed inset-x-0 bottom-0 z-30 flex max-h-[88dvh] flex-col rounded-t-3xl border-t border-ice/40 bg-panel/95 shadow-[0_-12px_40px_rgb(0_120_255/0.25)] backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${open ? 'translate-y-0' : 'translate-y-[calc(100%-5.75rem)]'}`}
      >
        <div
          className="shrink-0 touch-none px-5 pb-7"
          onTouchStart={(e) => { startY.current = e.touches[0].clientY }}
          onTouchEnd={(e) => {
            const dy = e.changedTouches[0].clientY - startY.current
            if (Math.abs(dy) > 30) dispatch(setDrawerOpen(dy < 0))
          }}
        >
          <button
            aria-expanded={open}
            aria-label={open ? 'Collapse details' : 'Expand details'}
            onClick={() => dispatch(setDrawerOpen(!open))}
            className="flex w-full justify-center py-3"
          >
            <span className="h-1 w-10 rounded-full bg-mute/60" />
          </button>
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <Label><Dot /> Unit {t.unit}</Label>
              <p className="mt-1 truncate text-base tracking-[0.08em] uppercase">{car.brand} {car.model}</p>
            </div>
            <p className="shrink-0 text-right">
              <span className="font-display text-2xl tabular-nums">{money(weeklyRate(car))}</span>
              <span className="hud ml-2 text-cyan">/ week</span>
            </p>
          </div>
        </div>
        <div inert={!open} className={`flex-1 space-y-4 overscroll-contain px-4 pb-8 ${open ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          <UnitPanel />
          <PricingPanel />
          <Link href="/credits" className="hud block text-center text-[9px] text-mute/60">Photo credits</Link>
        </div>
      </section>
    </>
  )
}
