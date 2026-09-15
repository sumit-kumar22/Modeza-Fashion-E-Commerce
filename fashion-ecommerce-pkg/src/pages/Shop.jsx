import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  PackageSearch,
  Search,
  SlidersHorizontal,
  Tags,
  X,
} from 'lucide-react'
import { useShop } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Breadcrumb from '../components/Breadcrumb'
import { MAX_PRICE, MIN_PRICE } from '../data/products'
import { useDebounce } from '../hooks/useDebounce'
import { cn, currency } from '../utils/format'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'sale', label: 'Biggest Discount' },
]

export default function Shop() {
  const { products } = useShop()
  const [params, setParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [mobileFilters, setMobileFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(() => params.get('search') || '')
  const search = useDebounce(searchInput, 300)

  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE])
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [inStockOnly, setInStockOnly] = useState(false)

  const category = params.get('category') || 'all'
  const brand = params.get('brand') || 'all'
  const sort = params.get('sort') || 'featured'

  const allColors = useMemo(
    () => [...new Map(products.flatMap((p) => p.colors.map((c) => [c.hex, c]))).values()],
    [products]
  )
  const allBrands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  )
  const allSizes = useMemo(
    () => [...new Set(products.flatMap((p) => p.sizes))].sort(),
    [products]
  )

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    let list = [...products]

    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (brand !== 'all') list = list.filter((p) => p.brand === brand)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)))
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.hex)))
    if (inStockOnly) list = list.filter((p) => p.stock > 0)

    switch (sort) {
      case 'newest':
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.rating - a.rating)
        break
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      case 'popularity':
        list.sort((a, b) => b.reviews - a.reviews)
        break
      case 'sale':
        list.sort((a, b) => (b.compareAt || b.price) - b.price - ((a.compareAt || a.price) - a.price))
        break
      default:
        list.sort((a, b) => Number(b.isTrending) - Number(a.isTrending))
    }
    return list
  }, [products, category, brand, search, priceRange, sizes, colors, inStockOnly, sort])

  const activeFilters =
    (category !== 'all' ? 1 : 0) +
    (brand !== 'all' ? 1 : 0) +
    (search ? 1 : 0) +
    sizes.length +
    colors.length +
    (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE ? 1 : 0) +
    (inStockOnly ? 1 : 0)

  const clearAll = () => {
    setSearchInput('')
    setPriceRange([MIN_PRICE, MAX_PRICE])
    setSizes([])
    setColors([])
    setInStockOnly(false)
    setParams({}, { replace: true })
  }

  const resetFilters = () => {
    clearAll()
    setMobileFilters(false)
  }

  const FilterBody = (
    <div className="space-y-7">
      <div>
        <h4 className="mb-3 text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          Category
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'women', label: 'Women' },
            { value: 'men', label: 'Men' },
            { value: 'footwear', label: 'Footwear' },
            { value: 'bags', label: 'Bags' },
            { value: 'accessories', label: 'Accessories' },
          ].map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => updateParam('category', c.value)}
              className={cn(
                'cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition',
                category === c.value
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-brand-400 dark:border-gray-700 dark:text-gray-300'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          Brand
        </h4>
        <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              name="brand"
              checked={brand === 'all'}
              onChange={() => updateParam('brand', 'all')}
              className="h-4 w-4 accent-brand-600"
            />
            All brands
          </label>
          {allBrands.map((b) => (
            <label
              key={b}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="radio"
                name="brand"
                checked={brand === b}
                onChange={() => updateParam('brand', brand === b ? 'all' : b)}
                className="h-4 w-4 accent-brand-600"
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          Price
          <span className="font-medium normal-case text-brand-600">
            {currency(priceRange[0])} – {currency(priceRange[1])}
          </span>
        </h4>
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={10}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-brand-600"
        />
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={10}
          value={priceRange[0]}
          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>{currency(MIN_PRICE)}</span>
          <span>{currency(MAX_PRICE)}</span>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                )
              }
              className={cn(
                'cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-medium transition',
                sizes.includes(s)
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-brand-400 dark:border-gray-700 dark:text-gray-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          Colour
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {allColors.map((c) => {
            const active = colors.includes(c.hex)
            return (
              <button
                key={c.hex}
                type="button"
                title={c.name}
                onClick={() =>
                  setColors((prev) =>
                    prev.includes(c.hex) ? prev.filter((x) => x !== c.hex) : [...prev, c.hex]
                  )
                }
                className={cn(
                  'relative h-8 w-8 cursor-pointer rounded-full border-2 transition hover:scale-110',
                  active ? 'border-gray-900 ring-2 ring-brand-500 ring-offset-2 dark:border-white' : 'border-gray-200 dark:border-gray-600'
                )}
                style={{ backgroundColor: c.hex }}
              >
                {active && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 accent-brand-600"
        />
        In stock only
      </label>
    </div>
  )

  return (
    <div className="container-x py-8">
      <Breadcrumb items={[{ label: 'Shop' }]} />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            {category === 'all' ? 'Shop All' : category.charAt(0).toUpperCase() + category.slice(1)}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {loading ? 'Loading styles…' : `${filtered.length} products`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
              className="input-base w-52 !py-2.5 pl-10 sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileFilters(true)}
            className="btn-outline relative !px-4 !py-2.5 lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <SlidersHorizontal size={15} className="text-brand-600" />
                Filters
              </h3>
              {activeFilters > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="cursor-pointer text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                  Clear all ({activeFilters})
                </button>
              )}
            </div>
            {FilterBody}
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {activeFilters > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400"
                >
                  <X size={13} /> Clear filters ({activeFilters})
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Tags size={15} className="text-gray-400" />
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<PackageSearch size={34} />}
              title="No products found"
              message="Try adjusting your filters or search terms — there’s plenty of good stuff here."
              actionLabel="Reset filters"
              actionTo="/shop"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFilters(false)}
            className="absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-sm animate-fade-in"
          />
          <div className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-2xl animate-slide-in-right dark:bg-gray-950">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                <SlidersHorizontal size={16} className="text-brand-600" /> Filters
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">{FilterBody}</div>

            <div className="flex gap-3 border-t border-gray-100 p-5 dark:border-gray-800">
              <button
                type="button"
                onClick={resetFilters}
                className="btn-outline flex-1"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="btn-primary flex-1"
              >
                Show {loading ? '' : filtered.length} products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}