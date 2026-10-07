import { useState } from 'react'
import { usePaymentPlans } from '../../hooks/usePayments'
import { formatPKR } from '../../utils/paymentHelpers'
import { IMAGES, PLAN_PHOTOS } from '../../assets/images'

// Photos for each plan come from images.js
const PLAN_IMAGES = PLAN_PHOTOS
const FALLBACK_IMAGES = Object.values(PLAN_PHOTOS)

// Edit these lists to change the feature chips shown on each plan
const PLAN_FEATURES = {
  Monthly: ['Gym Access', 'Group Classes', 'Basic Support'],
  Quarterly: ['Gym Access', 'Group Classes', 'Priority Support'],
  'Half-Yearly': ['Gym Access', 'Group Classes', 'Nutrition Guide'],
  Yearly: ['Gym Access', 'Group Classes', 'Personal Training'],
}
const DEFAULT_FEATURES = ['Gym Access', 'Group Classes']
const FEATURE_ICON = {
  'Gym Access': '🏋️',
  'Group Classes': '👥',
  'Basic Support': '🛡️',
  'Priority Support': '🛡️',
  'Nutrition Guide': '🍎',
  'Personal Training': '💪',
}

function accessText(days) {
  const months = Math.round(days / 30)
  if (months >= 1) return `${months} month${months > 1 ? 's' : ''} access`
  return `${days} days access`
}

function PlanPhoto({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 to-emerald-950 ${className}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🏋️</div>
      )}
    </div>
  )
}

function PlanCard({ plan, image, onDetails }) {
  const features = PLAN_FEATURES[plan.name] ?? DEFAULT_FEATURES
  const days = Number(plan.duration_days) || 0
  const active = plan.is_active !== false

  return (
    <div className="flex gap-3 rounded-2xl border border-emerald-500/20 bg-zinc-900/80 p-3 sm:gap-4 sm:p-4">
      <PlanPhoto src={image} alt={plan.name} className="min-h-[150px] w-28 shrink-0 self-stretch sm:w-44" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <span>📅</span>
            {plan.name}
          </h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-700/50 text-zinc-300'
            }`}
          >
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <p className="mt-1 text-2xl font-extrabold text-emerald-400 sm:text-3xl">{formatPKR(plan.price)}</p>

        <p className="mt-1 text-sm text-zinc-300">
          {days} days <span className="mx-2 text-zinc-600">|</span> {accessText(days)}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {features.map((f) => (
            <span
              key={f}
              className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-zinc-200"
            >
              <span>{FEATURE_ICON[f] ?? '✔️'}</span>
              {f}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onDetails}
          className="mt-3 rounded-full border border-emerald-400 px-4 py-1.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/10"
        >
          View Details →
        </button>
      </div>
    </div>
  )
}

function DetailsModal({ plan, image, onClose }) {
  if (!plan) return null
  const features = PLAN_FEATURES[plan.name] ?? DEFAULT_FEATURES
  const days = Number(plan.duration_days) || 0

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <PlanPhoto src={image} alt={plan.name} className="h-40 w-full rounded-none" />
        <div className="p-5">
          <h2 className="text-xl font-bold text-white">{plan.name} Plan</h2>
          <p className="mt-1 text-3xl font-extrabold text-emerald-400">{formatPKR(plan.price)}</p>
          {plan.description && <p className="mt-3 text-sm text-zinc-300">{plan.description}</p>}
          <ul className="mt-4 space-y-2 text-sm text-zinc-200">
            <li>📅 Duration: {days} days ({accessText(days)})</li>
            {features.map((f) => (
              <li key={f}>
                {FEATURE_ICON[f] ?? '✔️'} {f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Plans() {
  const { data: plans = [], isLoading, error } = usePaymentPlans()
  const [tab, setTab] = useState('All Plans')
  const [selected, setSelected] = useState(null)
  const [heroFailed, setHeroFailed] = useState(false)

  const tabs = ['All Plans', ...plans.map((p) => p.name)]
  const visible = tab === 'All Plans' ? plans : plans.filter((p) => p.name === tab)
  const imageFor = (plan) => PLAN_IMAGES[plan.name] ?? FALLBACK_IMAGES[plans.indexOf(plan) % FALLBACK_IMAGES.length]

  return (
    <main className="max-w-5xl p-4 sm:p-6">
      {/* Hero banner */}
      <section className="relative mb-4 overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950">
        {!heroFailed && (
          <img
            src={IMAGES.gymBrick}
            alt=""
            onError={() => setHeroFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
        <div className="relative flex items-center justify-between gap-4 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-emerald-400">MEMBERSHIP PLANS</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
              Choose Your <span className="text-emerald-400">Plan</span>
            </h1>
            <p className="mt-2 max-w-md text-sm text-zinc-300">
              Flexible plans designed to help you stay fit, healthy and achieve your goals.
            </p>
          </div>
          <p className="hidden -rotate-6 font-serif text-2xl italic leading-tight text-emerald-400 sm:block">
            Stronger
            <br />
            Together
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto rounded-full border border-zinc-800 bg-zinc-900/60 p-1.5">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t
                ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📅 {t}
          </button>
        ))}
      </div>

      {/* Plan cards */}
      {isLoading && <p className="text-sm text-zinc-500">Loading plans...</p>}
      {error && <p className="text-sm text-red-400">Error: {error.message}</p>}
      {!isLoading && !error && visible.length === 0 && (
        <p className="text-sm text-zinc-500">No plans found.</p>
      )}

      <div className="space-y-4">
        {visible.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            image={imageFor(plan)}
            onDetails={() => setSelected(plan)}
          />
        ))}
      </div>

      <DetailsModal
        plan={selected}
        image={selected ? imageFor(selected) : null}
        onClose={() => setSelected(null)}
      />
    </main>
  )
}