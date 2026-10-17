import { useEffect, useRef } from 'react'

/**
 * Adds `.reveal` / `.is-visible` to the element as it scrolls into view.
 *
 * The observer's first (async) callback tells us where the element starts, so
 * we never force a synchronous layout on mount. Elements that start on screen
 * or above it are left visible; only those below the fold are hidden and
 * revealed later.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    let first = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) return io.disconnect()
          el.classList.add('reveal')
          return
        }
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
