'use client'
import Image from 'next/image'
import { cars } from '@/lib/cars'
import { telemetry } from '@/lib/telemetry'
import { nextPage, PAGE_SIZE, PAGES, select } from '@/store/fleetSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { Chevrons, Label, Panel } from '@/components/ui'

// Photo tint per slot: cyan → violet across the strip, like the reference.
const hues = [165, 188, 208]

export function FleetStrip() {
  const dispatch = useAppDispatch()
  const { page, selectedId } = useAppSelector((s) => s.fleet)
  const shown = cars.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <div id="fleet" className="grid scroll-mt-6 gap-3 lg:grid-cols-[13rem_1fr_11rem]">
      <Panel padding="p-4" className="hidden lg:block">
        <button onClick={() => dispatch(nextPage())} className="group flex h-full w-full items-center">
          <span className="hud flex w-full items-center gap-3 border border-line px-4 py-3 text-ink transition group-hover:border-cyan/60 group-hover:text-cyan">
            <Chevrons className="size-4" /> Browse fleet
          </span>
        </button>
      </Panel>

      <Panel padding="px-4 py-3">
        <ul className="flex items-center justify-between gap-2">
          {shown.map((car, i) => {
            const active = car.id === selectedId
            return (
              <li key={car.id} className="flex min-w-0 flex-1 items-center gap-2">
                {i > 0 && <Chevrons className="hidden size-5 shrink-0 text-mute/50 sm:block" />}
                  <button
                    onClick={() => dispatch(select(car.id))}
                    aria-pressed={active}
                    className={`group w-full px-2 py-1 text-center transition ${active ? 'bg-cyan/5 outline outline-cyan/40' : ''}`}
                  >
                    <Image
                      src={`/cars/${car.id}.webp`}
                      alt=""
                      width={900}
                      height={400}
                      className="mx-auto h-16 w-auto object-contain opacity-80 transition group-hover:opacity-100 sm:h-20"
                      style={{ filter: `grayscale(1) brightness(0.6) sepia(1) hue-rotate(${hues[i]}deg) saturate(4) drop-shadow(0 0 10px rgb(58 123 255 / 0.5))` }}
                    />
                    <span className="hud mt-1 block text-ink">Unit {telemetry(car).unit}</span>
                    <span className="hud block truncate text-[11px] text-ink/80">{car.brand} {car.model}</span>
                  </button>
              </li>
            )
          })}
        </ul>
      </Panel>

      <Panel padding="p-4">
        <button onClick={() => dispatch(nextPage())} className="flex h-full w-full flex-col justify-end gap-2 text-left">
          <Label className="text-ink/80">Page {page + 1} of {PAGES}</Label>
          <span className="h-0.5 w-full bg-line">
            <span className="block h-full bg-cyan shadow-[0_0_8px_var(--color-cyan)] transition-all" style={{ width: `${((page + 1) / PAGES) * 100}%` }} />
          </span>
        </button>
      </Panel>
    </div>
  )
}
