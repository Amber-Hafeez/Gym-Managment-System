import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// Used by the admin Plans page
export function usePlans() {
  return useQuery({
    queryKey: ['plans-full'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('duration_days', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

// Saves changes made in the Edit Plan form
export function useUpdatePlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('plans')
        .update(values)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}

// Used by the public landing page (no login needed)
export function usePublicPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('duration_days', { ascending: true })

      if (cancelled) return
      if (!error && data) {
        setPlans(data.filter((p) => p.is_active !== false))
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { plans, loading }
}