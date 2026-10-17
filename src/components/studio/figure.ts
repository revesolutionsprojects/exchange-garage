/**
 * SVG artwork for the Fitting Room model, in a 400 × 1000 viewBox.
 *
 * Every layer is drawn against fixed body landmarks so any combination lines
 * up. Colours come from CSS custom properties on the <svg> (--skin, --c-top,
 * …), which lets colour changes animate and keeps shading derived from one
 * base colour via color-mix().
 *
 * All markup is generated from constants in this file — no user input — so it
 * is safe to inject with dangerouslySetInnerHTML.
 */
import type { GarmentStyle } from '../../data/studio'

export type View = 'front' | 'back'
export type ColorVar = '--skin' | '--c-head' | '--c-layer' | '--c-top' | '--c-bottom' | '--c-shoes'

export interface FigureIds {
  shade: string
  shadeBody: string
  blur: string
  twill: string
}

/* ---------------------------------------------------------------- helpers */

/** Mirror a path around the vertical centre line (x = 200). */
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${400 - Number(x)},${y}`)
const pair = (d: string) => [d, mirror(d)]

const base = (v: ColorVar) => `var(${v})`
const dark = (v: ColorVar, pct: number) => `color-mix(in srgb, var(${v}), #000 ${pct}%)`
const light = (v: ColorVar, pct: number) => `color-mix(in srgb, var(${v}), #fff ${pct}%)`
/** Mixing toward mid-grey keeps seams visible on both black and white fabric. */
const seam = (v: ColorVar) => `color-mix(in srgb, var(${v}) 62%, #7a7a7a)`

const METAL = '#A9A59C'
const METAL_DARK = '#6E6A62'

const fillPath = (d: string, fill: string, extra = '') => `<path d="${d}" style="fill:${fill}" ${extra}/>`
const line = (d: string, stroke: string, w = 1.4, extra = '') =>
  `<path d="${d}" style="fill:none;stroke:${stroke};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round" ${extra}/>`
const stitch = (d: string, stroke: string) => line(d, stroke, 0.9, 'stroke-dasharray="3 2.4"')
const dot = (cx: number, cy: number, r: number, fill: string, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:${fill}" ${extra}/>`
const label = (x: number, y: number, size: number, text: string, fill: string, extra = '') =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="800" font-size="${size}" style="fill:${fill}" ${extra}>${text}</text>`

/** A garment panel: base fill, outline seam and the shared shading overlay. */
function panel(d: string, v: ColorVar, ids: FigureIds, fill = base(v)) {
  return fillPath(d, fill) + `<path d="${d}" fill="url(#${ids.shade})"/>` + line(d, seam(v), 0.8, 'opacity=".55"')
}

function folds(ids: FigureIds, paths: string[], strength = 0.16) {
  return `<g filter="url(#${ids.blur})">${paths.map((d) => line(d, '#000', 7, `opacity="${strength}"`)).join('')}</g>`
}

function ribLines(x1: number, x2: number, y1: number, y2: number, v: ColorVar, step = 5) {
  let out = ''
  for (let x = x1 + step / 2; x < x2; x += step) out += line(`M${x},${y1 + 2} L${x},${y2 - 2}`, dark(v, 22), 0.6, 'opacity=".7"')
  return out
}

function snap(cx: number, cy: number, r = 3.2) {
  return dot(cx, cy, r, METAL, `stroke="${METAL_DARK}" stroke-width=".8"`)
}

/* ------------------------------------------------------------------- body */

const BODY = {
  head: 'M200,42 C220,42 236,60 236,88 C236,116 220,134 200,134 C180,134 164,116 164,88 C164,60 180,42 200,42 Z',
  neck: 'M187,122 L186,168 L214,168 L213,122 Z',
  torso:
    'M186,158 C168,168 146,170 128,178 C116,184 112,200 116,220 C122,240 132,252 138,264 C140,300 142,350 150,400 C146,430 134,450 134,478 L138,525 L200,535 L262,525 L266,478 C266,450 254,430 250,400 C258,350 260,300 262,264 C268,252 278,240 284,220 C288,200 284,184 272,178 C254,170 232,168 214,158 Z',
  arm: 'M120,182 C104,196 100,220 100,250 L92,380 C90,430 86,480 84,520 L110,524 C112,480 116,430 118,384 L138,266 C134,230 132,200 120,182 Z',
  hand: 'M84,516 C80,545 78,575 84,598 C88,610 100,610 104,598 C110,575 112,545 110,520 Z',
  leg: 'M136,470 C132,520 136,600 146,720 C150,770 148,820 158,902 L186,902 C188,840 194,780 192,720 C196,640 200,580 200,530 Z',
  foot: 'M158,896 L186,896 L190,935 C190,945 176,948 150,946 C140,945 140,935 148,928 Z',
}

export function drawBody(ids: FigureIds): string {
  const part = (d: string) => fillPath(d, base('--skin')) + `<path d="${d}" fill="url(#${ids.shadeBody})"/>`
  return [
    ...pair(BODY.leg).map(part),
    ...pair(BODY.foot).map(part),
    part(BODY.torso),
    ...pair(BODY.arm).map(part),
    ...pair(BODY.hand).map(part),
    part(BODY.neck),
    part(BODY.head),
  ].join('')
}

/* ------------------------------------------------------------------- tops */

const torso = (h: number, hs = h) =>
  `M184,156 C166,166 144,170 122,178 C112,184 110,200 114,222 L128,262 C130,320 132,${hs - 80} 128,${hs} Q200,${2 * h - hs} 272,${hs} C268,${hs - 80} 270,320 272,262 L286,222 C290,200 288,184 278,178 C256,170 234,166 216,156 C208,174 192,174 184,156 Z`
const SLEEVE_SHORT = 'M124,176 C106,182 98,198 96,220 L86,322 L132,330 L134,262 Z'
const SLEEVE_LONG = 'M124,176 C106,182 98,198 96,222 L80,516 L114,522 L124,384 L134,262 Z'
const CUFF = 'M80,512 L114,518 L112,538 L79,532 Z'
const BAND = 'M132,498 L268,498 L266,524 L134,524 Z'

export function drawTop(style: GarmentStyle, view: View, ids: FigureIds, tuck: boolean, underLayer = false): string {
  const v: ColorVar = '--c-top'
  const ink = 'var(--c-top-ink)'
  const tucked = tuck && ['tee', 'tee-graphic', 'longsleeve', 'shirt'].includes(style)
  const short = style === 'tee' || style === 'tee-graphic'
  const banded = style === 'crew' || style === 'hoodie'

  let h = style === 'longsleeve' ? 515 : style === 'shirt' ? 528 : banded ? 500 : 505
  let hs = style === 'shirt' ? 506 : h
  if (tucked) h = hs = 436

  let out = panel(torso(h, hs), v, ids)
  out += folds(ids, ['M150,300 C156,360 150,420 156,480', 'M250,300 C244,360 250,420 244,480', 'M138,272 C156,286 168,300 172,320', 'M262,272 C244,286 232,300 228,320'])

  if (banded) out += panel(BAND, v, ids, dark(v, 8)) + ribLines(134, 266, 498, 524, v)
  if (tucked) out += line(`M136,${h - 8} Q200,${h + 4} 264,${h - 8}`, dark(v, 25), 1.1, 'opacity=".6"')
  else if (!banded) out += stitch(`M132,${hs - 7} Q200,${2 * h - hs - 7} 268,${hs - 7}`, seam(v))

  // sleeves
  for (const d of pair(short ? SLEEVE_SHORT : SLEEVE_LONG)) out += panel(d, v, ids)
  if (short) for (const d of pair('M90,313 L131,320')) out += stitch(d, seam(v))
  else
    for (const d of pair(CUFF)) {
      out += panel(d, v, ids, style === 'shirt' ? base(v) : dark(v, 8))
      if (style !== 'shirt') out += ribLines(80, 113, 516, 534, v, 4)
    }
  out += folds(ids, short ? ['M104,230 C108,262 112,290 110,316'] : ['M104,260 C100,340 98,420 94,500', 'M296,260 C300,340 302,420 306,500'], 0.12)
  if (style === 'shirt' && !short) for (const [x, y] of [[97, 526], [303, 526]]) out += dot(x, y, 1.8, light(v, 40))

  if (view === 'front') {
    if (style === 'shirt') {
      out += fillPath('M186,154 L200,182 L214,154 Z', dark(v, 30))
      for (const d of pair('M200,182 L186,152 L168,164 L180,204 Z')) out += panel(d, v, ids)
      out += line(`M196,184 L196,${h}`, seam(v), 0.8) + line(`M204,184 L204,${h}`, seam(v), 0.8)
      for (let y = 214; y < h - 10; y += 46) out += dot(200, y, 2.6, light(v, 35), `stroke="${seam(v)}" stroke-width=".6"`)
      out += line('M150,236 L182,236 L182,272 L166,278 L150,272 Z', seam(v), 0.9)
    } else {
      out += line('M183,156 C192,178 208,178 217,156', dark(v, 12), banded ? 8 : 5)
      // Chest prints would be cut off by an open jacket, so they're hidden under a layer.
      if (style === 'tee-graphic' && !underLayer) {
        out += label(238, 228, 10, 'EXCHANGE', ink, 'textLength="50" lengthAdjust="spacingAndGlyphs"')
        out += label(238, 241, 12, 'GARAGE', ink, 'textLength="50" lengthAdjust="spacingAndGlyphs"')
      }
      if (style === 'crew' && !underLayer) out += label(238, 236, 12, 'EG', ink, 'letter-spacing="1"')
      if (style === 'hoodie') {
        const cord = light(v, 25)
        out += line('M192,178 C190,200 192,226 189,256', cord, 2.6) + line('M208,178 C210,200 208,226 211,256', cord, 2.6)
        out += `<rect x="187" y="254" width="4" height="10" rx="1" style="fill:${METAL}"/><rect x="209" y="254" width="4" height="10" rx="1" style="fill:${METAL}"/>`
        out += line('M162,418 L238,418 L252,490 L148,490 Z', seam(v), 1) + line('M162,420 L150,488', dark(v, 30), 1.6) + line('M238,420 L250,488', dark(v, 30), 1.6)
      }
    }
  } else {
    if (style === 'shirt') {
      out += fillPath('M184,156 C192,148 208,148 216,156 L218,168 C206,162 194,162 182,168 Z', dark(v, 6)) + line('M182,168 C194,162 206,162 218,168', seam(v), 0.8)
      out += line('M122,214 C170,226 230,226 278,214', seam(v), 1)
    } else {
      out += line('M184,157 C192,150 208,150 216,157', dark(v, 12), banded ? 8 : 5)
    }
    if (style === 'tee-graphic') {
      out += `<rect x="158" y="228" width="84" height="96" style="fill:none;stroke:${ink};stroke-width:2.4"/>`
      out += label(200, 266, 16, 'EXCHANGE', ink, 'textLength="72" lengthAdjust="spacingAndGlyphs"')
      out += label(200, 292, 20, 'GARAGE', ink, 'textLength="72" lengthAdjust="spacingAndGlyphs"')
      out += label(200, 312, 5.5, 'BUILT DIFFERENT', ink, 'letter-spacing="1.5"')
    }
  }
  return out
}

/** Hoodie hood — drawn above any layer so it sits over a jacket collar. */
export function drawHood(view: View, ids: FigureIds, underLayer = false): string {
  const v: ColorVar = '--c-top'
  if (view === 'front') {
    return (
      panel('M158,184 C146,158 164,136 200,136 C236,136 254,158 242,184 C228,176 214,174 200,174 C186,174 172,176 158,184 Z', v, ids) +
      fillPath('M178,176 C176,160 186,148 200,148 C214,148 224,160 222,176 C214,172 186,172 178,176 Z', dark(v, 38))
    )
  }
  const hood = 'M148,178 C146,156 254,156 252,178 C254,238 232,284 200,294 C168,284 146,238 148,178 Z'
  return (
    panel(hood, v, ids) +
    line('M200,160 L200,292', seam(v), 1) +
    stitch('M196,162 L196,288', seam(v)) +
    stitch('M204,162 L204,288', seam(v)) +
    // The hoodie's back print is hidden when a jacket is worn over it.
    (underLayer ? '' : label(200, 326, 7, 'EXCHANGE GARAGE', 'var(--c-top-ink)', 'letter-spacing="2.5" opacity=".9"'))
  )
}

/* ----------------------------------------------------------------- layers */

const layerPanel = (hem: number) =>
  `M188,158 C170,166 146,170 118,180 C106,186 104,202 108,224 L122,262 C124,330 126,430 122,${hem} L178,${hem} L182,262 C180,220 184,180 188,158 Z`
const layerBack = (hem: number) =>
  `M188,158 C170,166 146,170 118,180 C106,186 104,202 108,224 L122,262 C124,330 126,430 122,${hem} L278,${hem} C274,430 276,330 278,262 L292,224 C296,202 294,186 282,180 C254,170 230,166 212,158 C206,154 194,154 188,158 Z`
const LAYER_SLEEVE = 'M118,180 C100,186 92,204 90,226 L76,520 L116,528 L126,384 L134,262 Z'
const LAYER_CUFF = 'M76,512 L116,520 L114,542 L75,536 Z'

export function drawLayer(style: GarmentStyle, view: View, ids: FigureIds): string {
  const v: ColorVar = '--c-layer'
  const bomber = style === 'bomber'
  const hem = bomber ? 498 : style === 'overshirt' ? 526 : 520
  let out = ''

  if (view === 'front') for (const d of pair(layerPanel(hem))) out += panel(d, v, ids)
  else out += panel(layerBack(hem), v, ids)
  out += folds(ids, ['M136,280 C142,360 136,440 140,500', 'M264,280 C258,360 264,440 260,500'])

  for (const d of pair(LAYER_SLEEVE)) out += panel(d, v, ids)
  out += folds(ids, ['M100,250 C96,330 92,420 88,500', 'M300,250 C304,330 308,420 312,500', 'M112,384 C104,392 96,394 88,392'], 0.14)
  for (const d of pair(LAYER_CUFF)) {
    out += panel(d, v, ids, bomber ? dark(v, 10) : base(v))
    if (bomber) out += ribLines(76, 115, 516, 538, v, 4)
  }

  if (bomber) {
    if (view === 'front')
      for (const d of pair('M124,496 L178,496 L178,522 L126,522 Z')) out += panel(d, v, ids, dark(v, 10)) + ribLines(126, 178, 496, 522, v)
    else out += panel('M124,496 L276,496 L274,522 L126,522 Z', v, ids, dark(v, 10)) + ribLines(126, 274, 496, 522, v)
  } else {
    out += stitch(view === 'front' ? `M126,${hem - 10} L178,${hem - 10} M222,${hem - 10} L274,${hem - 10}` : `M126,${hem - 10} L274,${hem - 10}`, seam(v))
  }

  if (view === 'front') {
    if (bomber) {
      out += line('M186,160 C194,150 206,150 214,160', dark(v, 12), 9)
      for (const d of pair('M188,160 C184,180 180,220 182,262')) out += line(d, dark(v, 12), 7)
      for (const d of pair(`M182,264 L178,${hem}`)) out += line(d, METAL, 2.2, 'stroke-dasharray="1.4 1.4"')
      for (const d of pair('M140,410 L150,466')) out += line(d, dark(v, 35), 3)
      out += line('M292,300 L310,298 L314,338 L296,340 Z', seam(v), 1) + line('M293,304 L310,302', METAL, 1.4)
    } else {
      const collar = style === 'coach' ? 'M188,158 L168,168 L156,212 L180,222 L184,190 Z' : 'M188,158 L170,168 L162,204 L181,212 L184,188 Z'
      for (const d of pair(collar)) out += panel(d, v, ids)
      const snapX = style === 'coach' ? 172 : 174
      for (let y = 280; y < hem - 30; y += style === 'coach' ? 48 : 52) out += snap(snapX, y)
      if (style === 'overshirt') {
        for (const flip of [false, true]) {
          const m = (d: string) => (flip ? mirror(d) : d)
          out += line(m('M140,240 L174,240 L174,284 L140,284 Z'), seam(v), 1)
          out += panel(m('M138,232 L176,232 L176,254 L138,254 Z'), v, ids)
          out += snap(flip ? 243 : 157, 244, 2.6)
        }
      } else {
        out += label(250, 252, 9, 'EG', 'var(--c-layer-ink)', 'letter-spacing="1"')
        for (const d of pair(`M128,${hem} C126,${hem + 14} 124,${hem + 22} 126,${hem + 30}`)) out += line(d, '#2a2a2a', 1.4)
      }
    }
  } else {
    out += line('M186,160 C194,152 206,152 214,160', bomber ? dark(v, 12) : base(v), bomber ? 9 : 6)
    if (style === 'coach') {
      out += label(200, 300, 22, 'EXCHANGE', 'var(--c-layer-ink)', 'textLength="116" lengthAdjust="spacingAndGlyphs"')
      out += label(200, 330, 27, 'GARAGE', 'var(--c-layer-ink)', 'textLength="116" lengthAdjust="spacingAndGlyphs"')
      out += label(200, 346, 6, 'OUTERWEAR DEPT.', 'var(--c-layer-ink)', 'letter-spacing="2" opacity=".85"')
    } else {
      out += line('M118,236 C170,248 230,248 282,236', seam(v), 1)
    }
  }
  return out
}

/* ---------------------------------------------------------------- bottoms */

const BOTTOMS: Record<'cargo' | 'jean' | 'pleated', string> = {
  cargo:
    'M146,398 L254,398 L256,424 C268,450 274,480 272,520 C270,600 268,700 264,896 L208,896 C206,800 204,650 202,540 L198,540 C196,650 194,800 192,896 L136,896 C132,700 130,600 128,520 C126,480 132,450 144,424 Z',
  jean: 'M148,398 L252,398 L254,424 C264,450 268,480 266,520 C264,600 260,700 258,902 L210,902 C208,800 206,650 203,540 L197,540 C194,650 192,800 190,902 L142,902 C140,700 136,600 134,520 C132,480 136,450 146,424 Z',
  pleated:
    'M146,398 L254,398 L258,424 C272,450 280,480 280,520 C282,620 284,760 284,906 L206,906 C206,800 204,650 202,546 L198,546 C196,650 194,800 194,906 L116,906 C116,760 118,620 120,520 C120,480 128,450 142,424 Z',
}

export function drawBottom(style: GarmentStyle, view: View, ids: FigureIds): string {
  const v: ColorVar = '--c-bottom'
  const kind = (style in BOTTOMS ? style : 'cargo') as keyof typeof BOTTOMS
  const d = BOTTOMS[kind]
  const thread = kind === 'jean' ? 'var(--thread)' : seam(v)
  // Shadowed gusset so skin never shows between the legs.
  let out = fillPath('M193,516 L207,516 L209,780 L191,780 Z', dark(v, 30)) + panel(d, v, ids)
  if (kind === 'jean') out += `<path d="${d}" fill="url(#${ids.twill})"/>`
  out += folds(ids, ['M150,700 C160,712 176,714 188,708', 'M250,700 C240,712 224,714 212,708', 'M146,840 C160,852 176,852 190,846', 'M254,840 C240,852 224,852 210,846', 'M188,560 C182,640 176,720 172,800', 'M212,560 C218,640 224,720 228,800'], 0.13)

  out += line('M144,424 L256,424', seam(v), 1) + stitch('M146,404 L254,404 M145,419 L255,419', thread)
  for (const x of [160, 186, 214, 240]) out += `<rect x="${x - 2.5}" y="395" width="5" height="31" rx="1" style="fill:${base(v)};stroke:${seam(v)};stroke-width:.6"/>`
  const hemY = kind === 'cargo' ? 888 : kind === 'jean' ? 894 : 898
  out += stitch(`M${kind === 'pleated' ? 118 : 138},${hemY} L${kind === 'pleated' ? 194 : 191},${hemY}`, thread)
  out += stitch(mirror(`M${kind === 'pleated' ? 118 : 138},${hemY} L${kind === 'pleated' ? 194 : 191},${hemY}`), thread)

  if (view === 'front') {
    out += dot(200, 411, 3.6, kind === 'jean' ? '#B07A44' : light(v, 30), `stroke="${seam(v)}" stroke-width=".6"`)
    out += line('M200,424 L200,520', seam(v), 1) + stitch('M207,426 L207,500 C207,512 203,518 199,521', thread)
    if (kind === 'jean') {
      for (const p of pair('M180,426 C178,452 162,466 140,470')) out += line(p, seam(v), 1.2)
      for (const p of pair('M174,426 C172,448 158,460 140,463')) out += stitch(p, thread)
      out += line('M228,428 L230,452 L248,452 L247,428', seam(v), 0.9)
      for (const [x, y] of [[180, 427], [140, 469], [220, 427], [260, 469]]) out += dot(x, y, 1.8, '#B07A44')
    } else {
      for (const p of pair('M156,426 C160,446 166,460 172,470')) out += line(p, seam(v), 1.2)
    }
    if (kind === 'cargo') {
      for (const flip of [false, true]) {
        const m = (p: string) => (flip ? mirror(p) : p)
        out += line(m('M134,572 L168,572 L168,652 L134,652 Z'), seam(v), 1) + stitch(m('M137,576 L165,576 L165,648 L137,648 Z'), thread)
        out += panel(m('M131,562 L171,562 L171,586 L131,586 Z'), v, ids)
        out += snap(flip ? 249 : 151, 576, 2.6)
      }
    }
    if (kind === 'pleated') {
      for (const p of pair('M178,424 C179,450 180,470 181,492')) out += line(p, seam(v), 1)
      for (const p of pair('M188,424 L188,458')) out += line(p, seam(v), 0.9)
      for (const p of pair('M160,500 L156,902')) out += line(p, '#fff', 1.2, 'opacity=".2"')
    }
  } else {
    out += line('M200,424 L200,540', seam(v), 1)
    if (kind === 'jean') {
      for (const p of pair('M146,442 C170,452 190,457 200,459')) out += line(p, seam(v), 1)
      for (const p of pair('M150,462 L188,460 L190,506 L170,516 L152,506 Z')) out += line(p, seam(v), 1) + stitch(p.replace('M150,462', 'M154,466'), thread)
      out += `<rect x="216" y="401" width="26" height="15" rx="1" style="fill:#7B5236"/>`
    } else if (kind === 'cargo') {
      for (const flip of [false, true]) {
        const m = (p: string) => (flip ? mirror(p) : p)
        out += line(m('M152,456 L190,456 L190,504 L152,504 Z'), seam(v), 1)
        out += panel(m('M150,450 L192,450 L192,470 L150,470 Z'), v, ids)
      }
    } else {
      for (const p of pair('M156,456 L188,456')) out += line(p, dark(v, 35), 2)
      for (const x of [172, 228]) out += dot(x, 464, 2.4, light(v, 30))
    }
  }
  return out
}

/* ------------------------------------------------------------------ shoes */

export function drawShoes(style: GarmentStyle, view: View, ids: FigureIds): string {
  const v: ColorVar = '--c-shoes'
  const one = (): string => {
    let s = ''
    if (style === 'boot') {
      const upper = 'M152,856 L190,856 L192,904 C196,914 199,926 199,936 L145,936 C145,924 148,912 151,902 Z'
      s += panel(upper, v, ids)
      s += fillPath('M143,934 L198,934 L198,954 C198,957 196,959 193,959 L148,959 C145,959 143,957 143,954 Z', '#1E1C1A')
      s += line('M145,956 L196,956', '#000', 2, 'stroke-dasharray="3 3" opacity=".6"')
      s += stitch('M147,930 C162,926 182,926 197,930', seam(v))
      if (view === 'front') for (let y = 870; y <= 906; y += 9) s += line(`M162,${y} L182,${y + 2}`, light(v, 30), 1.4)
      else s += `<rect x="166" y="850" width="10" height="12" rx="2" style="fill:${dark(v, 25)}"/>`
      return s
    }
    const top = style === 'hightop' ? 860 : 890
    const upper = `M154,${top} L189,${top} C190,${top + 10} 191,904 191,906 C194,916 197,926 197,936 L147,936 C147,926 150,914 153,904 Z`
    s += panel(upper, v, ids)
    s += fillPath('M145,934 L198,934 L198,948 C198,951 196,953 193,953 L150,953 C147,953 145,951 145,948 Z', '#EFEBE3') + line('M145,941 L198,941', '#cfc9bf', 0.8)
    s += fillPath('M148,926 C156,919 166,919 172,925 C164,931 155,932 148,931 Z', dark(v, 8))
    if (view === 'front') {
      for (let y = top + 8; y <= 912; y += 7) s += line(`M164,${y} L181,${y + 1.5}`, seam(v), 1.2)
      if (style === 'hightop') s += dot(156, 878, 4, light(v, 50), `stroke="${seam(v)}" stroke-width=".6"`)
    } else {
      s += `<rect x="167" y="${top - 4}" width="8" height="12" rx="2" style="fill:${dark(v, 20)}"/>`
    }
    return s
  }
  const left = one()
  return `<g>${left}</g><g transform="translate(400 0) scale(-1 1)">${left}</g>`
}

/* --------------------------------------------------------------- headwear */

export function drawHeadwear(style: GarmentStyle, view: View, ids: FigureIds): string {
  const v: ColorVar = '--c-head'
  if (style === 'beanie') {
    let out = panel('M164,86 C158,26 242,26 236,86 Z', v, ids) + ribLines(176, 224, 50, 70, v, 4)
    out += panel('M161,68 C180,62 220,62 239,68 L241,90 C220,84 180,84 159,90 Z', v, ids, dark(v, 8)) + ribLines(162, 238, 68, 88, v, 4)
    if (view === 'front') out += `<rect x="193" y="72" width="14" height="9" rx="1" style="fill:var(--c-head-ink)"/>`
    return out
  }
  let out = panel('M163,76 C160,36 240,36 237,76 Z', v, ids)
  out += dot(200, 38, 3, dark(v, 12))
  for (const d of ['M200,40 L200,76', 'M181,44 L176,76', 'M219,44 L224,76']) out += line(d, seam(v), 0.8)
  if (view === 'front') {
    out += panel('M158,74 C170,92 230,92 242,74 C226,82 174,82 158,74 Z', v, ids, dark(v, 14))
    out += label(200, 66, 11, 'EG', 'var(--c-head-ink)', 'letter-spacing="1"')
  } else {
    out += fillPath('M184,77 C186,62 214,62 216,77 Z', base('--skin')) + line('M184,76 L216,76', METAL, 2)
  }
  return out
}

export function drawFloor(): string {
  return '<ellipse cx="200" cy="954" rx="118" ry="11" style="fill:#000" opacity=".16"/>'
}
