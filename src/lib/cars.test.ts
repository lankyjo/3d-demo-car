import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cars, quote, rentalDays, weeklyRate } from './cars.ts'

const camry = cars[0] // $59/day → $330/week

test('weekly rate is 7 days less 20%', () => assert.equal(weeklyRate(camry), 330))

test('quote mixes weeks and days, caps leftover days at a week', () => {
  assert.equal(quote(camry, 3, []).total, 177)
  assert.equal(quote(camry, 7, []).total, 330)
  assert.equal(quote(camry, 9, []).total, 330 + 118)
  assert.equal(quote(camry, 13, []).total, 660) // 6 leftover days ($354) capped at $330
  assert.deepEqual(quote(camry, 2, ['insurance']), { base: 118, extras: 50, total: 168 })
})

test('rentalDays rejects reversed or bad dates', () => {
  assert.equal(rentalDays('2026-01-01', '2026-01-04'), 3)
  assert.equal(rentalDays('2026-01-04', '2026-01-01'), 0)
  assert.equal(rentalDays('', ''), 0)
})
