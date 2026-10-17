import { ArrowUpRight } from 'lucide-react'
import { products } from '../data/products'
import { categories, categoryImageAlt } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import { Link } from '../lib/router'
import { SafeImage } from './SafeImage'
import { SectionHeading } from './SectionHeading'

export function CategorySection() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} aria-labelledby="categories-title" className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
      <SectionHeading
        id="categories-title"
        index="01"
        eyebrow="Browse by category"
        title="Find your uniform"
        action={
          <Link to="/collection" className="link-underline self-start text-[12px] font-semibold tracking-[0.16em] uppercase sm:self-auto">
            View the full collection
          </Link>
        }
      />

      <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-5">
        {categories.map((c, i) => {
          const count = products.filter((p) => p.category === c.id).length
          return (
            <li
              key={c.id}
              className={`w-[72%] shrink-0 snap-start sm:w-auto ${i < 2 ? 'sm:col-span-3' : 'sm:col-span-2'} lg:col-span-1`}
            >
              <Link to={`/collection?category=${c.id}`} className="group relative block aspect-[3/4] overflow-hidden bg-ink text-bone sm:aspect-[4/5] lg:aspect-[3/4.6]">
                <SafeImage
                  src={c.image}
                  srcSet={c.srcSet}
                  sizes="(min-width: 1024px) 19vw, (min-width: 640px) 48vw, 72vw"
                  alt={categoryImageAlt[c.id]}
                  loading="lazy"
                  fallbackTone="dark"
                  className="h-full w-full object-cover transition-[transform,filter] duration-[1400ms] ease-out-expo grayscale-[35%] group-hover:scale-[1.06] group-hover:grayscale-0"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <span className="eyebrow absolute top-4 left-4 text-bone/70">0{i + 1}</span>
                <span className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-bone text-ink opacity-0 transition-all duration-500 ease-out-expo group-hover:opacity-100 group-focus-visible:opacity-100 scale-75 group-hover:scale-100">
                  <ArrowUpRight size={16} />
                </span>
                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="display text-[2.1rem] sm:text-[2.4rem]">{c.label}</h3>
                  <p className="mt-1 flex items-center justify-between text-[12px] text-bone/70">
                    <span>{c.tagline}</span>
                    <span>{count} styles</span>
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
