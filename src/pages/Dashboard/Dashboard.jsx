import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useTodayCheckInCount } from '../../hooks/useAttendance'
import { usePaymentStats } from '../../hooks/usePayments'
import { useTrainerCount } from '../../hooks/useTrainerCount'
import { useFeeReminders, expiresWhen } from '../../hooks/useFeeReminders'
import { formatPKR } from '../../utils/paymentHelpers'
import { IMAGES } from '../../assets/images'
import FeeReminderBanner from '../../components/FeeReminderBanner'

function PhotoStatCard({ icon, value, label, sub, image, color, accent, decor }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className="relative min-h-[170px] overflow-hidden rounded-2xl border border-white/10"
      style={{ background: color }}
    >
      {image && !failed && (
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-y-0 right-0 h-full w-4/5 object-cover"
          style={{ objectPosition: 'center 25%' }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, ${color} 15%, ${color}99 45%, ${color}1a 100%)` }}
      />
      {decor && <div className="absolute right-4 top-4">{decor}</div>}
      <div className="relative p-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{ background: accent }}
        >
          {icon}
        </div>
        <p className="mt-3 break-words text-2xl font-bold text-white sm:text-3xl">{value}</p>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-zinc-300">{sub}</p>
      </div>
    </div>
  )
}

function Avatar({ name, src }) {
  const [failed, setFailed] = useState(false)
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className="h-11 w-11 shrink-0 rounded-full border border-zinc-700 object-cover"
      />
    )
  }
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-sm font-bold text-emerald-400">
      {initials}
    </div>
  )
}

const revenueDecor = (
  <div className="flex items-end gap-1.5">
    {[20, 32, 46, 64].map((h) => (
      <div
        key={h}
        className="w-4 rounded-t bg-gradient-to-t from-amber-700 to-amber-400"
        style={{ height: h }}
      />
    ))}
  </div>
)

function Dashboard() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroFailed, setHeroFailed] = useState(false)
  const [adminName, setAdminName] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('members')
        .select('id, full_name, plan, status, join_date, created_at, photo_url')
        .order('created_at', { ascending: false })
      setMembers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    const loadName = async () => {
      const { data } = await supabase.auth.getUser()
      const uid = data?.user?.id
      if (!uid) return
      const { data: p } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', uid)
        .maybeSingle()
      setAdminName(p?.full_name ? p.full_name.split(' ')[0] : '')
    }
    loadName()
  }, [])

  const count = (s) => members.filter((m) => m.status === s).length
  const { data: todayCount = 0 } = useTodayCheckInCount()
  const { data: payStats } = usePaymentStats()
  const { data: trainerCount } = useTrainerCount()
  const { data: expiringSoon = [] } = useFeeReminders(7)

  const cards = [
    {
      icon: '👥', value: members.length, label: 'Total Members', sub: 'Active & Inactive',
      image: IMAGES.womanGym, color: '#022c22', accent: '#10b981',
    },
    {
      icon: '🔥', value: count('Active'), label: 'Active Members', sub: 'Currently working out',
      image: IMAGES.manDumbbell, color: '#2e1065', accent: '#9333ea',
    },
    {
      icon: '🏋️', value: trainerCount ?? '—', label: 'Trainers', sub: 'Certified professionals',
      image: IMAGES.gymMachines, color: '#082f49', accent: '#0ea5e9',
    },
    {
      icon: '💳',
      value: payStats ? formatPKR(payStats.monthRevenue) : '—',
      label: "This Month's Revenue",
      sub: 'Total from memberships',
      image: null, color: '#451a03', accent: '#d97706', decor: revenueDecor,
    },
  ]

  return (
    <main className="max-w-6xl p-4 sm:p-6">
      {/* Greeting */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Hello{adminName ? ',' : ''} <span className="text-emerald-400">{adminName}</span> 👋
        </h1>
        <p className="text-sm text-zinc-400">Welcome to FITZONE — your fitness journey, made easier.</p>
      </div>

      {/* Hero banner */}
      <section className="relative mb-4 overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950">
        {!heroFailed && (
          <img
            src={IMAGES.gymRack}
            alt=""
            onError={() => setHeroFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
        <div className="relative max-w-md p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-emerald-400">BETTER BODY</p>
          <h2 className="mt-2 text-4xl font-extrabold leading-tight text-white">
            STRONGER <span className="text-emerald-400">YOU</span>
          </h2>
          <p className="mt-2 text-sm text-zinc-300">Consistent effort brings real results.</p>
          <p className="mt-3 inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
            Today's check-ins: {todayCount}
          </p>
          <div className="mt-4">
            <Link
              to="/members/new"
              className="inline-block rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400"
            >
              + Add Member
            </Link>
          </div>
        </div>
      </section>

      {/* Fee reminder banner (expiring within 3 days) */}
      <FeeReminderBanner />

      {/* Photo stat cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <PhotoStatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Recent members + side panels */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <h2 className="font-semibold text-white">Recent Members</h2>
            <Link to="/members" className="text-sm text-emerald-400 hover:text-emerald-300">
              View All →
            </Link>
          </div>
          {loading ? (
            <p className="p-4 text-sm text-zinc-500">Loading...</p>
          ) : members.length === 0 ? (
            <p className="p-4 text-sm text-zinc-500">No members yet.</p>
          ) : (
            <ul>
              {members.slice(0, 5).map((m) => (
                <li key={m.id} className="border-t border-zinc-800 first:border-t-0">
                  <Link
                    to={'/members/' + m.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50"
                  >
                    <Avatar name={m.full_name} src={m.photo_url} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{m.full_name}</p>
                      <p className="text-xs text-zinc-500">{m.plan || '—'} · {m.join_date}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        m.status === 'Active'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : m.status === 'Expired'
                          ? 'bg-red-500/15 text-red-400'
                          : 'bg-zinc-700/50 text-zinc-300'
                      }`}
                    >
                      {m.status || 'Active'}
                    </span>
                    <span className="text-zinc-500">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          {/* Expiring in next 7 days */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="mb-3 font-semibold text-white">Expiring Soon (7 days)</h2>
            {expiringSoon.length === 0 ? (
              <p className="text-sm text-zinc-500">No memberships expiring this week.</p>
            ) : (
              <ul className="space-y-2">
                {expiringSoon.slice(0, 6).map((r) => (
                  <li key={r.memberId}>
                    <Link
                      to={'/members/' + r.memberId}
                      className="flex items-center justify-between gap-2 rounded-lg bg-zinc-800/60 px-3 py-2 text-sm hover:bg-zinc-800"
                    >
                      <span className="truncate text-white">{r.name}</span>
                      <span
                        className={`shrink-0 text-xs font-semibold ${
                          r.daysLeft <= 3 ? 'text-amber-400' : 'text-zinc-400'
                        }`}
                      >
                        {expiresWhen(r.daysLeft)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="mb-4 font-semibold text-white">Gym Overview</h2>
            {[
              ['Active', count('Active'), 'text-emerald-400'],
              ['Inactive', count('Inactive'), 'text-zinc-300'],
              ['Expired', count('Expired'), 'text-red-400'],
            ].map(([label, value, cls]) => (
              <div
                key={label}
                className="flex justify-between border-t border-zinc-800 py-2 text-sm first:border-t-0"
              >
                <span className="text-zinc-400">{label} members</span>
                <span className={`font-semibold ${cls}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Dashboard