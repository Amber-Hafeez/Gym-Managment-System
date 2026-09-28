import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabaseClient'

function ClassBooking() {
  const [members, setMembers] = useState([])
  const [memberId, setMemberId] = useState('')
  const [classes, setClasses] = useState([])
  const [bookings, setBookings] = useState([])
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    const { data: c } = await supabase
      .from('classes')
      .select('*')
      .order('day_of_week')
      .order('start_time')
    const { data: b } = await supabase.from('class_bookings').select('*')
    setClasses(c || [])
    setBookings(b || [])
  }, [])

  useEffect(() => {
    supabase
      .from('members')
      .select('id, full_name')
      .order('full_name')
      .then(({ data }) => setMembers(data || []))

    load()

    // Live seat count (Supabase Realtime)
    const channel = supabase
      .channel('class-bookings-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'class_bookings' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, load)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const seatsTaken = (id) =>
    bookings.filter((b) => b.class_id === id && b.status === 'booked').length
  const waitCount = (id) =>
    bookings.filter((b) => b.class_id === id && b.status === 'waitlisted').length
  const myBooking = (id) =>
    bookings.find((b) => b.class_id === id && b.member_id === memberId)

  const book = async (classId) => {
    if (!memberId) return setMsg('⚠️ Please select a member first.')
    const { data, error } = await supabase.rpc('book_class', {
      p_class_id: classId,
      p_member_id: memberId,
    })
    setMsg(
      error
        ? `❌ ${error.message}`
        : data === 'booked'
        ? '✅ Booked successfully!'
        : '⏳ Class is full — member added to the waitlist.'
    )
  }

  const cancel = async (bookingId) => {
    await supabase.from('class_bookings').delete().eq('id', bookingId)
    setMsg('Booking cancelled.')
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-extrabold mb-1">🎟️ Class Booking</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Pick a member, then book them into a class. Full classes go to the waitlist.
      </p>

      <select
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="w-full md:w-80 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
      >
        <option value="">— Select member —</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.full_name}
          </option>
        ))}
      </select>

      {msg && (
        <p className="mt-4 text-sm bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
          {msg}
        </p>
      )}

      <div className="grid gap-4 mt-6 sm:grid-cols-2 xl:grid-cols-3">
        {classes.length === 0 && (
          <p className="text-zinc-500 text-sm">No classes yet. Create one in Classes first.</p>
        )}

        {classes.map((c) => {
          const taken = seatsTaken(c.id)
          const full = taken >= c.capacity
          const mine = myBooking(c.id)

          return (
            <div
              key={c.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  <p className="text-xs text-zinc-500">🏋️ {c.trainer_name}</p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                    full
                      ? 'bg-red-500/15 text-red-400'
                      : 'bg-emerald-500/15 text-emerald-400'
                  }`}
                >
                  {full ? 'FULL' : 'OPEN'}
                </span>
              </div>

              <p className="text-sm text-zinc-400">
                🗓️ {c.day_of_week} · ⏰ {c.start_time.slice(0, 5)}
              </p>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>
                    Seats: <b className="text-white">{taken}/{c.capacity}</b>
                  </span>
                  <span>Waitlist: {waitCount(c.id)}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${full ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min((taken / c.capacity) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {mine ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-400 capitalize">
                    Status: {mine.status}
                  </span>
                  <button
                    onClick={() => cancel(mine.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => book(c.id)}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                    full
                      ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                      : 'bg-emerald-500 text-black hover:bg-emerald-400'
                  }`}
                >
                  {full ? '⏳ Join Waitlist' : '✅ Book Seat'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ClassBooking