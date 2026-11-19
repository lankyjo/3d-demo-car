import { Header } from '@/components/Header'
import { FleetConsole } from '@/features/fleet/components/FleetConsole'
import { Info } from '@/features/fleet/components/Info'

export default function Home() {
  return (
    <>
      <Header />
      <FleetConsole />
      <Info />
    </>
  )
}
