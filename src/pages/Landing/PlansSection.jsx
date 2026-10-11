import { useState } from 'react'
import { IMG, plans as staticPlans, gallery } from './landingData'
import { usePublicPlans } from '../../hooks/usePlans'

function accessText(days) {
  const months = Math.round(days / 30)
  if (months >= 1) return months + (months > 1 ? ' months access' : ' month access')
  return days + ' days access'
}

function PlansSection() {
  const { plans: dbPlans } = usePublicPlans()
  const [planTab, setPlanTab] = useState('All Plans')

  const staticByName = {}
  staticPlans.forEach((p) => {
    staticByName[p.name] = p
  })

  // Use database plans when available, otherwise the built-in plans
  const list =
    dbPlans.length > 0
      ? dbPlans.map((p, i) => {
          const fallback = staticByName[p.name]
          const days = Number(p.duration_days) || 0
          const features =
            Array.isArray(p.features) && p.features.length > 0
              ? p.features
              : fallback
              ? fallback.features
              : ['🏋️ Gym Access', '👥 Group Classes']
          return {
            name: p.name,
            price: Number(p.price) || 0,
            days: days,
            label: accessText(days),
            features: features,
            image: p.image_url || (fallback ? fallback.image : gallery[i % gallery.length]),
            hot: fallback ? fallback.hot : false,
          }
        })
      : staticPlans

  const tabs = ['All Plans'].concat(list.map((p) => p.name))
  const visiblePlans = planTab === 'All Plans' ? list : list.filter((p) => p.name === planTab)

  const hideBroken = (e) => {
    e.currentTarget.style.display = 'none'
  }

  return (
    <section id="pricing" className="bg-black border-y border-zinc-800 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div
          className="relative overflow-hidden rounded-3xl border border-zinc-800 p-8 sm:p-12 mb-8 bg-cover bg-center"
          style={{ backgroundImage: `url('${IMG.banner}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
          <div className="relative">
            <p className="text-emerald-400 tracking-[0.3em] text-xs sm:text-sm font-semibold mb-3">
              MEMBERSHIP PLANS
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
              Choose Your <span className="text-emerald-400">Plan</span>
            </h2>
            <p className="text-zinc-300 max-w-md">
              Flexible plans designed to help you stay fit, healthy and achieve your goals.
            </p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto rounded-full border border-zinc-800 bg-zinc-950 p-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setPlanTab(t)}
              className={
                'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ' +
                (planTab === t
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                  : 'text-zinc-400 hover:text-white')
              }
            >
              📅 {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visiblePlans.map((p) => (
            <div
              key={p.name}
              className={
                'flex gap-4 rounded-3xl border bg-zinc-950 p-4 hover:border-emerald-500/60 transition ' +
                (p.hot ? 'border-emerald-500/70' : 'border-zinc-800')
              }
            >
              <div className="w-28 sm:w-44 shrink-0 rounded-2xl overflow-hidden bg-zinc-800">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  onError={hideBroken}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg sm:text-2xl font-bold text-white">📅 {p.name}</h3>
                  <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400">
                    {p.hot ? 'Popular' : 'Active'}
                  </span>
                </div>

                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
                  Rs. {p.price.toLocaleString()}
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  {p.days} days | {p.label}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {p.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs text-zinc-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-4 inline-block rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black hover:bg-emerald-400 transition"
                >
                  Join Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PlansSection