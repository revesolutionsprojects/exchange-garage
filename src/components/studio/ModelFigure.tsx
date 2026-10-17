import { useId, type CSSProperties } from 'react'
import { getStudioItem, TONES, type Look, type Slot } from '../../data/studio'
import { drawBody, drawBottom, drawFloor, drawHeadwear, drawHood, drawLayer, drawShoes, drawTop, shadeFallbackVars, type FigureIds, type View } from './figure'

function luminance(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16)
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255
}
const inkFor = (hex: string) => (luminance(hex) > 0.5 ? '#161616' : '#F1EEE6')

interface Props {
  look: Look
  view?: View
  tone?: string
  tuck?: boolean
  /** Makes garments clickable (with hover outline). */
  onSlotClick?: (slot: Slot) => void
  onSlotHover?: (slot: Slot | null) => void
  /** Entrance: pieces drop onto the model one after another (shoes first, headwear last). */
  dressing?: boolean
  className?: string
  title?: string
}

function resolve(look: Look, slot: Slot) {
  const pick = look[slot]
  const item = pick ? getStudioItem(pick.item) : undefined
  if (!pick || !item) return null
  const color = item.colors.find((c) => c.slug === pick.color) ?? item.colors[0]
  return { item, color }
}

export function ModelFigure({ look, view = 'front', tone = 'mannequin', tuck = false, onSlotClick, onSlotHover, dressing = false, className = '', title }: Props) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '')
  const ids: FigureIds = { shade: `${raw}s`, shadeBody: `${raw}b`, blur: `${raw}f`, twill: `${raw}t` }

  const head = resolve(look, 'headwear')
  const layer = resolve(look, 'layer')
  const top = resolve(look, 'top')
  const bottom = resolve(look, 'bottom')
  const shoes = resolve(look, 'shoes')

  const vars = {
    '--skin': TONES.find((t) => t.id === tone)?.hex ?? TONES[0].hex,
    '--c-head': head?.color.hex ?? '#000',
    '--c-head-ink': head ? inkFor(head.color.hex) : '#fff',
    '--c-layer': layer?.color.hex ?? '#000',
    '--c-layer-ink': layer ? inkFor(layer.color.hex) : '#fff',
    '--c-top': top?.color.hex ?? '#000',
    '--c-top-ink': top ? inkFor(top.color.hex) : '#fff',
    '--c-bottom': bottom?.color.hex ?? '#000',
    '--thread': bottom && luminance(bottom.color.hex) < 0.2 ? '#9A8E78' : '#C8913F',
    '--c-shoes': shoes?.color.hex ?? '#000',
    ...(head && shadeFallbackVars('--c-head', head.color.hex)),
    ...(layer && shadeFallbackVars('--c-layer', layer.color.hex)),
    ...(top && shadeFallbackVars('--c-top', top.color.hex)),
    ...(bottom && shadeFallbackVars('--c-bottom', bottom.color.hex)),
    ...(shoes && shadeFallbackVars('--c-shoes', shoes.color.hex)),
  } as CSSProperties

  const interactive = !!onSlotClick
  const DRESS_ORDER: Slot[] = ['shoes', 'bottom', 'top', 'layer', 'headwear']
  const layerProps = (slot: Slot, html: string, extraDelay = 0) => ({
    'data-slot': slot,
    className: 'garment-in',
    style: dressing
      ? ({ '--garment-dur': '850ms', '--garment-delay': `${DRESS_ORDER.indexOf(slot) * 170 + extraDelay}ms`, '--garment-drop': '-48px' } as CSSProperties)
      : undefined,
    onClick: interactive ? () => onSlotClick?.(slot) : undefined,
    onMouseEnter: interactive ? () => onSlotHover?.(slot) : undefined,
    onMouseLeave: interactive ? () => onSlotHover?.(null) : undefined,
    dangerouslySetInnerHTML: { __html: html },
  })

  return (
    <svg
      viewBox="0 0 400 1000"
      role="img"
      aria-label={title ?? describe(look)}
      className={`model-figure ${interactive ? 'is-interactive' : ''} ${className}`}
      style={vars}
    >
      <defs>
        <linearGradient id={ids.shade} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".3" />
          <stop offset=".22" stopColor="#000" stopOpacity=".04" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".1" />
          <stop offset=".8" stopColor="#000" stopOpacity=".05" />
          <stop offset="1" stopColor="#000" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id={ids.shadeBody} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".22" />
          <stop offset=".45" stopColor="#fff" stopOpacity=".14" />
          <stop offset="1" stopColor="#000" stopOpacity=".24" />
        </linearGradient>
        <filter id={ids.blur} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <pattern id={ids.twill} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#fff" strokeWidth="1" opacity=".1" />
        </pattern>
      </defs>
      <g dangerouslySetInnerHTML={{ __html: drawFloor() }} />
      <g dangerouslySetInnerHTML={{ __html: drawBody(ids) }} />
      {shoes && <g key={`shoes-${shoes.item.id}-${view}`} {...layerProps('shoes', drawShoes(shoes.item.style, view, ids))} />}
      {bottom && <g key={`bottom-${bottom.item.id}-${view}`} {...layerProps('bottom', drawBottom(bottom.item.style, view, ids))} />}
      {top && <g key={`top-${top.item.id}-${tuck}-${view}`} {...layerProps('top', drawTop(top.item.style, view, ids, tuck, !!layer))} />}
      {layer && <g key={`layer-${layer.item.id}-${view}`} {...layerProps('layer', drawLayer(layer.item.style, view, ids))} />}
      {top?.item.style === 'hoodie' && <g key={`hood-${view}`} {...layerProps('top', drawHood(view, ids, !!layer), 250)} />}
      {head && <g key={`head-${head.item.id}-${view}`} {...layerProps('headwear', drawHeadwear(head.item.style, view, ids))} />}
    </svg>
  )
}

export function describe(look: Look): string {
  const parts = (['headwear', 'layer', 'top', 'bottom', 'shoes'] as Slot[])
    .map((s) => resolve(look, s))
    .filter(Boolean)
    .map((r) => `${r!.color.name} ${r!.item.name}`)
  return `Model wearing ${parts.join(', ')}`
}
