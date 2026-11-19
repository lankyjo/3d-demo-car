import type { RootState } from '@/store/store'

export type View = 'fleet' | 'checkout'
const views: Record<string, View> = { '/': 'fleet', '/checkout': 'checkout' }

// True while `pathname` is staggering out.
export const selectLeaving = (s: RootState, pathname: string) => s.scene.travel?.from === pathname

// The framing the 3D scene should show: the destination's as soon as a page starts leaving. Null = no scene here.
export const selectView = (s: RootState, pathname: string): View | null =>
  views[selectLeaving(s, pathname) ? s.scene.travel!.to : pathname] ?? null
