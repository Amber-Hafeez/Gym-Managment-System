import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useTrainers() {
  return useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('role', 'Trainer')
      if (error) throw error
      return data
    },
  })
}

export function useCreateTrainer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ full_name, email, password, phone }) => {
      const { data, error } = await supabase.rpc('create_trainer', {
        trainer_name: full_name,
        trainer_email: email,
        trainer_password: password,
        trainer_phone: phone,
      })
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trainers'] }),
  })
}

export function useUpdateTrainer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, full_name, phone }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name, phone })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trainers'] }),
  })
}

export function useDeleteTrainer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (trainerId) => {
      const { error } = await supabase.rpc('delete_trainer', { trainer_id: trainerId })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trainers'] }),
  })
}