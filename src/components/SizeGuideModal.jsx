import { useEffect } from 'react'
import { Ruler, X } from 'lucide-react'

const SIZE_CHART = [
  { size: 'XS', chest: '32-34', waist: '24-26', hips: '33-35' },
  { size: 'S', chest: '34-36', waist: '27-29', hips: '36-38' },
  { size: 'M', chest: '37-39', waist: '30-32', hips: '39-41' },
  { size: 'L', chest: '40-42', waist: '33-36', hips: '42-44' },
  { size: 'XL', chest: '43-45', waist: '37-40', hips: '45-48' },
  { size: 'XXL', chest: '46-48', waist: '41-44', hips: '49-52' },
]

export default function SizeGuideModal({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close size guide"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-sm animate-fade-in"
      />
      <div className="relative z-10 w-full max-w-md animate-scale-in rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-gray-900 dark:text-white">
            <Ruler size={18} className="text-brand-600" />
            Size Guide
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Measurements in inches. Run a tape around your chest, waist and hips for
          the most accurate fit.
        </p>

        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Chest</th>
                <th className="px-4 py-3">Waist</th>
                <th className="px-4 py-3">Hips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {SIZE_CHART.map((row) => (
                <tr key={row.size}>
                  <td className="px-4 py-2.5 font-semibold text-gray-900 dark:text-white">
                    {row.size}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">{row.chest}</td>
                  <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">{row.waist}</td>
                  <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          Tip: if you are between sizes, we suggest sizing up for a relaxed fit.
        </p>
      </div>
    </div>
  )
}