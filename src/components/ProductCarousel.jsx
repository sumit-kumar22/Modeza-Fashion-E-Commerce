import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../utils/format'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './Skeleton'

export default function ProductCarousel({ title, products, loading, viewAllTo }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <section className="container-x py-12">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (!products?.length) return null

  return (
    <section className="container-x py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-brand-600 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-brand-600 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className={cn(
          'no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:gap-6'
        )}
      >
        {products.map((p) => (
          <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-56 lg:w-60">
            <ProductCard product={p} />
          </div>
        ))}
        {viewAllTo && (
          <a
            href={viewAllTo}
            className="flex w-40 shrink-0 snap-start items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm font-semibold text-gray-400 transition hover:border-brand-500 hover:text-brand-600 dark:border-gray-700"
          >
            View all →
          </a>
        )}
      </div>
    </section>
  )
}