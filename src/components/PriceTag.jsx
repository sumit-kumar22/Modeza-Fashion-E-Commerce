import { cn, currency, percentOff } from '../utils/format'

export default function PriceTag({ price, compareAt, size = 'md', className }) {
  const off = percentOff(price, compareAt)
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span
        className={cn(
          'font-semibold text-gray-900 dark:text-white',
          sizes[size]
        )}
      >
        {currency(price)}
      </span>
      {off > 0 && (
        <>
          <span
            className={cn(
              'text-gray-400 line-through dark:text-gray-500',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}
          >
            {currency(compareAt)}
          </span>
          <span
            className={cn(
              'rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
              size === 'sm' ? 'text-[10px]' : 'text-xs'
            )}
          >
            {off}% off
          </span>
        </>
      )}
    </div>
  )
}