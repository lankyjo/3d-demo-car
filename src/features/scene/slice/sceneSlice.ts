import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppThunk } from '@/store/store'

// How long the leaving page's interface takes to stagger out before the route changes (see `stagger` in globals.css).
export const LEAVE_MS = 850

export const sceneSlice = createSlice({
  name: 'scene',
  // A page change in progress: set when the leaving page starts to stagger out, cleared once the new page is up.
  initialState: { travel: null as { from: string; to: string } | null },
  reducers: {
    travelStarted(state, action: PayloadAction<{ from: string; to: string }>) {
      state.travel = action.payload
    },
    travelEnded(state) {
      state.travel = null
    },
  },
})

// Animated navigation: the current page staggers out and the 3D scene starts moving to the next page's framing,
// then the route changes. `push` is the router's; `then` runs once the new page is up (e.g. resetting a booking).
// The travel must be cleared on arrival: if it lingered, coming back to `from` with the browser's back button
// would still count as "leaving" and the page would render hidden.
export const travel =
  (push: (href: string) => void, from: string, to: string, then?: () => void): AppThunk =>
  async (dispatch, getState) => {
    if (getState().scene.travel) return // a page change is already under way
    dispatch(sceneSlice.actions.travelStarted({ from, to }))
    await new Promise((done) => setTimeout(done, LEAVE_MS))
    push(to)
    // The router swaps the page and the URL together, so wait for the URL (give up after a few seconds).
    const deadline = Date.now() + 4000
    while (window.location.pathname !== to && Date.now() < deadline) await new Promise(requestAnimationFrame)
    dispatch(sceneSlice.actions.travelEnded())
    then?.()
  }
