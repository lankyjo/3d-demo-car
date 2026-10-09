// PROTOTYPE — Variant A "Showroom": editorial luxury hero with a 3D stage and floating glass cards.
import { useState } from 'react'
import { brands, cars, specs, type Car } from '../cars'
import { demo, money } from './demo'
import { CarViewer } from './CarViewer'
import './VariantA.css'

type Brand = (typeof brands)[number]

const max = {
  hp: Math.max(...cars.map((c) => specs[c.id].hp)),
  topSpeed: Math.max(...cars.map((c) => specs[c.id].topSpeed)),
  boot: Math.max(...cars.map((c) => specs[c.id].boot)),
  accel: Math.max(...cars.map((c) => specs[c.id].accel)),
}
const fleetTrips = cars.reduce((s, c) => s + demo[c.id].trips, 0)
const fleetRating = (cars.reduce((s, c) => s + demo[c.id].rating, 0) / cars.length).toFixed(1)
const fleetFree = cars.reduce((s, c) => s + demo[c.id].available, 0)
const fromRate = Math.min(...cars.map((c) => c.dailyRate))

const brandMark: Record<Brand, string> = { Toyota: 'T', 'Mercedes-Benz': 'M', BMW: 'B', Tesla: 'S' }

// Next Monday (or today if it's Monday), e.g. "Monday, 12 Oct".
function nextMonday() {
  const d = new Date()
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7))
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
}

function Bar({ label, value, unit, pct }: { label: string; value: string; unit: string; pct: number }) {
  return (
    <div className="va-bar">
      <div className="va-bar-head">
        <span>{label}</span>
        <b>
          {value}
          <small>{unit}</small>
        </b>
      </div>
      <div className="va-bar-track">
        <i style={{ width: `${Math.round(pct * 100)}%` }} />
      </div>
    </div>
  )
}

