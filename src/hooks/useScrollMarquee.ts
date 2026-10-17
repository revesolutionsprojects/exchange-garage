import { useEffect, useRef } from 'react'

/**
 * Drives an infinite marquee from scroll velocity: it drifts slowly on its
 * own, speeds up while the page scrolls, and flips direction when the visitor
 * scrolls back up. The track must contain two identical halves.
 *
 * Runs only while the marquee is on screen, and not at all with reduced motion
 * (the track then stays still).
 */
export function useScrollMarquee<T extends HTMLElement>({ secondsPerLoop = 38, boost = 0.9 } = {}) {
  const trackRef = useRef<T>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let x = 0
    let speed = 0 // px/s, signed: negative moves left
    let dir = -1
    let lastY = window.scrollY
    let lastT = performance.now()
    let scrollVel = 0 // px/s from the most recent scroll
    let raf = 0
    let visible = false

    const onScroll = () => {
      const now = performance.now()
      const dy = window.scrollY - lastY
      const dt = Math.max(16, now - lastT)
      if (dy !== 0) dir = dy > 0 ? -1 : 1
      scrollVel = Math.min(4000, Math.abs(dy) / (dt / 1000))
      lastY = window.scrollY
      lastT = now
    }

    let prev = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      const half = track.scrollWidth / 2
      if (half > 0) {
        const base = half / secondsPerLoop
        const target = dir * (base + scrollVel * boost)
        // Ease toward the target speed so changes feel weighty, not twitchy.
        speed += (target - speed) * Math.min(1, dt * 6)
        scrollVel *= Math.pow(0.04, dt) // scroll boost decays within ~1s of stopping
        x += speed * dt
        if (x <= -half) x += half
        if (x > 0) x -= half
        track.style.transform = `translate3d(${x}px, 0, 0)`
      }
      if (visible) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) {
        prev = performance.now()
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(tick)
      }
    })
    io.observe(track)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [secondsPerLoop, boost])

  return trackRef
}
