import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppThunk } from '@/store/store'

// How long the leaving page's interface takes to stagger out before the route changes (see `stagger` in globals.css).
export const LEAVE_MS = 850

export const sceneSlice = createSlice({
  name: 'scene',
  // A page change in progress. It stays set after arrival; it only counts while `from` is still the current path.
  initialState: { travel: null as { from: string; to: string } | null },
  reducers: {
    travelStarted(state, action: PayloadAction<{ from: string; to: string }>) {
      state.travel = action.payload
    },
  },
})

// Animated navigation: the current page staggers out and the 3D scene starts moving to the next page's framing,
// then the route changes. `push` is the router's; `then` runs right after it (e.g. resetting a finished booking).
export const travel =
  (push: (href: string) => void, from: string, to: string, then?: () => void): AppThunk =>
  async (dispatch, getState) => {
    if (getState().scene.travel?.from === from) return // already leaving this page
    dispatch(sceneSlice.actions.travelStarted({ from, to }))
    await new Promise((done) => setTimeout(done, LEAVE_MS))
    push(to)
    then?.()
  }
