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

// Phone layout: telemetry and pricing live in a bottom sheet. The way in is a summary bar on the page itself (unit,
// weekly price, "Details"), because a handle at the screen edge gets covered by mobile browser toolbars.
// Open: tap the bar or swipe it up. Close: swipe the sheet's header down, tap its handle, or tap the backdrop.
// ponytail: swipe is detected on release (no finger-following drag); add pointer tracking if it needs to feel springier.
export function MobileDrawer() {
  const dispatch = useAppDispatch()
  const open = useAppSelector(selectDrawerOpen)
  const car = useAppSelector(selectCar)
  const t = telemetry(car)
  const startY = useRef(0)
  const swipe = {
    onTouchStart: (e: React.TouchEvent) => { startY.current = e.touches[0].clientY },
    onTouchEnd: (e: React.TouchEvent) => {
      const dy = e.changedTouches[0].clientY - startY.current
      if (Math.abs(dy) > 30) dispatch(setDrawerOpen(dy < 0))
    },
  }

  return (
    <div className="w-full lg:hidden">
      <button
        {...swipe}
        aria-expanded={open}
        aria-controls="unit-sheet"
        onClick={() => dispatch(setDrawerOpen(true))}
        className="relative z-10 flex w-full touch-none items-center gap-3 rounded-2xl border border-ice/30 bg-panel/90 px-4 py-2.5 text-left backdrop-blur"
      >
        <span className="min-w-0 flex-1">
          <Label><Dot /> Unit {t.unit}</Label>
          <span className="mt-0.5 block truncate text-[0.9375rem] tracking-[0.08em] uppercase">{car.brand} {car.model}</span>
        </span>
        <span className="shrink-0 text-right">
          <span className="font-display text-lg tabular-nums">{money(weeklyRate(car))}</span>
          <span className="hud ml-1.5 text-[0.625rem] text-cyan">/ week</span>
        </span>
        <span className="hud flex shrink-0 flex-col items-center text-[0.5625rem] text-cyan">
          <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7" /></svg>
          Details
        </span>
      </button>

      <div
        aria-hidden
        onClick={() => dispatch(setDrawerOpen(false))}
        className={`fixed inset-0 z-40 bg-void/70 backdrop-blur-sm transition-opacity duration-300 ${open ? 'pointer-events-auto opacity-100' : 'opacity-0'}`}
      />
      <section
        id="unit-sheet"
        aria-label="Unit details"
        inert={!open}
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-3xl border-t border-ice/40 bg-panel/95 shadow-[0_-12px_40px_rgb(0_120_255/0.25)] backdrop-blur-xl transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div {...swipe} className="shrink-0 touch-none">
          <button aria-label="Close details" onClick={() => dispatch(setDrawerOpen(false))} className="flex w-full justify-center py-3.5">
            <span className="h-1 w-10 rounded-full bg-mute/60" />
          </button>
        </div>
        {/* Extra bottom padding keeps the last card clear of browser toolbars and the home indicator. */}
        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 pb-[calc(5rem+env(safe-area-inset-bottom))]">
          <UnitPanel />
          <PricingPanel />
          <Link href="/credits" className="hud block text-center text-[0.5625rem] text-mute/60">Photo credits</Link>
        </div>
      </section>
    </div>
  )
}
