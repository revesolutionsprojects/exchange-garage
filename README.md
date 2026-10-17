# EXCHANGE GARAGE — Storefront Prototype

An interactive, frontend-only **showcase site** for the streetwear label **Exchange Garage**.
It shows the brand direction, **live colour switching on product cards** and an interactive
**Fitting Room** where you can dress a model. It runs in showcase mode: there are no prices,
no bag, no checkout and no stock tracking.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Lucide icons · self-hosted fonts (Anton, Inter Tight)

## Run locally

Requires Node 22.18 or newer.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run preview      # serve the production build
npm run generate:images   # rebuild placeholder product renders (see below)
```

The build uses a relative base path and hash routing (`#/shop`, `#/product/…`), so `dist/`
can be uploaded to any static host or sub-folder without rewrite rules.

## What's included

| Area | Behaviour |
| --- | --- |
| **Colour switching (core feature)** | Hovering a product card reveals a swatch panel. Resting on or clicking a swatch swaps to that colour's own image (crossfade) and updates the colour name. The selection stays after the pointer leaves. On touch devices the swatches are always visible and tappable. Keyboard: Tab into a card, then use the arrow keys. |
| **Fitting Room** (`#/studio` and a homepage section) | Dress a model with any headwear, layer, top, bottom and shoes. Tap a piece on the model, or use the hotspots, to swap it. Colours change live. Turn the model front/back (button, or drag sideways), tuck the top in, change model tone and backdrop, shuffle, reset, save looks (this browser only) and copy a shareable link to a look. "Try it on" on product cards and pages opens it wearing that piece. |
| Product page | Gallery (front / back / detail, click to zoom) that keeps the same view when you change colour, available sizes (information only), "Try it in the Fitting Room", details, related products. The colour is kept in the URL, so links can be shared. |
| Shop / search | Search by name, filter by category, colour family and collection (New / Featured), sort by featured, newest or name, active-filter chips, empty state and reset. All state lives in the URL. Header search overlay with live results. |
| Homepage | Announcement bar (configurable), sticky nav plus mobile menu, cinematic hero, category tiles, featured grid with category tabs, Fitting Room, new-arrivals editorial, brand story, newsletter (validation and success state, nothing sent), footer. |
| Quality | Responsive from 360px up. Visible focus states, focus handling in dialogs, skip link. Respects `prefers-reduced-motion`. Branded fallback when an image fails to load. Placeholder pages for contact, privacy and terms, so no footer link is dead. |

## Project structure

```
src/
  data/products.ts      ← demo catalogue (edit to change products, prices, colours, images)
  data/site.ts          ← announcement text, hero copy, editorial images, contact placeholders
  data/studio.ts        ← Fitting Room: which pieces go in which slot, shoes/headwear props, tones, backdrops
  types.ts              ← Product / ProductColor types
  lib/                  ← hash router, catalogue filtering/sorting, INR formatting
  hooks/                ← dialog focus/escape handling, scroll reveal, hover detection
  components/           ← ProductCard, ColorSwatches, ProductGallery, CategorySection,
                          Navbar, SearchOverlay, MobileMenu, Hero, …
  components/studio/    ← FittingRoom UI, ModelFigure, figure.ts (model + garment artwork)
  pages/                ← Home, Shop, Product, Studio, Info (policy placeholders), NotFound
scripts/generate-product-images.ts   ← placeholder garment renders
public/images/          ← editorial photography (local copies)
public/products/        ← generated per-colour product images
```

### Adding a product or colour

Add an entry to `src/data/products.ts`. No component changes are needed. Each colour has a
`slug`, `name`, swatch `hex`, filter `family` and an `images` array (the first image is used
on cards):

```ts
{ slug: 'sand', name: 'Sand', hex: '#C9B99A', family: 'brown',
  images: ['https://cdn.example.com/tee-sand-front.jpg', 'https://cdn.example.com/tee-sand-back.jpg'] }
```

For real photography, aim for the same angle, crop (4:5 portrait works best) and background
for every colour of a product, so the crossfade reads as a colour change rather than a new photo.

## Placeholders the client must replace

**Everything below is demo content, not confirmed Exchange Garage information.**

- **Products, names, descriptions, materials and sizes:** all 12 items in `src/data/products.ts` are invented.
- **Prices:** demo values are kept in `products.ts` for later but are not shown anywhere.
- **Stock / availability:** not modelled. Every size is listed as available.
- **Fitting Room shoes and headwear** (Court Low, Hi-Top, Lug Boot, Six-Panel Cap, Rib Beanie): styling props for the demo, not catalogue products.
- **Fitting Room model and garments:** illustrated in code (`src/components/studio/figure.ts`). Each catalogue piece maps to a garment shape in `src/data/studio.ts`, so new products need a mapping there to appear on the model.
- **Product images:** `public/products/**` are generated studio-style illustrations, one per colour and view, made by `npm run generate:images`. Replace them with real photography via each colour's `images` array.
- **Editorial photography:** stock photos from Unsplash (Unsplash License), stored locally in `public/images/`. Swap in campaign imagery before launch.
  - `hero.webp` — photo-1523398002811-999ca8dec234
  - `cat-tshirts.webp` — photo-1521572163474-6864f9cf17ab
  - `cat-shirts.webp` — photo-1602810318383-e386cc2a3ccf
  - `cat-hoodies.webp` — photo-1556821840-3a63f95609a7
  - `cat-jackets.webp` — photo-1611312449408-fcece27cdbb7
  - `cat-bottoms.webp` — photo-1542272604-787c3835535d
  - `drop-main.webp` — photo-1520975954732-35dd22299614
  - `drop-side.webp` — photo-1529139574466-a303027c1d8b
  - `story.webp` — photo-1516826957135-700dedea698c
  - `newsletter.webp` — photo-1551028719-00167b16eac5

  (Each is at `https://images.unsplash.com/<id>`.)

  Each photo also has smaller `-640` / `-1080` (hero: `-1600`) versions for phones. When swapping in new photography, export the same sizes and update the `srcSet` entries in `src/data/site.ts`.
- **Brand story copy, pillars, taglines, "Collection 01" naming:** original placeholder copy, not company history.
- **Contact email, phone, address, Instagram handle:** shown as "to be confirmed" (`src/data/site.ts`).
- **Contact, privacy and terms pages:** placeholder text (`src/pages/InfoPage.tsx`).
- **Logo:** typographic wordmark and an "EG" favicon made for the demo. Replace them with the official logo files.

## Known limitations

- Showcase mode: there is no bag, checkout, payments, accounts or stock tracking. To add commerce later, the price fields are still in the product data.
- The newsletter form only validates the address. Nothing is sent or stored. Connect it to an email provider (Mailchimp, Klaviyo, etc.) in `Newsletter.tsx`.
- Saved Fitting Room looks are stored only in the current browser (localStorage). Shared links work anywhere.
- The Fitting Room model is a stylised illustration, not a photographic try-on. Garments are drawn shapes coloured to match each colourway.
- Search matches product names, categories and colour names. There's no fuzzy matching or typo tolerance.
- Hash-based URLs (`/#/shop`) are used for zero-config hosting. Moving to clean URLs needs a router with server rewrites.
- No automated test suite. Interactions were checked manually in Chrome at desktop, tablet and mobile sizes.
