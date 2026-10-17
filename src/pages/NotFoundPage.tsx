import { ArrowRight } from 'lucide-react'
import { Link } from '../lib/router'

export function NotFoundPage({ title = 'Page not found', message = 'This page doesn’t exist — it may have moved, or the link is out of date.' }) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-screen-2xl flex-col items-start justify-center px-4 py-24 sm:px-6 lg:px-10">
      <p className="eyebrow text-ink/45">Error 404</p>
      <h1 className="display mt-4 text-[clamp(3.5rem,10vw,8rem)]">{title}</h1>
      <p className="mt-5 max-w-md text-ink/60">{message}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/shop" className="btn-dark">
          Shop all <ArrowRight size={14} />
        </Link>
        <Link to="/" className="btn-ghost-dark">
          Back home
        </Link>
      </div>
    </section>
  )
}
