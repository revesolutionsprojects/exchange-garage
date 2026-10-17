/**
 * Site-wide copy and imagery. Everything here is placeholder content for the
 * demo and is meant to be edited by the client.
 */
import type { Category } from '../types'

/**
 * Responsive variants live next to the original as images/<name>-<width>.webp,
 * so phones download a small file and large screens get the full one.
 */
function srcSet(name: string, widths: number[], fullWidth: number): string {
  return [...widths.map((w) => `images/${name}-${w}.webp ${w}w`), `images/${name}.webp ${fullWidth}w`].join(', ')
}

export const site = {
  brand: 'EXCHANGE GARAGE',
  /** Rotating messages in the announcement bar. One message also works. */
  announcements: [
    'NEW COLLECTION — EXPLORE THE DROP',
    'NEW — TRY ANY FIT IN THE FITTING ROOM',
  ],
  hero: {
    image: 'images/hero-1600.webp',
    srcSet: srcSet('hero', [640, 1080, 1600], 2000),
    imageAlt: 'Model in a black and yellow track jacket reaching toward the camera in front of a graffiti wall',
    eyebrow: 'Collection 01 — The Drop',
    headline: ['BUILT DIFFERENT.', 'WORN YOUR WAY.'],
    subhead: 'Explore the next generation of everyday streetwear.',
  },
  newDrop: {
    image: 'images/drop-main.webp',
    srcSet: srcSet('drop-main', [640, 1080], 1400),
    imageAlt: 'Model in a black leather jacket and sunglasses crouching on a ledge against a brick wall',
    sideImage: 'images/drop-side.webp',
    sideSrcSet: srcSet('drop-side', [640], 1000),
    sideImageAlt: 'Model in a red graphic tee and dark jacket against a teal backdrop',
  },
  story: {
    image: 'images/story.webp',
    srcSet: srcSet('story', [640, 1080], 1400),
    imageAlt: 'Model in a pale pink sweatshirt and ripped jeans leaning on a rusted industrial skip',
  },
  newsletter: {
    image: 'images/newsletter.webp',
    srcSet: srcSet('newsletter', [640, 1080], 1400),
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
  { id: 'tshirts', label: 'T-Shirts', tagline: 'Heavyweight basics', image: 'images/cat-tshirts.webp', srcSet: srcSet('cat-tshirts', [640], 1000) },
  { id: 'shirts', label: 'Shirts', tagline: 'Oxfords & overshirts', image: 'images/cat-shirts.webp', srcSet: srcSet('cat-shirts', [640], 1000) },
  { id: 'hoodies', label: 'Hoodies', tagline: 'Fleece & crewnecks', image: 'images/cat-hoodies.webp', srcSet: srcSet('cat-hoodies', [640], 1000) },
  { id: 'jackets', label: 'Jackets', tagline: 'Outer layers', image: 'images/cat-jackets.webp', srcSet: srcSet('cat-jackets', [640], 1000) },
  { id: 'bottoms', label: 'Pants & Bottoms', tagline: 'Cargos, denim, trousers', image: 'images/cat-bottoms.webp', srcSet: srcSet('cat-bottoms', [640], 1000) },
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
