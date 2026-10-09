// PROTOTYPE — Variant D: "Dashboard" bento-grid booking cockpit.
import { useState } from 'react'
import { brands, cars, specs, locations, localDate, rentalDays, quote, extras, type Car } from '../cars'
import { demo, money } from './demo'
import { CarViewer } from './CarViewer'
import './VariantD.css'

const I = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  car: 'M5 16h14M6 16l1.5-5.5A2 2 0 0 1 9.4 9h5.2a2 2 0 0 1 1.9 1.5L18 16M4 16v3h3v-2M20 16v3h-3v-2M7.5 13.5h.01M16.5 13.5h.01',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  chat: 'M4 5h16v11H9l-5 4z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1z',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  gauge: 'M4 15a8 8 0 1 1 16 0M12 15l4-5',
  leaf: 'M5 19C5 10 11 5 20 4c0 9-5 15-14 15zM5 19l7-7',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  scale: 'M12 4v16M7 20h10M4 8h16M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  calc: 'M6 3h12v18H6zM9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  clip: 'M20 11l-8 8a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7',
  sliders: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4',
  send: 'M21 3L10 14M21 3l-7 18-4-7-7-4z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  seat: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21a7 7 0 0 1 14 0',
  gearbox: 'M6 4v16M12 4v16M18 4v8M6 12h12',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  chev: 'M9 6l6 6-6 6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  pin: 'M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
}

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  )
}

const ymd = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const fmt = (s: string, o: Intl.DateTimeFormatOptions) => ymd(s).toLocaleDateString('en-US', o)

// Pin positions on the stylized map, one per location.
const pins = [
  { x: 74, y: 28, note: 'Terminal 2 · Level P1 · Bay 14' },
  { x: 42, y: 56, note: '18 Market Street · Ground floor' },
  { x: 24, y: 30, note: 'North entrance · Rental desk 3' },
]

