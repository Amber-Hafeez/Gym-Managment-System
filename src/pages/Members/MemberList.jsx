import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMembers } from '../../hooks/useMembers'

function MemberList() {
  
  const [search, setSearch] = useState('')
  const { data: members, isLoading, isError, error } = useMembers()

  const filtered = (members || []).filter(
    (m) =>
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (m.phone && m.phone.includes(search))
  )

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-zinc-900 border-b border-zinc-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Members</h1>
        <Link
          to="/dashboard"
          className="text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition"
        >
          ← Dashboard
        </Link>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4 gap-3">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Link
            to="/members/new"
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            + Add Member
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow overflow-hidden">
          {isLoading ? (
            <p className="p-6 text-zinc-500 text-sm">Loading members...</p>
          ) : isError ? (
            <p className="p-6 text-red-400 text-sm">Error: {error.message}</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-zinc-500 text-sm">No members found.</p>
          ) : (
           <table className="w-full text-sm">
  <thead className="bg-zinc-800 text-zinc-400 text-left">
    <tr>
      <th className="px-4 py-3">Name</th>
      <th className="px-4 py-3">Phone</th>
      <th className="px-4 py-3">Plan</th>
      <th className="px-4 py-3">Joined</th>
      <th className="px-4 py-3">Status</th>
      <th className="px-4 py-3 text-right">Action</th>
    </tr>
  </thead>
  <tbody>
    {filtered.map((m) => (
      <tr key={m.id} className="border-t border-zinc-800 hover:bg-zinc-800">
        <td className="px-4 py-3 font-medium text-white">{m.full_name}</td>
        <td className="px-4 py-3 text-zinc-400">{m.phone || '—'}</td>
        <td className="px-4 py-3 text-zinc-400">{m.plan || '—'}</td>
        <td className="px-4 py-3 text-zinc-400">{m.join_date}</td>
        <td className="px-4 py-3">
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
        </td>
        <td className="px-4 py-3 text-right">
          <Link
            to={`/members/${m.id}/edit`}
            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
          >
            Edit
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>
          )}
        </div>
      </main>
    </div>
  )
}

export default MemberList