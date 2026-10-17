import { FittingRoom } from '../components/studio/FittingRoom'
import { decodeState, SLOTS } from '../data/studio'
import type { Route } from '../lib/router'

export function StudioPage({ route }: { route: Route }) {
  // Read the look from the link once; later edits stay local until shared again.
  const initial = decodeState(route.query)
  // A "Try it on" link names one piece — open the picker on that slot.
  const named = SLOTS.filter((s) => route.query.has(s.key))
  const initialSlot = named.length === 1 ? named[0].id : undefined
  return (
    <div className="bg-sand">
      <div className="mx-auto max-w-screen-2xl px-4 pt-10 pb-24 sm:px-6 sm:pt-14 lg:px-10">
        <header className="mb-8 flex flex-col gap-4 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-ink/45">Exchange Garage — Interactive styling</p>
            <h1 className="display mt-3 text-[clamp(3.2rem,8vw,6.5rem)]">The Fitting Room</h1>
          </div>
          <p className="max-w-sm text-sm text-ink/60">
            Pick a piece for each slot, switch colours, tuck it in, turn the model and save the looks you like. Share a link to send a fit to someone else.
          </p>
        </header>
        <FittingRoom key={route.query.toString()} initial={initial} initialSlot={initialSlot} />
      </div>
    </div>
  )
}
