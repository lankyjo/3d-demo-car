import { money, type Quote } from '@/lib/cars'

export function Summary({ days, price }: { days: number; price: Quote }) {
  return (
    <dl className="space-y-2 border-t border-line pt-4 text-sm">
      <div className="flex justify-between"><dt className="text-mute">Rental × {days} day{days === 1 ? '' : 's'}</dt><dd className="tabular-nums">{money(price.base)}</dd></div>
      {price.extras > 0 && <div className="flex justify-between"><dt className="text-mute">Extras</dt><dd className="tabular-nums">{money(price.extras)}</dd></div>}
      <div className="flex items-baseline justify-between pt-1">
        <dt className="hud text-ink">Total</dt>
        <dd className="font-display text-3xl tabular-nums drop-shadow-[0_0_10px_rgb(230_238_255/0.3)]">{money(price.total)}</dd>
      </div>
    </dl>
  )
}
