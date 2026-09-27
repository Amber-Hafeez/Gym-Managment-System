import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*, profiles(full_name)')
        .order('day_of_week');
      if (error) throw error;
      return data;
    },
  });
}

export function useMyClasses(trainerId) {
  return useQuery({
    queryKey: ['my-classes', trainerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('trainer_id', trainerId)
        .eq('status', 'active');
      if (error) throw error;
      return data;
    },
    enabled: !!trainerId,
  });
}

export function useSaveClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cls) => {
      const { id, ...rest } = cls;
      const { error } = id
        ? await supabase.from('classes').update(rest).eq('id', id)
        : await supabase.from('classes').insert(rest);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }),
  });
}

export function useCancelClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('classes')
        .update({ status: 'cancelled' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }),
  });
}