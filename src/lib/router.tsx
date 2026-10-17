/**
 * Minimal hash router: #/path?query. No dependency, and the build works from
 * any static host without rewrite rules.
 */
import { useMemo, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

export interface Route {
  path: string
  segments: string[]
  query: URLSearchParams
}

function parse(hash: string): Route {
  const raw = hash.replace(/^#/, '') || '/'
  const [pathPart, queryPart = ''] = raw.split('?')
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`
  return { path, segments: path.split('/').filter(Boolean), query: new URLSearchParams(queryPart) }
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

const getHash = () => window.location.hash

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash)
  return useMemo(() => parse(hash), [hash])
}

export function navigate(to: string, { replace = false } = {}) {
  const target = `#${to}`
  if (replace) history.replaceState(null, '', target)
  else if (window.location.hash !== target) window.location.hash = to
  if (replace) window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export function buildQuery(params: Record<string, string | undefined | null | false>): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v) q.set(k, v)
  const s = q.toString()
  return s ? `?${s}` : ''
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

export function Link({ to, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    // Re-clicking the current route should still respond (scroll to top).
    if (!e.defaultPrevented && window.location.hash === `#${to}`) window.scrollTo({ top: 0 })
  }
  return <a href={`#${to}`} onClick={handle} {...rest} />
}
