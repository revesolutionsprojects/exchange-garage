import { ArrowRight, ChevronDown, ChevronRight, Shirt } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { ColorSwatches } from '../components/ColorSwatches'
import { ProductBadge } from '../components/ProductBadge'
import { ProductGallery } from '../components/ProductGallery'
import { ProductGrid } from '../components/ProductGrid'
import { getColor, getProduct, products } from '../data/products'
import { categoryLabel } from '../data/site'
import { studioLinkFor } from '../data/studio'
import { Link, navigate } from '../lib/router'
import type { Product } from '../types'
import { NotFoundPage } from './NotFoundPage'

function related(product: Product): Product[] {
  const same = products.filter((p) => p.id !== product.id && p.category === product.category)
  const others = products.filter((p) => p.id !== product.id && p.category !== product.category && p.isFeatured)
  return [...same, ...others].slice(0, 4)
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-ink/10" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[12px] font-semibold tracking-[0.16em] uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-ink/70">{children}</div>
    </details>
  )
}

export function ProductPage({ id, initialColor }: { id: string; initialColor: string | null }) {
  const product = getProduct(id)
  const [colorSlug, setColorSlug] = useState(() => (product ? getColor(product, initialColor ?? undefined).slug : ''))

  if (!product) return <NotFoundPage title="Product not found" message="This product isn’t in the demo catalogue. It may have been renamed or removed." />

  const color = getColor(product, colorSlug)
  const tryOn = studioLinkFor(product.id, color.slug)

  const selectColor = (slug: string) => {
    setColorSlug(slug)
    // Keep the URL shareable without adding history entries for every swatch.
    navigate(`/product/${product.id}?color=${slug}`, { replace: true })
  }

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 pt-6 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="text-[12px] text-ink/50">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={12} />
            </li>
            <li>
              <Link to={`/shop?category=${product.category}`} className="hover:text-ink">
                {categoryLabel(product.category)}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={12} />
            </li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <section className="mx-auto grid max-w-screen-2xl gap-10 px-4 pt-6 pb-20 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-10">
        <div className="lg:col-span-7">
          <ProductGallery product={product} color={color} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            {product.badge && (
              <div className="flex flex-wrap gap-1.5">
                <ProductBadge badge={product.badge} />
              </div>
            )}
            <h1 className="display mt-4 text-[clamp(2.6rem,5vw,4.4rem)]">{product.name}</h1>
            <p className="eyebrow mt-4 text-ink/45">
              {categoryLabel(product.category)} · {product.colors.length} colours
            </p>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/70">{product.description}</p>

            <div className="mt-8 border-t border-ink/10 pt-6">
              <p className="text-[12px] font-semibold tracking-[0.16em] uppercase">
                Colour — <span className="font-medium tracking-normal text-ink/60 normal-case" aria-live="polite">{color.name}</span>
              </p>
              <ColorSwatches colors={product.colors} selected={color.slug} onSelect={selectColor} productName={product.name} size="md" className="mt-3 -ml-[6px] gap-1" />
            </div>

            <div className="mt-7">
              <p className="flex items-center justify-between text-[12px] font-semibold tracking-[0.16em] uppercase">
                Available sizes
                <span className="font-medium tracking-normal text-ink/45 normal-case">{product.category === 'bottoms' ? 'Waist in inches' : 'Relaxed fit'}</span>
              </p>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Available sizes">
                {product.sizes.map((s) => (
                  <li key={s} className="grid h-10 min-w-12 place-items-center border border-ink/15 px-3 text-sm font-medium text-ink/70">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {tryOn && (
                <Link to={tryOn} className="btn-dark flex-1">
                  <Shirt size={15} /> Try it in the Fitting Room
                </Link>
              )}
              <Link to={`/shop?category=${product.category}`} className="btn-ghost-dark">
                More {categoryLabel(product.category)} <ArrowRight size={14} />
              </Link>
            </div>
            <p className="mt-3 text-[12px] text-ink/45">Style it with any top, layer, bottom and shoes on our interactive model.</p>

            <div className="mt-8 border-t border-ink/10">
              <Accordion title="Details" defaultOpen>
                <ul className="list-disc space-y-1 pl-4">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Shipping & returns">
                Delivery and returns policies are still to be confirmed. See{' '}
                <Link to="/info/shipping" className="underline underline-offset-2 hover:text-ink">
                  shipping
                </Link>{' '}
                and{' '}
                <Link to="/info/returns" className="underline underline-offset-2 hover:text-ink">
                  returns
                </Link>{' '}
                for placeholders.
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="related-title" className="mx-auto max-w-screen-2xl border-t border-ink/10 px-4 py-20 sm:px-6 lg:px-10">
        <h2 id="related-title" className="display text-[clamp(2.2rem,4vw,3.4rem)]">
          You may also like
        </h2>
        <div className="mt-8">
          <ProductGrid products={related(product)} />
        </div>
      </section>
    </>
  )
}
