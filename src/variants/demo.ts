// PROTOTYPE — made-up rental stats (odometer in km) so variants have realistic density. Not real data.
export const demo: Record<string, { rating: number; trips: number; available: number; colors: string[]; odometer: number }> = {
  'toyota-camry': { rating: 4.8, trips: 412, available: 6, colors: ['#e9e9e6', '#1d1f22', '#8a8d91'], odometer: 8420 },
  'toyota-rav4': { rating: 4.7, trips: 388, available: 4, colors: ['#b9bcc0', '#1d1f22', '#7a2a2a'], odometer: 14210 },
  'toyota-land-cruiser': { rating: 4.9, trips: 156, available: 2, colors: ['#f2f1ec', '#3c4a3a', '#1d1f22'], odometer: 6890 },
  'mercedes-c-class': { rating: 4.8, trips: 274, available: 5, colors: ['#c4c7cb', '#1d1f22', '#24364f'], odometer: 18350 },
  'mercedes-e-class': { rating: 4.9, trips: 198, available: 3, colors: ['#f2f1ec', '#1d1f22', '#5b5e63'], odometer: 9120 },
  'mercedes-gle': { rating: 4.8, trips: 167, available: 2, colors: ['#f2f1ec', '#1d1f22', '#6b6f75'], odometer: 21470 },
  'bmw-3-series': { rating: 4.7, trips: 301, available: 5, colors: ['#c4c7cb', '#1f3a68', '#1d1f22'], odometer: 24800 },
  'bmw-5-series': { rating: 4.8, trips: 189, available: 3, colors: ['#f2f1ec', '#1d1f22', '#4a4d52'], odometer: 7640 },
  'bmw-x5': { rating: 4.9, trips: 143, available: 2, colors: ['#f2f1ec', '#1d1f22', '#2c3e50'], odometer: 16930 },
  'tesla-model-3': { rating: 4.9, trips: 523, available: 7, colors: ['#9b1c22', '#f2f1ec', '#1d1f22'], odometer: 31200 },
  'tesla-model-y': { rating: 4.8, trips: 467, available: 6, colors: ['#f2f1ec', '#1d1f22', '#6b6f75'], odometer: 12560 },
  'tesla-model-s': { rating: 4.9, trips: 219, available: 3, colors: ['#5b5e63', '#f2f1ec', '#1d1f22'], odometer: 27410 },
}

export { money } from '../cars'
