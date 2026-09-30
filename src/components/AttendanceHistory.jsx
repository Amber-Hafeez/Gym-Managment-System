import { useMemberAttendance, calculateStreak } from '../hooks/useAttendance'

export default function AttendanceHistory({ memberId }) {
  const { data: rows = [], isLoading } = useMemberAttendance(memberId)
  const streak = calculateStreak(rows)

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Attendance</h3>
        {streak > 0 && (
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/40 px-3 py-1 text-sm text-emerald-300">
            {streak}-day streak 🔥
          </span>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-500">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-zinc-500">No check-ins yet.</p>
      ) : (
        <>
          <p className="text-sm text-zinc-400 mb-2">Total visits: {rows.length}</p>
          <ul className="max-h-64 overflow-y-auto divide-y divide-zinc-800">
            {rows.map((r) => (
              <li key={r.id} className="flex justify-between py-2 text-sm">
                <span className="text-white">
                  {new Date(r.check_in_date + 'T00:00:00').toLocaleDateString(
                    undefined,
                    { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
                  )}
                </span>
                <span className="text-zinc-400">
                  {new Date(r.checked_in_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}