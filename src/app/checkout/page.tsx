import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Checkout } from '@/features/checkout/components/Checkout'
import { PageShell } from '@/features/scene/components/PageShell'
import { Stagger } from '@/features/scene/components/Stagger'

export const metadata: Metadata = { title: 'Deploy · OGA Fleet' }

export default function CheckoutPage() {
  return (
    <PageShell className="min-h-dvh overflow-x-clip">
      <Stagger i={0} from="up"><Header /></Stagger>
      <Checkout />
    </PageShell>
  )
}
