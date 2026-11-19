import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Label, Panel } from '@/components/ui'
import { cars, credit } from '@/lib/cars'

export const metadata: Metadata = { title: 'Credits · OGA Fleet' }

// CC BY-SA attribution for the car photos and the 3D models made from them.
export default function Credits() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Panel padding="p-8">
          <Label>Photo credits</Label>
          <p className="mt-4 text-sm text-mute">Car photos and the 3D models made from them come from Wikimedia Commons (CC BY-SA). Each link has the author and licence.</p>
          <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            {cars.map((c) => (
              <li key={c.id}>
                <a className="underline-offset-4 hover:text-cyan hover:underline" href={credit(c.image)} target="_blank" rel="noreferrer">{c.brand} {c.model}</a>
              </li>
            ))}
          </ul>
        </Panel>
      </main>
    </>
  )
}
