import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { cars } from '@/lib/cars'

export const PAGE_SIZE = 3
export const PAGES = Math.ceil(cars.length / PAGE_SIZE)

export const fleetSlice = createSlice({
  name: 'fleet',
  initialState: { selectedId: cars[3].id, page: 0, drawerOpen: false },
  reducers: {
    select(state, action: PayloadAction<string>) {
      state.selectedId = action.payload
    },
    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.drawerOpen = action.payload
    },
    nextPage(state) {
      state.page = (state.page + 1) % PAGES
    },
  },
})

export const { select, nextPage, setDrawerOpen } = fleetSlice.actions
