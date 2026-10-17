import { ArrowUpRight, Ban, Bookmark, Check, Link2, RotateCcw, RotateCw, Shuffle, X } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  BACKDROPS,
  DEFAULT_STATE,
  encodeState,
  getStudioItem,
  itemsForSlot,
  SLOTS,
  TONES,
  TUCKABLE,
  type LookPick,
  type Slot,
  type StudioState,
} from '../../data/studio'
import { Link } from '../../lib/router'
import { ColorSwatches } from '../ColorSwatches'
import { SafeImage } from '../SafeImage'
import type { View } from './figure'
import { describe, ModelFigure } from './ModelFigure'
import { PropThumb } from './PropThumb'

const SAVED_KEY = 'eg-fitting-room-looks-v1'
const MAX_SAVED = 6

/** Hotspot positions in the figure's 400 × 1000 coordinate space. */
const HOTSPOTS: Record<Slot, { x: number; y: number }> = {
  headwear: { x: 236, y: 52 },
  layer: { x: 116, y: 300 },
  top: { x: 200, y: 340 },
  bottom: { x: 240, y: 640 },
  shoes: { x: 238, y: 922 },
}

interface SavedLook {
  id: string
  state: StudioState
}

function loadSaved(): SavedLook[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    return raw ? (JSON.parse(raw) as SavedLook[]).slice(0, MAX_SAVED) : []
  } catch {
    return []
  }
}

function persistSaved(list: SavedLook[]) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list))
  } catch {
    /* storage unavailable — saved looks last for this visit only */
  }
}

const random = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)]
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Props {
  initial?: StudioState
  /** Slot to open in the picker, e.g. the piece a "Try it on" link points at. */
  initialSlot?: Slot
}

