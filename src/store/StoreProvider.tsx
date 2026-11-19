'use client'
import { Provider } from 'react-redux'
import { makeStore, type AppStore } from './store'

// Server: a fresh store per render so requests never share state. Browser: one store for the whole session.
let browserStore: AppStore | undefined
const getStore = () => (typeof window === 'undefined' ? makeStore() : (browserStore ??= makeStore()))

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={getStore()}>{children}</Provider>
}
