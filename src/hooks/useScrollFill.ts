import { useEffect, useRef } from 'react'

/**
 * Lights the letters of a wordmark one by one as the visitor scrolls toward the
 * end of the page (starting as the enclosing footer scrolls in). Children marked `data-letter` go from `from` to `to` opacity;
 * the last letter lights exactly when the page reaches the bottom.
 *
 * Only listens to scroll while the element is near the viewport. With reduced
 * motion the letters stay at their resting opacity.
 */
export function useScrollFill<T extends HTMLElement>({ from = 0.06, to = 0.82 } = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const letters = Array.from(el.querySelectorAll<HTMLElement>('[data-letter]'))
    if (!letters.length) return

    let raf = 0
    const update = () => {
      raf = 0
      // Start when the enclosing section (the footer) enters the viewport, so the
      // fill plays out over a comfortable stretch of scrolling.
      const rect = (el.closest('footer, section') ?? el).getBoundingClientRect()
      const doc = document.documentElement
      const start = window.scrollY + rect.top - window.innerHeight
      const end = doc.scrollHeight - window.innerHeight // bottom of the page
      const p = end > start ? Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))) : 1
      // Each letter fades over a short window, staggered across the progress range.
      const n = letters.length
      letters.forEach((letter, i) => {
        const local = Math.min(1, Math.max(0, p * (n + 2) - i - 1))
        letter.style.opacity = String(from + (to - from) * local)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    let listening = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !listening) {
          listening = true
          window.addEventListener('scroll', onScroll, { passive: true })
          window.addEventListener('resize', onScroll)
          update()
        } else if (!entry.isIntersecting && listening) {
          listening = false
          window.removeEventListener('scroll', onScroll)
          window.removeEventListener('resize', onScroll)
        }
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [from, to])

  return ref
}