export function FittingRoom({ initial = DEFAULT_STATE, initialSlot = 'top' }: Props) {
  const [state, setState] = useState<StudioState>(initial)
  const [activeSlot, setActiveSlot] = useState<Slot>(initialSlot)
  const [view, setView] = useState<View>('front')
  const [turning, setTurning] = useState(false)
  const [hovered, setHovered] = useState<Slot | null>(null)
  const [saved, setSaved] = useState<SavedLook[]>(loadSaved)
  const [share, setShare] = useState<{ status: 'idle' | 'copied' | 'manual'; url: string }>({ status: 'idle', url: '' })
  const tiltRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)

  useEffect(() => {
    if (share.status !== 'copied') return
    const t = window.setTimeout(() => setShare((s) => ({ ...s, status: 'idle' })), 2200)
    return () => window.clearTimeout(t)
  }, [share.status])

  const { look } = state
  const slotMeta = SLOTS.find((s) => s.id === activeSlot)!
  const activePick = look[activeSlot]
  const activeItem = getStudioItem(activePick?.item)
  const topStyle = getStudioItem(look.top?.item)?.style
  const canTuck = !!topStyle && TUCKABLE.includes(topStyle)
  const backdrop = BACKDROPS.find((b) => b.id === state.backdrop) ?? BACKDROPS[0]

  const setPick = (slot: Slot, pick: LookPick | null) => setState((s) => ({ ...s, look: { ...s.look, [slot]: pick } }))

  const chooseItem = (slot: Slot, itemId: string | null) => {
    if (!itemId) return setPick(slot, null)
    const item = getStudioItem(itemId)!
    const current = look[slot]
    // Keep the same colour when the new piece offers it (e.g. black → black).
    const color = item.colors.find((c) => c.slug === current?.color)?.slug ?? item.colors[0].slug
    setPick(slot, { item: itemId, color })
  }

  const turn = () => {
    if (prefersReducedMotion()) return setView((v) => (v === 'front' ? 'back' : 'front'))
    setTurning(true)
    window.setTimeout(() => {
      setView((v) => (v === 'front' ? 'back' : 'front'))
      setTurning(false)
    }, 200)
  }

  const shuffle = () => {
    const next = { ...look }
    for (const s of SLOTS) {
      if (s.optional && Math.random() < 0.3) {
        next[s.id] = null
        continue
      }
      const item = random(itemsForSlot(s.id))
      next[s.id] = { item: item.id, color: random(item.colors).slug }
    }
    setState((st) => ({ ...st, look: next, tuck: Math.random() < 0.3 }))
  }

  const saveLook = () => {
    const key = encodeState(state)
    if (saved.some((l) => encodeState(l.state) === key)) return
    const next = [{ id: `${Date.now()}`, state }, ...saved].slice(0, MAX_SAVED)
    setSaved(next)
    persistSaved(next)
  }

  const removeSaved = (id: string) => {
    const next = saved.filter((l) => l.id !== id)
    setSaved(next)
    persistSaved(next)
  }

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/studio?${encodeState(state)}`
    try {
      await navigator.clipboard.writeText(url)
      setShare({ status: 'copied', url })
    } catch {
      setShare({ status: 'manual', url })
    }
  }

  const selectFromModel = (slot: Slot) => {
    if (suppressClick.current) return
    setActiveSlot(slot)
  }

  // Drag horizontally on the stage to turn the model.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, moved: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current && Math.abs(e.clientX - drag.current.x) > 60 && !drag.current.moved) {
      drag.current.moved = true
      suppressClick.current = true
      turn()
    }
    if (e.pointerType === 'mouse' && tiltRef.current && !prefersReducedMotion()) {
      const r = e.currentTarget.getBoundingClientRect()
      tiltRef.current.style.setProperty('--tilt', `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`)
    }
  }
  const endDrag = () => {
    drag.current = null
    window.setTimeout(() => (suppressClick.current = false), 0)
  }

  const isSaved = saved.some((l) => encodeState(l.state) === encodeState(state))
  const darkStage = backdrop.dark

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      {/* ------------------------------------------------------------- stage */}
      <div className="min-w-0 lg:col-span-7">
        <div
          className="-mx-4 sm:mx-0 lg:sticky lg:top-24 lg:z-10"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => {
            endDrag()
            tiltRef.current?.style.setProperty('--tilt', '0deg')
          }}
        >
          <div
            className={`relative h-[min(54svh,540px)] touch-pan-y overflow-hidden select-none lg:h-[min(80svh,820px)] ${darkStage ? 'text-bone' : 'text-ink'}`}
            style={{ background: `radial-gradient(120% 90% at 50% 30%, ${backdrop.from}, ${backdrop.to})`, transition: 'background 500ms' }}
          >
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-black/10 to-transparent" />

            <div className="absolute top-4 left-4 z-10 sm:top-5 sm:left-5">
              <p className={`eyebrow ${darkStage ? 'text-bone/60' : 'text-ink/55'}`}>The Fitting Room</p>
              <p className="display mt-1 text-2xl sm:text-3xl" aria-live="polite">
                {view === 'front' ? 'Front' : 'Back'} view
              </p>
            </div>
            <p className={`eyebrow absolute top-5 right-5 z-10 hidden text-[10px] sm:block ${darkStage ? 'text-bone/50' : 'text-ink/45'}`}>
              {hovered ? `Click to change ${SLOTS.find((s) => s.id === hovered)!.label.toLowerCase()}` : 'Drag to turn · tap a piece'}
            </p>

            <div className="absolute inset-0 flex items-end justify-center pt-14 pb-14 [perspective:1200px] sm:pb-16">
              <div ref={tiltRef} className="h-full transition-transform duration-500 ease-out-expo [transform:rotateY(var(--tilt,0deg))] [@media(hover:hover)]:will-change-transform">
                <div className={`relative aspect-[2/5] h-full transition-transform duration-200 ease-in-out ${turning ? 'scale-x-0' : 'scale-x-100'}`}>
                  <ModelFigure look={look} view={view} tone={state.tone} tuck={state.tuck && canTuck} onSlotClick={selectFromModel} onSlotHover={setHovered} className="h-full w-full" />
                  {SLOTS.map((s) => {
                    const pos = HOTSPOTS[s.id]
                    const active = activeSlot === s.id
                    const empty = !look[s.id]
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveSlot(s.id)}
                        aria-label={`${empty ? 'Add' : 'Change'} ${s.label.toLowerCase()}`}
                        aria-pressed={active}
                        className="group/pin absolute z-10 -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${(pos.x / 400) * 100}%`, top: `${(pos.y / 1000) * 100}%` }}
                      >
                        {!active && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-bone/60 [animation-duration:2.4s] motion-reduce:hidden" />}
                        <span
                          className={`relative grid h-6 w-6 place-items-center rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.25)] ring-1 transition-colors sm:h-7 sm:w-7 ${
                            active ? 'bg-signal text-ink ring-ink/20' : 'bg-bone text-ink ring-ink/10 hover:bg-ink hover:text-bone'
                          }`}
                        >
                          <span className="text-[13px] leading-none font-semibold">{empty ? '+' : '•'}</span>
                        </span>
                        <span className="eyebrow pointer-events-none absolute top-1/2 left-full ml-2 -translate-y-1/2 bg-ink px-2 py-1 text-[9px] whitespace-nowrap text-bone opacity-0 transition-opacity group-hover/pin:opacity-100 group-focus-visible/pin:opacity-100">
                          {s.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* stage controls */}
            <div className="absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-3 sm:inset-x-5 sm:bottom-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-5">
                <div role="radiogroup" aria-label="Model tone" className="flex items-center gap-1.5">
                  <span className={`eyebrow mr-1 hidden text-[9px] sm:inline ${darkStage ? 'text-bone/55' : 'text-ink/50'}`}>Model</span>
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={state.tone === t.id}
                      aria-label={`${t.name} model tone`}
                      title={t.name}
                      onClick={() => setState((s) => ({ ...s, tone: t.id }))}
                      className={`h-5 w-5 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] ring-offset-2 transition-shadow ${darkStage ? 'ring-offset-ink' : 'ring-offset-sand'} ${
                        state.tone === t.id ? `ring-[1.5px] ${darkStage ? 'ring-bone' : 'ring-ink'}` : ''
                      }`}
                      style={{ backgroundColor: t.hex }}
                    />
                  ))}
                </div>
                <div role="radiogroup" aria-label="Backdrop" className="flex items-center gap-1.5">
                  <span className={`eyebrow mr-1 hidden text-[9px] sm:inline ${darkStage ? 'text-bone/55' : 'text-ink/50'}`}>Backdrop</span>
                  {BACKDROPS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      role="radio"
                      aria-checked={state.backdrop === b.id}
                      aria-label={`${b.name} backdrop`}
                      title={b.name}
                      onClick={() => setState((s) => ({ ...s, backdrop: b.id }))}
                      className={`h-5 w-5 rounded-[3px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)] ring-offset-2 transition-shadow ${darkStage ? 'ring-offset-ink' : 'ring-offset-sand'} ${
                        state.backdrop === b.id ? `ring-[1.5px] ${darkStage ? 'ring-bone' : 'ring-ink'}` : ''
                      }`}
                      style={{ backgroundColor: b.swatch }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={shuffle} aria-label="Shuffle outfit" title="Shuffle" className="grid h-10 w-10 place-items-center rounded-full bg-bone text-ink shadow-md transition-transform hover:scale-105 active:scale-95">
                  <Shuffle size={16} />
                </button>
                <button type="button" onClick={turn} className="flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[11px] font-semibold tracking-[0.14em] text-bone uppercase shadow-md transition-transform hover:scale-105 active:scale-95">
                  <RotateCw size={14} /> Turn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ picker */}
      <div className="min-w-0 lg:col-span-5">
        <div role="tablist" aria-label="Outfit slots" className="grid grid-cols-5 border-b border-ink/15">
          {SLOTS.map((s) => {
            const item = getStudioItem(look[s.id]?.item)
            const active = activeSlot === s.id
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`slot-tab-${s.id}`}
                aria-selected={active}
                aria-controls="slot-panel"
                onClick={() => setActiveSlot(s.id)}
                className={`relative -mb-px border-b-2 px-1 pt-1 pb-3 text-left transition-colors ${active ? 'border-ink' : 'border-transparent text-ink/50 hover:text-ink'}`}
              >
                <span className="block text-[10px] font-semibold tracking-[0.04em] uppercase sm:text-[11px] sm:tracking-[0.12em]">{s.label}</span>
                <span className="mt-0.5 block truncate text-[11px] text-ink/45">{item ? item.name.split(' ').slice(-1)[0] : 'None'}</span>
              </button>
            )
          })}
        </div>

        <div id="slot-panel" role="tabpanel" aria-labelledby={`slot-tab-${activeSlot}`} className="pt-4 lg:pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="display text-2xl lg:text-3xl">{slotMeta.label}</h3>
            <p className="text-[12px] text-ink/50">{itemsForSlot(activeSlot).length} options</p>
          </div>

          <ul className="no-scrollbar -mx-4 mt-3 flex snap-x scroll-px-4 gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:mt-4 lg:grid-cols-3">
            {slotMeta.optional && (
              <li className="w-[30%] shrink-0 snap-start sm:w-auto">
                <button
                  type="button"
                  aria-pressed={!activePick}
                  onClick={() => chooseItem(activeSlot, null)}
                  className={`flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 border border-dashed text-ink/50 transition-colors ${
                    !activePick ? 'border-ink bg-bone text-ink' : 'border-ink/25 hover:border-ink hover:text-ink'
                  }`}
                >
                  <Ban size={18} strokeWidth={1.5} />
                  <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">None</span>
                </button>
              </li>
            )}
            {itemsForSlot(activeSlot).map((item) => {
              const selected = activePick?.item === item.id
              const color = item.colors.find((c) => c.slug === (selected ? activePick!.color : '')) ?? item.colors[0]
              return (
                <li key={item.id} className="w-[30%] shrink-0 snap-start sm:w-auto">
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseItem(activeSlot, item.id)}
                    className="group block w-full text-left"
                  >
                    <span className={`relative block aspect-[4/5] overflow-hidden bg-bone ring-offset-2 ring-offset-sand transition-shadow ${selected ? 'ring-2 ring-ink' : 'group-hover:ring-1 group-hover:ring-ink/40'}`}>
                      {color.image ? (
                        <SafeImage src={color.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                      ) : (
                        <PropThumb item={item} hex={color.hex} className="h-full w-full" />
                      )}
                      {selected && (
                        <span className="absolute top-1.5 right-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-bone">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </span>
                    <span className="mt-1.5 block text-[12px] leading-tight font-semibold">{item.name}</span>
                    <span className="mt-0.5 block text-[11px] text-ink/45">
                      {item.colors.length} colours{item.productId ? '' : ' · styling prop'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {activeItem && activePick && (
            <div className="mt-6 border-t border-ink/10 pt-5">
              <p className="text-[12px] font-semibold tracking-[0.16em] uppercase">
                Colour — <span className="font-medium tracking-normal text-ink/60 normal-case">{activeItem.colors.find((c) => c.slug === activePick.color)?.name}</span>
              </p>
              <ColorSwatches
                colors={activeItem.colors}
                selected={activePick.color}
                onSelect={(slug) => setPick(activeSlot, { item: activeItem.id, color: slug })}
                productName={activeItem.name}
                size="md"
                className="mt-2 -ml-[6px] gap-1"
              />
            </div>
          )}

          {canTuck && (
            <label className="mt-5 flex cursor-pointer items-center justify-between border-t border-ink/10 pt-5">
              <span className="text-[12px] font-semibold tracking-[0.16em] uppercase">Tuck in top</span>
              <input
                type="checkbox"
                checked={state.tuck}
                onChange={(e) => setState((s) => ({ ...s, tuck: e.target.checked }))}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative h-6 w-11 rounded-full bg-ink/20 transition-colors peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-bone after:shadow after:transition-transform peer-checked:after:translate-x-5"
              />
            </label>
          )}
        </div>

        {/* look summary + actions */}
        <div className="mt-8 bg-bone p-5">
          <div className="flex items-center justify-between">
            <h3 className="eyebrow text-ink/50">In this look</h3>
            <button type="button" onClick={() => setState(DEFAULT_STATE)} className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-ink/50 uppercase hover:text-ink">
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <ul className="mt-3 divide-y divide-ink/10">
            {SLOTS.map((s) => {
              const pick = look[s.id]
              const item = getStudioItem(pick?.item)
              const color = item?.colors.find((c) => c.slug === pick?.color)
              return (
                <li key={s.id} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className="w-[72px] shrink-0 text-[11px] font-semibold tracking-[0.1em] text-ink/45 uppercase">{s.label}</span>
                  {item && color ? (
                    <>
                      <span className="h-3 w-3 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">
                        <span className="font-medium">{item.name}</span> <span className="text-ink/50">· {color.name}</span>
                      </span>
                      {item.productId && (
                        <Link to={`/product/${item.productId}?color=${color.slug}`} className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-semibold tracking-[0.1em] uppercase hover:text-signal" aria-label={`View ${item.name}`}>
                          View <ArrowUpRight size={12} />
                        </Link>
                      )}
                    </>
                  ) : (
                    <span className="flex-1 text-ink/40">—</span>
                  )}
                </li>
              )
            })}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={saveLook} disabled={isSaved} className="btn-dark px-4 py-3.5 disabled:opacity-100 disabled:bg-ink/80">
              {isSaved ? <Check size={14} /> : <Bookmark size={14} />} {isSaved ? 'Saved' : 'Save look'}
            </button>
            <button type="button" onClick={copyLink} className="btn-ghost-dark px-4 py-3.5">
              {share.status === 'copied' ? <Check size={14} /> : <Link2 size={14} />} {share.status === 'copied' ? 'Link copied' : 'Share link'}
            </button>
          </div>
          {share.status === 'manual' && (
            <div className="mt-3">
              <label htmlFor="share-url" className="text-[12px] text-ink/60">
                Copy this link:
              </label>
              <input id="share-url" readOnly value={share.url} onFocus={(e) => e.target.select()} className="mt-1 w-full border border-ink/20 bg-transparent px-3 py-2 text-base sm:text-[12px]" />
            </div>
          )}
          <p className="sr-only" aria-live="polite">
            {share.status === 'copied' ? 'Link copied to clipboard' : ''}
          </p>
        </div>

        {saved.length > 0 && (
          <div className="mt-8">
            <h3 className="eyebrow text-ink/50">Saved looks</h3>
            <ul className="no-scrollbar -mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              {saved.map((l, i) => (
                <li key={l.id} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setState(l.state)}
                    aria-label={`Wear saved look ${i + 1}: ${describe(l.state.look)}`}
                    className="block h-36 w-[72px] overflow-hidden pt-1 ring-offset-2 ring-offset-sand transition-shadow hover:ring-1 hover:ring-ink/40"
                    style={{ background: `linear-gradient(${(BACKDROPS.find((b) => b.id === l.state.backdrop) ?? BACKDROPS[0]).from}, ${(BACKDROPS.find((b) => b.id === l.state.backdrop) ?? BACKDROPS[0]).to})` }}
                  >
                    <ModelFigure look={l.state.look} tone={l.state.tone} tuck={l.state.tuck} className="h-full w-full" title="" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSaved(l.id)}
                    aria-label={`Delete saved look ${i + 1}`}
                    className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-bone hover:bg-signal hover:text-ink"
                  >
                    <X size={11} />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-ink/45">Saved in this browser only.</p>
          </div>
        )}
      </div>
    </div>
  )
}
