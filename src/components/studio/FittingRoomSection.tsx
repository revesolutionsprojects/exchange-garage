import { useReveal } from '../../hooks/useReveal'
import { Link } from '../../lib/router'
import { SectionHeading } from '../SectionHeading'
import { FittingRoom } from './FittingRoom'

export function FittingRoomSection() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} aria-labelledby="fitting-title" className="bg-sand">
      <div className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
        <SectionHeading
          id="fitting-title"
          index="03"
          eyebrow="The Fitting Room"
          title={
            <>
              Build the fit.
              <br className="hidden sm:block" /> Test every combo.
            </>
          }
          action={
            <div className="max-w-xs text-sm text-ink/60">
              <p>Dress the model in any top, layer, bottom and shoe. Tap a piece on the model to swap it, then turn it around.</p>
              <Link to="/studio" className="link-underline mt-3 inline-block text-[12px] font-semibold tracking-[0.16em] text-ink uppercase">
                Open full screen
              </Link>
            </div>
          }
        />
        <div className="mt-10">
          <FittingRoom />
        </div>
      </div>
    </section>
  )
}
