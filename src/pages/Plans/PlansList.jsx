import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

function PlansList() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('duration_days', { ascending: true })
      if (error) setError(error.message)
      else setPlans(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <main className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Plans</h1>
        <p className="text-zinc-500 text-sm">Membership packages offered by FITZONE</p>
      </div>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading plans...</p>
      ) : error ? (
        <p className="text-red-400 text-sm">Error: {error}</p>
      ) : plans.length === 0 ? (
        <p className="text-zinc-500 text-sm">No plans found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-white">{p.name}</h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    p.is_active
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-zinc-700/50 text-zinc-300'
                  }`}
                >
                  {p.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-3xl font-bold text-emerald-400 mt-4">
                Rs. {Number(p.price).toLocaleString()}
              </p>
              <p className="text-zinc-400 text-sm mt-1">{p.duration_days} days</p>
              <p className="text-zinc-500 text-xs mt-3">{p.description || '—'}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default PlansList