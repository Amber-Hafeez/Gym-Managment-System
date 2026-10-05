import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { addDays, daysRemaining, todayISO } from '../utils/paymentHelpers'

export const expiresWhen = (d) => (d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`)

// Members whose latest plan ends within the next `days` days (including today)
export function useFeeReminders(days = 3) {
  return useQuery({
    queryKey: ['fee-reminders', days],
    queryFn: async () => {
      const [mp, mem, pl] = await Promise.all([
        supabase.from('member_plans').select('member_id, plan_id, end_date'),
        supabase.from('members').select('id, full_name, phone, status'),
        supabase.from('plans').select('id, name'),
      ])
      if (mp.error) throw mp.error
      if (mem.error) throw mem.error
      if (pl.error) throw pl.error

      const latest = {}
      for (const r of mp.data ?? []) {
        if (!r.end_date) continue
        const cur = latest[r.member_id]
        if (!cur || String(r.end_date) > String(cur.end_date)) latest[r.member_id] = r
      }

      const today = todayISO()
      const limit = addDays(today, days)
      const members = Object.fromEntries((mem.data ?? []).map((m) => [m.id, m]))
      const plans = Object.fromEntries((pl.data ?? []).map((p) => [p.id, p]))

      return Object.values(latest)
        .map((r) => ({
          memberId: r.member_id,
          name: members[r.member_id]?.full_name ?? '',
          status: members[r.member_id]?.status,
          planName: plans[r.plan_id]?.name ?? 'membership',
          endDate: String(r.end_date).slice(0, 10),
          daysLeft: daysRemaining(r.end_date),
        }))
        .filter((r) => r.name && r.status !== 'Inactive' && r.endDate >= today && r.endDate <= limit)
        .sort((a, b) => a.daysLeft - b.daysLeft)
    },
  })
}