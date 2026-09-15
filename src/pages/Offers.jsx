import { Link } from 'react-router-dom'
import { BadgePercent, Copy, Gift, ShieldCheck, Tag, Truck, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useShop } from '../context/ShopContext'
import Breadcrumb from '../components/Breadcrumb'
import { cn, currency } from '../utils/format'

export default function Offers() {
  const { coupons, applyCoupon, coupon, removeCoupon } = useShop()

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {})
    toast.success(`Code ${code} copied!`)
  }

  return (
    <div className="container-x py-8">
      <Breadcrumb items={[{ label: 'Offers & Coupons' }]} />

      <div className="mb-10 max-w-2xl">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase dark:text-brand-400">
          <BadgePercent size={14} /> Save more
        </p>
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          Offers & Coupons
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Stack the savings. Copy any code below, or apply it straight to your cart from here.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => {
          const isActive = coupon?.code === c.code
          return (
            <div
              key={c.code}
              className={cn(
                'group relative overflow-hidden rounded-3xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900',
                isActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-gray-100 dark:border-gray-800'
              )}
            >
              <div
                className={cn(
                  'absolute -top-8 -right-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-10 blur-0',
                  c.color
                )}
              />
              <div className={cn('h-14 w-14 rounded-2xl bg-gradient-to-br text-white shadow-lg flex items-center justify-center', c.color)}>
                {c.type === 'shipping' ? <Truck size={22} /> : c.type === 'flat' ? <Gift size={22} /> : <Tag size={22} />}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className={cn('font-display text-2xl font-bold text-gray-900 dark:text-white')}>
                    {c.type === 'shipping' ? 'FREE' : c.type === 'flat' ? `$${c.value}` : `${c.value}%`}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyCode(c.code)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-brand-600 hover:text-white dark:bg-gray-800"
                  aria-label={`Copy ${c.code}`}
                >
                  <Copy size={15} />
                </button>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {c.description}
                {c.minOrder > 0 && ` Minimum order ${currency(c.minOrder)}.`}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <code className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold tracking-widest text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {c.code}
                </code>
                {isActive ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                  >
                    Applied <X size={13} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => applyCoupon(c.code)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-600 dark:bg-white dark:text-gray-900 dark:hover:bg-brand-500 dark:hover:text-white"
                  >
                    Apply now
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {[
          { icon: ShieldCheck, title: 'Price match promise', text: 'Found it cheaper elsewhere? We’ll match it on the spot.' },
          { icon: Gift, title: 'Birthday surprises', text: 'Members get an exclusive gift every year on their birthday.' },
          { icon: Truck, title: 'Free express first order', text: 'First-time buyers get upgraded express shipping for free.' },
        ].map((f) => (
          <div
            key={f.title}
            className="flex items-start gap-4 rounded-3xl border border-gray-100 p-6 dark:border-gray-800"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <f.icon size={22} />
            </span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{f.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Ready to style your next look?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
          Apply your favourite coupon and explore the full collection.
        </p>
        <Link to="/shop" className="btn-primary mt-6 bg-white !text-gray-900 hover:!bg-brand-50">
          Start Shopping
        </Link>
      </div>
    </div>
  )
}