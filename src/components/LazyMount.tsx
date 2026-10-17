import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Reserved height before mounting, to keep scroll position stable. */
  placeholderClassName?: string
  /** How far ahead of the viewport to start mounting. */
  rootMargin?: string
}

/** Defers rendering heavy, below-the-fold UI until the visitor scrolls near it. */
export function LazyMount({ children, placeholderClassName = '', rootMargin = '800px 0px' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (show || !ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [show, rootMargin])

  if (show) return <>{children}</>
  return <div ref={ref} aria-hidden="true" className={placeholderClassName} />
}
