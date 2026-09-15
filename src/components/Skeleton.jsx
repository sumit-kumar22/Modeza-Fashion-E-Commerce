import { Heart } from 'lucide-react'

export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
      <div className="aspect-[4/5] flex items-center justify-center bg-gray-200 dark:bg-gray-700">
        <Heart className="text-gray-300 dark:text-gray-600" size={28} />
      </div>
      <div className="space-y-2 p-4">
        <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}