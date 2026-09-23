import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddMember } from '../../hooks/useAddMember'

function AddMember() {
  const navigate = useNavigate()
  const addMember = useAddMember()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [joinDate, setJoinDate] = useState(new Date().toISOString().slice(0, 10))

  function handleSubmit(e) {
    e.preventDefault()
    addMember.mutate(
      { full_name: fullName, phone, join_date: joinDate },
      { onSuccess: () => navigate('/members') }
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-xl font-bold text-white mb-6">Add Member</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Join Date</label>
            <input
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {addMember.isError && (
            <p className="text-sm text-red-400 bg-red-950 border border-red-900 px-3 py-2 rounded-lg">
              {addMember.error.message}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/members')}
              className="flex-1 border border-zinc-700 text-zinc-300 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addMember.isPending}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {addMember.isPending ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMember