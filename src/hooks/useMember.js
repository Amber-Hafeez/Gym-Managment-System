import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useMember(id) {
  return useQuery({
    queryKey: ['members', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}