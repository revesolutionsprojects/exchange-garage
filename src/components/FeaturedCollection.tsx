import { ArrowRight } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { products } from '../data/products'
import { categories } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import { Link } from '../lib/router'
import type { CategoryId } from '../types'
import { ProductGrid } from './ProductGrid'
import { SectionHeading } from './SectionHeading'

type Tab = 'featured' | CategoryId

export const FeaturedCollection = forwardRef<HTMLDivElement>(function FeaturedCollection(_, anchorRef) {
  const ref = useReveal<HTMLElement>()
  const [tab, setTab] = useState<Tab>('featured')
  const list = tab === 'featured' ? products.filter((p) => p.isFeatured).slice(0, 8) : products.filter((p) => p.category === tab)
  const tabs: { id: Tab; label: string }[] = [{ id: 'featured', label: 'Featured' }, ...categories.map((c) => ({ id: c.id as Tab, label: c.label }))]

  return (
    <div ref={anchorRef} className="scroll-mt-16">
      <section ref={ref} aria-labelledby="featured-title" className="mx-auto max-w-screen-2xl px-4 pb-24 sm:px-6 sm:pb-32 lg:px-10">
        <SectionHeading
          id="featured-title"
          index="02"
          eyebrow="Featured collection"
          title={
            <>
              Pick a piece.
              <br className="hidden sm:block" /> Pick your colour.
            </>
          }
          action={
            <p className="max-w-xs text-sm text-ink/60">
              Hover a product — or tap on mobile — to preview every colourway before you open it.
            </p>
          }
        />

        <div role="tablist" aria-label="Filter featured products" className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              aria-controls="featured-grid"
              onClick={() => setTab(t.id)}
              className={`shrink-0 border px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                tab === t.id ? 'border-ink bg-ink text-bone' : 'border-ink/15 text-ink/70 hover:border-ink hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id="featured-grid" role="tabpanel" className="mt-8">
          <ProductGrid key={tab} products={list} />
        </div>

        <div className="mt-14 flex justify-center">
          <Link to={tab === 'featured' ? '/shop?filter=featured' : `/shop?category=${tab}`} className="btn-ghost-dark">
            View all {tab === 'featured' ? 'featured' : categories.find((c) => c.id === tab)?.label} <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
})
