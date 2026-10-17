import { Check, Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { ProductGrid } from '../components/ProductGrid'
import { products } from '../data/products'
import { categories, categoryLabel } from '../data/site'
import { applyFilters, COLOR_FAMILIES, FLAG_OPTIONS, SORT_OPTIONS, type Filters, type Flag, type SortKey } from '../lib/catalog'
import { buildQuery, navigate, type Route } from '../lib/router'
import type { CategoryId, ColorFamily } from '../types'

function readFilters(query: URLSearchParams): Filters {
  const category = query.get('category')
  const flag = query.get('filter')
  const sort = query.get('sort')
  return {
    q: query.get('q') ?? '',
    category: categories.some((c) => c.id === category) ? (category as CategoryId) : null,
    colors: (query.get('color') ?? '').split(',').filter((c): c is ColorFamily => COLOR_FAMILIES.some((f) => f.value === c)),
    flag: FLAG_OPTIONS.some((f) => f.value === flag) ? (flag as Flag) : null,
    sort: SORT_OPTIONS.some((s) => s.value === sort) ? (sort as SortKey) : 'featured',
  }
}

function writeFilters(f: Filters) {
  navigate(
    `/shop${buildQuery({
      q: f.q.trim() && f.q,
      category: f.category,
      color: f.colors.join(','),
      filter: f.flag,
      sort: f.sort !== 'featured' && f.sort,
    })}`,
    { replace: true },
  )
}

function pageTitle(f: Filters): string {
  if (f.flag === 'new' && !f.category) return 'New Arrivals'
  if (f.category) return categoryLabel(f.category)
  if (f.q) return 'Search'
  return 'Shop All'
}

const filterHeading = 'text-[11px] font-semibold tracking-[0.18em] uppercase text-ink/50'

export function ShopPage({ route }: { route: Route }) {
  const filters = readFilters(route.query)
  const results = applyFilters(products, filters)
  const [panelOpen, setPanelOpen] = useState(false)
  const [searchText, setSearchText] = useState(filters.q)

  // Keep the input in sync when the query changes from elsewhere (header search, back button).
  const [syncedQ, setSyncedQ] = useState(filters.q)
  if (filters.q !== syncedQ) {
    setSyncedQ(filters.q)
    setSearchText(filters.q)
  }

  const update = (patch: Partial<Filters>) => writeFilters({ ...filters, ...patch })
  const toggleColor = (c: ColorFamily) => update({ colors: filters.colors.includes(c) ? filters.colors.filter((x) => x !== c) : [...filters.colors, c] })
  const reset = () => {
    setSearchText('')
    writeFilters({ q: '', category: null, colors: [], flag: null, sort: filters.sort })
  }

  const activeChips = [
    filters.q && { key: 'q', label: `“${filters.q}”`, clear: () => (setSearchText(''), update({ q: '' })) },
    filters.category && { key: 'cat', label: categoryLabel(filters.category), clear: () => update({ category: null }) },
    filters.flag && { key: 'flag', label: FLAG_OPTIONS.find((f) => f.value === filters.flag)!.label, clear: () => update({ flag: null }) },
    ...filters.colors.map((c) => ({ key: c, label: COLOR_FAMILIES.find((f) => f.value === c)!.label, clear: () => toggleColor(c) })),
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[]

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <h2 className={filterHeading}>Category</h2>
        <ul className="mt-3 space-y-1">
          {[{ id: null, label: 'All products' }, ...categories].map((c) => {
            const active = filters.category === c.id
            const count = c.id ? products.filter((p) => p.category === c.id).length : products.length
            return (
              <li key={c.id ?? 'all'}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ category: c.id as CategoryId | null })}
                  className={`flex w-full items-center justify-between py-1.5 text-left text-sm transition-colors ${active ? 'font-semibold text-ink' : 'text-ink/65 hover:text-ink'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full bg-ink transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                    {c.label}
                  </span>
                  <span className="text-[12px] text-ink/40 tabular-nums">{count}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <h2 className={filterHeading}>Colour</h2>
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 lg:grid-cols-1">
          {COLOR_FAMILIES.map((c) => {
            const active = filters.colors.includes(c.value)
            return (
              <li key={c.value}>
                <button type="button" role="checkbox" aria-checked={active} onClick={() => toggleColor(c.value)} className="group flex items-center gap-2.5 text-sm text-ink/70 hover:text-ink">
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)] ring-offset-2 ring-offset-bone transition-shadow ${active ? 'ring-[1.5px] ring-ink' : ''}`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {active && <Check size={11} strokeWidth={3} className={c.value === 'white' ? 'text-ink' : 'text-bone'} />}
                  </span>
                  <span className={active ? 'font-semibold text-ink' : ''}>{c.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <h2 className={filterHeading}>Collection</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {FLAG_OPTIONS.map((f) => {
            const active = filters.flag === f.value
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => update({ flag: active ? null : f.value })}
                className={`border px-3 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors ${active ? 'border-ink bg-ink text-bone' : 'border-ink/15 hover:border-ink'}`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {activeChips.length > 0 && (
        <button type="button" onClick={reset} className="text-[11px] font-semibold tracking-[0.16em] uppercase underline underline-offset-4 hover:text-signal">
          Reset all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pt-10 pb-24 sm:px-6 sm:pt-14 lg:px-10">
      <header className="flex flex-col gap-6 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-ink/45">Exchange Garage — Demo catalogue</p>
          <h1 className="display mt-3 text-[clamp(3.2rem,8vw,6.5rem)]">{pageTitle(filters)}</h1>
        </div>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            update({ q: searchText })
          }}
          className="flex w-full items-center gap-2 border-b border-ink/30 focus-within:border-ink lg:w-80"
        >
          <Search size={16} aria-hidden="true" className="text-ink/50" />
          <label htmlFor="shop-search" className="sr-only">
            Search products by name
          </label>
          <input
            id="shop-search"
            type="search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
              update({ q: e.target.value })
            }}
            placeholder="Search by name"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-ink/35 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchText && (
            <button type="button" aria-label="Clear search" onClick={() => (setSearchText(''), update({ q: '' }))} className="grid h-8 w-8 place-items-center text-ink/50 hover:text-ink">
              <X size={15} />
            </button>
          )}
        </form>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-12">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-24">{filterPanel}</div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPanelOpen((v) => !v)}
                aria-expanded={panelOpen}
                aria-controls="mobile-filters"
                className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase lg:hidden"
              >
                <SlidersHorizontal size={14} /> Filters{activeChips.length ? ` (${activeChips.length})` : ''}
              </button>
              <p className="text-sm text-ink/55" aria-live="polite">
                {results.length} {results.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-ink/50">Sort</span>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as SortKey })}
                className="cursor-pointer border border-ink/20 bg-transparent px-3 py-2.5 text-[13px] font-medium outline-none focus-visible:border-ink"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div id="mobile-filters" hidden={!panelOpen} className="mt-5 border border-ink/10 bg-sand/50 p-5 lg:hidden">
            {filterPanel}
          </div>

          {activeChips.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Active filters">
              {activeChips.map((chip) => (
                <li key={chip.key}>
                  <button type="button" onClick={chip.clear} className="inline-flex items-center gap-1.5 bg-ink px-3 py-1.5 text-[12px] text-bone hover:bg-signal hover:text-ink" aria-label={`Remove filter ${chip.label}`}>
                    {chip.label} <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8">
            {results.length > 0 ? (
              <ProductGrid products={results} priorityCount={4} />
            ) : (
              <div className="flex flex-col items-start border border-dashed border-ink/20 px-6 py-16 sm:items-center sm:text-center">
                <p className="display text-4xl sm:text-5xl">Nothing matches — yet.</p>
                <p className="mt-3 max-w-md text-sm text-ink/60">
                  No products fit {filters.q ? <>“{filters.q}” with </> : null}the current filters. Try removing a filter or searching for something broader.
                </p>
                <button type="button" onClick={reset} className="btn-dark mt-7">
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
