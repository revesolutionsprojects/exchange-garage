import { categoryLabel } from '../data/site'
import type { CategoryId, ColorFamily, Product } from '../types'

export type SortKey = 'featured' | 'newest' | 'name'
export type Flag = 'new' | 'featured'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name: A to Z' },
]

export const FLAG_OPTIONS: { value: Flag; label: string }[] = [
  { value: 'new', label: 'New Arrivals' },
  { value: 'featured', label: 'Featured' },
]

export const COLOR_FAMILIES: { value: ColorFamily; label: string; hex: string }[] = [
  { value: 'black', label: 'Black', hex: '#161616' },
  { value: 'white', label: 'White & Cream', hex: '#EEE8DC' },
  { value: 'grey', label: 'Grey', hex: '#9C9C9A' },
  { value: 'blue', label: 'Blue', hex: '#2E4C8F' },
  { value: 'green', label: 'Green', hex: '#55603A' },
  { value: 'brown', label: 'Brown & Tan', hex: '#A07C52' },
  { value: 'red', label: 'Red & Rust', hex: '#8E3A2A' },
]

export interface Filters {
  q: string
  category: CategoryId | null
  colors: ColorFamily[]
  flag: Flag | null
  sort: SortKey
}

export function searchProducts(list: Product[], q: string): Product[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return list
  return list.filter((p) => {
    const haystack = [p.name, categoryLabel(p.category), p.category, ...p.colors.map((c) => c.name)].join(' ').toLowerCase()
    // Loose plural handling: "hoodies" should still match "hoodie".
    return terms.every((t) => haystack.includes(t) || haystack.includes(t.replace(/e?s$/, '')))
  })
}

export function applyFilters(list: Product[], f: Filters): Product[] {
  let out = searchProducts(list, f.q)
  if (f.category) out = out.filter((p) => p.category === f.category)
  if (f.colors.length) out = out.filter((p) => p.colors.some((c) => f.colors.includes(c.family)))
  if (f.flag === 'new') out = out.filter((p) => p.isNew)
  if (f.flag === 'featured') out = out.filter((p) => p.isFeatured)

  const sorted = [...out]
  switch (f.sort) {
    case 'newest':
      sorted.sort((a, b) => b.releaseRank - a.releaseRank)
      break
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'featured':
      sorted.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured))
      break
  }
  return sorted
}
