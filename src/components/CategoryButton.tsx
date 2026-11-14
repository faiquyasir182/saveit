import { motion } from 'motion/react'
import { MOSAIC, type CategoryId } from '../data/categories'
import { t } from '../i18n'
import { FoodImage } from './FoodImage'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

interface Props { id: CategoryId; active: boolean; onSelect: () => void; animated?: boolean }

/**
 * Circular category. When `animated`, one shared ring slides between buttons (layoutId) and the
 * image scales slightly; reduced-motion users get an instant ring because MotionConfig disables layout/transform animation.
 */
export function CategoryButton({ id, active, onSelect, animated = false }: Props) {
  return (
    <button type="button" className="cat" aria-pressed={active} onClick={onSelect}>
      <span className="cat-wrap" data-static-ring={!animated && active}>
        {animated && active && <motion.span layoutId="cat-ring" className="cat-ring" transition={{ duration: 0.32, ease: EASE_OUT }} />}
        <motion.span className="cat-img" animate={{ scale: animated && active ? 1.06 : 1 }} whileTap={{ scale: 0.94 }} transition={{ duration: 0.2, ease: EASE_OUT }}>
          {id === 'all'
            ? <span className="mosaic">{MOSAIC.map((s) => <FoodImage key={s} slug={s} variant="thumb" priority />)}</span>
            : <FoodImage slug={id} variant="thumb" priority />}
        </motion.span>
      </span>
      <span className="cat-label">{t.categories[id]}</span>
    </button>
  )
}
