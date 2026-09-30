import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { isoDate } from './useAttendanceDashboard'

// Search members by name or phone
export function useMemberSearch(term) {
  const q = (term || '').trim()

  return useQuery({
    queryKey: ['member-search', q],
    enabled: q.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, phone')
        .or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`)
        .limit(8)

      if (error) throw error

      return data || []
    },
  })
}

// Check in a member
export function useCheckIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (memberId) => {
      if (!memberId) {
        throw new Error('Please select a member first.')
      }

      const { data, error } = await supabase.rpc('check_in_member', {
        p_member_id: memberId,
      })

      if (error) {
        console.error('Check-in error:', error)
        throw error
      }

      return data
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['attendance'] }),
        queryClient.invalidateQueries({ queryKey: ['member-search'] }),
      ])
    },
  })
}

// Friendly error messages
export function checkInErrorMessage(err, name = 'Member') {
  const msg = (err?.message || '').toLowerCase()

  if (
    msg.includes('expired') ||
    msg.includes('no active') ||
    msg.includes('no plan')
  ) {
    return `${name}'s membership has expired. Please renew the membership.`
  }

  if (msg.includes('already')) {
    return `${name} is already checked in today.`
  }

  if (
    msg.includes('blocked') ||
    msg.includes('not allowed') ||
    msg.includes('permission')
  ) {
    return `Check-in is blocked. Please verify the member's membership status and database permissions.`
  }

  return err?.message || 'Check-in failed. Please try again.'
}

// Today's check-in count
export function useTodayCheckInCount() {
  return useQuery({
    queryKey: ['attendance', 'today-count'],

    queryFn: async () => {
      const { count, error } = await supabase
        .from('attendance')
        .select('id', { count: 'exact', head: true })
        .eq('check_in_date', isoDate())

      if (error) throw error

      return count ?? 0
    },
  })
}

// Member attendance history
export function useMemberAttendance(memberId) {
  return useQuery({
    queryKey: ['attendance', 'member', memberId],
    enabled: !!memberId,

    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('id, member_id, check_in_date, checked_in_at')
        .eq('member_id', memberId)
        .order('checked_in_at', { ascending: false })

      if (error) throw error

      return data || []
    },
  })
}

// Calculate consecutive attendance days
export function calculateStreak(records = []) {
  const toDay = (record) => {
    const value =
      typeof record === 'string'
        ? record
        : record?.check_in_date || record?.checked_in_at

    return value ? String(value).slice(0, 10) : null
  }

  const days = new Set(records.map(toDay).filter(Boolean))

  const formatDate = (date) => date.toISOString().slice(0, 10)

  const cursor = new Date()
  cursor.setUTCHours(0, 0, 0, 0)

  if (!days.has(formatDate(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  let streak = 0

  while (days.has(formatDate(cursor))) {
    streak++
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  return streak
}