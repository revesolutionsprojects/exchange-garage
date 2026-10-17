/**
 * Generates placeholder studio renders for every product colour in
 * src/data/products.ts → public/products/<productId>/<colorSlug>-<view>.svg
 *
 * Run with:  npm run generate:images
 *
 * These are stand-ins until real product photography exists. Each colour gets
 * its own image files (front, back, detail) with a consistent angle and
 * background, so the colour-switching UI behaves exactly as it will with
 * real photos. Replace a colour's `images` array in products.ts to swap in
 * photography; this script is then no longer needed for that product.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEMO_IMAGE_VIEWS, products } from '../src/data/products.ts'

type View = (typeof DEMO_IMAGE_VIEWS)[number]

type ArtSpec =
  | { kind: 'tee'; sleeve: 'short' | 'long'; print: 'none' | 'neck' | 'graphic' }
  | { kind: 'shirt'; style: 'oxford' | 'overshirt' }
  | { kind: 'top'; hood: boolean }
  | { kind: 'jacket'; style: 'bomber' | 'coach' }
  | { kind: 'pants'; style: 'cargo' | 'jean' | 'pleated' }

const ART: Record<string, ArtSpec> = {
  'heavyweight-tee': { kind: 'tee', sleeve: 'short', print: 'neck' },
  'garage-graphic-tee': { kind: 'tee', sleeve: 'short', print: 'graphic' },
  'layer-longsleeve': { kind: 'tee', sleeve: 'long', print: 'none' },
  'oxford-shirt': { kind: 'shirt', style: 'oxford' },
  'utility-overshirt': { kind: 'shirt', style: 'overshirt' },
  'fleece-hoodie': { kind: 'top', hood: true },
  'garage-crewneck': { kind: 'top', hood: false },
  'work-bomber': { kind: 'jacket', style: 'bomber' },
  'coach-jacket': { kind: 'jacket', style: 'coach' },
  'cargo-trouser': { kind: 'pants', style: 'cargo' },
  'straight-jean': { kind: 'pants', style: 'jean' },
  'pleated-trouser': { kind: 'pants', style: 'pleated' },
}

/* ---------------------------------------------------------------- colour */

function rgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '')
  if (h.length === 3) h = [...h].map((ch) => ch + ch).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = rgb(a)
  const [r2, g2, b2] = rgb(b)
  const c = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0')
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`
}

function luminance(hex: string): number {
  const [r, g, b] = rgb(hex)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

interface Palette {
  base: string
  inner: string
  seam: string
  stitch: string
  rib: string
  ink: string
  button: string
}

function palette(base: string): Palette {
  const lum = luminance(base)
  const dark = lum < 0.2
  return {
    base,
    inner: mix(base, '#000', dark ? 0.5 : 0.32),
    seam: dark ? mix(base, '#fff', 0.13) : mix(base, '#000', 0.26),
    stitch: dark ? mix(base, '#fff', 0.22) : mix(base, '#000', 0.2),
    rib: dark ? mix(base, '#000', 0.3) : mix(base, '#000', 0.07),
    ink: lum > 0.5 ? '#161616' : '#F1EEE6',
    button: lum > 0.6 ? mix(base, '#000', 0.12) : mix(base, '#fff', 0.3),
  }
}

const METAL = '#A9A59C'
const METAL_DARK = '#6E6A62'

/* ------------------------------------------------------------ primitives */

const line = (d: string, color: string, w = 2, extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="${w >= 10 ? 'butt' : 'round'}" stroke-linejoin="round" ${extra}/>`
const stitch = (d: string, color: string) => line(d, color, 1.6, 'stroke-dasharray="5 4" opacity=".9"')
const shape = (d: string, color: string, extra = '') => `<path d="${d}" fill="${color}" ${extra}/>`
const circle = (cx: number, cy: number, r: number, color: string, extra = '') =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" ${extra}/>`

