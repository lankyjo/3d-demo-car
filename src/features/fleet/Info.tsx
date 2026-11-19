import { cars, credit } from '@/lib/cars'
import { Label, Panel } from '@/components/ui'

const steps = [
  ['01', 'Pick a unit', 'Browse the fleet, spin the car in 3D, check its week.'],
  ['02', 'Lock your dates', 'Weekly rate is 20% under daily. Rates hold for 48 hours.'],
  ['03', 'Deploy', 'Pick up at your nearest hub with your licence and go.'],
]

const requirements = ['21 or older', 'Full driving licence held 2+ years', 'Rideshare drivers: Uber/Lyft account in good standing', 'Card in the driver’s name']

// Below-the-fold sections the header nav links to.
export function Info() {
  return (
    <div className="grid gap-6 px-4 pb-10 sm:px-8 lg:grid-cols-[2fr_1fr]">
      <Panel padding="p-6">
        <div id="how" className="scroll-mt-8" />
        <Label>How it works</Label>
        <ol className="mt-5 grid gap-6 sm:grid-cols-3">
          {steps.map(([n, title, body]) => (
            <li key={n}>
              <span className="font-display text-2xl text-cyan">{n}</span>
              <p className="hud mt-2 text-sm text-ink">{title}</p>
              <p className="mt-1 text-sm text-mute">{body}</p>
            </li>
          ))}
        </ol>
      </Panel>
      <Panel padding="p-6">
        <div id="drivers" className="scroll-mt-8" />
        <Label>Drivers</Label>
        <ul className="mt-5 space-y-2 text-sm">
          {requirements.map((r) => <li key={r} className="flex gap-2"><span className="text-cyan">›</span>{r}</li>)}
        </ul>
      </Panel>
      <p className="text-xs text-mute lg:col-span-2">
        Photos and models from Wikimedia Commons (CC BY-SA):{' '}
        {cars.map((c, i) => (
          <span key={c.id}>{i > 0 && ', '}<a className="underline-offset-2 hover:text-cyan hover:underline" href={credit(c.image)} target="_blank" rel="noreferrer">{c.brand} {c.model}</a></span>
        ))}
      </p>
    </div>
  )
}
