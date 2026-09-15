import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Eye } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import HeroBanner from '../components/HeroBanner'
import ProductCarousel from '../components/ProductCarousel'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import SectionHeading from '../components/SectionHeading'
import { CATEGORIES } from '../data/products'

export default function Home() {
  const { trending, newArrivals, bestSellers, recentlyViewed } = useShop()

  return (
    <div>
      <HeroBanner />

      {/* Categories */}
      <section className="container-x py-16">
        <SectionHeading
          eyebrow="Shop by category"
          title="Explore Collections"
          subtitle="Hand-picked edits across women, men, footwear, bags and accessories."
          to="/shop"
          linkLabel="Shop all"
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2 lg:col-span-2 lg:row-span-2' : ''}`}
              style={i === 0 ? { minHeight: 320 } : { minHeight: 200 }}
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl font-bold text-white">{c.name}</h3>
                <p className="mt-0.5 text-xs text-white/70">{c.tagline}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/90 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Shop now <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <ProductCarousel title="Trending Now" products={trending} viewAllTo="/shop?sort=rating" />

      {/* Promo banner */}
      <section className="container-x py-10">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80"
            alt="Summer edit"
            className="h-64 w-full object-cover sm:h-80"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center bg-gradient-to-r from-gray-950/80 to-transparent">
            <div className="max-w-md px-6 sm:px-12">
              <p className="text-xs font-bold tracking-[0.25em] text-brand-300 uppercase">
                Limited time
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-4xl">
                Summer Edit — up to 40% off
              </h3>
              <p className="mt-2 text-sm text-white/75">
                Refresh your wardrobe with the season’s best pieces. Use code STYLE15 at checkout.
              </p>
              <Link to="/shop?sort=sale" className="btn-primary mt-5 bg-white !text-gray-900 hover:!bg-brand-50">
                Shop the sale <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <ProductCarousel title="New Arrivals" products={newArrivals} viewAllTo="/shop?sort=newest" />

      {/* Best sellers */}
      <section className="container-x py-12">
        <SectionHeading
          eyebrow="Customer favourites"
          title="Best Sellers"
          subtitle="The pieces our community keeps coming back for."
          to="/shop?sort=popularity"
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <section className="container-x py-12">
          <SectionHeading
            eyebrow="Pick up where you left off"
            title="Recently Viewed"
            icon={<Eye size={18} />}
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {recentlyViewed.slice(0, 5).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Style note strip */}
      <section className="container-x py-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-gray-50 px-6 py-8 sm:flex-row sm:px-10 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="hidden h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white sm:flex">
              <Clock size={20} />
            </span>
            <div>
              <h4 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                Fresh drops every Friday
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                New silhouettes and limited-run pieces land weekly. Be first in line.
              </p>
            </div>
          </div>
          <Link to="/shop?sort=newest" className="btn-outline shrink-0">
            See what’s new
          </Link>
        </div>
      </section>

      <Newsletter />
    </div>
  )
}