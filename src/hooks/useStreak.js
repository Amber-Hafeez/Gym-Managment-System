import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { calculateStreak } from '../utils/calculateStreak'
import { todayISO } from '../utils/paymentHelpers'

export function useMemberStreak(memberId) {
  return useQuery({
    queryKey: ['member-streak', memberId],
    enabled: !!memberId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('member_id', memberId)
      if (error) throw error
      return calculateStreak(data ?? [], todayISO())
    },
  })
}