import { useSyncExternalStore } from 'react'

const query = '(hover: hover) and (pointer: fine)'

function subscribe(cb: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', cb)
  return () => mql.removeEventListener('change', cb)
}

/** True on mouse/trackpad devices; false on touch-first devices. */
export function useCanHover(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}
