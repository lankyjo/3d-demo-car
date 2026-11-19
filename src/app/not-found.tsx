import Link from 'next/link'
import { Header } from '@/components/Header'
import { Cta, Label, Panel } from '@/components/ui'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="grid place-items-center px-4 py-24">
        <Panel padding="p-10" className="w-full max-w-lg">
          <div className="space-y-5 text-center">
            <Label className="justify-center text-alert">Error 404 · Signal lost</Label>
            <p className="font-display text-7xl text-ink drop-shadow-[0_0_20px_rgb(39_225_255/0.4)]">404</p>
            <p className="text-mute">No unit at this location. The fleet is still on the main grid.</p>
            <Link href="/" className="group mx-auto block w-fit"><Cta>Back to fleet</Cta></Link>
          </div>
        </Panel>
      </main>
    </>
  )
}
