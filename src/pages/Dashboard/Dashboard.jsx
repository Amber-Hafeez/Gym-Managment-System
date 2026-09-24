import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

function Dashboard() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('members')
        .select('id, full_name, plan, status, join_date, created_at')
        .order('created_at', { ascending: false })
      setMembers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const count = (s) => members.filter((m) => m.status === s).length

  const stats = [
    { label: 'Total Members', value: members.length, icon: '👥' },
    { label: 'Active Members', value: count('Active'), icon: '🔥' },
    { label: 'Trainers', value: '—', icon: '🏋️' },
    { label: 'Revenue', value: '—', icon: '💳' },
  ]

  return (
    <main className="p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-zinc-500 text-sm">Welcome to FITZONE</p>
        </div>
        <Link
          to="/members/new"
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
        >
          + Add Member
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xl">{s.icon}</div>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{s.value}</p>
            <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
            <h2 className="font-semibold">Recent Members</h2>
            <Link to="/members" className="text-sm text-emerald-400 hover:text-emerald-300">
              View All →
            </Link>
          </div>
          {loading ? (
            <p className="p-4 text-zinc-500 text-sm">Loading...</p>
          ) : members.length === 0 ? (
            <p className="p-4 text-zinc-500 text-sm">No members yet.</p>
          ) : (
            <ul>
              {members.slice(0, 5).map((m) => (
                <li
                  key={m.id}
                  className="flex justify-between items-center px-4 py-3 border-t border-zinc-800 first:border-t-0"
                >
                  <div>
                    <p className="text-sm font-medium">{m.full_name}</p>
                    <p className="text-xs text-zinc-500">{m.plan || '—'} · {m.join_date}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      m.status === 'Active'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : m.status === 'Expired'
                        ? 'bg-red-500/15 text-red-400'
                        : 'bg-zinc-700/50 text-zinc-300'
                    }`}
                  >
                    {m.status || 'Active'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h2 className="font-semibold mb-4">Gym Overview</h2>
          {[
            ['Active', count('Active'), 'text-emerald-400'],
            ['Inactive', count('Inactive'), 'text-zinc-300'],
            ['Expired', count('Expired'), 'text-red-400'],
          ].map(([label, value, cls]) => (
            <div key={label} className="flex justify-between py-2 border-t border-zinc-800 first:border-t-0 text-sm">
              <span className="text-zinc-400">{label} members</span>
              <span className={`font-semibold ${cls}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Dashboard