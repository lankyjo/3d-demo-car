// MOCK — the fleet has no live telemetry feed. Values are derived from the car's index so they stay stable
// between renders and between server and client. Replace with an API call when a real feed exists.
import { cars, locations, type Car } from './cars'

export const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function telemetry(car: Car) {
  const i = cars.indexOf(car)
  const unit = String(i + 1).padStart(2, '0')
  const ev = car.fuel === 'Electric'
  return {
    unit,
    vehicleId: `OG4-${car.brand[0]}${car.model.replace(/\W/g, '')[0].toUpperCase()}-${unit}-${1000 + ((7781 + i * 137) % 9000)}`,
    gps: locations[i % locations.length],
    speed: 0,
    battery: 12.4 + (i % 4) * 0.1,
    energyLabel: ev ? 'Charge' : 'Fuel level',
    energy: 98 - ((i * 7) % 40),
    lastSync: 3 + ((i * 5) % 50),
    deploySecs: 12 + ((i * 7) % 40),
    rideshare: car.dailyRate < 100 ? 'Uber + Lyft ready' : 'Uber Black ready',
    // This week, Monday first: true = open to book.
    week: days.map((_, d) => ((i + 1) * (d + 3)) % 5 !== 0),
  }
}

export const clock = (secs: number) => `00:${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`
