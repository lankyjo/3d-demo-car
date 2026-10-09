// PROTOTYPE — maps ?variant= keys to the variant pages.
import type { VariantKey } from './PrototypeSwitcher'
import { VariantA } from './VariantA'
import { VariantB } from './VariantB'
import { VariantC } from './VariantC'
import { VariantD } from './VariantD'
import { VariantE } from './VariantE'

export const variants: Record<VariantKey, (props: { onPick: (carId: string) => void }) => React.ReactNode> = {
  A: VariantA,
  B: VariantB,
  C: VariantC,
  D: VariantD,
  E: VariantE,
}
