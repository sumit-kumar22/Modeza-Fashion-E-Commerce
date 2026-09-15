import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    toast.success('Subscribed! Check your inbox for 10% off.')
    setEmail('')
  }

  return (
    <section className="container-x py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 px-6 py-14 text-center sm:px-12">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.25em] text-white/70 uppercase">
            Join the club
          </p>
          <h2 className="mx-auto mt-2 max-w-xl font-display text-3xl font-bold text-white sm:text-4xl">
            Get 10% off your first order
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/80">
            Subscribe for early access to drops, private sales and style notes. No spam, ever.
          </p>
          <form
            onSubmit={submit}
            className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full rounded-full border-0 bg-white/15 px-5 py-3.5 text-sm text-white backdrop-blur outline-none placeholder:text-white/60 focus:ring-2 focus:ring-white/60"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50 active:scale-95"
            >
              <Send size={15} />
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}