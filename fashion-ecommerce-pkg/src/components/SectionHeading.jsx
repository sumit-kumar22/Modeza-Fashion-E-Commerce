import { Link } from 'react-router-dom'

export default function SectionHeading({ eyebrow, title, subtitle, to, linkLabel }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase dark:text-brand-400">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {to && (
        <Link
          to={to}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400"
        >
          {linkLabel || 'View all'}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  )
}