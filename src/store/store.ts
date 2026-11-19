import { configureStore, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit'
import { checkoutSlice } from '@/features/checkout/slice/checkoutSlice'
import { fleetSlice } from '@/features/fleet/slice/fleetSlice'
import { sceneSlice } from '@/features/scene/slice/sceneSlice'
import { tripSlice } from '@/features/trip/slice/tripSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      [fleetSlice.name]: fleetSlice.reducer,
      [tripSlice.name]: tripSlice.reducer,
      [checkoutSlice.name]: checkoutSlice.reducer,
      [sceneSlice.name]: sceneSlice.reducer,
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppThunk = ThunkAction<void, RootState, unknown, UnknownAction>
