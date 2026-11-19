import Link from 'next/link'
import { Dot, Label, Panel } from './ui'

const nav = [
  ['Fleet', '/#fleet'],
  ['How it works', '/#how'],
  ['Drivers', '/#drivers'],
] as const

export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-6 px-4 pt-6 sm:px-8">
      <Link href="/" className="leading-none">
        <span className="block font-display text-3xl font-semibold tracking-[0.12em] drop-shadow-[0_0_10px_rgb(230_238_255/0.35)]">OGA FLEET</span>
        <span className="hud mt-2 block text-[10px] text-ink/80">Next-gen rental fleet system</span>
      </Link>
      <nav className="hidden gap-14 md:flex">
        {nav.map(([label, href]) => (
          <Link key={href} href={href} className="hud text-[13px] text-ink/90 transition hover:text-cyan">{label}</Link>
        ))}
      </nav>
      <Panel padding="px-5 py-3" className="hidden sm:block">
        <div className="flex items-center gap-8">
          <div>
            <Label className="text-[10px]">System status</Label>
            <p className="hud mt-1 text-[13px] text-ink">Operational</p>
          </div>
          <Dot />
        </div>
      </Panel>
    </header>
  )
}
