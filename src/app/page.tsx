import { Header } from '@/components/Header'
import { FleetConsole } from '@/features/fleet/components/FleetConsole'

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <FleetConsole />
    </div>
  )
}
