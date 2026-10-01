import { useState, useEffect } from 'react';
import { useMemberCurrentPlan, usePaymentPlans, useRecordPayment } from '../../hooks/usePayments';
import {
  addDays, daysRemaining, formatDate, formatPKR, getMemberName,
  getPlanDuration, maxDate, todayISO,
} from '../../utils/paymentHelpers';

const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500';

export default function RecordPaymentForm({ member }) {
  const { data: plans = [] } = usePaymentPlans();
  const { data: currentPlan } = useMemberCurrentPlan(member.id);
  const record = useRecordPayment();

  const [planId, setPlanId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [date, setDate] = useState(todayISO());
  const [notes, setNotes] = useState('');
  const [renewFrom, setRenewFrom] = useState('expiry');
  const [msg, setMsg] = useState(null);

  // Pre-select the member's current plan once it loads
  useEffect(() => {
    if (planId || !plans.length || !currentPlan?.plan_id) return;
    const p = plans.find((x) => x.id === currentPlan.plan_id);
    if (p) {
      setPlanId(p.id);
      setAmount(String(p.price));
    }
  }, [plans, currentPlan, planId]);

  const selectedPlan = plans.find((p) => p.id === planId);
  const currentPlanInfo = currentPlan ? plans.find((p) => p.id === currentPlan.plan_id) : null;
  const currentEnd = currentPlan?.end_date ? String(currentPlan.end_date).slice(0, 10) : null;
  const remaining = daysRemaining(currentEnd);

  const today = todayISO();
  const base = currentEnd && renewFrom === 'expiry' ? maxDate(currentEnd, today) : today;
  const newEnd = selectedPlan ? addDays(base, getPlanDuration(selectedPlan)) : null;

  const handlePlanChange = (e) => {
    const id = e.target.value;
    setPlanId(id);
    const p = plans.find((x) => x.id === id);
    if (p) setAmount(String(p.price));
  };

  const submit = (renew) => {
    setMsg(null);
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setMsg({ type: 'error', text: 'Enter a valid amount greater than 0.' });
      return;
    }
    if (renew && !planId) {
      setMsg({ type: 'error', text: 'Select a plan to renew.' });
      return;
    }
    record.mutate(
      { memberId: member.id, planId: planId || null, amount: amt, method, date, notes, renew, renewFrom },
      {
        onSuccess: (res) => {
          setNotes('');
          setMsg({
            type: 'success',
            text: renew
              ? `Plan renewed. New expiry: ${formatDate(res?.new_end_date)}`
              : 'Payment recorded successfully.',
          });
        },
        onError: (e) => setMsg({ type: 'error', text: e.message }),
      }
    );
  };

  let statusText = 'No plan assigned yet';
  let statusClass = 'text-zinc-400';
  if (remaining !== null) {
    if (remaining < 0) {
      statusText = `Expired ${Math.abs(remaining)} day(s) ago`;
      statusClass = 'text-red-400';
    } else if (remaining <= 3) {
      statusText = `${remaining} day(s) remaining`;
      statusClass = 'text-amber-400';
    } else {
      statusText = `${remaining} days remaining`;
      statusClass = 'text-emerald-400';
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-lg font-semibold text-white">{getMemberName(member)}</h3>
      <p className="mb-3 text-sm text-zinc-400">{member.phone ?? ''}</p>

      <div className="mb-4 rounded-lg bg-zinc-800/60 p-3 text-sm">
        <p className="text-zinc-300">
          Current plan: <span className="font-medium text-white">{currentPlanInfo?.name ?? '—'}</span>
        </p>
        <p className="text-zinc-300">
          Expiry: <span className="font-medium text-white">{formatDate(currentEnd)}</span>
        </p>
        <p className={`font-medium ${statusClass}`}>{statusText}</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-zinc-400">Plan</label>
          <select className={inputClass} value={planId} onChange={handlePlanChange}>
            <option value="">Select plan</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatPKR(p.price)} / {p.duration_days} days
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Amount (Rs.)</label>
            <input
              type="number" min="1" className={inputClass} value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Method</label>
            <select className={inputClass} value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Payment date</label>
            <input
              type="date" max={todayISO()} className={inputClass} value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Renew from</label>
            <select className={inputClass} value={renewFrom} onChange={(e) => setRenewFrom(e.target.value)}>
              <option value="expiry">Current expiry</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-400">Notes (optional)</label>
          <input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {newEnd && (
          <p className="text-sm text-zinc-300">
            If renewed, new expiry: <span className="font-semibold text-emerald-400">{formatDate(newEnd)}</span>
          </p>
        )}

        {msg && (
          <p className={`rounded-lg px-3 py-2 text-sm ${
            msg.type === 'success' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
          }`}>
            {msg.text}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button" disabled={record.isPending} onClick={() => submit(true)}
            className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {record.isPending ? 'Saving...' : 'Renew Plan'}
          </button>
          <button
            type="button" disabled={record.isPending} onClick={() => submit(false)}
            className="flex-1 rounded-lg border border-zinc-600 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            Mark Payment Received
          </button>
        </div>
      </div>
    </div>
  );
}