import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { localDate, locations } from '@/lib/cars'

export const tripSlice = createSlice({
  name: 'trip',
  initialState: () => ({ location: locations[0], pickup: localDate(1), dropoff: localDate(8), extraIds: [] as string[] }),
  reducers: {
    setLocation(state, action: PayloadAction<string>) {
      state.location = action.payload
    },
    setPickup(state, action: PayloadAction<string>) {
      state.pickup = action.payload
    },
    setDropoff(state, action: PayloadAction<string>) {
      state.dropoff = action.payload
    },
    toggleExtra(state, action: PayloadAction<string>) {
      const i = state.extraIds.indexOf(action.payload)
      if (i === -1) state.extraIds.push(action.payload)
      else state.extraIds.splice(i, 1)
    },
    clearExtras(state) {
      state.extraIds = []
    },
  },
})

export const { setLocation, setPickup, setDropoff, toggleExtra, clearExtras } = tripSlice.actions
