import { X } from 'lucide-react'
import { categories } from '../data/site'
import { useDialog } from '../hooks/useDialog'
import { Link } from '../lib/router'
import { Wordmark } from './Wordmark'

interface Props {
  open: boolean
  onClose: () => void
  links: { label: string; to: string }[]
  isActive: (to: string) => boolean
}

export function MobileMenu({ open, onClose, links, isActive }: Props) {
  const ref = useDialog<HTMLDivElement>(open, onClose)

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={`fixed inset-0 z-[60] flex flex-col bg-ink text-bone transition-[opacity,visibility] duration-500 ease-out-expo lg:hidden ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Wordmark className="text-[19px]!" />
        <button type="button" onClick={onClose} aria-label="Close menu" className="-mr-2 grid h-10 w-10 place-items-center" data-autofocus>
          <X size={22} strokeWidth={1.6} />
        </button>
      </div>

      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 pt-6 pb-10 sm:px-6">
        <ul className="space-y-1">
          {links.map((l, i) => (
            <li
              key={l.to}
              className={`transition-[opacity,transform] duration-700 ease-out-expo ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
            >
              <Link
                to={l.to}
                onClick={onClose}
                aria-current={isActive(l.to) ? 'page' : undefined}
                className="display block py-1.5 text-[44px] text-bone/90 transition-colors hover:text-signal aria-[current=page]:text-signal"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 border-t border-bone/10 pt-6">
          <p className="eyebrow text-bone/45">Shop by category</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/shop?category=${c.id}`} onClick={onClose} className="text-bone/75 hover:text-bone">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}
