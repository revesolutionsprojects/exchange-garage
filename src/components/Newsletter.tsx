import { ArrowRight, Check } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { site } from '../data/site'
import { SafeImage } from './SafeImage'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Frontend-only demo: validates the address and shows a confirmation, but
 * nothing is sent or stored. Wire `onSubmit` to the client's email provider later.
 */
export function Newsletter() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<string | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) return setError('Enter your email address.')
    if (!EMAIL_RE.test(value)) return setError('That doesn’t look like a valid email — check for typos.')
    setError(null)
    setSubmitted(value)
  }

  return (
    <section aria-labelledby="newsletter-title" className="cv-auto relative overflow-hidden bg-ink text-bone">
      <SafeImage src={site.newsletter.image} srcSet={site.newsletter.srcSet} sizes="100vw" alt="" loading="lazy" fallbackTone="dark" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

      <div className="relative mx-auto grid max-w-screen-2xl gap-10 px-4 py-24 sm:px-6 sm:py-28 lg:grid-cols-2 lg:items-end lg:px-10">
        <div>
          <p className="eyebrow text-bone/55">06 — The list</p>
          <h2 id="newsletter-title" className="display mt-4 text-[clamp(3rem,7vw,6.5rem)]">
            Get on <br /> the list.
          </h2>
          <p className="mt-5 max-w-sm text-bone/65">Early access to drops, restocks and the occasional garage sale. No noise.</p>
        </div>

        <div className="lg:pb-3">
          {submitted ? (
            <div role="status" className="animate-fade-up border border-bone/20 bg-ink/60 p-6 backdrop-blur">
              <p className="flex items-center gap-3 font-semibold">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-signal text-ink">
                  <Check size={16} strokeWidth={2.4} />
                </span>
                You’re on the list — in theory.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-bone/65">
                <span className="text-bone">{submitted}</span> passed validation. This is a demo storefront, so the address wasn’t sent to a mailing list or stored anywhere.
              </p>
              <button type="button" onClick={() => (setSubmitted(null), setEmail(''))} className="mt-5 text-[11px] font-semibold tracking-[0.16em] text-bone/60 uppercase underline-offset-4 hover:text-bone hover:underline">
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <label htmlFor={id} className="eyebrow text-bone/60">
                Email address
              </label>
              <div className={`mt-3 flex border-b-2 transition-colors ${error ? 'border-signal' : 'border-bone/40 focus-within:border-bone'}`}>
                <input
                  id={id}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError(null)
                  }}
                  placeholder="you@example.com"
                  aria-invalid={!!error}
                  aria-describedby={error ? `${id}-error` : `${id}-hint`}
                  className="min-w-0 flex-1 bg-transparent py-4 text-lg outline-none placeholder:text-bone/30"
                />
                <button type="submit" className="flex shrink-0 items-center gap-2 pl-4 text-[12px] font-semibold tracking-[0.18em] uppercase transition-colors hover:text-signal">
                  Join <ArrowRight size={14} />
                </button>
              </div>
              {error ? (
                <p id={`${id}-error`} role="alert" className="mt-3 text-sm text-signal">
                  {error}
                </p>
              ) : (
                <p id={`${id}-hint`} className="mt-3 text-[12px] text-bone/45">
                  Demo form — nothing is sent or stored.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