/** Mirror an "x,y" path horizontally around x=400. Handles M/L/C/Q/Z absolute commands only. */
function mirror(d: string): string {
  return d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${800 - Number(x)},${y}`)
}

function snap(cx: number, cy: number, r = 8) {
  return circle(cx, cy, r, METAL, `stroke="${METAL_DARK}" stroke-width="1.5"`) + circle(cx - 2, cy - 2, r * 0.35, '#E9E6DF', 'opacity=".7"')
}

function button(cx: number, cy: number, p: Palette, r = 6.5) {
  return (
    circle(cx, cy, r, p.button, `stroke="${p.seam}" stroke-width="1"`) +
    circle(cx - 1.8, cy, 1, p.seam) +
    circle(cx + 1.8, cy, 1, p.seam)
  )
}

/** Ribbing: short parallel lines across a band defined by two edges. */
function ribs(x1: number, x2: number, y1: number, y2: number, color: string, step = 9) {
  let out = ''
  for (let x = x1 + step / 2; x < x2; x += step) out += line(`M${x},${y1 + 3} L${x},${y2 - 3}`, color, 1.2, 'opacity=".55"')
  return out
}

function text(x: number, y: number, size: number, content: string, color: string, extra = '') {
  return `<text x="${x}" y="${y}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="800" font-size="${size}" fill="${color}" text-anchor="middle" ${extra}>${content}</text>`
}

/* -------------------------------------------------------------- garments */

interface Art {
  /** Filled with the base colour; also the clip region for shading. */
  silhouette: string[]
  /** Drawn before the silhouette, inside the drop-shadow group. */
  under?: string
  /** Detail markup drawn on top of the shaded garment. */
  over: string
  /** Soft fold shadows (paths), clipped to the silhouette. */
  folds: string[]
  /** viewBox for the close-up "detail" image. */
  detailBox: string
  /** Optional texture overlay (pattern id defined in defs). */
  texture?: 'twill'
}

function tee(spec: Extract<ArtSpec, { kind: 'tee' }>, p: Palette, view: View): Art {
  const short =
    'M330,152 C362,140 438,140 470,152 L604,178 C646,196 694,262 726,334 L654,396 L594,342 L596,826 C470,838 330,838 204,826 L206,342 L146,396 L74,334 C106,262 154,196 196,178 Z'
  const long =
    'M330,152 C362,140 438,140 470,152 L604,178 C640,192 660,230 668,270 L696,690 L628,712 L594,410 L596,826 C470,838 330,838 204,826 L206,410 L172,712 L104,690 L132,270 C140,230 160,192 196,178 Z'
  const silhouette = [spec.sleeve === 'short' ? short : long]
  let over = ''

  if (spec.sleeve === 'long') {
    const cuffL = 'M104,690 L172,712 L167,758 L98,736 Z'
    silhouette.push(cuffL, mirror(cuffL))
    for (const c of [cuffL, mirror(cuffL)]) over += shape(c, p.rib, 'opacity=".6"') + line(c, p.seam, 1.2)
    over += line('M200,180 C214,240 212,330 208,410', p.seam, 1.6) + line(mirror('M200,180 C214,240 212,330 208,410'), p.seam, 1.6)
  } else {
    over += line('M200,180 C214,240 210,300 206,342', p.seam, 1.6) + line(mirror('M200,180 C214,240 210,300 206,342'), p.seam, 1.6)
    over += stitch('M84,318 L154,378', p.stitch) + stitch(mirror('M84,318 L154,378'), p.stitch)
  }

  if (view === 'back') {
    over += line('M330,152 C362,140 438,140 470,152', p.rib, 12) + stitch('M332,163 C364,151 436,151 468,163', p.stitch)
    if (spec.print === 'neck') over += text(400, 204, 15, 'EXCHANGE GARAGE', p.ink, 'letter-spacing="3" opacity=".85"')
    if (spec.print === 'graphic') {
      over += `<rect x="262" y="262" width="276" height="250" fill="none" stroke="${p.ink}" stroke-width="5"/>`
      over += text(400, 350, 62, 'EXCHANGE', p.ink, 'letter-spacing="1" textLength="236" lengthAdjust="spacingAndGlyphs"')
      over += text(400, 424, 76, 'GARAGE', p.ink, 'textLength="236" lengthAdjust="spacingAndGlyphs"')
      over += text(400, 484, 15, 'BUILT DIFFERENT', p.ink, 'letter-spacing="5"')
      over += text(400, 560, 13, 'DEPT. 01 / GARAGE GOODS', p.ink, 'letter-spacing="4" opacity=".8"')
    }
  } else {
    // visible inside of back neck, ribbed collar, woven label
    over += shape('M330,152 C362,140 438,140 470,152 C452,196 348,196 330,152 Z', p.inner)
    over += `<rect x="387" y="149" width="26" height="15" rx="1" fill="#EFEBE3"/>` + line('M392,157 L408,157', '#8a857b', 1.4)
    over += line('M328,152 C348,206 452,206 472,152', p.rib, 15)
    over += stitch('M325,164 C348,220 452,220 475,164', p.stitch)
    if (spec.print === 'graphic') {
      over += text(470, 300, 30, 'EXCHANGE', p.ink, 'letter-spacing="1" textLength="150" lengthAdjust="spacingAndGlyphs"')
      over += text(470, 334, 36, 'GARAGE', p.ink, 'textLength="150" lengthAdjust="spacingAndGlyphs"')
      over += text(470, 356, 8, 'DEPT. 01 — WORN YOUR WAY', p.ink, 'letter-spacing="1" opacity=".85"')
    }
  }
  over += stitch('M212,808 C330,820 470,820 588,808', p.stitch)

  return {
    silhouette,
    over,
    folds: [
      'M300,420 C312,560 290,700 302,820',
      'M505,380 C492,520 516,680 506,820',
      'M212,352 C262,382 292,424 302,474',
      'M588,352 C540,382 510,424 498,474',
      spec.sleeve === 'short' ? 'M150,250 C170,296 190,318 222,332' : 'M150,320 C160,460 170,560 160,660',
    ],
    detailBox: '250 110 300 375',
  }
}

