import { configureStore, createSelector } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { carById, quote, rentalDays } from '@/lib/cars'
import { checkoutSlice } from './checkoutSlice'
import { fleetSlice } from './fleetSlice'
import { tripSlice } from './tripSlice'

export const makeStore = () =>
  configureStore({ reducer: { fleet: fleetSlice.reducer, trip: tripSlice.reducer, checkout: checkoutSlice.reducer } })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const selectCar = (s: RootState) => carById(s.fleet.selectedId)
export const selectDays = (s: RootState) => rentalDays(s.trip.pickup, s.trip.dropoff)
export const selectQuote = createSelector([selectCar, selectDays, (s: RootState) => s.trip.extraIds], quote)
