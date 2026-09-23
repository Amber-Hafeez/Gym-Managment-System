import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'

function Dashboard() {
  const { user, role } = useAuth()

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-zinc-900 border-b border-zinc-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Gym Management Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">
            {user?.email}{' '}
            <span className="uppercase text-xs bg-emerald-500 text-black font-semibold px-2 py-0.5 rounded ml-1">
              {role}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Members', value: '—' },
            { label: 'Expiring Soon', value: '—' },
            { label: "Today's Check-ins", value: '—' },
            { label: 'Monthly Revenue', value: '—' },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-zinc-900 border border-zinc-800 rounded-xl shadow p-5"
            >
              <p className="text-sm text-zinc-500">{card.label}</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl shadow p-6 flex items-center justify-between flex-wrap gap-3">
          <Link to="/members" className="text-emerald-400 font-medium hover:underline">
            View Members →
          </Link>
          <Link
            to="/members/new"
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Add Member
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Dashboard