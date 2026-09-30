import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export const isoDate = (d = new Date()) => d.toISOString().slice(0, 10)

export const shiftDays = (dateStr, n) => {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// Stat cards + summary donut + expired list
export function useAttendanceOverview(date) {
  return useQuery({
    queryKey: ['attendance', 'overview', date],
    queryFn: async () => {
      const countFor = async (d) => {
        const { count, error } = await supabase
          .from('attendance')
          .select('id', { count: 'exact', head: true })
          .eq('check_in_date', d)
        if (error) throw error
        return count ?? 0
      }
      const [totalToday, totalYesterday] = await Promise.all([
        countFor(date),
        countFor(shiftDays(date, -1)),
      ])

      const { data: plans, error } = await supabase
        .from('member_plans')
        .select('member_id, start_date, end_date, members(full_name, phone)')
      if (error) throw error

      const latest = {}
      plans.forEach((p) => {
        if (!latest[p.member_id] || p.end_date > latest[p.member_id].end_date) {
          latest[p.member_id] = p
        }
      })
      const latestList = Object.values(latest)
      const active = latestList.filter((p) => p.end_date >= date)
      const expired = latestList.filter((p) => p.end_date < date)

      const monthAgo = shiftDays(date, -30)
      const activeLastMonth = new Set(
        plans
          .filter((p) => p.start_date <= monthAgo && p.end_date >= monthAgo)
          .map((p) => p.member_id)
      ).size

      return {
        totalToday,
        totalYesterday,
        activeCount: active.length,
        activeLastMonth,
        expired: expired.map((p) => ({
          id: p.member_id,
          name: p.members?.full_name,
          phone: p.members?.phone,
          endDate: p.end_date,
        })),
      }
    },
  })
}

// Check-ins of the selected date, with plan name
export function useCheckInsForDate(date) {
  return useQuery({
    queryKey: ['attendance', 'list', date],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from('attendance')
        .select('id, member_id, checked_in_at, members(full_name, phone)')
        .eq('check_in_date', date)
        .order('checked_in_at', { ascending: false })
      if (error) throw error

      const ids = [...new Set(rows.map((r) => r.member_id))]
      const planMap = {}
      if (ids.length) {
        const { data: mp } = await supabase
          .from('member_plans')
          .select('member_id, end_date, plans(name)')
          .in('member_id', ids)
        ;(mp || []).forEach((p) => {
          if (!planMap[p.member_id] || p.end_date > planMap[p.member_id].end_date) {
            planMap[p.member_id] = p
          }
        })
      }
      return rows.map((r) => ({
        ...r,
        planName: planMap[r.member_id]?.plans?.name || '-',
      }))
    },
  })
}

// Selected member's latest plan (plan name + expiry)
export function useMemberPlan(memberId) {
  return useQuery({
    queryKey: ['member-plan', memberId],
    enabled: !!memberId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_plans')
        .select('start_date, end_date, plans(name)')
        .eq('member_id', memberId)
        .order('end_date', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data
    },
  })
}

// ---------- Classes for the selected date (finds the date/day column automatically) ----------
const DATE_KEYS = [
  'class_date', 'date', 'scheduled_date', 'session_date', 'start_date',
  'scheduled_at', 'starts_at', 'start_at', 'start_time',
]

const classDate = (c) => {
  for (const k of DATE_KEYS) {
    const v = c[k]
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) {
      return v.length > 10 && v.includes('T') ? isoDate(new Date(v)) : v.slice(0, 10)
    }
  }
  return null
}

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

const classOnDate = (c, date) => {
  const d = classDate(c)
  if (d) return d === date
  const dow = c.day_of_week ?? c.day ?? c.weekday
  if (dow === undefined || dow === null) return false
  const target = new Date(date + 'T00:00:00').getDay()
  if (typeof dow === 'number') return dow === target || dow % 7 === target
  return String(dow).toLowerCase().slice(0, 3) === WEEKDAYS[target]
}

const timeOf = (v) => {
  if (!v) return ''
  const s = String(v)
  return s.includes('T') ? new Date(s).toTimeString().slice(0, 8) : s.slice(0, 8)
}

export function useTodayClasses(date) {
  return useQuery({
    queryKey: ['attendance', 'classes', date],
    queryFn: async () => {
      let res = await supabase.from('classes').select('*, class_bookings(count)')
      if (res.error) {
        res = await supabase.from('classes').select('*')
      }
      if (res.error) return { classes: [], ongoing: 0, error: res.error.message }

      const classes = (res.data || [])
        .filter((c) => classOnDate(c, date))
        .sort((a, b) => timeOf(a.start_time).localeCompare(timeOf(b.start_time)))

      const now = new Date().toTimeString().slice(0, 8)
      const ongoing =
        date === isoDate()
          ? classes.filter((c) => {
              const s = timeOf(c.start_time)
              const e = timeOf(c.end_time)
              return s && e && s <= now && e >= now
            }).length
          : 0

      return { classes, ongoing, error: null }
    },
  })
}

// Streak Tracker (days in a row with at least one check-in)
export function useGymStreak() {
  return useQuery({
    queryKey: ['attendance', 'streak'],
    queryFn: async () => {
      const today = isoDate()
      const { data, error } = await supabase
        .from('attendance')
        .select('check_in_date')
        .gte('check_in_date', shiftDays(today, -60))
      if (error) throw error

      const set = new Set(data.map((r) => r.check_in_date))
      let cursor = set.has(today) ? today : shiftDays(today, -1)
      let streak = 0
      while (set.has(cursor)) {
        streak++
        cursor = shiftDays(cursor, -1)
      }
      const days = Array.from({ length: 6 }, (_, i) => {
        const d = shiftDays(today, i - 5)
        return { date: d, has: set.has(d), isToday: d === today, label: Number(d.slice(8)) }
      })
      return { streak, days }
    },
  })
}