// PROTOTYPE — throwaway. Home-page redesign variants, switchable via ?variant=A..E; variantKeys[0] is the default.
// Delete this folder once a variant wins and is folded into App.tsx.
import { useSyncExternalStore } from 'react'

// First key is the home page when no ?variant= is given.
export const variantKeys = ['E', 'A', 'B', 'C', 'D'] as const
export type VariantKey = (typeof variantKeys)[number]
export const variantNames: Record<VariantKey, string> = {
  A: 'Showroom',
  B: 'Spec sheet',
  C: 'Marketplace',
  D: 'Dashboard',
  E: 'Cinematic',
}

// No (or unknown) ?variant= → the first key, the current home page.
const read = (): VariantKey => {
  const v = new URLSearchParams(location.search).get('variant')?.toUpperCase()
  return variantKeys.includes(v as VariantKey) ? (v as VariantKey) : variantKeys[0]
}

function setVariant(v: VariantKey) {
  const url = new URL(location.href)
  url.searchParams.set('variant', v)
  history.replaceState(null, '', url)
  dispatchEvent(new Event('variantchange'))
}

const step = (dir: 1 | -1) => {
  const i = variantKeys.indexOf(read())
  setVariant(variantKeys[(i + dir + variantKeys.length) % variantKeys.length])
}

function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  if (t.closest('input, textarea, select, [contenteditable]')) return
  if (e.key === 'ArrowLeft') step(-1)
  if (e.key === 'ArrowRight') step(1)
}

function subscribe(cb: () => void) {
  addEventListener('variantchange', cb)
  addEventListener('popstate', cb)
  if (import.meta.env.DEV) addEventListener('keydown', onKey)
  return () => {
    removeEventListener('variantchange', cb)
    removeEventListener('popstate', cb)
    removeEventListener('keydown', onKey)
  }
}

export const useVariant = () => useSyncExternalStore(subscribe, read)

export function PrototypeSwitcher({ current }: { current: VariantKey }) {
  if (!import.meta.env.DEV) return null
  return (
    <div style={{ position: 'fixed', zIndex: 9999, bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 4, padding: 4, borderRadius: 999, background: '#ff2d6f', color: '#fff', font: '600 13px/1 system-ui, sans-serif', boxShadow: '0 10px 30px rgba(0,0,0,.35)' }}>
      <button onClick={() => step(-1)} aria-label="Previous variant" style={btn}>←</button>
      <span style={{ padding: '0 10px', whiteSpace: 'nowrap' }}>PROTOTYPE {current} ({variantNames[current]})</span>
      <button onClick={() => step(1)} aria-label="Next variant" style={btn}>→</button>
    </div>
  )
}

const btn = { width: 32, height: 32, border: 0, borderRadius: 999, background: 'rgba(255,255,255,.18)', color: '#fff', cursor: 'pointer', font: 'inherit' }
