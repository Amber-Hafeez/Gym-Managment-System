import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useTrainerCount() {
  return useQuery({
    queryKey: ['trainer-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'trainer')
      if (error) throw error
      return count ?? 0
    },
  })
}