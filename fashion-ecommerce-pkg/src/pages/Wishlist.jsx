import { Link } from 'react-router-dom'
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import EmptyState from '../components/EmptyState'
import Breadcrumb from '../components/Breadcrumb'
import { cn } from '../utils/format'

export default function Wishlist() {
  const { wishlist, products, toggleWishlist, addToCart, isWishlisted } = useShop()

  const items = products.filter((p) => wishlist.includes(p.id))

  if (items.length === 0) {
    return (
      <div className="container-x py-16">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />
        <EmptyState
          icon={<Heart size={34} />}
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it here for later."
          actionLabel="Explore products"
          actionTo="/shop"
        />
      </div>
    )
  }

  return (
    <div className="container-x py-8">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          My Wishlist
          <span className="ml-2 align-middle text-sm font-normal text-gray-400">
            ({items.length} item{items.length > 1 ? 's' : ''})
          </span>
        </h1>
        <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          Saved for later ♥
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => {
          const wished = isWishlisted(product.id)
          return (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
              <button
                type="button"
                aria-label="Remove from wishlist"
                onClick={() => toggleWishlist(product)}
                className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110 dark:bg-gray-800/90"
              >
                <Heart size={16} className={cn(wished && 'fill-brand-600 text-brand-600')} />
              </button>

              <div className="p-4">
                <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                  {product.brand}
                </p>
                <Link
                  to={`/product/${product.id}`}
                  className="mt-0.5 line-clamp-1 text-sm font-semibold text-gray-800 transition hover:text-brand-600 dark:text-gray-100 dark:hover:text-brand-400"
                >
                  {product.name}
                </Link>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      addToCart(product, { size: product.sizes[1], color: product.colors[0].hex })
                    }
                    className="btn-primary !px-4 !py-2 text-xs"
                  >
                    <ShoppingBag size={14} /> Add
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/shop" className="btn-outline">
          <ArrowRight size={16} className="rotate-180" />
          Continue browsing
        </Link>
      </div>
    </div>
  )
}