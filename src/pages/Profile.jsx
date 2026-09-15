import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  BaggageClaim,
  Heart,
  LogOut,
  Package,
  PartyPopper,
  Settings,
  ShoppingBag,
  User as UserIcon,
} from 'lucide-react'
import { useShop } from '../context/ShopContext'
import { cn, currency } from '../utils/format'
import Breadcrumb from '../components/Breadcrumb'
import EmptyState from '../components/EmptyState'

const TABS = [
  { id: 'overview', label: 'Overview', icon: UserIcon },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Profile() {
  const { user, logout, orders, wishlist, products, toggleWishlist, addToCart } = useShop()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') || 'overview')

  useEffect(() => {
    const fromParam = params.get('tab')
    if (fromParam && TABS.some((t) => t.id === fromParam)) setTab(fromParam)
  }, [params])

  useEffect(() => {
    if (!user) navigate('/auth', { replace: true })
  }, [user, navigate])

  if (!user) return null

  const wishItems = products.filter((p) => wishlist.includes(p.id))
  const placedOrder = location.state?.order

  return (
    <div className="container-x py-8">
      <Breadcrumb items={[{ label: 'My Account' }]} />

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-2xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              Hi, {user.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email} · Member since{' '}
              {new Date(user.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="btn-outline !px-5 !py-2.5 text-sm"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>

      {placedOrder && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 animate-fade-up dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <PartyPopper className="shrink-0 text-emerald-600 dark:text-emerald-400" size={24} />
          <div>
            <p className="font-bold text-emerald-700 dark:text-emerald-300">
              Order {placedOrder.id} placed successfully!
            </p>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
              We’ve emailed your receipt to {user.email}. Track it below.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Tabs */}
        <aside>
          <div className="flex gap-1 overflow-x-auto rounded-3xl border border-gray-100 p-2 no-scrollbar lg:flex-col lg:border-0 lg:p-0 dark:border-gray-800">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex shrink-0 cursor-pointer items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  tab === t.id
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                )}
              >
                <t.icon size={16} />
                {t.label}
                {t.id === 'orders' && (
                  <span className={cn('ml-auto rounded-full px-1.5 text-[10px] font-bold', tab === t.id ? 'bg-white/25' : 'bg-gray-100 dark:bg-gray-800')}>
                    {orders.length}
                  </span>
                )}
                {t.id === 'wishlist' && (
                  <span className={cn('ml-auto rounded-full px-1.5 text-[10px] font-bold', tab === t.id ? 'bg-white/25' : 'bg-gray-100 dark:bg-gray-800')}>
                    {wishItems.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div>
          {tab === 'overview' && (
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Package, label: 'Total orders', value: orders.length, to: null },
                { icon: Heart, label: 'Wishlist items', value: wishItems.length, to: null },
                { icon: ShoppingBag, label: 'Continue shopping', value: 'Last drop', to: '/shop' },
              ].map((s) => (
                <Link
                  key={s.label}
                  to={s.to || '#'}
                  className="flex items-center gap-4 rounded-3xl border border-gray-100 p-5 transition hover:shadow-lg dark:border-gray-800"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    <s.icon size={20} />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="mb-5 font-display text-xl font-bold text-gray-900 dark:text-white">
                My Orders
              </h2>
              {orders.length === 0 ? (
                <EmptyState
                  icon={<BaggageClaim size={34} />}
                  title="No orders yet"
                  message="When you place an order, it will show up here with live tracking."
                  actionLabel="Start shopping"
                  actionTo="/shop"
                />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-3xl border border-gray-100 p-5 transition hover:shadow-lg dark:border-gray-800"
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            Order #{order.id}
                          </p>
                          <p className="text-xs text-gray-400">
                            Placed {new Date(order.placedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            ✓ Delivered
                          </span>
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            {order.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {order.items.slice(0, 4).map((item, i) => (
                          <img
                            key={i}
                            src={products.find((p) => p.id === item.productId)?.image}
                            alt={item.name}
                            className="h-16 w-14 rounded-xl object-cover"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        ))}
                        <div className="ml-auto text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {currency(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div>
              <h2 className="mb-5 font-display text-xl font-bold text-gray-900 dark:text-white">
                My Wishlist
              </h2>
              {wishItems.length === 0 ? (
                <EmptyState
                  icon={<Heart size={34} />}
                  title="Wishlist is empty"
                  message="Tap the heart icon on any product to save it here."
                  actionLabel="Discover products"
                  actionTo="/shop"
                />
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {wishItems.map((product) => (
                    <div key={product.id} className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
                      <Link to={`/product/${product.id}`}>
                        <div className="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                      <button
                        type="button"
                        aria-label="Remove from wishlist"
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-2 right-2 cursor-pointer rounded-full bg-white/90 p-1.5 text-brand-600 shadow-sm dark:bg-gray-800/90"
                      >
                        <Heart size={14} className="fill-brand-600 text-brand-600" />
                      </button>
                      <div className="p-3">
                        <p className="line-clamp-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {product.name}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {currency(product.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(product, { size: product.sizes[1], color: product.colors[0].hex })}
                            className="cursor-pointer rounded-full bg-gray-900 p-1.5 text-white transition hover:bg-brand-600 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-brand-500 dark:hover:text-white"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'settings' && (
            <div className="max-w-md space-y-6">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                Profile Settings
              </h2>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Full name
                </label>
                <input
                  defaultValue={user.name}
                  className="input-base"
                  onBlur={() => toast.success('Name updated')}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input defaultValue={user.email} className="input-base" disabled />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  New password
                </label>
                <input type="password" placeholder="••••••••" className="input-base" />
              </div>
              <button
                type="button"
                onClick={() => toast.success('Settings saved')}
                className="btn-primary"
              >
                Save changes
              </button>
              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
                <strong>Membership perk:</strong> you automatically earn 1 reward point for every
                $1 spent.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}