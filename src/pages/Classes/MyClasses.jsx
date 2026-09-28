import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

function MyClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('classes')
        .select('*, class_bookings(id, status, members(full_name))')
        .eq('trainer_id', user.id)

      if (error) setError(error.message)
      setClasses(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-extrabold mb-1">🧘 My Classes</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Classes assigned to you and the members booked in them.
      </p>

      {loading && <p className="text-zinc-400 text-sm">Loading...</p>}

      {error && (
        <p className="text-sm bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-4">
          ❌ {error}
        </p>
      )}

      {!loading && !error && classes.length === 0 && (
        <p className="text-sm bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-400">
          No classes are assigned to you yet.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {classes.map((c) => {
          const bookings = c.class_bookings || []
          const booked = bookings.filter((b) => b.status === 'booked')
          const waitlist = bookings.filter((b) => b.status === 'waitlisted')

          return (
            <div
              key={c.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3"
            >
              <div>
                <h3 className="font-bold text-lg">{c.name}</h3>
                <p className="text-sm text-zinc-400">
                  🗓️ {c.day_of_week} · ⏰ {c.start_time?.slice(0, 5)}
                </p>
              </div>

              <div className="flex justify-between text-xs text-zinc-400">
                <span>
                  Seats: <b className="text-white">{booked.length}/{c.capacity}</b>
                </span>
                <span>Waitlist: {waitlist.length}</span>
              </div>

              <div>
                <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Booked members</p>
                {booked.length === 0 ? (
                  <p className="text-xs text-zinc-500">No bookings yet.</p>
                ) : (
                  <ul className="text-sm space-y-1">
                    {booked.map((b) => (
                      <li key={b.id}>👤 {b.members?.full_name || 'Member'}</li>
                    ))}
                  </ul>
                )}
              </div>

              {waitlist.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-amber-400 mb-1">⏳ Waitlist</p>
                  <ul className="text-sm space-y-1">
                    {waitlist.map((b) => (
                      <li key={b.id}>👤 {b.members?.full_name || 'Member'}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyClasses