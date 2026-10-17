import { ArrowRight, ArrowDown } from 'lucide-react'
import { site } from '../data/site'
import { Link } from '../lib/router'
import { SafeImage } from './SafeImage'

export function Hero({ onScrollNext }: { onScrollNext: () => void }) {
  const { hero } = site
  return (
    <section aria-labelledby="hero-title" className="relative -mt-16 flex min-h-[640px] items-end overflow-hidden bg-ink text-bone h-[calc(100svh-2rem)] max-h-[1100px]">
      <SafeImage
        src={hero.image}
        srcSet={hero.srcSet}
        sizes="100vw"
        alt={hero.imageAlt}
        fetchPriority="high"
        fallbackTone="dark"
        className="absolute inset-0 h-full w-full animate-[hero-in_2.4s_var(--ease-out-expo)_both] object-cover object-[62%_30%]"
      />
      {/* Readability: darken toward the copy, keep the subject bright. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/25" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/10 to-transparent" />

      <div className="relative mx-auto w-full max-w-screen-2xl px-4 pt-32 pb-10 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16">
        <p className="eyebrow animate-fade-up text-bone/75 [animation-delay:200ms]">{hero.eyebrow}</p>
        <h1 id="hero-title" className="display mt-5 text-[clamp(3.4rem,11.5vw,11.5rem)]">
          {hero.headline.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]">
              <span className="block animate-[line-up_1.1s_var(--ease-out-expo)_both]" style={{ animationDelay: `${300 + i * 120}ms` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="animate-fade-up [animation-delay:650ms]">
            <p className="max-w-md text-base text-bone/80 sm:text-lg">{hero.subhead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="btn-light">
                Shop the collection <ArrowRight size={14} />
              </Link>
              <Link to="/shop?filter=new" className="btn-ghost-light">
                Explore new arrivals
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={onScrollNext}
            className="eyebrow hidden animate-fade-up items-center gap-3 text-bone/60 transition-colors [animation-delay:900ms] hover:text-bone lg:inline-flex"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border border-bone/30">
              <ArrowDown size={15} />
            </span>
            Scroll to explore
          </button>
        </div>
      </div>
    </section>
  )
}
