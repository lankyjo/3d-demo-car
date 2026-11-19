import { Header } from '@/components/Header'
import { FleetConsole } from '@/features/fleet/components/FleetConsole'

export default function Home() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden lg:h-auto lg:min-h-dvh lg:overflow-visible">
      <Header />
      <FleetConsole />
    </div>
  )
}
