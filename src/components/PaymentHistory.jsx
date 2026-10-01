import { usePayments } from '../hooks/usePayments';
import { formatDate, formatPKR, getMemberName } from '../utils/paymentHelpers';

export default function PaymentHistory({ memberId = null, limit = 50, title = 'Payment History' }) {
  const { data: payments = [], isLoading, error } = usePayments({ memberId, limit });
  const showMember = !memberId;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>

      {isLoading && <p className="text-sm text-zinc-400">Loading payments...</p>}
      {error && <p className="text-sm text-red-400">{error.message}</p>}
      {!isLoading && !error && payments.length === 0 && (
        <p className="text-sm text-zinc-400">No payments recorded yet.</p>
      )}

      {payments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="py-2 pr-4 font-medium">Date</th>
                {showMember && <th className="py-2 pr-4 font-medium">Member</th>}
                <th className="py-2 pr-4 font-medium">Plan</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Method</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-zinc-800/60 text-zinc-200">
                  <td className="whitespace-nowrap py-2 pr-4">{formatDate(p.payment_date)}</td>
                  {showMember && <td className="whitespace-nowrap py-2 pr-4">{getMemberName(p.members)}</td>}
                  <td className="whitespace-nowrap py-2 pr-4">{p.plans?.name ?? '—'}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        p.type === 'renewal'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-zinc-700/50 text-zinc-300'
                      }`}
                    >
                      {p.type === 'renewal' ? 'Renewal' : 'Payment'}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{p.method}</td>
                  <td className="whitespace-nowrap py-2 text-right font-medium text-emerald-400">
                    {formatPKR(p.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}