# OGA Fleet

Next-gen rental fleet UI: Next.js (App Router) + Redux Toolkit + Tailwind v4 + React Three Fiber.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # includes the useState/useReducer ban
npm test           # pricing checks (node --test)
```

## Layout

```
src/
  app/                    routes only (/, /checkout, not-found) + globals.css design tokens
  store/                  wiring only: store.ts (configureStore + types), hooks.ts, StoreProvider.tsx
  features/<name>/        one folder per domain: <name>Slice.ts, <name>Selectors.ts, components/
    fleet/                selected car, fleet strip paging; home-page panels
    trip/                 hub, dates, extras; days + quote selectors; TripPanel
    checkout/             driver form, booking; DriverPanel, Confirmation, Checkout
  components/             shared UI (ui.tsx primitives, Header, Stage, CarViewer)
  lib/                    data + pure logic, no React (cars.ts, telemetry.ts)
```

Rules (enforced by ESLint): no `useState`/`useReducer`, and components read/write state only through
`useAppSelector`/`useAppDispatch` from `@/store/hooks`. Components select through the feature's selectors, not raw state paths.

Telemetry (GPS, battery, availability) is mock data; see `src/lib/telemetry.ts`.
