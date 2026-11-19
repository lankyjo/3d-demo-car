# OGA Fleet

Next-gen rental fleet UI: Next.js (App Router) + Redux Toolkit + Tailwind v4 + React Three Fiber.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # includes the useState/useReducer ban
npm test           # pricing checks (node --test)
```

## Layout

- `src/app/` routes: `/` fleet console, `/checkout`, `not-found`. `globals.css` holds the design tokens (`@theme`) and the `bevel`, `hud`, `scene` utilities.
- `src/store/` all app state. One slice per concern (`fleetSlice`, `tripSlice`, `checkoutSlice`); `store.ts` has typed hooks and selectors. `useState`/`useReducer` are banned by ESLint.
- `src/features/` page sections (`fleet/`, `checkout/`).
- `src/components/` shared UI (`ui.tsx` panel/label/CTA, `Header`, `Stage`, `CarViewer`).
- `src/lib/` data and pure logic (`cars.ts` fleet + pricing, `telemetry.ts` mock telemetry).

Telemetry (GPS, battery, availability) is mock data; see `src/lib/telemetry.ts`.