export function VariantA({ onPick }: { onPick: (carId: string) => void }) {
  const [brand, setBrand] = useState<Brand | 'All'>('All')
  const [carId, setCarId] = useState(cars[2].id)
  const [spin, setSpin] = useState(true)
  const [mode, setMode] = useState<'rent' | 'buy'>('rent')

  const list = brand === 'All' ? cars : cars.filter((c) => c.brand === brand)
  const car: Car = cars.find((c) => c.id === carId)!
  const s = specs[car.id]
  const d = demo[car.id]
  const idx = list.findIndex((c) => c.id === car.id)

  const pickBrand = (b: Brand | 'All') => {
    setBrand(b)
    if (b !== 'All' && car.brand !== b) setCarId(cars.find((c) => c.brand === b)!.id)
  }
  const step = (dir: 1 | -1) => setCarId(list[(Math.max(idx, 0) + dir + list.length) % list.length].id)

  return (
    <div className="va-root">
      <header className="va-top">
        <a className="va-word" href="#">
          All-Season<span>.</span>Car
        </a>
        <div className="va-seg" role="tablist">
          <button role="tab" aria-selected={mode === 'rent'} className={mode === 'rent' ? 'va-on' : ''} onClick={() => setMode('rent')}>
            <span className="va-dot" /> Rent
          </button>
          <button role="tab" aria-selected={mode === 'buy'} className={mode === 'buy' ? 'va-on' : ''} onClick={() => setMode('buy')}>
            Buy <em>soon</em>
          </button>
        </div>
        <button className="va-menu">
          Menu <span aria-hidden>≡</span>
        </button>
      </header>

      <div className="va-sub">
        <div className="va-badge" aria-hidden>
          {brandMark[car.brand]}
        </div>
        <div className="va-pills">
          <span className="va-pill">
            <b>{car.brand}</b> · {car.model}
          </span>
          <span className="va-pill">For {nextMonday()}</span>
          <span className="va-pill va-pill-live">
            <i /> {fleetFree} cars ready today
          </span>
        </div>
        <div className="va-lang">
          <b>USD · EN</b>
          <span>Free cancellation 24h</span>
        </div>
      </div>

      {mode === 'buy' && <p className="va-note">Buying opens later this year — every car below can be rented today.</p>}

      <section className="va-hero">
        <div className="va-head">
          <h1 key={car.id} className="va-title">
            Drive the <span className="va-ink" aria-hidden /> <span className="va-accent">{car.model}</span>
            <sup>+{d.trips} trips</sup>
            <br />
            from {money(car.dailyRate)} a day
          </h1>
          <div className="va-cta-row">
            <span className="va-swatch-row" aria-label="Available colours">
              {d.colors.map((c) => (
                <i key={c} style={{ background: c }} />
              ))}
            </span>
            <span className="va-muted">
              {car.year} · {car.category} · {car.fuel} · {car.seats} seats
            </span>
            <a className="va-ghost" href="#va-perf">
              Full specs
            </a>
            <button className="va-cta" onClick={() => onPick(car.id)}>
              Rent this car <span aria-hidden>↗</span>
            </button>
          </div>
        </div>

        <aside className="va-side">
          <div className="va-side-k">/ Fleet</div>
          <div className="va-side-tags">
            <span>Insured</span>
            <span>Unlimited km</span>
            <span>24/7 roadside</span>
          </div>
          <div className="va-side-dots" aria-hidden>
            <i className="va-on" />
            <i />
            <i />
          </div>
          <p className="va-side-big">
            {fleetTrips.toLocaleString()} trips driven across {cars.length} cars from {brands.length} marques, rated {fleetRating}
            <span>★</span> on average.
          </p>
          <div className="va-side-from">
            From <b>{money(fromRate)}</b>/day
          </div>
        </aside>
      </section>


      <section className="va-stage-wrap">
        <div className="va-stage">
          <div className="va-stage-glow" aria-hidden />
          <div className="va-stage-name" aria-hidden key={car.id}>
            {car.model}
          </div>
          <div className="va-canvas">
            <CarViewer id={car.id} autoRotate={spin} interactive dark />
          </div>
          <div className="va-veil" key={'v' + car.id} aria-hidden />
          <div className="va-stage-foot">
            <span>Drag to orbit · scroll to zoom</span>
            <span>
              {idx + 1 < 10 ? '0' : ''}
              {idx + 1} / {list.length < 10 ? '0' : ''}
              {list.length}
            </span>
          </div>
        </div>

        <div className="va-card va-price" key={'p' + car.id}>
          <div className="va-price-tag">
            <i /> {car.model}
          </div>
          <div className="va-price-k">Rent · per day</div>
          <div className="va-price-n">
            {money(car.dailyRate)}
            <small>.00</small>
          </div>
          <div className="va-price-sub">
            <span>Week {money(car.dailyRate * 7)}</span>
            <span className={d.available <= 2 ? 'va-hot' : ''}>{d.available} left</span>
          </div>
          <button className="va-price-go" onClick={() => onPick(car.id)} aria-label={`Book ${car.brand} ${car.model}`}>
            Book <span aria-hidden>→</span>
          </button>
        </div>

        <div className="va-chips" key={'c' + car.id}>
          <span>{s.hp} hp</span>
          <span>0–100 {s.accel}s</span>
          <span>{s.topSpeed} km/h</span>
          <span>{s.drive}</span>
        </div>

        <a className="va-card va-perf-link" href="#va-perf">
          <span className="va-perf-ico" aria-hidden />
          <span>
            <b>See +</b>
            <b>Performance</b>
            <small>
              {car.brand} {car.model} · {s.gearbox}
            </small>
          </span>
          <span aria-hidden className="va-arrow">
            ↗
          </span>
        </a>

        <button className={spin ? 'va-card va-360 va-on' : 'va-card va-360'} onClick={() => setSpin(!spin)} aria-pressed={spin}>
          <span className="va-360-ico" aria-hidden />
          <b>
            360°<small> view</small>
          </b>
          <span>{spin ? 'Turntable on — tap to pause and drag freely.' : 'Paused — drag the car or tap to spin.'}</span>
        </button>

        <div className="va-arrows">
          <button onClick={() => step(-1)} aria-label="Previous car">
            ↑
          </button>
          <button onClick={() => step(1)} aria-label="Next car" className="va-dark">
            ↓
          </button>
        </div>
      </section>

      <nav className="va-pick" aria-label="Choose a car">
        <div className="va-brands">
          {(['All', ...brands] as const).map((b) => (
            <button key={b} className={brand === b ? 'va-on' : ''} onClick={() => pickBrand(b)}>
              {b === 'All' ? '◎' : brandMark[b]}
              <span>{b === 'Mercedes-Benz' ? 'Mercedes' : b}</span>
            </button>
          ))}
        </div>
        <div className="va-thumbs">
          {list.map((c) => (
            <button key={c.id} className={c.id === car.id ? 'va-thumb va-on' : 'va-thumb'} onClick={() => setCarId(c.id)}>
              <img src={`/cars/${c.id}.webp`} alt="" loading="lazy" />
              <span className="va-thumb-name">{c.model}</span>
              <span className="va-thumb-meta">
                {money(c.dailyRate)}/d · ★ {demo[c.id].rating}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <section className="va-perf" id="va-perf">
        <div className="va-perf-head">
          <span className="va-side-k">/ Performance</span>
          <h2>
            {car.brand} <span className="va-accent">{car.model}</span>
          </h2>
          <div className="va-stats">
            <div>
              <b>★ {d.rating}</b>
              <span>Rating</span>
            </div>
            <div>
              <b>{d.trips}</b>
              <span>Trips</span>
            </div>
            <div>
              <b className={d.available <= 2 ? 'va-hot' : ''}>{d.available}</b>
              <span>Available</span>
            </div>
          </div>
        </div>
        <div className="va-bars">
          <Bar label="Power" value={String(s.hp)} unit=" hp" pct={s.hp / max.hp} />
          <Bar label="0–100 km/h" value={String(s.accel)} unit=" s" pct={1 - ((s.accel - 2) / (max.accel - 2)) * 0.85} />
          <Bar label="Top speed" value={String(s.topSpeed)} unit=" km/h" pct={s.topSpeed / max.topSpeed} />
          <Bar label="Boot" value={String(s.boot)} unit=" L" pct={s.boot / max.boot} />
        </div>
        <dl className="va-dl">
          <div>
            <dt>Drive</dt>
            <dd>{s.drive}</dd>
          </div>
          <div>
            <dt>Gearbox</dt>
            <dd>{s.gearbox}</dd>
          </div>
          <div>
            <dt>Efficiency</dt>
            <dd>{s.efficiency}</dd>
          </div>
          <div>
            <dt>Fuel</dt>
            <dd>{car.fuel}</dd>
          </div>
          <div>
            <dt>Seats</dt>
            <dd>{car.seats}</dd>
          </div>
          <div>
            <dt>Model year</dt>
            <dd>{car.year}</dd>
          </div>
        </dl>
        <button className="va-cta va-cta-wide" onClick={() => onPick(car.id)}>
          Book the {car.model} · {money(car.dailyRate)}/day <span aria-hidden>↗</span>
        </button>
      </section>
    </div>
  )
}
