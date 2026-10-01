import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { todayISO } from '../utils/paymentHelpers';

export function usePaymentMembers() {
  return useQuery({
    queryKey: ['payment-members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('members').select('*');
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePaymentPlans() {
  return useQuery({
    queryKey: ['payment-plans'],
    queryFn: async () => {
      const { data, error } = await supabase.from('plans').select('*');
      if (error) throw error;
      return (data ?? []).sort((a, b) => Number(a.duration_days) - Number(b.duration_days));
    },
  });
}

export function useMemberCurrentPlan(memberId) {
  return useQuery({
    queryKey: ['member-current-plan', memberId],
    enabled: !!memberId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_plans')
        .select('*')
        .eq('member_id', memberId)
        .order('end_date', { ascending: false })
        .limit(1);
      if (error) throw error;
      return data?.[0] ?? null;
    },
  });
}

export function usePayments({ memberId = null, limit = 50 } = {}) {
  return useQuery({
    queryKey: ['payments', memberId ?? 'all', limit],
    queryFn: async () => {
      let q = supabase
        .from('payments')
        .select('*, members(*), plans(*)')
        .order('payment_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);
      if (memberId) q = q.eq('member_id', memberId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: ['payment-stats'],
    queryFn: async () => {
      const today = todayISO();
      const monthStart = today.slice(0, 7) + '-01';
      const { data, error } = await supabase
        .from('payments')
        .select('amount, method, payment_date')
        .gte('payment_date', monthStart);
      if (error) throw error;
      const rows = data ?? [];
      const sum = (a) => a.reduce((s, r) => s + Number(r.amount || 0), 0);
      return {
        monthRevenue: sum(rows),
        todayRevenue: sum(rows.filter((r) => r.payment_date === today)),
        monthCount: rows.length,
        cash: sum(rows.filter((r) => r.method === 'Cash')),
        card: sum(rows.filter((r) => r.method === 'Card')),
      };
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ memberId, planId, amount, method, date, notes, renew, renewFrom }) => {
      const { data, error } = await supabase.rpc('record_payment', {
        p_member_id: memberId,
        p_plan_id: planId,
        p_amount: amount,
        p_method: method,
        p_payment_date: date,
        p_notes: notes || null,
        p_renew: renew,
        p_renew_from: renewFrom,
        p_today: todayISO(),
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}