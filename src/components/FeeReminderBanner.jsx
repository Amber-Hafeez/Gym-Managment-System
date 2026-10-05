import { Link } from 'react-router-dom'
import { useFeeReminders, expiresWhen } from '../hooks/useFeeReminders'

export default function FeeReminderBanner() {
  const { data: reminders = [] } = useFeeReminders(3)
  if (reminders.length === 0) return null

  return (
    <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-amber-300">
          🔔 Fee reminder: {reminders.length} membership{reminders.length > 1 ? 's' : ''} expiring within 3 days
        </p>
        <Link
          to="/payments"
          className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400"
        >
          Renew now
        </Link>
      </div>
      <ul className="mt-3 space-y-2">
        {reminders.slice(0, 5).map((r) => (
          <li key={r.memberId}>
            <Link
              to={'/members/' + r.memberId}
              className="flex items-center justify-between gap-2 rounded-lg bg-black/30 px-3 py-2 text-sm hover:bg-black/50"
            >
              <span className="truncate text-white">{r.name}</span>
              <span className="shrink-0 text-amber-300">
                {r.planName} · expires {expiresWhen(r.daysLeft)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {reminders.length > 5 && (
        <p className="mt-2 text-xs text-zinc-400">+ {reminders.length - 5} more</p>
      )}
    </div>
  )
}