import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Checkout } from '@/features/checkout/components/Checkout'

export const metadata: Metadata = { title: 'Deploy · OGA Fleet' }

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <Checkout />
    </>
  )
}
