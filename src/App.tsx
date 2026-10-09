import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, Center, Clone, ContactShadows, Environment, Lightformer, MeshReflectorMaterial, OrbitControls, useGLTF, useProgress } from '@react-three/drei'
import { PrototypeSwitcher, useVariant } from './prototype/PrototypeSwitcher'
import { variants } from './prototype/variants'
import { cars, credit, extras, localDate, locations, money, quote, rentalDays, type Car } from './cars'

type Step = 'fleet' | 'details' | 'checkout'

// Where each step's back button goes; a confirmed booking has none.
const back = { details: ['fleet', 'All cars'], checkout: ['details', 'Trip details'] } as const

export default function App() {
  const [step, setStep] = useState<Step>('fleet')
  const [carId, setCarId] = useState(cars[0].id)
  const [location, setLocation] = useState(locations[0])
  const [pickup, setPickup] = useState(() => localDate(1))
  const [dropoff, setDropoff] = useState(() => localDate(4))
  const [extraIds, setExtraIds] = useState<string[]>([])
  const [booking, setBooking] = useState<{ ref: string; name: string; email: string } | null>(null)

  const car = cars.find((c) => c.id === carId)!
  const days = rentalDays(pickup, dropoff)
  const price = quote(car, days, extraIds)

  function pickCar(id: string) {
    setCarId(id)
    setStep('details')
  }

  function confirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    // ponytail: client-only booking, no backend; POST to a bookings API here when one exists
    setBooking({ ref: crypto.randomUUID().slice(0, 8).toUpperCase(), name: String(form.get('name')), email: String(form.get('email')) })
  }

  function startOver() {
    setExtraIds([])
    setBooking(null)
    setStep('fleet')
  }

  // PROTOTYPE: the home page is a redesign candidate picked by ?variant=A..E (default: variantKeys[0]).
  const variant = useVariant()
  if (step === 'fleet') {
    const Variant = variants[variant]
    return (
      <>
        <Variant onPick={pickCar} />
        <p className="credit credit-home">
          Photos from Wikimedia Commons (CC BY-SA):{' '}
          {cars.map((c, i) => (
            <span key={c.id}>{i > 0 && ', '}<a href={credit(c.image)} target="_blank" rel="noreferrer">{c.model}</a></span>
          ))}
        </p>
        <PrototypeSwitcher current={variant} />
      </>
    )
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={startOver} aria-label="DriveStudio home">
          <span className="brand-mark">D</span>
          <span>DriveStudio</span>
        </a>
        {!booking && (
          <button className="ghost-button" onClick={() => setStep(back[step][0])}>
            ← {back[step][1]}
          </button>
        )}
      </header>

      <section className="workspace">
        <Stage car={car} />

        <aside className="panel">
          {!booking && step === 'details' && (
            <>
              <div>
                <p className="eyebrow">{car.brand}</p>
                <h1>{car.model}</h1>
                <p className="intro">{car.year} · {car.category}</p>
              </div>

              <div className="spec-row spec-row-3">
                <div><span>Seats</span><strong>{car.seats}</strong></div>
                <div><span>Fuel</span><strong>{car.fuel}</strong></div>
                <div><span>Rate</span><strong>{money(car.dailyRate)}/day</strong></div>
              </div>

              <div className="fields">
                <label className="field">
                  <span className="label">Pick-up location</span>
                  <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    {locations.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </label>
                <div className="field-pair">
                  <label className="field">
                    <span className="label">Pick-up</span>
                    <input type="date" value={pickup} min={localDate()} onChange={(e) => setPickup(e.target.value)} />
                  </label>
                  <label className="field">
                    <span className="label">Return</span>
                    <input type="date" value={dropoff} min={pickup} onChange={(e) => setDropoff(e.target.value)} />
                  </label>
                </div>
                {days === 0 && <p className="error" role="alert">Return date must be after pick-up.</p>}
              </div>

              <fieldset className="extras">
                <legend className="label">Extras</legend>
                {extras.map((x) => (
                  <label key={x.id} className="extra">
                    <input
                      type="checkbox"
                      checked={extraIds.includes(x.id)}
                      onChange={(e) => setExtraIds((ids) => (e.target.checked ? [...ids, x.id] : ids.filter((id) => id !== x.id)))}
                    />
                    <span>{x.name}</span>
                    <span className="extra-price">{money(x.perDay)}/day</span>
                  </label>
                ))}
              </fieldset>

              <Summary car={car} days={days} price={price} />

              <button className="primary-button" disabled={days === 0} onClick={() => setStep('checkout')}>
                Continue
              </button>
            </>
          )}

          {!booking && step === 'checkout' && (
            <form className="checkout" onSubmit={confirm}>
              <div>
                <p className="eyebrow">Driver details</p>
                <h1>Almost there.</h1>
                <p className="intro">{location} · {pickup} → {dropoff}</p>
              </div>

              <div className="fields">
                <label className="field"><span className="label">Full name</span><input name="name" required autoComplete="name" /></label>
                <label className="field"><span className="label">Email</span><input name="email" type="email" required autoComplete="email" /></label>
                <label className="field"><span className="label">Phone</span><input name="phone" type="tel" required autoComplete="tel" /></label>
                <label className="field"><span className="label">Driver's licence no.</span><input name="licence" required /></label>
              </div>

              <Summary car={car} days={days} price={price} />

              <button className="primary-button">Confirm booking · {money(price.total)}</button>
            </form>
          )}

          {booking && (
            <>
              <div>
                <p className="eyebrow">Booking confirmed</p>
                <h1>You're set, {booking.name.split(' ')[0]}.</h1>
                <p className="intro">Confirmation sent to {booking.email}.</p>
              </div>

              <div className="spec-row">
                <div><span>Reference</span><strong>{booking.ref}</strong></div>
                <div><span>Pick-up</span><strong>{location}</strong></div>
                <div><span>From</span><strong>{pickup}</strong></div>
                <div><span>To</span><strong>{dropoff}</strong></div>
              </div>

              <Summary car={car} days={days} price={price} />

              <button className="primary-button" onClick={startOver}>Book another car</button>
            </>
          )}
        </aside>
      </section>
    </main>
  )
}

