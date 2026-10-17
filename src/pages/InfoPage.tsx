import { ArrowLeft } from 'lucide-react'
import { site } from '../data/site'
import { Link } from '../lib/router'
import { NotFoundPage } from './NotFoundPage'

interface InfoPageDef {
  slug: string
  title: string
  group: 'help' | 'legal'
  intro: string
  sections: { heading: string; body: string }[]
}

/**
 * Placeholder policy pages so footer links resolve to real destinations.
 * All wording must be replaced with the client's confirmed policies.
 */
export const INFO_PAGES: InfoPageDef[] = [
  {
    slug: 'shipping',
    title: 'Shipping',
    group: 'help',
    intro: 'Delivery options, timelines and costs will be listed here once confirmed.',
    sections: [
      { heading: 'Delivery areas', body: 'To be supplied by Exchange Garage — e.g. which cities and pin codes are served.' },
      { heading: 'Timelines & charges', body: 'To be supplied — processing times, courier partners and any free-shipping threshold.' },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns & Exchanges',
    group: 'help',
    intro: 'The returns and exchange policy will be published here.',
    sections: [
      { heading: 'Eligibility', body: 'To be supplied — return window, item condition and any exclusions.' },
      { heading: 'How to start a return', body: 'To be supplied — the process and contact channel for returns and size exchanges.' },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    group: 'help',
    intro: 'Contact channels are placeholders until Exchange Garage confirms them.',
    sections: [
      { heading: 'Email', body: site.contact.email },
      { heading: 'Phone', body: site.contact.phone },
      { heading: 'Studio', body: site.contact.address },
      { heading: 'Instagram', body: site.contact.instagram },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    group: 'legal',
    intro: 'The privacy policy will be published here before launch.',
    sections: [
      { heading: 'In this demo', body: 'This showcase site has no backend. Looks you save in the Fitting Room stay in this browser’s local storage, and the newsletter form does not send or store anything.' },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms',
    group: 'legal',
    intro: 'Terms of sale and use will be published here before launch.',
    sections: [{ heading: 'In this demo', body: 'This is a showcase site. Products shown are placeholders and nothing can be purchased.' }],
  },
]

export function InfoPage({ slug }: { slug: string }) {
  const page = INFO_PAGES.find((p) => p.slug === slug)
  if (!page) return <NotFoundPage />

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link to="/" className="eyebrow inline-flex items-center gap-2 text-ink/50 hover:text-ink">
        <ArrowLeft size={14} /> Home
      </Link>
      <h1 className="display mt-6 text-[clamp(3rem,8vw,5.5rem)]">{page.title}</h1>
      <p className="mt-5 inline-block bg-sand px-3 py-2 text-[12px] font-medium text-ink/70">Placeholder page — content to be supplied by Exchange Garage.</p>
      <p className="mt-8 text-lg text-ink/70">{page.intro}</p>
      <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        {page.sections.map((s) => (
          <div key={s.heading} className="grid gap-2 py-5 sm:grid-cols-3">
            <dt className="eyebrow pt-0.5 text-ink/50">{s.heading}</dt>
            <dd className="text-[15px] text-ink/80 sm:col-span-2">{s.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
