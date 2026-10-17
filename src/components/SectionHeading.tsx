import type { ReactNode } from 'react'

interface Props {
  index?: string
  eyebrow: string
  title: ReactNode
  id?: string
  action?: ReactNode
  tone?: 'light' | 'dark'
}

export function SectionHeading({ index, eyebrow, title, id, action, tone = 'light' }: Props) {
  const muted = tone === 'dark' ? 'text-bone/50' : 'text-ink/50'
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className={`eyebrow flex items-center gap-3 ${muted}`}>
          {index && <span className={tone === 'dark' ? 'text-signal' : 'text-ink'}>{index}</span>}
          {index && <span aria-hidden="true" className="h-px w-8 bg-current" />}
          {eyebrow}
        </p>
        <h2 id={id} className="display mt-4 text-[clamp(2.6rem,6vw,5.2rem)]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}
