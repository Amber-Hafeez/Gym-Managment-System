import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const today = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

function statusOf(mp) {
  if (mp.status === 'Cancelled') return 'Cancelled'
  return mp.end_date < today() ? 'Expired' : 'Active'
}

const inputCls =
  'w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
const labelCls = 'block text-xs font-medium text-zinc-400 mb-1.5'

function AssignPlan({ memberId }) {
  const [plans, setPlans] = useState([])
  const [history, setHistory] = useState([])
  const [planId, setPlanId] = useState('')
  const [startDate, setStartDate] = useState(today())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = async () => {
    const [p, h] = await Promise.all([
      supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('duration_days', { ascending: true }),
      supabase
        .from('member_plans')
        .select('*, plans(name, duration_days, price)')
        .eq('member_id', memberId)
        .order('start_date', { ascending: false }),
    ])
    if (p.error || h.error) {
      setError((p.error || h.error).message)
    } else {
      setPlans(p.data || [])
      setHistory(h.data || [])
      setPlanId((cur) => cur || p.data?.[0]?.id || '')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [memberId])

  const selected = plans.find((p) => p.id === planId)
  const endDate =
    selected && startDate ? addDays(startDate, selected.duration_days) : ''

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!selected) return setError('Please choose a plan.')
    setSaving(true)
    setError('')
    setSuccess('')

    const { error } = await supabase.from('member_plans').insert([
      {
        member_id: memberId,
        plan_id: selected.id,
        start_date: startDate,
        end_date: endDate,
        status: 'Active',
      },
    ])
    if (error) {
      setSaving(false)
      return setError(error.message)
    }

    // keep the members list in sync with the newest plan
    await supabase
      .from('members')
      .update({ plan: selected.name, status: 'Active' })
      .eq('id', memberId)

    setSaving(false)
    setSuccess(`${selected.name} plan assigned until ${endDate}.`)
    load()
  }

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mt-6">
      <h2 className="text-lg font-semibold text-white mb-4">Assign Plan</h2>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : (
        <>
          <form onSubmit={handleAssign} className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Plan</label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className={inputCls}
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Rs. {Number(p.price).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Expiry Date (auto)</label>
              <input
                type="date"
                value={endDate}
                readOnly
                className={`${inputCls} opacity-70 cursor-not-allowed`}
              />
            </div>

            <div className="sm:col-span-3 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving || !selected}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black px-4 py-2 rounded-lg text-sm font-semibold"
              >
                {saving ? 'Assigning...' : 'Assign Plan'}
              </button>
              {success && <p className="text-sm text-emerald-400">{success}</p>}
              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
          </form>

          <h3 className="text-sm font-semibold text-zinc-300 mt-6 mb-2">Plan History</h3>
          {history.length === 0 ? (
            <p className="text-zinc-500 text-sm">No plans assigned yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead className="text-zinc-500 text-left">
                  <tr>
                    <th className="py-2 pr-4">Plan</th>
                    <th className="py-2 pr-4">Start</th>
                    <th className="py-2 pr-4">Expiry</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => {
                    const s = statusOf(h)
                    return (
                      <tr key={h.id} className="border-t border-zinc-800">
                        <td className="py-2 pr-4 text-white">{h.plans?.name || '—'}</td>
                        <td className="py-2 pr-4 text-zinc-400">{h.start_date}</td>
                        <td className="py-2 pr-4 text-zinc-400">{h.end_date}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              s === 'Active'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : s === 'Expired'
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-zinc-700/50 text-zinc-300'
                            }`}
                          >
                            {s}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default AssignPlan