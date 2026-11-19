import { Header } from '@/components/Header'
import { FleetConsole } from '@/features/fleet/FleetConsole'
import { Info } from '@/features/fleet/Info'

export default function Home() {
  return (
    <>
      <Header />
      <FleetConsole />
      <Info />
    </>
  )
}
