import Link from 'next/link'
import { Dot, Label, Panel } from './ui'

// ponytail: "How it works" and "Drivers" have no pages yet, so they point at the fleet; give them routes when the content exists.
const nav = ['Fleet', 'How it works', 'Drivers']

export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-6 px-4 pt-6 sm:px-8">
      <Link href="/" className="leading-none">
        <span className="block font-display text-[1.625rem] tracking-[0.14em] [text-shadow:0_0_14px_rgb(230_238_255/0.45)]">OGA FLEET</span>
        <span className="hud mt-2 block text-[0.625rem] text-ink/80">Next-gen rental fleet system</span>
      </Link>
      <nav className="hidden gap-14 md:flex">
        {nav.map((label) => (
          <Link key={label} href="/#fleet" className="hud text-[0.8125rem] text-ink/90 transition hover:text-cyan">{label}</Link>
        ))}
      </nav>
      <Panel padding="px-5 py-3" className="hidden sm:block">
        <div className="flex items-center gap-8">
          <div>
            <Label className="text-[0.625rem]">System status</Label>
            <p className="hud mt-1 text-[0.8125rem] text-ink">Operational</p>
          </div>
          <Dot />
        </div>
      </Panel>
    </header>
  )
}
