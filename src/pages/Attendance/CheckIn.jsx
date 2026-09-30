import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarCheck, Users, Ban, CalendarDays, Search, ScanLine, Clock,
  UserPlus, FileText, Download, AlertCircle, ArrowRight,
  ArrowUp, ArrowDown, Check, X, ChevronDown, Flame,
} from 'lucide-react'
import { useMemberSearch, useCheckIn, checkInErrorMessage } from '../../hooks/useAttendance'
import {
  isoDate, useAttendanceOverview, useCheckInsForDate, useMemberPlan,
  useTodayClasses, useGymStreak,
} from '../../hooks/useAttendanceDashboard'

const pct = (cur, prev) => (prev === 0 ? null : Math.round(((cur - prev) / prev) * 100))

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

const TONES = {
  emerald: { card: 'border-emerald-500/30 bg-emerald-950/40', icon: 'bg-emerald-500 text-white' },
  violet: { card: 'border-violet-500/30 bg-violet-950/40', icon: 'bg-violet-500/30 text-violet-300' },
  red: { card: 'border-red-500/30 bg-red-950/40', icon: 'bg-red-500/30 text-red-300' },
  blue: { card: 'border-blue-500/30 bg-blue-950/40', icon: 'bg-blue-500/30 text-blue-300' },
}

