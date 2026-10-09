// PROTOTYPE — Variant B "Spec sheet": framed split-screen product page (Tesla Model S page homage).
import { useState } from 'react'
import { brands, cars, extras, specs, type Car } from '../cars'
import { CarViewer } from './CarViewer'
import { demo, money } from './demo'
import './VariantB.css'

const durations = [1, 3, 7] as const
const bottomTabs = ['Performance', 'Test drive', 'Rent'] as const

function blurb(car: Car, tab: (typeof bottomTabs)[number]) {
  const s = specs[car.id]
  const d = demo[car.id]
  if (tab === 'Performance')
    return `${s.hp} hp through a ${s.gearbox.toLowerCase()} and ${s.drive} take the ${car.model} from 0 to 100 km/h in ${s.accel} seconds, on to a ${s.topSpeed} km/h top speed. Efficiency: ${s.efficiency}.`
  if (tab === 'Test drive')
    return `Not sure yet? Book a 30-minute test drive from any branch, free. ${d.available} ${car.model}s are on the lot today, ${d.trips} renters have driven one before you.`
  return `${money(car.dailyRate)} a day, unlimited km, ${car.seats} seats and ${s.boot} L of boot. Free cancellation up to 24 hours before pickup, pay at the counter.`
}

export function VariantB({ onPick }: { onPick: (carId: string) => void }) {
  const [carId, setCarId] = useState(cars[0].id)
  const [view, setView] = useState<'3d' | 'photo'>('3d')
  const [color, setColor] = useState(0)
  const [days, setDays] = useState<(typeof durations)[number]>(3)
  const [more, setMore] = useState(false)
  const [open, setOpen] = useState<string | null>('terms')
  const [tab, setTab] = useState<(typeof bottomTabs)[number]>('Performance')

  const car = cars.find((c) => c.id === carId)!
  const s = specs[car.id]
  const d = demo[car.id]
  const siblings = cars.filter((c) => c.brand === car.brand)
  const idx = siblings.indexOf(car)

  const pick = (id: string) => {
    setCarId(id)
    setColor(0)
  }
  const step = (dir: 1 | -1) => pick(siblings[(idx + dir + siblings.length) % siblings.length].id)

  const grid: [string, string, string][] = [
    ['Power', String(s.hp), 'hp'],
    ['Acceleration', String(s.accel), 's 0–100'],
    ['Top speed', String(s.topSpeed), 'km/h'],
    ['Drive', s.drive, s.gearbox],
    ['Efficiency', s.efficiency.split(' · ')[0], s.efficiency.includes('·') ? s.efficiency.split(' · ')[1] : car.fuel],
    ['Boot', String(s.boot), 'litres'],
  ]
  const insurance = extras.find((e) => e.id === 'insurance')!

  const accordions = [
    {
      id: 'terms',
      title: 'Rental terms',
      body: (
        <ul className="vb-list">
          <li><span>Daily rate</span><b>{money(car.dailyRate)}</b></li>
          <li><span>Mileage</span><b>Unlimited</b></li>
          <li><span>Minimum age</span><b>21 years</b></li>
          <li><span>Cancellation</span><b>Free until 24h before</b></li>
        </ul>
      ),
    },
    {
      id: 'insurance',
      title: 'Insurance',
      body: (
        <ul className="vb-list">
          <li><span>Third-party liability</span><b>Included</b></li>
          <li><span>{insurance.name}</span><b>+{money(insurance.perDay)} / day</b></li>
          <li><span>{days}-day full cover</span><b>{money(insurance.perDay * days)}</b></li>
        </ul>
      ),
    },
    {
      id: 'included',
      title: 'Included & extras',
      body: (
        <ul className="vb-list">
          <li><span>Roadside assistance 24/7</span><b>Included</b></li>
          <li><span>Full tank / charge on pickup</span><b>Included</b></li>
          {extras.filter((e) => e.id !== 'insurance').map((e) => (
            <li key={e.id}><span>{e.name}</span><b>+{money(e.perDay)} / day</b></li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <div className="vb-root">
      <div className="vb-wordmark" key={car.brand}>{car.brand}</div>

      <div className="vb-frame">
        {/* LEFT — hero */}
        <section className="vb-hero">
          <nav className="vb-nav">
            <span className="vb-logo">DRIVE<i>/</i>RENT</span>
            <div className="vb-brands" role="tablist" aria-label="Brand">
              {brands.map((b) => (
                <button
                  key={b}
                  role="tab"
                  aria-selected={b === car.brand}
                  className={b === car.brand ? 'vb-on' : ''}
                  onClick={() => pick(cars.find((c) => c.brand === b)!.id)}
                >
                  {b}
                </button>
              ))}
            </div>
          </nav>

          <header className="vb-title" key={car.id}>
            <div>
              <p className="vb-eyebrow">{car.brand} · {car.year} · {car.category}</p>
              <h1>{car.model}</h1>
              <div className="vb-siblings">
                {siblings.map((c) => (
                  <button key={c.id} className={c.id === car.id ? 'vb-on' : ''} onClick={() => pick(c.id)}>
                    {c.model}
                  </button>
                ))}
              </div>
            </div>
            <div className="vb-price">
              <strong>{money(car.dailyRate)}<small> / day</small></strong>
              <span>Rental price</span>
            </div>
          </header>

          <div className="vb-stage">
            {view === '3d' ? (
              <CarViewer key={car.id} id={car.id} camera={[5.6, 1.3, 2.4]} interactive />
            ) : (
              <img key={car.id} className="vb-photo" src={`/cars/${car.id}.webp`} alt={`${car.brand} ${car.model}`} />
            )}
            <div className="vb-view" role="group" aria-label="View">
              <button className={view === 'photo' ? 'vb-on' : ''} onClick={() => setView('photo')}>Photo</button>
              <button className={view === '3d' ? 'vb-on' : ''} onClick={() => setView('3d')}>3D</button>
            </div>
            {view === '3d' && <span className="vb-hint">Drag to rotate · scroll to zoom</span>}
          </div>

          <footer className="vb-hero-foot">
            <span className="vb-stock">
              <i /> {d.available} available today
            </span>
            <div className="vb-colors" aria-label="Colour">
              {d.colors.map((hex, i) => (
                <button
                  key={hex}
                  aria-label={`Colour ${i + 1}`}
                  className={i === color ? 'vb-on' : ''}
                  style={{ background: hex }}
                  onClick={() => setColor(i)}
                />
              ))}
            </div>
            <div className="vb-pager">
              <span className="vb-dots">
                {siblings.map((c) => <i key={c.id} className={c.id === car.id ? 'vb-on' : ''} />)}
              </span>
              <button aria-label="Previous model" onClick={() => step(-1)}>‹</button>
              <button aria-label="Next model" onClick={() => step(1)}>›</button>
            </div>
          </footer>
        </section>

        {/* RIGHT — details */}
        <aside className="vb-details">
          <div className="vb-details-head">
            <h2>Details</h2>
            <div className="vb-trims" role="tablist" aria-label="Rental length">
              {durations.map((n) => (
                <button key={n} role="tab" aria-selected={n === days} className={n === days ? 'vb-on' : ''} onClick={() => setDays(n)}>
                  {n}D
                </button>
              ))}
            </div>
          </div>

          <div className="vb-total">
            <span>{days} {days === 1 ? 'day' : 'days'} · {car.model}</span>
            <strong>{money(car.dailyRate * days)}</strong>
          </div>

          <dl className="vb-grid" key={car.id}>
            {grid.map(([label, value, unit]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}<small>{unit}</small></dd>
              </div>
            ))}
          </dl>

          <button className="vb-more" aria-expanded={more} onClick={() => setMore(!more)}>
            <span className={more ? 'vb-x' : ''}>+</span> {more ? 'Fewer details' : 'More details'}
          </button>
          {more && (
            <dl className="vb-grid vb-grid-more">
              <div><dt>Gearbox</dt><dd>{s.gearbox}</dd></div>
              <div><dt>Fuel</dt><dd>{car.fuel}</dd></div>
              <div><dt>Seats</dt><dd>{car.seats}</dd></div>
              <div><dt>Body</dt><dd>{car.category}</dd></div>
              <div><dt>Model year</dt><dd>{car.year}</dd></div>
              <div><dt>On the lot</dt><dd>{d.available}<small>today</small></dd></div>
            </dl>
          )}

          <div className="vb-accordions">
            {accordions.map((a) => (
              <div key={a.id} className={`vb-acc ${open === a.id ? 'vb-open' : ''}`}>
                <button aria-expanded={open === a.id} onClick={() => setOpen(open === a.id ? null : a.id)}>
                  {a.title}
                  <span className="vb-chev" aria-hidden />
                </button>
                <div className="vb-acc-body"><div>{a.body}</div></div>
              </div>
            ))}
          </div>
        </aside>

        {/* BOTTOM strip */}
        <section className="vb-rating">
          <div className="vb-rating-head">
            <span>Rating</span>
            <span>Overall</span>
          </div>
          <div className="vb-rating-body">
            <p>Rated by {d.trips} renters. {d.rating >= 4.9 ? 'One of the top-rated cars in our fleet.' : 'Consistently loved by renters.'}</p>
            <strong>{d.rating.toFixed(1)}</strong>
          </div>
          <div className="vb-stars" style={{ ['--vb-r' as string]: `${(d.rating / 5) * 100}%` }} aria-hidden />
        </section>

        <section className="vb-info">
          <div className="vb-tabs" role="tablist">
            {bottomTabs.map((t) => (
              <button key={t} role="tab" aria-selected={t === tab} className={t === tab ? 'vb-on' : ''} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
          <p key={tab + car.id}>{blurb(car, tab)}</p>
        </section>

        <button className="vb-cta" onClick={() => onPick(car.id)}>
          <span>{money(car.dailyRate)} / day · {d.available} left</span>
          <strong>Rent now <i>→</i></strong>
        </button>
      </div>
    </div>
  )
}