function Summary({ car, days, price }: { car: Car; days: number; price: ReturnType<typeof quote> }) {
  return (
    <dl className="summary">
      <div><dt>{car.brand} {car.model} × {days} day{days === 1 ? '' : 's'}</dt><dd>{money(price.base)}</dd></div>
      {price.extras > 0 && <div><dt>Extras</dt><dd>{money(price.extras)}</dd></div>}
      <div className="summary-total"><dt>Total</dt><dd>{money(price.total)}</dd></div>
    </dl>
  )
}

function Stage({ car }: { car: Car }) {
  const [autoRotate, setAutoRotate] = useState(true)
  const { active } = useProgress()

  return (
    <div className="stage">
      <div className="stage-meta">
        <span>{car.brand.toUpperCase()}</span>
        <strong>{car.model}</strong>
      </div>

      <Canvas
        shadows
        style={{ position: 'absolute', inset: 0 }}
        camera={{ position: [3.8, 2.1, 4.8], fov: 34 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#f1f0ed']} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 6, 4]} intensity={2.2} castShadow />
        <directionalLight position={[-4, 3, -3]} intensity={1.1} />

        <Suspense fallback={null}>
          <Bounds fit observe margin={1.05}>
            <group position={[0, -0.76, 0]} scale={2.4}>
              <Center top>
                <CarModel url={`/models/${car.id}.glb`} />
              </Center>
            </group>

            <mesh position={[0, -0.81, 0]} receiveShadow>
              <cylinderGeometry args={[1.85, 1.92, 0.1, 96]} />
              <meshStandardMaterial color="#1b1c1f" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.759, 0]} rotation-x={-Math.PI / 2}>
              <circleGeometry args={[1.85, 96]} />
              <MeshReflectorMaterial
                resolution={1024}
                blur={[200, 60]}
                mixBlur={1}
                mixStrength={4}
                mirror={0.75}
                roughness={0.45}
                depthScale={1}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.2}
                color="#2a2b2f"
                metalness={0.4}
              />
            </mesh>
          </Bounds>
        </Suspense>

        <Environment resolution={256} environmentIntensity={0.72}>
          <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
          <Lightformer intensity={1.5} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
          <Lightformer intensity={1.5} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
        </Environment>

        <ContactShadows position={[0, -0.755, 0]} opacity={0.55} scale={5} blur={2.4} far={1.5} />
        <OrbitControls
          makeDefault
          autoRotate={autoRotate}
          autoRotateSpeed={1.25}
          enablePan={false}
          minDistance={2.7}
          maxDistance={8}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2.02}
          target={[0, 0.15, 0]}
        />
      </Canvas>

      {active && (
        <div className="loader" role="status">
          <span />
          Loading vehicle
        </div>
      )}

      <button className="ghost-button stage-spin" onClick={() => setAutoRotate((v) => !v)}>
        {autoRotate ? 'Stop spin' : 'Auto spin'}
      </button>
      <div className="hint">Drag to rotate · Scroll to zoom</div>
    </div>
  )
}

function CarModel({ url }: { url: string }) {
  return <Clone object={useGLTF(url).scene} castShadow receiveShadow />
}