function StatCard({ icon: Icon, label, value, delta, sub, tone }) {
  const t = TONES[tone]
  return (
    <div className={`flex items-center gap-4 rounded-xl border p-4 ${t.card}`}>
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${t.icon}`}>
        <Icon size={26} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-zinc-200">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white">{value}</p>
          {delta !== null && delta !== undefined && (
            <span className={`flex items-center text-xs ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {delta >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-400">{sub}</p>
      </div>
      <div className="ml-auto hidden h-12 w-px bg-white/10 sm:block" />
    </div>
  )
}

function Avatar({ name, size = 'h-10 w-10' }) {
  const initials = (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold text-zinc-200`}>
      {initials}
    </div>
  )
}

function Donut({ value, total }) {
  const r = 52
  const c = 2 * Math.PI * r
  const frac = total > 0 ? Math.min(value / total, 1) : 0
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="9" className="stroke-zinc-800" />
        <circle
          cx="60" cy="60" r={r} fill="none" strokeWidth="9" strokeLinecap="round"
          className="stroke-emerald-500" strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xl font-bold text-white">
          {value}<span className="text-zinc-400">/{total}</span>
        </p>
        <p className="text-xs text-zinc-400">Members</p>
      </div>
    </div>
  )
}

function LegendRow({ color, label, value }) {
  return (
    <div className="flex items-center justify-between gap-6 text-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-zinc-200">{label}</span>
      </div>
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}

function ActionRow({ icon: Icon, label, onClick, last }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 py-3 text-left hover:bg-zinc-800/40 ${
        last ? '' : 'border-b border-zinc-800'
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
        <Icon size={18} />
      </div>
      <span className="text-sm text-white">{label}</span>
    </button>
  )
}

export default function CheckIn() {
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const logRef = useRef(null)

  const [date, setDate] = useState(isoDate())
  const [tab, setTab] = useState('member')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [showExpired, setShowExpired] = useState(false)

  const isToday = date === isoDate()

  const { data: results = [], isFetching } = useMemberSearch(selected ? '' : search)
  const { data: overview } = useAttendanceOverview(date)
  const { data: log = [] } = useCheckInsForDate(date)
  const { data: plan } = useMemberPlan(selected?.id)
  const { data: classInfo } = useTodayClasses(date)
  const { data: streakInfo } = useGymStreak()
  const checkIn = useCheckIn()

  const totalToday = overview?.totalToday ?? 0
  const activeCount = overview?.activeCount ?? 0
  const expired = overview?.expired ?? []
  const notCheckedIn = Math.max(activeCount - totalToday, 0)
  const planActive = plan && plan.end_date >= isoDate()
  const streak = streakInfo?.streak ?? 0

  function onSearchChange(value) {
    setSearch(value)
    setSelected(null)
    setResult(null)
  }

  function selectMember(m) {
    setSelected(m)
    setSearch(m.full_name)
    setResult(null)
  }

  function handleCheckIn() {
    if (!selected) {
      searchRef.current?.focus()
      return
    }
    setResult(null)
    checkIn.mutate(selected.id, {
      onSuccess: () => setResult({ type: 'success', name: selected.full_name, time: new Date() }),
      onError: (err) =>
        setResult({ type: 'error', message: checkInErrorMessage(err, selected.full_name) }),
    })
  }

  function markManual() {
    setTab('member')
    setTimeout(() => searchRef.current?.focus(), 50)
  }

  function exportCsv() {
    const rows = [
      ['Member', 'Phone', 'Plan', 'Check-in Time', 'Status'],
      ...log.map((r) => [r.members?.full_name, r.members?.phone, r.planName, fmtTime(r.checked_in_at), 'Checked In']),
    ]
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-${date}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <CalendarCheck size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Attendance / Check-ins</h1>
            <p className="text-sm text-zinc-400">
              Track member check-ins and class attendance. Members with expired memberships will be blocked automatically.
            </p>
          </div>
        </div>
        <div className="relative flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white">
          <CalendarDays size={18} className="text-zinc-400" />
          {dateLabel}
          <ChevronDown size={16} className="ml-4 text-zinc-400" />
          <input
            type="date"
            value={date}
            max={isoDate()}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users} tone="emerald" label={isToday ? 'Total Check-ins Today' : 'Total Check-ins'}
          value={totalToday} delta={pct(totalToday, overview?.totalYesterday ?? 0)} sub="vs. yesterday"
        />
        <StatCard
          icon={Users} tone="violet" label="Active Members" value={activeCount}
          delta={pct(activeCount, overview?.activeLastMonth ?? 0)} sub="vs. last month"
        />
        <StatCard icon={Ban} tone="red" label="Blocked (Expired Plan)" value={expired.length} sub="need renewal" />
        <StatCard
          icon={CalendarDays} tone="blue" label="Today's Classes"
          value={classInfo?.classes?.length ?? 0} sub={`${classInfo?.ongoing ?? 0} ongoing`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          {/* Check-in panel */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 p-4">
              <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-1">
                {[['member', 'Member Check-in'], ['class', 'Class Attendance']].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`rounded-md px-5 py-2 text-sm font-medium ${
                      tab === key ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {tab === 'member' ? (
              <div className="space-y-4 p-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Search member by name or phone..."
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                    />
                    {search.trim() && !selected && (
                      <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
                        {isFetching && results.length === 0 ? (
                          <p className="p-4 text-sm text-zinc-500">Searching...</p>
                        ) : results.length === 0 ? (
                          <p className="p-4 text-sm text-zinc-500">No member found.</p>
                        ) : (
                          results.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => selectMember(m)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800"
                            >
                              <Avatar name={m.full_name} size="h-8 w-8" />
                              <div>
                                <p className="text-sm font-medium text-white">{m.full_name}</p>
                                <p className="text-xs text-zinc-400">{m.phone}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleCheckIn}
                    disabled={checkIn.isPending || !isToday}
                    className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
                  >
                    <ScanLine size={18} />
                    {checkIn.isPending ? 'Checking...' : 'Check In'}
                  </button>
                </div>

                {!isToday && (
                  <p className="text-sm text-amber-400">
                    Check-in is only available for today. Pick today's date to check members in.
                  </p>
                )}

                <div
                  className={`grid overflow-hidden rounded-xl border md:grid-cols-2 ${
                    result?.type === 'success'
                      ? 'border-emerald-500/40 bg-emerald-950/30'
                      : result?.type === 'error'
                      ? 'border-red-500/40 bg-red-950/30'
                      : 'border-zinc-800 bg-zinc-950'
                  }`}
                >
                  {/* Member card */}
                  <div className="border-b border-zinc-800/60 p-5 md:border-b-0 md:border-r">
                    {selected ? (
                      <>
                        <div className="flex items-center gap-4">
                          <Avatar name={selected.full_name} size="h-14 w-14" />
                          <div>
                            <p className="text-lg font-semibold text-white">{selected.full_name}</p>
                            <p className="text-sm text-zinc-300">{selected.phone}</p>
                            {plan && (
                              <span
                                className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${
                                  planActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                {planActive ? 'Active Member' : 'Plan Expired'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-5 flex gap-10 text-sm">
                          <div>
                            <p className="text-zinc-500">Plan</p>
                            <p className="font-medium text-white">{plan?.plans?.name || 'No plan'}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500">Expires</p>
                            <p className="font-medium text-white">{plan?.end_date || '-'}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="py-6 text-sm text-zinc-500">
                        Search and select a member to see their plan details.
                      </p>
                    )}
                  </div>

                  {/* Result panel */}
                  <div className="flex flex-col items-center justify-center p-5 text-center">
                    {result?.type === 'success' ? (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <Check size={30} />
                        </div>
                        <p className="mt-3 text-lg font-bold text-white">Check-in Successful!</p>
                        <p className="text-sm text-zinc-300">{result.name} has been checked in for today</p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {result.time.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })},{' '}
                          {result.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                      </>
                    ) : result?.type === 'error' ? (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white">
                          <X size={30} />
                        </div>
                        <p className="mt-3 text-lg font-bold text-white">Check-in Blocked</p>
                        <p className="text-sm text-red-200">{result.message}</p>
                      </>
                    ) : (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
                          <ScanLine size={28} />
                        </div>
                        <p className="mt-3 text-sm text-zinc-500">
                          Select a member and click Check In.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {classInfo?.error && (
                  <p className="text-sm text-amber-400">
                    Could not load classes: {classInfo.error}
                  </p>
                )}
                {classInfo?.classes?.length === 0 && !classInfo?.error && (
                  <p className="text-sm text-zinc-500">No classes scheduled for this date.</p>
                )}
                {classInfo?.classes?.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                    <div>
                      <p className="font-medium text-white">{c.title || c.name || 'Class'}</p>
                      <p className="text-sm text-zinc-400">
                        {c.start_time ? String(c.start_time).slice(0, 5) : ''}
                        {c.end_time ? ` - ${String(c.end_time).slice(0, 5)}` : ''}
                      </p>
                    </div>
                    <span className="rounded bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                      {c.class_bookings?.[0]?.count ?? 0} booked
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reck-inscent che */}
          <div ref={logRef} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-zinc-400" />
                <h2 className="text-lg font-semibold text-white">Recent Check-ins</h2>
              </div>
              <button
                onClick={() => setShowAll((v) => !v)}
                className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300"
              >
                {showAll ? 'Show Less' : 'View All'} <ArrowRight size={14} />
              </button>
            </div>

            {log.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-500">No check-ins for this date.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="bg-zinc-950/60 text-zinc-400">
                      <th className="px-3 py-2 font-medium">Member Name</th>
                      <th className="px-3 py-2 font-medium">Plan</th>
                      <th className="px-3 py-2 font-medium">Check-in Time</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {(showAll ? log : log.slice(0, 5)).map((r) => (
                      <tr key={r.id}>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={r.members?.full_name} size="h-9 w-9" />
                            <div>
                              <p className="font-medium text-white">{r.members?.full_name}</p>
                              <p className="text-xs text-zinc-400">{r.members?.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-zinc-200">{r.planName}</td>
                        <td className="px-3 py-3 text-zinc-200">{fmtTime(r.checked_in_at)}</td>
                        <td className="px-3 py-3">
                          <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs text-emerald-300">
                            Checked In
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Check-in summary */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-5 flex items-center gap-3">
              <CalendarCheck size={20} className="text-zinc-400" />
              <h2 className="text-lg font-semibold text-white">
                {isToday ? "Today's Check-in Summary" : 'Check-in Summary'}
              </h2>
            </div>

            <div className="flex items-center gap-5">
              <Donut value={totalToday} total={activeCount} />
              <div className="flex-1 space-y-3">
                <LegendRow color="bg-emerald-500" label="Checked In" value={totalToday} />
                <LegendRow color="bg-zinc-500" label="Not Checked In" value={notCheckedIn} />
                <LegendRow color="bg-red-500" label="Blocked" value={expired.length} />
              </div>
            </div>

            {expired.length > 0 && (
              <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-400" />
                  <p className="text-sm text-amber-200">
                    {expired.length} members are blocked due to expired membership plans.
                    Renew their plans to allow check-ins.
                  </p>
                </div>
                <button
                  onClick={() => setShowExpired((v) => !v)}
                  className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/40 px-4 py-2 text-sm text-amber-100 hover:bg-amber-500/10"
                >
                  {showExpired ? 'Hide Expired Members' : 'View Expired Members'}
                  <ArrowRight size={14} />
                </button>

                {showExpired && (
                  <div className="mt-3 max-h-60 overflow-y-auto">
                    {expired.map((e, i) => {
                      const name = e.name ?? e.members?.full_name ?? e.full_name ?? 'Member'
                      const phone = e.phone ?? e.members?.phone ?? ''
                      return (
                        <div key={e.id ?? i} className="flex items-center gap-3 border-t border-amber-500/20 py-2">
                          <Avatar name={name} size="h-8 w-8" />
                          <div>
                            <p className="text-sm text-zinc-100">{name}</p>
                            {phone && <p className="text-xs text-zinc-400">{phone}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-3 flex items-center gap-3">
              <ScanLine size={20} className="text-zinc-400" />
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            </div>
            <ActionRow icon={UserPlus} label="Add Member" onClick={() => navigate('/members')} />
            <ActionRow icon={CalendarCheck} label="Mark Attendance (Manual)" onClick={markManual} />
            <ActionRow
              icon={FileText}
              label="View Attendance Logs"
              onClick={() => logRef.current?.scrollIntoView({ behavior: 'smooth' })}
            />
            <ActionRow icon={Download} label="Export Report" onClick={exportCsv} last />
          </div>

          {/* Streak tracker */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-orange-400" />
              <h2 className="text-lg font-semibold text-white">Streak Tracker</h2>
            </div>
            <p className="mt-3 text-sm text-white">
              {streak > 0 ? `Gym is on a ${streak} day streak!` : 'No streak yet. Check in a member to start one.'}
            </p>
            <p className="text-sm text-zinc-400">Keep it up!</p>
            <div className="mt-4 flex items-center justify-between">
              {(streakInfo?.days ?? []).map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <span
                    className={`h-5 w-5 rounded-full border-2 ${
                      d.has
                        ? 'border-emerald-500 bg-emerald-500'
                        : d.isToday
                        ? 'border-emerald-500 bg-transparent'
                        : 'border-zinc-700 bg-zinc-800'
                    }`}
                  />
                  <span className="text-xs text-zinc-500">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}