import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContextTemp'
import { navLinks, features, steps, roles, IMG } from './landingData'
import GallerySection from './GallerySection'
import PlansSection from './PlansSection'

function Landing() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const loggedIn = Boolean(user)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const goTo = (id) => {
    setOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 250)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2"
          >
            <span className="w-9 h-9 rounded-lg bg-emerald-500 text-black font-extrabold grid place-items-center">F</span>
            <span className="text-xl font-extrabold tracking-widest text-emerald-400">
              FIT<span className="text-white">ZONE</span>
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {loggedIn ? (
              <Link
                to="/dashboard"
                className="hidden sm:inline-block px-4 py-2 rounded-lg bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block px-4 py-2 rounded-lg text-sm font-semibold text-zinc-300 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:inline-block px-4 py-2 rounded-lg bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="w-10 h-10 grid place-items-center rounded-lg border border-zinc-800 hover:border-emerald-500 hover:text-emerald-400 transition"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* SIDE MENU */}
      <div className={'fixed inset-0 z-[60] ' + (open ? '' : 'pointer-events-none')}>
        <div
          onClick={() => setOpen(false)}
          className={
            'absolute inset-0 bg-black/70 transition-opacity duration-300 ' +
            (open ? 'opacity-100' : 'opacity-0')
          }
        />
        <aside
          className={
            'absolute top-0 right-0 h-full w-72 max-w-[85%] bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col transition-transform duration-300 ' +
            (open ? 'translate-x-0' : 'translate-x-full')
          }
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-extrabold tracking-widest text-emerald-400">
              FIT<span className="text-white">ZONE</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-9 h-9 grid place-items-center rounded-lg text-xl hover:bg-zinc-800"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-1">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => goTo(l.id)}
                className="block w-full text-left px-4 py-3 rounded-lg text-zinc-300 hover:bg-zinc-900 hover:text-emerald-400 transition"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-3 pt-6 border-t border-zinc-800">
            {loggedIn ? (
              <Link
                to="/dashboard"
                className="block text-center py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-center py-3 rounded-lg border border-zinc-700 font-semibold hover:bg-zinc-900 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="block text-center py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* HERO */}
      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('${IMG.hero}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
          <span className="inline-block text-xs font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
            BUILT FOR PAKISTAN GYMS AND FITNESS CLUBS
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
            Run your gym <br className="hidden sm:block" />
            <span className="text-emerald-400">smarter, not harder.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-zinc-300 text-base md:text-lg">
            FITZONE manages members, plans, classes, check-ins and payments in one simple
            dashboard, so you can focus on what matters: your members.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={loggedIn ? '/dashboard' : '/signup'}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition"
            >
              {loggedIn ? 'Open Dashboard' : 'Sign Up Now'}
            </Link>
            {!loggedIn && (
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-xl border border-zinc-600 bg-black/40 font-semibold hover:bg-zinc-900 transition"
              >
                Log In
              </Link>
            )}
            <button
              onClick={() => goTo('features')}
              className="px-8 py-3.5 rounded-xl border border-zinc-600 bg-black/40 font-semibold hover:bg-zinc-900 transition"
            >
              Explore Features
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[['8+', 'Modules'], ['2', 'User roles'], ['Live', 'Seat updates'], ['0', 'Paperwork']].map(([v, l]) => (
              <div key={l} className="bg-zinc-900/70 border border-zinc-800 rounded-xl py-4">
                <p className="text-2xl font-extrabold text-emerald-400">{v}</p>
                <p className="text-xs text-zinc-500 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center mb-12">
          <p className="text-emerald-400 text-sm font-semibold tracking-wider">FEATURES</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2">Everything your gym needs</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:-translate-y-1 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 grid place-items-center text-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <GallerySection />

      {/* HOW IT WORKS */}
      <section id="how" className="bg-zinc-900/50 border-b border-zinc-800 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-sm font-semibold tracking-wider">HOW IT WORKS</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2">Up and running in 3 steps</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="bg-black border border-zinc-800 rounded-2xl p-6">
                <p className="text-4xl font-extrabold text-emerald-500/40">{s.n}</p>
                <h3 className="font-bold text-lg mt-2">{s.title}</h3>
                <p className="text-sm text-zinc-400 mt-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="max-w-6xl mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center mb-12">
          <p className="text-emerald-400 text-sm font-semibold tracking-wider">BUILT FOR YOUR TEAM</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2">The right access for everyone</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {roles.map((r) => (
            <div key={r.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7">
              <div className="text-3xl mb-3">{r.icon}</div>
              <h3 className="font-bold text-xl mb-4">{r.title}</h3>
              <ul className="space-y-2">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-zinc-300">
                    <span className="text-emerald-400">✔</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* PLANS */}
      <PlansSection loggedIn={loggedIn} />

      {/* CTA */}
      <section id="join" className="max-w-4xl mx-auto px-4 py-20 text-center scroll-mt-16">
        <div
          className="relative overflow-hidden border border-emerald-500/30 rounded-3xl p-10 md:p-14 bg-cover bg-center"
          style={{ backgroundImage: `url('${IMG.cta}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-emerald-950/70" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold">Ready to join FITZONE?</h2>
            <p className="text-zinc-300 mt-3 max-w-xl mx-auto">
              Visit our front desk to register and get your membership plan, or log in if you are already part of the team.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={loggedIn ? '/dashboard' : '/signup'}
                className="px-8 py-3.5 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition"
              >
                {loggedIn ? 'Open Dashboard' : 'Sign Up'}
              </Link>
              {!loggedIn && (
                <Link
                  to="/login"
                  className="px-8 py-3.5 rounded-xl border border-zinc-600 bg-black/40 font-semibold hover:bg-zinc-900 transition"
                >
                  Log In
                </Link>
              )}
              <a
                href="tel:+920000000000"
                className="px-8 py-3.5 rounded-xl border border-zinc-600 bg-black/40 font-semibold hover:bg-zinc-900 transition"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-zinc-500">
          <p className="font-extrabold tracking-widest text-emerald-400">
            FIT<span className="text-white">ZONE</span>
          </p>
          <p>© {new Date().getFullYear()} FITZONE Gym and Fitness Club Management System</p>
          <p>Built with React, Tailwind and Supabase</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing