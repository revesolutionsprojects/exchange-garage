import { ZoomIn, ZoomOut } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import type { Product, ProductColor } from '../types'
import { CrossfadeImage } from './CrossfadeImage'
import { SafeImage } from './SafeImage'

const VIEW_LABELS = ['Front', 'Back', 'Detail', 'View 4', 'View 5', 'View 6']

interface Props {
  product: Product
  color: ProductColor
}

/**
 * Large gallery for the selected colour. Every colour's images stay mounted so
 * switching colour crossfades instantly and keeps the same view (front/back/detail).
 */
export function ProductGallery({ product, color }: Props) {
  const [view, setView] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const viewIndex = Math.min(view, color.images.length - 1)

  const layers = product.colors.flatMap((c) =>
    c.images.map((src, i) => ({ id: `${c.slug}:${i}`, src, alt: `${product.name} in ${c.name} — ${VIEW_LABELS[i].toLowerCase()} view` })),
  )

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      <div role="tablist" aria-label="Product images" className="no-scrollbar flex gap-2 overflow-x-auto lg:w-20 lg:shrink-0 lg:flex-col lg:gap-3">
        {color.images.map((src, i) => (
          <button
            key={`${color.slug}-${i}`}
            type="button"
            role="tab"
            aria-selected={i === viewIndex}
            aria-label={`${VIEW_LABELS[i]} view`}
            onClick={() => {
              setView(i)
              setZoomed(false)
            }}
            className={`relative w-[72px] shrink-0 overflow-hidden bg-sand transition-opacity lg:w-full ${i === viewIndex ? 'opacity-100' : 'opacity-55 hover:opacity-90'}`}
          >
            <SafeImage src={src} alt="" className="aspect-[4/5] w-full object-cover" />
            <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-ink transition-transform duration-500 ease-out-expo ${i === viewIndex ? 'scale-x-100' : 'scale-x-0'}`} />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setZoomed((z) => !z)}
        onMouseMove={onMove}
        onMouseLeave={() => setZoomed(false)}
        aria-label={zoomed ? 'Zoom out' : 'Zoom in on image'}
        aria-pressed={zoomed}
        className={`group relative flex-1 overflow-hidden bg-sand ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
      >
        <CrossfadeImage
          layers={layers}
          activeId={`${color.slug}:${viewIndex}`}
          priority
          className="aspect-[4/5] w-full"
          imgClassName={zoomed ? 'scale-[1.9]' : 'scale-100'}
          imgStyle={{ transformOrigin: origin }}
        />
        <span className="pointer-events-none absolute right-4 bottom-4 grid h-10 w-10 place-items-center rounded-full bg-bone/90 text-ink opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
        </span>
      </button>
    </div>
  )
}