function shirt(spec: Extract<ArtSpec, { kind: 'shirt' }>, p: Palette, view: View): Art {
  const body =
    'M345,162 L238,190 C206,200 192,232 188,262 L122,668 L198,690 L262,420 L258,842 C330,884 470,884 542,842 L538,420 L602,690 L678,668 L612,262 C608,232 594,200 562,190 L455,162 Z'
  const cuffL = 'M122,668 L198,690 L190,744 L114,722 Z'
  const silhouette = [body, cuffL, mirror(cuffL)]
  const isOver = spec.style === 'overshirt'
  let over = ''

  for (const c of [cuffL, mirror(cuffL)]) over += line(c, p.seam, 1.4) + stitch(c === cuffL ? 'M120,700 L192,722' : mirror('M120,700 L192,722'), p.stitch)
  over += line('M240,192 C252,262 262,340 262,420', p.seam, 1.6) + line(mirror('M240,192 C252,262 262,340 262,420'), p.seam, 1.6)
  over += stitch('M264,826 C334,866 466,866 536,826', p.stitch)

  if (view === 'back') {
    over += shape('M345,162 C372,150 428,150 455,162 L462,192 C430,180 370,180 338,192 Z', p.rib)
    over += line('M338,192 C370,180 430,180 462,192', p.seam, 1.4)
    over += line('M236,252 C330,266 470,266 564,252', p.seam, 1.6) + stitch('M236,262 C330,276 470,276 564,262', p.stitch)
    if (!isOver) over += line('M392,262 L390,330', p.seam, 1.4) + line('M408,262 L410,330', p.seam, 1.4)
    over += `<rect x="394" y="172" width="12" height="18" rx="2" fill="${p.rib}" stroke="${p.seam}" stroke-width="1"/>`
  } else {
    over += shape('M345,162 C372,148 428,148 455,162 L400,210 Z', p.inner)
    over += line('M388,212 L388,872', p.seam, 1.4) + line('M412,212 L412,872', p.seam, 1.4)
    const collarL = 'M400,212 L345,158 L312,182 L346,258 Z'
    for (const c of [collarL, mirror(collarL)]) over += shape(c, p.base) + shape(c, '#000', 'opacity=".05"') + line(c, p.seam, 1.4)
    over += stitch('M392,212 L344,168 L322,184 L350,246', p.stitch) + stitch(mirror('M392,212 L344,168 L322,184 L350,246'), p.stitch)
    const closures = [262, 345, 428, 511, 594, 677, 760]
    for (const y of closures) over += isOver ? snap(400, y, 7) : button(400, y, p)
    if (isOver) {
      for (const flip of [false, true]) {
        const m = (d: string) => (flip ? mirror(d) : d)
        over += line(m('M274,300 L366,300 L366,404 L274,404 Z'), p.seam, 1.6) + stitch(m('M280,310 L360,310 L360,396 L280,396 Z'), p.stitch)
        over += shape(m('M270,292 L370,292 L370,338 L270,338 Z'), p.base) + shape(m('M270,292 L370,292 L370,338 L270,338 Z'), '#000', 'opacity=".06"') + line(m('M270,292 L370,292 L370,338 L270,338 Z'), p.seam, 1.6)
        over += snap(flip ? 480 : 320, 322, 6)
      }
    } else {
      over += line('M282,318 L358,318 L358,396 L320,410 L282,396 Z', p.seam, 1.6) + stitch('M282,328 L358,328', p.stitch)
      over += button(350, 246, p, 4) + button(450, 246, p, 4)
    }
  }

  return {
    silhouette,
    over,
    folds: ['M310,430 C318,560 300,700 314,850', 'M492,430 C482,560 500,700 488,850', 'M200,300 C190,420 176,540 164,650', 'M600,300 C610,420 624,540 636,650'],
    detailBox: '270 140 260 325',
  }
}