export function VariantD({ onPick }: { onPick: (carId: string) => void }) {
  const [carId, setCarId] = useState('toyota-land-cruiser')
  const [brand, setBrand] = useState<string>('All')
  const [loc, setLoc] = useState(0)
  const [startOff, setStartOff] = useState(1)
  const [len, setLen] = useState(3)
  const [draft, setDraft] = useState('')
  const [reply, setReply] = useState('')

  const car = cars.find((c) => c.id === carId)!
  const s = specs[car.id]
  const d = demo[car.id]
  const pickup = localDate(startOff)
  const dropoff = localDate(startOff + len)
  const days = rentalDays(pickup, dropoff)
  const q = quote(car, days, [])
  const rail = brand === 'All' ? cars : cars.filter((c) => c.brand === brand)
  const ev = car.fuel === 'Electric'
  const fleetLeft = cars.reduce((n, c) => n + demo[c.id].available, 0)
  const insurance = extras.find((e) => e.id === 'insurance')!

  function pickBrand(b: string) {
    setBrand(b)
    if (b !== 'All' && car.brand !== b) setCarId(cars.find((c) => c.brand === b)!.id)
  }

  function ask(kind: 'book' | 'compare' | 'insurance' | 'estimate' | 'free') {
    const rival = cars
      .filter((c) => c.category === car.category && c.id !== car.id)
      .sort((a, b) => Math.abs(a.dailyRate - car.dailyRate) - Math.abs(b.dailyRate - car.dailyRate))[0]
    const rs = specs[rival.id]
    const lines: Record<typeof kind, string> = {
      book: `${car.model} held for ${fmt(pickup, { month: 'short', day: 'numeric' })} → ${fmt(dropoff, { month: 'short', day: 'numeric' })} at ${locations[loc]}. Tap "Pay now" to confirm ${money(q.total)}.`,
      compare: `${car.model} vs ${rival.brand} ${rival.model}: ${s.hp} vs ${rs.hp} hp, ${s.accel}s vs ${rs.accel}s 0–100, ${s.boot} vs ${rs.boot} L boot, ${money(car.dailyRate)} vs ${money(rival.dailyRate)}/day.`,
      insurance: `Full insurance is ${money(insurance.perDay)}/day — ${money(insurance.perDay * days)} for your ${days} days, zero excess. Add it at checkout.`,
      estimate: `${days} days × ${money(car.dailyRate)} = ${money(q.total)}. Taxes included, free cancellation until 24h before pickup.`,
      free: `On it: "${draft.trim()}". Best match right now is the ${car.brand} ${car.model} at ${money(car.dailyRate)}/day — ${d.available} available.`,
    }
    setReply(lines[kind])
    if (kind === 'free') setDraft('')
  }

  return (
    <div className="vd-root">
      <nav className="vd-rail" aria-label="Main">
        <div className="vd-logo">D</div>
        {[I.home, I.car, I.cal, I.chat, I.user, I.gear].map((p, i) => (
          <button key={i} className={`vd-railbtn${i === 0 ? ' vd-on' : ''}`} aria-label={['Home', 'Fleet', 'Bookings', 'Messages', 'Profile', 'Settings'][i]}>
            <Icon d={p} />
          </button>
        ))}
      </nav>

      <main className="vd-main">
        <header className="vd-top">
          <div className="vd-crumbs">
            <span>Rental cockpit</span>
            <Icon d={I.chev} size={14} />
            <span>{car.brand}</span>
            <Icon d={I.chev} size={14} />
            <b>{car.model}</b>
          </div>
          <div className="vd-topright">
            <span className="vd-fleet">
              <i /> {fleetLeft} cars ready across {locations.length} branches
            </span>
            <button className="vd-round" aria-label="Notifications">
              <Icon d={I.bell} />
              <em>2</em>
            </button>
            <button className="vd-round vd-avatar" aria-label="Account">
              AK
            </button>
          </div>
        </header>

        <div className="vd-grid">
          {/* HERO */}
          <section className="vd-hero">
            <div className="vd-herohead">
              <div>
                <p className="vd-eyebrow">
                  {car.year} · {car.category} · {car.fuel}
                </p>
                <h1>
                  {car.brand === 'Mercedes-Benz' ? 'Mercedes' : car.brand} <span>{car.model}</span>
                </h1>
                <div className="vd-pills">
                  <span className="vd-avail">
                    <i /> Available now · {d.available} left
                  </span>
                  <span className="vd-pill">{s.drive}</span>
                  <span className="vd-pill">{s.gearbox}</span>
                  <span className="vd-pill">{car.seats} seats</span>
                  <span className="vd-pill">{s.boot} L boot</span>
                </div>
              </div>
              <div className="vd-rate">
                <b>{money(car.dailyRate)}</b>
                <span>per day</span>
                <small>{d.trips} trips completed</small>
              </div>
            </div>

            <div className="vd-brands">
              {['All', ...brands].map((b) => (
                <button key={b} className={`vd-chip${brand === b ? ' vd-on' : ''}`} onClick={() => pickBrand(b)}>
                  {b}
                  <small>{b === 'All' ? cars.length : cars.filter((c) => c.brand === b).length}</small>
                </button>
              ))}
            </div>

            <div className="vd-stage">
              <div className="vd-stage3d">
                <CarViewer id={car.id} camera={[6, 1.2, 1.6]} interactive />
              </div>
              <div className="vd-swatches">
                {d.colors.map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
                <span>{d.colors.length} colours</span>
              </div>
              <span className="vd-drag">Drag to rotate · scroll to zoom</span>
            </div>

            <div className="vd-stats">
              <Stat icon={I.bolt} value={s.accel.toFixed(1)} unit="s" label="0–100 km/h" />
              <Stat icon={I.gauge} value={String(s.hp)} unit="hp" label={`Top speed ${s.topSpeed} km/h`} />
              <Stat icon={I.leaf} value={s.efficiency.split(' ')[0]} unit={s.efficiency.split(' ').slice(1).join(' ')} label={ev ? 'WLTP range' : car.fuel === 'Plug-in hybrid' ? 'Electric range' : 'Combined use'} />
              <Stat icon={I.star} value={d.rating.toFixed(1)} unit="/5" label={`${d.trips} verified trips`} />
            </div>
          </section>

          {/* ASSISTANT */}
          <aside className="vd-card vd-assist">
            <div className="vd-cardhead">
              <div>
                <h2>Assistant</h2>
                <p>How can I help with your trip?</p>
              </div>
              <span className="vd-spark">
                <Icon d={I.sparkle} />
              </span>
            </div>
            <div className="vd-actions">
              <button onClick={() => ask('book')}>
                <Icon d={I.cal} size={22} />
                <b>Book a car</b>
                <small>About 2 min</small>
              </button>
              <button onClick={() => ask('compare')}>
                <Icon d={I.scale} size={22} />
                <b>Compare</b>
                <small>Same class</small>
              </button>
              <button onClick={() => ask('insurance')}>
                <Icon d={I.shield} size={22} />
                <b>Insurance</b>
                <small>{money(insurance.perDay)}/day</small>
              </button>
              <button onClick={() => ask('estimate')}>
                <Icon d={I.calc} size={22} />
                <b>Estimate price</b>
                <small>{days} days</small>
              </button>
            </div>
            <div className="vd-reply" aria-live="polite">
              {reply || (
                <>
                  Tip: the {car.model} is booked {Math.round(d.trips / 12)}× a month on average — {d.available <= 2 ? 'only a couple left, reserve early.' : 'good availability this week.'}
                </>
              )}
            </div>
            <form
              className="vd-compose"
              onSubmit={(e) => {
                e.preventDefault()
                if (draft.trim()) ask('free')
              }}
            >
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Arrange a 7-seat SUV for next weekend…" rows={2} />
              <div className="vd-composebar">
                <button type="button" className="vd-sq" aria-label="Voice">
                  <Icon d={I.mic} size={18} />
                </button>
                <button type="button" className="vd-sq" aria-label="Attach">
                  <Icon d={I.clip} size={18} />
                </button>
                <button type="button" className="vd-sq" aria-label="Options">
                  <Icon d={I.sliders} size={18} />
                </button>
                <button type="submit" className="vd-send">
                  Send <Icon d={I.send} size={16} />
                </button>
              </div>
            </form>
          </aside>

          {/* LOCATION */}
          <section className="vd-card vd-loc">
            <div className="vd-cardhead">
              <div>
                <h3>Pickup location</h3>
                <p>{pins[loc].note}</p>
              </div>
              <select value={loc} onChange={(e) => setLoc(Number(e.target.value))} aria-label="Pickup location">
                {locations.map((l, i) => (
                  <option key={l} value={i}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="vd-map">
              <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" aria-hidden>
                <rect width="100" height="70" fill="#eceef0" />
                <path d="M60 0 Q70 30 100 38 L100 70 L80 70 Q72 46 54 40 Z" fill="#e2ebe4" />
                <circle cx="20" cy="58" r="10" fill="#e2ebe4" />
                <g stroke="#fff" strokeLinecap="round" fill="none">
                  <path d="M-5 20 L105 46" strokeWidth="4" />
                  <path d="M30 -5 L50 75" strokeWidth="4" />
                  <path d="M-5 50 Q40 40 105 62" strokeWidth="2.5" />
                  <path d="M70 -5 L60 75" strokeWidth="2.5" />
                  <path d="M10 -5 L18 75" strokeWidth="1.5" />
                  <path d="M-5 8 L105 14" strokeWidth="1.5" />
                  <path d="M85 -5 L92 75" strokeWidth="1.5" />
                </g>
              </svg>
              {pins.map((p, i) => (
                <button
                  key={i}
                  className={`vd-pin${i === loc ? ' vd-on' : ''}`}
                  style={{ left: `${p.x}%`, top: `${(p.y / 70) * 100}%` }}
                  onClick={() => setLoc(i)}
                  aria-label={locations[i]}
                >
                  <Icon d={I.pin} size={i === loc ? 22 : 14} />
                </button>
              ))}
              <span className="vd-maptag">
                {locations[loc]} · open 06:00–23:00
              </span>
            </div>
          </section>

          {/* DATES */}
          <section className="vd-card vd-dates">
            <div className="vd-cardhead">
              <div>
                <h3>My dates</h3>
                <p>{fmt(pickup, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <span className="vd-badge">{days} days</span>
            </div>
            <div className="vd-daterow">
              <DateBox label="Pick-up" date={pickup} onMinus={() => setStartOff(Math.max(0, startOff - 1))} onPlus={() => setStartOff(startOff + 1)} />
              <span className="vd-arrow">
                <Icon d={I.arrow} />
              </span>
              <DateBox label="Return" date={dropoff} onMinus={() => setLen(Math.max(1, len - 1))} onPlus={() => setLen(len + 1)} />
            </div>
            <div className="vd-time">
              <Icon d={I.clock} />
              <div>
                <b>10:00</b>
                <small>Pick-up &amp; return time</small>
              </div>
              <div className="vd-mileage">
                <b>{(days * 300).toLocaleString()} km</b>
                <small>Included mileage</small>
              </div>
            </div>
          </section>

          {/* PAYMENT */}
          <section className="vd-card vd-pay">
            <div className="vd-cardhead">
              <div>
                <h3>Payment method</h3>
                <p>Credit card</p>
              </div>
            </div>
            <div className="vd-cc">
              <div className="vd-ccrow">
                <span>•••• •••• •••• 2468</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                  <path d="M8 8a6 6 0 0 1 0 8M12 5a10 10 0 0 1 0 14M16 2a14 14 0 0 1 0 20" />
                </svg>
              </div>
              <div className="vd-ccrow vd-ccsmall">
                <span>A. Kowalski</span>
                <span>Exp 06/28</span>
              </div>
            </div>
            <dl className="vd-sum">
              <div>
                <dt>
                  {money(car.dailyRate)} × {days} days
                </dt>
                <dd>{money(q.base)}</dd>
              </div>
              <div>
                <dt>Free cancellation until</dt>
                <dd>{fmt(localDate(startOff - 1), { month: 'short', day: 'numeric' })}, 10:00</dd>
              </div>
            </dl>
            <button className="vd-paybtn" onClick={() => onPick(car.id)}>
              Pay now · {money(q.total)}
            </button>
            <p className="vd-secure">
              <Icon d={I.lock} size={14} /> Secure payment · charged at pickup
            </p>
          </section>

          {/* RECOMMENDED */}
          <section className="vd-card vd-rec">
            <div className="vd-cardhead">
              <div>
                <h3>Recommended vehicles</h3>
                <p>
                  {rail.length} {brand === 'All' ? 'in the fleet' : `from ${brand}`} · tap to preview
                </p>
              </div>
            </div>
            <div className="vd-recrail">
              {rail.map((c) => (
                <RecCard key={c.id} car={c} active={c.id === car.id} onClick={() => setCarId(c.id)} />
              ))}
            </div>
          </section>

          {/* PROMO */}
          <section className="vd-promo">
            <p className="vd-eyebrow">Book with confidence</p>
            <h3>Drive free of worry</h3>
            <p>Free cancellation up to 24h before pickup. 24/7 roadside assistance on every car.</p>
            <button className="vd-promobtn" onClick={() => ask('insurance')}>
              Learn more
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}

function Stat({ icon, value, unit, label }: { icon: string; value: string; unit: string; label: string }) {
  return (
    <div className="vd-stat">
      <span className="vd-staticon">
        <Icon d={icon} />
      </span>
      <div>
        <b>
          {value}
          <small>{unit}</small>
        </b>
        <span>{label}</span>
      </div>
    </div>
  )
}

function DateBox({ label, date, onMinus, onPlus }: { label: string; date: string; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="vd-datebox">
      <small>{label}</small>
      <div className="vd-dayline">
        <button onClick={onMinus} aria-label={`${label} earlier`}>
          −
        </button>
        <b>{ymd(date).getDate()}</b>
        <button onClick={onPlus} aria-label={`${label} later`}>
          +
        </button>
      </div>
      <span>{fmt(date, { month: 'short', weekday: 'short' })}</span>
    </div>
  )
}

function RecCard({ car, active, onClick }: { car: Car; active: boolean; onClick: () => void }) {
  return (
    <button className={`vd-recard${active ? ' vd-on' : ''}`} onClick={onClick}>
      <img src={`/cars/${car.id}.webp`} alt="" loading="lazy" />
      <b>{car.model}</b>
      <span className="vd-recmeta">
        <span>
          <Icon d={I.seat} size={14} /> {car.seats}
        </span>
        <span>
          <Icon d={I.gearbox} size={14} /> {specs[car.id].gearbox}
        </span>
      </span>
      <span className="vd-recprice">
        <b>{money(car.dailyRate)}</b> / day <i>★ {demo[car.id].rating}</i>
      </span>
    </button>
  )
}
