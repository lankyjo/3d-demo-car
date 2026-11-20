import { Header } from '@/components/Header'
import { FleetConsole } from '@/features/fleet/components/FleetConsole'
import { PageShell } from '@/features/scene/components/PageShell'
import { Stagger } from '@/features/scene/components/Stagger'

export default function Home() {
  return (
    <PageShell className="flex h-dvh flex-col overflow-hidden">
      <Stagger i={0} from="up"><Header /></Stagger>
      <FleetConsole />
    </PageShell>
  )
}
