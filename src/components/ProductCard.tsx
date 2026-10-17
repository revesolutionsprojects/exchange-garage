import { ArrowUpRight, Shirt } from 'lucide-react'
import { useState } from 'react'
import { getColor } from '../data/products'
import { categoryLabel } from '../data/site'
import { studioLinkFor } from '../data/studio'
import { useCanHover } from '../hooks/useCanHover'
import { Link } from '../lib/router'
import type { Product } from '../types'
import { ColorSwatches } from './ColorSwatches'
import { CrossfadeImage } from './CrossfadeImage'
import { ProductBadge } from './ProductBadge'

interface Props {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: Props) {
  const canHover = useCanHover()
  const [selected, setSelected] = useState(product.colors[0].slug)
  const color = getColor(product, selected)
  const href = `/product/${product.id}?color=${color.slug}`
  const tryOn = studioLinkFor(product.id, color.slug)

  const layers = product.colors.map((c) => ({ id: c.slug, src: c.images[0], alt: `${product.name} in ${c.name}` }))

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Link to={href} className="absolute inset-0 block" aria-label={`View ${product.name} in ${color.name}`} tabIndex={-1}>
          <CrossfadeImage
            layers={layers}
            activeId={color.slug}
            priority={priority}
            className="h-full w-full transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.045]"
          />
        </Link>

        {product.badge && (
          <div className="pointer-events-none absolute top-3 left-3">
            <ProductBadge badge={product.badge} />
          </div>
        )}

        {!canHover && tryOn && (
          <Link
            to={tryOn}
            aria-label={`Try ${product.name} in ${color.name} on the model`}
            className="absolute top-2 right-2 grid h-10 w-10 place-items-center rounded-full bg-bone text-ink shadow-sm transition-transform active:scale-95"
          >
            <Shirt size={16} strokeWidth={1.7} />
          </Link>
        )}

        {canHover && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 bg-bone/92 p-3 opacity-0 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md transition-[opacity,transform] duration-500 ease-out-expo group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center justify-between gap-2">
              <ColorSwatches colors={product.colors} selected={color.slug} onSelect={setSelected} productName={product.name} size="sm" selectOnHover className="-m-[5px]" />
              <span className="truncate text-[11px] font-medium tracking-wide text-ink/70" aria-live="polite">
                {color.name}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-ink/10 pt-2.5">
              {tryOn && (
                <Link to={tryOn} className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.14em] uppercase hover:text-signal">
                  <Shirt size={13} strokeWidth={1.8} /> Try it on
                </Link>
              )}
              <Link to={href} className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-[0.14em] text-ink/60 uppercase hover:text-ink">
                View details <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[13px] leading-snug font-semibold tracking-tight sm:text-sm">
            <Link to={href} className="link-underline">
              {product.name}
            </Link>
          </h3>
          <span className="shrink-0 pt-px text-[11px] text-ink/45">{categoryLabel(product.category)}</span>
        </div>

        {canHover ? (
          <div className="mt-2 flex items-center gap-2 text-[12px] text-ink/55">
            <span className="flex items-center gap-1" aria-hidden="true">
              {product.colors.map((c) => (
                <span
                  key={c.slug}
                  className={`h-2 w-2 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] transition-transform duration-300 ${c.slug === color.slug ? 'scale-125' : ''}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </span>
            <span>
              <span className="text-ink/80">{color.name}</span> · {product.colors.length} colours
            </span>
          </div>
        ) : (
          <div className="mt-1.5">
            <ColorSwatches colors={product.colors} selected={color.slug} onSelect={setSelected} productName={product.name} size="touch" className="-ml-[7px]" />
            <p className="mt-0.5 text-[12px] text-ink/60" aria-live="polite">
              {color.name}
            </p>
          </div>
        )}
      </div>
    </article>
  )
}
