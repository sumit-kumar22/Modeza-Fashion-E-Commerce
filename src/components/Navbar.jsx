import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  User,
  X,
} from 'lucide-react'
import { useShop } from '../context/ShopContext'
import { CATEGORIES } from '../data/products'
import { cn } from '../utils/format'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Offers', to: '/offers' },
  { label: 'Wishlist', to: '/wishlist' },
]

export default function Navbar() {
  const { cartCount, wishlist, theme, toggleTheme, user } = useShop()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const submitSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 shadow-sm backdrop-blur-lg dark:bg-gray-950/90">
      {/* Announcement bar */}
      <div className="bg-gray-950 py-2 text-center text-[11px] font-medium tracking-wider text-white uppercase dark:bg-gray-900">
        Free shipping over $150 &nbsp;·&nbsp; Use code <span className="text-brand-400">WELCOME20</span> for 20% off
      </div>

      {/* Main nav */}
      <div className="container-x flex h-16 items-center gap-4 sm:h-[72px]">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 lg:hidden dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-lg font-extrabold text-white">
            M
          </span>
          <span className="hidden font-display text-2xl font-bold tracking-tight text-gray-900 sm:block dark:text-white">
            modeza
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                'rounded-full px-4 py-2 text-sm font-medium transition hover:text-brand-600 dark:hover:text-brand-400',
                isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-200'
              )
            }
          >
            Home
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-0.5 rounded-full px-4 py-2 text-sm font-medium transition hover:text-brand-600 dark:hover:text-brand-400',
                  isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-200'
                )
              }
            >
              Shop <ChevronDown size={14} className={cn('transition-transform', categoriesOpen && 'rotate-180')} />
            </NavLink>
            {categoriesOpen && (
              <div className="absolute left-0 top-full w-64 animate-scale-in rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/shop?category=${c.slug}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-brand-600 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    {c.name}
                    <span className="text-xs text-gray-300 dark:text-gray-600">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.slice(1).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition hover:text-brand-600 dark:hover:text-brand-400',
                  isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-200'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Search size={19} />
          </button>

          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <Link
            to={user ? '/profile' : '/auth'}
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <User size={19} />
          </Link>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 sm:flex dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute mt-[-18px] ml-[18px] flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div
        className={cn(
          'border-t border-gray-100 transition-all dark:border-gray-800',
          searchOpen ? 'max-h-24 animate-fade-in' : 'max-h-0 overflow-hidden border-t-0'
        )}
      >
        <form onSubmit={submitSearch} className="container-x py-3">
          <div className="relative">
            <Search size={17} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dresses, sneakers, watches…  (try “denim”)"
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pr-12 pl-11 text-sm text-gray-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-sm animate-fade-in"
          />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] animate-slide-in-right flex-col bg-white shadow-2xl dark:bg-gray-950">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-lg font-extrabold text-white">
                  M
                </span>
                <span className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  modeza
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <X size={17} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-5">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900"
              >
                Shop All
              </Link>
              <p className="px-4 pt-4 pb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Categories
              </p>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/shop?category=${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900"
                >
                  {c.name}
                  <span className="text-gray-300 dark:text-gray-600">→</span>
                </Link>
              ))}
              <div className="my-4 h-px bg-gray-100 dark:bg-gray-800" />
              <Link
                to="/offers"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-brand-600 transition hover:bg-rose-50 dark:text-brand-400 dark:hover:bg-gray-900"
              >
                Offers & Coupons
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900"
              >
                Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
              </Link>
              <Link
                to={user ? '/profile' : '/auth'}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900"
              >
                {user ? 'My Account' : 'Login / Register'}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}