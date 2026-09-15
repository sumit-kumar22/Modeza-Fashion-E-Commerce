import { Link } from 'react-router-dom'
import {
  CreditCard,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { CATEGORIES } from '../data/products'

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.92 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

const SOCIALS = [
  { Icon: InstagramIcon, label: 'Instagram' },
  { Icon: FacebookIcon, label: 'Facebook' },
  { Icon: XIcon, label: 'X' },
  { Icon: YoutubeIcon, label: 'YouTube' },
]

const SERVICE = [
  { icon: Truck, title: 'Free Shipping', text: 'On orders over $150' },
  { icon: RotateCcw, title: '30-Day Returns', text: 'Easy, no questions asked' },
  { icon: ShieldCheck, title: 'Secure Payments', text: '100% encrypted checkout' },
  { icon: CreditCard, title: 'Buy Now, Pay Later', text: 'KIarna available at checkout' },
]

const footerCols = [
  {
    title: 'Shop',
    links: ['New arrivals', 'Trending now', 'Best sellers', 'Sale', 'Gift cards'],
  },
  {
    title: 'Help',
    links: ['Track order', 'Shipping & delivery', 'Returns & refunds', 'Size guide', 'Contact us'],
  },
  {
    title: 'Company',
    links: ['About us', 'Careers', 'Sustainability', 'Press', 'Terms & privacy'],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      {/* Service strip */}
      <div className="container-x grid grid-cols-2 gap-6 border-b border-gray-100 py-10 lg:grid-cols-4 dark:border-gray-800">
        {SERVICE.map((s) => (
          <div key={s.title} className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm dark:bg-gray-900 dark:text-brand-400">
              <s.icon size={19} />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Links */}
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-xl font-extrabold text-white">
              M
            </span>
            <span className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              modeza
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Curated fashion for modern living. Thoughtfully designed, ethically made and built
            to be loved for years — not seasons.
          </p>
          <div className="mt-5 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p className="flex items-center gap-2">
              <MapPin size={15} className="text-brand-600" /> 420 Madison Avenue, New York, NY
            </p>
            <p className="flex items-center gap-2">
              <Phone size={15} className="text-brand-600" /> +1 (800) 555-0124
            </p>
            <p className="flex items-center gap-2">
              <Mail size={15} className="text-brand-600" /> hello@modeza.store
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-brand-600 hover:text-white dark:bg-gray-900 dark:text-gray-300"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {footerCols.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 transition hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Categories strip */}
      <div className="border-t border-gray-100 py-6 dark:border-gray-800">
        <div className="container-x flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            Categories:
          </span>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-brand-600 hover:text-white dark:bg-gray-900 dark:text-gray-300"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 py-5 dark:border-gray-800">
        <div className="container-x flex flex-col items-center justify-between gap-3 text-xs text-gray-400 sm:flex-row dark:text-gray-500">
          <p>© 2026 Modeza Fashion. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition hover:text-brand-600">Privacy</a>
            <a href="#" className="transition hover:text-brand-600">Terms</a>
            <a href="#" className="transition hover:text-brand-600">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}