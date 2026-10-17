export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`display inline-flex items-baseline gap-[0.28em] text-[22px] leading-none tracking-[0.02em] sm:text-[26px] ${className}`}>
      EXCHANGE<span className="text-signal">/</span>GARAGE
    </span>
  )
}
