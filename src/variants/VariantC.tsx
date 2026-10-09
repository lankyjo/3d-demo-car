import { useState } from 'react'
import { brands, cars, specs, type Car } from '../cars'
import { demo, money } from './demo'
import './VariantC.css'

type Fuel = '' | 'Hybrid' | 'Plug-in' | 'Electric' | 'Petrol'
type Sort = 'booked' | 'price-asc' | 'price-desc' | 'fastest'

// 'Hybrid' covers full + mild hybrids; 'Plug-in' is its own group.
const fuelGroup = (c: Car): Fuel =>
  c.fuel === 'Electric' ? 'Electric' : c.fuel === 'Petrol' ? 'Petrol' : c.fuel === 'Plug-in hybrid' ? 'Plug-in' : 'Hybrid'

const prices = [75, 100, 125, 150]
const minRate = Math.min(...cars.map((c) => c.dailyRate))
const totalTrips = cars.reduce((s, c) => s + demo[c.id].trips, 0)
const totalAvail = cars.reduce((s, c) => s + demo[c.id].available, 0)
const avgRating = (cars.reduce((s, c) => s + demo[c.id].rating, 0) / cars.length).toFixed(2)
const evs = cars.filter((c) => c.fuel === 'Electric')
const cheapest = [...cars].sort((a, b) => a.dailyRate - b.dailyRate)[0]
const bandTint: Record<string, string> = { Toyota: '#ece9fb', 'Mercedes-Benz': '#e6eaf6', BMW: '#e3ebfb', Tesla: '#efe8f8' }

const paths: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4.2-4.2',
  suv: 'M3 16v-4l2-5h10l4 5h2v4M3 16h18M7 16a2 2 0 1 0 4 0M15 16a2 2 0 1 0 4 0M6 12h13',
  sedan: 'M2 15v-2l3-1 3-4h7l4 4 3 1v2H2Zm4 0a2 2 0 1 0 4 0m4 0a2 2 0 1 0 4 0M8 12h11',
  hybrid: 'M12 3c4 3 6 6 6 9a6 6 0 0 1-12 0c0-3 2-6 6-9Zm0 6v10m-3-6 3 3',
  plug: 'M9 3v5m6-5v5M7 8h10v3a5 5 0 0 1-10 0V8Zm5 8v5',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  fuel: 'M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M7 8h5M15 10h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3',
  gauge: 'M4 15a8 8 0 1 1 16 0M12 15l4-5M12 15h.01',
  gear: 'M5 4v16M12 4v16M19 4v8M5 12h14',
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
  arrow: 'M7 17 17 7M8 7h9v9',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Zm-3 9 2 2 4-4',
  tag: 'M3 12V4h8l10 10-8 8L3 12Zm5-4h.01',
  clock: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
  pin: 'M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  seat: 'M7 4h5l1 9h5l1 7H8L7 4Z',
  x: 'M6 6l12 12M18 6 6 18',
}
const Icon = ({ name, size = 20 }: { name: string; size?: number }) => (
  <svg className="vc-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={paths[name]} />
  </svg>
)

const browse: { label: string; icon: string; type?: Car['category']; fuel?: Fuel }[] = [
  { label: 'SUV', icon: 'suv', type: 'SUV' },
  { label: 'Sedan', icon: 'sedan', type: 'Sedan' },
  { label: 'Hybrid', icon: 'hybrid', fuel: 'Hybrid' },
  { label: 'Plug-in', icon: 'plug', fuel: 'Plug-in' },
  { label: 'Electric', icon: 'bolt', fuel: 'Electric' },
  { label: 'Petrol', icon: 'fuel', fuel: 'Petrol' },
]

const scrollToResults = () => document.getElementById('vc-results')?.scrollIntoView({ behavior: 'smooth' })

