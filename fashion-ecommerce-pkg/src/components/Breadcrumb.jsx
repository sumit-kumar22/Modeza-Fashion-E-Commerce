import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
      <Link
        to="/"
        className="flex items-center gap-1 transition hover:text-brand-600 dark:hover:text-brand-400"
      >
        <Home size={14} />
        Home
      </Link>
      {items?.map((item, i) => {
        const last = i === items.length - 1
        return (
          <span key={item.label} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
            {item.to && !last ? (
              <Link
                to={item.to}
                className="capitalize transition hover:text-brand-600 dark:hover:text-brand-400"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900 capitalize dark:text-white">
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}