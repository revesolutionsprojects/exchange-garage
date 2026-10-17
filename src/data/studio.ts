/**
 * Fitting Room data: which catalogue pieces can be worn on the model, extra
 * styling props (shoes, headwear), model tones and backdrops.
 *
 * Shoes and headwear are styling extras for the demo only — they are not part
 * of the product catalogue.
 */
import { products } from './products'

export type Slot = 'headwear' | 'layer' | 'top' | 'bottom' | 'shoes'

export type GarmentStyle =
  | 'tee'
  | 'tee-graphic'
  | 'longsleeve'
  | 'shirt'
  | 'crew'
  | 'hoodie'
  | 'overshirt'
  | 'bomber'
  | 'coach'
  | 'cargo'
  | 'jean'
  | 'pleated'
  | 'court'
  | 'hightop'
  | 'boot'
  | 'cap'
  | 'beanie'

export const SLOTS: { id: Slot; label: string; optional: boolean; key: string }[] = [
  { id: 'headwear', label: 'Headwear', optional: true, key: 'h' },
  { id: 'layer', label: 'Layer', optional: true, key: 'l' },
  { id: 'top', label: 'Top', optional: false, key: 't' },
  { id: 'bottom', label: 'Bottom', optional: false, key: 'b' },
  { id: 'shoes', label: 'Shoes', optional: false, key: 's' },
]

export interface StudioColor {
  slug: string
  name: string
  hex: string
  /** Thumbnail image for catalogue pieces. */
  image?: string
}

export interface StudioItem {
  id: string
  name: string
  slot: Slot
  style: GarmentStyle
  colors: StudioColor[]
  /** Set for catalogue pieces — links back to the product page. */
  productId?: string
}

/** How each catalogue product is worn on the model. */
const CATALOGUE_STYLES: Record<string, { slot: Slot; style: GarmentStyle }> = {
  'heavyweight-tee': { slot: 'top', style: 'tee' },
  'garage-graphic-tee': { slot: 'top', style: 'tee-graphic' },
  'layer-longsleeve': { slot: 'top', style: 'longsleeve' },
  'oxford-shirt': { slot: 'top', style: 'shirt' },
  'garage-crewneck': { slot: 'top', style: 'crew' },
  'fleece-hoodie': { slot: 'top', style: 'hoodie' },
  'utility-overshirt': { slot: 'layer', style: 'overshirt' },
  'work-bomber': { slot: 'layer', style: 'bomber' },
  'coach-jacket': { slot: 'layer', style: 'coach' },
  'cargo-trouser': { slot: 'bottom', style: 'cargo' },
  'straight-jean': { slot: 'bottom', style: 'jean' },
  'pleated-trouser': { slot: 'bottom', style: 'pleated' },
}

const catalogueItems: StudioItem[] = products
  .filter((p) => CATALOGUE_STYLES[p.id])
  .map((p) => ({
    id: p.id,
    name: p.name,
    productId: p.id,
    ...CATALOGUE_STYLES[p.id],
    colors: p.colors.map((c) => ({ slug: c.slug, name: c.name, hex: c.hex, image: c.images[0] })),
  }))

const extras: StudioItem[] = [
  {
    id: 'court-low',
    name: 'Court Low Sneaker',
    slot: 'shoes',
    style: 'court',
    colors: [
      { slug: 'chalk', name: 'Chalk', hex: '#EEEAE2' },
      { slug: 'black', name: 'Black', hex: '#1B1B1B' },
      { slug: 'stone', name: 'Stone', hex: '#BDB5A6' },
    ],
  },
  {
    id: 'garage-hi',
    name: 'Garage Hi-Top',
    slot: 'shoes',
    style: 'hightop',
    colors: [
      { slug: 'black', name: 'Black', hex: '#191919' },
      { slug: 'white', name: 'White', hex: '#F1EFEA' },
      { slug: 'rust', name: 'Rust', hex: '#9A4A2B' },
    ],
  },
  {
    id: 'lug-boot',
    name: 'Lug Work Boot',
    slot: 'shoes',
    style: 'boot',
    colors: [
      { slug: 'black', name: 'Black', hex: '#1F1D1B' },
      { slug: 'tan', name: 'Tan', hex: '#8A5E3B' },
    ],
  },
  {
    id: 'six-panel-cap',
    name: 'Six-Panel Cap',
    slot: 'headwear',
    style: 'cap',
    colors: [
      { slug: 'black', name: 'Black', hex: '#181818' },
      { slug: 'bone', name: 'Bone', hex: '#E7DFCF' },
      { slug: 'olive', name: 'Olive', hex: '#5B5E3B' },
    ],
  },
  {
    id: 'rib-beanie',
    name: 'Rib Beanie',
    slot: 'headwear',
    style: 'beanie',
    colors: [
      { slug: 'black', name: 'Black', hex: '#171717' },
      { slug: 'ash', name: 'Ash Grey', hex: '#9E9E9C' },
      { slug: 'signal', name: 'Signal Orange', hex: '#E2561E' },
    ],
  },
]