/** Shared body for hoodie / crewneck / bomber / coach jacket. */
const TOP_BODY =
  'M328,194 L238,206 C204,216 188,248 184,284 L118,690 L196,712 L262,440 L262,800 L538,800 L538,440 L604,712 L682,690 L616,284 C612,248 596,216 562,206 L472,194 Z'
const TOP_HEM = 'M256,798 L544,798 L546,858 L254,858 Z'
const TOP_CUFF = 'M118,690 L196,712 L188,768 L110,746 Z'

function ribbedTrims(p: Palette) {
  let out = shape(TOP_HEM, p.rib, 'opacity=".7"') + line(TOP_HEM, p.seam, 1.4) + ribs(256, 544, 798, 858, p.seam)
  for (const c of [TOP_CUFF, mirror(TOP_CUFF)]) out += shape(c, p.rib, 'opacity=".7"') + line(c, p.seam, 1.4)
  out += stitch('M122,712 L192,733', p.seam) + stitch(mirror('M122,712 L192,733'), p.seam)
  return out
}

function armSeams(p: Palette) {
  return line('M240,208 C252,290 262,370 262,440', p.seam, 1.6) + line(mirror('M240,208 C252,290 262,370 262,440'), p.seam, 1.6)
}

const TOP_FOLDS = ['M316,440 C326,560 306,680 318,790', 'M488,420 C478,560 498,680 486,790', 'M196,330 C186,450 170,560 156,680', 'M604,330 C614,450 630,560 644,680']

