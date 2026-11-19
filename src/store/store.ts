import { configureStore } from '@reduxjs/toolkit'
import { checkoutSlice } from '@/features/checkout/slice/checkoutSlice'
import { fleetSlice } from '@/features/fleet/slice/fleetSlice'
import { tripSlice } from '@/features/trip/slice/tripSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      [fleetSlice.name]: fleetSlice.reducer,
      [tripSlice.name]: tripSlice.reducer,
      [checkoutSlice.name]: checkoutSlice.reducer,
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
