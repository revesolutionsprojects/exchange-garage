import { useEffect, useRef } from 'react'

/**
 * Behaviour shared by drawers and overlays: Escape to close, body scroll lock,
 * focus moved inside on open (and Tab kept inside), focus restored on close.
 */
export function useDialog<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const el = ref.current
    const focusables = () =>
      el
        ? Array.from(
            el.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'),
          ).filter((n) => n.offsetParent !== null)
        : []
    const first = el?.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0]
    // The panel may still be `visibility: hidden` on its first transition frame, which
    // silently rejects focus — retry briefly until it lands.
    let timer = 0
    const tryFocus = (attempts: number) => {
      first?.focus()
      if (first && document.activeElement !== first && attempts > 0) timer = window.setTimeout(() => tryFocus(attempts - 1), 30)
    }
    tryFocus(10)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
      } else if (e.key === 'Tab') {
        const items = focusables()
        if (!items.length) return
        const [a, b] = [items[0], items[items.length - 1]]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          b.focus()
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [open])

  return ref
}
