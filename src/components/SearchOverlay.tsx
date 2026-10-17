import { ArrowRight, Search, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { products } from '../data/products'
import { categoryLabel } from '../data/site'
import { useDialog } from '../hooks/useDialog'
import { searchProducts } from '../lib/catalog'
import { Link, navigate } from '../lib/router'
import { SafeImage } from './SafeImage'

const SUGGESTIONS = ['Hoodie', 'Cargo', 'Tee', 'Jacket', 'Oxford']

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useDialog<HTMLDivElement>(open, onClose)
  const [query, setQuery] = useState('')
  const q = query.trim()
  const results = q ? searchProducts(products, q).slice(0, 6) : []

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/shop${q ? `?q=${encodeURIComponent(q)}` : ''}`)
    onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-[60] transition-[opacity,visibility] duration-400 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
      inert={!open}
    >
      <button type="button" tabIndex={-1} aria-hidden="true" className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className={`relative max-h-[90dvh] overflow-y-auto bg-bone text-ink shadow-2xl transition-transform duration-500 ease-out-expo ${open ? 'translate-y-0' : '-translate-y-6'}`}
      >
        <div className="mx-auto max-w-screen-lg px-4 pt-6 pb-8 sm:px-6 sm:pt-10 sm:pb-12">
          <form onSubmit={submit} role="search" className="flex items-center gap-3 border-b-2 border-ink pb-3">
            <Search size={22} strokeWidth={1.6} aria-hidden="true" className="shrink-0" />
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              id="site-search"
              data-autofocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tees, hoodies, cargos…"
              autoComplete="off"
              className="display min-w-0 flex-1 bg-transparent text-3xl outline-none placeholder:text-ink/25 sm:text-5xl [&::-webkit-search-cancel-button]:hidden"
            />
            <button type="button" onClick={onClose} aria-label="Close search" className="grid h-10 w-10 shrink-0 place-items-center hover:opacity-60">
              <X size={22} strokeWidth={1.6} />
            </button>
          </form>

          {!q && (
            <div className="mt-6">
              <p className="eyebrow text-ink/45">Popular searches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => setQuery(s)} className="border border-ink/15 px-4 py-2 text-sm transition-colors hover:border-ink">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && (
            <div className="mt-6" aria-live="polite">
              <p className="eyebrow text-ink/45">
                {results.length ? `${results.length === 6 ? 'Top results' : `${results.length} result${results.length > 1 ? 's' : ''}`} for “${q}”` : `No products match “${q}”`}
              </p>
              {results.length > 0 && (
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link to={`/product/${p.id}`} onClick={onClose} className="group flex gap-3">
                        <SafeImage src={p.colors[0].images[0]} alt="" className="aspect-[4/5] w-16 shrink-0 bg-sand object-cover" />
                        <span className="min-w-0 pt-1">
                          <span className="block text-[13px] leading-snug font-semibold group-hover:underline">{p.name}</span>
                          <span className="mt-0.5 block text-[12px] text-ink/50">{categoryLabel(p.category)}</span>
                          <span className="mt-0.5 block text-[12px] text-ink/40">{p.colors.length} colours</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => {
                  navigate(results.length ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
                  onClose()
                }}
                className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] uppercase hover:text-signal">
                {results.length ? 'See all results' : 'Browse all products'} <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
