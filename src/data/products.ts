/**
 * DEMO CATALOGUE — placeholder products and copy.
 *
 * None of these items are confirmed Exchange Garage inventory. Prices are kept
 * in the data for later but are not shown anywhere (showcase mode). Replace this file (or feed the same shape from a CMS / API) when
 * the real catalogue is available. Components read only from this data, so
 * adding a product or a colour needs no UI changes.
 *
 * Images: `demoImages()` points at the generated studio renders in
 * /public/products. To use real photography, replace a colour's `images`
 * array with your own URLs, e.g.
 *   images: ['https://cdn.example.com/eg-tee-black-front.jpg', '...-back.jpg']
 */
import type { ColorFamily, Product, ProductColor } from '../types'

export const DEMO_IMAGE_VIEWS = ['front', 'back', 'detail'] as const

export function demoImages(productId: string, colorSlug: string): string[] {
  return DEMO_IMAGE_VIEWS.map((view) => `products/${productId}/${colorSlug}-${view}.svg`)
}

function color(productId: string, slug: string, name: string, hex: string, family: ColorFamily): ProductColor {
  return { slug, name, hex, family, images: demoImages(productId, slug) }
}

const APPAREL = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as Product['sizes']
const WAIST = ['28', '30', '32', '34', '36'] as Product['sizes']

