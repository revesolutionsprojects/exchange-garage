/**
 * Site-wide copy and imagery. Everything here is placeholder content for the
 * demo and is meant to be edited by the client.
 */
import type { Category } from '../types'

export const site = {
  brand: 'EXCHANGE GARAGE',
  /** Rotating messages in the announcement bar. One message also works. */
  announcements: [
    'NEW COLLECTION — EXPLORE THE DROP',
    'NEW — TRY ANY FIT IN THE FITTING ROOM',
  ],
  hero: {
    image: 'images/hero.webp',
    imageAlt: 'Model in a black and yellow track jacket reaching toward the camera in front of a graffiti wall',
    eyebrow: 'Collection 01 — The Drop',
    headline: ['BUILT DIFFERENT.', 'WORN YOUR WAY.'],
    subhead: 'Explore the next generation of everyday streetwear.',
  },
  newDrop: {
    image: 'images/drop-main.webp',
    imageAlt: 'Model in a black leather jacket and sunglasses crouching on a ledge against a brick wall',
    sideImage: 'images/drop-side.webp',
    sideImageAlt: 'Model in a red graphic tee and dark jacket against a teal backdrop',
  },
  story: {
    image: 'images/story.webp',
    imageAlt: 'Model in a pale pink sweatshirt and ripped jeans leaning on a rusted industrial skip',
  },
  newsletter: {
    image: 'images/newsletter.webp',
    imageAlt: 'Black leather biker jacket laid flat on white fabric',
  },
  /** Placeholder contact details — intentionally not real. */
  contact: {
    email: 'hello@[your-domain] — to be confirmed',
    phone: '+91 — to be confirmed',
    address: 'Studio address — to be confirmed',
    instagram: '@handle — to be confirmed',
  },
}

export const categories: Category[] = [
  { id: 'tshirts', label: 'T-Shirts', tagline: 'Heavyweight basics', image: 'images/cat-tshirts.webp' },
  { id: 'shirts', label: 'Shirts', tagline: 'Oxfords & overshirts', image: 'images/cat-shirts.webp' },
  { id: 'hoodies', label: 'Hoodies', tagline: 'Fleece & crewnecks', image: 'images/cat-hoodies.webp' },
  { id: 'jackets', label: 'Jackets', tagline: 'Outer layers', image: 'images/cat-jackets.webp' },
  { id: 'bottoms', label: 'Pants & Bottoms', tagline: 'Cargos, denim, trousers', image: 'images/cat-bottoms.webp' },
]

export const categoryImageAlt: Record<Category['id'], string> = {
  tshirts: 'Model wearing a plain white crew-neck T-shirt',
  shirts: 'Folded button-down shirts in grey, white and plum on a wooden table',
  hoodies: 'Person in a grey hoodie seen from behind, hood up, outdoors',
  jackets: 'Raw denim jacket with a corduroy collar on a hanger',
  bottoms: 'Stacked pairs of jeans in light, mid and black wash',
}

export function categoryLabel(id: string): string {
  return categories.find((c) => c.id === id)?.label ?? 'All'
}
