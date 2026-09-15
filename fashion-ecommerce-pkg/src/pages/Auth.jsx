import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import { cn } from '../utils/format'

export default function Auth() {
  const { login, register, user } = useShop()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  if (user) {
    navigate('/profile', { replace: true })
    return null
  }

  const submit = (e) => {
    e.preventDefault()
    const validEmail = /^\S+@\S+\.\S+$/.test(form.email)
    if (!validEmail) return toast.error('Please enter a valid email')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')

    if (mode === 'register') {
      if (form.name.trim().length < 2) return toast.error('Please enter your name')
      if (form.password !== form.confirm) return toast.error('Passwords do not match')
      register(form.name.trim(), form.email.trim())
    } else {
      login(form.email.trim())
    }
    navigate('/profile', { replace: true })
  }

  const inputBase =
    'w-full rounded-xl border border-gray-200 bg-white py-3 pr-12 pl-11 text-sm text-gray-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'

  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50 sm:p-10 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
          <div className="mb-8 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-2xl font-extrabold text-white">
              M
            </span>
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'login' ? 'Welcome back' : 'Join Modeza'}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {mode === 'login'
                ? 'Sign in to track orders and check out faster.'
                : 'Create an account for exclusive offers and faster checkout.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 grid grid-cols-2 rounded-full bg-gray-100 p-1 dark:bg-gray-800">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  'cursor-pointer rounded-full py-2.5 text-sm font-semibold capitalize transition',
                  mode === m
                    ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Full name"
                  className={inputBase}
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="Email address"
                className={inputBase}
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="Password"
                className={inputBase}
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Lock size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Confirm password"
                  className={inputBase}
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex cursor-pointer items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-brand-600" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => toast('Password reset link sent to your email 📬')}
                  className="cursor-pointer font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="btn-primary w-full !py-3.5">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            By continuing you agree to our{' '}
            <a href="#" className="font-semibold text-gray-600 hover:underline dark:text-gray-300">Terms</a> and{' '}
            <a href="#" className="font-semibold text-gray-600 hover:underline dark:text-gray-300">Privacy Policy</a>.
          </p>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          Just browsing?{' '}
          <Link to="/shop" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Explore the store →
          </Link>
        </p>
      </div>
    </div>
  )
}