const pad = (n) => String(n).padStart(2, '0')

export function toLocalDate(value) {
  if (!value) return null
  const s = String(value)
  if (s.length === 10) return s
  const d = new Date(s)
  if (isNaN(d)) return null
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function shift(iso, n) {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export function getAttendanceDate(row) {
  return toLocalDate(
    row.check_in_date ??
      row.attendance_date ??
      row.date ??
      row.checked_in_at ??
      row.check_in_time ??
      row.created_at
  )
}

// Counts consecutive days with a check-in.
// The streak stays alive if the member checked in yesterday but not yet today.
export function calculateStreak(rows, todayIso) {
  const days = Array.from(new Set((rows || []).map(getAttendanceDate).filter(Boolean))).sort()
  if (days.length === 0) {
    return { current: 0, longest: 0, checkedInToday: false, lastVisit: null }
  }

  const set = new Set(days)

  let longest = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    if (days[i] === shift(days[i - 1], 1)) {
      run++
      if (run > longest) longest = run
    } else {
      run = 1
    }
  }

  const checkedInToday = set.has(todayIso)
  let cursor = checkedInToday ? todayIso : shift(todayIso, -1)
  let current = 0
  while (set.has(cursor)) {
    current++
    cursor = shift(cursor, -1)
  }

  return { current, longest, checkedInToday, lastVisit: days[days.length - 1] }
}