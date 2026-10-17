import { useState, type ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Tone of the fallback panel shown if the image fails to load. */
  fallbackTone?: 'light' | 'dark'
}

/** <img> that swaps to a branded placeholder panel if the source is missing or fails. */
export function SafeImage({ src, alt = '', className = '', fallbackTone = 'light', ...rest }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = !src || failedSrc === src

  if (failed) {
    return <ImageFallback alt={alt} tone={fallbackTone} className={className} />
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} decoding="async" {...rest} />
}

export function ImageFallback({ alt, tone = 'light', className = '' }: { alt: string; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <div
      role="img"
      aria-label={alt ? `${alt} (image unavailable)` : 'Image unavailable'}
      className={`flex flex-col items-center justify-center gap-2 ${tone === 'dark' ? 'bg-ink-3 text-bone/40' : 'bg-sand text-ink/35'} ${className}`}
    >
      <span className="display text-3xl">EG</span>
      <span className="eyebrow text-[9px]">Image unavailable</span>
    </div>
  )
}