function top(spec: Extract<ArtSpec, { kind: 'top' }>, p: Palette, view: View): Art {
  const silhouette = [TOP_BODY, TOP_HEM, TOP_CUFF, mirror(TOP_CUFF)]
  let under = ''
  let over = ribbedTrims(p) + armSeams(p)

  if (spec.hood) {
    const hood = 'M282,222 C262,120 326,66 400,66 C474,66 538,120 518,222 Z'
    if (view === 'back') {
      const flat = 'M286,236 C262,116 326,58 400,58 C474,58 538,116 514,236 C470,250 330,250 286,236 Z'
      over += shape(flat, p.base) + shape(flat, '#000', 'opacity=".05"') + line(flat, p.seam, 1.6) + line('M400,60 L400,244', p.seam, 1.6)
      over += stitch('M392,64 L392,240', p.stitch) + stitch('M408,64 L408,240', p.stitch)
      over += text(400, 340, 20, 'EXCHANGE GARAGE', p.ink, 'letter-spacing="7" opacity=".9"')
    } else {
      under += shape(hood, p.base)
      over += shape('M326,228 C318,150 352,108 400,108 C448,108 482,150 474,228 C446,252 354,252 326,228 Z', p.inner)
      over += line('M326,228 C318,150 352,108 400,108 C448,108 482,150 474,228', p.base, 12) + line('M321,230 C312,146 348,100 400,100 C452,100 488,146 479,230', p.seam, 1.2)
      over += line('M300,226 C350,262 450,262 500,226', p.seam, 1.6)
      const cord = luminance(p.base) > 0.5 ? mix(p.base, '#000', 0.12) : mix(p.base, '#fff', 0.18)
      over += circle(372, 252, 5, METAL, `stroke="${METAL_DARK}"`) + circle(428, 252, 5, METAL, `stroke="${METAL_DARK}"`)
      over += line('M372,254 C366,300 376,340 366,392', cord, 6) + line('M428,254 C434,300 424,340 434,392', cord, 6)
      over += `<rect x="361" y="388" width="10" height="22" rx="2" fill="${METAL}"/><rect x="429" y="388" width="10" height="22" rx="2" fill="${METAL}"/>`
      const pocket = 'M296,606 L504,606 L540,772 L260,772 Z'
      over += line(pocket, p.seam, 1.6) + stitch('M300,616 L500,616 M532,764 L268,764', p.stitch)
      over += line('M298,610 L264,768', p.inner, 3, 'opacity=".6"') + line('M502,610 L536,768', p.inner, 3, 'opacity=".6"')
    }
  } else {
    if (view === 'back') {
      over += line('M328,194 C362,182 438,182 472,194', p.rib, 14) + stitch('M330,206 C362,194 438,194 470,206', p.stitch)
    } else {
      over += shape('M328,194 C362,182 438,182 472,194 C456,240 344,240 328,194 Z', p.inner)
      over += line('M326,194 C346,250 454,250 474,194', p.rib, 18) + stitch('M322,208 C346,266 454,266 478,208', p.stitch)
      over += text(470, 330, 26, 'EG', p.ink, 'letter-spacing="2" opacity=".9"')
    }
  }

  return { silhouette, under, over, folds: TOP_FOLDS, detailBox: spec.hood ? '250 60 300 375' : '260 160 280 350' }
}

function jacket(spec: Extract<ArtSpec, { kind: 'jacket' }>, p: Palette, view: View): Art {
  const bomber = spec.style === 'bomber'
  const silhouette = bomber ? [TOP_BODY, TOP_HEM, TOP_CUFF, mirror(TOP_CUFF)] : [TOP_BODY.replace('L262,800 L538,800', 'L258,842 L542,842')]
  let over = armSeams(p)

  if (bomber) over += ribbedTrims(p)
  else {
    over += stitch('M262,812 L538,812', p.stitch) + line('M260,826 L540,826', p.seam, 1.2)
    over += line('M276,826 C270,860 262,880 266,906', '#2a2a2a', 3) + line(mirror('M276,826 C270,860 262,880 266,906'), '#2a2a2a', 3)
    over += `<rect x="258" y="896" width="16" height="22" rx="4" fill="${METAL_DARK}"/><rect x="526" y="896" width="16" height="22" rx="4" fill="${METAL_DARK}"/>`
    over += stitch('M124,672 L190,692', p.stitch) + stitch(mirror('M124,672 L190,692'), p.stitch)
  }

  if (view === 'back') {
    over += line('M328,194 C362,182 438,182 472,194', bomber ? p.rib : p.base, bomber ? 18 : 10) + line('M330,208 C362,196 438,196 470,208', p.seam, 1.2)
    over += line('M240,300 C330,312 470,312 560,300', p.seam, 1.4)
    if (!bomber) {
      over += text(400, 420, 44, 'EXCHANGE', p.ink, 'textLength="250" lengthAdjust="spacingAndGlyphs"')
      over += text(400, 476, 54, 'GARAGE', p.ink, 'textLength="250" lengthAdjust="spacingAndGlyphs"')
      over += text(400, 510, 13, 'OUTERWEAR DEPT. — DEMO', p.ink, 'letter-spacing="3" opacity=".85"')
    }
  } else {
    over += shape('M328,194 C362,182 438,182 472,194 C460,236 340,236 328,194 Z', p.inner)
    if (bomber) {
      over += line('M326,196 C338,244 376,262 400,264 C424,262 462,244 474,196', p.rib, 22) + line('M326,196 C338,244 376,262 400,264 C424,262 462,244 474,196', p.seam, 1, 'stroke-dasharray="1.5 5" opacity=".8"')
      over += line('M400,268 L400,796', mix(p.base, '#000', 0.4), 10) + line('M400,268 L400,796', METAL, 5, 'stroke-dasharray="2 2"')
      over += `<rect x="393" y="284" width="14" height="30" rx="3" fill="${METAL}" stroke="${METAL_DARK}" stroke-width="1.2"/>`
      over += line('M292,560 L318,684', p.inner, 5) + line(mirror('M292,560 L318,684'), p.inner, 5)
      over += stitch('M300,556 L326,680', p.stitch) + stitch(mirror('M300,556 L326,680'), p.stitch)
      const sleevePocket = 'M574,352 L618,346 L626,420 L582,426 Z'
      over += line(sleevePocket, p.seam, 1.6) + stitch('M580,362 L620,357', p.stitch) + line('M577,360 L620,355', METAL, 2.5)
    } else {
      const collarL = 'M400,226 L332,190 L300,214 L340,290 Z'
      for (const c of [collarL, mirror(collarL)]) over += shape(c, p.base) + shape(c, '#000', 'opacity=".06"') + line(c, p.seam, 1.4)
      over += line('M400,230 L400,826', p.seam, 1.4) + stitch('M412,232 L412,824', p.stitch)
      for (const y of [300, 410, 520, 630, 740]) over += snap(406, y)
      over += text(470, 360, 22, 'EG', p.ink, 'letter-spacing="2"')
      over += line('M300,560 L314,690', p.seam, 2) + line(mirror('M300,560 L314,690'), p.seam, 2)
    }
  }

  return { silhouette, over, folds: TOP_FOLDS, detailBox: bomber ? '260 160 280 350' : '260 170 280 350' }
}

