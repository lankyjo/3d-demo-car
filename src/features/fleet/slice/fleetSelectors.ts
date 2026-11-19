import { carById } from '@/lib/cars'
import type { RootState } from '@/store/store'

export const selectCar = (s: RootState) => carById(s.fleet.selectedId)
export const selectPage = (s: RootState) => s.fleet.page
export const selectDrawerOpen = (s: RootState) => s.fleet.drawerOpen
