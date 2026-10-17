import { useRef, type KeyboardEvent } from 'react'
import type { ProductColor } from '../types'

interface Props {
  colors: Pick<ProductColor, 'slug' | 'name' | 'hex'>[]
  selected: string
  onSelect: (slug: string) => void
  /** Used for the accessible group label, e.g. "Heavyweight Boxy Tee colours". */
  productName: string
  size?: 'sm' | 'touch' | 'md' | 'lg'
  /** Desktop cards preview a colour as soon as the pointer rests on its swatch. */
  selectOnHover?: boolean
  tone?: 'light' | 'dark'
  className?: string
}

const DIMENSIONS = {
  sm: 'h-[18px] w-[18px]',
  touch: 'h-[18px] w-[18px]',
  md: 'h-7 w-7',
  lg: 'h-9 w-9',
}

/** Hit area is larger than the visible dot so small swatches stay easy to tap. */
const HIT_AREA = {
  sm: 'p-[5px]',
  touch: 'p-[7px]',
  md: 'p-[6px]',
  lg: 'p-[5px]',
}

export function ColorSwatches({ colors, selected, onSelect, productName, size = 'md', selectOnHover = false, tone = 'light', className = '' }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = colors.findIndex((c) => c.slug === selected)
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % colors.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + colors.length) % colors.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = colors.length - 1
    if (next < 0) return
    e.preventDefault()
    onSelect(colors[next].slug)
    refs.current[next]?.focus()
  }

  const ring = tone === 'dark' ? 'ring-bone' : 'ring-ink'

  return (
    <div role="radiogroup" aria-label={`${productName} colours`} onKeyDown={onKeyDown} className={`flex flex-wrap items-center ${className}`}>
      {colors.map((c, i) => {
        const active = c.slug === selected
        return (
          <button
            key={c.slug}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={c.name}
            title={c.name}
            tabIndex={active ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(c.slug)
            }}
            onMouseEnter={selectOnHover ? () => onSelect(c.slug) : undefined}
            className={`group/sw rounded-full ${HIT_AREA[size]} focus-visible:outline-offset-0`}
          >
            <span
              className={`block rounded-full ${DIMENSIONS[size]} shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)] ring-offset-2 transition-[box-shadow,transform] duration-300 ease-out-expo ${
                tone === 'dark' ? 'ring-offset-ink' : 'ring-offset-bone'
              } ${active ? `ring-[1.5px] ${ring} scale-100` : 'scale-[0.86] ring-0 group-hover/sw:scale-100'}`}
              style={{ backgroundColor: c.hex }}
            />
          </button>
        )
      })}
    </div>
  )
}
