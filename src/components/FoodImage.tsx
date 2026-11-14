import { useState } from 'react'
import type { ImageSlug } from '../data/categories'
import { FOOD_IMAGES, IMAGE_SIZES } from '../data/images'
import { t } from '../i18n'

interface Props { slug: ImageSlug; variant: keyof typeof IMAGE_SIZES; priority?: boolean; className?: string }

/** Photo with reserved dimensions, fade-in on load and a labelled fallback if the file is missing. */
export function FoodImage({ slug, variant, priority, className = '' }: Props) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  const [w, h] = IMAGE_SIZES[variant]
  const alt = t.images[slug]
  return (
    <span className={`img ${className}`} data-state={state} style={{ aspectRatio: `${w} / ${h}` }}>
      {state === 'error' ? <span className="img-fallback">{alt}</span> : (
        <img
          src={FOOD_IMAGES[slug][variant]} alt={alt} width={w} height={h}
          loading={priority ? 'eager' : 'lazy'} decoding="async"
          ref={(el) => { if (el?.complete && el.naturalWidth > 0 && state === 'loading') setState('ok') }}
          onLoad={() => setState('ok')} onError={() => setState('error')}
        />
      )}
    </span>
  )
}