function pants(spec: Extract<ArtSpec, { kind: 'pants' }>, p: Palette, view: View): Art {
  const shapes = {
    cargo: 'M254,118 L546,118 L552,176 L590,902 L434,902 L404,352 L396,352 L366,902 L210,902 L248,176 Z',
    jean: 'M258,118 L542,118 L548,176 L578,902 L432,902 L404,356 L396,356 L368,902 L222,902 L252,176 Z',
    pleated: 'M250,118 L550,118 L556,176 L618,902 L428,902 L404,360 L396,360 L372,902 L182,902 L244,176 Z',
  }
  const jean = spec.style === 'jean'
  const thread = jean ? (luminance(p.base) < 0.2 ? '#9A8E78' : '#C8913F') : p.stitch
  const silhouette = [shapes[spec.style]]
  let over = ''

  // waistband + loops
  over += line('M252,166 L548,166', p.seam, 1.6) + stitch('M254,128 L546,128 M254,158 L546,158', thread)
  for (const x of [276, 344, 456, 524]) over += `<rect x="${x - 6}" y="112" width="12" height="60" rx="2" fill="${p.base}" stroke="${p.seam}" stroke-width="1.2"/>`

  // hems
  const hemY = 880
  over += stitch(`M${jean ? 224 : spec.style === 'pleated' ? 186 : 212},${hemY} L${jean ? 366 : 368},${hemY}`, thread)
  over += stitch(mirror(`M${jean ? 224 : spec.style === 'pleated' ? 186 : 212},${hemY} L${jean ? 366 : 368},${hemY}`), thread)

  if (view === 'back') {
    over += line('M400,166 L400,352', p.seam, 1.6)
    if (jean) {
      over += line('M262,214 C320,232 360,236 400,240', p.seam, 1.4) + line(mirror('M262,214 C320,232 360,236 400,240'), p.seam, 1.4)
      for (const flip of [false, true]) {
        const m = (d: string) => (flip ? mirror(d) : d)
        over += line(m('M280,268 L370,262 L374,368 L328,392 L284,372 Z'), p.seam, 1.6) + stitch(m('M288,276 L364,270 L366,362 L328,382 L292,366 Z'), thread)
        over += stitch(m('M296,312 C316,300 338,318 358,300'), thread)
      }
      over += `<rect x="460" y="124" width="68" height="34" rx="2" fill="#7B5236"/>` + text(494, 146, 11, 'EG', '#E8D9C4', 'letter-spacing="2"')
    } else if (spec.style === 'cargo') {
      for (const flip of [false, true]) {
        const m = (d: string) => (flip ? mirror(d) : d)
        over += line(m('M282,234 L372,234 L372,338 L282,338 Z'), p.seam, 1.6) + stitch(m('M288,242 L366,242 L366,330 L288,330 Z'), thread)
        over += shape(m('M278,226 L376,226 L376,266 L278,266 Z'), p.base) + line(m('M278,226 L376,226 L376,266 L278,266 Z'), p.seam, 1.6)
        over += snap(flip ? 473 : 327, 252, 6)
      }
    } else {
      for (const x of [328, 472]) over += line(`M${x - 42},240 L${x + 42},240`, p.inner, 4) + button(x, 256, p, 5)
    }
  } else {
    over += circle(400, 142, 8, jean ? '#B07A44' : p.button, `stroke="${jean ? '#6d4a28' : p.seam}" stroke-width="1.4"`)
    over += line('M400,166 L400,340', p.seam, 1.6) + stitch('M414,168 L414,300 C414,324 406,336 398,340', thread)
    if (jean) {
      const pocket = 'M342,168 C338,228 300,258 252,262'
      over += line(pocket, p.seam, 2) + stitch('M332,170 C328,222 296,250 252,252', thread) + line(mirror(pocket), p.seam, 2) + stitch(mirror('M332,170 C328,222 296,250 252,252'), thread)
      over += line('M468,168 L470,214 L516,214 L516,170', p.seam, 1.4) + stitch('M472,176 L516,176', thread)
      for (const [x, y] of [[340, 172], [254, 262], [460, 172], [546, 262]]) over += circle(x, y, 4, '#B07A44', 'stroke="#6d4a28" stroke-width="1"')
    } else {
      over += line('M300,168 C306,212 318,246 332,268', p.seam, 2) + line(mirror('M300,168 C306,212 318,246 332,268'), p.seam, 2)
    }
    if (spec.style === 'cargo') {
      for (const flip of [false, true]) {
        const m = (d: string) => (flip ? mirror(d) : d)
        over += line(m('M238,480 L332,480 L332,624 L238,624 Z'), p.seam, 1.6) + line(m('M244,486 L326,486 L326,618 L244,618 Z'), p.seam, 1, 'opacity=".6"')
        over += stitch(m('M246,494 L324,494 L324,612 L246,612 Z'), thread)
        over += shape(m('M232,466 L338,466 L338,514 L232,514 Z'), p.base) + shape(m('M232,466 L338,466 L338,514 L232,514 Z'), '#000', 'opacity=".06"') + line(m('M232,466 L338,466 L338,514 L232,514 Z'), p.seam, 1.6)
        over += snap(flip ? 515 : 285, 494, 6)
      }
    }
    if (spec.style === 'pleated') {
      over += line('M336,168 C338,220 342,262 344,300', p.seam, 1.6) + line('M366,168 C366,210 368,236 368,256', p.seam, 1.4)
      over += line(mirror('M336,168 C338,220 342,262 344,300'), p.seam, 1.6) + line(mirror('M366,168 C366,210 368,236 368,256'), p.seam, 1.4)
      over += `<rect x="540" y="124" width="34" height="34" rx="2" fill="${p.base}" stroke="${p.seam}" stroke-width="1.2"/>` + button(562, 141, p, 5)
    }
  }

  // pressed crease (pleated) / centre-leg highlight
  if (spec.style === 'pleated') over += line('M300,300 L278,898', '#fff', 2, 'opacity=".18"') + line(mirror('M300,300 L278,898'), '#fff', 2, 'opacity=".18"')

  return {
    silhouette,
    over,
    folds: ['M276,620 C300,640 330,640 356,628', 'M524,620 C500,640 470,640 444,628', 'M250,780 C280,800 330,800 360,790', 'M550,780 C520,800 470,800 440,790', 'M380,380 C370,500 350,620 340,760', 'M420,380 C430,500 450,620 460,760'],
    detailBox: jean ? '220 100 360 450' : '230 100 340 425',
    texture: jean ? 'twill' : undefined,
  }
}

