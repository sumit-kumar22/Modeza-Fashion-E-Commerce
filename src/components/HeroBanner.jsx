import { useEffect, useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../utils/format'

const SLIDES = [
  {
    eyebrow: 'New Season 2026',
    title: 'The Art of Quiet Luxury',
    subtitle: 'Rediscover effortless staples crafted from silk, wool and organic cotton.',
    cta: 'Shop the edit',
    to: '/shop?sort=newest',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-rose-600/90 via-rose-700/80 to-gray-950/70',
  },
  {
    eyebrow: 'Up to 40% off',
    title: 'Street Style, Amplified',
    subtitle: 'Bombers, hoodies and kicks — the uniform of the modern wardrobe.',
    cta: 'Shop Menswear',
    to: '/shop?category=men',
    image:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-gray-900/90 via-gray-900/70 to-gray-900/50',
  },
  {
    eyebrow: 'Editor’s Picks',
    title: 'Walk in Statement',
    subtitle: 'Sculpted heels, chunky soles and buttery leather boots for every stride.',
    cta: 'Shop Footwear',
    to: '/shop?category=footwear',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-emerald-900/80 via-gray-900/70 to-gray-950/60',
  },
]

export default function HeroBanner() {
  const [index, setIndex] = useState(0)
  const slide = SLIDES[index]

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[78vh] min-h-[520px] max-h-[760px] overflow-hidden bg-gray-900">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === index ? 'opacity-100' : 'opacity-0'
          )}
        >
          <img
            src={s.image}
            alt=""
            className="h-full w-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className={cn('absolute inset-0 bg-gradient-to-r', s.accent)} />
        </div>
      ))}

      <div className="container-x relative z-10 flex h-full flex-col justify-center">
        <div key={index} className="max-w-2xl animate-fade-up">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white uppercase backdrop-blur">
            <Sparkles size={13} />
            {slide.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-lg text-base text-white/85 sm:text-lg">{slide.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to={slide.to}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition hover:bg-brand-50"
            >
              {slide.cta}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Explore collections
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute right-6 bottom-6 z-10 flex gap-2 sm:right-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              'h-1.5 cursor-pointer rounded-full transition-all duration-500',
              i === index ? 'w-8 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'
            )}
          />
        ))}
      </div>
    </section>
  )
}