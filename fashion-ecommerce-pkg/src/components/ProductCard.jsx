import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import { cn } from '../utils/format'
import PriceTag from './PriceTag'
import RatingStars from './RatingStars'

export const TAG_STYLES = {
  bestseller: 'bg-amber-400 text-amber-950',
  trending: 'bg-brand-600 text-white',
  new: 'bg-emerald-500 text-white',
  limited: 'bg-gray-900 text-white dark:bg-white dark:text-gray-900',
  luxury: 'bg-gray-900 text-white dark:bg-white dark:text-gray-900',
  value: 'bg-sky-500 text-white',
  eco: 'bg-lime-500 text-lime-950',
}

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const wished = isWishlisted(product.id)

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900',
        layout === 'list' && 'flex gap-4 sm:gap-6'
      )}
    >
      <Link
        to={`/product/${product.id}`}
        className={cn('relative block overflow-hidden', layout === 'list' ? 'w-32 shrink-0 sm:w-44' : '')}
      >
        <div
          className={cn(
            'w-full overflow-hidden bg-gray-100 dark:bg-gray-800',
            layout === 'grid' ? 'aspect-[4/5]' : 'aspect-square'
          )}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {product.tag && (
          <span
            className={cn(
              'absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm',
              TAG_STYLES[product.tag] || TAG_STYLES.new
            )}
          >
            {product.tag}
          </span>
        )}

        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product)
          }}
          className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm backdrop-blur transition hover:scale-110 hover:text-brand-600 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:text-brand-400"
        >
          <Heart size={16} className={wished ? 'fill-brand-600 text-brand-600' : ''} />
        </button>

        {layout === 'grid' && (
          <div className="absolute inset-x-3 bottom-3 translate-y-14 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                addToCart(product, { size: product.sizes[1], color: product.colors[0].hex })
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gray-900/90 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-brand-600"
            >
              <ShoppingBag size={15} />
              Quick add
            </button>
          </div>
        )}
      </Link>

      <div className={cn('flex flex-col', layout === 'grid' ? 'p-4' : 'flex-1 justify-between py-2 pr-3 sm:py-3 sm:pr-5')}>
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
            {product.brand}
          </p>
          <Link
            to={`/product/${product.id}`}
            className="mt-0.5 line-clamp-2 text-sm font-semibold text-gray-800 transition hover:text-brand-600 dark:text-gray-100 dark:hover:text-brand-400"
          >
            {product.name}
          </Link>
          <div className="mt-1 flex items-center gap-1.5">
            <RatingStars rating={product.rating} size={12} />
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between gap-2">
          <PriceTag price={product.price} compareAt={product.compareAt} size="md" />
          {layout === 'list' && (
            <button
              type="button"
              onClick={() =>
                addToCart(product, { size: product.sizes[1], color: product.colors[0].hex })
              }
              className="btn-primary hidden px-4 py-2 sm:inline-flex"
            >
              <ShoppingBag size={15} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}