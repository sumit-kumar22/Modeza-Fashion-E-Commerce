import { Star, StarHalf } from 'lucide-react'
import { cn } from '../utils/format'

export default function RatingStars({ rating = 0, size = 14, className }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.4

  return (
    <div className={cn('flex items-center gap-0.5 text-amber-400', className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
        if (i === full && hasHalf)
          return (
            <span key={i} className="relative inline-flex">
              <Star size={size} className="text-gray-300 dark:text-gray-600" fill="currentColor" strokeWidth={0} />
              <StarHalf
                size={size}
                fill="currentColor"
                strokeWidth={0}
                className="absolute inset-0"
              />
            </span>
          )
        return (
          <Star
            key={i}
            size={size}
            className="text-gray-300 dark:text-gray-600"
            fill="currentColor"
            strokeWidth={0}
          />
        )
      })}
    </div>
  )
}