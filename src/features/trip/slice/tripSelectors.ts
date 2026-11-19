import { createSelector } from '@reduxjs/toolkit'
import { quote, rentalDays } from '@/lib/cars'
import { selectCar } from '@/features/fleet/slice/fleetSelectors'
import type { RootState } from '@/store/store'

export const selectTrip = (s: RootState) => s.trip
export const selectDays = (s: RootState) => rentalDays(s.trip.pickup, s.trip.dropoff)
export const selectQuote = createSelector([selectCar, selectDays, (s: RootState) => s.trip.extraIds], quote)
