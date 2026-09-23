import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useAddMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newMember) => {
      const { data, error } = await supabase.from('members').insert(newMember)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })
}