function buildArt(spec: ArtSpec, p: Palette, view: View): Art {
  switch (spec.kind) {
    case 'tee':
      return tee(spec, p, view)
    case 'shirt':
      return shirt(spec, p, view)
    case 'top':
      return top(spec, p, view)
    case 'jacket':
      return jacket(spec, p, view)
    case 'pants':
      return pants(spec, p, view)
  }
}

/* ----------------------------------------------------------------- render */

function render(spec: ArtSpec, hex: string, view: View, label: string): string {
  const p = palette(hex)
  const art = buildArt(spec, p, view === 'detail' ? 'front' : view)
  const viewBox = view === 'detail' ? art.detailBox : '0 0 800 1000'
  const clip = art.silhouette.map((d) => `<path d="${d}"/>`).join('')
  const fills = art.silhouette.map((d) => shape(d, p.base)).join('')
  const dark = luminance(hex) < 0.2

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="800" height="1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
<defs>
  <radialGradient id="bg" cx="50%" cy="42%" r="75%"><stop offset="0" stop-color="#EEEBE5"/><stop offset="1" stop-color="#D9D4CB"/></radialGradient>
  <linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".24"/><stop offset=".2" stop-color="#000" stop-opacity=".03"/><stop offset=".5" stop-color="#fff" stop-opacity="${dark ? 0.06 : 0.1}"/><stop offset=".8" stop-color="#000" stop-opacity=".03"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>
  <linearGradient id="sv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#3A3127" flood-opacity=".24"/></filter>
  <filter id="blur"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
  <pattern id="twill" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><rect width="7" height="7" fill="none"/><line x1="0" y1="0" x2="0" y2="7" stroke="#fff" stroke-width="1.6" opacity=".09"/></pattern>
  <clipPath id="clip">${clip}</clipPath>
</defs>
<rect x="-100" y="-100" width="1000" height="1200" fill="url(#bg)"/>
<g filter="url(#shadow)">${art.under ?? ''}${fills}</g>
<g clip-path="url(#clip)">
  <rect width="800" height="1000" fill="url(#sh)"/>
  <rect width="800" height="1000" fill="url(#sv)"/>
  ${art.texture === 'twill' ? '<rect width="800" height="1000" fill="url(#twill)"/><ellipse cx="300" cy="520" rx="70" ry="200" fill="#fff" opacity=".07" filter="url(#blur)"/><ellipse cx="500" cy="520" rx="70" ry="200" fill="#fff" opacity=".07" filter="url(#blur)"/>' : ''}
  <g filter="url(#blur)">${art.folds.map((d) => line(d, '#000', 16, `opacity="${dark ? 0.35 : 0.13}"`)).join('')}${art.folds.map((d) => line(d.replace(/(-?\d+),(-?\d+)/g, (_, x, y) => `${Number(x) + 14},${y}`), '#fff', 8, `opacity="${dark ? 0.05 : 0.12}"`)).join('')}</g>
  <rect width="800" height="1000" filter="url(#noise)" opacity="${dark ? 0.05 : 0.07}"/>
</g>
${art.over}
</svg>
`
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
let count = 0
for (const product of products) {
  const spec = ART[product.id]
  if (!spec) {
    console.warn(`No placeholder art spec for "${product.id}" — skipped`)
    continue
  }
  for (const c of product.colors) {
    for (const [i, view] of DEMO_IMAGE_VIEWS.entries()) {
      const rel = c.images[i]
      if (!rel?.endsWith('.svg') || !rel.startsWith('products/')) continue // real photo supplied — leave it alone
      const out = join(root, rel)
      mkdirSync(dirname(out), { recursive: true })
      writeFileSync(out, render(spec, c.hex, view, `${product.name} in ${c.name}, ${view} view`))
      count++
    }
  }
}
console.log(`Generated ${count} placeholder product images in public/products`)