export function VariantC({ onPick }: { onPick: (carId: string) => void }) {
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [type, setType] = useState<'' | Car['category']>('')
  const [fuel, setFuel] = useState<Fuel>('')
  const [maxPrice, setMaxPrice] = useState(0)
  const [sort, setSort] = useState<Sort>('booked')
  const [saved, setSaved] = useState<string[]>([])

  const results = cars
    .filter((c) => (!make || c.brand === make) && (!model || c.id === model) && (!type || c.category === type)
      && (!fuel || fuelGroup(c) === fuel) && (!maxPrice || c.dailyRate <= maxPrice))
    .sort((a, b) =>
      sort === 'price-asc' ? a.dailyRate - b.dailyRate
        : sort === 'price-desc' ? b.dailyRate - a.dailyRate
          : sort === 'fastest' ? specs[a.id].accel - specs[b.id].accel
            : demo[b.id].trips - demo[a.id].trips)
  const hero = results[0]
  const heroCar = hero ?? cars[0]
  const models = cars.filter((c) => !make || c.brand === make)

  const reset = () => { setMake(''); setModel(''); setType(''); setFuel(''); setMaxPrice(0) }
  const tab = !type && !fuel ? 'All' : type && !fuel ? type : fuel === 'Electric' && !type ? 'Electric' : ''
  const pickTab = (t: string) => {
    setType(t === 'Sedan' || t === 'SUV' ? t : '')
    setFuel(t === 'Electric' ? 'Electric' : '')
  }
  const chips = [
    make && { label: make, clear: () => { setMake(''); setModel('') } },
    model && { label: cars.find((c) => c.id === model)!.model, clear: () => setModel('') },
    type && { label: type, clear: () => setType('') },
    fuel && { label: fuel, clear: () => setFuel('') },
    maxPrice && { label: `≤ ${money(maxPrice)}/day`, clear: () => setMaxPrice(0) },
  ].filter((x): x is { label: string; clear: () => void } => !!x)

  return (
    <div className="vc-root">
      <header className="vc-nav">
        <a className="vc-logo" href="#vc-top"><span className="vc-logo-mark"><Icon name="bolt" size={16} /></span>Drivio</a>
        <nav className="vc-links">
          <a href="#vc-browse">Browse</a>
          <a href="#vc-results">Most booked</a>
          <a href="#vc-why">Why Drivio</a>
        </nav>
        <div className="vc-nav-right">
          <span className="vc-nav-meta"><Icon name="pin" size={16} /> 3 pickup points</span>
          <button className="vc-btn vc-btn-ghost" type="button">Sign in</button>
        </div>
      </header>

      <section className="vc-hero" id="vc-top" style={{ ['--vc-band' as string]: bandTint[heroCar.brand] }}>
        <p className="vc-eyebrow">{cars.length} cars · {brands.length} brands · {totalAvail} ready today</p>
        <h1 className="vc-h1">Find your dream car</h1>
        <p className="vc-sub">Premium rentals from {money(minRate)}/day. Pick a make, set a budget, drive off in minutes.</p>

        <form className="vc-search" onSubmit={(e) => { e.preventDefault(); scrollToResults() }}>
          <label className="vc-field">
            <span>Make</span>
            <select value={make} onChange={(e) => { setMake(e.target.value); setModel('') }}>
              <option value="">Any make</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </label>
          <label className="vc-field">
            <span>Model</span>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="">Any model</option>
              {models.map((c) => <option key={c.id} value={c.id}>{c.model}</option>)}
            </select>
          </label>
          <label className="vc-field">
            <span>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value as '' | Car['category'])}>
              <option value="">Sedan & SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
            </select>
          </label>
          <label className="vc-field">
            <span>Max price</span>
            <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}>
              <option value={0}>Any price</option>
              {prices.map((p) => <option key={p} value={p}>Up to {money(p)}/day</option>)}
            </select>
          </label>
          <button className="vc-search-btn" type="submit" aria-label={`Show ${results.length} cars`}>
            <Icon name="search" size={20} /><span className="vc-search-count">{results.length}</span>
          </button>
        </form>

        <div className="vc-stage">
          <img key={heroCar.id} className={`vc-hero-car ${hero ? '' : 'vc-dim'}`} src={`/cars/${heroCar.id}.webp`}
            alt={`${heroCar.brand} ${heroCar.model}`} />
          {hero ? (
            <div className="vc-hero-card" key={`${hero.id}-card`}>
              <span className="vc-hero-tag">Top match</span>
              <strong>{hero.brand} {hero.model}</strong>
              <span className="vc-hero-line">{specs[hero.id].hp} hp · 0-100 in {specs[hero.id].accel}s · {specs[hero.id].drive}</span>
              <span className="vc-hero-line"><Icon name="star" size={13} /> {demo[hero.id].rating} · {demo[hero.id].trips} trips</span>
              <button className="vc-btn vc-btn-primary" type="button" onClick={() => onPick(hero.id)}>
                Rent · {money(hero.dailyRate)}/day <Icon name="arrow" size={14} />
              </button>
            </div>
          ) : (
            <div className="vc-hero-card">
              <strong>No cars match</strong>
              <span className="vc-hero-line">Try raising your budget or another make.</span>
              <button className="vc-btn vc-btn-primary" type="button" onClick={reset}>Clear filters</button>
            </div>
          )}
        </div>

        <div className="vc-brands">
          {brands.map((b) => {
            const list = cars.filter((c) => c.brand === b)
            return (
              <button key={b} type="button" className={`vc-brand ${make === b ? 'is-on' : ''}`}
                onClick={() => { setMake(make === b ? '' : b); setModel('') }}>
                <strong>{b}</strong>
                <span>{list.length} models · from {money(Math.min(...list.map((c) => c.dailyRate)))}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="vc-section" id="vc-browse">
        <div className="vc-head">
          <h2 className="vc-h2">Browse by type & fuel</h2>
          <p className="vc-muted">Tap to filter the results below</p>
        </div>
        <div className="vc-tiles">
          {browse.map((t) => {
            const on = t.type ? type === t.type : fuel === t.fuel
            const n = cars.filter((c) => (t.type ? c.category === t.type : fuelGroup(c) === t.fuel)).length
            return (
              <button key={t.label} type="button" className={`vc-tile ${on ? 'is-on' : ''}`}
                onClick={() => { if (t.type) setType(on ? '' : t.type); else setFuel(on ? '' : t.fuel!); scrollToResults() }}>
                <Icon name={t.icon} size={26} />
                <strong>{t.label}</strong>
                <span>{n} cars</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="vc-section vc-promos">
        <article className="vc-promo vc-promo-blue">
          <div>
            <h3>Need a car this weekend?</h3>
            <p>{totalAvail} cars ready at the airport, downtown and central station. Book in under two minutes, free cancellation up to 24h before pickup.</p>
            <button className="vc-btn vc-btn-primary" type="button" onClick={() => onPick(cheapest.id)}>
              {cheapest.model} from {money(cheapest.dailyRate)}/day <Icon name="arrow" size={14} />
            </button>
          </div>
          <svg className="vc-promo-art" viewBox="0 0 120 100" fill="none" stroke="#4f5bd5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="18" y="20" width="84" height="66" rx="10" />
            <path d="M18 40h84M40 12v16M80 12v16" />
            <path d="M44 62l10 10 22-22" stroke="#f05aa6" />
          </svg>
        </article>
        <article className="vc-promo vc-promo-pink">
          <div>
            <h3>Going electric?</h3>
            <p>{evs.length} Teslas with up to {Math.max(...evs.map((c) => parseInt(specs[c.id].efficiency)))} km range and 0-100 from {Math.min(...evs.map((c) => specs[c.id].accel))}s. Charging card included.</p>
            <button className="vc-btn vc-btn-dark" type="button" onClick={() => { setType(''); setFuel('Electric'); scrollToResults() }}>
              Show electric cars <Icon name="arrow" size={14} />
            </button>
          </div>
          <svg className="vc-promo-art" viewBox="0 0 120 100" fill="none" stroke="#c0398a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 66V52l10-18h48l14 18h12a6 6 0 0 1 6 6v8z" />
            <circle cx="34" cy="70" r="8" /><circle cx="82" cy="70" r="8" />
            <path d="M58 16l-8 14h10l-6 12" stroke="#4f5bd5" />
          </svg>
        </article>
      </section>

      <section className="vc-section" id="vc-results">
        <div className="vc-head">
          <h2 className="vc-h2">Most booked cars</h2>
          <div className="vc-tabs" role="tablist">
            {['All', 'Sedan', 'SUV', 'Electric'].map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} type="button"
                className={`vc-tab ${tab === t ? 'is-on' : ''}`} onClick={() => pickTab(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="vc-toolbar">
          <span className="vc-count"><strong>{results.length}</strong> of {cars.length} cars</span>
          <div className="vc-chips">
            {chips.map((c) => (
              <button key={c.label} type="button" className="vc-chip" onClick={c.clear}>{c.label} <Icon name="x" size={12} /></button>
            ))}
            {chips.length > 0 && <button type="button" className="vc-clear" onClick={reset}>Clear all</button>}
          </div>
          <label className="vc-sort">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="booked">Most booked</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="fastest">Fastest 0-100</option>
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="vc-empty">
            <strong>No cars match those filters.</strong>
            <button className="vc-btn vc-btn-primary" type="button" onClick={reset}>Clear filters</button>
          </div>
        ) : (
          <div className="vc-grid">
            {results.map((c) => {
              const s = specs[c.id], d = demo[c.id], isSaved = saved.includes(c.id)
              const badge = d.available <= 3 ? { text: `Only ${d.available} left`, cls: 'vc-badge-hot' }
                : c.dailyRate <= 90 ? { text: 'Great price', cls: 'vc-badge-good' } : null
              return (
                <article key={c.id} className="vc-card">
                  <div className="vc-card-img">
                    {badge && <span className={`vc-badge ${badge.cls}`}>{badge.text}</span>}
                    <button type="button" className={`vc-save ${isSaved ? 'is-on' : ''}`} aria-pressed={isSaved}
                      aria-label={isSaved ? 'Remove from saved' : 'Save car'}
                      onClick={() => setSaved(isSaved ? saved.filter((x) => x !== c.id) : [...saved, c.id])}>
                      <Icon name="bookmark" size={16} />
                    </button>
                    <img src={`/cars/${c.id}.webp`} alt={`${c.brand} ${c.model}`} loading="lazy" />
                    <span className="vc-colors">{d.colors.map((col) => <i key={col} style={{ background: col }} />)}</span>
                  </div>
                  <div className="vc-card-body">
                    <div className="vc-card-title">
                      <h3>{c.brand === 'Mercedes-Benz' ? 'Mercedes' : c.brand} {c.model} – {c.year}</h3>
                      <span className="vc-rating"><Icon name="star" size={12} />{d.rating}</span>
                    </div>
                    <p className="vc-specline">{s.hp} hp · {s.drive} · {c.seats} seats · {s.boot} L boot · {s.topSpeed} km/h</p>
                    <div className="vc-stats">
                      <span><Icon name="gauge" size={18} />{s.accel}s</span>
                      <span><Icon name={c.fuel === 'Electric' ? 'bolt' : 'fuel'} size={18} />{c.fuel}</span>
                      <span><Icon name="gear" size={18} />{s.gearbox}</span>
                    </div>
                    <p className="vc-eff">{s.efficiency} · {d.trips} trips</p>
                    <div className="vc-card-foot">
                      <span className="vc-price">{money(c.dailyRate)}<small>/day</small></span>
                      <button type="button" className="vc-details" onClick={() => onPick(c.id)}>
                        View details <Icon name="arrow" size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="vc-section vc-why" id="vc-why">
        <h2 className="vc-h2 vc-center">Why choose Drivio?</h2>
        <div className="vc-features">
          {[
            { icon: 'tag', title: 'Transparent pricing', text: `Daily rates from ${money(minRate)} to ${money(Math.max(...cars.map((c) => c.dailyRate)))}. What you see is what you pay.` },
            { icon: 'shield', title: 'Full insurance option', text: 'Add zero-excess cover at checkout for $25/day. Roadside help 24/7.' },
            { icon: 'clock', title: 'Ready in minutes', text: `${totalAvail} cars on the lot today. Pick up, scan, drive.` },
            { icon: 'seat', title: 'Latest models only', text: `Every car is ${Math.min(...cars.map((c) => c.year))} or newer, from ${brands.length} premium brands.` },
          ].map((f) => (
            <div key={f.title} className="vc-feature">
              <span className="vc-feature-icon"><Icon name={f.icon} size={24} /></span>
              <strong>{f.title}</strong>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="vc-band">
        {[
          [totalTrips.toLocaleString(), 'trips completed'],
          [`${avgRating}★`, 'average rating'],
          [String(cars.length), 'cars in the fleet'],
          [String(brands.length), 'premium brands'],
          [String(totalAvail), 'available today'],
        ].map(([n, l]) => (
          <div key={l} className="vc-band-item"><strong>{n}</strong><span>{l}</span></div>
        ))}
      </section>

      <footer className="vc-footer">
        <span>© Drivio Rentals · Airport terminal · Downtown office · Central station</span>
      </footer>
    </div>
  )
}
