import { Menu, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useRoute } from '../lib/router'
import { MobileMenu } from './MobileMenu'
import { SearchOverlay } from './SearchOverlay'
import { Wordmark } from './Wordmark'

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Collection', to: '/collection' },
  { label: 'T-Shirts', to: '/collection?category=tshirts' },
  { label: 'Shirts', to: '/collection?category=shirts' },
  { label: 'Bottoms', to: '/collection?category=bottoms' },
  { label: 'New Arrivals', to: '/collection?filter=new' },
  { label: 'Fitting Room', to: '/studio' },
]

function useIsActive() {
  const route = useRoute()
  const current = route.path + (route.query.toString() ? `?${route.query.toString()}` : '')
  return (to: string) => (to === '/' ? route.path === '/' : current === to)
}

export function Navbar() {
  const route = useRoute()
  const isActive = useIsActive()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close overlays whenever the route changes (adjusting state during render, no effect needed).
  const [lastPath, setLastPath] = useState(route.path)
  if (route.path !== lastPath) {
    setLastPath(route.path)
    setMenuOpen(false)
    setSearchOpen(false)
  }

  const overHero = route.path === '/' && !scrolled && !searchOpen
  const iconBtn = 'relative grid h-10 w-10 place-items-center transition-opacity hover:opacity-70'

  return (
    <>
      <header
        className={`sticky top-0 z-40 text-bone transition-[background-color,border-color] duration-500 ${
          overHero ? 'border-b border-transparent bg-transparent' : 'border-b border-bone/10 bg-ink/[0.97]'
        }`}
      >
        <nav aria-label="Primary" className="mx-auto grid h-16 max-w-screen-2xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-10">
          <div className="flex items-center">
            <button type="button" className={`${iconBtn} -ml-2 lg:hidden`} aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
              <Menu size={20} strokeWidth={1.6} />
            </button>
            <Link to="/" className="hidden lg:block">
              <Wordmark />
            </Link>
          </div>

          <div className="flex justify-center">
          <Link to="/" className="lg:hidden">
            <Wordmark className="text-[19px]!" />
          </Link>
          <ul className="hidden items-center gap-7 xl:gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  aria-current={isActive(l.to) ? 'page' : undefined}
                  className="link-underline text-[12px] font-medium tracking-[0.16em] uppercase opacity-80 transition-opacity hover:opacity-100 aria-[current=page]:opacity-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          </div>

          <div className="flex items-center justify-end gap-1">
            <button type="button" className={`${iconBtn} -mr-2`} aria-label="Search products" aria-expanded={searchOpen} onClick={() => setSearchOpen((v) => !v)}>
              <Search size={19} strokeWidth={1.6} />
            </button>
          </div>
        </nav>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} isActive={isActive} />
    </>
  )
}
