import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  BadgeCheck,
  CreditCard,
  Lock,
  MapPin,
  PackageCheck,
  Truck,
} from 'lucide-react'
import { useShop } from '../context/ShopContext'
import Breadcrumb from '../components/Breadcrumb'
import { cn, currency } from '../utils/format'

const PAYMENT = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'upi', label: 'UPI / Wallet', icon: BadgeCheck },
  { id: 'cod', label: 'Cash on Delivery', icon: PackageCheck },
]

export default function Checkout() {
  const navigate = useNavigate()
  const {
    cartDetailed,
    subtotal,
    coupon,
    couponDiscount,
    shipping,
    total,
    freeShipping,
    user,
    placeOrder,
  } = useShop()

  const [step, setStep] = useState(1)
  const [payment, setPayment] = useState('card')
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const shippingValid =
    form.email && form.firstName && form.address && form.city && form.zip && form.state

  const placeOrderHandler = () => {
    if (!shippingValid) {
      toast.error('Please complete the shipping details')
      return
    }
    if (payment === 'card' && (!form.cardNumber || !form.expiry || !form.cvv)) {
      toast.error('Please complete payment details')
      return
    }
    setPlacing(true)
    setTimeout(() => {
      const order = placeOrder({
        items: cartDetailed.map((i) => ({
          productId: i.productId,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          size: i.size,
          color: i.color,
        })),
        paymentMethod: payment,
        subtotal,
        couponDiscount,
        shipping,
        total,
        couponCode: coupon?.code,
        shippingAddress: form,
      })
      setPlacing(false)
      navigate('/profile?tab=orders&placed=true', { state: { order } })
      toast.success('Order placed successfully 🎉')
    }, 1200)
  }

  const sectionClass = 'rounded-3xl border border-gray-100 p-6 dark:border-gray-800'
  const label = 'mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300'
  const input = 'input-base'

  return (
    <div className="container-x py-8">
      <Breadcrumb items={[{ label: 'Checkout' }]} />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          Checkout
        </h1>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className={cn('rounded-full px-3 py-1', step === 1 ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400')}>
            Shipping
          </span>
          <span className="text-gray-300 dark:text-gray-600">→</span>
          <span className={cn('rounded-full px-3 py-1', step === 2 ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400')}>
            Payment
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Shipping */}
          <section className={cn(sectionClass, step > 1 && 'opacity-60')}>
            <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-gray-900 dark:text-white">
              <Truck size={19} className="text-brand-600" /> Shipping Address
            </h2>
            {step === 1 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Email address *</label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" className={input} />
                </div>
                <div>
                  <label className={label}>Phone</label>
                  <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" className={input} />
                </div>
                <div>
                  <label className={label}>First name *</label>
                  <input value={form.firstName} onChange={set('firstName')} placeholder="Alex" className={input} />
                </div>
                <div>
                  <label className={label}>Last name *</label>
                  <input value={form.lastName} onChange={set('lastName')} placeholder="Morgan" className={input} />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Street address *</label>
                  <input value={form.address} onChange={set('address')} placeholder="123 Fashion Avenue" className={input} />
                </div>
                <div>
                  <label className={label}>City *</label>
                  <input value={form.city} onChange={set('city')} placeholder="New York" className={input} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={label}>State *</label>
                    <input value={form.state} onChange={set('state')} placeholder="NY" className={input} />
                  </div>
                  <div>
                    <label className={label}>ZIP *</label>
                    <input value={form.zip} onChange={set('zip')} placeholder="10001" className={input} />
                  </div>
                </div>
                <div>
                  <label className={label}>Country</label>
                  <select value={form.country} onChange={set('country')} className={cn(input, 'cursor-pointer')}>
                    <option>United States</option>
                    <option>India</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-brand-600" />
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {form.firstName} {form.lastName}
                  </p>
                  <p>{form.address}, {form.city}, {form.state} {form.zip}, {form.country}</p>
                  <p>{form.email}</p>
                </div>
              </div>
            )}
          </section>

          {/* Payment */}
          {step === 2 && (
            <section className={sectionClass}>
              <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-gray-900 dark:text-white">
                <CreditCard size={19} className="text-brand-600" /> Payment Method
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {PAYMENT.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPayment(p.id)}
                    className={cn(
                      'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-semibold transition',
                      payment === p.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                    )}
                  >
                    <p.icon size={22} />
                    {p.label}
                  </button>
                ))}
              </div>

              {payment === 'card' && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label}>Name on card</label>
                    <input value={form.cardName} onChange={set('cardName')} placeholder="Alex Morgan" className={input} />
                  </div>
                  <div>
                    <label className={label}>Card number</label>
                    <input
                      value={form.cardNumber}
                      onChange={set('cardNumber')}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className={input}
                    />
                  </div>
                  <div>
                    <label className={label}>Expiry</label>
                    <input value={form.expiry} onChange={set('expiry')} placeholder="12/28" className={input} />
                  </div>
                  <div>
                    <label className={label}>CVV</label>
                    <input value={form.cvv} onChange={set('cvv')} placeholder="123" maxLength={4} type="password" className={input} />
                  </div>
                </div>
              )}
              <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
                <Lock size={12} /> Payments are encrypted and secure. This is a demo checkout — no
                card is charged.
              </p>
            </section>
          )}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-gray-100 bg-gray-50 p-6 lg:sticky lg:top-28 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
            Your Order
          </h2>

          <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
            {cartDetailed.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={item.product.image}
                    alt=""
                    className="h-14 w-12 rounded-lg object-cover"
                  />
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white dark:bg-white dark:text-gray-900">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.size} {item.color && '·'} {item.product.colors.find((c) => c.hex === item.color)?.name}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {currency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 border-t border-gray-200 pt-5 text-sm dark:border-gray-700">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-white">{currency(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon ({coupon?.code})</span>
                <span className="font-semibold">−{currency(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {freeShipping || shipping === 0 ? 'FREE' : currency(shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-dashed border-gray-200 pt-4 text-lg dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <span className="font-display font-bold text-gray-900 dark:text-white">{currency(total)}</span>
            </div>
          </div>

          {step === 1 ? (
            <button
              type="button"
              onClick={() => {
                if (!shippingValid) {
                  toast.error('Please fill in all required shipping fields')
                  return
                }
                setStep(2)
                window.scrollTo({ top: 0 })
              }}
              className="btn-primary mt-6 w-full !py-3.5"
            >
              Continue to Payment
            </button>
          ) : (
            <button
              type="button"
              onClick={placeOrderHandler}
              disabled={placing}
              className="btn-primary mt-6 w-full !py-3.5"
            >
              {placing ? 'Placing order…' : `Place Order · ${currency(total)}`}
            </button>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Lock size={12} /> 100% secure · 30-day returns
          </div>
          <Link
            to="/cart"
            className="mt-3 block text-center text-xs font-semibold text-gray-500 transition hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
          >
            ← Back to cart
          </Link>
        </aside>
      </div>
    </div>
  )
}