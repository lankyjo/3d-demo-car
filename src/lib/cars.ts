export type Car = {
  id: string
  brand: string
  model: string
  year: number
  category: 'Sedan' | 'SUV'
  seats: number
  fuel: string
  dailyRate: number
  // Wikimedia Commons original that public/models/<id>.glb and public/cars/<id>.webp were made from; kept for attribution.
  image: string
}

const commons = 'https://upload.wikimedia.org/wikipedia/commons/'

export const cars: Car[] = [
  { id: 'toyota-camry', brand: 'Toyota', model: 'Camry', year: 2025, category: 'Sedan', seats: 5, fuel: 'Hybrid', dailyRate: 59,
    image: commons + '4/4d/Toyota_Camry_AXVH80_2.5_HEV_Platinum_White_Pearl_Mica_05.jpg' },
  { id: 'toyota-rav4', brand: 'Toyota', model: 'RAV4', year: 2024, category: 'SUV', seats: 5, fuel: 'Plug-in hybrid', dailyRate: 69,
    image: commons + '2/2d/2024_Toyota_RAV4_Prime_XSE_Premium_in_Silver_Sky_with_Midnight_Black_roof%2C_front_left.jpg' },
  { id: 'toyota-land-cruiser', brand: 'Toyota', model: 'Land Cruiser 250', year: 2024, category: 'SUV', seats: 5, fuel: 'Hybrid', dailyRate: 119,
    image: commons + 'e/e8/2024_Toyota_Land_Cruiser_250_VX_in_Platinum_White_Pearl_Mica%2C_front_left.jpg' },
  { id: 'mercedes-c-class', brand: 'Mercedes-Benz', model: 'C-Class', year: 2023, category: 'Sedan', seats: 5, fuel: 'Mild hybrid', dailyRate: 99,
    image: commons + '2/24/Mercedes-Benz_W206_IMG_5796.jpg' },
  { id: 'mercedes-e-class', brand: 'Mercedes-Benz', model: 'E-Class', year: 2024, category: 'Sedan', seats: 5, fuel: 'Mild hybrid', dailyRate: 139,
    image: commons + 'f/fd/Mercedes-Benz_W214_1X7A1841.jpg' },
  { id: 'mercedes-gle', brand: 'Mercedes-Benz', model: 'GLE', year: 2023, category: 'SUV', seats: 5, fuel: 'Mild hybrid', dailyRate: 159,
    image: commons + '8/8b/Mercedes-Benz_GLE_350_d_4MATIC_AMG_Line_%28V_167%29_%E2%80%93_f_18042021.jpg' },
  { id: 'bmw-3-series', brand: 'BMW', model: '3 Series', year: 2023, category: 'Sedan', seats: 5, fuel: 'Petrol', dailyRate: 95,
    image: commons + 'e/e4/2019_BMW_318d_SE_Automatic_2.0_Front.jpg' },
  { id: 'bmw-5-series', brand: 'BMW', model: '5 Series', year: 2024, category: 'Sedan', seats: 5, fuel: 'Petrol', dailyRate: 139,
    image: commons + '8/86/BMW_G60_520i_1X7A2443.jpg' },
  { id: 'bmw-x5', brand: 'BMW', model: 'X5', year: 2023, category: 'SUV', seats: 5, fuel: 'Plug-in hybrid', dailyRate: 165,
    image: commons + '0/03/BMW_G05_45e_IMG_3714.jpg' },
  { id: 'tesla-model-3', brand: 'Tesla', model: 'Model 3', year: 2024, category: 'Sedan', seats: 5, fuel: 'Electric', dailyRate: 89,
    image: commons + 'a/ab/Tesla_Model_3_%282023%29_Autofr%C3%BChling_Ulm_IMG_9282.jpg' },
  { id: 'tesla-model-y', brand: 'Tesla', model: 'Model Y', year: 2025, category: 'SUV', seats: 5, fuel: 'Electric', dailyRate: 99,
    image: commons + 'e/e7/Tesla_Model_Y_Premium_%28Facelift%29_%E2%80%93_f_05052026.jpg' },
  { id: 'tesla-model-s', brand: 'Tesla', model: 'Model S', year: 2023, category: 'Sedan', seats: 5, fuel: 'Electric', dailyRate: 149,
    image: commons + '9/9e/Tesla_Model_S_%28Facelift_ab_04-2016%29_%28cropped%29.jpg' },
]

// Cars with a side-profile photo at public/cars/<id>-side.webp; the rest only have the front three-quarter shot.
const sideViews = new Set(['toyota-camry', 'toyota-rav4', 'toyota-land-cruiser', 'mercedes-c-class'])
export const thumb = (car: Car) => `/cars/${car.id}${sideViews.has(car.id) ? '-side' : ''}.webp`

export const carById = (id: string) => cars.find((c) => c.id === id) ?? cars[0]

// Commons page with author + license (CC BY-SA needs attribution).
export const credit = (image: string) => `https://commons.wikimedia.org/wiki/File:${image.split('/').pop()}`

export const extras = [
  { id: 'insurance', name: 'Full insurance', perDay: 25 },
  { id: 'driver', name: 'Additional driver', perDay: 12 },
  { id: 'child-seat', name: 'Child seat', perDay: 8 },
] as const

export const locations = ['College Park, MD', 'Silver Spring, MD', 'Arlington, VA']

export const money = (n: number) => `$${n.toLocaleString('en-US')}`

const DAY = 86_400_000

// yyyy-mm-dd in the user's timezone, the format <input type="date"> uses.
export const localDate = (offsetDays = 0) => new Date(Date.now() + offsetDays * DAY).toLocaleDateString('en-CA')

// Dates are yyyy-mm-dd from <input type="date">; any partial day counts as a full day.
export function rentalDays(pickup: string, dropoff: string) {
  const ms = Date.parse(dropoff) - Date.parse(pickup)
  return Number.isFinite(ms) && ms > 0 ? Math.ceil(ms / DAY) : 0
}

// A week costs 20% less than seven single days.
export const weeklyRate = (car: Car) => Math.round(car.dailyRate * 7 * 0.8)

// Full weeks at the weekly rate; leftover days at the daily rate, never more than another week.
export function quote(car: Car, days: number, extraIds: readonly string[]) {
  const weekly = weeklyRate(car)
  const base = Math.floor(days / 7) * weekly + Math.min((days % 7) * car.dailyRate, weekly)
  const extrasTotal = extras.filter((e) => extraIds.includes(e.id)).reduce((sum, e) => sum + e.perDay, 0) * days
  return { base, extras: extrasTotal, total: base + extrasTotal }
}
export type Quote = ReturnType<typeof quote>
