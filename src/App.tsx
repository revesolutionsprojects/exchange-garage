import { useEffect } from 'react'
import { AnnouncementBar } from './components/AnnouncementBar'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { site } from './data/site'
import { useRoute, type Route } from './lib/router'
import { HomePage } from './pages/HomePage'
import { InfoPage } from './pages/InfoPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductPage } from './pages/ProductPage'
import { ShopPage } from './pages/ShopPage'
import { StudioPage } from './pages/StudioPage'

function Page({ route }: { route: Route }) {
  const [section, param] = route.segments
  if (!section) return <HomePage />
  if (section === 'shop') return <ShopPage route={route} />
  if (section === 'product' && param) return <ProductPage key={param} id={param} initialColor={route.query.get('color')} />
  if (section === 'studio') return <StudioPage route={route} />
  if (section === 'info' && param) return <InfoPage slug={param} />
  return <NotFoundPage />
}

export default function App() {
  const route = useRoute()

  // New page → start at the top. Query-only changes (filters, colour) keep the scroll position.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [route.path])

  return (
    <>
      <a href="#main" onClick={(e) => (e.preventDefault(), document.getElementById('main')?.focus())} className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-signal focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <AnnouncementBar messages={site.announcements} />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Page route={route} />
      </main>
      <Footer />
    </>
  )
}
