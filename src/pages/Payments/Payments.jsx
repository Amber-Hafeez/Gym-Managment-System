import { useMemo, useState } from 'react';
import { usePaymentMembers, usePaymentStats } from '../../hooks/usePayments';
import { formatPKR, getMemberName } from '../../utils/paymentHelpers';
import RecordPaymentForm from './RecordPaymentForm';
import PaymentHistory from '../../components/PaymentHistory';

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-emerald-400">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

export default function Payments() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const { data: members = [], isLoading } = usePaymentMembers();
  const { data: stats } = usePaymentStats();

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return members
      .filter(
        (m) =>
          getMemberName(m).toLowerCase().includes(q) ||
          String(m.phone ?? '').toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [members, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-sm text-zinc-400">Mark payments received and renew memberships.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="This Month's Revenue"
          value={formatPKR(stats?.monthRevenue)}
          hint={`Cash ${formatPKR(stats?.cash)} • Card ${formatPKR(stats?.card)}`}
        />
        <StatCard label="Today's Collection" value={formatPKR(stats?.todayRevenue)} />
        <StatCard label="Payments This Month" value={stats?.monthCount ?? 0} />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <label className="mb-2 block text-sm font-medium text-zinc-300">Search member (name or phone)</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isLoading ? 'Loading members...' : 'Type to search...'}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
        />
        {search.trim() && results.length === 0 && (
          <p className="mt-2 text-sm text-zinc-400">No member found.</p>
        )}
        {results.length > 0 && (
          <ul className="mt-2 divide-y divide-zinc-800 rounded-lg border border-zinc-800">
            {results.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => { setSelected(m); setSearch(''); }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-white hover:bg-zinc-800"
                >
                  <span>{getMemberName(m)}</span>
                  <span className="text-zinc-400">{m.phone ?? ''}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected ? (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <RecordPaymentForm key={selected.id} member={selected} />
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-2 text-sm text-zinc-400 hover:text-white"
            >
              ← Choose another member
            </button>
          </div>
          <div className="lg:col-span-3">
            <PaymentHistory memberId={selected.id} title={`${getMemberName(selected)} — Payment History`} />
          </div>
        </div>
      ) : (
        <PaymentHistory title="Recent Payments" limit={30} />
      )}
    </div>
  );
}