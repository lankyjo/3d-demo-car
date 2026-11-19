import type { RootState } from '@/store/store'

export const selectDriver = (s: RootState) => s.checkout.driver
export const selectBooking = (s: RootState) => s.checkout.booking
