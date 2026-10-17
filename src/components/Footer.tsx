import { categories, site } from '../data/site'
import { Link } from '../lib/router'
import { INFO_PAGES } from '../pages/InfoPage'

const year = new Date().getFullYear()

export function Footer() {
  const col = 'eyebrow text-bone/45'
  const link = 'text-sm text-bone/75 transition-colors hover:text-bone'

  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto max-w-screen-2xl px-4 pt-20 pb-8 sm:px-6 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="display text-4xl">
              Exchange<span className="text-signal">/</span>Garage
            </p>
            <p className="mt-4 max-w-xs text-sm text-bone/55">Streetwear built different, worn your way.</p>
          </div>

          <nav aria-label="Shop" className="lg:col-span-2">
            <h2 className={col}>Shop</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <Link to="/shop" className={link}>
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=new" className={link}>
                  New Arrivals
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/shop?category=${c.id}`} className={link}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Help" className="lg:col-span-2">
            <h2 className={col}>Help</h2>
            <ul className="mt-5 space-y-3">
              {INFO_PAGES.filter((p) => p.group === 'help').map((p) => (
                <li key={p.slug}>
                  <Link to={`/info/${p.slug}`} className={link}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-4">
            <h2 className={col}>Contact</h2>
            <address className="mt-5 space-y-2 text-sm text-bone/60 not-italic">
              <p>{site.contact.email}</p>
              <p>{site.contact.phone}</p>
              <p>{site.contact.address}</p>
              <p>
                Instagram: <span className="text-bone/80">{site.contact.instagram}</span>
              </p>
            </address>
            <p className="mt-4 text-[12px] text-bone/35">Contact details and social links are placeholders until confirmed by Exchange Garage.</p>
          </div>
        </div>

        <p aria-hidden="true" className="display mt-20 overflow-hidden text-center text-[15.5vw] leading-[0.8] whitespace-nowrap text-bone/[0.06] select-none lg:text-[14.2vw]">
          EXCHANGE GARAGE
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-bone/10 pt-6 text-[12px] text-bone/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} EXCHANGE GARAGE. All rights reserved. Showcase site — products shown are placeholders.</p>
          <ul className="flex gap-6">
            {INFO_PAGES.filter((p) => p.group === 'legal').map((p) => (
              <li key={p.slug}>
                <Link to={`/info/${p.slug}`} className="hover:text-bone">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
