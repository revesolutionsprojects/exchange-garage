import { site } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import { SafeImage } from './SafeImage'

/** Placeholder brand copy — not verified company history. Replace with the client's own story. */
const PILLARS = [
  { n: '01', title: 'Built heavy', body: 'Dense cottons and honest hardware. Garments that hold their shape and earn their wear.' },
  { n: '02', title: 'Cut considered', body: 'Boxy, dropped, relaxed — proportions designed to layer, not just to fit.' },
  { n: '03', title: 'Made to be swapped', body: 'Every piece plays with every other. Mix it, trade it, make it yours.' },
]

export function BrandStory() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} aria-labelledby="story-title" className="mx-auto max-w-screen-2xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand">
            <SafeImage src={site.story.image} alt={site.story.imageAlt} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <p className="eyebrow mt-4 text-ink/45">Fig. 01 — The workshop mindset</p>
        </div>

        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="eyebrow flex items-center gap-3 text-ink/50">
            <span className="text-ink">05</span>
            <span aria-hidden="true" className="h-px w-8 bg-current" />
            Our story
          </p>
          <h2 id="story-title" className="display mt-4 text-[clamp(2.8rem,6.4vw,6rem)]">
            A place to trade ideas, <span className="text-stone">not trends.</span>
          </h2>
          <div className="mt-8 grid max-w-2xl gap-5 text-[15px] leading-relaxed text-ink/70 sm:grid-cols-2">
            <p>
              Every city has one — the garage where things get built, broken down and rebuilt better. That’s where Exchange Garage starts: a workshop mindset applied to
              the clothes you actually live in.
            </p>
            <p>
              The exchange is the point. Swapping fits, sharing references, trading the uniform you were handed for one you made yourself. We make the pieces; you
              decide how they’re worn.
            </p>
          </div>

          <ul className="mt-12 grid gap-px border-y border-ink/10 bg-ink/10 sm:grid-cols-3">
            {PILLARS.map((p) => (
              <li key={p.n} className="bg-bone py-6 sm:px-5 sm:first:pl-0">
                <span className="eyebrow text-signal">{p.n}</span>
                <h3 className="display mt-3 text-2xl">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
