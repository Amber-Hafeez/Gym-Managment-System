import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useMember } from "../../hooks/useMember"
import { useDeleteMember } from "../../hooks/useDeleteMember"
import AssignPlan from './AssignPlan'

function MemberProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: member, isLoading, isError, error } = useMember(id)
  const deleteMember = useDeleteMember()
  const [confirming, setConfirming] = useState(false)

  function handleDelete() {
    deleteMember.mutate(id, {
      onSuccess: () => navigate('/members'),
    })
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-zinc-900 border-b border-zinc-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Member Profile</h1>
        <Link to="/members" className="text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition">
          Back to Members
        </Link>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        {isLoading ? (
          <p className="text-zinc-500 text-sm">Loading...</p>
        ) : isError ? (
          <p className="text-red-400 text-sm">Error: {error.message}</p>
        ) : (
          <>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-white mb-4">{member.full_name}</h2>
              <div className="space-y-2 text-sm">
                <p className="text-zinc-400">Phone: <span className="text-white">{member.phone || '-'}</span></p>
                <p className="text-zinc-400">Join Date: <span className="text-white">{member.join_date}</span></p>
              </div>

              <div className="mt-6 flex gap-2">
                <button onClick={() => navigate('/members/' + id + '/edit')} className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-sm font-semibold">
                  Edit Member
                </button>

                {!confirming ? (
                  <button onClick={() => setConfirming(true)} className="bg-red-950 border border-red-900 text-red-400 hover:bg-red-900 px-4 py-2 rounded-lg text-sm font-semibold">
                    Delete Member
                  </button>
                ) : (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-zinc-400">Are you sure?</span>
                    <button onClick={handleDelete} disabled={deleteMember.isPending} className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                      {deleteMember.isPending ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    <button onClick={() => setConfirming(false)} className="border border-zinc-700 text-zinc-300 px-3 py-2 rounded-lg text-sm hover:bg-zinc-800">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {deleteMember.isError && (
                <p className="mt-3 text-sm text-red-400 bg-red-950 border border-red-900 px-3 py-2 rounded-lg">
                  {deleteMember.error.message}
                </p>
              )}
            </div>

            <AssignPlan memberId={id} />
          </>
        )}
      </main>
    </div>
  )
}

export default MemberProfile