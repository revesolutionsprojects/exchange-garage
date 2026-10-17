export type CategoryId = 'tshirts' | 'shirts' | 'hoodies' | 'jackets' | 'bottoms'

/** Broad colour groups used by the collection's colour filter. */
export type ColorFamily =
  | 'black'
  | 'white'
  | 'grey'
  | 'blue'
  | 'green'
  | 'brown'
  | 'red'

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '28' | '30' | '32' | '34' | '36'

export type Badge = 'NEW' | 'BESTSELLER' | 'LIMITED'

export interface ProductColor {
  /** URL-safe identifier, unique within a product. */
  slug: string
  /** Customer-facing colour name, e.g. "Washed Black". */
  name: string
  /** Swatch fill. */
  hex: string
  family: ColorFamily
  /** Image URLs for this colour. The first is the primary (card) image. */
  images: string[]
}

export interface Product {
  id: string
  name: string
  category: CategoryId
  /**
   * Price in whole INR. Not displayed — the site runs in showcase mode with no
   * pricing or checkout. Kept so commerce can be switched on later.
   */
  price: number
  /** Optional discounted price in whole INR (not displayed in showcase mode). */
  salePrice?: number
  badge?: Badge
  sizes: Size[]
  colors: ProductColor[]
  description: string
  details: string[]
  isNew?: boolean
  isFeatured?: boolean
  /** Higher = more recent; used for "newest" sorting. */
  releaseRank: number
}

export interface Category {
  id: CategoryId
  label: string
  /** Short line shown on the category tile. */
  tagline: string
  image: string
  srcSet?: string
}

export interface CartItem {
  /** productId + colour + size; identical selections merge into one line. */
  key: string
  productId: string
  colorSlug: string
  size: Size
  quantity: number
}
