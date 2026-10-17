import type { Badge } from '../types'

const STYLES: Record<Badge, string> = {
  NEW: 'bg-ink text-bone',
  BESTSELLER: 'bg-bone text-ink',
  LIMITED: 'bg-signal text-ink',
}

export function ProductBadge({ badge }: { badge: Badge }) {
  return <span className={`eyebrow px-2 py-1 text-[9.5px] leading-none ${STYLES[badge]}`}>{badge}</span>
}
