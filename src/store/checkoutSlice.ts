import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Driver = { name: string; email: string; phone: string; licence: string }

const blank: Driver = { name: '', email: '', phone: '', licence: '' }

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: { driver: blank, booking: null as { ref: string } | null },
  reducers: {
    setDriverField(state, action: PayloadAction<{ field: keyof Driver; value: string }>) {
      state.driver[action.payload.field] = action.payload.value
    },
    // ponytail: client-only booking, no backend; POST to a bookings API here when one exists
    confirm: {
      reducer(state, action: PayloadAction<string>) {
        state.booking = { ref: action.payload }
      },
      prepare: () => ({ payload: crypto.randomUUID().slice(0, 8).toUpperCase() }),
    },
    reset() {
      return { driver: blank, booking: null }
    },
  },
})

export const { setDriverField, confirm, reset } = checkoutSlice.actions
