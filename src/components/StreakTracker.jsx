import { Flame } from 'lucide-react'
import { useGymStreak } from '../hooks/useAttendanceDashboard'

export default function StreakTracker() {
  const { data } = useGymStreak()
  const streak = data?.streak ?? 0
  const days = data?.days ?? []

  return (
    <div className="m-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Flame size={18} className="text-orange-500" />
        Streak Tracker
      </div>
      <p className="mt-2 text-sm text-white">
        {streak > 0 ? `You're on a ${streak} day streak!` : 'Start your streak today!'}
      </p>
      <p className="text-xs text-zinc-400">Keep it up!</p>
      <div className="mt-3 flex justify-between">
        {days.map((d) => (
          <div key={d.date} className="flex flex-col items-center gap-1">
            <span
              className={`h-4 w-4 rounded-full ${
                d.has ? 'bg-emerald-500' : d.isToday ? 'border-2 border-emerald-500' : 'bg-zinc-800'
              }`}
            />
            <span className="text-[10px] text-zinc-500">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}