export const STUDIO_ITEMS: StudioItem[] = [...catalogueItems, ...extras]

export function itemsForSlot(slot: Slot): StudioItem[] {
  return STUDIO_ITEMS.filter((i) => i.slot === slot)
}

export function getStudioItem(id: string | undefined): StudioItem | undefined {
  return STUDIO_ITEMS.find((i) => i.id === id)
}

export interface LookPick {
  item: string
  color: string
}

export type Look = Record<Slot, LookPick | null>

export const DEFAULT_LOOK: Look = {
  headwear: { item: 'six-panel-cap', color: 'black' },
  layer: { item: 'work-bomber', color: 'olive' },
  top: { item: 'heavyweight-tee', color: 'bone' },
  bottom: { item: 'cargo-trouser', color: 'black' },
  shoes: { item: 'court-low', color: 'chalk' },
}

export const TONES = [
  { id: 'mannequin', name: 'Mannequin', hex: '#D9D2C5' },
  { id: 'light', name: 'Light', hex: '#EBC6A6' },
  { id: 'medium', name: 'Medium', hex: '#C98F67' },
  { id: 'tan', name: 'Tan', hex: '#9A633F' },
  { id: 'deep', name: 'Deep', hex: '#5A3823' },
]

export const BACKDROPS = [
  { id: 'studio', name: 'Studio', from: '#EFEBE4', to: '#D5CFC5', swatch: '#E4DFD6', dark: false },
  { id: 'concrete', name: 'Concrete', from: '#C6C3BD', to: '#9C9992', swatch: '#B2AFA9', dark: false },
  { id: 'night', name: 'Night', from: '#2A2A28', to: '#0B0B0B', swatch: '#1A1A19', dark: true },
  { id: 'signal', name: 'Signal', from: '#FF8A5B', to: '#F2541B', swatch: '#FF5A1F', dark: false },
]

export const TUCKABLE: GarmentStyle[] = ['tee', 'tee-graphic', 'longsleeve', 'shirt']

export interface StudioState {
  look: Look
  tuck: boolean
  tone: string
  backdrop: string
}

export const DEFAULT_STATE: StudioState = { look: DEFAULT_LOOK, tuck: false, tone: 'mannequin', backdrop: 'studio' }

function validPick(slot: Slot, raw: string | null | undefined): LookPick | null | undefined {
  if (raw === 'none') return SLOTS.find((s) => s.id === slot)!.optional ? null : undefined
  if (!raw) return undefined
  const [item, color] = raw.split('.')
  const found = getStudioItem(item)
  if (!found || found.slot !== slot) return undefined
  return { item, color: found.colors.some((c) => c.slug === color) ? color : found.colors[0].slug }
}

/** Reads a look from URL params (#/studio?t=heavyweight-tee.black&l=none…), filling gaps from the default. */
export function decodeState(query: URLSearchParams): StudioState {
  const look = { ...DEFAULT_LOOK }
  for (const s of SLOTS) {
    const pick = validPick(s.id, query.get(s.key))
    if (pick !== undefined) look[s.id] = pick
  }
  const tone = TONES.some((t) => t.id === query.get('tone')) ? query.get('tone')! : DEFAULT_STATE.tone
  const backdrop = BACKDROPS.some((b) => b.id === query.get('bg')) ? query.get('bg')! : DEFAULT_STATE.backdrop
  return { look, tuck: query.get('tuck') === '1', tone, backdrop }
}

export function encodeState(state: StudioState): string {
  const q = new URLSearchParams()
  for (const s of SLOTS) {
    const pick = state.look[s.id]
    q.set(s.key, pick ? `${pick.item}.${pick.color}` : 'none')
  }
  if (state.tuck) q.set('tuck', '1')
  if (state.tone !== DEFAULT_STATE.tone) q.set('tone', state.tone)
  if (state.backdrop !== DEFAULT_STATE.backdrop) q.set('bg', state.backdrop)
  return q.toString()
}

/** Link that opens the Fitting Room wearing a given catalogue piece. */
export function studioLinkFor(productId: string, colorSlug: string): string | null {
  const item = getStudioItem(productId)
  if (!item) return null
  const key = SLOTS.find((s) => s.id === item.slot)!.key
  return `/studio?${key}=${productId}.${colorSlug}`
}
