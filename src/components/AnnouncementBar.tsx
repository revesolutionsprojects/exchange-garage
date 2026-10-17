import { useEffect, useState } from 'react'

interface Props {
  messages: string[]
  /** Milliseconds between messages when more than one is configured. */
  interval?: number
}

export function AnnouncementBar({ messages, interval = 4500 }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (messages.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), interval)
    return () => window.clearInterval(t)
  }, [messages.length, interval])

  if (!messages.length) return null

  return (
    <div className="relative z-50 bg-ink text-bone">
      <p className="eyebrow mx-auto flex h-8 max-w-screen-2xl items-center justify-center overflow-hidden px-4 text-center text-[10px] text-bone/85">
        <span key={index} className="animate-fade-up truncate">
          {messages[index]}
        </span>
      </p>
    </div>
  )
}