export const products: Product[] = [
  {
    id: 'heavyweight-tee',
    name: 'Heavyweight Boxy Tee',
    category: 'tshirts',
    price: 1499,
    badge: 'BESTSELLER',
    sizes: APPAREL,
    colors: [
      color('heavyweight-tee', 'black', 'Black', '#161616', 'black'),
      color('heavyweight-tee', 'bone', 'Bone', '#E7DFCF', 'white'),
      color('heavyweight-tee', 'heather', 'Heather Grey', '#9C9C9A', 'grey'),
      color('heavyweight-tee', 'olive', 'Olive', '#5B5E3B', 'green'),
      color('heavyweight-tee', 'navy', 'Washed Navy', '#2B344A', 'blue'),
    ],
    description:
      'The everyday foundation. A dense 240 GSM cotton jersey cut boxy through the body with a dropped shoulder and a tight ribbed collar that holds its shape wash after wash.',
    details: ['240 GSM cotton jersey', 'Boxy, dropped-shoulder fit', 'Ribbed crew collar', 'Woven EG neck label'],
    isFeatured: true,
    releaseRank: 4,
  },
  {
    id: 'garage-graphic-tee',
    name: 'Garage Mark Graphic Tee',
    category: 'tshirts',
    price: 1799,
    salePrice: 1399,
    sizes: APPAREL,
    colors: [
      color('garage-graphic-tee', 'white', 'Optic White', '#F3F2EE', 'white'),
      color('garage-graphic-tee', 'black', 'Black', '#141414', 'black'),
      color('garage-graphic-tee', 'rust', 'Rust', '#9A4A2B', 'red'),
    ],
    description:
      'Front chest wordmark, oversized back print. Screen-printed with a soft-hand ink on a midweight jersey that breaks in fast.',
    details: ['200 GSM cotton jersey', 'Screen-printed front and back', 'Regular fit', 'Pre-shrunk'],
    isFeatured: true,
    releaseRank: 6,
  },
  {
    id: 'layer-longsleeve',
    name: 'Layer Long Sleeve Tee',
    category: 'tshirts',
    price: 1699,
    badge: 'NEW',
    sizes: APPAREL,
    colors: [
      color('layer-longsleeve', 'stone', 'Stone', '#BDB5A6', 'brown'),
      color('layer-longsleeve', 'black', 'Black', '#171717', 'black'),
      color('layer-longsleeve', 'forest', 'Forest', '#2F4A3A', 'green'),
    ],
    description:
      'A clean long sleeve built for layering under overshirts and jackets. Slightly longer body, ribbed cuffs, zero fuss.',
    details: ['220 GSM cotton jersey', 'Relaxed fit', 'Ribbed cuffs and collar', 'Side-seam construction'],
    isNew: true,
    releaseRank: 11,
  },
  {
    id: 'oxford-shirt',
    name: 'Oxford Button-Down Shirt',
    category: 'shirts',
    price: 2499,
    sizes: APPAREL,
    colors: [
      color('oxford-shirt', 'white', 'White', '#F1F0EA', 'white'),
      color('oxford-shirt', 'sky', 'Sky Blue', '#A9C2DB', 'blue'),
      color('oxford-shirt', 'black', 'Black', '#1A1A1A', 'black'),
      color('oxford-shirt', 'sage', 'Sage', '#9AA58C', 'green'),
    ],
    description:
      'An oversized take on the classic Oxford. Soft-washed cotton, a button-down collar and a single chest pocket — works buttoned up or thrown open over a tee.',
    details: ['100% cotton Oxford weave', 'Oversized fit', 'Button-down collar', 'Curved shirttail hem'],
    isFeatured: true,
    releaseRank: 5,
  },
  {
    id: 'utility-overshirt',
    name: 'Utility Overshirt',
    category: 'shirts',
    price: 3299,
    badge: 'BESTSELLER',
    sizes: APPAREL,
    colors: [
      color('utility-overshirt', 'khaki', 'Khaki', '#A48E68', 'brown'),
      color('utility-overshirt', 'charcoal', 'Charcoal', '#3A3A3C', 'grey'),
      color('utility-overshirt', 'olive', 'Olive', '#4E5434', 'green'),
    ],
    description:
      'Heavy cotton twill with snap closures and twin flap pockets. Sits between a shirt and a jacket — the piece you reach for when the evening cools down.',
    details: ['320 GSM cotton twill', 'Snap-front closure', 'Twin flap chest pockets', 'Boxy fit'],
    isFeatured: true,
    releaseRank: 7,
  },
  {
    id: 'fleece-hoodie',
    name: 'Heavy Fleece Hoodie',
    category: 'hoodies',
    price: 3499,
    badge: 'BESTSELLER',
    sizes: APPAREL,
    colors: [
      color('fleece-hoodie', 'black', 'Black', '#151515', 'black'),
      color('fleece-hoodie', 'grey', 'Ash Grey', '#A3A3A1', 'grey'),
      color('fleece-hoodie', 'forest', 'Forest', '#2C4636', 'green'),
      color('fleece-hoodie', 'burgundy', 'Burgundy', '#5E1F2A', 'red'),
    ],
    description:
      'Brushed-back 420 GSM fleece with a double-layer hood, kangaroo pocket and deep ribbed trims. Built heavy, cut relaxed.',
    details: ['420 GSM brushed-back fleece', 'Double-layer hood', 'Kangaroo pocket', 'Ribbed cuffs and hem'],
    isFeatured: true,
    releaseRank: 8,
  },
  {
    id: 'garage-crewneck',
    name: 'Garage Crewneck Sweatshirt',
    category: 'hoodies',
    price: 2799,
    badge: 'NEW',
    sizes: APPAREL,
    colors: [
      color('garage-crewneck', 'oatmeal', 'Oatmeal', '#D8CDB8', 'white'),
      color('garage-crewneck', 'black', 'Black', '#161616', 'black'),
      color('garage-crewneck', 'cobalt', 'Cobalt', '#2B4C9B', 'blue'),
    ],
    description:
      'A midweight loopback crewneck with a small embroidered EG mark at the chest. Easy, clean, and made to be worn on repeat.',
    details: ['340 GSM loopback cotton', 'Embroidered chest mark', 'Relaxed fit', 'Ribbed trims'],
    isNew: true,
    releaseRank: 12,
  },
  {
    id: 'work-bomber',
    name: 'Workwear Bomber Jacket',
    category: 'jackets',
    price: 5999,
    salePrice: 4799,
    badge: 'LIMITED',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      color('work-bomber', 'black', 'Black', '#141414', 'black'),
      color('work-bomber', 'olive', 'Flight Olive', '#4D5332', 'green'),
      color('work-bomber', 'tan', 'Tan', '#A57C4F', 'brown'),
    ],
    description:
      'A bomber silhouette rebuilt in a water-resistant nylon shell with a utility sleeve pocket, ribbed collar and a heavy two-way zip.',
    details: ['Water-resistant nylon shell', 'Quilted lining', 'Utility sleeve pocket', 'Two-way metal zip'],
    isFeatured: true,
    releaseRank: 9,
  },
  {
    id: 'coach-jacket',
    name: 'Nylon Coach Jacket',
    category: 'jackets',
    price: 4499,
    badge: 'NEW',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      color('coach-jacket', 'navy', 'Deep Navy', '#1E2638', 'blue'),
      color('coach-jacket', 'stone', 'Stone', '#C2B9A7', 'brown'),
      color('coach-jacket', 'black', 'Black', '#121212', 'black'),
    ],
    description:
      'Lightweight, snap-front and finished with a drawcord hem. The coach jacket, cut a little wider for layering over hoodies.',
    details: ['Lightweight nylon shell', 'Snap-front closure', 'Drawcord hem', 'Mesh lining'],
    isNew: true,
    releaseRank: 13,
  },
  {
    id: 'cargo-trouser',
    name: 'Relaxed Cargo Trouser',
    category: 'bottoms',
    price: 3199,
    badge: 'NEW',
    sizes: WAIST,
    colors: [
      color('cargo-trouser', 'black', 'Black', '#171717', 'black'),
      color('cargo-trouser', 'khaki', 'Khaki', '#A89470', 'brown'),
      color('cargo-trouser', 'olive', 'Olive', '#525836', 'green'),
      color('cargo-trouser', 'slate', 'Slate', '#5A6370', 'grey'),
    ],
    description:
      'Relaxed through the thigh with bellowed cargo pockets and a straight, slightly cropped leg. Cotton ripstop that only gets better with wear.',
    details: ['Cotton ripstop', 'Relaxed straight leg', 'Bellowed cargo pockets', 'Button fly'],
    isNew: true,
    isFeatured: true,
    releaseRank: 10,
  },
  {
    id: 'straight-jean',
    name: 'Relaxed Straight Jean',
    category: 'bottoms',
    price: 3499,
    sizes: WAIST,
    colors: [
      color('straight-jean', 'indigo', 'Rinse Indigo', '#29395A', 'blue'),
      color('straight-jean', 'washed-black', 'Washed Black', '#2E2E31', 'black'),
      color('straight-jean', 'light-wash', 'Light Wash', '#8FA6C2', 'blue'),
    ],
    description:
      'Five-pocket denim with a relaxed seat and a straight leg that stacks just right over a sneaker. Contrast stitching and copper rivets.',
    details: ['13 oz cotton denim', 'Relaxed straight fit', 'Five-pocket construction', 'Copper rivets'],
    isFeatured: true,
    releaseRank: 3,
  },
  {
    id: 'pleated-trouser',
    name: 'Pleated Wide Trouser',
    category: 'bottoms',
    price: 2999,
    sizes: WAIST,
    colors: [
      color('pleated-trouser', 'charcoal', 'Charcoal', '#38383A', 'grey'),
      color('pleated-trouser', 'cream', 'Cream', '#E4DBC6', 'white'),
      color('pleated-trouser', 'brown', 'Chocolate', '#4A3225', 'brown'),
    ],
    description:
      'Double front pleats, a wide leg and a pressed crease. Tailoring energy, streetwear proportions.',
    details: ['Poly-viscose suiting', 'Double front pleats', 'Wide leg with crease', 'Extended waistband tab'],
    releaseRank: 2,
  },
]

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getColor(product: Product, slug: string | undefined): ProductColor {
  return product.colors.find((c) => c.slug === slug) ?? product.colors[0]
}
