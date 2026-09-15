import { Link } from 'react-router-dom'
import { Compass, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-8xl font-extrabold bg-gradient-to-r from-brand-500 to-brand-800 bg-clip-text text-transparent sm:text-9xl">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
        This page slipped off the rack
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        The page you’re looking for doesn’t exist or has moved. Let’s get you back to the good
        stuff.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          <Home size={16} /> Back home
        </Link>
        <Link to="/shop" className="btn-outline">
          <Compass size={16} /> Browse the shop
        </Link>
      </div>
    </div>
  )
}