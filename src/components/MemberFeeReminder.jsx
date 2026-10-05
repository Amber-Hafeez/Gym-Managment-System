import { Link } from 'react-router-dom'
import { useFeeReminders, expiresWhen } from '../hooks/useFeeReminders'
import { formatDate } from '../utils/paymentHelpers'

export default function MemberFeeReminder({ memberId }) {
  const { data: reminders = [] } = useFeeReminders(3)
  const r = reminders.find((x) => x.memberId === memberId)
  if (!r) return null

  const firstName = (r.name || '').split(' ')[0]

  return (
    <div className="mb-4 rounded-2xl border border-amber-500/30 bg-zinc-900 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">🔔 Fee reminder</p>
      <div className="mt-2 max-w-md rounded-2xl rounded-tl-sm bg-emerald-900/40 px-4 py-3 text-sm text-emerald-50">
        Hi {firstName}! 👋 Your {r.planName} membership at FITZONE expires {expiresWhen(r.daysLeft)} (
        {formatDate(r.endDate)}). Renew now to keep training without a break! 💪
      </div>
      <Link
        to="/payments"
        className="mt-3 inline-block rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400"
      >
        Renew now
      </Link>
    </div>
  )
}