import { useId, type CSSProperties } from 'react'
import type { StudioItem } from '../../data/studio'
import { drawBody, drawHeadwear, drawShoes, shadeFallbackVars, type FigureIds } from './figure'

/** Close-up thumbnail for styling props (shoes, headwear) that have no product photo. */
export function PropThumb({ item, hex, className = '' }: { item: StudioItem; hex: string; className?: string }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '')
  const ids: FigureIds = { shade: `${raw}s`, shadeBody: `${raw}b`, blur: `${raw}f`, twill: `${raw}t` }
  const shoes = item.slot === 'shoes'
  const html = shoes ? drawShoes(item.style, 'front', ids) : drawBody(ids) + drawHeadwear(item.style, 'front', ids)
  const style = {
    '--skin': '#D9D2C5',
    '--c-shoes': hex,
    '--c-head': hex,
    '--c-head-ink': '#F1EEE6',
    ...shadeFallbackVars(shoes ? '--c-shoes' : '--c-head', hex),
  } as CSSProperties

  return (
    <svg viewBox={shoes ? '118 835 164 205' : '136 14 128 160'} aria-hidden="true" className={`model-figure ${className}`} style={style}>
      <defs>
        <linearGradient id={ids.shade} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".3" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".1" />
          <stop offset="1" stopColor="#000" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id={ids.shadeBody} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".2" />
          <stop offset="1" stopColor="#000" stopOpacity=".2" />
        </linearGradient>
        <filter id={ids.blur}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <g dangerouslySetInnerHTML={{ __html: html }} />
    </svg>
  )
}
