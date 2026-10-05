import { useMemberStreak } from '../hooks/useStreak'

export default function StreakBadge({ memberId }) {
  const { data, isLoading } = useMemberStreak(memberId)

  if (isLoading) return <p className="mt-4 text-sm text-zinc-500">Loading streak...</p>

  const current = data?.current ?? 0
  const longest = data?.longest ?? 0

  let hint = 'Check in today to start a new streak'
  if (current > 0) {
    hint = data.checkedInToday
      ? 'Checked in today — keep it going!'
      : 'Check in today to keep the streak alive'
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3">
      <span className="text-3xl">{current > 0 ? '🔥' : '💤'}</span>
      <div>
        <p className="text-lg font-bold text-orange-300">
          {current > 0 ? `${current}-day streak` : 'No active streak'}
        </p>
        <p className="text-xs text-zinc-400">{hint}</p>
      </div>
      <div className="ml-auto text-right">
        <p className="text-xs text-zinc-400">Best streak</p>
        <p className="text-sm font-semibold text-white">
          {longest} day{longest === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  )
}