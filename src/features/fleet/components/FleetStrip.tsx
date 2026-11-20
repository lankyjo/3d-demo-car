'use client'
import Image from 'next/image'
import { preload } from 'react-dom'
import { cars, thumb } from '@/lib/cars'
import { telemetry } from '@/lib/telemetry'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCar, selectPage } from '../slice/fleetSelectors'
import { nextPage, PAGE_SIZE, PAGES, select } from '../slice/fleetSlice'
import { Chevrons, Dot, Label, Panel } from '@/components/ui'

// Hologram tint per slot, cyan → violet across the strip like the reference: [hue-rotate, outline colour].
const tints = [
  [165, 'rgb(39 225 255 / 0.9)'],
  [188, 'rgb(90 130 255 / 0.9)'],
  [208, 'rgb(154 91 255 / 0.9)'],
] as const

export function FleetStrip() {
  const dispatch = useAppDispatch()
  const page = useAppSelector(selectPage)
  const selectedId = useAppSelector(selectCar).id
  const shown = cars.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
  // Fetch the models of the cars on offer ahead of the click, so picking one swaps without a wait.
  for (const car of shown) preload(`/models/${car.id}.glb`, { as: 'fetch', crossOrigin: 'anonymous' })

  return (
    <Panel padding="p-0">
      <div className="grid divide-line lg:grid-cols-[13rem_1fr_12rem] lg:divide-x">
        <button onClick={() => dispatch(nextPage())} className="group hidden items-center p-4 lg:flex">
          <span className="hud flex w-full items-center gap-3 border border-mute/40 px-4 py-3 text-ink transition group-hover:border-cyan/60 group-hover:text-cyan">
            <Chevrons className="size-4" /> Browse fleet
          </span>
        </button>

        <ul className="flex items-center justify-between gap-1 px-2 py-3 sm:gap-2 sm:px-4">
          {shown.map((car, i) => {
            const active = car.id === selectedId
            const [hue, glow] = tints[i]
            return (
              <li key={car.id} className="flex min-w-0 flex-1 items-center gap-2">
                {i > 0 && <Chevrons className="hidden size-5 shrink-0 text-mute/50 sm:block" />}
                <button
                  onClick={() => dispatch(select(car.id))}
                  aria-pressed={active}
                  className={`group min-w-0 flex-1 px-2 py-1 text-center transition ${active ? 'bg-azure/8 outline outline-azure/30' : ''}`}
                >
                  <Image
                    src={thumb(car)}
                    alt=""
                    width={900}
                    height={400}
                    className="mx-auto h-12 w-auto max-w-full object-contain opacity-85 transition group-hover:opacity-100 sm:h-[4.5rem]"
                    style={{ filter: `grayscale(1) contrast(1.7) brightness(0.36) sepia(1) hue-rotate(${hue}deg) saturate(4) drop-shadow(0 0 1px ${glow}) drop-shadow(0 0 9px ${glow})` }}
                  />
                  <span className="hud mt-1 block text-ink">Unit {telemetry(car).unit}</span>
                  <span className="hud block truncate text-[0.625rem] text-ink/85 sm:text-[0.6875rem]"><span className="hidden sm:inline">{car.brand} </span>{car.model}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <button onClick={() => dispatch(nextPage())} className="flex flex-col justify-center gap-2.5 px-5 py-3 text-left lg:py-5">
          <Label className="text-ink"><Dot /> Page {page + 1} of {PAGES}</Label>
          <span className="h-0.5 w-full bg-line">
            <span className="block h-full bg-cyan shadow-[0_0_8px_var(--color-cyan)] transition-all" style={{ width: `${((page + 1) / PAGES) * 100}%` }} />
          </span>
        </button>
      </div>
    </Panel>
  )
}
