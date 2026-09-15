import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  Eye,
  Heart,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Ruler,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useShop } from '../context/ShopContext'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import RatingStars from '../components/RatingStars'
import SizeGuideModal from '../components/SizeGuideModal'
import SectionHeading from '../components/SectionHeading'
import Spinner from '../components/Spinner'
import { cn, currency } from '../utils/format'
import { generateReviews } from '../data/reviews'
import { fetchProduct, fetchRecommended } from '../api/products'

export default function ProductDetails() {
  const { id } = useParams()
  const {
    addToCart,
    isWishlisted,
    toggleWishlist,
    addRecentlyViewed,
    products,
  } = useShop()

  const [product, setProduct] = useState(null)
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState(null)
  const [color, setColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeGuide, setSizeGuide] = useState(false)
  const [tab, setTab] = useState('description')
  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)

  useEffect(() => {
    setLoading(true)
    setProduct(null)
    setActiveImage(0)
    setSize(null)
    setColor(null)
    setQuantity(1)
    fetchProduct(id).then((data) => {
      setProduct(data)
      setReviews(generateReviews(Number(id), data?.reviews || 6))
      fetchRecommended(id).then(setRecommended)
      setLoading(false)
      if (data) addRecentlyViewed(data)
      window.scrollTo({ top: 0 })
    })
  }, [id, addRecentlyViewed])

  const similar = useMemo(
    () => (product ? products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4) : []),
    [product, products]
  )

  if (loading) {
    return (
      <div className="container-x flex min-h-[50vh] items-center justify-center py-20">
        <Spinner size={40} className="text-brand-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
          Product not found
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          This item may have sold out or been removed.
        </p>
        <Link to="/shop" className="btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    )
  }

  const wished = isWishlisted(product.id)
  const outOfStock = product.stock <= 0

  const addToBag = () => {
    if (!size) {
      toast.error('Please select a size first')
      return
    }
    addToCart(product, { size, color: color || product.colors[0].hex, quantity })
  }

  const ratingBreakdown = [76, 18, 4, 1, 1]

  return (
    <div className="container-x py-8">
      <Breadcrumb
        items={[
          { label: product.category, to: `/shop?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800">
            <img
              src={product.gallery[activeImage]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                {product.tag}
              </span>
            )}
            <button
              type="button"
              aria-label="Toggle wishlist"
              onClick={() => toggleWishlist(product)}
              className={cn(
                'absolute top-4 right-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-110 dark:bg-gray-800/90',
                wished ? 'text-brand-600' : 'text-gray-600 dark:text-gray-300'
              )}
            >
              <Heart size={19} className={wished ? 'fill-brand-600 text-brand-600' : ''} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  'cursor-pointer overflow-hidden rounded-2xl border-2 transition',
                  activeImage === i
                    ? 'border-brand-600'
                    : 'border-transparent opacity-70 hover:opacity-100'
                )}
              >
                <img src={img} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-brand-600 uppercase dark:text-brand-400">
            {product.brand}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <RatingStars rating={product.rating} size={16} />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {product.rating}
            </span>
            <span className="text-sm text-gray-400">· {product.reviews} reviews</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              {currency(product.price)}
            </span>
            {product.compareAt > product.price && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {currency(product.compareAt)}
                </span>
                <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                  Save {currency(product.compareAt - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
            {product.description}
          </p>

          {/* Colours */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Colour: <span className="font-normal text-gray-500">{color ? product.colors.find((c) => c.hex === color)?.name : product.colors[0]?.name}</span>
            </p>
            <div className="flex gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  title={c.name}
                  onClick={() => setColor(c.hex)}
                  className={cn(
                    'h-9 w-9 cursor-pointer rounded-full border-2 transition hover:scale-110',
                    color === c.hex
                      ? 'border-gray-900 ring-2 ring-brand-500 ring-offset-2 dark:border-white'
                      : 'border-gray-200 dark:border-gray-600'
                  )}
                  style={{ backgroundColor: c.hex }}
                >
                  {color === c.hex && (
                    <span className="flex items-center justify-center text-white drop-shadow">
                      <Check size={14} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Size</p>
              <button
                type="button"
                onClick={() => setSizeGuide(true)}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
              >
                <Ruler size={13} /> Size guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    'cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition',
                    size === s
                      ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                      : 'border-gray-200 text-gray-700 hover:border-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:border-white'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + CTA */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-l-full text-gray-600 transition hover:text-brand-600 disabled:opacity-40 dark:text-gray-300"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm font-bold text-gray-900 dark:text-white">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-r-full text-gray-600 transition hover:text-brand-600 disabled:opacity-40 dark:text-gray-300"
                disabled={quantity >= product.stock}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={addToBag}
              disabled={outOfStock}
              className="btn-primary flex-1 !px-8 !py-3.5"
            >
              <ShoppingBag size={17} />
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </button>
          </div>

          <button
            type="button"
            onClick={addToBag}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <Zap size={16} />
            Buy it now
          </button>

          <p
            className={cn(
              'mt-3 text-sm font-medium',
              outOfStock ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            )}
          >
            {outOfStock ? 'Sold out — check back soon' : `In stock · ${product.stock} available`}
          </p>

          {/* Trust icons */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2.5 rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
              <Truck size={18} className="shrink-0 text-brand-600" />
              <span>Free shipping over $150</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl bg-gray-50 p-3 dark:bg-gray-800">
              <RotateCcw size={18} className="shrink-0 text-brand-600" />
              <span>30-day free returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex gap-1 overflow-x-auto border-b border-gray-100 no-scrollbar dark:border-gray-800">
          {[
            ['description', 'Description'],
            ['fabric', 'Fabric & Care'],
            ['shipping', 'Shipping & Returns'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'shrink-0 cursor-pointer border-b-2 px-5 py-3 text-sm font-semibold transition',
                tab === key
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="max-w-3xl py-8 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {tab === 'description' && (
            <>
              <p>{product.description}</p>
              <p className="mt-3">
                Cut in a regular, body-friendly fit with attention to finishing detail. This piece
                is designed to be styled up or down and pairs naturally with the rest of the{' '}
                {product.brand} collection.
              </p>
            </>
          )}
          {tab === 'fabric' && (
            <ul className="space-y-3">
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">Fabric:</span>{' '}
                {product.fabric}
              </li>
              {product.care?.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-500" /> {c}
                </li>
              ))}
            </ul>
          )}
          {tab === 'shipping' && (
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Truck size={17} className="mt-0.5 shrink-0 text-brand-600" />
                Free standard shipping on all orders over $150. Express delivery available at checkout.
              </li>
              <li className="flex items-start gap-2.5">
                <RotateCcw size={17} className="mt-0.5 shrink-0 text-brand-600" />
                Returns are free within 30 days of delivery. Items must be unworn with tags attached.
              </li>
              <li className="flex items-start gap-2.5">
                <Package size={17} className="mt-0.5 shrink-0 text-brand-600" />
                Orders dispatch within 24 hours and arrive in 2–5 business days.
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-10 border-t border-gray-100 py-10 dark:border-gray-800">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-gray-900 dark:text-white">
              <Eye size={20} className="text-brand-600" /> Ratings & Reviews
            </h2>
            <div className="mt-4 flex items-end gap-3">
              <span className="font-display text-6xl font-bold text-gray-900 dark:text-white">
                {product.rating}
              </span>
              <div className="pb-2">
                <RatingStars rating={product.rating} size={15} />
                <p className="mt-1 text-xs text-gray-400">{product.reviews} verified reviews</p>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {ratingBreakdown.map((pct, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="w-3">{5 - i}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right">{pct}%</span>
                </div>
              ))}
            </div>

            {/* Review form */}
            <div className="mt-8 rounded-2xl border border-gray-100 p-5 dark:border-gray-800">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Write a review</p>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReviewRating(r)}
                    className={cn(
                      'cursor-pointer text-xl transition',
                      r <= reviewRating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'
                    )}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts on fit, fabric and feel…"
                rows={3}
                className="input-base mt-3 resize-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!reviewText.trim()) {
                    toast.error('Please write something first')
                    return
                  }
                  setReviews((r) =>
                    [
                      {
                        id: `mine-${Date.now()}`,
                        name: 'You',
                        rating: reviewRating,
                        title: 'Verified purchase',
                        body: reviewText,
                        date: new Date().toISOString().slice(0, 10),
                      },
                      ...r,
                    ]
                  )
                  setReviewText('')
                  toast.success('Thanks! Review submitted.')
                }}
                className="btn-primary mt-3 w-full !py-2.5 text-xs"
              >
                Submit review
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-gray-100 p-5 transition hover:shadow-md dark:border-gray-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 text-sm font-bold text-white">
                      {r.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.date}</p>
                    </div>
                  </div>
                  <RatingStars rating={r.rating} size={13} />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {r.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-6 border-t border-gray-100 py-10 dark:border-gray-800">
          <SectionHeading
            eyebrow="You may also like"
            title="Similar Products"
            to="/shop"
            linkLabel="Shop all"
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="mt-6 border-t border-gray-100 py-10 dark:border-gray-800">
          <SectionHeading eyebrow="Recommended for you" title="Inspired by This" />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {recommended.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <SizeGuideModal open={sizeGuide} onClose={() => setSizeGuide(false)} />

      <p className="mt-10 text-center text-sm text-gray-400 dark:text-gray-500">
        Browsing as part of the {product.category} collection ·{' '}
        <Link
          to={`/shop?category=${product.category}`}
          className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          See more <ChevronRight size={12} />
        </Link>
      </p>
    </div>
  )
}