// PROTOTYPE — Variant E "Cinematic": dark game-garage stage, one car at a time.
import { useState } from 'react'
import { brands, cars, specs, locations, localDate, rentalDays, quote, type Car } from '../cars'
import { demo, money } from './demo'
import { CarViewer } from './CarViewer'
import './VariantE.css'

const all = Object.values(specs)
const maxHp = Math.max(...all.map((s) => s.hp))
const maxTop = Math.max(...all.map((s) => s.topSpeed))
const minAccel = Math.min(...all.map((s) => s.accel))
const pad = (n: number) => String(n).padStart(2, '0')

function Gauge({ label, value, unit, ratio, note }: { label: string; value: string; unit: string; ratio: number; note: string }) {
  // 270° arc: pathLength 100, track shows 75, fill shows 75 * ratio.
  return (
    <div className="ve-gauge">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ve-gauge-track" cx="50" cy="50" r="40" pathLength={100} />
        <circle className="ve-gauge-fill" cx="50" cy="50" r="40" pathLength={100} style={{ strokeDasharray: `${75 * ratio} 100` }} />
      </svg>
      <div className="ve-gauge-read">
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>
      <div className="ve-gauge-label">{label}</div>
      <div className="ve-gauge-note">{note}</div>
    </div>
  )
}

export function VariantE({ onPick }: { onPick: (carId: string) => void }) {
  const [idx, setIdx] = useState(0)
  const [openBrand, setOpenBrand] = useState<string | null>(cars[0].brand)
  const [location, setLocation] = useState(locations[0])
  const [pickup, setPickup] = useState(localDate(1))
  const [dropoff, setDropoff] = useState(localDate(4))

  const car: Car = cars[idx]
  const s = specs[car.id]
  const d = demo[car.id]
  const days = rentalDays(pickup, dropoff)
  const q = quote(car, days, [])

  const go = (i: number) => {
    const next = (i + cars.length) % cars.length
    setIdx(next)
    setOpenBrand(cars[next].brand)
  }

  return (
    <div className="ve-root">
      <div className="ve-spot" aria-hidden="true" />

      <header className="ve-header">
        <div className="ve-logo"><span>◆</span> GARAGE<em>/</em>RENT</div>
        <nav className="ve-nav">
          <span>{cars.length} cars</span>
          <span>{brands.length} marques</span>
          <span>{locations.length} pick-up points</span>
        </nav>
        <div className="ve-counter">
          <button className="ve-arrow" onClick={() => go(idx - 1)} aria-label="Previous car">‹</button>
          <span><b>{pad(idx + 1)}</b> / {pad(cars.length)}</span>
          <button className="ve-arrow" onClick={() => go(idx + 1)} aria-label="Next car">›</button>
        </div>
      </header>

      <main className="ve-main">
        <aside className="ve-select" aria-label="Choose a car">
          <div className="ve-kicker">Select vehicle</div>
          {brands.map((b) => {
            const models = cars.filter((c) => c.brand === b)
            const open = openBrand === b
            return (
              <div key={b} className={`ve-brand${open ? ' is-open' : ''}`}>
                <button className="ve-brand-btn" aria-expanded={open} onClick={() => setOpenBrand(open ? null : b)}>
                  <span>{b}</span>
                  <small>{models.length} · from {money(Math.min(...models.map((m) => m.dailyRate)))}</small>
                </button>
                <div className="ve-models">
                  <div>
                    {models.map((m) => (
                      <button
                        key={m.id}
                        className={`ve-model${m.id === car.id ? ' is-active' : ''}`}
                        aria-current={m.id === car.id}
                        tabIndex={open ? 0 : -1}
                        onClick={() => go(cars.indexOf(m))}
                      >
                        <img src={`/cars/${m.id}.webp`} alt="" loading="lazy" />
                        <span>
                          <b>{m.model}</b>
                          <small>{m.category} · {money(m.dailyRate)}/day</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </aside>

        <section className="ve-stage">
          <div className="ve-title" key={car.id}>
            <div className="ve-meta">
              <span>{car.brand}</span><i />{car.year}<i />{car.category}<i />{car.fuel}
            </div>
            <div className="ve-ghost" aria-hidden="true">{car.model}</div>
            <h1 className="ve-name">{car.model}</h1>
          </div>
          <div className="ve-floor" aria-hidden="true" />
          <div className="ve-viewer">
            <CarViewer id={car.id} camera={[4.5, 0.6, 3.5]} autoRotate interactive dark />
          </div>
          <div className="ve-hint">Drag to orbit · scroll to zoom</div>
          <div className="ve-rate">
            <span>From</span>
            <strong>{money(car.dailyRate)}</strong>
            <span>/ day</span>
          </div>
        </section>

        <aside className="ve-specs" key={car.id} aria-label="Specifications">
          <div className="ve-stats">
            <div><strong>★ {d.rating.toFixed(1)}</strong><span>rating</span></div>
            <div><strong>{d.trips}</strong><span>trips</span></div>
            <div className={d.available <= 2 ? 'is-low' : ''}><strong>{d.available}</strong><span>available</span></div>
          </div>
          <div className="ve-gauges">
            <Gauge label="Power" value={String(s.hp)} unit="hp" ratio={s.hp / maxHp} note={`${Math.round((s.hp / maxHp) * 100)}% of fleet max`} />
            <Gauge label="0–100" value={s.accel.toFixed(1)} unit="sec" ratio={minAccel / s.accel} note={`best ${minAccel.toFixed(1)}s`} />
            <Gauge label="Top speed" value={String(s.topSpeed)} unit="km/h" ratio={s.topSpeed / maxTop} note={`max ${maxTop}`} />
          </div>
          <dl className="ve-data">
            <div><dt>Drive</dt><dd>{s.drive}</dd></div>
            <div><dt>Gearbox</dt><dd>{s.gearbox}</dd></div>
            <div><dt>Efficiency</dt><dd>{s.efficiency}</dd></div>
            <div><dt>Boot</dt><dd>{s.boot} L</dd></div>
            <div><dt>Seats</dt><dd>{car.seats}</dd></div>
            <div><dt>Fuel</dt><dd>{car.fuel}</dd></div>
          </dl>
          <div className="ve-colors">
            <span>Paint</span>
            {d.colors.map((c) => <i key={c} style={{ background: c }} title={c} />)}
          </div>
        </aside>
      </main>

      <form className="ve-bar" onSubmit={(e) => { e.preventDefault(); onPick(car.id) }}>
        <label className="ve-field">
          <span>Pick-up</span>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
        <label className="ve-field">
          <span>From</span>
          <input type="date" value={pickup} min={localDate(0)} onChange={(e) => setPickup(e.target.value)} />
        </label>
        <label className="ve-field">
          <span>Return</span>
          <input type="date" value={dropoff} min={pickup} onChange={(e) => setDropoff(e.target.value)} />
        </label>
        <div className="ve-total">
          <span>{days} {days === 1 ? 'day' : 'days'} × {money(car.dailyRate)}</span>
          <strong>{money(q.total)}</strong>
        </div>
        <button className="ve-cta" type="submit" disabled={days === 0}>
          Book {car.model} <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  )
}
