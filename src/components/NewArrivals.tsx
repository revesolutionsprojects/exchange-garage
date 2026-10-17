import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { products } from '../data/products'
import { categoryLabel, site } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import { Link } from '../lib/router'
import { SafeImage } from './SafeImage'

const MARQUEE = ['EXCHANGE GARAGE', 'THE LATEST DROP', 'BUILT DIFFERENT', 'WORN YOUR WAY']

function Marquee() {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {MARQUEE.map((t) => (
        <span key={t} className="display flex items-center gap-8 pr-8 text-[clamp(3rem,7vw,6.5rem)] text-transparent [-webkit-text-stroke:1px_rgba(243,240,234,0.35)]">
          {t}
          <span className="h-3 w-3 rounded-full bg-signal" />
        </span>
      ))}
    </div>
  )
  return (
    <div className="flex overflow-hidden border-y border-bone/10 py-5 select-none">
      <div className="flex animate-marquee motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

export function NewArrivals() {
  const ref = useReveal<HTMLDivElement>()
  const latest = products
    .filter((p) => p.isNew)
    .sort((a, b) => b.releaseRank - a.releaseRank)
    .slice(0, 4)

  return (
    <section aria-labelledby="drop-title" className="overflow-hidden bg-ink text-bone">
      <Marquee />
      <div ref={ref} className="mx-auto grid max-w-screen-2xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="relative lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/4.3]">
            <SafeImage src={site.newDrop.image} alt={site.newDrop.imageAlt} loading="lazy" fallbackTone="dark" className="h-full w-full object-cover object-[50%_35%]" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <p className="eyebrow absolute bottom-5 left-5 text-bone/80">Collection 01 — Editorial</p>
          </div>
          <div className="absolute -right-2 -bottom-10 hidden w-[34%] border-[6px] border-ink sm:block lg:-right-12">
            <SafeImage src={site.newDrop.sideImage} alt={site.newDrop.sideImageAlt} loading="lazy" fallbackTone="dark" className="aspect-[3/4] w-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col lg:col-span-5 lg:pl-10">
          <p className="eyebrow flex items-center gap-3 text-bone/50">
            <span className="text-signal">04</span>
            <span aria-hidden="true" className="h-px w-8 bg-current" />
            New arrivals
          </p>
          <h2 id="drop-title" className="display mt-4 text-[clamp(3rem,7vw,6.2rem)]">
            Fresh off <br />
            the line.
          </h2>
          <p className="mt-6 max-w-md text-bone/65">
            Heavier fabrics, wider cuts and a tighter palette. The latest drop is built for layering — pieces that work alone and hit harder together.
          </p>

          <ul className="mt-10 divide-y divide-bone/10 border-y border-bone/10">
            {latest.map((p) => (
              <li key={p.id}>
                <Link to={`/product/${p.id}`} className="group flex items-center gap-4 py-3.5">
                  <SafeImage src={p.colors[0].images[0]} alt="" loading="lazy" className="aspect-[4/5] w-14 shrink-0 bg-sand object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold transition-colors group-hover:text-signal">{p.name}</span>
                    <span className="mt-0.5 block text-[12px] text-bone/45">
                      {categoryLabel(p.category)} · {p.colors.length} colours
                    </span>
                  </span>
                  <ArrowUpRight size={16} className="shrink-0 text-bone/40 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <Link to="/shop?filter=new" className="btn-light mt-10 self-start">
            Shop new arrivals <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
