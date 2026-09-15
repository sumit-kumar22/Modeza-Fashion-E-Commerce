import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Tag, X } from 'lucide-react'
import { useState } from 'react'
import { useShop } from '../context/ShopContext'
import EmptyState from '../components/EmptyState'
import PriceTag from '../components/PriceTag'
import Breadcrumb from '../components/Breadcrumb'
import { currency } from '../utils/format'

export default function Cart() {
  const {
    cartDetailed,
    updateQuantity,
    removeFromCart,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    shipping,
    freeShipping,
    total,
    clearCart,
  } = useShop()
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  if (cartDetailed.length === 0) {
    return (
      <div className="container-x py-16">
        <Breadcrumb items={[{ label: 'Cart' }]} />
        <EmptyState
          icon={<ShoppingBag size={34} />}
          title="Your cart is empty"
          message="Looks like you haven’t added anything yet. Let’s change that."
          actionLabel="Start shopping"
          actionTo="/shop"
        />
      </div>
    )
  }

  const onSubmitCoupon = (e) => {
    e.preventDefault()
    if (!applyCoupon(code)) {
      /* toast shown in context */
    }
    setCode('')
  }

  return (
    <div className="container-x py-8">
      <Breadcrumb items={[{ label: 'Cart' }]} />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          Shopping Cart
          <span className="ml-2 align-middle text-sm font-normal text-gray-400">
            ({cartDetailed.length} items)
          </span>
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="cursor-pointer text-sm font-semibold text-gray-400 transition hover:text-rose-600"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-4">
          {cartDetailed.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 rounded-2xl border border-gray-100 p-4 transition hover:shadow-md sm:gap-5 dark:border-gray-800"
            >
              <Link to={`/product/${item.productId}`} className="shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-28 w-24 rounded-xl object-cover sm:h-32 sm:w-28"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                      {item.product.brand}
                    </p>
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-sm font-semibold text-gray-900 transition hover:text-brand-600 sm:text-base dark:text-white dark:hover:text-brand-400"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {item.size && (
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
                          Size {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="flex items-center gap-1">
                          <span
                            className="inline-block h-3 w-3 rounded-full border border-gray-200 dark:border-gray-600"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.product.colors.find((c) => c.hex === item.color)?.name}
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    className="cursor-pointer rounded-full p-2 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      aria-label="Decrease"
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                      }
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-l-full text-gray-500 transition hover:text-brand-600 disabled:opacity-40 dark:text-gray-300"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase"
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                      }
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-r-full text-gray-500 transition hover:text-brand-600 disabled:opacity-40 dark:text-gray-300"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <PriceTag
                    price={item.product.price * item.quantity}
                    compareAt={item.product.compareAt * item.quantity}
                    size="lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-gray-100 bg-gray-50 p-6 lg:sticky lg:top-28 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
            Order Summary
          </h2>

          {/* Coupon */}
          <form onSubmit={onSubmitCoupon} className="mt-5">
            {coupon ? (
              <div className="flex items-center justify-between rounded-2xl bg-brand-600/10 px-4 py-3">
                <p className="flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-300">
                  <Tag size={15} /> {coupon.code} applied
                </p>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="cursor-pointer text-xs font-semibold text-brand-700 underline dark:text-brand-300"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="input-base uppercase"
                />
                <button type="submit" className="btn-outline shrink-0 !px-4">
                  Apply
                </button>
              </div>
            )}
            <p className="mt-2 text-[11px] text-gray-400">
              Try <button type="button" onClick={() => applyCoupon('WELCOME20')} className="cursor-pointer font-semibold text-brand-600 hover:underline">WELCOME20</button>{' '}
              or{' '}
              <button type="button" onClick={() => applyCoupon('STYLE15')} className="cursor-pointer font-semibold text-brand-600 hover:underline">STYLE15</button> — more in{' '}
              <Link to="/offers" className="font-semibold text-brand-600 hover:underline">
                Offers
              </Link>
            </p>
          </form>

          <div className="mt-5 space-y-3 border-t border-gray-200 pt-5 text-sm dark:border-gray-700">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-white">{currency(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon discount</span>
                <span className="font-semibold">−{currency(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {freeShipping ? 'FREE' : shipping === 0 ? 'Free' : currency(shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-dashed border-gray-200 pt-4 text-lg dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <span className="font-display font-bold text-gray-900 dark:text-white">
                {currency(total)}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            {freeShipping ? '🎉 Free shipping unlocked' : subtotal - couponDiscount < 150 && subtotal - couponDiscount > 0 ? (
              <span>
                Add <strong>{currency(150 - (subtotal - couponDiscount))}</strong> more for free
                shipping.
              </span>
            ) : 'You’ve unlocked free shipping!'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="btn-primary mt-6 w-full !py-3.5"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>

          <Link
            to="/offers"
            className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
          >
            <Tag size={13} /> Browse coupons & offers
          </Link>

          <Link
            to="/shop"
            className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={13} /> Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}