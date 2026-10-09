import { cars } from './cars'

// Any path but "/" lands here; the app has one page, so there is no router to ask.
export function NotFound() {
  const car = cars[location.pathname.length % cars.length]
  return (
    <main className="nf">
      <a className="brand" href="/" aria-label="DriveStudio home">
        <span className="brand-mark">D</span>
        <span>DriveStudio</span>
      </a>
      <div className="nf-body">
        <p className="eyebrow">Error 404 · {location.pathname}</p>
        <h1>Wrong turn.</h1>
        <p className="nf-text">This road doesn't exist. The {car.brand} {car.model} is still waiting for you on the main road.</p>
        <a className="nf-cta" href="/">Back to the fleet →</a>
      </div>
      <div className="nf-art" aria-hidden="true">
        <span>404</span>
        <img src={`/cars/${car.id}.webp`} alt="" />
      </div>
    </main>
  )
}
