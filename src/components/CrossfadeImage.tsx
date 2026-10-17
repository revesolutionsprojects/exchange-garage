import type { CSSProperties } from 'react'
import { SafeImage } from './SafeImage'

export interface ImageLayer {
  id: string
  src: string | undefined
  alt: string
}

interface Props {
  layers: ImageLayer[]
  activeId: string
  className?: string
  imgClassName?: string
  imgStyle?: CSSProperties
  /** Eager-load only above-the-fold images. */
  priority?: boolean
}

/**
 * Stacks every image and fades the active one in. All layers stay mounted, so
 * switching is instant (already decoded) and gets a true crossfade.
 */
export function CrossfadeImage({ layers, activeId, className = '', imgClassName = '', imgStyle, priority = false }: Props) {
  return (
    <div className={`relative ${className}`}>
      {layers.map((layer) => {
        const active = layer.id === activeId
        return (
          <SafeImage
            key={layer.id}
            src={layer.src}
            alt={active ? layer.alt : ''}
            aria-hidden={!active}
            loading={priority ? 'eager' : 'lazy'}
            style={imgStyle}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out-expo ${
              active ? 'opacity-100' : 'opacity-0'
            } ${imgClassName}`}
          />
        )
      })}
    </div>
  )
}
